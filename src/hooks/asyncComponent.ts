import ErrorComponent from "@/components/ErrorComponent.vue";
import LoadingComponent from "@/components/LoadingComponent.vue";
import { useDropComponent } from "@/hooks/dropComponent";

const { setSpotStyle } = useDropComponent();

const modules = import.meta.glob(`../pages/drop-components/**/*.vue`);

function loadAsyncDropComponent(path: string, cb: Function = () => {}) {
  const AsyncComp = defineAsyncComponent({
    // 加载函数
    loader: () => {
      if (!path) {
        return Promise.reject("路径名称不能为空");
      }
      const asyncComp = modules[`../pages/drop-components/${path}.vue`]();
      asyncComp.finally(() => {
        nextTick(() => {
          setSpotStyle();
        });
        cb && cb();
      });
      return asyncComp as any;
    },

    // 加载异步组件时使用的组件
    loadingComponent: LoadingComponent,
    // 展示加载组件前的延迟时间，默认为 200ms
    delay: 200,
    // 加载失败后展示的组件
    errorComponent: ErrorComponent,
    // 如果提供了一个 timeout 时间限制，并超时了
    // 也会显示这里配置的报错组件，默认值是：Infinity
    timeout: 3000,
  });
  return AsyncComp;
}

export function useAsyncDropComponent() {
  return { loadAsyncDropComponent };
}

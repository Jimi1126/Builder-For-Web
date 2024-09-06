import { createAlova } from "alova";
// @ts-ignore
import GlobalFetch from "alova/GlobalFetch";
import VueHook from "alova/vue";

export const defaultAlova = createAlova({
  // 假设我们需要与这个域名的服务器交互
  baseURL: "/rest",

  // 在vue项目下引入VueHook，它可以帮我们用vue的ref函数创建请求相关的，可以被alova管理的状态
  statesHook: VueHook,

  // 请求适配器，这里我们使用fetch请求适配器
  requestAdapter: GlobalFetch(),

  // 设置全局的请求拦截器，与axios相似
  beforeRequest(method) {
    if (!method.config.headers["Content-Type"]) {
      if (typeof method.config.data == "string") {
        method.config.headers["Content-Type"] =
          "application/x-www-form-urlencoded";
      } else {
        method.config.headers["Content-Type"] =
          "application/json;charset=UTF-8";
      }
    }
  },

  // 使用数组的两个项，分别指定请求成功的拦截器和请求失败的拦截器
  responded: {
    // 请求成功的拦截器
    // 当使用GlobalFetch请求适配器时，第一个参数接收Response对象
    // 第二个参数为当前请求的method实例，你可以用它同步请求前后的配置信息
    onSuccess: async (response) => {
      if (response.status >= 400) {
        throw new Error(response.statusText);
      }
      if (response.headers.get("content-type") === "application/pdf") {
        const url = window.URL.createObjectURL(await response.blob());
        const link = document.createElement("a");
        link.style.display = "none";
        link.href = url;
        link.setAttribute(
          "download",
          "我的简历.pdf"
          //@ts-ignore
          // decodeURIComponent(response.headers.get("content-disposition")).match(
          //   /filename=(.*\.pdf)/
          // )[1]
        ); // 文件名
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link); // 下载完成移除元素
        window.URL.revokeObjectURL(url); // 释放掉blob对象
        return Promise.resolve("成功");
      }
      const json = await response.json();
      if (json.code) {
        // 抛出错误或返回reject状态的Promise实例时，此请求将抛出错误
        throw new Error(json.message);
      }

      // 解析的响应数据将传给method实例的transformData钩子函数，这些函数将在后续讲解
      return json.data;
    },

    // 请求失败的拦截器
    // 请求错误时将会进入该拦截器。
    // 第二个参数为当前请求的method实例，你可以用它同步请求前后的配置信息
    onError: (err) => {
      alert(err.message);
    },
  },
  // 缓存时间
  // @ts-ignore
  localCache: -1,
  // 请求超时时间，单位为毫秒，默认为0，表示永不超时
  timeout: 50000,
});

<template>
  <section
    id="sheet"
    class="sheet"
    ref="draggableEl"
    :class="{
      'is-preview': isPreview,
    }"
    :style="getSheetStyle()"
    @dragover.prevent
    @dragenter.prevent
    @drop="dropHandler"
  >
    <div
      ref="resumeComponentWrapList"
      class="shape"
      v-for="it in workshopStore.snapshot.dropComponents"
      :key="it.id"
    >
      <component
        :is="components[it.code as keyof typeof components] || it.code"
        :id="it.id"
        :class="{ active: activeDropc && it.id == activeDropc.id }"
        v-bind="it.attrs"
        :is-preview="isPreview"
        :style="getComponentStyle(it)"
        :events="it.events || []"
        :config="it.config || {}"
        @click.prevent
      ></component>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useDropComponent } from "@/hooks/dropComponent";
import useMyDraggable from "@/hooks/myDraggable";
import { useSheet } from "@/hooks/sheet";
import { useWorkshopStore } from "@/stores/workshop";
import * as components from "@/pages/drop-components/resume";

const props = defineProps(["isPreview"]);

const workshopStore = useWorkshopStore();

const { getSheetStyle, dropHandler } = useSheet();

const { getComponentStyle, activeDropc } = useDropComponent();

const { draggableEl, pause } = useMyDraggable(
  workshopStore.snapshot.dropComponents
);

if (props.isPreview) pause();

const resumeComponentWrapList = ref<HTMLDivElement[]>();
function breakPage() {
  // aspectRatio = "210 / 297";
  const length = resumeComponentWrapList.value?.length;
  if (!length) return;
  const pageHeight = 1160;
  let contentHeight = pageHeight - 20; // 第一页留下边距 20px
  // 计算总页数
  let totalHeight = 0;

  resumeComponentWrapList.value?.forEach((el, i) => {
    el.removeAttribute("style");
    el.classList.remove("break-node");
    const { height } = el.getBoundingClientRect();
    totalHeight += height;
    const paddingBottom = contentHeight - (totalHeight - height) + "px";
    // 当前节点高度加起来超过内容最大高度时，从前当前节点分页
    if (totalHeight > contentHeight) {
      el.style.paddingTop = "20px";
      totalHeight = height;
      contentHeight = pageHeight - 40; // 从第二页开始留上下边距 40px
      /* 给上一个节点添加分页符 */
      const prevEl = resumeComponentWrapList.value![i - 1];
      if (prevEl) {
        prevEl.classList.add("break-node");
        prevEl.style.paddingBottom = paddingBottom;
        prevEl.style.marginBottom = "20px";
      }
      if (i == length - 1)
        el.style.paddingBottom = contentHeight - height + "px";
    } else {
      if (i == length - 1) el.style.paddingBottom = paddingBottom;
    }
  });
}

onMounted(() => {
  props.isPreview && breakPage();
});
</script>

<style lang="scss" scoped>
.sheet {
  display: flex;
  width: 820px;
  flex-direction: column;
  background-color: #fff;
  padding-bottom: var(--resume-padding);

  div {
    white-space: pre-wrap;
    word-break: break-all;
  }

  &.is-preview {
    background-color: unset;
    padding-bottom: unset;
  }

  .shape {
    background-color: #fff;
  }

  @media print {
    font-weight: 400;

    .shape {
      padding-bottom: unset !important;
    }

    .break-node {
      page-break-after: always;
      padding-bottom: unset !important;
      margin-bottom: unset !important;
    }
  }

  :deep(input),
  :deep(textarea) {
    width: 100%;
    height: fit-content;
    color: inherit;
    transition: padding 200ms;
    &:focus {
      padding: 0 6px;
    }
  }

  :deep(textarea) {
    resize: none;
    overflow: hidden;
  }
}
</style>

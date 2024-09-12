<template>
  <section
    id="sheet"
    class="sheet"
    ref="draggableEl"
    :class="{
      'grid-line': workshopStore.snapshot.gridLine,
    }"
    :style="getSheetStyle()"
    @dragover.prevent
    @dragenter.prevent
    @drop="dropHandler"
    @mousedown.self="sheetMouseDownHandler"
    @contextmenu.right.prevent="contextMenuHandler"
  >
    <div
      class="shape"
      v-for="it in workshopStore.snapshot.dropComponents"
      :key="it.id"
      @mousedown="shapeMouseDownHandler($event, it)"
    >
      <component
        :is="components[it.code] || it.code"
        :id="it.id"
        :class="{ active: activeDropc && it.id == activeDropc.id }"
        v-bind="it.attrs"
        :style="getComponentStyle(it)"
        :events="it.events || []"
        :config="it.config || {}"
        @click.prevent
      ></component>
    </div>
    <ContextMenu />
  </section>
</template>

<script setup lang="ts">
import { useAsyncDropComponent } from "@/hooks/asyncComponent";
import { useDropComponent } from "@/hooks/dropComponent";
import useMyDraggable from "@/hooks/myDraggable";
import { useSheet } from "@/hooks/sheet";
import ContextMenu from "@/pages/compoonents/ContextMenu.vue";
import { useWorkshopStore } from "@/stores/workshop";

const workshopStore = useWorkshopStore();

const {
  getSheetStyle,
  dropHandler,
  sheetMouseDownHandler,
  contextMenuHandler,
} = useSheet();

const { setSpotStyle, getComponentStyle, shapeMouseDownHandler, activeDropc } =
  useDropComponent();

const { components } = useAsyncDropComponent();

const { draggableEl } = useMyDraggable(workshopStore.snapshot.dropComponents);

onUpdated(() => {
  setSpotStyle();
});
</script>

<style lang="scss" scoped>
.sheet {
  display: flex;
  flex-direction: column;
  gap: var(--resume-component-gap);
  background-color: #fff;
  padding-bottom: var(--resume-padding);

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

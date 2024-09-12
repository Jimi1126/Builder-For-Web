<template>
  <section
    id="sheet"
    class="sheet"
    ref="sheetRef"
    :class="{
      'grid-line': workshopStore.snapshot.gridLine,
    }"
    :style="getSheetStyle()"
    @dragover.prevent
    @dragenter.prevent
    @dragstart.prevent
    @drop="dropHandler"
    @mousedown.self="sheetMouseDownHandler"
    @contextmenu.right.prevent="contextMenuHandler"
  >
    <span
      v-for="i in 8"
      :key="i"
      v-show="~workshopStore.activeIndex"
      class="spot"
      :style="workshopStore.spotStyles[i - 1]"
      @mousedown.stop.prevent="spotMouseDownHandler($event, i)"
    ></span>
    <div
      class="absolute-shape"
      v-for="it in workshopStore.snapshot.dropComponents"
      :key="it.id"
      @mousedown.stop="shapeMouseDownHandler($event, it)"
    >
      <component
        :is="components[it.code] || it.code"
        :key="it.id"
        v-bind="it.attrs"
        :style="getComponentStyle(it)"
        :events="it.events || []"
        :config="it.config || {}"
        class="drop-component"
        :class="{ active: activeDropc && it.id == activeDropc.id }"
        @click.prevent
        >示例</component
      >
    </div>
    <ContextMenu />
  </section>
</template>

<script setup lang="ts">
import { useAsyncDropComponent } from "@/hooks/asyncComponent";
import { useDropComponent } from "@/hooks/dropComponent";
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

const {
  setSpotStyle,
  getComponentStyle,
  shapeMouseDownHandler,
  spotMouseDownHandler,
  activeDropc,
} = useDropComponent();

const { components } = useAsyncDropComponent();

onUpdated(() => {
  setSpotStyle();
});
</script>

<style scoped></style>

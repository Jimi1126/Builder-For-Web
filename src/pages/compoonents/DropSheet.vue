<template>
  <main
    class="flex-1-1 overflow-auto pa-8"
    :class="{ resume: workshopStore.snapshot.mode == SHEET_MODE.RESUME }"
  >
    <section
      id="sheet"
      class="sheet"
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
      <template v-if="workshopStore.snapshot.mode == SHEET_MODE.RESUME">
        <div
          class="shape"
          v-for="it in workshopStore.snapshot.dropComponents"
          :key="it.id"
          @mousedown.stop="shapeMouseDownHandler($event, it)"
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
      </template>
      <template v-else-if="workshopStore.snapshot.mode == SHEET_MODE.FLOW">
      </template>
      <template v-else>
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
      </template>
      <ContextMenu v-show="workshopStore.contextMenu.visiable" />
    </section>
  </main>
</template>

<script lang="ts" setup>
import { useWorkshopStore } from "@/stores/workshop";
import { useSheet } from "@/hooks/sheet";
import { useDropComponent } from "@/hooks/dropComponent";
import ContextMenu from "@/pages/compoonents/ContextMenu.vue";
import { useAsyncDropComponent } from "@/hooks/asyncComponent";
import { SHEET_MODE } from "@/constant/enum";

const workshopStore = useWorkshopStore();
const activeDropc = computed(() => {
  return workshopStore.snapshot.dropComponents[workshopStore.activeIndex];
});

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
} = useDropComponent();

const { loadAsyncDropComponent } = useAsyncDropComponent();

const components = reactive({}) as any;
const asyncComponentCount = ref(0);
watchEffect(() => {
  workshopStore.snapshot.dropComponents.forEach((dc) => {
    if (dc.skip) {
      components[dc.code] = null;
    } else if (!components[dc.code]) {
      const paths = [];
      dc.path && paths.push(dc.path);
      paths.push(dc.code);
      if (!paths.length) return;
      components[dc.code] = loadAsyncDropComponent(paths.join("/"));
      asyncComponentCount.value++;
    }
  });
});

onUpdated(() => {
  setSpotStyle();
});
</script>

<style lang="scss" scoped>
.grid-line::before {
  content: " ";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to right, #d1d5db 1px, transparent 0),
    linear-gradient(to bottom, #d1d5db 1px, transparent 0);
  background-size: 10px 10px;
  z-index: -1;
}
.grid-line::after {
  content: " ";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to right, #9ca3af 1px, transparent 0),
    linear-gradient(to bottom, #9ca3af 1px, transparent 0);
  background-size: 30px 30px;
  z-index: -1;
}

.sheet {
  margin: auto;
  min-height: 100%;
  text-wrap: wrap;
  white-space: normal;
  word-break: break-all;
  z-index: 0;

  .spot {
    position: absolute;
    width: 8px;
    height: 8px;
    border: 2px solid #03a9f4;
    z-index: 99;
    &:nth-child(1),
    &:nth-child(8) {
      cursor: se-resize;
    }

    &:nth-child(2),
    &:nth-child(7) {
      cursor: row-resize;
    }

    &:nth-child(3),
    &:nth-child(6) {
      cursor: sw-resize;
    }

    &:nth-child(4),
    &:nth-child(5) {
      cursor: col-resize;
    }
  }

  .shape-absolute {
    width: 0;
    height: 0;

    &:hover {
      cursor: move;
    }
  }
}

.active {
  user-select: none;
  outline: rgb(112, 192, 255) solid 1px;
}

.resume {
  background-color: #9ca3af;

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
}
</style>

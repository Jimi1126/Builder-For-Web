<template>
  <main
    class="d-flex w-100 justify-center"
    :class="{
      resume: workshopStore.snapshot.mode == SHEET_MODE.RESUME,
    }"
  >
    <section
      id="sheet"
      :style="getSheetStyle()"
      style="width: 820px"
      class="sheet"
    >
      <template
        v-for="it in workshopStore.snapshot.dropComponents"
        :key="it.id"
      >
        <component
          class="component"
          :is="(components as any)[it.code] || it.code"
          v-bind="it.attrs"
          :preview="true"
          :style="getComponentStyle(it)"
          :events="it.events || []"
          :config="it.config || {}"
        />
      </template>
    </section>
  </main>
</template>

<script lang="ts" setup>
import { useDropComponent } from "@/hooks/dropComponent";
import { useAsyncDropComponent } from "@/hooks/asyncComponent";
import { useSheet } from "@/hooks/sheet";
import { useWorkshopStore } from "@/stores/workshop";
import { SHEET_MODE } from "@/constant/enum";
import { colorReverse } from "@/hooks/pureFun";

const workshopStore = useWorkshopStore();
const { getSheetStyle } = useSheet();
const { getComponentStyle } = useDropComponent();
const { components } = useAsyncDropComponent();

//@ts-ignore
window.loadConfig = function (config) {
  workshopStore.snapshot = config;
  document.documentElement.style.setProperty(
    "--theme-color",
    colorReverse(config.theme)
  );
  document.documentElement.style.setProperty("--theme-bg-color", config.theme);
  //@ts-ignore
  window.loadConfigState = "loaded";
};
</script>

<style lang="scss" scoped>
.sheet {
  text-wrap: wrap;
  white-space: normal;
  word-break: break-all;
  z-index: 0;
}

.resume {
  background-color: #9ca3af;

  .sheet {
    display: flex;
    flex-direction: column;
    gap: var(--resume-component-gap);
    background-color: #fff;

    :deep(input),
    :deep(textarea) {
      width: 100%;
      height: fit-content;
      color: inherit;
      pointer-events: none; /* 禁用鼠标事件 */
    }

    :deep(textarea) {
      resize: none;
      overflow: hidden;
    }
  }
}
</style>

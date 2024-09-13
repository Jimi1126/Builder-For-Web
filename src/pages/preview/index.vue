<template>
  <main
    class="d-flex w-100 justify-center"
    :class="{
      resume: workshopStore.snapshot.mode == SHEET_MODE.RESUME,
    }"
  >
    <ResumeSheet :is-preview="true" />
  </main>
</template>

<script lang="ts" setup>
import { useWorkshopStore } from "@/stores/workshop";
import { SHEET_MODE } from "@/constant/enum";
import ResumeSheet from "@/pages/compoonents/ResumeSheet.vue";

const workshopStore = useWorkshopStore();

function setTheme() {
  const snapshot = workshopStore.snapshot;
  document.documentElement.style.setProperty(
    "--theme-color",
    snapshot.reverseTheme
  );
  document.documentElement.style.setProperty(
    "--theme-bg-color",
    snapshot.theme
  );
}

onMounted(setTheme);

//@ts-ignore
window.loadConfig = function (config) {
  workshopStore.snapshot = config;
  setTheme();
  //@ts-ignore
  // window.loadConfigState = "loaded";
  nextTick(() => {
    //@ts-ignore
    window.loadConfigState = "updated";
  });
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
  width: 820px;
  margin: auto;
  background-color: #9ca3af;

  .sheet {
    display: flex;
    flex-direction: column;

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

@media print {
  .resume {
    background-color: #fff;
  }
}
</style>

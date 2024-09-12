<template>
  <main
    class="flex-1-1 overflow-auto pa-8"
    :class="{ resume: workshopStore.snapshot.mode == SHEET_MODE.RESUME }"
  >
    <ResumeSheet v-if="workshopStore.snapshot.mode == SHEET_MODE.RESUME" />
    <AbsoluteSheet v-if="workshopStore.snapshot.mode == SHEET_MODE.ABSOLUTE" />
  </main>
</template>

<script lang="ts" setup>
import { useWorkshopStore } from "@/stores/workshop";
import { SHEET_MODE } from "@/constant/enum";
import AbsoluteSheet from "@/pages/compoonents/AbsoluteSheet.vue";
import ResumeSheet from "@/pages/compoonents/ResumeSheet.vue";

const workshopStore = useWorkshopStore();
</script>

<style lang="scss">
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

.resume {
  background-color: #9ca3af;
}

.active {
  user-select: none;
  outline: rgb(112, 192, 255) solid 1px;
}
</style>

<template>
  <div class="w-100 h-100">
    <Toolbar />
    <main class="sheet-main d-flex justify-space-between">
      <DragSheet />
      <DropSheet />
      <AttrSheet />
    </main>
  </div>
</template>

<script lang="ts" setup>
import { Toolbar, DragSheet, DropSheet, AttrSheet } from "./compoonents/index";
</script>
<style lang="scss" scoped>
.sheet-main {
  height: calc(100vh - 64px);
}
</style>

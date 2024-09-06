<template>
  <v-card
    id="context-menu-card"
    v-show="workshopStore.contextMenu.visiable"
    style="position: absolute; width: 200px; z-index: 999"
    :style="workshopStore.contextMenu"
    @mousedown="inCard = true"
  >
    <v-list>
      <v-list-item v-show="actived" @click="copy">复制</v-list-item>
      <v-list-item @click="paste">粘贴</v-list-item>
      <v-list-item v-show="actived" @click="cut">剪切</v-list-item>
      <v-list-item v-show="actived" @click="del">删除</v-list-item>
      <v-list-item v-show="actived" @click="toUp">上移</v-list-item>
      <v-list-item v-show="actived" @click="toLow">下移</v-list-item>
      <v-list-item v-show="actived" @click="toTop">置顶</v-list-item>
      <v-list-item v-show="actived" @click="toBottm">置底</v-list-item>
    </v-list>
  </v-card>
</template>

<script lang="ts" setup>
import { useContextMenu } from "@/hooks/contextMenu";
import { useWorkshopStore } from "@/stores/workshop";

const workshopStore = useWorkshopStore();
const actived = computed(() => {
  return workshopStore.activeIndex > -1;
});
const inCard = ref(false);

const { copy, paste, cut, del, toUp, toLow, toTop, toBottm } = useContextMenu();

function listenMousedown() {
  if (inCard.value) {
    inCard.value = false;
  } else {
    workshopStore.contextMenu.visiable = false;
  }
}

onMounted(() => {
  document.addEventListener("mousedown", listenMousedown);
});
onUnmounted(() => {
  document.removeEventListener("mousedown", listenMousedown);
});
</script>

<style lang="scss"></style>

<template>
  <v-card class="h-100 flex-0-0" style="width: 240px">
    <v-tabs v-model="tab" align-tabs="center">
      <v-tab :value="1">通用组件</v-tab>
      <v-tab :value="2">业务组件</v-tab>
    </v-tabs>
    <v-window v-model="tab" style="height: calc(100% - 48px); overflow-y: auto">
      <v-window-item :value="1">
        <v-container>
          <v-row>
            <v-row>
              <v-col
                v-for="info in modeComponentInfos"
                :key="info.code"
                cols="12"
                @dragstart="dragstartEvt($event, info)"
              >
                <v-card
                  :prepend-icon="info.icon"
                  :title="info.label"
                  :subtitle="info.code"
                  draggable="true"
                ></v-card>
              </v-col>
            </v-row>
          </v-row>
        </v-container>
      </v-window-item>
    </v-window>
  </v-card>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import { componentInfos } from "@/pages/drop-components";
import { useWorkshopStore } from "@/stores/workshop";
import { createDraft } from "immer";

const workshopStore = useWorkshopStore();

const modeComponentInfos = computed(() => {
  return componentInfos[workshopStore.snapshot.mode];
});

const tab = ref(1);

function dragstartEvt(e: any, info: any) {
  const dragComponentInfo = createDraft(info);
  dragComponentInfo.id = new Date().getTime();
  workshopStore.dragComponentInfo = dragComponentInfo;
}
</script>

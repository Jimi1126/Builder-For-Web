<template>
  <v-card class="h-100 flex-0-0" style="width: 300px">
    <v-tabs v-model="tab" align-tabs="center">
      <v-tab :value="1">样式</v-tab>
      <v-tab :value="2">动画</v-tab>
      <v-tab :value="3">事件</v-tab>
    </v-tabs>
    <v-window v-model="tab" style="height: calc(100% - 48px); overflow-y: auto">
      <v-window-item :value="1">
        <v-container>
          <v-expansion-panels
            v-model="panels"
            color="primary"
            multiple
            variant="accordion"
          >
            <v-expansion-panel value="1" title="全局样式">
              <v-expansion-panel-text>
                <CustomForm
                  :form-data="workshopStore.snapshot.globalAttr"
                  :form-fields="workshopStore.globalFormFields"
                  @infocus="formFocusSheet"
                  @inblur="formBlurSheet"
                />
              </v-expansion-panel-text>
            </v-expansion-panel>
            <v-expansion-panel
              v-if="~workshopStore.activeIndex"
              value="2"
              title="组件信息"
            >
              <v-expansion-panel-text>
                <CustomForm
                  :form-data="activeDropc"
                  :form-fields="[
                    {
                      code: 'label',
                      label: '组件名称',
                      disabled: true,
                    },
                    {
                      code: 'code',
                      label: '组件编码',
                      disabled: true,
                    },
                  ]"
                />
              </v-expansion-panel-text>
            </v-expansion-panel>
            <v-expansion-panel
              v-if="~workshopStore.activeIndex"
              value="3"
              title="组件样式"
            >
              <v-expansion-panel-text>
                <CustomForm
                  :form-data="activeDropc.attrs.style"
                  :form-fields="formFields"
                  @infocus="formFocus"
                  @inblur="formBlur"
                />
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-container>
      </v-window-item>
    </v-window>
  </v-card>
</template>

<script lang="ts" setup>
import CustomForm from "@/pages/compoonents/CustomForm.vue";
import { useWorkshopStore } from "@/stores/workshop";
import type { DropCopmonent, FormField, SnapshotVariable } from "@/workshop";
import { useWorkshopImmer } from "@/hooks/immer";

const workshopStore = useWorkshopStore();
const { setSheetState } = useWorkshopImmer();

const tab = ref(1);
const panels = ref(["1"]);

watch(
  () => workshopStore.activeIndex,
  (nv, ov) => {
    if (nv == -1) {
      panels.value = ["1"];
    } else if (ov == -1) {
      panels.value = ["2", "3"];
    }
  }
);

const formFields: ComputedRef<FormField[]> = computed(() => {
  let result: FormField[] = [];
  if (activeDropc.value && activeDropc.value.attrs.style.getFormFields) {
    result = activeDropc.value.attrs.style.getFormFields();
  }
  return result;
});

const activeDropc: ComputedRef<DropCopmonent> = computed(() => {
  return workshopStore.snapshot.dropComponents[workshopStore.activeIndex] || {};
});

// function changeDisplay(nv: string) {
//   if (nv == "flex") {
//     formFields.forEach((f) => {
//       if (
//         ["flex-direction", "justify-content", "align-items"].includes(f.code)
//       ) {
//         f.hidden = false;
//       } else if (["textAlign", "verticalAlign"].includes(f.code)) {
//         f.hidden = true;
//       }
//     });
//   } else {
//     formFields.forEach((f) => {
//       if (
//         ["flex-direction", "justify-content", "align-items"].includes(f.code)
//       ) {
//         f.hidden = true;
//       } else if (["textAlign", "verticalAlign"].includes(f.code)) {
//         f.hidden = false;
//       }
//     });
//   }
// }

let temp: any;
let thatIndex: number;
function formFocus(code: string) {
  thatIndex = workshopStore.activeIndex;
  const storeStyle = workshopStore.snapshot.dropComponents[thatIndex].attrs
    .style as any;
  temp = storeStyle[code];
}
function formBlur(code: string) {
  if (temp !== undefined) {
    setSheetState((draft: SnapshotVariable) => {
      const storeStyle = workshopStore.snapshot.dropComponents[thatIndex].attrs
        .style as any;
      const afterValue = storeStyle[code];
      if (code == "display") {
        // changeDisplay(storeStyle[code]);
      }
      // 恢复状态
      storeStyle[code] = temp;
      // 使用immer记录快照
      const draftStyle = draft.dropComponents[thatIndex].attrs.style;
      (draftStyle as any)[code] = afterValue;
    });
  }
}

function formFocusSheet(code: string) {
  temp = (workshopStore.snapshot.globalAttr as any)[code];
}
function formBlurSheet(code: string) {
  if (temp !== undefined) {
    setSheetState((draft: SnapshotVariable) => {
      const store = workshopStore.snapshot.globalAttr as any;
      const afterValue = store[code];
      // 恢复状态
      store[code] = temp;
      // 使用immer记录快照
      (draft.globalAttr as any)[code] = afterValue;
    });
  }
}
</script>

<style lang="scss">
.main-aside {
  width: 300px !important;
  height: 100%;
}
div.v-expansion-panel-text__wrapper {
  padding: 24px 16px 0 16px;
}
</style>

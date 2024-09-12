<template>
  <v-toolbar color="primary" :elevation="2">
    <v-row>
      <v-col cols="9" class="toolbar-btn">
        <v-btn @click="showConfig(0)">全量配置</v-btn>
        <v-btn @click="showConfig(1)">组件配置</v-btn>
        <v-menu open-on-hover>
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props"> 导出 </v-btn>
          </template>
          <v-list>
            <v-list-item> 导出配置 </v-list-item>
            <v-list-item @click="downloadPDF()"> 导出PDF </v-list-item>
          </v-list>
        </v-menu>
        <v-btn>导入</v-btn>
        <v-btn @click="undo" :disabled="workshopStore.inverIndex <= -1"
          >撤销</v-btn
        >
        <v-btn
          @click="redo"
          :disabled="
            !workshopStore.changeCount ||
            workshopStore.inverIndex >= workshopStore.changeCount - 1
          "
          >重做</v-btn
        >
        <v-btn @click="uploadImg">插入图片</v-btn>
        <input
          type="file"
          name="uploadImg"
          id="uploadImg"
          hidden
          @change="uploadInputChange($event)"
        />
        <v-btn @click="clear">清空</v-btn>
        <!-- <v-btn>组合</v-btn>
        <v-btn>拆分</v-btn>
        <v-btn>锁定</v-btn>
        <v-btn>解锁</v-btn>
        <v-btn>保存</v-btn> -->
        <v-btn @click="$router.push('/preview')">预览</v-btn>
      </v-col>
      <v-col cols="3" class="toolbar-field">
        <v-select
          v-model="workshopStore.snapshot.mode"
          label="模式"
          :items="modeItems"
          item-title="label"
          item-value="value"
          variant="outlined"
          density="compact"
        ></v-select>
        <v-text-field
          v-model="workshopStore.snapshot.theme"
          label="主题"
          variant="outlined"
          density="compact"
        >
          <template #append-inner>
            <v-btn
              size="small"
              density="compact"
              icon="mdi-palette"
              :color="workshopStore.snapshot.theme"
              @click="
                () => {
                  themeVisiable = true;
                }
              "
            ></v-btn>
          </template>
        </v-text-field>
        <v-checkbox
          v-model="workshopStore.snapshot.gridLine"
          label="网格线"
          variant="outlined"
          density="compact"
        ></v-checkbox>
      </v-col>
    </v-row>
  </v-toolbar>
  <v-dialog v-model="themeVisiable" width="auto">
    <template v-slot:default>
      <v-card prepend-icon="mdi-update" title="颜色选择">
        <template v-slot:text>
          <v-color-picker
            class="w-100"
            :modes="['hexa']"
            show-swatches
            v-model="workshopStore.snapshot.theme"
          ></v-color-picker>
        </template>
        <template v-slot:actions>
          <v-btn
            class="ms-auto"
            text="确定"
            @click="
              () => {
                themeVisiable = false;
              }
            "
          ></v-btn>
        </template>
      </v-card>
    </template>
  </v-dialog>
  <v-navigation-drawer v-model="drawerVisiable" temporary :width="500">
    <v-card :title="setting.title">
      <JsonEditor :json="setting.content" @done="updateConfig" />
    </v-card>
  </v-navigation-drawer>
</template>

<script lang="ts" setup>
import { useWorkshopStore } from "@/stores/workshop";
import { useWorkshopImmer } from "@/hooks/immer";
import type { DropCopmonent, SnapshotVariable } from "@/workshop";
import { SHEET_MODE } from "@/constant/enum";
import { ImgPositionAttr } from "@/pages/attrDefined";
import { useDownload } from "@/hooks/download";
import { colorReverse } from "@/hooks/pureFun";
import JsonEditor from "@/pages/compoonents/JsonEditor.vue";

const workshopStore = useWorkshopStore();
const { setSheetState, undo, redo, /*reset, */ clear } = useWorkshopImmer();
const { downloadPDF } = useDownload();
const drawerVisiable = ref(false);
const themeVisiable = ref(false);

watch(
  () => workshopStore.snapshot.mode,
  (nv) => {
    switch (nv) {
      case SHEET_MODE.RESUME:
        setSheetState((draft: SnapshotVariable) => {
          workshopStore.snapshot.suffix = "%";
          workshopStore.snapshot.gridLine = false;
          workshopStore.globalFormFields.forEach((gff) => {
            if (/(width|height)/.test(gff.code)) {
              gff.disabled = true;
            }
          });
          draft.globalAttr.width = "820px";
          // draft.globalAttr.aspectRatio = "210 / 297";
        });
        break;
      case SHEET_MODE.FLOW:
        setSheetState((draft: SnapshotVariable) => {
          workshopStore.snapshot.suffix = "%";
          workshopStore.snapshot.gridLine = false;
          workshopStore.globalFormFields.forEach((gff) => {
            if (/(width|height)/.test(gff.code)) {
              gff.disabled = false;
            }
          });
          draft.globalAttr.width = 100;
          draft.globalAttr.aspectRatio = "";
        });
        break;
      case SHEET_MODE.ABSOLUTE:
        setSheetState((draft: SnapshotVariable) => {
          workshopStore.snapshot.suffix = "px";
          workshopStore.snapshot.gridLine = true;
          workshopStore.globalFormFields.forEach((gff) => {
            if (/(width|height)/.test(gff.code)) {
              gff.disabled = false;
            }
          });
          draft.globalAttr.width = "100%";
          draft.globalAttr.aspectRatio = "";
        });
        break;
      default:
    }
  },
  { immediate: true }
);

watch(
  () => workshopStore.snapshot.theme,
  (nv) => {
    document.documentElement.style.setProperty(
      "--theme-color",
      colorReverse(nv)
    );
    document.documentElement.style.setProperty("--theme-bg-color", nv);
  },
  { immediate: true }
);

const setting = reactive({
  title: "",
  content: "",
});

let configIndex = -1;
function showConfig(i: number) {
  if (i) {
    if (!~workshopStore.activeIndex) {
      return;
    }
    configIndex = i;
    setting.title = "组件配置";
    setting.content = JSON.stringify(
      workshopStore.snapshot.dropComponents[workshopStore.activeIndex]
    );
  } else {
    configIndex = -1;
    setting.title = "全量配置";
    setting.content = JSON.stringify(workshopStore.snapshot);
  }
  drawerVisiable.value = true;
}

function updateConfig(newConfig: string) {
  drawerVisiable.value = false;
  let configJson: SnapshotVariable | DropCopmonent;
  try {
    configJson = JSON.parse(newConfig);
  } catch (error) {
    return;
  }
  setSheetState((draft: SnapshotVariable) => {
    if (~configIndex) {
      draft = configJson as SnapshotVariable;
    } else {
      draft.dropComponents[workshopStore.activeIndex] =
        configJson as DropCopmonent;
    }
  });
}

const modeItems = reactive([
  { label: "简历", value: SHEET_MODE.RESUME },
  // { label: "页面流", value: SHEET_MODE.FLOW },
  { label: "绝对定位", value: SHEET_MODE.ABSOLUTE },
]);

function uploadImg() {
  document.getElementById("uploadImg")?.click();
}

function uploadInputChange(e: any) {
  const file = e.target.files[0];
  const fr = new FileReader();
  fr.onload = (event) => {
    const img = new Image();
    img.src = event.target?.result as string;
    img.onload = () => {
      const imgStyle: ImgPositionAttr = new ImgPositionAttr({
        top: 0,
        left: 0,
        width: img.width + "px",
        height: img.height + "px",
      });
      const dropItem: DropCopmonent = {
        id: new Date().getTime(),
        code: "img",
        label: file.name,
        type: "img",
        skip: true,
        attrs: {
          src: event.target?.result,
          style: imgStyle,
        },
      };
      dropItem.attrs.style.zIndex =
        workshopStore.snapshot.dropComponents.length + 1;
      setSheetState((draft: SnapshotVariable) => {
        draft.dropComponents.push(dropItem);
        workshopStore.activeIndex = draft.dropComponents.length - 1;
      });
    };
  };
  fr.readAsDataURL(file);
}
</script>

<style lang="scss">
.toolbar-btn {
  display: grid;
  grid-template-columns: 72px 72px repeat(auto-fill, 64px);
  padding-top: 40px;
}

.toolbar-field {
  display: flex;
  justify-content: end;
  gap: 12px;
  padding-top: 40px;
  padding-right: 24px;
}
</style>

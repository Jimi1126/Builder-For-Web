<template>
  <div class="resume-header">
    <div class="header">
      <input
        class="name"
        :value="config.name"
        placeholder="姓名"
        @input="debounceEdit($event, -1)"
      />
      <input
        class="job"
        :value="config.job"
        placeholder="职业"
        @input="debounceEdit($event, -2)"
      />
    </div>
    <hr />
    <div class="labels" ref="draggableEl">
      <template v-for="(label, i) in config.labels" :key="label.id">
        <div class="label">
          <template v-if="!(i % 2)">
            <v-icon
              v-show="label.icon"
              :icon="label.icon"
              size="small"
            ></v-icon>
          </template>
          <template v-if="isPreview">
            <a v-if="label.link" :href="label.link" target="_blank">
              {{ label.text }}</a
            >
            <span v-else>{{ label.text }}</span>
          </template>
          <input
            v-else
            :value="label.text"
            placeholder="标签名称"
            @input="debounceEdit($event, i)"
          />
          <template v-if="i % 2">
            <v-icon
              v-show="label.icon"
              :icon="label.icon"
              size="small"
            ></v-icon>
          </template>
          <div v-if="!isPreview" class="input-actions">
            <v-icon
              color="primary"
              icon="mdi-link"
              size="small"
              @click="selctLink(i)"
            ></v-icon>
            <v-icon
              color="primary"
              icon="mdi-tag"
              size="small"
              @click="selctIcon(i)"
            ></v-icon>
            <v-icon
              color="primary"
              icon="mdi-plus"
              size="small"
              @click="addItem(i)"
            ></v-icon>
            <v-icon
              color="primary"
              icon="mdi-minus"
              size="small"
              @click="delItem(i)"
            ></v-icon>
          </div>
        </div>
      </template>
    </div>
    <v-dialog v-model="iconDailogVisiable" width="300px">
      <template v-slot:default>
        <v-card title="图标选择">
          <template v-slot:text>
            <v-text-field
              v-model="selectIcon"
              label="图标类名"
              :clearable="true"
              variant="outlined"
              density="compact"
            ></v-text-field>
          </template>
          <template v-slot:actions>
            <v-btn class="ms-auto" text="确定" @click="addIcon"></v-btn>
          </template>
        </v-card>
      </template>
    </v-dialog>
    <v-dialog v-model="linkDailogVisiable" width="500px">
      <template v-slot:default>
        <v-card title="添加链接">
          <template v-slot:text>
            <v-text-field
              v-model="selectLink"
              label="链接地址"
              :clearable="true"
              variant="outlined"
              density="compact"
            ></v-text-field>
          </template>
          <template v-slot:actions>
            <v-btn class="ms-auto" text="确定" @click="addLink"></v-btn>
          </template>
        </v-card>
      </template>
    </v-dialog>
  </div>
</template>
<script lang="ts">
import { SHEET_MODE } from "@/constant/enum";
import { useWorkshopImmer } from "@/hooks/immer";
import useMyDraggable from "@/hooks/myDraggable";
import { DefaultFlowtAttr } from "@/pages/attrDefined";
import type { DropCopmonent } from "@/workshop";
import { debounce } from "radash";

export const componentInfo = {
  code: "Header",
  label: "简历头部",
  icon: "mdi-page-layout-header",
  path: SHEET_MODE.RESUME,
  type: SHEET_MODE.RESUME,
  attrs: {
    style: new DefaultFlowtAttr({
      width: "100%",
    }),
  },
  config: {
    name: "XXX",
    job: "XXX工程师",
    labels: [
      { id: 1, type: "text", text: "今天的风甚是喧嚣" },
      { id: 2, type: "text", text: "个人网站" },
      { id: 3, type: "text", text: "钓鱼佬" },
      { id: 4, type: "text", text: "XXX@XXX.com" },
    ],
  },
};
export default {
  props: ["id", "events", "config", "isPreview"],
  setup(props) {
    const { setSheetState } = useWorkshopImmer();
    const iconDailogVisiable = ref(false);
    const selectIcon = ref("");
    const selectIconIndex = ref(-1);
    const linkDailogVisiable = ref(false);
    const selectLink = ref("");
    const selectLinkIndex = ref(-1);

    function addItem(i: number) {
      setSheetState((draft: any) => {
        const dropcomponent = draft.dropComponents.find(
          (dc: DropCopmonent) => dc.id == props.id
        );
        if (!dropcomponent) return;
        dropcomponent.config.labels.splice(i + 1, 0, {
          id: new Date().getTime(),
        });
      });
    }

    function delItem(i: number) {
      setSheetState((draft: any) => {
        const dropcomponent = draft.dropComponents.find(
          (dc: DropCopmonent) => dc.id == props.id
        );
        if (!dropcomponent) return;
        dropcomponent.config.labels.splice(i, 1);
      });
    }
    function selctIcon(i: number) {
      selectIcon.value = props.config.labels[i].icon;
      selectIconIndex.value = i;
      iconDailogVisiable.value = true;
    }
    function addIcon() {
      setSheetState((draft: any) => {
        const dropcomponent = draft.dropComponents.find(
          (dc: DropCopmonent) => dc.id == props.id
        );
        if (!dropcomponent) return;
        dropcomponent.config.labels[selectIconIndex.value].icon =
          selectIcon.value;
      });
      iconDailogVisiable.value = false;
    }
    function selctLink(i: number) {
      selectLink.value = props.config.labels[i].link;
      selectLinkIndex.value = i;
      linkDailogVisiable.value = true;
    }
    function addLink() {
      setSheetState((draft: any) => {
        const dropcomponent = draft.dropComponents.find(
          (dc: DropCopmonent) => dc.id == props.id
        );
        if (!dropcomponent) return;
        dropcomponent.config.labels[selectLinkIndex.value].link =
          selectLink.value;
      });
      linkDailogVisiable.value = false;
    }

    function endEdit(e: any, i: number, field: string = "text") {
      setSheetState((draft: any) => {
        const activeDropc = draft.dropComponents.find(
          (dc: DropCopmonent) => dc.id == props.id
        );
        if (!activeDropc) return;
        if (i == -1) {
          activeDropc.config.name = e.target.value;
        } else if (i == -2) {
          activeDropc.config.job = e.target.value;
        } else {
          activeDropc.config.labels[i][field] = e.target.value;
        }
      });
    }

    const debounceEdit = debounce(
      {
        delay: 500,
      },
      endEdit
    );

    const { draggableEl } = useMyDraggable(props.config.labels);

    return {
      iconDailogVisiable,
      linkDailogVisiable,
      selectIcon,
      selectLink,
      addItem,
      delItem,
      selctIcon,
      addIcon,
      selctLink,
      addLink,
      debounceEdit,
      draggableEl,
    };
  },
};
</script>
<style lang="scss" scoped>
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
.resume-header {
  display: flex;
  flex-direction: column;
  padding: var(--resume-padding);
  gap: var(--theme-display-gap);
  background-color: var(--theme-bg-color);

  input,
  span,
  a {
    color: var(--theme-color) !important;
    width: 100%;
    text-decoration: none;
  }

  hr {
    border: none;
    height: 1px;
    width: 100%;
    background-color: var(--theme-color);
    opacity: 0.6;
  }

  .header {
    display: grid;
    grid-template-columns: 1fr 1fr;
    justify-items: start;
    font-size: 32px;
    & > :nth-child(2n) {
      text-align: end;
    }
  }
  .labels {
    display: grid;
    grid-template-columns: 1fr 1fr;
    justify-items: start;
    .label {
      display: flex;
      position: relative;
      align-items: center;
      gap: 6px;
      width: 100%;
      i {
        color: var(--theme-color);
      }
      i:hover {
        cursor: pointer;
      }
      .input-actions {
        display: none;
        position: absolute;
        transform: translateY(-100%);
      }
      &:hover {
        .input-actions {
          display: block;
        }
      }
    }

    .label:nth-child(2n-1) {
      .input-actions {
        top: 0;
        left: 0;
      }
    }
    & > .label:nth-child(2n) {
      input,
      span,
      a {
        text-align: end;
      }
      .input-actions {
        top: 0;
        right: 0;
      }
    }
  }
}
</style>

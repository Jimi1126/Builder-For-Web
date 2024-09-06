<template>
  <div class="resume-module-title">
    <hr />
    <input class="title" :value="config.title" @input="debounceEdit" />
    <hr />
  </div>
</template>
<script lang="ts">
import { useWorkshopImmer } from "@/hooks/immer";
import { DefaultFlowtAttr } from "@/pages/attrDefined";
import type { DropCopmonent } from "@/workshop";
import { debounce } from "radash";

// import { useWorkshopStore } from "@/stores/workshop";

export const componentInfo = {
  code: "ModuleTitle",
  label: "模块标题",
  icon: "mdi-page-layout-header",
  path: "resume",
  type: "flow",
  attrs: {
    style: new DefaultFlowtAttr({
      width: 100,
    }),
  },
  config: {
    title: "标题名称",
  },
};
export default {
  props: ["id", "events", "config"],
  setup(props) {
    const { setSheetState } = useWorkshopImmer();

    function endEdit(e: any) {
      setSheetState((draft: any) => {
        const activeDropc = draft.dropComponents.find(
          (dc: DropCopmonent) => dc.id == props.id
        );
        if (!activeDropc) return;
        activeDropc.config.title = e.target.value;
      });
    }

    const debounceEdit = debounce(
      {
        delay: 500,
      },
      endEdit
    );

    return { debounceEdit };
  },
};
</script>
<style lang="scss" scoped>
.resume-module-title {
  display: grid;
  grid-template-columns: 1fr 120px 1fr;
  padding: 0 var(--resume-padding);
  gap: var(--theme-display-gap);
  align-items: center;
  hr {
    border: none;
    height: 1px;
    width: 100%;
    background-color: var(--theme-bg-color);
    opacity: 0.6;
  }
  input {
    font-size: 16px;
    text-align: center;
    color: var(--theme-color) !important;
    border-radius: 12px;
    background-color: var(--theme-bg-color);
  }
}
</style>

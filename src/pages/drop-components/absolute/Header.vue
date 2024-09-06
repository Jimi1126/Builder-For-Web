<template>
  <!-- <div v-bind="$attrs" v-on="events" @dblclick.p="startEdit" @blur="endEdit">
    {{ config.text }}
    <v-icon icon="mdi-page-layout-header"></v-icon>
    <div>test</div>
  </div> -->
  <input type="text" name="" id="" v-model="text" />
</template>
<script lang="ts">
import { useWorkshopImmer } from "@/hooks/immer";
import { useWorkshopStore } from "@/stores/workshop";
import { SHEET_MODE } from "@/constant/enum";
import { DefaultPositiontAttr } from "@/pages/attrDefined";

export const componentInfo = {
  code: "Header",
  label: "页面头部",
  icon: "mdi-page-layout-header",
  path: SHEET_MODE.ABSOLUTE,
  type: SHEET_MODE.ABSOLUTE,
  attrs: {
    style: new DefaultPositiontAttr({ width: 100, height: 36 }),
  },
  config: { text: "双击编辑文字" },
};
export default {
  props: ["events", "config"],
  setup(props) {
    const workshopStore = useWorkshopStore();
    const { setSheetState } = useWorkshopImmer();
    const text = ref(props.config.text);

    function stopPropagation(e: Event) {
      e.stopPropagation();
    }
    let thatIndex: number;
    function startEdit(e: any) {
      e.target.setAttribute("contenteditable", "true");
      e.target.classList.add("can-edit");
      thatIndex = workshopStore.activeIndex;
      const selection = window.getSelection() as Selection;
      const range = document.createRange();
      range.selectNodeContents(e.target.childNodes[0]);
      selection.removeAllRanges();
      selection.addRange(range);
      e.target.addEventListener("mousedown", stopPropagation);
    }
    function endEdit(e: any) {
      setSheetState((draft: any) => {
        const activeDropc = draft.dropComponents[thatIndex];
        activeDropc &&
          activeDropc.config &&
          (activeDropc.config.text = e.target.innerText);
      });
      e.target.setAttribute("contenteditable", "false");
      e.target.classList.remove("can-edit");
      e.target.removeEventListener("mousedown", stopPropagation);
    }

    return { startEdit, endEdit, text };
  },
};
</script>
<style lang="scss">
.can-edit {
  cursor: text;
}
</style>

<template>
  <div class="resume-sort-list">
    <component
      :is="isPreview ? ContentWrap : 'textarea'"
      ref="textareaRefs"
      :rows="1"
      :value="config.content"
      @input="autoResize"
      placeholder="1. 拥有 X 年工作经验，具备XXX领域的专业技能；\n2. 精通 XXX 技术；\n3. ..."
    >
    </component>
  </div>
</template>
<script lang="ts">
import { useWorkshopImmer } from "@/hooks/immer";
import { DefaultFlowtAttr } from "@/pages/attrDefined";
import type { DropCopmonent } from "@/workshop";
import { debounce } from "radash";
import ContentWrap from "@/pages/compoonents/ContentWrap.vue";

export const componentInfo = {
  code: "SortList",
  label: "列表",
  icon: "mdi-page-layout-header",
  path: "resume",
  type: "flow",
  attrs: {
    style: new DefaultFlowtAttr({ width: 100 }),
  },
  config: {
    content: "",
  },
};
export default {
  props: ["id", "events", "config", "isPreview"],
  setup(props) {
    const { setSheetState } = useWorkshopImmer();
    const textareaRefs = ref<HTMLAreaElement | null>(null);

    function autoResize(e: any) {
      e.target.style.height = "auto";
      e.target.style.height = e.target.scrollHeight + "px";
      debounceEdit(e);
    }

    function endEdit(e: any) {
      setSheetState((draft: any) => {
        const dropcomponent = draft.dropComponents.find(
          (dc: DropCopmonent) => dc.id == props.id
        );
        if (!dropcomponent) return;
        dropcomponent.config.content = e.target.value;
      });
    }
    const debounceEdit = debounce(
      {
        delay: 500,
      },
      endEdit
    );

    return { textareaRefs, autoResize, ContentWrap };
  },
  mounted() {
    if (this.textareaRefs && !this.isPreview) {
      this.textareaRefs.style.height = "auto";
      this.textareaRefs.style.height = this.textareaRefs.scrollHeight + "px";
    }
  },
};
</script>
<style lang="scss" scoped>
.resume-sort-list {
  padding: 0 var(--resume-padding);

  textarea {
    width: 100%;
    height: auto;
    transition: all 200ms;
    &:focus {
      padding: 6px;
    }
  }
}
</style>

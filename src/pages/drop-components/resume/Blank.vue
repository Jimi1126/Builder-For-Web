<template>
  <div class="resume-blank"></div>
</template>
<script lang="ts">
import { DefaultFlowtAttr } from "@/pages/attrDefined";

export const componentInfo = {
  code: "Blank",
  label: "空白",
  icon: "mdi-page-layout-header",
  path: "resume",
  type: "flow",
  attrs: {
    style: new DefaultFlowtAttr({
      width: 100,
    }),
  },
};
export default {
  setup() {
    return {};
  },
};
</script>
<style lang="scss" scoped>
.resume-blank {
  min-height: 12px;
}
</style>

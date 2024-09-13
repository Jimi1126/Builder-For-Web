<template>
  <div v-if="contentList.length <= 1">{{ value }}</div>
  <div v-else class="content-wrap">
    <template v-for="(c, i) in contentList" :key="i">
      <div>{{ i + 1 + "." }}</div>
      <div>{{ c }}</div>
    </template>
  </div>
</template>

<script setup lang="ts">
const props = defineProps(["value"]);
const contentList = computed(() => {
  return (props.value || "").split(/[\n\r]/);
});
</script>

<style lang="scss" scoped>
.content-wrap {
  display: grid;
  grid-template-columns: 20px auto;
}
</style>

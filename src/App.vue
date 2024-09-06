<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
//
</script>
<style>
:root {
  --theme-color: #ffffff;
  --theme-bg-color: #424242;
  --theme-display-gap: 12px;
  --resume-padding: 32px;
  --resume-component-gap: 12px;
  --resume-border-radius: 12px;
}
html {
  font-family: KaiTi_GB2312, system-ui, -apple-system, BlinkMacSystemFont,
    "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue",
    sans-serif;
}
body {
  margin: 0;
}
</style>

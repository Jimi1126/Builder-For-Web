import { APP_THEME } from "@/constant/variable";
import { useAppStore } from "@/stores/app";

const appStore = useAppStore();
const primaryColor = ref(isDark() ? "" : "primary");

function isDark() {
  return appStore.theme == "dark";
}

function toggleTheme() {
  if (appStore.theme == "dark") {
    appStore.theme = "light";
    primaryColor.value = "primary";
  } else {
    appStore.theme = "dark";
    primaryColor.value = "";
  }
  localStorage.setItem(APP_THEME, appStore.theme);
}

export function useDark() {
  return { isDark, toggleTheme, primaryColor };
}

// Utilities
import { APP_THEME } from "@/constant/variable";
import { defineStore } from "pinia";

const theme: string = localStorage.getItem(APP_THEME) || "";

export const useAppStore = defineStore("app", {
  state: () => ({
    //
    theme,
  }),
});

import { SHEET_MODE } from "@/constant/enum";
import { useCalculator } from "@/hooks/calculator";
import { useWorkshopImmer } from "@/hooks/immer";
import { GlobalAttr, type AllAttr } from "@/pages/attrDefined";
import { useWorkshopStore } from "@/stores/workshop";
import type { DropCopmonent, SnapshotVariable } from "@/workshop";

const workshopStore = useWorkshopStore();
const { setSheetState } = useWorkshopImmer();

const { Calculator, calculator } = useCalculator();

const ratio: ComputedRef<number> = computed(() => {
  const zoom = parseInt(workshopStore.snapshot.globalAttr.zoom as any);
  return new Calculator(zoom).div(100).value();
});

function getSheetStyle() {
  const attr = workshopStore.snapshot.globalAttr;
  const result: GlobalAttr = {} as GlobalAttr;
  Object.assign(result, attr);
  if (typeof result.width == "number") {
    result.width = result.width + workshopStore.snapshot.suffix;
  }
  if (typeof result.height == "number") {
    result.height = result.height + workshopStore.snapshot.suffix;
  }
  if (typeof result.fontSize == "number") {
    result.fontSize = result.fontSize + "px";
  }
  result.rotate;
  result.zoom = workshopStore.snapshot.globalAttr.zoom + "%";
  return result as any;
}

function dropHandler(e: DragEvent) {
  if (!workshopStore.dragComponentInfo) return;
  const dropItem: DropCopmonent = workshopStore.dragComponentInfo;
  if (dropItem.type == SHEET_MODE.ABSOLUTE) {
    const sheetRect = document
      .getElementById("sheet")
      ?.getBoundingClientRect() || { x: 0, y: 0 };
    const initStyle: AllAttr = dropItem.attrs.style;
    initStyle.left = calculator
      .setTotal(e.clientX)
      .minus(new Calculator(sheetRect.x).mult(ratio.value).value())
      .div(ratio.value)
      .value();
    initStyle.top = calculator
      .setTotal(e.clientY)
      .minus(new Calculator(sheetRect.y).mult(ratio.value).value())
      .div(ratio.value)
      .value();
    initStyle.zIndex = workshopStore.snapshot.dropComponents.length + 1;
  }
  setSheetState((draft: SnapshotVariable) => {
    draft.dropComponents.push(dropItem);
    workshopStore.activeIndex = draft.dropComponents.length - 1;
    workshopStore.dragComponentInfo = undefined;
  });
}

function sheetMouseDownHandler() {
  workshopStore.activeIndex = -1;
  workshopStore.contextMenu.visiable = false;
}

function contextMenuHandler(e: MouseEvent) {
  const sheetRect = document
    .getElementById("sheet")
    ?.getBoundingClientRect() || { x: 0, y: 0 };
  workshopStore.contextMenu.left =
    calculator
      .setTotal(e.clientX)
      .minus(new Calculator(sheetRect.x).mult(ratio.value).value())
      .div(ratio.value)
      .value() + "px";
  workshopStore.contextMenu.top =
    calculator
      .setTotal(e.clientY)
      .minus(new Calculator(sheetRect.y).mult(ratio.value).value())
      .div(ratio.value)
      .value() + "px";
  workshopStore.contextMenu.visiable = true;
}

export function useSheet() {
  return {
    getSheetStyle,
    dropHandler,
    sheetMouseDownHandler,
    contextMenuHandler,
  };
}

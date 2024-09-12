import { POSITIONS, SHEET_MODE } from "@/constant/enum";
import { useCalculator } from "@/hooks/calculator";
import { useWorkshopImmer } from "@/hooks/immer";
import { useWorkshopStore } from "@/stores/workshop";
import type { DropCopmonent, SnapshotVariable, SpotStyle } from "@/workshop";

const workshopStore = useWorkshopStore();
const { setSheetState } = useWorkshopImmer();
const { Calculator, calculator } = useCalculator();

const activeDropc = computed(() => {
  return workshopStore.snapshot.dropComponents[workshopStore.activeIndex];
});
const ratio: ComputedRef<number> = computed(() => {
  const zoom = parseInt(workshopStore.snapshot.globalAttr.zoom as any);
  return new Calculator(zoom).div(100).value();
});

function getComponentStyle(item: DropCopmonent) {
  if (!item || !item.attrs) return;
  const style = item.attrs.style;
  const result: any = { ...style };
  const transformUnitAttrs = [
    "top",
    "left",
    "width",
    "height",
    "lineHeight",
    "fontSize",
    "borderWidth",
  ];
  transformUnitAttrs.forEach((attr) => {
    if (result[attr] === undefined) return;
    if (attr == "fontSize") {
      result[attr] = result[attr] + "px";
      return;
    }
    if (typeof result[attr] == "number") {
      result[attr] = result[attr] + workshopStore.snapshot.suffix;
    }
  });
  return result;
}

function setSpotStyle() {
  if (workshopStore.activeIndex == -1 || !activeDropc.value) return;
  const activeDropcEl =
    document.getElementsByClassName("drop-component")[
      workshopStore.activeIndex
    ];
  const sheetEl = document.getElementById("sheet");
  if (!activeDropcEl || !sheetEl) return;
  const sheetRect = sheetEl.getBoundingClientRect();
  const dropcRect = activeDropcEl.getBoundingClientRect();
  const { width, height } = dropcRect;
  const { top, left } = {
    top: dropcRect.top - sheetRect.top,
    left: dropcRect.left - sheetRect.left,
  };
  const offset = 4;
  for (let i = 0; i < 8; i++) {
    workshopStore.spotStyles[i] = workshopStore.spotStyles[i] || {
      position: POSITIONS.ABSOLUTE,
    };
    const result: SpotStyle = workshopStore.spotStyles[i];
    switch (i) {
      case 0:
        result.top = top - offset + "px";
        result.left = left - offset + "px";
        break;
      case 1:
        result.top = top - offset + "px";
        result.left = left + width / 2 + "px";
        break;
      case 2:
        result.top = top - offset + "px";
        result.left = left + width - offset + "px";
        break;
      case 3:
        result.top = top + height / 2 - offset + "px";
        result.left = left - offset + "px";
        break;
      case 4:
        result.top = top + height / 2 - offset + "px";
        result.left = left + width - offset + "px";
        break;
      case 5:
        result.top = top + height - offset + "px";
        result.left = left - offset + "px";
        break;
      case 6:
        result.top = top + height - offset + "px";
        result.left = left + width / 2 + "px";
        break;
      case 7:
        result.top = top + height - offset + "px";
        result.left = left + width - offset + "px";
        break;
    }
  }
}

function shapeMouseDownHandler(e: MouseEvent, item: DropCopmonent) {
  workshopStore.contextMenu.visiable = false;
  workshopStore.activeIndex = workshopStore.snapshot.dropComponents.findIndex(
    (it) => it.id == item.id
  );
  if (workshopStore.snapshot.mode !== SHEET_MODE.ABSOLUTE) return;
  const { top = 0, left = 0 } = {
    top: +item.attrs.style.top,
    left: +item.attrs.style.left,
  };
  const beforeClientX = e.clientX,
    beforeClientY = e.clientY;
  const move = (e: MouseEvent) => {
    item.attrs.style.left = calculator
      .setTotal(e.clientX)
      .minus(beforeClientX)
      .div(ratio.value)
      .plus(left)
      .value();
    item.attrs.style.top = calculator
      .setTotal(e.clientY)
      .minus(beforeClientY)
      .div(ratio.value)
      .plus(top)
      .value();
  };
  const up = () => {
    document.removeEventListener("mousemove", move);
    document.removeEventListener("mouseup", up);
    setSheetState((draft: SnapshotVariable) => {
      const { top: aftertop, left: afterLeft } = item.attrs.style;
      // 恢复状态
      Object.assign(item.attrs.style, { left, top });
      // 使用immer记录快照
      const draftStyle =
        draft.dropComponents[workshopStore.activeIndex].attrs.style;
      Object.assign(draftStyle, { top: aftertop, left: afterLeft });
    });
  };
  document.addEventListener("mousemove", move);
  document.addEventListener("mouseup", up);
}

function spotMouseDownHandler(e: MouseEvent, i: number) {
  workshopStore.contextMenu.visiable = false;
  const activeDropc: DropCopmonent =
    workshopStore.snapshot.dropComponents[workshopStore.activeIndex];
  const style = activeDropc.attrs.style;
  const { top, left, width, height } = {
    top: +style.top,
    left: +style.left,
    width: +style.width,
    height: +style.height,
  };
  const beforeClientX = e.clientX,
    beforeClientY = e.clientY;

  const move = (e: MouseEvent) => {
    const offsetX = calculator
        .setTotal(e.clientX)
        .minus(beforeClientX)
        .div(ratio.value)
        .value(),
      offsetY = calculator
        .setTotal(e.clientY)
        .minus(beforeClientY)
        .div(ratio.value)
        .value();
    switch (i) {
      case 1:
        style.left = calculator.setTotal(left).plus(offsetX).value();
        style.top = calculator.setTotal(top).plus(offsetY).value();
        style.width = calculator.setTotal(width).minus(offsetX).value();
        style.height = calculator.setTotal(height).minus(offsetY).value();
        break;
      case 2:
        style.top = calculator.setTotal(top).plus(offsetY).value();
        style.height = calculator.setTotal(height).minus(offsetY).value();
        break;
      case 3:
        style.top = calculator.setTotal(top).plus(offsetY).value();
        style.width = calculator.setTotal(width).plus(offsetX).value();
        style.height = calculator.setTotal(height).minus(offsetY).value();
        break;
      case 4:
        style.left = calculator.setTotal(left).plus(offsetX).value();
        style.width = calculator.setTotal(width).minus(offsetX).value();
        break;
      case 5:
        style.width = calculator.setTotal(width).plus(offsetX).value();
        break;
      case 6:
        style.left = calculator.setTotal(left).plus(offsetX).value();
        style.width = calculator.setTotal(width).minus(offsetX).value();
        style.height = calculator.setTotal(height).plus(offsetY).value();
        break;
      case 7:
        style.height = calculator.setTotal(height).plus(offsetY).value();
        break;
      case 8:
        style.width = calculator.setTotal(width).plus(offsetX).value();
        style.height = calculator.setTotal(height).plus(offsetY).value();
        break;
    }
  };
  const up = () => {
    document.removeEventListener("mousemove", move);
    document.removeEventListener("mouseup", up);
    setSheetState((draft: SnapshotVariable) => {
      const {
        top: aftertop,
        left: afterLeft,
        width: afterWidth,
        height: afterHeight,
      } = style;
      // 恢复状态
      Object.assign(activeDropc.attrs.style, { left, top, width, height });
      // 使用immer记录快照
      const draftStyle =
        draft.dropComponents[workshopStore.activeIndex].attrs.style;
      Object.assign(draftStyle, {
        top: aftertop,
        left: afterLeft,
        width: afterWidth,
        height: afterHeight,
      });
    });
  };
  document.addEventListener("mousemove", move);
  document.addEventListener("mouseup", up);
}

export function useDropComponent() {
  return {
    getComponentStyle,
    setSpotStyle,
    shapeMouseDownHandler,
    spotMouseDownHandler,
    activeDropc,
  };
}

import { SHEET_MODE } from "@/constant/enum";
import { useWorkshopImmer } from "@/hooks/immer";
import { useWorkshopStore } from "@/stores/workshop";
import type { DropCopmonent, SnapshotVariable } from "@/workshop";
import { createDraft } from "immer";

const workshopStore = useWorkshopStore();
const { setSheetState } = useWorkshopImmer();

let cutBoard: DropCopmonent | undefined;

function copy() {
  workshopStore.contextMenu.visiable = false;
  if (workshopStore.activeIndex == -1) return;
  cutBoard = createDraft(
    workshopStore.snapshot.dropComponents[workshopStore.activeIndex]
  );
}
function paste() {
  workshopStore.contextMenu.visiable = false;
  if (cutBoard) {
    cutBoard.id = new Date().getTime();
    cutBoard.attrs.style.left = parseInt(workshopStore.contextMenu.left);
    cutBoard.attrs.style.top = parseInt(workshopStore.contextMenu.top);
    cutBoard.attrs.style.zIndex =
      workshopStore.snapshot.dropComponents.length + 1;
    setSheetState((draft: SnapshotVariable) => {
      draft.dropComponents.push(cutBoard as DropCopmonent);
      workshopStore.activeIndex = draft.dropComponents.length - 1;
      cutBoard = undefined;
    });
  }
}
function cut() {
  workshopStore.contextMenu.visiable = false;
  if (workshopStore.activeIndex == -1) return;
  setSheetState((draft: SnapshotVariable) => {
    cutBoard = createDraft(
      draft.dropComponents.splice(workshopStore.activeIndex, 1)[0]
    );
    workshopStore.activeIndex = -1;
  });
}
function del() {
  workshopStore.contextMenu.visiable = false;
  if (workshopStore.activeIndex == -1) return;
  setSheetState((draft: SnapshotVariable) => {
    draft.dropComponents.splice(workshopStore.activeIndex, 1);
    workshopStore.activeIndex = -1;
  });
}
function toUp() {
  if (workshopStore.activeIndex == -1) return;
  if (
    workshopStore.activeIndex ==
    workshopStore.snapshot.dropComponents.length - 1
  )
    return;
  setSheetState((draft: SnapshotVariable) => {
    if (workshopStore.snapshot.mode === SHEET_MODE.ABSOLUTE) {
      (draft as any).dropComponents[workshopStore.activeIndex].attrs.style
        .zIndex++;
      (draft as any).dropComponents[workshopStore.activeIndex + 1].attrs.style
        .zIndex--;
    }
    [
      draft.dropComponents[workshopStore.activeIndex],
      draft.dropComponents[workshopStore.activeIndex + 1],
    ] = [
      draft.dropComponents[workshopStore.activeIndex + 1],
      draft.dropComponents[workshopStore.activeIndex],
    ];
    workshopStore.activeIndex++;
  });
}
function toLow() {
  if (workshopStore.activeIndex == -1) return;
  if (workshopStore.activeIndex == 0) return;
  setSheetState((draft: SnapshotVariable) => {
    if (workshopStore.snapshot.mode === SHEET_MODE.ABSOLUTE) {
      (draft as any).dropComponents[workshopStore.activeIndex].attrs.style
        .zIndex--;
      (draft as any).dropComponents[workshopStore.activeIndex - 1].attrs.style
        .zIndex++;
    }
    [
      draft.dropComponents[workshopStore.activeIndex],
      draft.dropComponents[workshopStore.activeIndex - 1],
    ] = [
      draft.dropComponents[workshopStore.activeIndex - 1],
      draft.dropComponents[workshopStore.activeIndex],
    ];
    workshopStore.activeIndex--;
  });
}
function toTop() {
  workshopStore.contextMenu.visiable = false;
  if (workshopStore.activeIndex == -1) return;
  if (
    workshopStore.activeIndex ==
    workshopStore.snapshot.dropComponents.length - 1
  )
    return;
  setSheetState((draft: SnapshotVariable) => {
    for (
      let index = workshopStore.activeIndex;
      index < draft.dropComponents.length - 1;
      index++
    ) {
      (draft as any).dropComponents[index].attrs.style.zIndex++;
      (draft as any).dropComponents[index + 1].attrs.style.zIndex--;
      [draft.dropComponents[index], draft.dropComponents[index + 1]] = [
        draft.dropComponents[index + 1],
        draft.dropComponents[index],
      ];
    }
    workshopStore.activeIndex = draft.dropComponents.length - 1;
  });
}
function toBottm() {
  workshopStore.contextMenu.visiable = false;
  if (workshopStore.activeIndex == -1) return;
  if (workshopStore.activeIndex == 0) return;
  setSheetState((draft: SnapshotVariable) => {
    for (let index = workshopStore.activeIndex; index > 0; index--) {
      (draft as any).dropComponents[index].attrs.style.zIndex--;
      (draft as any).dropComponents[index - 1].attrs.style.zIndex++;
      [draft.dropComponents[index], draft.dropComponents[index - 1]] = [
        draft.dropComponents[index - 1],
        draft.dropComponents[index],
      ];
    }
    workshopStore.activeIndex = 0;
  });
}

export function useContextMenu() {
  return { copy, paste, cut, del, toUp, toLow, toTop, toBottm };
}

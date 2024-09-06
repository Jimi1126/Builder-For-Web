import {
  produceWithPatches,
  applyPatches,
  enablePatches,
  setAutoFreeze,
  type Patch,
  createDraft,
} from "immer";
import { useWorkshopStore } from "@/stores/workshop";
import type { SnapshotVariable } from "@/workshop";
import { WORKSHOP_LOCALSTORAGE_KEY } from "@/constant/variable";

enablePatches();
setAutoFreeze(false);

const workshopStore = useWorkshopStore();

let changes: Patch[][] = [];
let inverseChanges: Patch[][] = [];

let originState: SnapshotVariable;

export function doLocalStorage(snapshot = workshopStore.snapshot) {
  localStorage.setItem(WORKSHOP_LOCALSTORAGE_KEY, JSON.stringify(snapshot));
}

export function useWorkshopImmer() {
  onMounted(() => {
    originState = createDraft(workshopStore.snapshot);
  });
  function setSheetState(fun: any) {
    const [nextState, patches, inversePatches] = produceWithPatches(
      workshopStore.snapshot,
      fun
    );
    if (patches.length) {
      workshopStore.snapshot = nextState;
      workshopStore.inverIndex++;
      changes = changes.slice(0, workshopStore.inverIndex);
      inverseChanges = inverseChanges.slice(0, workshopStore.inverIndex);
      changes.push(patches);
      inverseChanges.push(inversePatches);
      workshopStore.changeCount = changes.length;
      doLocalStorage(nextState);
    }
  }

  function undo() {
    if (workshopStore.inverIndex > -1) {
      if (
        inverseChanges[workshopStore.inverIndex].some((record) => {
          return (
            /(add|remove)/.test(record.op) &&
            record.path.length == 2 &&
            record.path[0] == "dropComponents"
          );
        })
      ) {
        workshopStore.activeIndex = -1;
      }
      workshopStore.snapshot = applyPatches(
        workshopStore.snapshot,
        inverseChanges[workshopStore.inverIndex--]
      );
      doLocalStorage();
    }
  }
  function redo() {
    if (workshopStore.inverIndex < changes.length - 1) {
      const index = ++workshopStore.inverIndex;
      if (
        inverseChanges[index].some((record) => {
          return (
            /(add|remove)/.test(record.op) &&
            record.path.length == 2 &&
            record.path[0] == "dropComponents"
          );
        })
      ) {
        workshopStore.activeIndex = -1;
      }
      workshopStore.snapshot = applyPatches(
        workshopStore.snapshot,
        changes[index]
      );
      doLocalStorage();
    }
  }
  function reset() {
    setSheetState((darft: SnapshotVariable) => {
      workshopStore.activeIndex = -1;
      Object.assign(darft, originState);
    });
  }
  function clear() {
    setSheetState((darft: SnapshotVariable) => {
      workshopStore.activeIndex = -1;
      darft.dropComponents = [];
    });
  }

  return { setSheetState, undo, redo, reset, clear };
}

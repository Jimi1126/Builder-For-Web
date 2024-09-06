import type { WorkshopVariable, DropCopmonent } from "@/workshop";
import { defineStore } from "pinia";
import { SHEET_MODE } from "@/constant/enum";
import * as AttrDefined from "@/pages/attrDefined";
import { WORKSHOP_LOCALSTORAGE_KEY } from "@/constant/variable";

function createInstanceByName(jsonProps: AttrDefined.BaseAttr) {
  //@ts-ignore
  const ClassType = AttrDefined[jsonProps.className];
  if (ClassType) {
    return new ClassType(jsonProps);
  } else {
    return jsonProps;
  }
}

const globalAttr = new AttrDefined.GlobalAttr({
  width: 100,
  fontSize: 16,
});

let localSnapshot: any;

try {
  localSnapshot = JSON.parse(
    localStorage.getItem(WORKSHOP_LOCALSTORAGE_KEY) as any
  );
  localSnapshot.dropComponents = localSnapshot.dropComponents || [];
  localSnapshot.dropComponents.forEach((dropc: DropCopmonent) => {
    dropc.attrs.style = createInstanceByName(dropc.attrs.style);
  });
} catch (e) {
  console.log(e);
}

export const useWorkshopStore = defineStore("workshop", {
  state: (): WorkshopVariable => ({
    isClickComponent: false,
    activeIndex: -1,
    inverIndex: -1,
    changeCount: 0,
    spotStyles: [],
    globalFormFields: globalAttr.getFormFields(),
    formFields: [],
    dragComponentInfo: undefined,
    contextMenu: {
      visiable: false,
      left: "0px",
      top: "0px",
    },
    snapshot: localSnapshot || {
      mode: SHEET_MODE.RESUME,
      theme: "#212121",
      gridLine: true,
      suffix: "%",
      globalAttr: globalAttr,
      dropComponents: [],
    },
  }),
});

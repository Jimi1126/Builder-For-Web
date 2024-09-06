import type { AllAttr, GlobalAttr } from "@/pages/attrDefined";
import type { Property } from "csstype";

export type DropComponentAttr = {
  style: AllAttr;
  [propName: string]: any;
};

export type DropComponentConfig = {
  text: string;
  [propName: string]: any;
};

export type DropComponentTransition = {
  name: string;
  property?: string;
  duration?: number;
  timing?: string;
  delay?: number;
};

export type DropComponentAnimation = {
  keyframes?: string;
  duration?: number;
  delay?: number;
  count?: number;
  direction?: string;
  fillMode?: string;
  pause?: string;
};

export type DropComponentEvent = {
  event: string;
  handler: Function;
};

export type DropCopmonent = {
  id: number;
  code: string;
  label: string;
  icon?: string;
  path?: string;
  type?: string;
  skip?: boolean;
  attrs: DropComponentAttr;
  events?: DropComponentEvent[];
  config?: DropComponentConfig;
  transitions?: DropComponentTransition[];
  animations?: DropComponentAnimation[];
};

export type SpotStyle = {
  position?: Property.Position;
  top?: string;
  left?: string;
  width?: string;
  height?: string;
};

export type SnapshotVariable = {
  mode: string;
  theme: string;
  gridLine: boolean;
  suffix: string;
  globalAttr: GlobalAttr;
  dropComponents: DropCopmonent[];
};

export type WorkshopVariable = {
  isClickComponent: boolean;
  activeIndex: number;
  inverIndex: number;
  changeCount: number;
  dragComponentInfo: DropCopmonent | undefined;
  spotStyles: SpotStyle[];
  globalFormFields: FormField[];
  formFields: FormField[];
  contextMenu: {
    visiable: boolean;
    top: string;
    left: string;
  };
  snapshot: SnapshotVariable;
};

export type FormField = {
  code: string;
  label: string;
  type?: string;
  readonly?: boolean;
  disabled?: boolean;
  hidden?: boolean;
  clearable?: boolean;
  chips?: boolean;
  multiple?: boolean;
  inline?: boolean;
  strict?: boolean;
  visiable?: boolean;
  direction?: string;
  suffix?: string;
  prepend?: string;
  append?: string;
  prependEvent?: Function;
  appendEvent?: Function;
  items?: Enumish;
  max?: number;
  min?: number;
  step?: number;
};

interface Enumish {
  [key: string | number]: string | number;
}

import {
  ALIGNITEMS,
  FONTFAMILYS,
  BORDERSTYLES,
  POSITIONS,
  DISPLAYS,
  FLEXDIRS,
  JUSTIFYS,
  TEXTALIGNS,
  VERTICALALIGNS,
  MIXBLENDMODES,
} from "@/constant/enum";
import type { FormField } from "@/workshop";
import type { StyleValue } from "vue";
import type { Property } from "csstype";
import { immerable } from "immer";

function initProperty(that: BaseAttr, props: StyleValue) {
  that.className = that.constructor.name;
  Object.assign(that, props);
}

export abstract class BaseAttr {
  [immerable]? = true;
  width: number | string = "fit-content";
  height: number | string = "fit-content";
  className!: string;
  lineHeight?: Property.LineHeight;
  fontFamily?: Property.FontFamily = FONTFAMILYS.KAITI;
  fontSize?: Property.FontSize;
  fontWeight?: Property.FontWeight;
  color?: Property.Color;
  backgroundColor?: Property.BackgroundColor;
  mixBlendMode?: Property.MixBlendMode;
  borderColor?: Property.BorderColor;
  borderWidth?: Property.BorderWidth;
  borderStyle?: Property.BorderStyle;
  borderRadius?: Property.BorderRadius;
  margin?: Property.Margin;
  padding?: Property.Padding;
  rotate?: Property.Rotate;
  opacity?: Property.Opacity;
  getFormFields(): FormField[] {
    const thatFormFields = [
      {
        code: "width",
        label: "宽度",
        type: "number",
      },
      {
        code: "height",
        label: "高度",
        type: "number",
      },
      {
        code: "lineHeight",
        label: "行高",
        type: "number",
      },
      {
        code: "fontFamily",
        label: "字体",
        type: "select",
        items: FONTFAMILYS,
      },
      {
        code: "fontSize",
        label: "字号",
        type: "number",
        suffix: "px",
      },
      {
        code: "fontWeight",
        label: "字重",
        type: "number",
        suffix: "",
      },
      {
        code: "color",
        label: "字体颜色",
        type: "color",
      },
      {
        code: "backgroundColor",
        label: "背景颜色",
        type: "color",
      },
      {
        code: "MixBlendMode",
        label: "颜色混合模式",
        type: "select",
        items: MIXBLENDMODES,
      },
      {
        code: "borderColor",
        label: "边框颜色",
        type: "color",
      },
      {
        code: "borderWidth",
        label: "边框宽度",
        type: "number",
        suffix: "px",
      },
      {
        code: "borderStyle",
        label: "边框样式",
        type: "select",
        items: BORDERSTYLES,
      },
      {
        code: "borderRadius",
        label: "边框圆角",
      },
      {
        code: "margin",
        label: "外边距",
      },
      {
        code: "padding",
        label: "内边距",
      },
      {
        code: "rotate",
        label: "旋转",
        type: "number",
        suffix: "deg",
      },
      {
        code: "opacity",
        label: "透明度",
        type: "number",
        suffix: "",
      },
    ];
    return thatFormFields;
  }
}

export class GlobalAttr extends BaseAttr {
  position?: Property.Position = POSITIONS.RELATIVE;
  zoom?: number | string = 100;
  aspectRatio?: Property.AspectRatio;
  constructor(props: StyleValue) {
    super();
    initProperty(this, props);
  }
  getFormFields(): FormField[] {
    const thatFormFields = [
      {
        code: "zoom",
        label: "页面缩放",
        type: "number",
        suffix: "",
      },
    ];
    return super.getFormFields().concat(thatFormFields);
  }
}

export abstract class BaseFlowAttr extends BaseAttr {
  display?: Property.Display;
  flexDirection?: Property.FlexDirection;
  justifyContent?: Property.JustifyContent;
  alignItems?: Property.AlignItems;
  textAlign?: Property.TextAlign;
  verticalAlign?: Property.VerticalAlign;
  getFormFields(): FormField[] {
    const thatFormFields = [
      {
        code: "display",
        label: "布局方式",
        type: "select",
        items: DISPLAYS,
      },
      {
        code: "flexDirection",
        label: "布局方向",
        hidden: true,
        type: "select",
        items: FLEXDIRS,
      },
      {
        code: "justifyContent",
        label: "水平对齐",
        hidden: true,
        type: "select",
        items: JUSTIFYS,
      },
      {
        code: "alignItems",
        label: "垂直对齐",
        hidden: true,
        type: "select",
        items: ALIGNITEMS,
      },
      {
        code: "textAlign",
        label: "水平对齐",
        hidden: false,
        type: "select",
        items: TEXTALIGNS,
      },
      {
        code: "verticalAlign",
        label: "垂直对齐",
        hidden: false,
        type: "select",
        items: VERTICALALIGNS,
      },
    ];
    return super.getFormFields().concat(thatFormFields);
  }
}

export abstract class BasePositionAttr extends BaseFlowAttr {
  top: number | string = 0;
  left: number | string = 0;
  position?: Property.Position = POSITIONS.ABSOLUTE;
  zIndex?: Property.ZIndex;

  getFormFields(): FormField[] {
    const thatFormFields1: FormField[] = [
      {
        code: "top",
        label: "Y 坐标",
        type: "number",
        suffix: "px",
      },
      {
        code: "left",
        label: "X 坐标",
        type: "number",
        suffix: "px",
      },
    ];
    const thatFormFields2: FormField[] = [
      {
        code: "position",
        label: "定位",
        type: "select",
        items: POSITIONS,
      },
      {
        code: "zIndex",
        label: "层叠",
        type: "number",
        suffix: "",
      },
    ];
    return thatFormFields1
      .concat(super.getFormFields())
      .concat(thatFormFields2);
  }
}

export class DefaultFlowtAttr extends BaseFlowAttr {
  constructor(props: StyleValue) {
    super();
    initProperty(this, props);
  }
  getFormFields(): FormField[] {
    return super.getFormFields();
  }
}

export class DefaultPositiontAttr extends BasePositionAttr {
  constructor(props: StyleValue) {
    super();
    initProperty(this, props);
  }
  getFormFields(): FormField[] {
    return super.getFormFields();
  }
}

export class ImgFlowAttr extends BaseFlowAttr {
  constructor(props: StyleValue) {
    super();
    initProperty(this, props);
  }
  getFormFields(): FormField[] {
    const thatFormFields = [
      {
        code: "width",
        label: "宽度",
        type: "number",
      },
      {
        code: "height",
        label: "高度",
        type: "number",
      },
      {
        code: "backgroundColor",
        label: "背景颜色",
        type: "color",
      },
      {
        code: "borderColor",
        label: "边框颜色",
        type: "color",
      },
      {
        code: "borderWidth",
        label: "边框宽度",
        type: "number",
        suffix: "px",
      },
      {
        code: "borderStyle",
        label: "边框样式",
        type: "select",
        items: BORDERSTYLES,
      },
      {
        code: "borderRadius",
        label: "边框圆角",
      },
      {
        code: "rotate",
        label: "旋转",
        type: "number",
        suffix: "deg",
      },
      {
        code: "opacity",
        label: "透明度",
        type: "number",
        suffix: "",
      },
    ];
    return thatFormFields;
  }
}

export class ImgPositionAttr extends BasePositionAttr {
  constructor(props: StyleValue) {
    super();
    initProperty(this, props);
  }
  getFormFields(): FormField[] {
    const thatFormFields = [
      {
        code: "position",
        label: "定位",
        type: "select",
        items: POSITIONS,
      },
      {
        code: "top",
        label: "Y 坐标",
        type: "number",
        suffix: "px",
      },
      {
        code: "left",
        label: "X 坐标",
        type: "number",
        suffix: "px",
      },
      {
        code: "width",
        label: "宽度",
        type: "number",
      },
      {
        code: "height",
        label: "高度",
        type: "number",
      },
      {
        code: "backgroundColor",
        label: "背景颜色",
        type: "color",
      },
      {
        code: "borderColor",
        label: "边框颜色",
        type: "color",
      },
      {
        code: "borderWidth",
        label: "边框宽度",
        type: "number",
        suffix: "px",
      },
      {
        code: "borderStyle",
        label: "边框样式",
        type: "select",
        items: BORDERSTYLES,
      },
      {
        code: "borderRadius",
        label: "边框圆角",
      },
      {
        code: "rotate",
        label: "旋转",
        type: "number",
        suffix: "deg",
      },
      {
        code: "opacity",
        label: "透明度",
        type: "number",
        suffix: "",
      },
      {
        code: "zIndex",
        label: "层叠",
        type: "number",
        suffix: "",
      },
    ];
    return thatFormFields;
  }
}

export interface AllAttr
  extends BaseAttr,
    GlobalAttr,
    BaseFlowAttr,
    BasePositionAttr,
    DefaultFlowtAttr,
    DefaultPositiontAttr {
  [key: string | number | symbol]: any;
}

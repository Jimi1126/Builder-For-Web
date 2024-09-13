/**
 * 16进制色值获取反色设置方法
 * @param  {String} oldColor 为16进制色值的字符串（例：'#000000'）
 * @return {String} 返回反色的色值（例：'#ffffff'）
 */
export const colorReverse = (hexColor: string) => {
  // 将16进制颜色转换为RGB
  const rgb = {
    r: parseInt(hexColor.substr(1, 2), 16),
    g: parseInt(hexColor.substr(3, 2), 16),
    b: parseInt(hexColor.substr(5, 2), 16),
  };

  // 计算RGB分量的反色
  rgb.r = 255 - rgb.r;
  rgb.g = 255 - rgb.g;
  rgb.b = 255 - rgb.b;

  // 转换RGB为16进制并拼接前缀'#'
  const hex =
    "#" +
    rgb.r.toString(16).padStart(2, "0") +
    rgb.g.toString(16).padStart(2, "0") +
    rgb.b.toString(16).padStart(2, "0");

  return hex;
};

export function openLink(link: string, target: string = "_blank") {
  const el = document.createElement("a");
  el.href = link;
  el.target = target;
  el.click();
  el.remove();
}

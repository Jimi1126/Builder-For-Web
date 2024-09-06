/**
 * 16进制色值获取反色设置方法
 * @param  {String} oldColor 为16进制色值的字符串（例：'#000000'）
 * @return {String} 返回反色的色值（例：'#ffffff'）
 */
export const colorReverse = (oldColor: any) => {
  oldColor = "0x" + oldColor.replace(/#/g, "");
  const str = "000000" + (0xffffff - oldColor).toString(16);
  return "#" + str.substring(str.length - 6, str.length);
};

export function openLink(link: string, target: string = "_blank") {
  const el = document.createElement("a");
  el.href = link;
  el.target = target;
  el.click();
  el.remove();
}

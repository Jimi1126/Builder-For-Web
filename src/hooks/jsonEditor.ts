// 获取文本框的值
export const handleTextareaInput = (viewJsonStr: any, event: any) => {
  const textarea = event.target;
  const newValue = textarea.value;
  viewJsonStr.value = newValue;
};

// 设置自动补全
export const setAutoKey = (viewJsonStr: any, event: any) => {
  const textarea: any = document.getElementById("rightNum");
  if (event.key === "'" || event.key === '"') {
    event.preventDefault(); // 阻止默认行为
    const selectedText = textarea.value.substring(
      textarea.selectionStart,
      textarea.selectionEnd
    );
    const newText = `${event.key}` + selectedText + `${event.key}`;
    const cursorPosition = textarea.selectionStart + 1;
    textarea.value =
      textarea.value.substring(0, textarea.selectionStart) +
      newText +
      textarea.value.substring(textarea.selectionEnd);
    textarea.setSelectionRange(cursorPosition, cursorPosition);
  } else if (event.key === "(") {
    event.preventDefault(); // 阻止默认行为
    const selectedText = textarea.value.substring(
      textarea.selectionStart,
      textarea.selectionEnd
    );
    const newText = "(" + selectedText + ")";
    const cursorPosition = textarea.selectionStart + 1;
    textarea.value =
      textarea.value.substring(0, textarea.selectionStart) +
      newText +
      textarea.value.substring(textarea.selectionEnd);
    textarea.setSelectionRange(cursorPosition, cursorPosition);
  } else if (event.key === "[") {
    event.preventDefault(); // 阻止默认行为
    const selectedText = textarea.value.substring(
      textarea.selectionStart,
      textarea.selectionEnd
    );
    const newText = "[" + selectedText + "]";
    const cursorPosition = textarea.selectionStart + 1;
    textarea.value =
      textarea.value.substring(0, textarea.selectionStart) +
      newText +
      textarea.value.substring(textarea.selectionEnd);
    textarea.setSelectionRange(cursorPosition, cursorPosition);
  } else if (event.key === "{") {
    event.preventDefault(); // 阻止默认行为
    const selectedText = textarea.value.substring(
      textarea.selectionStart,
      textarea.selectionEnd
    );
    const newText = "{" + selectedText + "}";
    const cursorPosition = textarea.selectionStart + 1;
    textarea.value =
      textarea.value.substring(0, textarea.selectionStart) +
      newText +
      textarea.value.substring(textarea.selectionEnd);
    textarea.setSelectionRange(cursorPosition, cursorPosition);
  }
  viewJsonStr.value = textarea.value;
};
/*------------------------------------------------括号高亮------------------------------------------------------------*/
const findOpeningBracketIndex = (text: any, startIndex: any, char: any) => {
  const openingBrackets: { [key: string]: string } = {
    "]": "[",
    "}": "{",
    ")": "(",
  };
  let count = 0;
  for (let i = startIndex; i >= 0; i--) {
    if (text.charAt(i) === char) {
      count++;
    } else if (text.charAt(i) === openingBrackets[char]) {
      count--;
      if (count === 0) {
        return i;
      }
    }
  }
  return -1;
};

const findClosingBracketIndex = (text: any, startIndex: any, char: any) => {
  const closingBrackets: { [key: string]: string } = {
    "[": "]",
    "{": "}",
    "(": ")",
  };
  let count = 0;
  for (let i = startIndex; i < text.length; i++) {
    if (text.charAt(i) === char) {
      count++;
    } else if (text.charAt(i) === closingBrackets[char]) {
      count--;
      if (count === 0) {
        return i;
      }
    }
  }
  return -1;
};
const isBracket = (char: string) => {
  return ["[", "]", "{", "}", "(", ")"].includes(char);
};
// 点击括号寻找对应另一半
export const handleClick = () => {
  const textarea: any = document.getElementById("rightNum");
  const { selectionStart, value } = textarea;
  const clickedChar = value.charAt(selectionStart);
  if (isBracket(clickedChar)) {
    const openingBracketIndex = findOpeningBracketIndex(
      value,
      selectionStart,
      clickedChar
    );
    const closingBracketIndex = findClosingBracketIndex(
      value,
      selectionStart,
      clickedChar
    );
    if (openingBracketIndex !== -1) {
      textarea.setSelectionRange(openingBracketIndex, openingBracketIndex + 1);
    } else if (closingBracketIndex !== -1) {
      textarea.setSelectionRange(closingBracketIndex, closingBracketIndex + 1);
    }
  }
};
/*键盘事件*/
export function handleClickEnter(viewJsonStr: any, event: any) {
  if (event.key == "Enter") {
    const textarea = event.target;
    const cursorPosition: any = textarea.selectionStart; // 获取光标位置
    const value = textarea.value;
    if (
      (value[cursorPosition - 1] === "{" && value[cursorPosition] == "}") ||
      (value[cursorPosition - 1] === "[" && value[cursorPosition] == "]")
    ) {
      textarea.value =
        value.slice(0, cursorPosition) + "\n" + value.slice(cursorPosition);
      textarea.setSelectionRange(cursorPosition, cursorPosition);
      viewJsonStr.value = textarea.value;
      // 将光标移动到插入的空格后面
      setTimeout(() => {
        handleTabKey(syntheticEvent);
      }, 30);
    }
  }
}
// 新建tab按键对象
const syntheticEvent = new KeyboardEvent("keydown", {
  key: "Tab",
});
// 按下tab键时的操作
export const handleTabKey = (event: any) => {
  const textarea: any = document.getElementById("rightNum");
  const { selectionStart, selectionEnd } = textarea;
  const tabSpaces = "    "; // 4 spaces
  event.preventDefault();
  // 在当前光标位置插入4个空格
  textarea.value =
    textarea.value.substring(0, selectionStart) +
    tabSpaces +
    textarea.value.substring(selectionEnd);
  // 将光标向右移动4个空格
  textarea.selectionStart = selectionStart + tabSpaces.length;
  textarea.selectionEnd = selectionStart + tabSpaces.length;
};

// 按下Backspace按键时
export function handleBackspace(viewJsonStr: any, event: any) {
  const textarea = event.target;
  const cursorPosition = textarea.selectionStart;
  const textBeforeCursor = viewJsonStr.value.slice(0, cursorPosition);
  const textAfterCursor = viewJsonStr.value.slice(cursorPosition);
  if (
    (textBeforeCursor.endsWith('"') && textAfterCursor.startsWith('"')) ||
    (textBeforeCursor.endsWith("'") && textAfterCursor.startsWith("'")) ||
    (textBeforeCursor.endsWith("[") && textAfterCursor.startsWith("]")) ||
    (textBeforeCursor.endsWith("{") && textAfterCursor.startsWith("}")) ||
    (textBeforeCursor.endsWith("(") && textAfterCursor.startsWith(")"))
  ) {
    event.preventDefault(); // 阻止默认的删除行为
    viewJsonStr.value =
      textBeforeCursor.slice(0, -1) + textAfterCursor.slice(1);
    nextTick(() => {
      textarea.selectionStart = cursorPosition - 1;
      textarea.selectionEnd = cursorPosition - 1;
    }).then(() => {});
  }
}

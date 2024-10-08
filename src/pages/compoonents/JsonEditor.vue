<!--JsonEditor.vue-->
<template>
  <div ref="center" id="editor_body">
    <div style="height: 80%">
      <div class="tool_slider">
        <div style="display: flex; align-items: center">
          <v-icon
            class="icon_hover"
            title="格式化"
            icon="mdi-format-align-right"
            @click="prettyFormat(viewJsonStr)"
          ></v-icon>
          <div
            style="height: 18px; border: 1px solid #858585; margin: 0 3px"
          ></div>
          <v-icon
            class="icon_hover"
            title="去除空格"
            icon="mdi-tray-remove"
            @click="viewJsonStr = viewJsonStr.replace(/\s+/g, '')"
          ></v-icon>
          <div
            style="height: 18px; border: 1px solid #858585; margin: 0 3px"
          ></div>
          <v-icon
            class="icon_hover"
            title="保存"
            icon="mdi-content-save"
            @click="done"
          ></v-icon>
        </div>
        <div style="display: flex; align-items: center">
          <v-icon
            v-if="isPass"
            icon="mdi-check"
            color="primary"
            title="格式正确"
          ></v-icon>
          <v-icon
            v-else
            icon="mdi-close"
            color="error"
            title="格式错误"
          ></v-icon>
        </div>
      </div>
      <div class="edit-container">
        <textarea
          wrap="off"
          cols="1"
          id="leftNum"
          disabled
          onscroll="document.getElementById('rightNum').scrollTop = this.scrollTop;"
        ></textarea>
        <textarea
          ref="myTextarea"
          id="rightNum"
          style="width: 100%"
          placeholder="请输入JSON字符串"
          onscroll="document.getElementById('leftNum').scrollTop = this.scrollTop;"
          :value="viewJsonStr"
          @click="handleClick"
          @input="handleTextareaInput1"
        />
      </div>
    </div>
    <div id="console">{{ jsonObj }}</div>
  </div>
</template>

<script lang="ts" setup>
import { clone } from "radash";
import {
  handleBackspace,
  handleClick,
  handleClickEnter,
  handleTabKey,
  handleTextareaInput,
  setAutoKey,
} from "@/hooks/jsonEditor";

const emit = defineEmits(["done"]);

const props = defineProps({
  json: {
    type: String,
    default: "",
  },
  width: {
    type: String,
    default: "1000px",
  },
  height: {
    type: String,
    default: "400px",
  },
});

const viewJsonStr = ref("");

const editorWidth: any = ref(JSON.parse(JSON.stringify(props.width)));
const editorHeight: any = ref(JSON.parse(JSON.stringify(props.height)));

watch(
  () => props.json,
  (nv) => {
    viewJsonStr.value = nv;
    prettyFormat(viewJsonStr.value);
  }
);

// 自动补全
function handleTextareaInput1(event: any) {
  handleTextareaInput(viewJsonStr, event);
}

const isPass = ref(true);

function done() {
  calculateNum(viewJsonStr.value);
  emit("done", viewJsonStr.value);
}

const num = ref("");

function calculateNum(value: any) {
  if (!value) return;
  let lineBbj: any = document.getElementById("leftNum");
  num.value = "";
  let str = value;
  if (str === null || str === undefined) {
    str = "";
  }
  str = str.replace(/\r/gi, "");
  str = str.split("\n");
  let n = str.length;
  if (n.toString().length > 3) {
    lineBbj.style.width = n.toString().length * 10 + "px";
  } else {
    lineBbj.style.width = "30px";
  }

  for (let i = 1; i <= n; i++) {
    if (document.all) {
      num.value += i + "\r\n"; //判断浏览器是否是IE
    } else {
      num.value += i + "\n";
    }
  }
  lineBbj.value = num.value;
}

// 预览对象
const jsonObj = computed(() => {
  const str = clone(viewJsonStr.value);
  // 如果输入的全是数字，JSON.parse(str)不会报错，需要手动处理一下
  const onlyNumber = /^\d+$/.test(str);
  const dom = document.getElementById("console");
  function setColor(color: string) {
    if (dom) {
      dom.style.color = color;
    }
  }
  if (str) {
    try {
      if (onlyNumber) {
        setColor("red");
        isPass.value = false;
        return getCurrentTime() + str + " is not valid JSON";
      }
      setColor("black");
      isPass.value = true;
      if (JSON.parse(str)) {
        setColor("green");
        return `${getCurrentTime()}校验通过`;
      }
    } catch (e: any) {
      isPass.value = false;
      setColor("red");
      if (e.message?.match(/position\s+(\d+)/)) {
        const location = e.message?.match(/position\s+(\d+)/)[1];
        const str1 = str.substring(0, location).trim();
        const str2 = str1.split("\n");
        const message = e.message.substring(0, e.message.indexOf("position"));
        // 如果当前行或者前一行有'['
        if (str2[str2.length - 1]?.includes("[")) {
          const { line, column } = getLineAndColumn(str1, str1.length - 1);
          return `${message} at line ${line},column ${column}`;
        }
        const { line, column } = getLineAndColumn(str, location);
        return `${getCurrentTime()}${message} at line ${line},column ${column}`;
      } else {
        return getCurrentTime() + str + " is not valid JSON";
      }
    }
  } else {
    return null;
  }
});

// 获取当前时间
function getCurrentTime() {
  let now = new Date(); // 获取当前日期和时间
  let hours = now.getHours(); // 获取小时
  let minutes: string | number = now.getMinutes(); // 获取分钟
  let seconds: string | number = now.getSeconds(); // 获取秒
  let period = hours >= 12 ? "下午" : "上午"; // 判断是上午还是下午

  // 将小时转换为12小时制
  hours = hours % 12 || 12;

  // 格式化分钟和秒，确保它们是两位数
  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;

  // 构造最终的时间字符串
  let currentTime = period + hours + ":" + minutes + ":" + seconds;

  return "【" + currentTime + "】 ";
}

//计算错误信息所在行列
function getLineAndColumn(str: string, index: number) {
  let line = 1;
  let column = 1;
  for (let i = 0; i < index; i++) {
    if (str[i] === "\n") {
      line++;
      column = 1;
    } else {
      column++;
    }
  }
  return { line, column };
}

//json格式美化
function prettyFormat(str: string) {
  try {
    // 设置缩进为2个空格
    str = JSON.stringify(JSON.parse(str), null, 2);
    str = str.replace(/&/g, "&").replace(/</g, "<").replace(/>/g, ">");
    viewJsonStr.value = str.replace(
      // eslint-disable-next-line no-useless-escape
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
      function (match) {
        return match;
      }
    );
  } catch (e) {
    console.log("异常信息:" + e);
  }
}

const center = ref();
const isFullScreen = ref(false);

// 添加或删除全屏属性

function fullScreen() {
  if (center.value) {
    if (center.value.className.includes("fullScreen")) {
      editorHeight.value = JSON.parse(JSON.stringify(props.height));
      editorWidth.value = JSON.parse(JSON.stringify(props.width));
      center.value.className = center.value.className.replace(
        " fullScreen",
        ""
      );
      isFullScreen.value = false;
    } else {
      editorHeight.value = "100vh";
      editorWidth.value = "100vw";
      center.value.className += " fullScreen";
      isFullScreen.value = true;
    }
  }
}

const myTextarea: any = ref(null);

function handleKeyDown(event: any) {
  if (myTextarea.value) {
    if (event.key === "Backspace") {
      handleBackspace(viewJsonStr, event);
    } else if (event.key === "Enter") {
      handleClickEnter(viewJsonStr, event);
    } else if (event.key === "Tab") {
      handleTabKey(event);
    } else if (event.key === "Escape") {
      if (isFullScreen.value) {
        fullScreen();
      }
    }
  }
}

// 符号自动补全以及选中文本后输入符号自动包裹
function getMouseCheck(event: any) {
  setAutoKey(viewJsonStr, event);
}

onMounted(() => {
  window.addEventListener("keydown", handleKeyDown);
  document.addEventListener("keydown", getMouseCheck);
  calculateNum(props.json);
});
onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleKeyDown);
  document.removeEventListener("keydown", getMouseCheck);
});
</script>

<style scoped lang="scss">
#editor_body {
  width: 100%;
  height: calc(100vh - 56px);
  font-size: 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  padding: 5px;
  box-sizing: border-box;
}
.tool_slider {
  padding-left: 5px;
  padding-right: 5px;
  display: flex;
  width: 100%;
  box-sizing: border-box;
  justify-content: space-between;
  align-items: center;
  height: 25px;
  border: 1px solid #d9d9d9;
  border-bottom: 0;
}
.icon_hover {
  height: 20px;
  width: 20px;
  cursor: pointer;
  &:hover {
    color: #5c82ff;
  }
}

#leftNum {
  overflow: hidden;
  padding: 3px 2px;
  height: 100%;
  width: 30px;
  line-height: 22px;
  font-size: 13px;
  color: rgba(0, 0, 0, 0.25);
  font-weight: bold;
  resize: none;
  text-align: center;
  outline: none;
  border: 0;
  background: #f5f7fa;
  box-sizing: border-box;
  border-right: 1px solid;
  font-family: 微软雅黑;
}

#rightNum {
  white-space: nowrap;
  height: 100%;
  padding: 3px;
  line-height: 22px;
  box-sizing: border-box;
  resize: none;
  border: 0;
  font-family: 微软雅黑;
  &::-webkit-scrollbar {
    width: 5px;
    height: 5px;
    background-color: #efeae6;
  }
  &:focus-visible {
    outline: none;
  }
  &:hover {
    border: 0;
  }
  &:focus {
    border: 0;
  }
}

.leftBox {
  height: 100%;
  text-align: left;
}

.edit-container {
  height: calc(100% - 25px);
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #d9d9d9;
  display: flex;
}

.fullScreen {
  position: fixed;
  z-index: 9999;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: #f5f7fa;
}
#console {
  padding: 12px;
  box-sizing: border-box;
  height: calc(20% - 5px);
  margin-top: 5px;
  width: 100%;
  background-color: white;
  border: 1px solid #d9d9d9;
  overflow: auto;
  font-family: 微软雅黑;
  text-align: left;
}
</style>

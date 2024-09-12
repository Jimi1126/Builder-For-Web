<template>
  <div class="project-experience" ref="draggableEl">
    <template v-for="(item, i) in config.items" :key="i">
      <div class="border card">
        <div class="title">
          <input
            :value="item.project"
            placeholder="项目名称"
            @input="debounceInputEvt($event, i, 'project')"
          />
          <input
            :value="item.date"
            placeholder="项目时间"
            @input="debounceInputEvt($event, i, 'date')"
          />
        </div>
        <div class="technology-stack">
          <textarea
            v-show="stackEditable[i] || !item.stack"
            :value="item.stack"
            placeholder="技术栈"
            rows="1"
            @blur="stackEditable[i] = false"
            @input="autoResize($event, i, 'stack')"
          ></textarea>
          <div
            class="stack-chip"
            v-show="!stackEditable[i] && item.stack"
            @dblclick="setStackEditable($event, i)"
          >
            <v-chip
              v-for="(tag, i) in getTags(item.stack)"
              :key="i"
              size="small"
              density="comfortable"
              >{{ tag }}</v-chip
            >
          </div>
        </div>
        <div class="content">
          <span class="content-title">项目描述：</span>
          <textarea
            ref="textareaRefs"
            :value="item.details"
            placeholder="项目描述"
            rows="1"
            @input="autoResize($event, i, 'details')"
          ></textarea>
          <span class="content-title">项目职责：</span>
          <textarea
            ref="textareaRefs"
            :value="item.duty"
            placeholder="项目职责"
            rows="1"
            @input="autoResize($event, i, 'duty')"
          ></textarea>
          <span class="content-title">项目绩效：</span>
          <textarea
            ref="textareaRefs"
            :value="item.performance"
            placeholder="项目绩效"
            rows="1"
            @input="autoResize($event, i, 'performance')"
          ></textarea>
        </div>
        <div v-if="!preview" class="card-actions">
          <v-icon
            color="primary"
            icon="mdi-plus"
            size="small"
            @click="addItem(i)"
          ></v-icon>
          <v-icon
            color="primary"
            icon="mdi-minus"
            size="small"
            @click="delItem(i)"
          ></v-icon>
        </div>
      </div>
    </template>
  </div>
</template>
<script lang="ts">
import { useWorkshopImmer } from "@/hooks/immer";
import useMyDraggable from "@/hooks/myDraggable";
import { DefaultFlowtAttr } from "@/pages/attrDefined";
import type { DropCopmonent } from "@/workshop";
import { debounce } from "radash";

export const componentInfo = {
  code: "ProjectExperience",
  label: "项目经历",
  icon: "mdi-page-layout-header",
  path: "resume",
  type: "flow",
  attrs: {
    style: new DefaultFlowtAttr({
      width: 100,
    }),
  },
  config: {
    items: [{}],
  },
};
export default {
  props: ["id", "events", "config", "preview"],
  setup(props) {
    const { setSheetState } = useWorkshopImmer();
    const stackEditable = ref<boolean[]>([]);
    const textareaRefs: Ref<HTMLTextAreaElement[]> = ref([]);

    function getTags(stack: string) {
      return stack
        ? stack.match(/'.+?'/g)?.map((tag: string) => tag.replace(/'/g, ""))
        : [];
    }

    function setStackEditable(e: any, i: number) {
      stackEditable.value[i] = true;
      const textareaEl = e.currentTarget.parentElement.firstChild;
      nextTick(() => {
        textareaEl.focus();
        // const selection = window.getSelection() as Selection;
        // const range = document.createRange();
        // range.selectNodeContents(textareaEl.text);
        // selection.removeAllRanges();
        // selection.addRange(range);
      });
    }

    function autoResize(e: any, i: number, filed: string) {
      e.target.style.height = "auto";
      e.target.style.height = e.target.scrollHeight + "px";
      debounceInputEvt(e, i, filed);
    }

    function addItem(i: number) {
      setSheetState((draft: any) => {
        const dropcomponent = draft.dropComponents.find(
          (dc: DropCopmonent) => dc.id == props.id
        );
        if (!dropcomponent) return;
        dropcomponent.config.items.splice(i + 1, 0, {
          id: new Date().getTime(),
        });
      });
    }

    function delItem(i: number) {
      setSheetState((draft: any) => {
        const dropcomponent = draft.dropComponents.find(
          (dc: DropCopmonent) => dc.id == props.id
        );
        if (!dropcomponent) return;
        dropcomponent.config.items.splice(i, 1);
      });
    }

    function inputEvt(e: any, index: number, field: string) {
      setSheetState((draft: any) => {
        const dropcomponent = draft.dropComponents.find(
          (dc: DropCopmonent) => dc.id == props.id
        );
        if (!dropcomponent) return;
        dropcomponent.config.items[index][field] = e.target.value;
      });
    }
    const debounceInputEvt = debounce(
      {
        delay: 500,
      },
      inputEvt
    );

    const { draggableEl } = useMyDraggable(props.config.items);

    return {
      getTags,
      stackEditable,
      textareaRefs,
      setStackEditable,
      autoResize,
      addItem,
      delItem,
      debounceInputEvt,
      draggableEl,
    };
  },
  mounted() {
    this.textareaRefs.forEach((itemRef) => {
      itemRef.style.height = "auto";
      itemRef.style.height = itemRef.scrollHeight + "px";
    });
  },
};
</script>
<style lang="scss" scoped>
div.project-experience {
  padding: 0 var(--resume-padding);
  display: flex;
  flex-direction: column;
  gap: var(--theme-display-gap);

  .card {
    position: relative;
    display: flex;
    flex-direction: column;
    padding: 12px 14px;
    gap: 4px;

    .title {
      display: grid;
      grid-template-columns: 1.5fr 1fr;
      gap: var(--theme-display-gap);
      & > input:nth-child(2n) {
        justify-self: end;
        text-align: end;
      }
      input {
        font-size: 16px;
        font-weight: 600;
        color: var(--theme-bg-color);
      }
    }
    .technology-stack {
      .stack-chip {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: calc(var(--theme-display-gap) / 2);
        margin: 4px 0;

        .v-chip {
          color: var(--theme-bg-color);
          background-color: var(--theme-color);
        }
      }
    }
    .content {
      display: grid;
      grid-template-columns: max-content auto;
      row-gap: 4px;

      .content-title {
        font-weight: 600;
      }
    }

    .card-actions {
      display: none;
      position: absolute;
      top: 100%;
      right: 0;

      i:hover {
        cursor: pointer;
      }
    }
    &:hover {
      .card-actions {
        display: block;
      }
    }
  }
}
</style>

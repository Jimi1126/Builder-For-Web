<!-- eslint-disable vue/no-mutating-props -->
<template>
  <VueDraggable
    v-model="config.items"
    :animation="150"
    target="#draggable-timeline"
    handle=".handle"
  >
    <v-timeline class="work-experience" side="end" id="draggable-timeline">
      <v-timeline-item
        v-for="(item, i) in config.items"
        :key="item.company"
        :dot-color="workshopStore.snapshot.theme"
      >
        <template v-slot:icon>
          <v-icon icon="mdi-domain"></v-icon>
        </template>
        <div class="handle border card">
          <div class="title">
            <input
              class="name"
              :value="item.company"
              placeholder="XXXX公司"
              @input="debounceEdit($event, i, 'company')"
            />
            <input
              class="job"
              :value="item.position"
              placeholder=""
              @input="debounceEdit($event, i, 'position')"
            />
          </div>
          <textarea
            ref="textareaRefs"
            :value="item.details"
            rows="1"
            placeholder="1. 负责 XXX 项目开发；2. 主导 XXX 平台建设；..."
            @input="autoResize($event, i)"
          ></textarea>
          <div v-if="!preview" class="card-actions">
            <v-icon
              color="primary"
              icon="mdi-arrow-up"
              size="small"
              @click="upItem(i)"
            ></v-icon>
            <v-icon
              color="primary"
              icon="mdi-arrow-down"
              size="small"
              @click="downItem(i)"
            ></v-icon>
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
      </v-timeline-item>
    </v-timeline>
  </VueDraggable>
</template>
<script lang="ts">
import { useWorkshopImmer } from "@/hooks/immer";
import { DefaultFlowtAttr } from "@/pages/attrDefined";
import { useWorkshopStore } from "@/stores/workshop";
import type { DropCopmonent } from "@/workshop";
import { debounce } from "radash";

export const componentInfo = {
  code: "WorkExperience",
  label: "工作经历",
  icon: "mdi-page-layout-header",
  path: "resume",
  type: "flow",
  attrs: {
    style: new DefaultFlowtAttr({
      width: 100,
    }),
  },
  config: {
    items: [
      {
        company: "",
        position: "",
        details: "",
      },
    ],
  },
};
export default {
  props: ["id", "events", "config", "preview"],
  setup(props) {
    const workshopStore = useWorkshopStore();
    const { setSheetState } = useWorkshopImmer();

    const textareaRefs: Ref<HTMLTextAreaElement[]> = ref([]);
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

    function upItem(i: number) {
      setSheetState((draft: any) => {
        const dropcomponent = draft.dropComponents.find(
          (dc: DropCopmonent) => dc.id == props.id
        );
        if (!dropcomponent) return;
        const items: any[] = dropcomponent.config.items;
        if (i) {
          [items[i], items[i - 1]] = [items[i - 1], items[i]];
        } else {
          [items[i], items[items.length - 1]] = [
            items[items.length - 1],
            items[i],
          ];
        }
      });
    }

    function downItem(i: number) {
      setSheetState((draft: any) => {
        const dropcomponent = draft.dropComponents.find(
          (dc: DropCopmonent) => dc.id == props.id
        );
        if (!dropcomponent) return;
        const items: any[] = dropcomponent.config.items;
        if (i == items.length - 1) {
          [items[0], items[i]] = [items[i], items[0]];
        } else {
          [items[i], items[i + 1]] = [items[i + 1], items[i]];
        }
      });
    }

    function autoResize(e: any, i: number) {
      e.target.style.height = "auto";
      e.target.style.height = e.target.scrollHeight + "px";
      debounceEdit(e, i, "details");
    }

    function endEdit(e: any, index: number, field: string) {
      setSheetState((draft: any) => {
        const dropcomponent = draft.dropComponents.find(
          (dc: DropCopmonent) => dc.id == props.id
        );
        if (!dropcomponent) return;
        dropcomponent.config.items[index][field] = e.target.value;
      });
    }
    const debounceEdit = debounce(
      {
        delay: 500,
      },
      endEdit
    );

    return {
      workshopStore,
      autoResize,
      addItem,
      delItem,
      upItem,
      downItem,
      debounceEdit,
      textareaRefs,
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
div.work-experience {
  grid-template-columns: 0 min-content 1fr;
  gap: var(--resume-component-gap);
  padding: 0 var(--resume-padding);
  :deep(.v-timeline-item__body) {
    width: 100%;
  }
  .title {
    display: grid;
    grid-template-columns: 1.5fr 1fr;
    gap: var(--theme-display-gap);
    margin-bottom: var(--theme-display-gap);
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

  :deep(.v-timeline-divider__inner-dot) {
    .v-icon {
      color: var(--theme-color);
    }
  }

  .card {
    position: relative;
    padding: 12px 14px;

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

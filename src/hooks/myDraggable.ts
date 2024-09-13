import { useDraggable } from "vue-draggable-plus";

export default function useMyDraggable(items: any = [], selector?: string) {
  const draggableEl = selector || ref();
  items.forEach((item: any, i: any) => (item.id = item.id || i));
  const draggableFun = useDraggable(draggableEl, items, {
    animation: 150,
  });
  return { draggableEl, ...draggableFun };
}

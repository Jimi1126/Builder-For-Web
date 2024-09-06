import restful from "@/api";
import { useWorkshopStore } from "@/stores/workshop";
import { useRequest } from "alova";

const workshopStore = useWorkshopStore();

function downloadPDF() {
  useRequest(restful.getPdf(JSON.stringify(workshopStore.snapshot)));
}

export function useDownload() {
  return { downloadPDF };
}

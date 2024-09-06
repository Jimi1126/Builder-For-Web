import { defaultAlova } from "./alova";

const restful = {};

restful.getPdf = (config) =>
  defaultAlova.Post(
    `/pdf`,
    { config },
    {
      // 开启下载进度
      enableDownload: true,
      responseType: "blob",
    }
  );

export default restful;

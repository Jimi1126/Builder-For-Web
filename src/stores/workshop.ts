import type { WorkshopVariable, DropCopmonent } from "@/workshop";
import { defineStore } from "pinia";
import { SHEET_MODE } from "@/constant/enum";
import * as AttrDefined from "@/pages/attrDefined";
import { WORKSHOP_LOCALSTORAGE_KEY } from "@/constant/variable";

function createInstanceByName(jsonProps: AttrDefined.BaseAttr) {
  //@ts-ignore
  const ClassType = AttrDefined[jsonProps.className];
  if (ClassType) {
    return new ClassType(jsonProps);
  } else {
    return jsonProps;
  }
}

const globalAttr = new AttrDefined.GlobalAttr({
  width: 100,
  fontSize: 16,
});

let localSnapshot: any;

const defaultSnapshot = {
  mode: "resume",
  theme: "#000000",
  gridLine: false,
  suffix: "%",
  globalAttr: {
    width: "820px",
    height: "",
    fontFamily: "KaiTi_GB2312",
    fontSize: 14,
    position: "relative",
    zoom: "100",
    aspectRatio: "",
    color: "#000000",
    lineHeight: "",
    rotate: "",
    opacity: "",
    fontWeight: "",
  },
  dropComponents: [
    {
      code: "Header",
      label: "简历头部",
      icon: "mdi-page-layout-header",
      path: "resume",
      type: "resume",
      attrs: {
        style: {
          width: "100%",
          height: "fit-content",
          className: "DefaultFlowtAttr",
          fontFamily: "KaiTi_GB2312",
          zIndex: 2,
        },
      },
      config: {
        name: "谢福清",
        job: "前端开发工程师",
        labels: [
          { type: "text", text: "男/1994.06", icon: null, link: "", id: 0 },
          {
            type: "text",
            text: "主页",
            icon: "mdi-home-account",
            link: "https://jimi1126.cn/",
            id: 1,
          },
          { text: "青岛科技大学/集成电路设计与集成系统", id: 2 },
          {
            text: "jimi1126_mid@163.com",
            icon: "mdi-email",
            link: "mailto:jimi1126_mid@163.com",
            id: 3,
          },
          { text: "本科/2016年毕业", id: 4 },
          { text: "18269668884", icon: "mdi-cellphone", id: 5 },
        ],
      },
      id: 1714492602587,
    },
    {
      code: "ModuleTitle",
      label: "模块标题",
      icon: "mdi-page-layout-header",
      path: "resume",
      type: "flow",
      attrs: {
        style: {
          width: 100,
          height: "fit-content",
          className: "DefaultFlowtAttr",
          fontFamily: "KaiTi_GB2312",
          zIndex: 2,
        },
      },
      config: { title: "个人优势" },
      id: 1725606306529,
    },
    {
      code: "SortList",
      label: "列表",
      icon: "mdi-page-layout-header",
      path: "resume",
      type: "flow",
      attrs: {
        style: {
          width: 100,
          height: "fit-content",
          className: "DefaultFlowtAttr",
          fontFamily: "KaiTi_GB2312",
          zIndex: 2,
        },
      },
      config: {
        content:
          "1. 我拥有 7 年软件开发经验，拥有管理系统、开发平台、微信H5等多个项目的成功经验；\n2. 我多次担任项目前端负责人，主导前端项目的建设与改造，有团队带领经验；\n3. 我擅长 Web 开发，精通 JS/HTML/CSS/Vue，熟悉使用 TS ，了解 React、Threejs 等框架；\n4. 我熟悉使用 Webpack、Vite 等构建工具，有前端工程化、性能优化等经验；\n5. 我熟悉 HTTP、浏览器工作原理，有代码调试、问题排查、实战经验；\n6. 我熟悉使用 Node.js、Java，有后端服务实战经验。",
      },
      id: 1725606355301,
    },
    {
      code: "ModuleTitle",
      label: "模块标题",
      icon: "mdi-page-layout-header",
      path: "resume",
      type: "flow",
      attrs: {
        style: {
          width: 100,
          height: "fit-content",
          className: "DefaultFlowtAttr",
          fontFamily: "KaiTi_GB2312",
          zIndex: 2,
        },
      },
      config: { title: "工作经历" },
      id: 1714541086353,
    },
    {
      code: "WorkExperience",
      label: "工作经历",
      icon: "mdi-page-layout-header",
      path: "resume",
      type: "flow",
      attrs: {
        style: {
          width: 100,
          height: "fit-content",
          className: "DefaultFlowtAttr",
          fontFamily: "KaiTi_GB2312",
          zIndex: 2,
        },
      },
      config: {
        items: [
          {
            company: "待业（2023.02-至今）",
            position: "",
            color: "#E0E0E0",
            details:
              "由于 2022 年底家里父亲生病以及老婆生产，都需要人来照顾，只能从公司离职。这段时间我进入奶爸角色，不过我并没有舍弃前端工程师这个角色，我依然热爱前端的开发，有空闲时间我也会关注前端资讯，研究前端技术。",
            id: 0,
          },
          {
            details:
              "1. 带领 2 人团队进行罗氏 DCP 二期各应用从 0 到 1 建设，完成 5 个应用交付，实现 70% 需求点；\n2. 带领 14 人团队完成中烟 FSSC 项目的改造与建设，实施前端工程化，协调资源，如期完成项目；\n3. 带领 2 人团队完成中烟 FINF 项目 H5 应用从 0 到 1 建设，解决多端认证问题，完成多次迭代；\n4. 参与 SmartApp 项目模块开发，任务紧急，高强度工作完成任务，编写设计文档供维护；",
            company: "德勤咨询（广州）有限公司（2021.07-2023.02）",
            position: "高级前端开发工程师",
            id: 1,
          },
          {
            company: "中国中药控股有限公司（2019.08-2021.07）",
            position: "中级前端开发工程师",
            details:
              "1. 负责 TCM 3.0 开发平台前端建设，实施前端工程化，大大减短开发周期与提升用户体验；\n2. 编写代码生成器 CLI，进一步贯彻前后端分离与减少开发工作量；\n3. 主导远程订单系统开发，通过引入 3.0 平台，相对于传统开发，有效减少 30% 工作量与 50% 出错率，项目为子公司节约 80w+ 成本；\n4. 参与自研系统开发与用友 NC 系统二次开发，完成接近 50 项指标，协助部门完成年度目标；",
            id: 2,
          },
          {
            company: "珠海汇流信息技术有限公司（2018.11-2019.08）",
            position: "JavaScript开发工程师",
            details:
              "1. 主导合众人寿契约客制化开发，协调资源，项目紧急，高强度完成，为客户处理超 2k 份数据；\n2. 主导 OCR 平台从 0 到 1 建设，对接 OCR 系统，提供数据录入与数据校验，为公司节约成本；",
            id: 3,
          },
          {
            company: "珠海远光软件股份有限公司 (2016.07-2018.10)",
            position: "Java开发工程师",
            details:
              "1. 担任部门前后端分离开发试点项目的前端负责人，完成试点项目的开发，并成功上线；\n2. 参与基于 ECP 开发平台的自研软件开发，通过公司 ECP 平台考核，负责日常开发与维护工作。",
            id: 4,
          },
        ],
      },
      id: 1714541658159,
    },
    {
      code: "ModuleTitle",
      label: "模块标题",
      icon: "mdi-page-layout-header",
      path: "resume",
      type: "flow",
      attrs: {
        style: {
          width: 100,
          height: "fit-content",
          className: "DefaultFlowtAttr",
          fontFamily: "KaiTi_GB2312",
          zIndex: 2,
        },
      },
      config: { title: "项目经历" },
      id: 1714559698867,
    },
    {
      code: "ProjectExperience",
      label: "项目经历",
      icon: "mdi-page-layout-header",
      path: "resume",
      type: "flow",
      attrs: {
        style: {
          width: 100,
          height: "fit-content",
          className: "DefaultFlowtAttr",
          fontFamily: "KaiTi_GB2312",
          zIndex: 2,
        },
      },
      config: {
        items: [
          {
            project: "China Digital Core Portal 二期",
            date: "2022.06-2022.12",
            stack:
              "'Vue2' 'Element UI' 'Vant' 'Sass' 'ES6' 'Webpack' 'Gigya' 'GitLab' 'Dice' 'Swagger-ui'",
            details:
              "DCP 是罗氏制药的一站式门户平台。二期项目旨在基于罗氏现有资源，建立数字平台和客户门户。主要内容包括标签管理、锐医同行平台、电子签到应用 、安全罗盘业务应用。安全罗盘可方便 CRM HCP 和内部员工通过锐医公众号查询罗氏产品信息。“电子签到”实现参会用户及内部员工快速进行会议签到，是 EBPG 在 Event 业务中重要的功能之一。公共标签管理应用主要包括标签规格的存储及权限维护，并对第三方应用提供对外调用接口。锐医同行平台涵盖会议发布、内容发布、客户管理、销售管理等核心业务场景。",
            duty: "担任前端负责人，主导各应用的前端建设与接入 DCP 系统。实施前端工程化，对接各方资源完成产品 PRD 评审、页面埋点、联调&自测、程序修复、服务部署、编写技术文档等工作。",
            performance:
              "按计划完成公共标签管理 PC、电子签到 PC/H5 、安全罗盘 PC/H5 上线，完成 70% 需求点",
            id: 0,
          },
          {
            project: "FSSC-中烟智能财务共享平台",
            date: "2021.10-2022.06",
            stack:
              "'Vue2' 'Ant-Design-vue' 'Sass' 'ES6' 'Webpack' 'Jwt' 'GitLab' 'Nginx' 'Jenkins' 'Swagger-ui'",
            details:
              "中烟智能财务共享平台为中烟财务报账系统全新平台，平台相比旧系统做出了全面升级，引入许多新特性，如流程编辑器、表单编辑器、数据大屏等，使财务报账单处理将更加高效。平台提供工作台、质检、绩效、派工规则定义、工单管理、影像管理、流程管理、报账管理、档案管理、信用管理、资金管理等功能。",
            duty: "担任前端负责人，主导项目前端改造与建设。指导项目成员完成页面改造，对接各方资源完成产品 PRD 评审、任务排期、联调&自测、程序修复、服务部署、编写技术文档等工作。",
            performance:
              "按计划完成系统交付；封装公共组件，提升 10% 开发效率；通过项目提升了协调能力与管理能力。",
            id: 1,
          },
          {
            project: "SmartApp 后端管理员系统",
            date: "2021.07-2021.10",
            stack:
              "'Vue3' 'Ant-Design-vue' 'Sass' 'ES6' 'Webpack' 'Eslint' 'Jwt' 'Swagger-ui' 'GitLab' 'DevOps'",
            details:
              "该系统提供了 SmartApp 的维护与管理功能，包括首页、动态/文章管理、话题管理、活动管理、社群活动中心、问答管理、社群管理、展示管理、基础管理、用户管理、内容标签管理、统计分析、搜索管理、综合搜索、错误反馈&举报、内容审批管理、会话管理等，极大实现 SmartApp 的全方位管理。",
            duty: "负责社群管理、展示管理、页面布局等页面开发。由于中途加入，项目即将面临交付，开发任务紧迫，所以我先快速理解需求并列出任务排期表，有效跟踪开发进度与控制风险，然后快速熟悉项目与技术栈，最后通过高强度的工作按时完成任务。",
            performance:
              "按时完成紧急任务，通过项目提升了应变能力以及熟悉 Vue3 生态。",
            id: 2,
          },
          {
            project: "TCM 通用开发平台 3.0",
            date: "2020.03-2021.07",
            stack:
              "'Vue2' 'Ant-Design-Pro-of-Vue' 'Vant' 'Less' 'Node.js' 'ES6' 'Webpack' 'Eslint' 'Springboot' 'Jwt' 'Mybatis' 'Mysql' 'Redis' 'GitLab' 'Nginx' 'Jenkins' 'Jest'  'Swagger-ui' ",
            details:
              "在软件开发快速发展的背景下，部门为提供更优质的服务，启动通用开发平台 3.0 的研发。平台采用微服务架构，前后端分离开发模式，Git + Jenkins 做 CI/CD。平台提供单点登录、权限管理、任务调度、工作流、报表打印、文件管理、代码生成、补丁平台、服务管理、服务监控、CI/CD 等功能。",
            duty: "担任平台前端负责人，主导平台前端改造与建设，完成新特性引入、技术文档编写、前端技术预研、前端性能优化等工作，并为基于平台的业务系统提供技术支持，指导同事平台搭建和使用。",
            performance:
              "平台评为年度优秀项目，并成功接入 6 个业务系统，为多家子公司节约成本。通过该项目对 Vue 生态、Web 开发、服务部署等领域有了更深刻的认识。",
            id: 3,
          },
        ],
      },
      id: 1714559710473,
    },
    {
      code: "WorkExperience",
      label: "工作经历",
      icon: "mdi-page-layout-header",
      path: "resume",
      type: "flow",
      attrs: {
        style: {
          width: 100,
          height: "fit-content",
          className: "DefaultFlowtAttr",
          fontFamily: "KaiTi_GB2312",
          zIndex: 2,
        },
      },
      config: { items: [] },
      id: 1714637734178,
    },
  ],
};

try {
  localSnapshot = JSON.parse(
    localStorage.getItem(WORKSHOP_LOCALSTORAGE_KEY) as any
  );
  localSnapshot = localSnapshot || defaultSnapshot;
  localSnapshot.dropComponents = localSnapshot.dropComponents || [];
  localSnapshot.dropComponents.forEach((dropc: DropCopmonent) => {
    dropc.attrs.style = createInstanceByName(dropc.attrs.style);
  });
} catch (e) {
  console.log(e);
}

export const useWorkshopStore = defineStore("workshop", {
  state: (): WorkshopVariable => ({
    isClickComponent: false,
    activeIndex: -1,
    inverIndex: -1,
    changeCount: 0,
    spotStyles: [],
    globalFormFields: globalAttr.getFormFields(),
    formFields: [],
    dragComponentInfo: undefined,
    contextMenu: {
      visiable: false,
      left: "0px",
      top: "0px",
    },
    snapshot: localSnapshot || {
      mode: SHEET_MODE.RESUME,
      theme: "#212121",
      gridLine: true,
      suffix: "%",
      globalAttr: globalAttr,
      dropComponents: [],
    },
  }),
});

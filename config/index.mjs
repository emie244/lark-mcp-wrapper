/**
 * 配置文件
 * 从环境变量加载飞书应用凭证
 */

export const config = {
  // 飞书应用凭证
  appId: process.env.APP_ID || "",
  appSecret: process.env.APP_SECRET || "",
  
  // 飞书域名
  larkDomain: process.env.LARK_DOMAIN || "https://open.feishu.cn",
  
  // 任务相关配置（如果使用飞书任务功能）
  taskConfig: {
    // 默认任务清单ID（可选）
    defaultTasklistId: process.env.TASK_DEFAULT_TASKLIST_ID || "",
  },
};

// 配置校验
export function validateConfig() {
  if (!config.appId || !config.appSecret) {
    throw new Error(
      "Missing required environment variables: APP_ID and APP_SECRET"
    );
  }
}

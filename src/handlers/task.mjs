/**
 * 任务工具处理函数
 * 调用飞书任务 API
 */

import axios from "axios";
import { config } from "../../config/index.mjs";

// 获取 Tenant Access Token
async function getTenantAccessToken() {
  const response = await axios.post(
    `${config.larkDomain}/open-apis/auth/v3/tenant_access_token/internal`,
    {
      app_id: config.appId,
      app_secret: config.appSecret,
    }
  );

  if (response.data.code !== 0) {
    throw new Error(`Failed to get token: ${response.data.msg}`);
  }

  return response.data.tenant_access_token;
}

// 获取 User Access Token (通过 tenant_access_token 换取)
async function getUserAccessToken(tenantToken, userId) {
  try {
    const response = await axios.post(
      `${config.larkDomain}/open-apis/auth/v3/user_access_token`,
      {
        user_id: userId,
        user_id_type: "open_id",
      },
      {
        headers: {
          Authorization: `Bearer ${tenantToken}`,
        },
      }
    );

    if (response.data.code !== 0) {
      console.error("Failed to get user token:", response.data.msg);
      return null;
    }

    return response.data.data.access_token;
  } catch (error) {
    console.error("Error getting user token:", error.message);
    return null;
  }
}

// 飞书 API 请求封装
async function feishuRequest(method, endpoint, data = null) {
  const token = await getTenantAccessToken();
  // endpoint 应该不带 /open-apis 前缀
  const cleanEndpoint = endpoint.startsWith('/open-apis') ? endpoint : `/open-apis${endpoint}`;
  const url = `${config.larkDomain}${cleanEndpoint}`;
  
  console.error(`[API Request] ${method} ${url}`);

  try {
    const response = await axios({
      method,
      url,
      data,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.data.code !== 0) {
      console.error(`[API Error] ${response.data.code}: ${response.data.msg}`);
      throw new Error(`API error: ${response.data.msg}`);
    }

    return response.data.data;
  } catch (error) {
    if (error.response) {
      console.error(`[API Error] Status: ${error.response.status}`);
      console.error(`[API Error] Data:`, error.response.data);
    }
    throw error;
  }
}

// 创建任务
export async function createTask(args) {
  const { summary, description, due, members, tasklist_id, is_milestone, useUAT, user_id } = args;

  const taskData = {
    summary,
    description: description || "",
    is_milestone: is_milestone || false,
  };

  if (due) {
    taskData.due = due;
  }

  if (members && members.length > 0) {
    taskData.members = members;
  }

  // 如果有任务清单ID，添加到 tasklists
  if (tasklist_id || config.taskConfig.defaultTasklistId) {
    taskData.tasklists = [
      {
        tasklist_guid: tasklist_id || config.taskConfig.defaultTasklistId,
      },
    ];
  }

  try {
    // 获取 token
    let token;
    if (useUAT && user_id) {
      const tenantToken = await getTenantAccessToken();
      const userToken = await getUserAccessToken(tenantToken, user_id);
      token = userToken || tenantToken;
    } else {
      token = await getTenantAccessToken();
    }

    const response = await axios({
      method: "POST",
      url: `${config.larkDomain}/open-apis/task/v2/task`,
      data: { data: taskData },
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.data.code !== 0) {
      console.error("Task API error:", response.data);
      throw new Error(response.data.msg || "Unknown error");
    }

    return {
      content: [
        {
          type: "text",
          text: `任务创建成功！\n任务GUID: ${response.data.data?.task?.guid}\n标题: ${summary}`,
        },
      ],
    };
  } catch (error) {
    console.error("Create task error:", error.message);
    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", JSON.stringify(error.response.data));
    }
    return {
      content: [
        {
          type: "text",
          text: `创建任务失败: ${error.message}\n\n请检查:\n1. 飞书应用是否已发布\n2. 是否已开启任务功能权限\n3. 企业是否已启用飞书任务功能`,
        },
      ],
      isError: true,
    };
  }
}

// 获取任务列表
export async function listTasks(args) {
  const { tasklist_id, page_size = 50, page_token, completed } = args;

  let endpoint = `/open-apis/task/v2/task?page_size=${page_size}`;

  if (page_token) {
    endpoint += `&page_token=${page_token}`;
  }

  // 如果指定了任务清单
  if (tasklist_id) {
    endpoint += `&tasklist_guid=${tasklist_id}`;
  }

  const result = await feishuRequest("GET", endpoint);

  let tasks = result.items || [];

  // 按完成状态过滤
  if (completed !== undefined) {
    tasks = tasks.filter(
      (task) =>
        completed ? task.completed_at !== null : task.completed_at === null
    );
  }

  const taskList = tasks
    .map(
      (task) =>
        `- ${task.summary} ${task.completed_at ? "✅" : "⏳"} (${task.guid})`
    )
    .join("\n");

  return {
    content: [
      {
        type: "text",
        text: `任务列表（共 ${tasks.length} 条）：\n${taskList}`,
      },
    ],
  };
}

// 获取单个任务详情
export async function getTask(args) {
  const { task_guid } = args;

  const result = await feishuRequest(
    "GET",
    `/open-apis/task/v2/task/${task_guid}`
  );

  const task = result.task;

  const details = [
    `标题: ${task.summary}`,
    `描述: ${task.description || "无"}`,
    `状态: ${task.completed_at ? "已完成 ✅" : "进行中 ⏳"}`,
    `创建时间: ${new Date(parseInt(task.created_at)).toLocaleString()}`,
    task.due?.timestamp
      ? `截止时间: ${new Date(parseInt(task.due.timestamp)).toLocaleString()}`
      : "截止时间: 无",
    task.completed_at
      ? `完成时间: ${new Date(parseInt(task.completed_at)).toLocaleString()}`
      : "",
    `GUID: ${task.guid}`,
  ]
    .filter(Boolean)
    .join("\n");

  return {
    content: [
      {
        type: "text",
        text: details,
      },
    ],
  };
}

// 更新任务
export async function updateTask(args) {
  const { task_guid, summary, description, due, completed_at } = args;

  const updateData = {};

  if (summary !== undefined) updateData.summary = summary;
  if (description !== undefined) updateData.description = description;
  if (due !== undefined) updateData.due = due;
  if (completed_at !== undefined) updateData.completed_at = completed_at;

  const result = await feishuRequest(
    "PATCH",
    `/open-apis/task/v2/task/${task_guid}`,
    { data: updateData }
  );

  return {
    content: [
      {
        type: "text",
        text: `任务更新成功！\nGUID: ${task_guid}`,
      },
    ],
  };
}

// 删除任务
export async function deleteTask(args) {
  const { task_guid } = args;

  await feishuRequest("DELETE", `/open-apis/task/v2/task/${task_guid}`);

  return {
    content: [
      {
        type: "text",
        text: `任务删除成功！\nGUID: ${task_guid}`,
      },
    ],
  };
}

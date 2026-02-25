/**
 * 自定义任务工具定义
 * 基于飞书任务 API
 */

export const taskTools = [
  {
    name: "task_create",
    description: "创建任务（使用飞书任务功能）",
    inputSchema: {
      type: "object",
      properties: {
        summary: {
          type: "string",
          description: "任务标题",
        },
        description: {
          type: "string",
          description: "任务描述（可选）",
        },
        due: {
          type: "object",
          properties: {
            timestamp: {
              type: "string",
              description: "截止时间（毫秒时间戳）",
            },
            is_all_day: {
              type: "boolean",
              description: "是否全天任务",
            },
          },
        },
        members: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "string", description: "用户ID（open_id）" },
              role: {
                type: "string",
                enum: ["assignee", "follower"],
                description: "角色",
              },
            },
            required: ["id", "role"],
          },
          description: "任务成员列表",
        },
        tasklist_id: {
          type: "string",
          description: "任务清单ID（可选，使用默认清单）",
        },
        is_milestone: {
          type: "boolean",
          description: "是否为里程碑",
        },
      },
      required: ["summary"],
    },
  },
  {
    name: "task_list",
    description: "获取任务列表",
    inputSchema: {
      type: "object",
      properties: {
        tasklist_id: {
          type: "string",
          description: "任务清单ID（可选）",
        },
        page_size: {
          type: "number",
          description: "每页数量（默认50，最大100）",
        },
        page_token: {
          type: "string",
          description: "分页token（可选）",
        },
        completed: {
          type: "boolean",
          description: "是否只查询已完成/未完成任务",
        },
      },
    },
  },
  {
    name: "task_get",
    description: "获取单个任务详情",
    inputSchema: {
      type: "object",
      properties: {
        task_guid: {
          type: "string",
          description: "任务GUID",
        },
      },
      required: ["task_guid"],
    },
  },
  {
    name: "task_update",
    description: "更新任务",
    inputSchema: {
      type: "object",
      properties: {
        task_guid: {
          type: "string",
          description: "任务GUID",
        },
        summary: {
          type: "string",
          description: "任务标题",
        },
        description: {
          type: "string",
          description: "任务描述",
        },
        due: {
          type: "object",
          properties: {
            timestamp: {
              type: "string",
              description: "截止时间（毫秒时间戳）",
            },
            is_all_day: {
              type: "boolean",
              description: "是否全天任务",
            },
          },
        },
        completed_at: {
          type: "string",
          description: "完成时间（毫秒时间戳），传入即标记为完成",
        },
      },
      required: ["task_guid"],
    },
  },
  {
    name: "task_delete",
    description: "删除任务",
    inputSchema: {
      type: "object",
      properties: {
        task_guid: {
          type: "string",
          description: "任务GUID",
        },
      },
      required: ["task_guid"],
    },
  },
];

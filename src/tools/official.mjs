/**
 * 官方工具定义
 * 透传自 @larksuiteoapi/lark-mcp
 */

export const officialTools = [
  // === 多维表格 ===
  {
    name: "bitable_v1_app_create",
    description: "创建多维表格",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string", description: "表格名称" },
        folder_token: { type: "string", description: "文件夹token（可选）" },
      },
      required: ["name"],
    },
  },
  {
    name: "bitable_v1_app_delete",
    description: "删除多维表格",
    inputSchema: {
      type: "object",
      properties: {
        app_token: { type: "string", description: "表格token" },
      },
      required: ["app_token"],
    },
  },
  {
    name: "bitable_v1_app_table_list",
    description: "列出多维表格中的数据表",
    inputSchema: {
      type: "object",
      properties: {
        app_token: { type: "string", description: "表格token" },
      },
      required: ["app_token"],
    },
  },
  {
    name: "bitable_v1_app_table_record_list",
    description: "列出数据表中的记录",
    inputSchema: {
      type: "object",
      properties: {
        app_token: { type: "string", description: "表格token" },
        table_id: { type: "string", description: "数据表ID" },
        view_id: { type: "string", description: "视图ID（可选）" },
        page_size: { type: "number", description: "每页记录数（默认20）" },
        page_token: { type: "string", description: "分页token（可选）" },
      },
      required: ["app_token", "table_id"],
    },
  },
  {
    name: "bitable_v1_app_table_record_create",
    description: "在数据表中创建记录",
    inputSchema: {
      type: "object",
      properties: {
        app_token: { type: "string", description: "表格token" },
        table_id: { type: "string", description: "数据表ID" },
        fields: { type: "object", description: "记录字段数据" },
      },
      required: ["app_token", "table_id", "fields"],
    },
  },
  {
    name: "bitable_v1_app_table_record_update",
    description: "更新数据表中的记录",
    inputSchema: {
      type: "object",
      properties: {
        app_token: { type: "string", description: "表格token" },
        table_id: { type: "string", description: "数据表ID" },
        record_id: { type: "string", description: "记录ID" },
        fields: { type: "object", description: "更新的字段数据" },
      },
      required: ["app_token", "table_id", "record_id", "fields"],
    },
  },
  {
    name: "bitable_v1_app_table_record_delete",
    description: "删除数据表中的记录",
    inputSchema: {
      type: "object",
      properties: {
        app_token: { type: "string", description: "表格token" },
        table_id: { type: "string", description: "数据表ID" },
        record_id: { type: "string", description: "记录ID" },
      },
      required: ["app_token", "table_id", "record_id"],
    },
  },

  // === 消息管理 ===
  {
    name: "im_v1_chat_create",
    description: "创建群组",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string", description: "群组名称" },
        description: { type: "string", description: "群组描述" },
        user_id_list: {
          type: "array",
          items: { type: "string" },
          description: "初始成员open_id列表",
        },
      },
      required: ["name"],
    },
  },
  {
    name: "im_v1_chat_list",
    description: "获取群组列表",
    inputSchema: {
      type: "object",
      properties: {
        user_id_type: {
          type: "string",
          enum: ["open_id", "union_id", "user_id"],
          description: "用户ID类型",
        },
        page_size: { type: "number", description: "每页数量（默认20）" },
        page_token: { type: "string", description: "分页token" },
      },
    },
  },
  {
    name: "im_v1_chatMembers_get",
    description: "获取群成员列表",
    inputSchema: {
      type: "object",
      properties: {
        chat_id: { type: "string", description: "群组ID" },
        member_id_type: {
          type: "string",
          enum: ["open_id", "union_id", "user_id"],
          description: "成员ID类型",
        },
        page_size: { type: "number", description: "每页数量" },
      },
      required: ["chat_id"],
    },
  },
  {
    name: "im_v1_message_create",
    description: "发送消息",
    inputSchema: {
      type: "object",
      properties: {
        receive_id: { type: "string", description: "接收者ID" },
        msg_type: {
          type: "string",
          enum: ["text", "post", "image", "file", "interactive"],
          description: "消息类型",
        },
        content: { type: "string", description: "消息内容（JSON字符串）" },
        receive_id_type: {
          type: "string",
          enum: ["open_id", "union_id", "user_id", "email", "chat_id"],
          description: "接收者ID类型",
        },
      },
      required: ["receive_id", "msg_type", "content", "receive_id_type"],
    },
  },
  {
    name: "im_v1_message_list",
    description: "获取聊天记录",
    inputSchema: {
      type: "object",
      properties: {
        container_id_type: {
          type: "string",
          enum: ["chat", "thread"],
          description: "容器类型",
        },
        container_id: { type: "string", description: "容器ID" },
        start_time: { type: "string", description: "开始时间（秒级时间戳）" },
        end_time: { type: "string", description: "结束时间（秒级时间戳）" },
        page_size: { type: "number", description: "每页数量" },
      },
      required: ["container_id_type", "container_id"],
    },
  },

  // === 文档 ===
  {
    name: "docx_builtin_search",
    description: "搜索云文档",
    inputSchema: {
      type: "object",
      properties: {
        search_key: { type: "string", description: "搜索关键词" },
        count: { type: "number", description: "返回数量（最大50）" },
        offset: { type: "number", description: "偏移量" },
      },
      required: ["search_key"],
    },
  },
  {
    name: "docx_builtin_import",
    description: "导入Markdown文档",
    inputSchema: {
      type: "object",
      properties: {
        markdown: { type: "string", description: "Markdown内容" },
        file_name: { type: "string", description: "文件名" },
      },
      required: ["markdown"],
    },
  },
  {
    name: "wiki_v1_node_search",
    description: "搜索知识库节点",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "搜索关键词" },
        space_id: { type: "string", description: "知识库ID" },
        page_size: { type: "number", description: "每页数量" },
      },
      required: ["query"],
    },
  },

  // === 日历 ===
  {
    name: "calendar_v4_calendar_event_create",
    description: "创建日程",
    inputSchema: {
      type: "object",
      properties: {
        summary: { type: "string", description: "日程标题" },
        description: { type: "string", description: "日程描述" },
        start_time: {
          type: "object",
          properties: {
            timestamp: { type: "string", description: "开始时间戳（秒）" },
          },
          required: ["timestamp"],
        },
        end_time: {
          type: "object",
          properties: {
            timestamp: { type: "string", description: "结束时间戳（秒）" },
          },
          required: ["timestamp"],
        },
        attendee_ability: {
          type: "string",
          enum: ["can_see_others", "cannot_see_others"],
          description: "参与者可见性",
        },
      },
      required: ["summary", "start_time", "end_time"],
    },
  },
];

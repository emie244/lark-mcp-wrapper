# Lark MCP Wrapper

飞书 MCP 包装层 - 整合官方工具 + 自定义任务工具

## 功能特点

- ✅ 透传官方 `@larksuiteoapi/lark-mcp` 的全部工具
- ✅ 新增任务管理工具（基于飞书任务 API v2）
- ✅ 统一的环境变量配置
- ✅ 支持 MCP 协议标准

## 工具列表

### 官方工具（透传）

| 类别 | 工具 | 功能 |
|------|------|------|
| 📊 多维表格 | `bitable_v1_app_create` | 创建多维表格 |
| 📊 多维表格 | `bitable_v1_app_delete` | 删除多维表格 |
| 📊 多维表格 | `bitable_v1_app_table_list` | 列出数据表 |
| 📊 多维表格 | `bitable_v1_app_table_record_list` | 列出记录 |
| 📊 多维表格 | `bitable_v1_app_table_record_create` | 创建记录 |
| 📊 多维表格 | `bitable_v1_app_table_record_update` | 更新记录 |
| 📊 多维表格 | `bitable_v1_app_table_record_delete` | 删除记录 |
| 💬 消息 | `im_v1_chat_create` | 创建群组 |
| 💬 消息 | `im_v1_chat_list` | 获取群组列表 |
| 💬 消息 | `im_v1_chatMembers_get` | 获取群成员 |
| 💬 消息 | `im_v1_message_create` | 发送消息 |
| 💬 消息 | `im_v1_message_list` | 获取聊天记录 |
| 📄 文档 | `docx_builtin_search` | 搜索文档 |
| 📄 文档 | `docx_builtin_import` | 导入 Markdown |
| 📄 文档 | `wiki_v1_node_search` | 搜索知识库 |
| 📅 日历 | `calendar_v4_calendar_event_create` | 创建日程 |

### 自定义任务工具

| 工具 | 功能 |
|------|------|
| `task_create` | 创建任务 |
| `task_list` | 获取任务列表 |
| `task_get` | 获取任务详情 |
| `task_update` | 更新任务 |
| `task_delete` | 删除任务 |

## 安装

```bash
# 克隆仓库
git clone https://github.com/emie244/lark-mcp-wrapper.git
cd lark-mcp-wrapper

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env
# 编辑 .env 填入你的飞书应用凭证
```

## 配置

### 环境变量

| 变量名 | 说明 | 必填 |
|--------|------|------|
| `APP_ID` | 飞书应用 ID | ✅ |
| `APP_SECRET` | 飞书应用密钥 | ✅ |
| `LARK_DOMAIN` | 飞书域名，默认 `https://open.feishu.cn` | ❌ |
| `TASK_DEFAULT_TASKLIST_ID` | 默认任务清单 ID | ❌ |

### 获取飞书应用凭证

1. 访问 [飞书开放平台](https://open.feishu.cn/)
2. 创建企业自建应用
3. 在「凭证与基础信息」中获取 App ID 和 App Secret
4. 在「权限管理」中添加以下权限：
   - `task:task:read`
   - `task:task:write`
   - 其他官方工具需要的权限

## 使用

### 直接运行

```bash
npm start
```

### 使用 mcporter

```bash
# 添加到 mcporter 配置
mcporter config add lark-wrapper --command "node /path/to/lark-mcp-wrapper/src/index.mjs"

# 调用工具
mcporter call lark-wrapper.task_create summary="测试任务"
```

### 在 OpenClaw 中使用

```bash
# 添加到 OpenClaw MCP 配置
openclaw mcp add lark-wrapper --command "node /path/to/lark-mcp-wrapper/src/index.mjs"
```

## 示例

### 创建任务

```json
{
  "tool": "task.create",
  "params": {
    "summary": "完成项目文档",
    "description": "编写 API 文档和用户手册",
    "due": {
      "timestamp": "1735689600000",
      "is_all_day": false
    },
    "members": [
      {
        "id": "ou_xxx",
        "role": "assignee"
      }
    ]
  }
}
```

### 获取任务列表

```json
{
  "tool": "task.list",
  "params": {
    "completed": false,
    "page_size": 20
  }
}
```

### 发送消息

```json
{
  "tool": "im_v1_message_create",
  "params": {
    "receive_id": "ou_xxx",
    "receive_id_type": "open_id",
    "msg_type": "text",
    "content": "{\"text\":\"Hello, 飞书!\"}"
  }
}
```

## 项目结构

```
lark-mcp-wrapper/
├── src/
│   ├── index.mjs          # 主入口
│   ├── tools/
│   │   ├── official.mjs   # 官方工具定义
│   │   └── task.mjs       # 自定义任务工具定义
│   └── handlers/
│       └── task.mjs       # 任务工具实现
├── config/
│   └── index.mjs          # 配置管理
├── package.json
├── .env.example
└── README.md
```

## 开发

```bash
# 开发模式（自动重启）
npm run dev

# 测试
npm test
```

## 许可证

MIT

## 相关链接

- [飞书开放平台](https://open.feishu.cn/)
- [飞书任务 API v2](https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/task-v2/overview)
- [官方 lark-openapi-mcp](https://github.com/larksuite/lark-openapi-mcp)

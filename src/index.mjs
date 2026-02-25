#!/usr/bin/env node
/**
 * Lark MCP Wrapper
 * 飞书 MCP 包装层 - 整合官方工具 + 自定义任务工具
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { spawn } from "child_process";

// 加载配置
import { config } from "../config/index.mjs";

// 工具定义
import { officialTools } from "./tools/official.mjs";
import { taskTools } from "./tools/task.mjs";

// 任务工具实现
import * as taskHandlers from "./handlers/task.mjs";

class LarkMCPWrapper {
  constructor() {
    this.server = new Server(
      {
        name: "lark-mcp-wrapper",
        version: "1.0.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupHandlers();
  }

  setupHandlers() {
    // 列出所有工具
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [...officialTools, ...taskTools],
      };
    });

    // 处理工具调用
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        // 判断是官方工具还是自定义工具
        if (name.startsWith("task.")) {
          // 自定义任务工具
          return await this.handleTaskTool(name, args);
        } else {
          // 官方工具 - 透传给 lark-mcp
          return await this.handleOfficialTool(name, args);
        }
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${error.message}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  // 处理官方工具 - 透传给 lark-mcp
  async handleOfficialTool(name, args) {
    return new Promise((resolve, reject) => {
      const larkProcess = spawn(
        "npx",
        ["-y", "@larksuiteoapi/lark-mcp", "mcp"],
        {
          env: {
            ...process.env,
            APP_ID: config.appId,
            APP_SECRET: config.appSecret,
            LARK_DOMAIN: config.larkDomain,
          },
        }
      );

      let output = "";
      let errorOutput = "";

      larkProcess.stdout.on("data", (data) => {
        output += data.toString();
      });

      larkProcess.stderr.on("data", (data) => {
        errorOutput += data.toString();
      });

      larkProcess.on("close", (code) => {
        if (code !== 0) {
          reject(new Error(`lark-mcp exited with code ${code}: ${errorOutput}`));
        } else {
          resolve({
            content: [
              {
                type: "text",
                text: output,
              },
            ],
          });
        }
      });

      // 发送工具调用请求
      const request = {
        jsonrpc: "2.0",
        id: 1,
        method: "tools/call",
        params: {
          name,
          arguments: args,
        },
      };

      larkProcess.stdin.write(JSON.stringify(request) + "\n");
      larkProcess.stdin.end();
    });
  }

  // 处理自定义任务工具
  async handleTaskTool(name, args) {
    switch (name) {
      case "task_create":
        return await taskHandlers.createTask(args);
      case "task_list":
        return await taskHandlers.listTasks(args);
      case "task_update":
        return await taskHandlers.updateTask(args);
      case "task_delete":
        return await taskHandlers.deleteTask(args);
      case "task_get":
        return await taskHandlers.getTask(args);
      default:
        throw new Error(`Unknown task tool: ${name}`);
    }
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("Lark MCP Wrapper server running on stdio");
  }
}

const server = new LarkMCPWrapper();
server.run().catch(console.error);

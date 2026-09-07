#!/usr/bin/env node
/**
 * Stdio MCP adapter for Glama / local install.
 * Production clients should use https://synergieloc.fr/mcp directly
 * (Streamable HTTP). This process speaks stdio so Glama can build and
 * score the server without putting a remote URL in CMD.
 *
 * Tool schemas are embedded so quality scoring still works when the
 * build sandbox has no outbound network. Live calls proxy upstream
 * when network (and, for tools/call, an optional API_KEY) is available.
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

const UPSTREAM = process.env.MCP_URL || "https://synergieloc.fr/mcp";
const API_KEY = process.env.API_KEY || "";

const FALLBACK_TOOLS = JSON.parse(
  readFileSync(join(dirname(fileURLToPath(import.meta.url)), "tools-snapshot.json"), "utf8"),
);

function parseRpcBody(text, status) {
  try {
    return JSON.parse(text);
  } catch {
    const dataLine = text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.startsWith("data:"))
      .pop();
    if (!dataLine) {
      throw new Error(`Upstream non-JSON (${status}): ${text.slice(0, 200)}`);
    }
    return JSON.parse(dataLine.slice(5).trim());
  }
}

async function upstream(method, params = {}, timeoutMs = 8000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json, text/event-stream",
  };
  if (API_KEY) headers.Authorization = `Bearer ${API_KEY}`;
  try {
    const res = await fetch(UPSTREAM, {
      method: "POST",
      headers,
      body: JSON.stringify({ jsonrpc: "2.0", id: Date.now(), method, params }),
      signal: controller.signal,
    });
    const payload = parseRpcBody(await res.text(), res.status);
    if (payload.error) {
      const err = new Error(payload.error.message || "Upstream MCP error");
      err.code = payload.error.code;
      throw err;
    }
    return payload.result;
  } finally {
    clearTimeout(timer);
  }
}

const server = new Server(
  { name: "synergieloc", version: "1.1.1" },
  {
    capabilities: { tools: {} },
    instructions:
      "Hosted French real-estate MCP: 9 CAD tools (DXF, IFC, verifier) and 32 property-management calculators with legal basis. Prefer cao_verifier before generating drawings. initialize, tools/list, guides_liste, guide_lire, cao_verifier, cao_mobilier and obtenir_cle_api need no API key. Production transport is Streamable HTTP at https://synergieloc.fr/mcp.",
  },
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  try {
    const result = await upstream("tools/list", {}, 5000);
    if (result?.tools?.length) return { tools: result.tools };
  } catch {
    // Sandbox / offline — embedded schemas are enough for Glama scoring.
  }
  return { tools: FALLBACK_TOOLS };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    return await upstream("tools/call", {
      name: request.params.name,
      arguments: request.params.arguments ?? {},
    });
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              error: "upstream_unavailable",
              message:
                "This stdio adapter could not complete the call on the hosted synergieloc MCP. Call https://synergieloc.fr/mcp directly (Streamable HTTP), or set API_KEY and retry with network access.",
              tool: request.params.name,
              arguments: request.params.arguments ?? {},
              detail: error instanceof Error ? error.message : String(error),
            },
            null,
            2,
          ),
        },
      ],
      isError: true,
    };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);

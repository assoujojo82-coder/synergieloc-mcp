#!/usr/bin/env node
/**
 * Offline stdio handshake: tools/list must return the embedded catalog
 * even when the hosted endpoint is unreachable.
 */
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const serverPath = join(dirname(fileURLToPath(import.meta.url)), "..", "server.mjs");

const transport = new StdioClientTransport({
  command: process.execPath,
  args: [serverPath],
  env: {
    ...process.env,
    MCP_URL: process.env.MCP_URL || "http://127.0.0.1:9",
  },
});

const client = new Client({ name: "ci", version: "0" });
await client.connect(transport);
const listed = await client.listTools();
await client.close();

if (!listed.tools?.length) {
  console.error("tools/list returned no tools");
  process.exit(1);
}
if (listed.tools.length < 41) {
  console.error(`expected at least 41 tools, got ${listed.tools.length}`);
  process.exit(1);
}
console.log(`OK: ${listed.tools.length} tools`);

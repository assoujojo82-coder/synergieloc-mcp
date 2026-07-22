# Bridge stdio <-> hosted synergieloc MCP server (Streamable HTTP).
# The server is HOSTED; this image bridges stdio clients and Glama's
# introspection checks. initialize / tools/list are OPEN (no key needed),
# so the container answers introspection out of the box.
FROM node:20-alpine

# Pre-install the bridge at BUILD time (no runtime npx download) so the
# container starts reliably and responds to introspection immediately.
RUN npm install -g mcp-remote@latest

ENV MCP_URL=https://synergieloc.fr/mcp
# API_KEY is optional: required only for tools/call, not for introspection.

CMD ["sh", "-c", "if [ -n \"$API_KEY\" ]; then exec mcp-remote \"$MCP_URL\" --header \"Authorization: Bearer $API_KEY\"; else exec mcp-remote \"$MCP_URL\"; fi"]

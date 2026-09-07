# Stdio adapter for Glama and local MCP clients.
# Production remains Streamable HTTP at https://synergieloc.fr/mcp.
FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY server.mjs tools-snapshot.json ./
ENV MCP_URL=https://synergieloc.fr/mcp
CMD ["node", "./server.mjs"]

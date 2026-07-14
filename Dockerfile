# Pont stdio <-> serveur MCP distant synergieloc (Streamable HTTP)
# Le serveur est HÉBERGÉ : cette image sert de bridge pour les clients stdio
# et pour les checks d'introspection (initialize / tools/list = ouverts).
FROM node:20-alpine
ENV MCP_URL=https://synergieloc.fr/mcp
# API_KEY optionnelle : requise seulement pour tools/call
CMD ["sh", "-c", "if [ -n \"$API_KEY\" ]; then exec npx -y mcp-remote \"$MCP_URL\" --header \"Authorization: Bearer $API_KEY\"; else exec npx -y mcp-remote \"$MCP_URL\"; fi"]

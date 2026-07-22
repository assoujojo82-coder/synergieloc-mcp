# synergieloc — French Real-Estate MCP Server

**Give your AI agent exact French real-estate legal answers instead of hallucinations.**

[![synergieloc MCP server](https://glama.ai/mcp/servers/assoujojo82-coder/synergieloc-mcp/badges/score.svg)](https://glama.ai/mcp/servers/assoujojo82-coder/synergieloc-mcp)

Remote MCP server (Streamable HTTP) exposing regulatory-grade calculations from
[synergieloc.fr](https://synergieloc.fr), a French property-management platform.

- **Endpoint**: `https://synergieloc.fr/mcp` (JSON-RPC 2.0, Streamable HTTP)
- **Auth**: `Authorization: Bearer slk_live_...` — required for `tools/call` only; `initialize` and `tools/list` are **open**
- **Official registry**: [`fr.synergieloc/immobilier`](https://registry.modelcontextprotocol.io/v0/servers?search=synergieloc) (v1.0.0, active)
- **Get a key** (free tier, 100 units/month): https://synergieloc.fr/api-ia

## Tools

| Tool | What it does | Legal basis |
|---|---|---|
| `irl_revision_loyer` | Annual rent revision capped by the INSEE IRL index: new rent, formula, legal warnings | Art. 17-1, law 89-462 |
| `regularisation_charges` | Service-charge reconciliation: tenant share by *tantiemes* + pro-rata temporis, per-charge breakdown, signed balance | Decree 87-713 |
| `quittance_loyer` | Compliant rent receipt with mandatory legal wording (PDF via REST) | Art. 21, law 89-462 |
| `avenant_revision_irl` | Ready-to-send rent-revision notification letter with full calculation | Art. 17-1, law 89-462 |

Every answer includes the **legal basis and warnings**. All tools are **stateless**:
input data is used for the calculation and never stored (GDPR-friendly).

## Try it (no key needed)

```bash
curl -X POST https://synergieloc.fr/mcp -H "Content-Type: application/json"   -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'
```

## Use with Claude Desktop (via mcp-remote bridge)

```json
{
  "mcpServers": {
    "synergieloc-immobilier": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://synergieloc.fr/mcp",
               "--header", "Authorization: Bearer YOUR_API_KEY"]
    }
  }
}
```

## Docker (stdio bridge to the hosted server)

```bash
docker build -t synergieloc-mcp .
docker run -i -e API_KEY=slk_live_... synergieloc-mcp
```

Without `API_KEY`, introspection (`initialize`, `tools/list`) still works.

## REST equivalent

OpenAPI: https://synergieloc.fr/api/v1/openapi.json - Machine docs: https://synergieloc.fr/llms-full.txt

## Pricing

Free 100 units/month - Agent EUR 49/month (2,000 units) - Plateforme EUR 249/month (15,000 units) -
overage billed automatically. Units: calculation = 1, reconciliation = 2, document = 4.

## Contact

contact@synergieloc.fr - partnership / rev-share inquiries welcome.

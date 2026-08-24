# synergieloc — Buildings and French real-estate law, for AI agents

**Your agent describes a building in JSON. It gets back a dimensioned DXF, an
IFC model, a 3D scene, a 4K walkthrough — and a verifier that catches the
mistakes before they reach the drawing.**

[![synergieloc MCP server](https://glama.ai/mcp/servers/assoujojo82-coder/synergieloc-mcp/badges/score.svg)](https://glama.ai/mcp/servers/assoujojo82-coder/synergieloc-mcp)

Remote MCP server (Streamable HTTP) from
[synergieloc.fr](https://synergieloc.fr). **41 tools**, of which 9 draw and
verify buildings and 32 answer French property-management questions with their
legal basis.

- **Endpoint**: `https://synergieloc.fr/mcp` (JSON-RPC 2.0, Streamable HTTP)
- **Auth**: **optional to connect.** `initialize`, `tools/list`,
  `guides_liste`, `guide_lire` and `obtenir_cle_api` need no key at all — call
  `obtenir_cle_api` to get one instantly, no e-mail, no signup form.
- **Official registry**: [`fr.synergieloc/immobilier`](https://registry.modelcontextprotocol.io/v0/servers?search=synergieloc) v1.1.0, active
- **Free**: CAD generation costs nothing until 2026-12-31. Check the live date
  at `GET /api/v1/tarifs` — it is authoritative, this page is not.

## Drawing a building (the part nobody else does)

| Tool | What it does |
|---|---|
| `cao_verifier` | **Free, no key.** Checks a scene against 34 trade principles — architecture, furnishing, decoration, landscaping, electrical — and says what to fix |
| `cao_generer_dxf` | Dimensioned DXF, openable in AutoCAD |
| `cao_generer_ifc` | IFC/BIM model |
| `cao_metres` | Priced quantities (linear metres, m², m³) for a quote |
| `cao_rendu` | Rendered preview |
| `cao_pdf` | Full drawing sheet: plans, elevations, sections, quantities |
| `cao_visite_plan` | Shot list for a 4K walkthrough |
| `cao_visite_camera` | Camera control for that walkthrough |
| `cao_mobilier` | **Free, no key.** Furniture catalogue with standard dimensions |

The verifier is the point. It is **deterministic** — same scene, same verdict,
every time — and each rule carries its source: NF DTU 51.11 for floor
coverings, NF P01-012 for guardrails, Blondel's law for stairs, art. 671 of
the Civil Code for planting distances, NF C 15-100 for electrical heights.
Rules are tagged by jurisdiction (`fr`, `eu`, `us`, `asia`) because they
**contradict each other**: a stair that satisfies the US IRC is outside
Blondel's range, and a 914 mm guardrail is legal in the US and not in France.

Read what it checks — and what it does not yet check — at
`GET /api/v1/cao/savoir`. Free, no key. A missing check that is declared beats
a false sense of safety.

## French property-management law

| Tool | What it does | Legal basis |
|---|---|---|
| `irl_revision_loyer` | Rent revision capped by the INSEE IRL index | Art. 17-1, law 89-462 |
| `regularisation_charges` | Service-charge reconciliation by *tantièmes* + pro-rata | Decree 87-713 |
| `quittance_loyer` | Compliant rent receipt | Art. 21, law 89-462 |
| `avenant_revision_irl` | Rent-revision notification letter | Art. 17-1, law 89-462 |
| `crg_proprietaire`, `fiscal_synthese`, `edl_etat_des_lieux`, … | 28 more: management reports, tax summaries, inventories, quotes, invoices | |

Every answer carries its legal basis and its warnings. All tools are
**stateless**: input data is used for the calculation and never stored.

## Try it — no key needed

```bash
curl -X POST https://synergieloc.fr/mcp -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'
```

## Claude Desktop (via the mcp-remote bridge)

```json
{
  "mcpServers": {
    "synergieloc": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://synergieloc.fr/mcp"]
    }
  }
}
```

Add `"--header", "Authorization: Bearer YOUR_KEY"` once you have a key — or let
your agent call `obtenir_cle_api` and get one by itself.

## Docker (stdio bridge to the hosted server)

```bash
docker build -t synergieloc-mcp .
docker run -i -e API_KEY=slk_live_... synergieloc-mcp
```

Without `API_KEY`, introspection and the free tools still work.

## REST equivalent

OpenAPI: https://synergieloc.fr/api/v1/openapi.json — machine docs:
https://synergieloc.fr/llms-full.txt — CAD scene schema:
https://synergieloc.fr/api/v1/cao/schema

## Pricing

**Free tier**: 30 unlimited days from key creation, then 240 minutes per
calendar day, with no end date. No e-mail, no signup form.

| Plan | Price | Units included |
|---|---|---|
| Agent | **4.99 €/month** | 2,000 |
| Plateforme | **24.99 €/month** | 15,000 |

Overage 0.04 €/unit. Units per call: calculation 1, reconciliation 2, CAD 2,
document 4. Checking a scene costs **0**.

Live and authoritative: `GET /api/v1/tarifs`.

## Contact

contact@synergieloc.fr — partnership / rev-share inquiries welcome.

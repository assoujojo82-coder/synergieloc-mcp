# Synergieloc — CAD/BIM, industrial engineering and property tools for AI agents

**One MCP endpoint for building design, industrial simulation and property workflows.**
Describe a building in JSON to get a dimensioned DXF, an IFC model and a 3D tour;
use industrial tools for FEM/CFD studies and property tools for operational tasks.

[![synergieloc MCP server](https://glama.ai/mcp/servers/assoujojo82-coder/synergieloc-mcp/badges/score.svg)](https://glama.ai/mcp/servers/assoujojo82-coder/synergieloc-mcp)

Remote MCP server (Streamable HTTP) from
[synergieloc.fr](https://synergieloc.fr). The live catalogue spans CAD/BIM,
industrial engineering (FEM 3D, thermomechanics, CFD and seismic dynamics),
property management and service tools. Use `tools/list` for the current inventory.

- **Endpoint**: `https://synergieloc.fr/mcp` (JSON-RPC 2.0, Streamable HTTP)
- **Auth**: **optional to connect.** `initialize`, `tools/list`,
  `guides_liste`, `guide_lire` and `obtenir_cle_api` need no key at all — call
  `obtenir_cle_api` to get one instantly, no e-mail, no signup form.
- **Official registry**: [`fr.synergieloc/immobilier`](https://registry.modelcontextprotocol.io/v0/servers?search=synergieloc) v1.2.2, active. The historic identifier remains stable for existing clients.
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

And 29 more: IFC import, validation, clash detection and BCF export, IDS
checks, building-permit figures (`cao_permis`), 4D build sequence (`cao_4d`),
drawing sets (`cao_carnet`), RE2020 indicators, cost estimate, schedules,
energy, sunlight, planning rules, reinforcement, version compare and merge,
parametric families. `tools/list` is the full, live list.

The verifier is **deterministic** — same scene, same verdict. Rules carry their
source and are tagged by jurisdiction (`fr`, `eu`, `us`, `asia`); the caller must
select the applicable jurisdiction. A result for one jurisdiction must not be
presented as universally compliant.

Read what it checks — and what it does not yet check — at
`GET /api/v1/cao/savoir`. Free, no key. A missing check that is declared beats
a false sense of safety.

## Property-management workflows

| Tool | What it does |
|---|---|
| `irl_revision_loyer` | Indexed rent-revision calculation |
| `regularisation_charges` | Service-charge reconciliation by ownership shares and time period |
| `quittance_loyer` | Rent receipt generation |
| `avenant_revision_irl` | Rent-revision notification letter |
| `avis_echeance`, `relance_impaye`, `crg_proprietaire`, `fiscal_synthese`, `edl_etat_des_lieux`, … | Due notices, reminders, management reports, summaries, inventories, mandates and invoices |

For trades, 11 more tools draft quotes, work orders, job sheets, site reports,
materials lists, mileage logs and invoice reminders.

Jurisdiction-dependent tools document their own scope; do not assume that a
calculation applies in every country. The public API endpoints are stateless.

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

## Local stdio (Glama)

The hosted server is `https://synergieloc.fr/mcp`. This repo ships a local
stdio adapter (`server.mjs`) so Glama can build and score it without putting
a remote URL in CMD.

```bash
npm install
node ./server.mjs
```

The 70 tool schemas are embedded. `tools/list` still works if the hosted
endpoint is unreachable; `tools/call` proxies upstream when network (and,
when required, `API_KEY`) is available.

### Glama build spec

1. Open https://glama.ai/mcp/servers/assoujojo82-coder/synergieloc-mcp/admin/dockerfile
2. Build steps: `["npm install"]`
3. CMD arguments: `["node", "./server.mjs"]`
4. Click **Build**, then **Make Release** once the test is green

## Docker

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
| Agent | **49.99 €/month** | 2,000 |
| Plateforme | **149.99 €/month** | 15,000 |

Overage 0.04 €/unit (Agent), 0.03 €/unit (Plateforme). Units per call: calculation 1, reconciliation 2, CAD 2,
document 4. Checking a scene costs **0**.

Live and authoritative: `GET /api/v1/tarifs`.

## Contact

contact@synergieloc.fr — partnership / rev-share inquiries welcome.

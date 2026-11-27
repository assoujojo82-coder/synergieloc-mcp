# Synergieloc plugin for Grok Build

Connects Grok Build to the hosted Synergieloc MCP server
(`https://synergieloc.fr/mcp`, Streamable HTTP, JSON-RPC 2.0).

## What you get

- **Building design (CAD/BIM)**: describe a building in JSON; check it
  (`cao_verifier`), export a dimensioned DXF and an IFC 4 model, run BIM rule
  checks (`cao_bim_*`), clash detection and BCF, quantities, cost estimates,
  schedules, energy and sunlight studies, a French building-permit draft, a 4D
  site schedule and a 4K walkthrough. The checker applies the building code of
  the country the scene declares: France (default), EU harmonised standards,
  US (IRC/NEC), UK, Germany or China; the permit draft is French.
- **French rental management**: IRL rent review, service-charge settlement,
  rent receipts and reminders, each with its legal basis.

The tool list is served live by `tools/list`: new tools appear without
updating this plugin.

## Installation

In Grok Build, open `/plugin`, search for **Synergieloc**, and install.

## API key (required — paid)

This plugin is a PAID Synergieloc surface (`/mcp/plugin`): tools require an API
key from a paid plan — Agent (€49.99/month, 2,000 units) or Plateforme
(€149.99/month, 15,000 units). Free `eval` keys are refused on this surface.
Create or upgrade your key on https://synergieloc.fr/en/api-ia, then set it in
your environment:

```bash
export SYNERGIELOC_API_KEY=slk_live_...
```

The plugin sends it as `Authorization: Bearer`. `initialize` and `tools/list`
work without a key (discovery). Never paste the key into chat.

## Network and data

- Only endpoint called: `https://synergieloc.fr` (hosted in the EU, Lithuania).
- No code runs on your machine: no hooks, no scripts, no local server.
- Privacy policy: https://synergieloc.fr/en/privacy-policy
- Support: contact@synergieloc.fr

Results are design and administrative aids; they do not replace an architect,
engineer or lawyer.

---
name: ui-resource-finder
description: Search the local curated UI/UX catalog and select suitable components, patterns, design systems, SVG, accessibility references, AI UI resources, or implementation approaches. Use when designing, implementing, reviewing, or comparing web UI.
---

# UI Resource Finder

## Workflow

1. Identify surface, user task, framework, style, accessibility, responsive, and license constraints.
2. Search `data/catalog.json` before guessing a library or pattern.
3. Prefer primary upstream sources and resources with clear license metadata.
4. Treat `Unknown` or `review-required` resources as link-only.
5. For interactive UI, always add accessibility and responsive checks.
6. Do not copy screenshots, SVG, code, or Skill instructions from sources without redistribution permission.
7. Return the selected resource/pattern, why it fits, implementation notes, accessibility notes, license/provenance, and upstream URL.

## Routing

- dashboard / analytics → dashboard-builder concepts + visualization resources
- form / signup / checkout → form/task patterns + WAI-ARIA references
- SVG / diagram / icon → SVG/icon resources + accessibility
- AI chat / agent UI → ai-ui resources + tool/approval/state patterns
- critique / redesign → accessibility + responsive + states + relevant design systems
- publishing → GitHub Pages rules in repository docs

## Quality gate

Before final output check: semantic HTML, keyboard operation, focus-visible, contrast, 320/375/430/768/1024/1440+ reflow, loading/empty/error states, reduced motion, source/license status.

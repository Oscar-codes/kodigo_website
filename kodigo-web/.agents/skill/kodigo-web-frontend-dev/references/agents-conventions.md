# `.agents` conventions

## Layout

```
kodigo-web/.agents/skill/<skill-name>/
  SKILL.md            required; YAML frontmatter + instructions
  references/*.md     detail loaded on demand (keep SKILL.md short)
  scripts/*           deterministic helpers (e.g. validators)
  agents/openai.yaml  optional display metadata
```

Note: this repo uses the singular `.agents/skill/`. `graphify-out/graph.json` mentions a `.agents/skills/ui-ux-pro-max` folder (plural) that no longer exists on disk; do not rely on it.

## Existing skills

| Skill | Use |
|---|---|
| `kodigo-frontend-prd-tracker` | Maintains `docs/FRONTEND_PRD.md` against baseline W-01 to W-12; validator at `scripts/validate_prd.py` |
| `kodigo-web-frontend-dev` | Implements tickets with React/styled-components; translates Bootstrap/Tailwind/HTML/CSS |

## SKILL.md rules

- Frontmatter has only `name` (kebab-case, equals the folder name) and `description`.
- `description` says *what* it does and *when to use it*, with trigger words; it is the only text loaded to decide relevance.
- Body is imperative, short, and points to `references/` for detail.
- No secrets, tokens or credentials in skills.
- Do not duplicate facts that live in code or in the PRD; link to them.

## Adding or changing a skill

1. Create the folder and `SKILL.md`; add references only when the body would exceed roughly 150 lines.
2. If a skill changes ticket scope or DoD, edit the baseline file of the tracker and record it in the PRD changelog; never silently rewrite baseline text.
3. If a skill ships a script, run it before claiming it works.
4. List the skill in the "Existing skills" table above.

## Relationship with the PRD

Skills are procedures; `docs/FRONTEND_PRD.md` is state. Implementation sessions end by updating the PRD through the tracker skill and running its validator:

```
python -I .agents/skill/kodigo-frontend-prd-tracker/scripts/validate_prd.py docs/FRONTEND_PRD.md
```

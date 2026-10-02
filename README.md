# Masterbatch website renovation — local foundation

This directory began as the neutral WordPress Starter from `D:/33wordpress` at commit `626d2dd`. It is now the GE masterbatch website workspace. Approved P001 homepage copy and unified visual direction are implemented locally in a native Core Page/Post theme. Other page content, enquiry handling and production migration remain unfinished; this is not a complete released business site. No builder, domain product model, enquiry form or mail delivery is supplied.

This folder is its own Git repository, with `https://github.com/longestGj/masterbatch.git` as `origin`. The sibling `D:/10MasterbatchDev` planning repository is separate. W1–W5 cover site planning; Gate 3 creates static page visual drafts without WordPress implementation authority. Each has `.codex/agents/<agent_name>/agent.md` as its role definition and a matching flat `.codex/agents/<agent_name>.toml` as the Codex-native discovery adapter; see the [agent directory guide](.codex/agents/README.md). The three WordPress methods live in `.agents/skills/`. Open a Codex task with this directory as its working directory to load its local instructions. The five W1–W5 agents were each called in a read-only configuration smoke test on 2026-09-23 before the directory restructure; this verifies their earlier discovery and role loading, not their performance on real business materials.

## Start locally (Windows PowerShell)

Requires Docker Desktop with Compose v2, Git and Python 3. Windows is the tested host; other hosts have not been verified. Images are specified in `compose.yaml`; reassess supported/security-patched versions when starting a real project.

1. Copy `.env.example` to `.env`. Fill every field locally, using three different generated secrets for the database user, database root and administrator. Do not paste credentials into chat, Git or reports. Choose a unique `COMPOSE_PROJECT_NAME` and free `WP_PORT` for this copy. Example identities below are placeholders; replace them with your actual values.
2. Run the read-only guard **before any Compose mutation**:

```powershell
python scripts/preflight.py --project my-new-site --port 18081
if ($LASTEXITCODE -ne 0) { throw 'Preflight failed; stop here.' }
docker compose up -d --wait db wordpress
if ($LASTEXITCODE -ne 0) { throw 'Startup failed; stop here.' }
docker compose run --rm --entrypoint sh cli /workspace/scripts/install.sh
if ($LASTEXITCODE -ne 0) { throw 'Installation failed; inspect before retrying.' }
```

3. Open `http://127.0.0.1:18081/` and `/wp-admin/` using your chosen port and local admin credentials. Use Core Pages, Posts, Media and Appearance → Menus. WordPress sample content is Core's default, not approved site content. Change or remove it in the editor when preparing the actual site.
4. For a subsequent start, use the same guard with `--resume`. It checks both working directory and Compose file labels. A same-name project belonging to another copy must be refused. Optionally add `--protect-project NAME` for environments you must never target. Never override a refusal by changing labels or using an existing volume.

`install.sh` preserves an already installed database. If a first run installed Core but failed before activating the theme, inspect that this is **your newly created local database** and explicitly finish with `docker compose run --rm cli eval-file /workspace/scripts/install.php`. This changes initial theme/permalink settings once; it is not an import or migration for an existing site.

```powershell
python -m unittest discover -s tests -p '*_test.py'
docker compose run --rm cli eval-file /workspace/tests/core-content.php
# Use a real saved Page and known copy (replace these sample values):
python tests/http-smoke.py --base-url http://127.0.0.1:18081 --page-path /sample-page/ --expected-h1 'Sample Page' --expected-text 'This is an example page.'
```

The PHP fixture creates and deletes its own local Page/revisions and attempts an intercepted mail. Browser checks are additional: edit a title, paragraph, image and link; save; view the real page at desktop/tablet/mobile widths and use the keyboard. HTTP 200 alone is not acceptance.

## Current GE local homepage

- Project: `ge-masterbatch-local-20261002`; current URL `http://127.0.0.1:18086/`; backend `http://127.0.0.1:18086/wp-admin/`. Existing private `.env` holds the synthetic local credentials; do not replace it or commit it. Start/resume only after preflight with this exact identity/port and `--resume`.
- Actual local WordPress 7.1.1, Theme `site-starter` 0.2.0. Homepage is Core Page 18, editable under Pages; its nine modules contain 130 valid native blocks. Branding, site icon, menus and location use Core settings. The Theme provides shared presentation and button styles.
- Review/edit reference: [P001](planning/pages/P001.md), [design system](planning/DESIGN_SYSTEM.md), [content model](planning/CONTENT_MODEL.md). Status and actual limitations live in P001. The 22 planned destination routes currently return 404, including `/rfq`; destination pages and inquiry handling must be completed before a working sales journey is accepted.
- `scripts/build-homepage.cjs` creates private source assets/payload using the installed WordPress editor's own serializer. `scripts/import-homepage.php` is a local-only media/page initializer. It requires explicit stable ownership and refuses conflicting editor changes or pre-existing menu assignments; do not use it as a production migration tool. The read-only `.local` Compose mount supplies private payloads to CLI; `.local` stays ignored.
- After preflight before each CLI run, use `tests/homepage-theme.php`, `tests/homepage-seed.php` and `tests/homepage-seo.php` through `wp eval-file`. `tests/homepage-runtime.cjs` performs actual HTTP/responsive/menu/focus/editor persistence checks and privately captures evidence in `.local/runtime/`. The Node utilities currently use the bundled Windows runtime dependency path; other hosts need their own verified dependency setup.
- Runtime screenshots, private imports, SQL, uploads and credentials are absent from Git. Preserve the database/uploads volumes; recreating a checkout from Git does not recreate saved content. See [recovery](docs/RECOVERY.md).

## What to fill in

Start at [SITE_BRIEF](planning/SITE_BRIEF.md), then [CONTENT_MODEL](planning/CONTENT_MODEL.md), [DESIGN_SYSTEM](planning/DESIGN_SYSTEM.md), [SITE_MAP](planning/SITE_MAP.csv) and [SEO_MAP](planning/SEO_MAP.csv). Follow [WORKFLOW](docs/WORKFLOW.md). Unknown facts stay unknown until a named source resolves them.

Create one `planning/pages/<PAGE_ID>.md` for each real page. The following field example is an instruction, **not approved content**:

```text
Page ID: <stable identity>
Status: PLANNED | READY | BUILDING | REVIEW | ACCEPTED | RELEASED
Purpose: <audience, problem and intended outcome>
Map / SEO: <corresponding rows in SITE_MAP.csv and SEO_MAP.csv>
Content source: <approved complete copy and exact source/version>
Facts: <supported statements, source, restrictions>
Actions and outcomes: <CTA destination; what happens after an action>
Visual reference: <approved reference or design-system rule>
Acceptance: <content, facts, SEO, responsive, function, accessibility>
Open decisions: <unresolved items, or none>
```

Page status lives only in that spec. Repository `.agents/skills` contains three **DRAFT** WordPress methods. W1–W5 support initial renovation planning and material changes; ordinary page edits do not rerun all five. Gate 3 produces visual drafts only; the WordPress development owner controls implementation and runtime review. Each agent's configuration and task discovery must be tested in this directory before actual reliance.

## Data and boundaries

Git stores code and planning. **Git push does not back up the live database or uploads.** Follow [RECOVERY](docs/RECOVERY.md); retain the matching code commit with each data backup. Schema changes may require a coordinated data restore when rolling code back.

Foundation verification on Windows covered independent fresh installs, actual Core editor title/text/image/link saves, revision restore, loopback/noindex/mail protection, and database plus media recovery into a separate environment. It used a generated test page/image, not a real second business site. Skill discovery and limited usage scenarios were observed with Codex CLI 0.155.0-alpha.9.2; the three methods remain DRAFT. Real business data, enquiry handling, hosting, production performance and other operating systems are not validated by this candidate.

This Compose setup is local only: loopback HTTP, forced noindex and disabled sitemap. WordPress mail is blocked by default. For an owner-authorized local delivery test, fill the `GE_LOCAL_SMTP_*` values in the ignored `.env` and set `GE_LOCAL_SMTP_ENABLED=1`; all required settings must be valid before the block lifts. Never commit credentials or use the normal Google account password. SMTP acceptance does not prove inbox receipt. These controls are not access control, do not prevent arbitrary external HTTP requests, and do not make a site production-ready. [RELEASE](docs/RELEASE.md) requires a separate production configuration and explicit publication approval.

Stop this copy with `docker compose stop` after checking its identity. Do not remove volumes as routine cleanup. This candidate has no automatic backup scheduler, deployment or migration service.

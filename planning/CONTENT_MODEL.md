# Content model — project decisions

Current implementation: Core Page and Post, Core Media, menus, blocks and revisions; no domain CPT/taxonomy. Two generic SEO metadata fields and local import-ownership markers are implemented below. This does not decide that every future record must use only Pages.

For each proposed record type, document:

| Decision | Fill from this project |
|---|---|
| Meaning and audience | What real thing is this record? |
| Core object | Page/Post, or why a CPT is necessary |
| Identity and URL | Stable identity; URL owner; existing-record ownership |
| Fields | Type, units, allowed values, requiredness, source and edit location |
| Relationships | Meaning, authority, validation and deletion behavior |
| Rendering | Reusable template/blocks; empty or unavailable values |
| Changes and history | Editor/import ownership, revision/restore support for non-Core data |

Repeated independently edited records with their own lifecycle can justify a CPT. A few ordinary service pages do not need fictional product numbers. Taxonomy groups records; Meta stores per-record values; Blocks structure editable body content; templates render records. Do not encode technical facts only in Theme HTML.

When the business has relationship facts, explanatory copy and selection/navigation rules, describe them separately. They may be related without sharing one authority. Do not infer one from another or silently synchronize them. Choose checks appropriate to the actual project.

Add future actual decisions here when confirmed; put page-specific copy and current status in its Page Spec.

## Native homepage implementation — 2026-10-02

| Object | Actual decision and edit location |
|---|---|
| Homepage | Core Page; local ID 18, stable planning identity P001, slug `ge-home`, assigned to static front page `/`. Body is edited in Pages using native blocks. |
| Body structure | Nine top-level Core Group sections; nested Core Heading, Paragraph, Image, List/List Item, Buttons/Button. No custom block, Custom HTML, builder or custom post type. |
| Media | Core attachments for logo, monogram, yard, granules and equipment; original assets copied unchanged, native image sizes generated. Edit alt text/caption/replacement in Media and the block editor. |
| Shared navigation | Core menus at primary, inquiry, footer-products, footer-company and footer-information. Edit via Appearance → Menus. Existing footer location remains available. Menu URLs are navigation only, not claims that target pages exist. |
| Branding/location | Core custom-logo Theme setting, Core site-icon option, site title in Settings; footer location is sanitized plain text `ge_footer_location` in Appearance → Customize → Site Identity. |
| Search presentation | Page/Post string metadata `_ge_seo_title` and `_ge_seo_description`, sanitized and exposed through native REST for editing. Edit in the Search presentation metabox; empty values preserve native title fallback/omit description. Native revision support is enabled; paired restore and missing-field legacy restore tested. |
| Rendering | Existing `site-starter` Theme; `front-page.php` renders saved content without inserting another H1. CSS/editor styles, shared header/footer and factual homepage JSON-LD are Theme presentation. No business specification stored only in PHP. |
| Import ownership | Private local payload derives from the single confirmed P001 copy and installed Core serializer. Page requires `_ge_page_id` + `_ge_source_owner`; last-import state hash detects editor changes. Media uses source hash identity + explicit owner. Initial menus refuse existing names/assignments; later imports do not reset menus/branding. |
| History/recovery | Native body and SEO revisions; fixtures verified preservation/refusal/restore. Core options/menus and all uploads require database + uploads backups, with matching code commit. Git alone is insufficient. Full recovery verification is recorded separately from archive creation. |

No domain relationship or inferred model/application mapping is added. Filler products, contact forms, delivery policies and document distribution remain outside this implementation.

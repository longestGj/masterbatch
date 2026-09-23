---
name: page-visual-draft
description: Create a reviewable static, responsive page visual from owner-confirmed copy and design inputs for Gate 3. Use for page appearance drafts, not WordPress implementation or runtime QA.
---

# Page visual draft

Use this skill when Gate 3 is asked to show how an approved page should look. The deliverable is a visual draft; the WordPress team chooses its own implementation.

## Inputs

Read the current Page Spec, owner-confirmed Gate 2 Full Copy, approved module order, applicable design system and approved media. Use actual page copy, including technical values, qualifiers, CTAs and labels. Keep each claim with the object, unit, condition or evidence it qualifies. If a necessary content, brand or media decision is missing, identify the gap; do not invent a final-looking replacement.

## Draw the page

Make a complete static page visual at the requested viewport sizes. If the task does not specify sizes, use this project's initial desktop, tablet and mobile probe widths: 1440, 768 and 390 CSS pixels. Lay out each width for its content rather than simply scaling the desktop image. Show page states only where they are needed to understand the approved appearance; depict them as visual states, not proof of working interactions.

Use local HTML/CSS, SVG or another editable design source when useful for rendering. It is a drawing source, not a second website or a WordPress implementation plan. Do not prescribe blocks, templates, plugins, CPTs, meta fields or CSS architecture to the WordPress team.

Export the visual drafts, then open and inspect them at readable size. Check that the full page is visible, real copy has not been shortened or substituted, values remain attached to their labels and qualifiers, and dense sections, navigation and CTAs remain readable at each width. Fix visual defects within Gate 3's authority. Refer any proposed copy, fact, module-order, SEO, URL or behavior change to its owner rather than making it in the visual source.

## Deliver

Save the editable source and exported visuals only under `planning/visuals/<PAGE_ID>/`. Return the asset paths and a brief note on unresolved visual inputs. Do not create manifests, handoff packages or separate process reports. Do not edit WordPress, inspect Staging as QA, claim runtime behavior, approve the page or publish it.

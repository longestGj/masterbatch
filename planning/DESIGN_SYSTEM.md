# Design system — project inputs

The original unbranded starter is now implemented using P001's unified GE visual direction. The owner directed entry into WordPress implementation and execution of the presented plan on 2026-10-02.

- Brand identity: owner-approved GE Logo on 2026-10-02; exact decision: “同意使用这个logo”. Selected assets and usage are recorded below. Other supplied media retain their existing attribution/usage limits.
- Typography, colors, spacing and component rules: adopt the latest [P001 visual](visuals/P001/homepage-visual.html) for the local build; see the implemented standard below.
- Action style direction: the owner's unified, softer button direction is implemented as primary inquiry, secondary product entrance and text navigation. Reuse these styles for subsequent pages.
- Reference: latest P001 visual and its refinement/adoption records; approved body copy remains solely in [P001](pages/P001.md).
- Header/footer/navigation: native Core menus and branding; shared labels/layout adopted for implementation. Target-page availability remains separately verified.
- Repeated page structures and editable regions: native Core Group/Heading/Paragraph/Image/List/Button blocks; Theme owns CSS and templates.
- Responsive behavior: inspect content at desktop, tablet and mobile, including long text, images and navigation. Initial probe widths are 1440, 768 and 390px; add widths where actual content breaks.
- Accessibility: semantic headings, meaningful link names, keyboard order, visible focus, skip link, labels, alt text and contrast. Identify checks requiring human judgment.
- Performance: set budgets after real assets and hosting are known; distinguish local measurements from production behavior.

Record approved decisions and their references here; do not duplicate page copy or page status.

## Approved GE Logo — 2026-10-02

- Decision reference: [P001 Logo adoption](pages/P001.md), following the displayed Logo and icon visual supplement. The owner approved this selected Logo for the website.
- Horizontal Logo: [ge-logo-candidate.png](visuals/P001/assets/ge-logo-candidate.png), 1981×793 transparent PNG. Text: **GE Chemical** / **& Polymer Group Co., Ltd.**
- Companion monogram: [ge-brandmark-candidate.png](visuals/P001/assets/ge-brandmark-candidate.png), 1254×1254 transparent PNG. The same mark is the website-icon source. The stable filenames retain `candidate`; these selected Logo assets are now approved.
- Presentation: retain the geometric GE mark and polymer-granule details; use the color Logo on light header surfaces and a white monochrome presentation on dark footer surfaces. The selected design uses dark forest green with pale green details (generation colors #34473b and #d3e78d); this approval does not finalize the site's entire UI palette or typography.
- Preserve aspect ratio, readable company text and transparent background. Do not distort, add slogans or credentials, or substitute another generated design. Accessible company identity remains GE Chemical & Polymer Group Co., Ltd.
- Provenance: newly generated with the built-in `imagegen` tool and adopted by the owner; not represented as a recovered historical corporate original. Rejected inverse-image trials are not selected assets; the current drawing derives its monochrome presentation from the approved color Logo.
- [Asset overview](visuals/P001/brand-icons-preview.png) shows the selected Logo, monogram sizes and interface icons. The subsequent WordPress execution instruction adopts the latest shared presentation for local implementation; logo/site-icon registration is checked locally. Production delivery remains separate.

## Implemented presentation standard — 2026-10-02

- Palette: ink `#202623`, forest green `#34473b`, paper `#f5f5ef`, pale-green inquiry accent `#d3e78d`, muted copy `#59645d`, dividers `#d5dad1`.
- Typography: Arial/Helvetica/system sans-serif; body 17px desktop and 16px phone. Desktop H1 66px, tablet 49px, phone 43px and 38px below 361px; section headings 40/33/31px with module-specific adjustments from the reference.
- Layout: content container up to 1280px including 64px side padding on desktop, 36px on tablet, 24px on phone. Nine homepage sections remain unchanged. Hero uses supplied yard and granule photos; product models stay compact text links; application photographs remain deferred.
- Actions: minimum height 48px, 15px type, 10px corner radius, 18px arrow and 12px icon gap. Primary inquiry uses green on light surfaces and pale green on dark surfaces. Product-family entry uses an outline. Supporting navigation uses text plus arrow. All include hover/active/focus states; visible focus is 3px; reduced-motion preference disables transitions.
- Header: color Core logo, four primary menu routes and separate inquiry menu. At 1100px and below primary navigation becomes a native details menu; inquiry remains in the tablet header and inside the menu. Below 761px the header inquiry hides. Footer: monochrome presentation of the same logo, editable location, inquiry and three native menu columns.
- Icons: reuse the 15 approved-source interface SVG assets already in the visual directory, copied into Theme. They are decorative CSS masks; native labels carry link meaning. No additional icon expansion.
- Runtime checks and owner review state belong to P001. Local checks do not establish production performance, complete accessibility or a working inquiry journey.

# Masterbatch Supplier Evidence Confirmation

Status: Market Research Only  
Date: 2026-07-05  
Not for final PRD, route finalization, development handoff, Cursor task, or Minimax task.

## 1. Evidence Rule

This file only confirms what can be inferred from the current `Cmp_Info` files. It does not confirm supplier capability beyond the file scope.

Key rules:

- A certificate or test report for one grade/sample cannot be extended to the full product line.
- FDA/RoHS cannot be written as full-series capability.
- Products without TDS/COA/MSDS should not enter final P0 development.
- Product parameters from current files are "based on current documents, final supplier verification required."
- Entity mismatch must be resolved before public launch.

## 2. Product Evidence Matrix

| Product Line | Available Grades / Models | TDS Available | COA Available | SDS/MSDS Available | RoHS/FDA/Compliance File | File Entity | Public-safe Claims | Claims Not Allowed | Evidence Gap |
|---|---|---|---|---|---|---|---|---|---|
| Black Masterbatch | BK020, BK025, BK030, BK035, BK040; PT-300; PT-450P; public map also lists ZY, PP40%, LD300, K1812, 1600-1900 series, GC series, E series, 800 series | Yes. TDS files exist for BK020-BK040, PT-300, PT-450P | No COA found in current folder | Yes. `黑色母MSDS ，GE CHEMICAL -2026版本(1)(1).pdf` | RoHS report exists for "BLACK MASTERBATCH"; BK040/PT-450P mention "Food Grade" in TDS but no product-specific FDA file for black was found | BK files and MSDS: GE CHEMICAL & POLYMER GROUP CO., LTD; PT files: BINZHOU LEACHY NEW MATERIAL CO., LTD; RoHS: GE CHEMICAL & POLYMER GROUP CO., LTD; public map: Wudi Longda | Can say current files include several black masterbatch TDS examples and one GE CHEMICAL SDS/MSDS; current grades show carbon black ranges in specific documents; black masterbatch appears suitable for film blowing, injection molding, re-granulating in those TDS examples | Cannot claim all black masterbatch grades are RoHS/FDA/food grade; cannot claim fixed carbon black %, fixed dosage, fixed MFI, pipe-grade, UV, potable-water, ISO/ASTM compliance, or full series availability | Need supplier-confirmed grade list, COA, grade-to-entity mapping, public-use permission, pipe-grade proof, and exact compliance scope |
| White Masterbatch | Public map lists A Series, R Series, 1201A, Porcelain White, Bright White, LD51003; FDA report sample model MB Blanco PE | No white TDS found in current folder | No COA found | No white SDS/MSDS found | FDA 21 CFR 177.1520 extractables report exists for White Masterbatch (White Plastic Chips), Grade MB Blanco PE | FDA file: GE CHEMICAL & POLYMER GROUP CO., LTD; public map: Wudi Longda | Can say one current GE CHEMICAL file shows a white masterbatch sample, Grade MB Blanco PE, passed the specified extractables test; public map indicates white masterbatch category exists | Cannot claim all white masterbatch is FDA compliant, food-contact compliant, TiO2 range, fixed whiteness, fixed opacity, fixed dosage, or grade availability | Need white TDS, MSDS/SDS, COA, grade list, TiO2 data, application-specific grades, and document ownership clarification |
| Color Masterbatch | Public map lists Warm Color, Cool Color, Other Color; LD/LDA/LDG series examples | No color TDS found | No COA found | No color SDS/MSDS found | No color compliance file found | Public map: Wudi Longda; company profile: GE CHEMICAL mentions color masterbatch generally | Can say supplier public research indicates color masterbatch category and model families exist; can discuss RFQ inputs such as resin, color reference, application, sample target as buyer questions | Cannot claim specific colors, Pantone/RAL matching capability, Delta E tolerance, sample cycle, MOQ, food contact, RoHS/FDA, or batch consistency | Need color TDS, color matching workflow, sample policy, MOQ, COA/MSDS, accepted color references, and approved public claims |
| Filler Masterbatch | Public map does not provide dedicated filler grade list; black TDS files contain CaCO3 filler percentages inside black masterbatch; external market demand strong but not supplier proof | No dedicated filler TDS found | No COA found | No filler SDS/MSDS found | No filler compliance file found | Black TDS files: GE CHEMICAL/BINZHOU LEACHY show CaCO3 filler inside black masterbatch, not standalone filler masterbatch | Can say current black masterbatch TDS examples include CaCO3 filler content in some black grades; can discuss filler masterbatch as a market opportunity requiring supplier confirmation | Cannot claim standalone filler masterbatch supply, CaCO3 %, whiteness, cost reduction %, dosage, film/injection suitability, or compliance | Need dedicated filler masterbatch TDS, MSDS, COA, grade list, CaCO3 source/whiteness/mesh data, application guidance |
| Desiccant / Defoaming Masterbatch | DM2476G; public map lists A0-A3, B series, C series, dark gray desiccant/defoaming | Yes. `TDS--DM2476G.doc` | No COA found | No SDS/MSDS found | No compliance file found | DM2476G TDS: SHANDONG BEIHONG NEW MATERIAL TECHNOLOGY CO., LTD; public map: Wudi Longda | Can say current files include one desiccant masterbatch TDS example, grade DM2476G, with recycled PE carrier and CaO content shown in that file; can discuss moisture/bubble RFQ questions | Cannot claim all desiccant/defoaming grades use CaO, universal 1% dosage, guaranteed bubble removal, compatibility with all recycled plastic, or WDLongda ownership of DM2476G | Need entity confirmation, desiccant/defoaming grade list, MSDS/SDS, COA, application-specific dosage, proof for recycled plastic use |
| PPA Masterbatch | Public map lists PPA-01, PPA-02, PPA-03 | No TDS found | No COA found | No SDS/MSDS found | No compliance file found | Public map: Wudi Longda | Can say public product map indicates PPA processing aid masterbatch models exist and are publicly described as used for film blowing, injection, extrusion | Cannot claim chemistry, dosage, fluoropolymer content, melt fracture improvement, die build-up reduction, food/contact compliance, or grade availability | Need TDS, MSDS, COA, active ingredient, dosage, application examples, supplier confirmation |
| Slip / Anti-block Masterbatch | Public map lists 101, 102, 103 | No TDS found | No COA found | No SDS/MSDS found | No compliance file found | Public map: Wudi Longda | Can say public product map indicates slip/anti-block masterbatch models exist and are associated with film/injection/extrusion applications | Cannot claim COF values, anti-block performance, migration behavior, food packaging suitability, dosage, or grade availability | Need TDS, MSDS, COA, slip/anti-block type, COF/testing data, application guidance |
| Anti-aging Masterbatch | Public map lists Blue ZK-01, Blue XK-02, Yellow anti-aging, White XKG-01, White XK-01 | No TDS found | No COA found | No SDS/MSDS found | No compliance file found | Public map: Wudi Longda | Can say public product map indicates anti-aging masterbatch category and model examples exist | Cannot claim UV resistance level, outdoor lifetime, weathering hours, anti-aging guarantee, pipe/agri-film performance, or compliance | Need TDS, UV/weathering test reports, MSDS, COA, application guidance, supplier confirmation |
| Functional Masterbatch | Public map groups PPA, slip/anti-block and possibly other functional products | No general functional TDS found | No COA found | No general functional MSDS found | No compliance file found | Public map: Wudi Longda; company profile: GE CHEMICAL mentions additive masterbatches generally | Can use as an internal umbrella research category only | Cannot claim a broad functional masterbatch portfolio with confirmed performance functions | Need sub-product evidence first; do not make this a final P0 product |

## 3. Evidence Conclusion

| Product Line | Evidence Decision |
|---|---|
| Black Masterbatch | Strongest current evidence, but entity mapping and compliance scope unresolved. Candidate for PRD only with strict caveats. |
| White Masterbatch | Partial evidence. FDA sample supports one tested white grade only. Candidate for PRD only if wording is conservative. |
| Color Masterbatch | Market/RFQ opportunity exists, but evidence is too thin for technical claims. |
| Filler Masterbatch | Market demand is strong, but supplier evidence is insufficient for final P0 development. |
| Desiccant / Defoaming | Buyer pain is strong, but current TDS entity mismatch blocks final P0. |
| PPA / Slip / Anti-block / Anti-aging / Functional | Hold until TDS/MSDS/COA or supplier confirmation is available. |

## 4. Required Supplier Follow-up

1. Confirm public-facing company/entity.
2. Map every TDS/MSDS/FDA/RoHS file to exact product grade and supplier entity.
3. Provide COA examples for black, white, color, filler, desiccant.
4. Provide dedicated TDS/MSDS for filler, PPA, slip/anti-block, anti-aging.
5. Confirm which documents are public, RFQ-only, or internal-only.
6. Confirm sample/MOQ/lead-time policy only if allowed to publish.


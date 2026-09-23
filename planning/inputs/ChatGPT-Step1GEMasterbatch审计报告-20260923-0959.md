# Step1GEMasterbatch审计报告

**User:** Anonymous  
**Created:** 9/22/2026 13:54:33  
**Updated:** 9/22/2026 14:19:14  
**Exported:** 9/23/2026 9:59:03  
**Link:** [https://chatgpt.com/g/g-p-6ab211739c9c819180765ab645d56146/c/6ab21818-d9b8-83ee-8e33-496673a01ebd](https://chatgpt.com/g/g-p-6ab211739c9c819180765ab645d56146/c/6ab21818-d9b8-83ee-8e33-496673a01ebd)  

## Prompt:
9/22/2026, 1:54:54 PM

[Attachment: 粘贴的 markdown (1)。md]

## Response:
9/22/2026, 2:09:49 PM

我会按“现状基线审计”来做，不提前进入改版。先完整摸清可公开抓取的 URL、导航、产品/应用/文档/RFQ，再逐页核对 SEO、GEO、技术与转化信号；无法从公开数据确认的项目会明确标成 “Unable to verify from public data.”

第一轮抓取已经确认：当前站点公开导航很集中，核心商业资产是 7 个现售 grade、8 个 Application guide、制造/文档/RFQ/FAQ/联系等支撑页。一个明显信号已经出现：首页和产品体系把“Carbon Black % / CaCO3 % / carrier”放在非常核心的位置，而大量 Application 页又主动声明“非推荐/非适用性结论/仅人工审核”，这两点我会作为重点证据继续验证。

第二轮验证后，问题边界更清楚了：网站并不是“完全没有结构”，相反，它已经有 Breadcrumb、产品族页、Application → RFQ、Product → Application/Documents/RFQ 等基本链接骨架；真正的短板是**内容决策价值与证据深度**，不是单纯缺页面。尤其产品页目前主要用配方比例区分 grade，却很少公开足够的加工/性能/商业选择信息来回答“为什么选 A 而不是 B”。

> **已搜索 1 个网站**
>
> 
>
> **已搜索 1 个网站**
>
> 
>
> **测试网站访问并抓取首页内容**
>
>
> **测试网站访问并抓取首页内容**
>
> 
>
> **评估网站可验证性**
>
> 我目前只能确认公开搜索线索，无法验证移动端实际渲染或结构化数据是否存在。第三方资料显示品牌名称、域名拼写、所在地与产品描述可能不一致，因此我会谨慎标注这些风险。
>
> **评估了网站可验证性**
>
> 
>
> **已搜索 1 个网站**
>
> 
>
> **整理页面清单**
>
> 我正在扩展公开页面盘点，重点覆盖产品、应用与常见问题详情页，同时核对联系信息和法律页面。这样能更完整地估算网站规模，并避免遗漏通过分类页链接的内容。
>
> **汇总网站盘点**
>
> 我正在统计约六十余个公开页面，涵盖产品、应用、工厂、联系、询盘、文档及常见问题详情。接下来会按页面类型整理完整网址，并分别核对标题、内容质量与优化优先级。
>
> **整理并汇总网站页面清单**
>
> 
>
> **核查内容质量**
>
> 我正在抽查常见问题页面，确认答案是否真正解决剂量、运输和颜色一致性等实际问题。目前页面存在较明显的防御性、重复性表述；我也会把站点地图可访问性与索引状态标记为待进一步验证。
>
> **已搜索 3 个网站**
>
> 
>
> 思考了 3m 6s

下面是按你附件中的 Step 01 审计标准完成的 **GEMasterbatch Current-State Baseline Audit**。本报告只做现状审计，不进入竞争对手研究、新 Sitemap 或批量内容重写。`粘贴的 markdown (1)。md`

我实际检查了当前站点的首页、产品体系、7 个现售 grade、2 个产品族、8 个 Application 页面、Manufacturing & Quality、Documents、About、Contact、RFQ、FAQ Hub、34 个 FAQ detail 页面、Privacy、Terms，以及公开导航和页间关系。**本轮共发现 62 个可访问的核心 HTML 页面。**

> **标记说明**
>
> **Observed** = 当前网站可以直接观察到的事实  
> **Inference** = 根据观察作出的专业判断  
> **Recommendation** = 后续应处理的问题方向，不等于本阶段立即改版

---

# 1. Executive Summary

GEMasterbatch.com 目前已经不是一个完全没有结构的传统外贸官网。它已经具备了一个比较清晰的基础 B2B 网站骨架：顶部导航区分 Products、Applications、Manufacturing & Quality、Documents、About 和 RFQ；产品体系明确收束为 6 个 Black Masterbatch grade 和 1 个 Desiccant Masterbatch grade；About 页面明确解释 GEMasterbatch 是市场品牌、GE Chemical & Polymer Group Co., Ltd. 是法律主体、Binzhou 是制造基地；制造页面拥有真实工厂、包装和装柜照片；产品页能够连接 Documents、Applications 和 RFQ。([GEMasterbatch](https://www.gemasterbatch.com/))

它当前最有价值的资产不是已有 SEO 文案，而是已经形成的**真实产品数据 + 工厂真实性 + grade identity + 文档边界 + 清晰法律实体信息**。尤其 Manufacturing 页面公开了 Binzhou 自有工厂、12 条 black masterbatch production lines、50,000+ t annual capacity、30+ markets，并配有厂区、包装和出口装柜图片。这一组信息是现站最强的可信度资产。([GEMasterbatch](https://www.gemasterbatch.com/manufacturing-quality))

但网站核心商业表达存在明显问题。首页、Products Hub、Black Masterbatch family page，以及六个 Black Masterbatch 产品页，都把产品最重要的区分集中在 **Carbon Black %、CaCO3 % 和 carrier**。例如 BK020 是 20% carbon black / 47.8% CaCO3，BK040 是 40% / 5.8%，PT-300 是 25% / 41.8%。这使采购商非常容易把整个产品系列理解成“不同 carbon black loading 的价格梯度”，而不是不同加工场景、性能表现和采购价值的解决方案。([GEMasterbatch](https://www.gemasterbatch.com/products))

更严重的是，六个 Black Masterbatch product detail pages 的结构高度相似，除了配方比例之外，几乎没有公开足够的信息帮助采购商回答：“为什么 BK030 而不是 BK025？”“PT-300 与同为 25% carbon black 的 BK025 有什么商业/加工差异？”“哪一个 dispersion 更好？”“推荐 dosage 是多少？”“适用哪一种 PE、膜厚和吹膜条件？”这些问题并不是要求网站公开所有配方秘密，而是目前**缺少可用于产品选择的中间层证据**。([GEMasterbatch](https://www.gemasterbatch.com/products/bk020))

Applications 是当前第二个结构性问题。8 个 Application 页面中，只有 Packaging Film 明确关联 6 个 Black grades，General Extrusion 关联 DM2476G；HDPE Pipe、Recycled PE/PP、Recycled Plastic、Plastic Packaging 等页面没有现售 grade mapping，而 Color Injection、White Film 甚至明确说明 Color / White / Slip Masterbatch **不是当前产品**。这形成了一个奇怪状态：商业 Product portfolio 已经收窄，但 SEO/Application 内容还保存着旧 portfolio 的概念。([GEMasterbatch](https://www.gemasterbatch.com/applications))

GEO 方面，网站并非毫无基础。Grade 名称、组成、公司实体、制造地点和部分 Application relationship 的表达都非常明确，机器可以比较容易抽取。例如 AI 能回答 BK030 的 carbon black content，也能回答 DM2476G 的 CaO content。但是对于更高商业价值的问题--“哪一个 grade 更适合 blown film？”“desiccant dosage 是多少？”“BK025 和 PT-300 为什么不同？”--网站反复把答案终止在 “manual review required”。这降低了页面作为 AI citation source 的价值。([GEMasterbatch](https://www.gemasterbatch.com/products/bk030))

内容层面最明显的问题是过度防御。Application 和 34 个 FAQ detail pages 反复出现 “manual review”“not a recommendation”“not a suitability conclusion”“no fixed MOQ / lead time / dosage / compatibility promise”等语言。谨慎本身是正确的；问题在于它已经成为内容主体。大量 FAQ detail page 实际上只有一小段独立答案，再配上一模一样的 Review Note，因此形成明显的模板化、低独特信息密度特征。([GEMasterbatch](https://www.gemasterbatch.com/faq/before-rfq/what-is-your-minimum-order-quantity))

转化方面，RFQ 的信息质量设计很好，但首次提交门槛偏高。当前至少有 Name、Company、**Company Website**、Email、Country/Region、Product Type、Application、Message 等 required fields；同时还提供 Processing Method、Base Resin、Quantity、Documents、Port 等大量选项。Company Website 被明确用于 buyer qualification，这对销售团队有价值，但对于没有独立网站的小型加工厂、贸易商或刚接触供应商的客户，是明显的首次转化阻力。([GEMasterbatch](https://www.gemasterbatch.com/rfq))

综合判断：

**GEMasterbatch 当前处于“架构已经搭出来，但产品决策价值、证据深度和品牌实体统一仍明显不足”的阶段。**

它最大的机会并不是简单增加页面数量，而是把已经真实存在的产品、工厂、测试、应用和商业知识，转化成更有选择价值、更可验证、更可引用的页面资产。

---

# 2. Current Website Map

实际观察到的主要结构如下：([GEMasterbatch](https://www.gemasterbatch.com/))

```text
Homepage
│
├── Products
│   ├── Black Masterbatch
│   │   ├── BK020
│   │   ├── BK025
│   │   ├── BK030
│   │   ├── BK035
│   │   ├── BK040
│   │   └── PT-300
│   │
│   └── Desiccant Masterbatch
│       └── DM2476G
│
├── Applications
│   ├── Color Masterbatch for Injection Molding
│   ├── General Extrusion
│   ├── HDPE Pipe Extrusion
│   ├── Packaging Film
│   ├── Plastic Packaging
│   ├── Recycled PE/PP
│   ├── Recycled Plastic
│   └── White Film
│
├── Manufacturing & Quality
├── Documents
├── About
├── FAQ
│   ├── Before RFQ × 6
│   ├── Product Selection × 7
│   ├── Sample & Trial × 3
│   ├── Documents & Compliance × 9
│   ├── Quality & Specification × 6
│   └── Logistics & Trade × 3
│
├── Contact
├── RFQ
│
├── Privacy
└── Terms
```

Header 当前是：

**Products → Applications → Manufacturing & Quality → Documents → About → Get Quote**。Footer 再加入全部 7 个 grade、FAQ、Contact、Privacy、Terms 和 Sitemap。([GEMasterbatch](https://www.gemasterbatch.com/))

这是一个合理的基本骨架。

---

# 3. URL Inventory

### 页面数量

| 类型 | 数量 |
|---|---:|
| Homepage | 1 |
| Product Hub / Family | 3 |
| Product Detail | 7 |
| Application Hub / Detail | 9 |
| Factory | 1 |
| Document | 1 |
| About / Trust | 1 |
| RFQ | 1 |
| Contact | 1 |
| FAQ Hub + Knowledge Pages | 35 |
| Legal | 2 |
| **Total discovered** | **62** |

其中产品与页面关系可以直接从 Products、Applications 和 FAQ Hub 验证。([GEMasterbatch](https://www.gemasterbatch.com/products))

### Core URLs

| URL | Page Type | Main Topic | Primary Intent | Indexable?* | Main CTA |
|---|---|---|---|---|---|
| `/` | Homepage | Manufacturer / portfolio | Commercial | Unable to verify | Products / RFQ |
| `/products` | Product Category | Current portfolio | Commercial | Unable to verify | Grade / RFQ |
| `/products/black-masterbatch` | Product Category | Black Masterbatch | Commercial | Unable to verify | Grade / RFQ |
| `/products/desiccant-defoaming-masterbatch` | Product Category | Desiccant | Commercial | Unable to verify | DM2476G / RFQ |
| `/products/bk020` | Product | BK020 | Transactional | Unable to verify | Quote / Documents |
| `/products/bk025` | Product | BK025 | Transactional | Unable to verify | Quote / Documents |
| `/products/bk030` | Product | BK030 | Transactional | Unable to verify | Quote / Documents |
| `/products/bk035` | Product | BK035 | Transactional | Unable to verify | Quote / Documents |
| `/products/bk040` | Product | BK040 | Transactional | Unable to verify | Quote / Documents |
| `/products/pt-300` | Product | PT-300 | Transactional | Unable to verify | Quote / Documents |
| `/products/dm2476g` | Product | DM2476G | Transactional | Unable to verify | Quote / Documents |
| `/applications` | Application Hub | Process/application | Mixed | Unable to verify | Guide / RFQ |
| `/applications/color-masterbatch-for-injection-molding` | Application | Injection/color | Informational | Unable | RFQ |
| `/applications/masterbatch-for-general-extrusion` | Application | Extrusion | Mixed | Unable | DM2476G / RFQ |
| `/applications/masterbatch-for-hdpe-pipe-extrusion` | Application | HDPE pipe | Informational | Unable | RFQ |
| `/applications/masterbatch-for-packaging-film` | Application | Packaging film | Commercial | Unable | Grades / RFQ |
| `/applications/masterbatch-for-plastic-packaging` | Application | Packaging | Informational | Unable | RFQ |
| `/applications/masterbatch-for-recycled-pe-pp` | Application | Recycled PE/PP | Informational | Unable | RFQ |
| `/applications/masterbatch-for-recycled-plastic` | Application | Recycled plastic | Informational | Unable | RFQ |
| `/applications/masterbatch-for-white-film` | Application | White film | Informational | Unable | RFQ |
| `/manufacturing-quality` | Factory / Trust | Manufacturing | Trust | Unable | Documents / RFQ |
| `/documents` | Document | TDS/SDS/COA | Commercial-support | Unable | Document request |
| `/about` | Trust | Company/entity | Trust | Unable | Products / RFQ |
| `/faq` | Resource | Procurement FAQ | Informational | Unable | FAQ / RFQ |
| `/contact` | Contact | Sales/support | Transactional | Unable | RFQ / Email / WhatsApp |
| `/rfq` | RFQ | Quote | Transactional | Unable | Submit |
| `/privacy` | Legal | Privacy | Legal | Unable | - |
| `/terms` | Legal | Terms | Legal | Unable | - |

\* `indexable` 需要 robots/meta robots/canonical/HTTP header/GSC 数据确认，本次公开抓取无法可靠确认。

### FAQ Detail URLs - 34

**Before RFQ**
- `/faq/before-rfq/what-information-before-masterbatch-rfq`
- `/faq/before-rfq/can-ge-chemical-recommend-grade-by-application`
- `/faq/before-rfq/can-i-request-documents-before-order`
- `/faq/before-rfq/what-is-your-minimum-order-quantity`
- `/faq/before-rfq/can-i-order-a-trial-quantity`
- `/faq/before-rfq/rfq-info-hdpe-pipe`

**Product Selection**
- `/faq/product-selection/choose-between-black-white-color-filler`
- `/faq/product-selection/information-needed-color-matching-request`
- `/faq/product-selection/choose-masterbatch-recycled-pe-pp`
- `/faq/product-selection/what-is-masterbatch`
- `/faq/product-selection/filler-vs-white-masterbatch`
- `/faq/product-selection/filler-cost-reduction`
- `/faq/product-selection/color-vs-pre-colored-resin`

**Sample & Trial**
- `/faq/sample-and-trial/what-is-the-sample-lead-time`
- `/faq/sample-and-trial/are-samples-free`
- `/faq/sample-and-trial/can-color-tolerance-be-guaranteed-before-sample`

**Documents & Compliance**
- `/faq/documents-and-compliance/do-you-provide-fda-or-rohs-documents`
- `/faq/documents-and-compliance/can-one-tds-apply-to-all-grades`
- `/faq/documents-and-compliance/difference-between-sds-and-msds`
- `/faq/documents-and-compliance/can-coa-be-provided-before-shipment`
- `/faq/documents-and-compliance/can-food-contact-be-confirmed-from-website`
- `/faq/documents-and-compliance/what-provide-for-fda-rohs-reach-documents`
- `/faq/documents-and-compliance/food-contact-applications`
- `/faq/documents-and-compliance/what-documents-come-with-shipment`
- `/faq/documents-and-compliance/extrusion-processing-issue-documents`

**Quality & Specification**
- `/faq/quality-and-specification/how-do-you-control-color-consistency`
- `/faq/quality-and-specification/can-masterbatch-compatibility-be-assumed`
- `/faq/quality-and-specification/what-base-resins-can-you-use`
- `/faq/quality-and-specification/how-application-specific-requirements-reviewed`
- `/faq/quality-and-specification/desiccant-dosage-recycled-plastic`
- `/faq/quality-and-specification/desiccant-bubble-removal`

**Logistics & Trade**
- `/faq/logistics-and-trade/what-destination-info-for-shipping-quotation`
- `/faq/logistics-and-trade/can-trade-terms-confirm-before-grade-selected`
- `/faq/logistics-and-trade/what-are-your-shipping-terms`

FAQ Hub 实际列出了上述 34 个问答入口。([GEMasterbatch](https://www.gemasterbatch.com/faq))

---

# 4. Homepage Audit

## Positioning

### Observed

首页 Hero：

> “Industrial Masterbatch for Global Processing”

随后直接说明：

> “Black Masterbatch and Desiccant Masterbatch from our Binzhou manufacturing base…”

并提供：

- Explore current grades
- View manufacturing
- Request a Quote

同时在首屏后的 proof strip 显示 own factory、12 lines、30+ markets。([GEMasterbatch](https://www.gemasterbatch.com/))

### 5 秒判断

| 问题 | 当前表现 |
|---|---|
| GEMasterbatch 是什么？ | **基本清楚** |
| 卖什么？ | **非常清楚：Black + Desiccant** |
| 面向谁？ | **部分清楚，“global processing”过宽** |
| 优势是什么？ | **工厂/产线/市场数量比较清楚** |
| 为什么值得继续？ | **有真实制造信号，但性能价值不足** |
| 下一步做什么？ | **非常清楚：Products / Manufacturing / RFQ** |

### 关键问题：卖产品价值还是卖配方？

明显偏向**配方数据**。

首页七张产品卡的核心卖点几乎全部是：

> Carbon Black % → CaCO3 % → Carrier

而不是：

> application problem → processing benefit → grade differentiation → evidence.

([GEMasterbatch](https://www.gemasterbatch.com/))

### Inference

这会把采购商自然引导到：

**“含量越高是不是越贵？”**

而不是：

**“哪一个 grade 对我的薄膜更适合？”**

因此现有信息架构实际上在无意中强化 commodity comparison。

### Recommendation

不建议删除 composition data。

它是有价值的。

真正需要解决的是：

**composition 不应该成为唯一明显的 differentiation layer。**

---

# 5. Product Architecture Audit

当前：

- Black Masterbatch
  - BK020
  - BK025
  - BK030
  - BK035
  - BK040
  - PT-300
- Desiccant Masterbatch
  - DM2476G

Products page 自己说明 grade numbers 是 formulation identifier，**不是 performance ranking**。([GEMasterbatch](https://www.gemasterbatch.com/products))

这是一个正确声明。

但采购商依然很难理解为什么选择某一 grade。

最典型案例：

### BK025 vs PT-300

BK025：

- Carbon Black 25%
- CaCO3 37.8%
- LLDPE + LDPE

PT-300：

- Carbon Black 25%
- CaCO3 41.8%
- LLDPE + LDPE
- “Independent grade”

两者都被标成 Packaging Film。([GEMasterbatch](https://www.gemasterbatch.com/products/bk025))

**Inference：**

对采购商而言，“Independent grade”不足以解释选择逻辑。

这是当前 Product Architecture 最明显的 gap。

---

# 6. Product Page Audit

## Grade-by-grade baseline

| Grade | 当前公开核心信息 | Application | 最大选择障碍 |
|---|---|---|---|
| BK020 | 20% CB / 47.8% CaCO3 / LLDPE+LDPE | Packaging Film | 无性能定位 |
| BK025 | 25% / 37.8% / same carrier | Packaging Film | 与 PT-300 差异不明 |
| BK030 | 30% / 27.8% | Packaging Film | 只有比例差异 |
| BK035 | 35% / 17.8% | Packaging Film | 无 application performance |
| BK040 | 40% / 5.8% | Packaging Film | 无 dispersion/jetness 等公开差异 |
| PT-300 | 25% / 41.8% | Packaging Film | “Independent grade”意义不清 |
| DM2476G | 75.9% CaO / ≤0.10% moisture / 24% recycled PE | General Extrusion | 无公开 dosage / result |

Black 产品信息模式可以直接在 BK020、BK025、BK030、BK040 和 PT-300 页面确认。([GEMasterbatch](https://www.gemasterbatch.com/products/bk020)) DM2476G 则明确公开 CaO、moisture、carrier 和 General Extrusion。([GEMasterbatch](https://www.gemasterbatch.com/products/dm2476g))

## Technical decision information

### Observed

Black 产品页目前主要公开：

- Carbon black
- CaCO3
- Carrier
- Packaging Film relationship

DM2476G：

- CaO
- Moisture
- Carrier
- General Extrusion relationship

### 没有在公开页面看到

对于 Black grade：

- MFI
- Density
- Dispersion measurement
- Jetness / undertone
- Tint strength
- Filter pressure value
- Particle size
- Recommended let-down / dosage
- Processing temperature
- Comparative performance data

对于 DM2476G：

- 推荐 dosage
- Moisture absorption performance
- bubble/void performance result
- processing window
- resin-specific compatibility result

**这不等于这些参数在产品上不存在。**

只是：

> **Unable to verify from public product pages.**

## Commercial information

产品页没有直接公开固定：

- MOQ
- Lead time
- Sample cost
- Packaging specification
- shipment terms

FAQ 对 MOQ、sample lead time、sample price 都采用 case-by-case 处理。([GEMasterbatch](https://www.gemasterbatch.com/faq/before-rfq/what-is-your-minimum-order-quantity))

## Product GEO

### BK030

AI 可以回答：

- What is BK030? → Yes
- Carbon black? → 30%
- Carrier? → LLDPE + LDPE
- Application? → Packaging Film

([GEMasterbatch](https://www.gemasterbatch.com/products/bk030))

但：

- 为什么 BK030 比 BK025 合适？
- dosage?
- dispersion?
- suitable resin grade?
- thickness?
- processing window?

→ **当前页面无法独立回答。**

这就是当前 Product GEO 最大限制。

---

# 7. Application Page Audit

| Application | Current Grade Mapping | 类型 | 主要问题 |
|---|---|---|---|
| Color Injection | None | Informational | Color MB 非现售产品 |
| General Extrusion | DM2476G | Commercial-support | 有产品关系，但无 dosage/result |
| HDPE Pipe | None | Informational/high-intent | 搜索意图很商业，却无产品 |
| Packaging Film | 6 Black grades | Commercial | 最强 Application，但仍无法选 grade |
| Plastic Packaging | None | Informational | White/Color/Filler 非现售 |
| Recycled PE/PP | None | Informational | 与 Recycled Plastic 重叠 |
| Recycled Plastic | None | Informational | 与 PE/PP 页面重叠 |
| White Film | None | Informational | White/Slip 非现售 |

Packaging Film 页面明确是唯一与 6 个 Black Masterbatch grade 全部建立 reviewed relationship 的 application。([GEMasterbatch](https://www.gemasterbatch.com/applications/masterbatch-for-packaging-film))

Color Injection 页面则明确表示：

> Color Masterbatch is not a current offer.

([GEMasterbatch](https://www.gemasterbatch.com/applications/color-masterbatch-for-injection-molding))

White Film：

> White and Slip Masterbatch are not current offers.

([GEMasterbatch](https://www.gemasterbatch.com/applications/masterbatch-for-white-film))

Recycled PE/PP 甚至专门说明 legacy White / Color / Filler topics 不是当前 offer。([GEMasterbatch](https://www.gemasterbatch.com/applications/masterbatch-for-recycled-pe-pp))

## Inference

这里确实存在：

> **Products / Applications / Knowledge Content 三种不同内容角色混合。**

尤其：

- Commercial Application
- Application intake form/content
- Legacy product knowledge
- SEO informational content

被统一放进 `/applications/`。

这会使搜索引擎和采购商都需要额外判断：

**“这是你们真的卖的，还是只是知识内容？”**

---

# 8. Information Architecture

### 优点

当前 IA 基本层级非常浅：

Homepage → Product family → Grade

以及：

Homepage → Applications → Application

没有很深的点击层级。

Grade 页面存在 Breadcrumb，并回链 family，且链接 Applications、Documents、RFQ。([GEMasterbatch](https://www.gemasterbatch.com/products/bk020))

### 问题

真正的问题不是“树结构乱”。

而是**内容角色语义不稳定**：

`/applications/` 同时承担：

- 产品落地页
- 技术需求收集
- 知识页面
- 非现售产品保留页

FAQ 同时承担：

- procurement support
- knowledge SEO
- disclaimer boundary
- commercial qualification

因此架构视觉上清楚，语义上并不完全清楚。

---

# 9. Internal Linking

## Observed

较好的链路已经存在：

**Product →**
- Family
- Application
- Documents
- RFQ

**Application →**
- RFQ
- Documents
- 有 mapping 时 → Product

**Manufacturing →**
- All products
- Documents
- RFQ

**FAQ →**
- Products
- Documents / RFQ
- global footer products

([GEMasterbatch](https://www.gemasterbatch.com/products/bk020))

## 优点

不是 orphan-heavy 网站。

至少目前发现的主页面基本都有导航或 footer 路径。

## 问题

FAQ Detail 的大部分内部链接高度模板化。

例如很多 FAQ 页的主体内容结束后，就是：

- Compare current products / Send requirement
- Back to FAQ
- global products footer

而不是：

> 当前问题 → 最相关 grade → application → evidence → RFQ

因此：

**有链接，但 semantic internal linking 还不够强。**

---

# 10. On-page SEO

## Titles

核心 Title 基本可读：

| URL | Current Title | Issue | Severity |
|---|---|---|---|
| `/` | GEMasterbatch \| Industrial Masterbatch for Global Processing | 偏泛 | Medium |
| `/products` | Masterbatch Products \| Seven Current Grades | 清楚 | Low |
| `/products/black-masterbatch` | Black Masterbatch Grades \| GEMasterbatch | 清楚 | Low |
| `/products/desiccant-defoaming-masterbatch` | Desiccant Masterbatch \| DM2476G Technical Review | “Technical Review”略偏内部语言 | Low |
| `/products/bk020` | BK020 Black Masterbatch \| GEMasterbatch | 清楚 | Low |
| `/products/bk025` | BK025 Black Masterbatch \| GEMasterbatch | 清楚 | Low |
| `/products/bk030` | BK030 Black Masterbatch \| GEMasterbatch | 清楚 | Low |
| `/products/bk035` | BK035 Black Masterbatch \| GEMasterbatch | 清楚 | Low |
| `/products/bk040` | BK040 Black Masterbatch \| GEMasterbatch | 清楚 | Low |
| `/products/pt-300` | PT-300 Black Masterbatch \| GEMasterbatch | 清楚 | Low |
| `/products/dm2476g` | DM2476G Desiccant Masterbatch \| Technical Review | 可以更商业 | Low |
| `/applications` | Masterbatch Applications \| Film, Injection, Pipe and Recycled Plastic | 覆盖清楚但过宽 | Medium |
| Color Injection | Color Masterbatch for Injection Molding \| Manual RFQ Review | “Manual”占据搜索标题 | Medium |
| General Extrusion | Masterbatch for General Extrusion \| Manual RFQ Review | 同上 | Medium |
| HDPE Pipe | Masterbatch for HDPE Pipe Extrusion \| Manual Context Review | 同上 | Medium |
| Packaging Film | Black Masterbatch for Packaging Film \| Manual Grade Review | 商业关键词好，但防御性后缀 | Medium |
| White Film | Masterbatch for White Film \| Neutral Knowledge Guide | 与非现售产品定位冲突 | High |
| `/manufacturing-quality` | Masterbatch Manufacturer \| Manufacturing & Quality | Good | Low |
| `/documents` | Masterbatch Documents - TDS / SDS / MSDS / COA Review | Good | Low |
| `/about` | About GEMasterbatch and GE Chemical | Good | Low |
| `/faq` | Masterbatch RFQ FAQ \| Documents, Samples, MOQ and Applications | Good | Low |
| `/contact` | Contact GE CHEMICAL \| Masterbatch RFQ and Document Review | Brand naming slightly inconsistent | Medium |
| `/privacy` | Privacy Policy \| Masterbatch Supplier | Fine | Low |
| `/terms` | Terms of Service \| Masterbatch Supplier | Fine | Low |

RFQ 页面公开抓取结果没有正常暴露页面 title，而以域名显示；页面本身有 H1 “Masterbatch RFQ and Document Review Request”。需要检查源 HTML 来确认是否真缺 `<title>`，本次不能仅凭抓取器表现下定论。([GEMasterbatch](https://www.gemasterbatch.com/rfq))

## Meta Description

**Unable to verify reliably from the public text extraction used in this audit.**

不编造。

## H1

绝大多数检查页面有明确唯一语义 H1。

产品 H1 结构很好：

> BK030 Black Masterbatch

Application H1 也明确。

FAQ detail 存在明显的：

> H1 question  
> H2 same question

例如 MOQ page。([GEMasterbatch](https://www.gemasterbatch.com/faq/before-rfq/what-is-your-minimum-order-quantity))

不是严重 SEO 问题，但内容结构冗余。

## Thin / Duplicate risk

最大风险是两个模板：

### Product template

6 个 Black grades 的页面除配方值外高度类似。

### FAQ template

大量 FAQ detail：

- 一个短回答
- 一个完全相同的 Review Note
- 相同 project review
- 相同 footer

([GEMasterbatch](https://www.gemasterbatch.com/faq/quality-and-specification/how-do-you-control-color-consistency))

这不是“duplicate page”已经确认。

但属于明显的 **low unique-information-density risk**。

---

# 11. Technical SEO

这里必须严格区分“确认”和“无法确认”。

| 检查项 | 状态 |
|---|---|
| HTTPS main pages accessible | **Observed: Yes** |
| Clean descriptive URLs | **Observed: Yes** |
| Breadcrumb visible | **Observed: Yes on products/RFQ** |
| robots.txt | **Unable to verify from public fetch** |
| sitemap.xml | **Unable to verify from public fetch** |
| Canonical | **Unable to verify** |
| meta robots / noindex | **Unable to verify** |
| HTTP→HTTPS behavior | **Unable to verify** |
| www/non-www consolidation | **Unable to verify** |
| trailing slash redirects | **Unable to verify** |
| correct 404 status | **Unable to verify** |
| redirect chains | **Unable to verify** |
| Core Web Vitals | **Unable to verify from reliable public data** |
| LCP / INP / CLS | **Unable to verify** |
| server logs | **Not public** |

Privacy page does confirm the site is using **Vercel Analytics and Speed Insights**, and optional GA4 via GTM, but that does not expose actual CWV results.([GEMasterbatch](https://www.gemasterbatch.com/privacy))

### JavaScript

Content was publicly retrievable as text across dozens of URLs, so there is **no evidence in this audit of catastrophic JS-only content blocking**.

But rendering implementation itself cannot be fully verified.

---

# 12. Structured Data

Presence of the following could **not** be reliably verified from the page-text interface:

- Organization
- WebSite
- Product
- BreadcrumbList
- Article
- FAQPage
- Person
- LocalBusiness
- VideoObject
- ImageObject

Therefore:

> **Structured-data presence/status: Unable to verify from public data available to this audit.**

However, the visible site contains strong schema candidates:

- Product + grade facts
- Breadcrumbs
- Organization/legal entity
- FAQ content
- factory/company
- documents

It would be particularly important later to verify whether visible FAQ content is actually paired with FAQ structured data and whether Product schema reflects only facts visible on the page.

---

# 13. GEO / AI Readiness

## Entity Clarity

### Strong

Website itself repeatedly clarifies:

- Brand = GEMasterbatch
- Legal entity = GE Chemical & Polymer Group Co., Ltd.
- Manufacturing = Binzhou, Shandong

([GEMasterbatch](https://www.gemasterbatch.com/about))

这是正确的 entity architecture。

### Weak

Contact email is:

- `david@ge-masterbatch.com`
- `jenny@ge-masterbatch.com`

while public website is:

- `gemasterbatch.com`

([GEMasterbatch](https://www.gemasterbatch.com/contact))

这正是你要求重点检查的 **gemasterbatch.com vs ge-masterbatch.com** 问题。

本轮没有可靠验证到 `ge-masterbatch.com` 的公开网站内容，因此不能说两个网站一定互相竞争。

但**邮箱域名和品牌网站域名不同本身已经成立。**

此外，LinkedIn 的公司页面名称甚至显示 “GE Chemcial & Polymer Group”，同时第三方 TradeIndia 列出的公司地址为 Qingdao，并描述 White/Color/Filler 等更广产品线；当前官网则将品牌、制造基地和 current portfolio 统一到 Binzhou + Black/Desiccant。这意味着外部 entity footprint 目前并不完全统一。([LinkedIn](https://www.linkedin.com/company/ge-chemcial-%26-polymer-group?utm_source=chatgpt.com))

## 20 个典型 AI Questions

| Query | 当前 Answerability |
|---|---|
| What is masterbatch? | **Good** |
| What is black masterbatch? | Partial |
| What black masterbatch is suitable for blown film? | **Weak** |
| What is BK020? | Good |
| What is BK025? | Good |
| What is BK030? | Good |
| Carbon black content of BK030? | **Excellent** |
| Carrier of BK030? | Excellent |
| What is BK040 used for? | Good |
| BK025 vs PT-300? | **Weak** |
| Which grade has highest carbon black? | Good |
| What is desiccant masterbatch? | Partial |
| What is DM2476G? | Good |
| CaO content of DM2476G? | Excellent |
| What is DM2476G used for? | Good |
| Can DM2476G be used in recycled PE? | **Website does not establish this** |
| How much desiccant should be added? | **No answer published** |
| What is your MOQ? | Case-by-case answer |
| Do you provide FDA/RoHS/REACH docs? | Good boundary answer |
| What shipping terms do you offer? | Good |

The site explicitly refuses to publish a universal DM dosage or recycled-plastic relationship.([GEMasterbatch](https://www.gemasterbatch.com/faq/quality-and-specification/desiccant-dosage-recycled-plastic)) It does provide a usable trade-term answer-FOB/CIF/EXW can be discussed case-by-case.([GEMasterbatch](https://www.gemasterbatch.com/faq/logistics-and-trade/what-are-your-shipping-terms))

### GEO conclusion

当前 GEO 最大问题不是：

> AI 看不懂网站。

而是：

> **AI 可以读懂事实，但网站给它的可回答事实过少。**

这两个问题完全不同。

---

# 14. E-E-A-T / Trust

## Experience - 7/10 level

Manufacturing 页面展示：

- factory exterior
- site overview
- yard
- packaged goods
- export loading

这是非常好的 Experience evidence。([GEMasterbatch](https://www.gemasterbatch.com/manufacturing-quality))

## Expertise - medium

FAQ 数量很多，也覆盖：

- resin compatibility
- Delta E
- dosage
- documentation
- extrusion
- food contact

但很多答案最终停留在：

> “需要人工确认。”

例如 “What base resins can your masterbatch be added to?” 最终没有列出任何实际兼容范围。([GEMasterbatch](https://www.gemasterbatch.com/faq/quality-and-specification/what-base-resins-can-you-use))

因此证明了**谨慎**，但还没有充分证明**技术深度**。

## Authoritativeness

有：

- Legal identity
- Factory
- capacity
- document workflow

但公开页面未看到足够的：

- laboratory equipment
- test methods
- measurable QC process
- case studies
- named technical experts
- dated technical articles

## Trust

较强：

- legal company
- physical address
- named contacts
- phones/WhatsApp
- privacy
- terms
- factory imagery

([GEMasterbatch](https://www.gemasterbatch.com/contact))

主要削弱因素：

**email domain mismatch + external entity inconsistencies.**

---

# 15. B2B CRO

| Persona | 当前路径 | 能回答什么 | 可能流失点 |
|---|---|---|---|
| 美国采购经理 | Manufacturer → Product → Documents | 工厂、grade、基础组成 | MOQ/packaging/lead time/QC evidence不足 |
| 印度经销商 | Products → FAQ → RFQ | Portfolio、trade term方向 | Portfolio显得窄；旧 White/Color 内容混淆 |
| 越南吹膜技术经理 | Packaging Film → 6 grades | 哪些 grades 有关系 | **无法决定6个中的哪一个** |
| 中东贸易商 | About/Factory → Contact → RFQ | Factory、WhatsApp、CIF/FOB | email domain mismatch、包装/交期不足 |
| 再生料加工厂老板 | Recycled Plastic → DM | 能发现 desiccant | **页面明确没有 recycled mapping/dosage/result** |

其中 Vietnam blown-film buyer 的问题最值得重视。

Packaging Film 页面把六个 grade 全部列出来，但又明确不进行排序或选择。([GEMasterbatch](https://www.gemasterbatch.com/applications))

也就是说：

**SEO landing 能抓住需求，但 commercial decision layer 没有完成。**

---

# 16. RFQ Audit

当前 `/rfq` 是一个非常“销售资格审查型”的 RFQ。([GEMasterbatch](https://www.gemasterbatch.com/rfq))

## Required

至少：

1. Name
2. Company
3. **Company Website**
4. Email
5. Country / Region
6. Product Type
7. Application
8. Message

Optional 还包括：

- WhatsApp
- Processing Method
- End Product
- Base Resin
- Color / Function
- Reference
- Quantity
- Order Stage
- Sample
- Document types
- Standards
- Destination Port

## 优点

对 B2B qualification 很强。

销售收到的 lead 会更有上下文。

尤其可以提前知道：

- resin
- application
- quantity
- destination
- documents

这非常适合 masterbatch。

## 缺点

首次 contact friction 偏高。

特别是：

### Company Website Required

Privacy Policy 明确说明，Company Website 可以用于 business qualification/customer-profile analysis。([GEMasterbatch](https://www.gemasterbatch.com/privacy))

所以它并不是无意义字段。

### 优点

- 判断 B2B legitimacy
- 理解客户业务
- 减少垃圾询盘
- 帮销售准备回复

### 缺点

- 很多真实加工厂没有英文网站
- 经销商可能只有社交页面
- 新公司可能没有官网
- 用户会意识到自己将被 qualification
- 首次接触阶段心理门槛明显

### 结论

不适合简单回答：

> “必须删掉”。

但作为**required field**，当前更偏向：

> Lead screening first

而不是：

> Conversion first.

目前 RFQ 确实有“为了筛选客户而牺牲部分首次转化”的倾向。

### Spam protection

**Unable to verify.**

Privacy 只确认表单当前通过 Web3Forms delivery path；是否有 CAPTCHA、Turnstile、honeypot 或 server-side rate limit，本轮无法确认。([GEMasterbatch](https://www.gemasterbatch.com/privacy))

---

# 17. Brand Consistency

这是一个 P1 问题。

### Current website domain

`gemasterbatch.com`

### Sales email

`@ge-masterbatch.com`

### Brand

GEMasterbatch

### Legal entity

GE Chemical & Polymer Group Co., Ltd.

### Contact heading

“GE CHEMICAL”

([GEMasterbatch](https://www.gemasterbatch.com/about))

这些不是互相矛盾到不可理解。

但对第一次接触的海外客户和 AI entity resolution 而言，已经需要进行额外关联：

> GEMasterbatch  
> GE CHEMICAL  
> GE Chemical & Polymer Group  
> gemasterbatch.com  
> ge-masterbatch.com

网站自己已经很好地解释了 brand/legal-company 关系。

**email domain 是当前最明显未统一的部分。**

---

# 18. Content Quality

## 最大问题：defensive language

现站大量出现：

- manual review
- document scope review
- not automatic recommendation
- not suitability conclusion
- no result promised
- no dosage published
- no fixed MOQ
- no fixed lead time
- not evidence
- case by case

这在合规意识上是好事。

但用量明显过度。

### 一个非常典型的 FAQ Detail

MOQ 页面主体答案只有一段：

> MOQ is reviewed case by case...

紧接着出现固定 Review Note，说明：

> no fixed MOQ, lead time, certification, color tolerance, dosage, cost reduction or compatibility promise...

([GEMasterbatch](https://www.gemasterbatch.com/faq/before-rfq/what-is-your-minimum-order-quantity))

Sample lead time 页又重复相同 Review Note。([GEMasterbatch](https://www.gemasterbatch.com/faq/sample-and-trial/what-is-the-sample-lead-time))

Delta E 页也是。([GEMasterbatch](https://www.gemasterbatch.com/faq/quality-and-specification/how-do-you-control-color-consistency))

## 对信任

适量 → 提高可信度。

过量 → 给用户感觉：

> “你们似乎什么都不愿意公开确认。”

## 对专业度

专业网站应当：

> 给出已知事实 + 条件 + 边界。

而不是：

> 主要告诉用户不能下什么结论。

## 对 SEO

34 个 FAQ detail 的 unique information 很少，template ratio 很高。

存在 thin-content / low-information-gain 风险。

## 对 GEO

这是更严重的问题。

AI 搜索需要：

> Question → concise answer → evidence → caveat.

当前很多页面实际上变成：

> Question → caveat → manual review.

因此非常不利于被 AI 当成完整答案来源。

## AI-generated feel

不能证明内容是 AI 写的。

但可以确认：

> **高度模板化、句式高度重复，因此存在明显 AI-like / template-generated feel。**

---

# 19. Scorecard

评分方法：

**10 = 当前公开站点已接近成熟 B2B industrial benchmark；5 = 有结构但明显不完整；0 = 基本不存在。**

无法确认的 technical 项不会被当作已确认故障，但因此技术分数置信度较低。

| Dimension | Score | Evidence basis |
|---|---:|---|
| Brand Positioning | **6/10** | 产品范围/制造身份清楚，但价值定位弱 |
| Product Clarity | **5/10** | grade 清楚，选择逻辑不清 |
| Information Architecture | **7/10** | 层级浅、导航清楚，但内容角色混合 |
| SEO Foundation | **6/10** | clean URL/title/H1/FAQ体系；薄内容风险 |
| Technical SEO | **5/10*** | 页面可抓取、URL干净；robots/canonical等未验证 |
| Content Quality | **5/10** | 有结构但防御型语言和模板重复严重 |
| GEO Readiness | **5/10** | 基础事实 machine-readable；answerability不足 |
| Entity Clarity | **6/10** | brand/legal/factory解释好；domain/email冲突 |
| Trust / E-E-A-T | **7/10** | 工厂、地址、联系人较强；技术证据还浅 |
| Product Page Quality | **4/10** | composition clear，selection evidence不足 |
| Application Page Quality | **4/10** | 只有2类真正有 current mapping |
| Internal Linking | **7/10** | 基本链路完善，contextual links不足 |
| B2B Conversion | **5/10** | CTA强，但缺采购判断信息 |
| RFQ Experience | **5/10** | qualification优秀，首次 friction 偏高 |
| Scalability | **6/10** | template/URL骨架可扩展，但当前内容模型需先纠正 |

\* Technical SEO score confidence = low，因为关键技术信号无法公开确认。

---

# 20. P0 / P1 / P2 / P3 Issue List

## P0 - Critical

**目前没有从公开页面可靠确认到 P0 crawl/index blocker。**

robots、canonical、noindex、sitemap、redirect、HTTP status 等必须通过正式 crawl / GSC 再确认。

不能因为抓取工具无法读取 sitemap 就直接宣布网站 sitemap 有故障。

---

## P1 - High

| Priority | Issue | URL / Scope | Impact |
|---|---|---|---|
| P1 | Grade differentiation 几乎只靠 composition | `/products/*` | SEO/GEO/CRO |
| P1 | 产品价值被 Carbon Black % / CaCO3 % 主导 | Home + Products | Positioning |
| P1 | PT-300 vs BK025 选择逻辑不明 | two product pages | Conversion |
| P1 | Application 中混入非现售 White/Color/Slip | `/applications/*` | Entity / trust / SEO |
| P1 | Packaging Film 关联6个grade却无法选择 | Packaging Film | Conversion |
| P1 | Recycled Plastic / Recycled PE-PP intent overlap | two application pages | Cannibalization risk |
| P1 | 34 FAQ detail 信息密度过低 | `/faq/*` | SEO / GEO |
| P1 | defensive/manual-review language 过度 | sitewide | GEO/CRO |
| P1 | website/email domain mismatch | Contact | Trust/entity |
| P1 | RFQ Company Website required | `/rfq` | Conversion |

---

## P2 - Medium

| Issue | Impact |
|---|---|
| 工厂证据真实，但技术 QC 深度不足 | Trust |
| Application / Knowledge 内容边界不明显 | IA |
| FAQ contextual internal linking不足 | SEO |
| Product packaging/MOQ/lead-time不在产品决策路径出现 | CRO |
| Application title 过度使用 “Manual Review” | CTR/positioning |
| About/Contact/Brand naming未完全标准化 | Entity |
| H1/H2 FAQ question重复 | Content |
| Product pages高度模板化 | SEO |

---

## P3 - Low

- 个别 title 可以更聚焦搜索 intent
- FAQ 页面可减少 template boilerplate
- CTA wording 可进一步按 buyer stage 区分
- Contact 与 RFQ 职责可以更精确

---

# 21. Assets Worth Preserving

网站重建时，以下内容**绝对不应该随便丢失**：

### 1. Grade identities

- BK020
- BK025
- BK030
- BK035
- BK040
- PT-300
- DM2476G

这些已经形成稳定的产品实体。

### 2. 原始 grade-specific technical facts

例如：

- Carbon black %
- CaCO3 %
- Carrier
- CaO
- Moisture

只要来源文件真实，就必须保留。

### 3. 现有 URL equity

特别是：

- `/products/...`
- `/applications/...`
- `/faq/...`

即使未来架构调整，也必须先结合 GSC/backlinks 判断保留或 301，不能直接删除。

### 4. Factory evidence

这是目前最强的资产：

- exterior
- aerial/site overview
- production yard
- packaging
- container loading

([GEMasterbatch](https://www.gemasterbatch.com/manufacturing-quality))

### 5. Company identity

- GEMasterbatch
- GE Chemical & Polymer Group Co., Ltd.
- Binzhou manufacturing identity
- physical address
- contacts

### 6. Manufacturing facts

- 12 Black Masterbatch lines
- 50,000+ t capacity
- 30+ markets

前提仍然是内部可以提供证据支持。([GEMasterbatch](https://www.gemasterbatch.com/manufacturing-quality))

### 7. Document inventory

尤其：

- seven TDS records
- named SDS record
- existing FDA-related tested sample
- COA/document-request workflow

Documents 页面对证据边界处理得很谨慎，这种“grade-specific evidence discipline”值得保留。([GEMasterbatch](https://www.gemasterbatch.com/documents))

### 8. Current product/application relationships

尤其：

- six Black grades → Packaging Film
- DM2476G → General Extrusion

不要在重建时凭经验扩大 mapping。

---

# 22. Unknowns / Data Required

在 Step 02 之前，以下仍属于真正未知：

## Search / SEO

- Google Search Console
- Bing Webmaster Tools
- Indexed URL count
- Queries
- Impressions
- CTR
- Average position
- Google-selected canonical
- crawling errors
- backlinks
- referring domains
- historical rankings

## Analytics

- GA4
- Landing page traffic
- Country traffic
- conversion rate
- RFQ event funnel
- CTA click rate
- mobile vs desktop behavior

Privacy 页面表明 GA4/GTM/Vercel Analytics infrastructure 至少存在，但没有实际数据。([GEMasterbatch](https://www.gemasterbatch.com/privacy))

## Commercial

- RFQ volume
- qualified RFQ rate
- spam rate
- quote rate
- sample conversion
- order conversion
- markets by revenue
- revenue/product mix
- distributor vs end-user share
- lost inquiry reasons

## Product

特别需要内部真实资料确认：

- TDS 全部原始版本
- product formulation boundaries
- MFI
- Density
- Dispersion testing
- Jetness
- Tint strength
- filter pressure
- recommended dosage
- process temperature
- polymer compatibility
- packaging
- MOQ
- typical lead time
- sample policy
- real application data

不能根据行业经验补写。

## Factory / Quality

- production equipment
- lab equipment
- test methods
- QC workflow
- incoming inspection
- batch inspection
- COA indicators
- traceability
- certifications
- accreditation
- third-party audit reports

## Technical SEO

必须拿到或正式抓取：

- robots.txt
- sitemap.xml
- canonical
- meta robots
- HTTP status
- redirects
- hreflang
- schema
- CWV
- server response
- broken links
- log files

---

# 最终三个问题

## Question 1 - 当前网站最值得保留的 5 项资产是什么？

**① 7 个现有 grade 的产品实体与技术源数据。**

**② Binzhou 真实工厂照片、生产现场、包装和出口装柜证据。**

**③ GEMasterbatch → GE Chemical & Polymer Group Co., Ltd. → Binzhou factory 的实体关系。**

**④ Products / Applications / Documents / RFQ 已经形成的基础信息架构和内部链接骨架。**

**⑤ 已经存在的 TDS/SDS/COA/document-scope 体系，以及“不能把一个文件错误套用到所有 grade”的证据纪律。** ([GEMasterbatch](https://www.gemasterbatch.com/manufacturing-quality))

---

## Question 2 - 当前网站最严重的 10 个问题是什么？

1. **Black Masterbatch 产品价值几乎被压缩成 Carbon Black % / CaCO3 % 比较。**
2. **六个 Black grades 缺少真正可以支持 A vs B 选择的 differentiation。**
3. **BK025 与 PT-300 尤其缺乏清楚的选择理由。**
4. **Product pages 缺少足够的加工、性能、dosage、compatibility、application-result 信息。**
5. **Commercial Application 与 SEO Knowledge Content 混在 `/applications/`。**
6. **White / Color / Slip / Filler 等非现售产品仍然大量占据 Application/FAQ 语义空间。**
7. **FAQ/detail 内容过薄且高度模板化。**
8. **“manual review / no conclusion / no recommendation”防御型语言使用过度，削弱 GEO 和 CRO。**
9. **gemasterbatch.com 网站与 `@ge-masterbatch.com` 邮箱造成 entity/domain fragmentation。**
10. **RFQ qualification 过重，尤其 Company Website required 对首次转化存在明显 friction。**

---

## Question 3 - 进入 Step 02 竞争对手研究之前还缺什么？

最关键的不是再猜竞争对手，而是补齐以下 **first-party baseline**：

**第一组：Search Console / Bing Webmaster 数据**  
先确认现在哪些 URL 有 impressions、哪些关键词已经有 ranking、哪些旧页面有 SEO equity。

**第二组：GA4 / RFQ / CRM 数据**  
确认真正产生询盘的 landing pages、国家、产品和 application。

**第三组：完整产品与技术原始资料**  
尤其 7 个 grade 的 TDS、测试数据、真正的产品差异、dosage/application evidence。

**第四组：Factory / QC / certification evidence**  
把“我们确实是制造商”升级为可验证的制造与质量体系。

**第五组：Technical crawl 数据**  
robots、sitemap、canonical、indexability、schema、redirect、404、CWV。

---

### Baseline verdict

目前 GEMasterbatch 最需要解决的，不是“网站太少”。

恰恰相反，它已经有 **62 个左右的公开页面**。

真正的问题是：

> **现有网站的信息量已经不少，但“商业决策信息密度”太低。**

尤其 Black Masterbatch，现在搜索引擎和采购商都能知道：

> BK030 = 30% carbon black。

但他们仍然不知道：

> **“为什么我的工厂应该选择 BK030？”**

这就是进入 Step 02 竞争对手研究时最重要的比较基准。

---

**Sources:**

- [GEMasterbatch | Industrial Masterbatch for Global Processing](https://www.gemasterbatch.com/)
- [GE Chemcial & Polymer Group | LinkedIn](https://www.linkedin.com/company/ge-chemcial-%26-polymer-group?utm_source=chatgpt.com)



---
Powered by [ChatGPT Exporter](https://www.chatgptexporter.com)
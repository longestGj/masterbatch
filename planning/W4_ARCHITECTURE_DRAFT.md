# W4 网站与信息架构首选提案 — DRAFT / 待 Owner 批准

**范围与权威。**本文件是供业主审查的候选架构，不批准任何页面、URL、导航、SEO 归属、语言版本或迁移操作。2026-09-23 的已批准战略以 [SITE_BRIEF](SITE_BRIEF.md)「W3 strategy decisions approved by the owner」为准；[W3_STRATEGY_DRAFT](W3_STRATEGY_DRAFT.md)只解释依据和改判条件。[INPUT_REVIEW](INPUT_REVIEW.md)是当前 W1 事实边界；[W2_RESEARCH](W2_RESEARCH.md)仍为 DRAFT 研究输入。原 W4 执行时项目 HEAD 为 `7b65c7f`，W3 决定所在版本 `a78d783`，W2 研究版本 `60963d6`。本次没有修改 [SITE_MAP](SITE_MAP.csv)、[SEO_MAP](SEO_MAP.csv) 或 [CONTENT_MODEL](CONTENT_MODEL.md)。

## 1. 先确定实体、主题、任务、行动和证据责任

网站的公开主体始终是 **GE Chemical & Polymer Group Co., Ltd.**。它是一个帮助买家核验供方、初筛产品并进入合格商务对话的对外营销网站。黑色母粒是核心；优先服务色母粒制造商的技术与采购判断，贸易商／经销商是重要的第二路径，直接制品厂仍可使用同一产品与询盘路径。阿联酋和沙特并列当前核心市场，越南是重要增长市场。白色母粒准确呈现，彩色和除湿母粒作为受控增长方向。以上排序来自 SITE_BRIEF，不能由旧关键词量改变。

| 责任 | 规范答案位置（均为候选） | 范围与关系 |
|---|---|---|
| 主体身份：GE 是谁 | `/about`；首页摘要并链接到此 | 只使用 GE 对外名称。来源材料中的其他实体及其关系未确认，不进入公开身份叙述。 |
| 制造、质量与供应可信度 | `/manufacturing-quality`；相关产品页链接到此 | 滨州工厂、12 条黑色母粒产线、年产能超过 5 万吨、实验室是业主接受的公司工作性陈述，不能变成单个型号产能、交付保证或批次表现。[SITE_BRIEF](SITE_BRIEF.md)、[INPUT_REVIEW](INPUT_REVIEW.md) |
| 实际供给范围与产品优先级 | `/products` | 黑色领衔；白色与彩色先由此页承担供给说明，除湿连接有依据的产品族。黑色超过出口量 80% 是业主陈述，不是每个型号现售证明。 |
| 黑色母粒商业查询与共同选型问题 | `/products/black-masterbatch` | 作为 `black masterbatch`、`black masterbatch supplier`、`black masterbatch manufacturer` 通用商业查询的候选主要搜索归属，回答供给与产品族评估，并引导核对树脂／工艺／目标及型号区别；不按单一配比推断性能排序。 |
| 型号身份与型号级事实 | 经确认值得独立呈现的 `/products/<model>` | 七份黑色 TDS 分别涉及 BK020、BK025、BK030、BK035、BK040、PT-300、**PT-450P**。`TDS--PT-400.doc` 正文型号是 PT-450P。DM2476G 的 TDS 属除湿母粒。TDS 可用于候选内容，但不证明型号现售、在某国成交或适用于旧站列出的每个应用。[INPUT_REVIEW](INPUT_REVIEW.md) |
| 具体加工／应用问题 | 有独立答案和已核实产品关系的应用内容；否则归入产品族 | 应用、树脂、问题是买家任务维度，不能从关键词组合自动生成页面；应用到型号的关系必须另有型号级依据。 |
| 文件类型、获取方式与证明范围 | `/documents`；型号页只链接确有对应关系的证据 | 黑色 RoHS 报告仅对应未指明 BK/PT 型号的提交样品，且报告日期冲突；白色 FDA 报告仅对应 MB Blanco PE 样品。SDS/TDS/报告的存在不等于全系列认证或批准公开下载。[INPUT_REVIEW](INPUT_REVIEW.md) |
| 商务下一步 | `/rfq` 收集项目需求；`/contact` 处理一般联系及备用路径 | 目标是能继续核对型号、试样或报价的对话。可引导说明树脂、工艺、制品、目标、目的地、预计数量和所需文件；实际回复、寄样、报价、文件交付与时限要与运营能力核对后才能承诺。[W2_RESEARCH](W2_RESEARCH.md) |

AI 可读取的关系应保持明确且一致：**GE → 产品族 → 已确认型号 → 对应 TDS**；**GE → 公司自述能力**；**提交样品 → 对应检测报告**；**GE → 业主所述销售市场**。这些关系不能合并推论为「某型号已在某国成交」或「某样品报告认证整个产品族」。内部来源界限留在规划中；面向买家的页面应自然说明产品、供应能力和下一步，不使用证据审查口吻。[SITE_BRIEF](SITE_BRIEF.md)、[INPUT_REVIEW](INPUT_REVIEW.md)

## 2. 主要买家路径与返回路径

1. **色母粒制造商。**从首页、搜索或直接链接进入黑色产品族 → 依据树脂、工艺、制品与目标初筛型号 → 查看型号事实和 GE 制造能力 → 带具体条件提交商务需求。若无法可靠判断适配，说明需要补充哪些条件，返回产品族或联系入口；不假定网站能自动推荐型号。
2. **贸易商／经销商。**从产品范围与型号资料了解可向下游转述的内容 → 查看制造与文件范围 → 带下游应用和目的地联系 GE。若渠道方尚不掌握加工条件，提供向下游追问的项目要点；不假定其具有技术决策权或某种渠道政策。[W2_RESEARCH](W2_RESEARCH.md)
3. **直接制品厂。**从有依据的产品或应用答案进入同一型号初筛和联系路径；这是可服务的访问者路径，不改变已批准的买家优先级。
4. **已接洽或复购客户。**可直接回到型号、文件范围、询盘或联系入口，不被迫重看泛化介绍。若表单失败或资料暂不能提供，页面应有明确的替代联系与返回方式；具体交付机制留待后续运行验证。

## 3. 查询族与规范答案归属（SEO / GEO）

原 W4 使用项目 [keyword-research-and-clustering Skill](../.agents/skills/keyword-research-and-clustering/SKILL.md)。旧 [关键词机会图](inputs/Cmp_Info/MASTERBATCH_KEYWORD_OPPORTUNITY_MAP.md) 主要来自美国、印度，并把填充、白色、彩色列为 P0；它可提供术语线索，不能给已批准的黑色及阿联酋、沙特、越南方向排页面优先级。W2 已研究买家与替代方案，但没有查询级地图；原 W4 只补足可能改变架构的广泛查询归组。本次修正复用该证据，不重跑研究，也不以搜索量推断商机。目前没有 GE 询盘原话、搜索控制台、目标市场排名或可靠流量指标。

| 按买家任务区分的查询族与候选表达 | 买家任务、主要搜索与答案归属 | 支持页面及边界 |
|---|---|---|
| **通用黑色母粒商业查询：**`black masterbatch`、`black masterbatch supplier`、`black masterbatch manufacturer` | 买家评估黑色母粒供方与产品范围。候选 **primary search owner 为 `/products/black-masterbatch`**，回答黑色产品族供给、初筛与下一步。 | 首页主要承担 GE 品牌／主体和整体产品入口；`/about` 提供实体证明；`/manufacturing-quality` 提供工厂、产能与质量过程证明。这些页面链接支持产品族，不争此查询族。国家修饰词不自动产生国家页。 |
| **型号与选择：**black masterbatch grade、载体、指标、grade comparison、BK/PT 型号 | 买家区分具体型号；黑色产品族承担共同选择条件，经确认具有独立判断价值的型号页承担该型号事实。 | 不让多个型号页重复争通用黑色产品查询；技术资料须保留型号范围。 |
| **Documents / Compliance：**TDS、SDS/MSDS、RoHS、FDA、COA、document availability | 买家判断有哪些文件、各自适用范围及如何获取；主要答案归 `/documents`，确有关系的型号级证据回到型号页。 | 样品报告不扩写成系列认证；文件请求动作须与实际交付能力一致。 |
| **Sample / Trial：**sample、trial、sample availability、trial quantity、sample process | 买家判断能否进入试样／试用及需提供哪些条件；产品族或型号解释适用的技术前提，`/rfq` 承担提交项目条件和接续对话。 | 不自动归为 Documents，也不在未知政策前承诺免费样品、数量或时限。 |
| **Commercial Inquiry：**MOQ、quote、price request、lead time、commercial terms | 买家进入商务讨论并核对交易条件；主要行动归 `/rfq`，`/contact` 为一般联系和备用路径。 | 产品页可以引导，不能把未经确认的价格、MOQ、交期或条款写成固定承诺。 |

阿联酋、沙特、越南的地名修饰以及阿语、越语表达，目前是跨上述任务的**市场／语言观察维度**，不是已证实的独立查询族或国家页面责任。现阶段由统一产品、公司、能力和联系路径回答；当地库存、服务与语言维护不能由搜索词推断。

**候选应用／问题研究桶，并非已成立的单一查询族：**

| 待区分的问题方向 | 可能的买家任务 | 当前页面判断 |
|---|---|---|
| Film / 薄膜应用 | 询问薄膜制品、工艺条件与可考虑的黑色型号 | 先核对旧包装薄膜页与型号关系；有独立、充分答案才保留应用页。 |
| Pipe / 管材应用 | 询问管材要求与产品是否适配 | 旧 HDPE 管页不能代替 GE 型号适用证据。 |
| Recycled resin / 再生料语境 | 询问材料状态、处理目的及相关产品 | 区分黑色着色与除湿需求，不能从再生料词推定同一解决方案。 |
| Dispersion / 性能问题 | 比较分散、外观或批次表现 | 需型号级测试或经验，不能仅凭配方比例建立独立性能页。 |
| Processing / 加工排障 | 针对设备、树脂、条件和缺陷寻求判断 | 先处理可回答的共同问题；独立页面须有可靠的 GE 产品关系与足够答案。 |

这些是研究概念，不等于已验证的搜索需求或新增页面决定；**出现应用查询 ≠ 需要独立页面**。不生成「国家 × 用途 × 树脂 × 问题」矩阵，竞品内容也不证明 GE 的适配。

**主要搜索归属的判断依据：**SITE_BRIEF 已确定黑色母粒为首要供给和具体型号判断为价值主线；项目供应的旧站审计列出已有黑色产品族页，承担商业产品评估，而首页还需承担 GE 身份及整体入口。因而将通用黑色母粒商业查询集中到产品族页、以首页和证明页支持其判断，是本轮的架构选择，不是对当前各市场 SERP 排名或搜索意图占比的实测结论。[SITE_BRIEF](SITE_BRIEF.md)、[旧站审计](inputs/ChatGPT-Step1GEMasterbatch审计报告-20260923-0959.md)

外部公开样本仅证明这些信息任务在可见供应页面出现，例如[阿联酋分销商黑色母粒型号与索 TDS 页面](https://www.tawazon.com/industries/plastics-raw-material/masterbatch/black-masterbatch/)、[沙特企业阿语站](https://www.astra-polymers.com/ar/)及[越南企业黑色母粒页](https://europlas.com.vn/san-pham/color-masterbatch/black-masterbatch)。它们不证明 GE 买家需求比例、可赢订单或本地化回报。具体观察与假设的边界仍须保持：英文代表词和项目已有术语是查询候选；阿语、越语页面可见是语言供给观察；GE 客户会使用这些词以及搜索会带来高价值询盘仍是假设。研究停止在能够划清规范答案责任之处。本次对首页与黑色产品族主要搜索归属的疑问已由批准战略和现有页面责任解决，故没有调用 `search-intent-evidence-analysis`。

**限定查询抽样记录（2026-09-23）：**检索未设置搜索引擎国家定位；查询中的国名是检索词，不是当地买家实际用语。阿联酋英语输入 `black masterbatch supplier UAE manufacturer distributor grades TDS` 和 `black masterbatch supplier UAE TDS MOQ film`；[Tawazon](https://www.tawazon.com/industries/plastics-raw-material/masterbatch/black-masterbatch/) 的型号及索 TDS 信息仅来自搜索结果摘要，原页本轮打开失败，W2 亦记录此限制。沙特英语输入 `black masterbatch supplier Saudi Arabia manufacturer data sheet`、`black masterbatch supplier Saudi Arabia factory distributor`；[NAI](https://plastic.nai.com.sa/masterbatches/) 是 W2 已列的当地供方参照。沙特／阿联酋阿语输入 `مورد ماسترباتش اسود السعودية تصنيع`、`مورد ماستر باتش أسود الإمارات العربية المتحدة`；实际打开的 [Astra 阿语站](https://www.astra-polymers.com/ar/)展示产品族和查找入口。越南英语输入 `black masterbatch supplier Vietnam manufacturer black masterbatch`；[CPI](https://cpiplastic.com/en/product/black-masterbatch/) 本轮原页打开失败，只使用搜索摘要与 W2 已记录的受限观察。越语输入 `hạt nhựa màu đen nhà cung cấp Việt Nam`、`hạt nhựa màu đen masterbatch TDS màng thổi Việt Nam`；实际打开的 [EuroPlas 页面](https://europlas.com.vn/san-pham/color-masterbatch/black-masterbatch)可见黑色母粒、应用、技术资料与联系入口。跨市场另输入 `black masterbatch grade selection PE PP film dispersion supplier technical datasheet`、`black masterbatch vs carbon black powder for masterbatch manufacturers`、`black masterbatch UAE Saudi Vietnam distributor technical data sheet`；可见[黑色母粒概念解释页](https://www.zhongfuhai.com/blog/what-is-carbon-black-masterbatch)，但样本无法判断各任务的比例。上述观察没有支持新增国家页、语言分站或应用页。

**仅是假设，尚非 GE 买家查询观察：**制造商寻找第二供应源、经销商替下游索 TDS、海湾客户需要当地库存、越南新客偏好越语，以及旧站每个应用都需要独立页面。这些须由 GE 销售、询盘、技术关系或搜索数据验证。

## 4. 首选页面系统、导航和内部链接

以下是**候选责任与路径，不是已批准的页面清单或规范 URL**。新路径在旧站盘点和 Owner 审定前均不得写入 SITE_MAP 或 SEO_MAP。

| 候选页面／URL | 独立职责和纳入条件 |
|---|---|
| `/` | **主要承担 GE 品牌／主体及整体产品入口**；让首次访问者知道 GE、黑色核心和进入产品／能力／联系的路径。支持黑色产品族商业查询，但不与其争主要搜索归属。 |
| `/products` | 承担整体产品范围的规范答案；黑色首位，白色和彩色先在此准确呈现，除湿以受控增长权重连接其有依据的产品族。 |
| `/products/black-masterbatch` | **通用黑色母粒商业查询的候选主要搜索归属**；承担产品族供给、共同选择问题、已确认型号的可解释差异和进入商务对话的路径。 |
| 现有 `/products/bk020`、`bk025`、`bk030`、`bk035`、`bk040`、`pt-300` | 候选保留路径。逐一核对现售、资料、独立选择价值和旧 URL 表现；型号相近或内容不足时，不能机械复制页面。 |
| `/products/pt-450p` | 新增候选，须先核实当前供给、独立型号身份与和其他黑色型号的差异；绝不能用文件名 PT-400。 |
| White masterbatch：暂由 `/products` 承担供给说明 | 业主确认白色与彩色共同构成约 10%–15% 出口量，白色另有 MB Blanco PE 样品报告，但缺白色型号 TDS、独特选型内容及独立买家任务证据。`/products/white-masterbatch` 仅在当前供给、独特内容、买家任务、维护能力、独立查询责任和商业重要性均可说明时再成为候选；样品报告不支持全系列合规主张。 |
| Color masterbatch：暂由 `/products` 承担推广范围说明 | 业主称正在推广彩色，但现有技术、型号和选型证据更弱。`/products/color-masterbatch` 只有在可供范围、独特判断内容、真实买家任务、持续维护与商业信号足以支撑时才考虑；不为产品目录对称而建页。 |
| `/products/desiccant-defoaming-masterbatch`、`/products/dm2476g` | 与白色和彩色不同，已有 DM2476G TDS、型号身份和旧站产品族／详情结构，保留 family + detail 的条件性候选基础较强；仍须确认当前供给、内容差异与旧 URL 价值。 |
| `/about`、`/manufacturing-quality`、`/documents` | 分别承担 GE 实体、制造能力、文件范围的独立答案并支持产品族；不争通用黑色母粒商业查询。 |
| `/rfq`、`/contact` | 主要商务对话与一般联系；按真实处理能力设计动作和失败后的替代路径。 |
| `/applications` 及详情 | 条件性次级内容。优先检查包装薄膜是否有独立答案及型号关系；其余逐页核对，不能仅因旧站已有八个应用页就延续。 |
| `/faq` 及详情 | 先把真实答案归回产品、文件、能力与询盘责任页；仅对独立、完整的买家问题保留详情页。 |

**导航候选：**Products（黑色母粒显著；不把白色、彩色和除湿机械放成同权重层级）／Manufacturing & Quality／Documents／About／Contact，持续可见的商务入口指向 `/rfq`。应用内容可从产品族、型号和相关内容链接进入；只有独立答案和已证实关系充分时才考虑占用主导航。产品族 ↔ 型号、型号 → 其真实相关的应用与文件范围、所有评估页 → 能力证明和商务下一步，构成内部链接的主链。导航选择高频路径，不等于站点全部库存。

**市场／语言候选：**暂以统一英文站点服务阿联酋、沙特、越南及其他已售市场。三个市场在供货讨论和可能的内容例子中应被有意识地考虑，且不得暗示当地库存、现场支持或具体交付条件。现无充分 GE 买家语言、差异服务、实际询盘与持续维护证据来支持 `/uae/`、`/saudi-arabia/`、`/vietnam/`、阿语或越语分站；日后证据出现可重新评估。越南的重要性不会被「暂不建越南页」削弱。[SITE_BRIEF](SITE_BRIEF.md)、[W2_RESEARCH](W2_RESEARCH.md)

## 5. 旧站迁移：已知线索和未知风险

项目供应的 [Step 1 旧站审计](inputs/ChatGPT-Step1GEMasterbatch审计报告-20260923-0959.md) 报称发现约 62 个 HTML 页面，列出六个黑色型号页、一个除湿型号页、八个应用详情与 34 个 FAQ 详情。它是**线索**，不是可靠的全量 URL、现存状态、规范 URL、索引、入链、流量或重定向清单。本轮未自行抓取旧站，也未把旧站文案当作批准的 GE 声明。

| 项目材料列出的旧路径 | 候选处置 | 执行前必须核对 |
|---|---|---|
| `/`、`/products`、`/products/black-masterbatch`、已列黑色型号、除湿产品族与 DM2476G | 优先考虑原路径保留并改善职责，不因改版机械改名 | URL 真实存在、规范地址、型号现售与差异、索引／入链／使用情况。 |
| `/about`、`/manufacturing-quality`、`/documents`、`/contact`、`/rfq` | 候选保留，修正身份、证据范围和行动结果 | 联系方式、表单送达、文件授权、实际隐私处理。 |
| `/applications` 和八个应用详情：颜色注塑、通用挤出、HDPE 管、包装薄膜、塑料包装、再生 PE/PP、再生塑料、白膜 | 逐页保留、合并、替换或退役；包装薄膜优先检验独立答案和型号关系。旧颜色／白膜页须按现有真实供给重判 | 精确 URL、内容与当前供给是否相符、具体型号适配依据、搜索与访问价值。 |
| `/faq` 与 34 个详情 | 完整答案可归并到规范页面；真正独立且有用的问题才保留。只有语义匹配且确有替代内容时才考虑 301 | 每条 URL、答案质量、索引和入链；不可将无关问题一律转首页。 |
| `/privacy`、`/terms` | 保留法律责任入口 | 当前与计划运行方式、实际政策文本。 |
| 文件、媒体及旧审计未列路径 | 去向未知 | 可靠站点导出／sitemap、搜索控制台和分析数据、现有重定向表；逐 URL 决定保留、重定向、规范化或退役。 |

路径改变会造成旧链接失效、搜索信号丢失或错误地把两个不同意图合并；因此以上没有批准任何 301、canonical 或删除。可靠清单到位后，才做一对一去向表与发布前核验。

## 6. 语义模型含义、Owner 架构批准与补充输入

架构需要区分产品族、型号、型号 TDS、提交样品报告、公司能力、应用／工艺和市场陈述；事实关系、解释性文案和选型／导航规则不能当成同一权威。W4 只定义其含义与责任，不决定 WordPress Page、Post、CPT、字段、模板或标记。[CONTENT_MODEL](CONTENT_MODEL.md) 保持 Core 起点，待架构获批后再处理具体建模。

### Owner Architecture Approvals / 待批准的架构取舍

1. 是否接受以黑色产品族和经确认的型号为主干、通用黑色母粒商业查询主要归 `/products/black-masterbatch`、白色和彩色先由 `/products` 承担、除湿保留条件性 family + detail 的页面系统。
2. 是否接受 Products 突出黑色母粒、能力和文件页面提供支持证明、显著询盘入口的导航与内部链接主线。
3. 是否接受统一英文站点作为当前结构，同时将阿联酋、沙特并列核心及越南增长市场体现在真实供给和沟通信息中；有独立本地需求与维护能力时再重评国家或语言结构。
4. 是否接受应用与 FAQ 的收缩原则：只有独立买家任务、足够答案及已证实关系才保留独立页，旧页逐 URL 判断，不为术语或目录对称建薄页。

### Required Inputs / 最终定稿前的事实与运行验证

- **Owner／销售／技术：**七个黑色 TDS 型号和 DM2476G 哪些当前可供应、各自的真实差异与典型需求；PT-450P 是否可公开展示。另需白色和彩色的可供范围、独特选型信息、实际买家问题和商业信号，才能重评独立页门槛。
- **Owner／销售／运营：**`/rfq` 实际由谁接收、如何跟进型号匹配／试样／报价；文件申请机制、可交付范围、授权联系方式和失败时的备用联系路径。确认这些事实不等于预先批准具体文案或表单实现。
- **站点负责人：**可靠旧 URL／站点导出、sitemap、GSC、分析及入链数据、现有重定向表，以逐 URL 核对保留、合并、跳转或退役。缺此资料不妨碍审查候选架构，但**迁移分析目前不完整**。
- **Owner／销售／本地化负责人：**如主张阿语、越语或国家独立结构，提供当地买家语言、差异文件或服务条件、真实询盘和持续翻译维护能力；缺这些输入时维持统一英文候选。

能改变本建议的证据包括：真实高价值订单与复购显示渠道方才是主技术买家；当前主售型号及买家选择原因与七份 TDS 的暗示不同；包装薄膜或其他应用有独立而充分的 GE 型号／试验依据；阿联酋、沙特或越南买家需要不同语言、文件或服务；旧站某些详情页有不可忽略的入链与合格询盘。这些由 Owner／销售记录、技术资料、站点清单及搜索／询盘数据分别解决，而不是由竞争站页面单独决定。[W3_STRATEGY_DRAFT](W3_STRATEGY_DRAFT.md)、[W2_RESEARCH](W2_RESEARCH.md)

**执行与边界。**原 W4 运行了项目的 `.codex/agents/w4_site_architecture/agent.md` 角色并使用 `keyword-research-and-clustering` Skill。本次只对原草案作定点修正，复用既有证据，没有重跑关键词研究；现有材料足以把通用黑色母粒商业查询主要归给产品族页，故未调用 `search-intent-evidence-analysis`。未修改 Agent、Skill、SITE_MAP、SEO_MAP、CONTENT_MODEL；未运行 W5、Gate，未写完整页面文案、修改 WordPress 或发布。

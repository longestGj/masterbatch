# W4 网站与信息架构首选提案 — DRAFT / 待 Owner 批准

**范围与权威。**本文件是供业主审查的候选架构，不批准任何页面、URL、导航、SEO 归属、语言版本或迁移操作。2026-09-23 的已批准战略以 [SITE_BRIEF](SITE_BRIEF.md)「W3 strategy decisions approved by the owner」为准；[W3_STRATEGY_DRAFT](W3_STRATEGY_DRAFT.md)只解释依据和改判条件。[INPUT_REVIEW](INPUT_REVIEW.md)是当前 W1 事实边界；[W2_RESEARCH](W2_RESEARCH.md)仍为 DRAFT 研究输入。执行时项目 HEAD 为 `7b65c7f`，W3 决定所在版本 `a78d783`，W2 研究版本 `60963d6`。本次没有修改 [SITE_MAP](SITE_MAP.csv)、[SEO_MAP](SEO_MAP.csv) 或 [CONTENT_MODEL](CONTENT_MODEL.md)。

## 1. 先确定实体、主题、任务、行动和证据责任

网站的公开主体始终是 **GE Chemical & Polymer Group Co., Ltd.**。它是一个帮助买家核验供方、初筛产品并进入合格商务对话的对外营销网站。黑色母粒是核心；优先服务色母粒制造商的技术与采购判断，贸易商／经销商是重要的第二路径，直接制品厂仍可使用同一产品与询盘路径。阿联酋和沙特并列当前核心市场，越南是重要增长市场。白色母粒准确呈现，彩色和除湿母粒作为受控增长方向。以上排序来自 SITE_BRIEF，不能由旧关键词量改变。

| 责任 | 规范答案位置（均为候选） | 范围与关系 |
|---|---|---|
| 主体身份：GE 是谁 | `/about`；首页摘要并链接到此 | 只使用 GE 对外名称。来源材料中的其他实体及其关系未确认，不进入公开身份叙述。 |
| 制造、质量与供应可信度 | `/manufacturing-quality`；相关产品页链接到此 | 滨州工厂、12 条黑色母粒产线、年产能超过 5 万吨、实验室是业主接受的公司工作性陈述，不能变成单个型号产能、交付保证或批次表现。[SITE_BRIEF](SITE_BRIEF.md)、[INPUT_REVIEW](INPUT_REVIEW.md) |
| 实际供给范围与产品优先级 | `/products` | 黑色领衔；白色准确呈现；彩色、除湿说明现可讨论的范围。黑色超过出口量 80% 是业主陈述，不是每个型号现售证明。 |
| 黑色母粒共同选型问题 | `/products/black-masterbatch` | 回答产品族层面的用途信息、需要核对的树脂／工艺／目标和型号区别；不按单一配比推断性能排序。 |
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

本轮 W4 实际使用项目 [keyword-research-and-clustering Skill](../.agents/skills/keyword-research-and-clustering/SKILL.md)。旧 [关键词机会图](inputs/Cmp_Info/MASTERBATCH_KEYWORD_OPPORTUNITY_MAP.md) 主要来自美国、印度，并把填充、白色、彩色列为 P0；它可提供术语线索，不能给已批准的黑色及阿联酋、沙特、越南方向排页面优先级。W2 已研究买家与替代方案，但没有查询级地图；因此本轮只补足可能改变架构的广泛查询归组，不以搜索量推断商机。本轮没有 GE 询盘原话、搜索控制台、目标市场排名或可靠流量指标。

| 查询族与代表表达 | 买家任务、候选规范答案 | 合并与薄页判断 |
|---|---|---|
| `black masterbatch manufacturer`、`black masterbatch supplier` 及国家修饰 | 核验主体、制造能力与黑色产品：首页负责入口，`/about` 负责实体，`/manufacturing-quality` 负责能力，黑色产品族负责产品 | 同义词、manufacturer/supplier 与国家词不各生一页；不能暗示当地库存或服务。 |
| `black masterbatch`、载体、指标、grade comparison、BK/PT 型号与 TDS | 黑色产品族回答共同选择条件；已确认有独立判断价值的型号页回答本型号事实 | 不让首页、产品族、多个型号页争同一个泛词答案；文件只对应实际型号。 |
| film、PE/PP、pipe、recycled resin、dispersion、加工问题 | 先由产品族处理共通问题；经证实有独立买家任务、可用型号关系和充分答案时再给应用独立页面 | 不生成「国家 × 用途 × 树脂 × 问题」矩阵；竞品有该内容不证明 GE 的适配。 |
| TDS、SDS、RoHS、FDA、COA、sample、MOQ、quote | `/documents` 负责可提供的文件与范围；`/rfq` 负责项目信息与商务行动；型号页负责型号证据 | 不为每个文件或短 FAQ 自动建独立页，不把样品报告写成系列认证。 |
| 阿联酋、沙特、越南的供方表达，以及阿语、越语术语 | 现阶段由统一的产品、公司、能力和联系路径回答 | 市场和语言词存在不等于 GE 有本地化内容、差异供货条件或维护能力。 |

外部公开样本仅证明这些信息任务在可见供应页面出现，例如[阿联酋分销商黑色母粒型号与索 TDS 页面](https://www.tawazon.com/industries/plastics-raw-material/masterbatch/black-masterbatch/)、[沙特企业阿语站](https://www.astra-polymers.com/ar/)及[越南企业黑色母粒页](https://europlas.com.vn/san-pham/color-masterbatch/black-masterbatch)。它们不证明 GE 买家需求比例、可赢订单或本地化回报。具体观察与假设的边界仍须保持：英文代表词和项目已有术语是查询候选；阿语、越语页面可见是语言供给观察；GE 客户会使用这些词以及搜索会带来高价值询盘仍是假设。研究停止在能够划清规范答案责任之处。未出现会改变归属的单个歧义查询，所以没有调用 `search-intent-evidence-analysis`。

**限定查询抽样记录（2026-09-23）：**检索未设置搜索引擎国家定位；查询中的国名是检索词，不是当地买家实际用语。阿联酋英语输入 `black masterbatch supplier UAE manufacturer distributor grades TDS` 和 `black masterbatch supplier UAE TDS MOQ film`；[Tawazon](https://www.tawazon.com/industries/plastics-raw-material/masterbatch/black-masterbatch/) 的型号及索 TDS 信息仅来自搜索结果摘要，原页本轮打开失败，W2 亦记录此限制。沙特英语输入 `black masterbatch supplier Saudi Arabia manufacturer data sheet`、`black masterbatch supplier Saudi Arabia factory distributor`；[NAI](https://plastic.nai.com.sa/masterbatches/) 是 W2 已列的当地供方参照。沙特／阿联酋阿语输入 `مورد ماسترباتش اسود السعودية تصنيع`、`مورد ماستر باتش أسود الإمارات العربية المتحدة`；实际打开的 [Astra 阿语站](https://www.astra-polymers.com/ar/)展示产品族和查找入口。越南英语输入 `black masterbatch supplier Vietnam manufacturer black masterbatch`；[CPI](https://cpiplastic.com/en/product/black-masterbatch/) 本轮原页打开失败，只使用搜索摘要与 W2 已记录的受限观察。越语输入 `hạt nhựa màu đen nhà cung cấp Việt Nam`、`hạt nhựa màu đen masterbatch TDS màng thổi Việt Nam`；实际打开的 [EuroPlas 页面](https://europlas.com.vn/san-pham/color-masterbatch/black-masterbatch)可见黑色母粒、应用、技术资料与联系入口。跨市场另输入 `black masterbatch grade selection PE PP film dispersion supplier technical datasheet`、`black masterbatch vs carbon black powder for masterbatch manufacturers`、`black masterbatch UAE Saudi Vietnam distributor technical data sheet`；可见[黑色母粒概念解释页](https://www.zhongfuhai.com/blog/what-is-carbon-black-masterbatch)，但样本无法判断各任务的比例。上述观察没有支持新增国家页、语言分站或应用页。

**仅是假设，尚非 GE 买家查询观察：**制造商寻找第二供应源、经销商替下游索 TDS、海湾客户需要当地库存、越南新客偏好越语，以及旧站每个应用都需要独立页面。这些须由 GE 销售、询盘、技术关系或搜索数据验证。

## 4. 首选页面系统、导航和内部链接

以下是**候选责任与路径，不是已批准的页面清单或规范 URL**。新路径在旧站盘点和 Owner 审定前均不得写入 SITE_MAP 或 SEO_MAP。

| 候选页面／URL | 独立职责和纳入条件 |
|---|---|
| `/` | 让首次访问者知道 GE、黑色核心和进入产品／能力／联系的路径；承接宽泛供方入口。 |
| `/products` | 当前产品范围和层级，黑色首位，白色准确呈现，彩色与除湿按受控增长权重出现。 |
| `/products/black-masterbatch` | 黑色产品族的规范答案、选择问题、已确认型号之间的可解释差异。 |
| 现有 `/products/bk020`、`bk025`、`bk030`、`bk035`、`bk040`、`pt-300` | 候选保留路径。逐一核对现售、资料、独立选择价值和旧 URL 表现；型号相近或内容不足时，不能机械复制页面。 |
| `/products/pt-450p` | 新增候选，须先核实当前供给、独立型号身份与和其他黑色型号的差异；绝不能用文件名 PT-400。 |
| `/products/white-masterbatch`、`/products/color-masterbatch` | 新候选产品族责任；白色如实说明已证实供给，彩色以可讨论范围和需求沟通为界。没有足够资料时不虚构型号。 |
| `/products/desiccant-defoaming-masterbatch`、`/products/dm2476g` | 旧审计所列现有候选路径。产品族与 DM2476G 型号分别负责共通说明与型号事实；先确认当前供给和可区别的信息。 |
| `/about`、`/manufacturing-quality`、`/documents` | 分别负责主体、能力与文件范围；互链但不重复大段泛化证明。 |
| `/rfq`、`/contact` | 主要商务对话与一般联系；按真实处理能力设计动作和失败后的替代路径。 |
| `/applications` 及详情 | 条件性次级内容。优先检查包装薄膜是否有独立答案及型号关系；其余逐页核对，不能仅因旧站已有八个应用页就延续。 |
| `/faq` 及详情 | 先把真实答案归回产品、文件、能力与询盘责任页；仅对独立、完整的买家问题保留详情页。 |

**导航候选：**Products（黑色母粒显著）／Manufacturing & Quality／Documents／About／Contact，持续可见的商务入口指向 `/rfq`。应用内容可从产品族、型号和相关内容链接进入；只有独立答案和已证实关系充分时才考虑占用主导航。产品族 ↔ 型号、型号 → 其真实相关的应用与文件范围、所有评估页 → 能力证明和商务下一步，构成内部链接的主链。导航选择高频路径，不等于站点全部库存。

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

## 6. 语义模型含义、待 Owner 决定和改判证据

架构需要区分产品族、型号、型号 TDS、提交样品报告、公司能力、应用／工艺和市场陈述；事实关系、解释性文案和选型／导航规则不能当成同一权威。W4 只定义其含义与责任，不决定 WordPress Page、Post、CPT、字段、模板或标记。[CONTENT_MODEL](CONTENT_MODEL.md) 保持 Core 起点，待架构获批后再处理具体建模。

**请 Owner 审定的架构取舍：**

1. 是否采用「黑色产品族与经确认的型号为主干；白色准确呈现；彩色、除湿受控增长；应用内容有证据才独立」的页面系统，以及上述导航主线。
2. 七个黑色 TDS 型号和 DM2476G 哪些当前可供应、值得独立展示；尤其 PT-450P 是否设公开型号入口。由 Owner／销售／技术提供现售、差异和典型需求事实。
3. `/rfq`、一般联系、文件申请的实际接收与后续处理方式，使主要行动有准确的承诺和失败后的返回路径。由 Owner／销售／站点运营确认。
4. 是否存在已知且可持续维护的阿联酋、沙特或越南独立内容／语言需求或不同交付条件；如有，提供具体买家、询盘或运营证据以重评统一英文结构。
5. 提供可靠旧 URL 与使用数据，决定每一条旧路径的保留、合并、跳转或退役。缺此资料不妨碍审查候选架构，但**迁移分析目前不完整**。

能改变本建议的证据包括：真实高价值订单与复购显示渠道方才是主技术买家；当前主售型号及买家选择原因与七份 TDS 的暗示不同；包装薄膜或其他应用有独立而充分的 GE 型号／试验依据；阿联酋、沙特或越南买家需要不同语言、文件或服务；旧站某些详情页有不可忽略的入链与合格询盘。这些由 Owner／销售记录、技术资料、站点清单及搜索／询盘数据分别解决，而不是由竞争站页面单独决定。[W3_STRATEGY_DRAFT](W3_STRATEGY_DRAFT.md)、[W2_RESEARCH](W2_RESEARCH.md)

**执行与边界。**本轮实际运行项目的 `.codex/agents/w4_site_architecture/agent.md` 角色；使用 `keyword-research-and-clustering` Skill，未使用 `search-intent-evidence-analysis`。本文件由主任务整理代理建议而成。未运行 W5、Gate，未写完整页面文案、修改 WordPress 或发布。

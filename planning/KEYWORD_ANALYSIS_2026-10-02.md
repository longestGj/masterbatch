# 现有 112 词清单分析：业务与页面决策

状态：规划分析，2026-10-02。数据源是私有研究池 `D:/29Github_SEO_GEO/codex-seo/.private/codex-seo-workflows/gemasterbatch-20261002T1540-keywords/KEYWORD_INVENTORY.csv`，没有新增关键词或重新请求 Semrush。目标市场是阿联酋、沙特和越南；表中搜索量为各国家数据库的桌面端月均估算。业务排序以 `SITE_BRIEF.md` 为准。

**后续逐词分析已完成：**`D:/29Github_SEO_GEO/codex-seo/.private/codex-seo-workflows/gemasterbatch-20261002T155817-seo-plan/KEYWORD-PAGE-DECISIONS.csv` 保留全部 112 个原始词及市场数据，增加推断意图、业务匹配、证据状态、主要页面、支持页、当前优先级与决定理由。原始词库没有被改写。最新决定优先于原始表中的旧标签：填充 14 词全部暂缓；黑白组合词归目录，配混词归用途，HS code、RoHS 资格及深黑性能词分别保留贸易／合规／型号依据要求。现有包装薄膜 URL 优先评估改写，再生料与通用挤出不预先认定是同一页面。

**最新完整页面扩展：**本轮将 28 页骨架补充为 43 个候选；92 个现有词分配到候选页，14 个填充词和 6 个未证实功能词暂缓。最新页面与词双向对应表在 `D:/29Github_SEO_GEO/codex-seo/.private/codex-seo-workflows/gemasterbatch-20261002T161152-page-keyword-plan/`。新增 `page_plan_*` 字段是最新提案，前版归属保留作追溯；92 个已分配表达不等于全部可立即投放，管材、性能、合规与独立指南仍按各自来源核实。

## 1. 这 112 个词实际提供了什么

| 主题组 | 词数 | 至少一个目标市场有数值的词数 | 对网站的实际作用 |
|---|---:|---:|---|
| 通用供方 `core_supplier` | 11 | 6 | 首页、产品目录、公司证明 |
| 黑色供给 `black_supply` | 15 | 2 | 黑色产品族主搜索责任 |
| 型号选择 `grade_selection` | 13 | 0 | 产品族比较和真实型号页的选型内容 |
| 采购行动 `purchase` | 10 | 0 | 产品页的商务说明与 RFQ |
| 用途 `application` | 12 | 0 | 吹膜、注塑、挤出等用途页面候选 |
| 文件 `documents` | 11 | 1 | 文件范围和型号资料 |
| 教育 `education` | 8 | 2 | 主页面解释；有独立问题才另开内容页 |
| 白／彩／除湿 `other_products` | 12 | 3 | 产品目录和后续产品族 |
| 填充研究 `filler_research` | 14 | 11 | 业主暂缓，保留研究数据，不阻塞建站 |
| 待证产品 `hold_products` | 6 | 1 | 不建立供给页面 |
| **合计** | **112** | **26** | 候选词池，不是 112 个页面 |

`not_returned` 不是 0；`not_checked` 不是 0。优先级不按搜索量从高到低机械排列：例如填充词有较多返回值，但业主已决定暂缓；黑色型号与询盘词虽缺目标市场数值，却直接对应主业务的买家任务。表中原有填充 `P1_offer_confirmed` 标签反映旧研究时点，**不再代表当前开发优先级**。

## 2. 先做哪些关键词族

| 业务顺序 | 关键词族及代表词 | 搜索证据 | 买家意图 | 一个主答案页及支持页 | 决定 |
|---|---|---|---|---|---|
| 1 | 黑色供给：`black masterbatch`、`black masterbatch supplier`、`black masterbatch manufacturer` | `black masterbatch` 阿联酋／沙特／越南各 20；其他近义词在三地大多未返回或未检查 | 寻找、比较供应商和产品范围 | `/products/black-masterbatch` 主答；首页、制造、关于页支撑 | 首批核心商业页；近义词共用页面 |
| 2 | 型号与选型：`black masterbatch grades`、`carbon black content`、`carrier resin`、`dispersion` | 13 词没有目标市场数值 | 核对能否满足下游加工条件 | 黑色产品族给选择框架；现售且有差异的 BK/PT 型号页给型号事实 | 内容优先；不为每个指标单独建页 |
| 3 | 采购行动：`black masterbatch price`、`quote`、`sample`、`MOQ`、`bulk black masterbatch` | 10 词没有目标市场数值 | 获取商业条件、试样与报价 | 黑色产品族／型号页解释需提交的信息；`/rfq` 接收需求 | 首批必须打通询盘；未知政策不写死 |
| 4 | 通用制造商：`masterbatch`、`masterbatch manufacturer`、`plastic masterbatch` | `masterbatch`：阿联酋 110、沙特 40、越南 390；`masterbatch manufacturer` 三地各 20 | 核验 GE 整体供给及公司可信度 | 首页、`/products`、`/about`、`/manufacturing-quality` 各答不同问题 | 首批；不另造重复的泛制造商页 |
| 5 | 技术文件：`black masterbatch TDS`、`SDS`、`COA`、`RoHS` | 除越南 `black masterbatch hs code` 20 外，组内无目标市场数值 | 获取型号相关文件 | `/documents` 主答，型号页保留对应关系 | 首批支持商业转化；文件范围按实际材料写 |
| 6 | 用途：film／blown film、injection molding、extrusion／recycling、packaging／bags、HDPE pipe | 12 词均无三地数值；其中 2 个是美国库术语发现，其余为任务假设 | 判断下游工艺和制品是否适配 | 见下节 | 依据买家问题与 GE 型号证据分批制作 |

## 3. 用途词怎么落实到页面

| 合并后的用途词组 | 主要买家问题 | 页面候选 | 当前判断 |
|---|---|---|---|
| film／blown film：3 词 | 哪些加工信息需要提供、怎样初筛黑色母粒 | 黑色母粒吹膜用途页 | 优先评估。旧包装薄膜页可作为迁移线索；具体适用型号从 TDS 和技术确认取得 |
| injection molding：2 词 | 树脂与注塑条件怎样影响型号选择 | 黑色母粒注塑用途页 | 优先评估。PP 分支需单独型号依据，不自动产生 PP 页 |
| extrusion／recycling／recycled PE：3 词 | 挤出与再造粒是否为同一需求，着色和除湿如何区分 | 挤出／再造粒页或黑色产品族中的独立段落 | 第二批。先核实实际买家问题，再决定一页还是拆页 |
| packaging／garbage bags：2 词 | 包装袋和一般吹膜是否需要不同选型答案 | 吹膜页的一部分，或独立袋材页 | 有足够不同的工艺、制品与 GE 产品证据才独立 |
| pipe／HDPE pipe：2 词 | 是否有符合特定管材要求的型号与测试依据 | 暂不制作独立管材页 | 先补型号、标准及性能依据；不能从通用 TDS 推断管材级 |

这 12 词只构成 4–5 个潜在用途答案，不等于 12 页。每个用途页应回答该工艺独有的选型条件，并引导到真实型号、文件和 RFQ；产品族页保留通用供应商搜索责任。`PROPOSED_PAGE_INVENTORY.md` 第 C 节列出候选页面和旧 URL 关系。

## 4. 尚不能从这张词表判断的事

- 哪个用途页在阿联酋、沙特或越南搜索量最大：12 个用途词在三地都没有数值。
- 近义词是否应合并到同一页面：目前按买家任务和内容范围初分，尚未做目标市场 SERP 重合验证。
- 哪些词能带来询盘或订单：没有旧站有效 GSC、GA4 和成交归因数据。
- 单词难度、趋势和流量潜力：现有 CSV 没有可靠的 KD、SERP 或趋势列；不能用稀疏返回值推断“容易排名”。

现阶段仍可做出页面决策：以黑色母粒供给、型号和询盘为主干；吹膜与注塑先进入具体页面方案；填充、管材以及未经证实的功能产品暂缓。后续只对**会改变页面取舍**的少数关键词补查目标市场 SERP／Semrush 数据，不把扩词本身当作建站进度。

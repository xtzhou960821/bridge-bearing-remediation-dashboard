import React from "react";

import {
  DataComponent,
  DataTable,
  EvidenceChart,
  ExecutiveSummary,
  Filters,
  MetricCard,
  RichNarrative,
  SectionHeader,
  useDataApp,
  useDashboardTabs,
} from "../../data-app-public.jsx";
import "./example.css";

const tabs = [
  { id: "overview", label: "总体概览", filterIds: ["year", "bridge", "family", "priority"] },
  { id: "treatment", label: "整治清单", filterIds: ["year", "bridge", "family", "priority"] },
  { id: "comparison", label: "跨年度对比", filterIds: ["bridge"] },
  { id: "evidence", label: "报告证据", filterIds: ["year", "bridge"] },
];

const familySpec = {
  type: "horizontalBar", x: "family", y: "reportedCount",
  showValues: true, showLegend: false, showXAxisLabel: true,
  xLabel: "病害类别", yLabel: "报告统计次数",
  colors: { reportedCount: "var(--bearing-blue)" },
};

const bridgeSpec = {
  type: "horizontalBar", x: "bridgeGroup", y: "reportedCount",
  showValues: true, showLegend: false, showXAxisLabel: true,
  xLabel: "桥梁/项目段", yLabel: "报告统计次数",
  colors: { reportedCount: "var(--bearing-teal)" },
};

const prioritySpec = {
  type: "bar", x: "priority", y: "reportedCount",
  showValues: true, showLegend: false, showYAxisLabel: true,
  yLabel: "报告统计次数",
  colors: { reportedCount: "var(--bearing-slate)" },
};

const comparisonSpec = {
  type: "horizontalBar", x: "metric", y: "previous",
  fields: ["previous", "current"], showValues: true, showLegend: true,
  showXAxisLabel: true, xLabel: "对比指标", yLabel: "数量（个）",
  colors: { previous: "var(--bearing-muted)", current: "var(--bearing-blue)" },
};

function sum(rows, field = "count") {
  return rows.reduce((total, row) => total + (Number(row[field]) || 0), 0);
}

function uniqueCount(rows, field) {
  return new Set(rows.map((row) => row[field]).filter(Boolean)).size;
}

function groupSum(rows, keyField, valueField = "count") {
  const grouped = new Map();
  for (const row of rows) {
    const key = row[keyField] ?? "未分类";
    grouped.set(key, (grouped.get(key) ?? 0) + (Number(row[valueField]) || 0));
  }
  return [...grouped.entries()]
    .map(([key, reportedCount]) => ({ [keyField]: key, reportedCount }))
    .sort((left, right) => right.reportedCount - left.reportedCount);
}

function formatCount(value) {
  return new Intl.NumberFormat("zh-CN").format(Number(value) || 0);
}

function PriorityBadge({ value }) {
  return <span className="bearing-priority" data-priority={value}>{value}</span>;
}

function Overview({ defects }) {
  const familyRows = groupSum(defects, "family");
  const priorityRows = groupSum(defects, "priority").sort((a, b) => a.priority.localeCompare(b.priority));
  const bridgeRows = groupSum(defects, "bridgeGroup").slice(0, 12);
  const p1Rows = defects.filter((row) => row.priority === "P1");
  const observationCount = sum(defects);

  return <>
    <ExecutiveSummary title="阅读提示" preview="统计口径、优先级与工程边界" defaultOpen>
      <RichNarrative id="overview-scope" value="**本页统计的是报告中出现的病害数量条目。** 同一支座可能同时存在脱空、变形和锈蚀，也可能在不同年度重复出现，因此总数不能直接解释为唯一实体支座数。" />
      <RichNarrative id="overview-priority" value="**P1/P2/P3 是为整治清单编制而统一生成的前期排程优先级。** 它不替代原检测报告的技术结论、结构安全等级，也不构成施工图设计或最终处置决定。" />
      <RichNarrative id="overview-use" value="**建议先用 P1 锁定专项复核对象，再按桥梁、病害类型回看原报告。** 现场复核、数量去重、交通组织和设计验算完成后，方可形成正式工程量清单。" />
    </ExecutiveSummary>

    <section className="bearing-metric-grid" aria-label="关键指标">
      <MetricCard id="metric-observations" queryId="defects" title="病害报告统计次数"
        value={formatCount(observationCount)} description="当前筛选范围内的报告病害条目数量"
        sourceRows={defects} displayRows={[{ reportedCount: observationCount }]} />
      <MetricCard id="metric-p1" queryId="defects" title="P1 优先复核"
        value={formatCount(sum(p1Rows))} description="失去支承、完全脱空、明显错位等前期排程对象"
        sourceRows={p1Rows} displayRows={[{ reportedCount: sum(p1Rows) }]} />
      <MetricCard id="metric-bridges" queryId="defects" title="涉及桥梁/项目段"
        value={formatCount(uniqueCount(defects, "bridgeGroup"))} description="当前筛选后仍有病害记录的桥梁或项目段"
        sourceRows={defects} displayRows={[{ bridgeGroups: uniqueCount(defects, "bridgeGroup") }]} />
      <MetricCard id="metric-reports" queryId="defects" title="涉及检测报告"
        value={formatCount(uniqueCount(defects, "reportId"))} description="当前筛选后提供病害数量证据的报告数"
        sourceRows={defects} displayRows={[{ reports: uniqueCount(defects, "reportId") }]} />
    </section>

    <section className="bearing-chart-grid">
      <EvidenceChart id="family-distribution" queryId="defects" title="病害类型构成"
        description="按统一病害族归类；数值为报告统计次数。"
        spec={familySpec} rows={familyRows} sourceRows={defects} displayRows={familyRows} height={360} />
      <EvidenceChart id="priority-distribution" queryId="defects" title="前期整治优先级"
        description="用于清单排程，不等同于安全等级。"
        spec={prioritySpec} rows={priorityRows} sourceRows={defects} displayRows={priorityRows} height={360} />
      <EvidenceChart id="bridge-burden" queryId="defects" title="病害统计次数较多的桥梁/项目段"
        description="展示当前筛选范围前 12 项；复合病害可能重复计数。"
        spec={bridgeSpec} rows={bridgeRows} sourceRows={defects} displayRows={bridgeRows} height={480}
        className="bearing-wide" />
    </section>
  </>;
}

function Treatment({ rows }) {
  const p1Rows = rows.filter((row) => row.priority === "P1");
  const p2Rows = rows.filter((row) => row.priority === "P2");
  const p3Rows = rows.filter((row) => row.priority === "P3");
  const columns = [
    { key: "priority", label: "优先级", renderCell: (value) => <PriorityBadge value={value} /> },
    { key: "bridgeGroup", label: "桥梁/项目段" },
    { key: "year", label: "年份" },
    { key: "section", label: "部位/区段" },
    { key: "family", label: "病害族" },
    { key: "rawType", label: "报告原始病害" },
    { key: "count", label: "报告数量", renderCell: (value, row) => value == null ? "待现场核量" : `${formatCount(value)} ${row.unit ?? ""}` },
    { key: "recommendedAction", label: "建议整治动作" },
    { key: "actionBasis", label: "动作依据" },
  ];

  return <>
    <div className="bearing-callout" role="note">
      <span className="bearing-callout-kicker">使用边界</span>
      <strong>这是基于报告病害描述编制的前期整治清单。</strong>
      <span>正式实施前需逐点定位、去重、现场复核，并结合顶升条件、交通组织、设计验算与施工图确认工程量。</span>
    </div>

    <section className="bearing-metric-grid bearing-metric-grid--three" aria-label="整治工作量概览">
      <MetricCard id="treatment-p1" queryId="treatment_queue" title="P1 · 专项复核优先"
        value={formatCount(sum(p1Rows))} description={`${p1Rows.length} 条清单记录`}
        sourceRows={p1Rows} displayRows={[{ reportedCount: sum(p1Rows), items: p1Rows.length }]} />
      <MetricCard id="treatment-p2" queryId="treatment_queue" title="P2 · 计划整治"
        value={formatCount(sum(p2Rows))} description={`${p2Rows.length} 条清单记录`}
        sourceRows={p2Rows} displayRows={[{ reportedCount: sum(p2Rows), items: p2Rows.length }]} />
      <MetricCard id="treatment-p3" queryId="treatment_queue" title="P3 · 测量监测"
        value={formatCount(sum(p3Rows))} description={`${p3Rows.length} 条清单记录`}
        sourceRows={p3Rows} displayRows={[{ reportedCount: sum(p3Rows), items: p3Rows.length }]} />
    </section>

    <DataComponent id="treatment-list" queryId="treatment_queue" kind="table" variant="card"
      title="支座病害整治清单" description="可按桥梁、年份、病害类型和优先级筛选；搜索支持报告原始病害与处置动作。"
      sourceRows={rows} displayRows={rows}>
      <DataTable rows={rows} columns={columns} rowKey="defectId" caption="支座病害前期整治清单" />
    </DataComponent>
  </>;
}

function Comparison({ rows }) {
  const countRows = rows.filter((row) => row.unit === "个");
  const shuangguiScore = rows.find((row) => row.metric === "主桥Dr评分");
  const columns = [
    { key: "bridgeGroup", label: "桥梁" },
    { key: "metric", label: "对比指标" },
    { key: "previousYear", label: "基准年", renderCell: (value) => String(value) },
    { key: "previous", label: "基准值" },
    { key: "currentYear", label: "对比年", renderCell: (value) => String(value) },
    { key: "current", label: "对比值" },
    { key: "change", label: "变化" },
    { key: "unit", label: "单位" },
    { key: "comparability", label: "可比性", presentation: "status" },
    { key: "finding", label: "复核结论" },
  ];

  return <>
    <div className="bearing-callout bearing-callout--comparison" role="note">
      <span className="bearing-callout-kicker">对比口径</span>
      <strong>只纳入可在两年报告中定位到同一桥梁、同类病害的指标。</strong>
      <span>“未再列出”不能自动解释为已整治；凡报告口径或部位描述变化，均应回到原报告与现场记录核实。</span>
    </div>

    {shuangguiScore && <section className="bearing-score-strip" aria-label="双桂高架桥评分变化">
      <div><span>双桂高架桥主桥 Dr</span><strong>{shuangguiScore.previous.toFixed(2)} → {shuangguiScore.current.toFixed(2)}</strong></div>
      <div><span>变化</span><strong>{shuangguiScore.change.toFixed(2)} 分</strong></div>
      <div><span>评定</span><strong>仍为 2 类</strong></div>
    </section>}

    <EvidenceChart id="year-comparison-chart" queryId="comparisons" title="病害数量跨年度变化"
      description="仅绘制单位为“个”的可比指标；灰色为基准年，蓝色为对比年。"
      spec={comparisonSpec} rows={countRows} sourceRows={rows} displayRows={countRows} height={520} />

    <DataComponent id="year-comparison-table" queryId="comparisons" kind="table" variant="card"
      title="跨年度对比明细" description="保留评分、状态和数量等不同单位，避免在同一数轴上误导比较。"
      sourceRows={rows} displayRows={rows}>
      <DataTable rows={rows} columns={columns} rowKey={(row) => `${row.bridgeGroup}-${row.metric}`}
        caption="桥梁支座病害跨年度对比明细" searchable={false} />
    </DataComponent>
  </>;
}

function Evidence({ reports }) {
  const columns = [
    { key: "reportId", label: "编号" }, { key: "year", label: "年份" },
    { key: "bridge", label: "桥梁/报告范围" }, { key: "grade", label: "报告评定" },
    { key: "quantifiedDefectRecords", label: "病害统计次数", renderCell: formatCount },
    { key: "p1Records", label: "P1 统计次数", renderCell: formatCount },
    { key: "coverageNote", label: "纳入范围" }, { key: "sourceFile", label: "源文件" },
  ];
  const quantified = reports.filter((row) => row.hasQuantifiedBearingSummary);

  return <>
    <section className="bearing-evidence-intro">
      <div><span>资料覆盖</span><strong>{reports.length} 份报告</strong><p>{quantified.length} 份形成了可量化支座病害摘要；其余报告不应被解释为“无病害”。</p></div>
      <div><span>证据链</span><strong>源文件 → 摘要条目 → 标准化清单</strong><p>站点仅保留相对文件名和人工复核后的条目，不公开本机绝对路径。</p></div>
      <div><span>质量边界</span><strong>待现场去重与核量</strong><p>复合病害、锈蚀及跨年度记录可能对应同一实体支座。</p></div>
    </section>

    <DataComponent id="report-register" queryId="reports" kind="table" variant="card"
      title="检测报告证据登记" description="报告评定文字按源文件保留；统计次数为本次整理范围内的病害数量合计。"
      sourceRows={reports} displayRows={reports}>
      <DataTable rows={reports} columns={columns} rowKey="reportId" caption="检测报告证据登记表" />
    </DataComponent>
  </>;
}

export function DashboardContent() {
  const { activeTabId } = useDashboardTabs(tabs);
  const { snapshot, appTitle, setAppTitle, queries, filters, setFilter, reviewedRows } = useDataApp();

  React.useEffect(() => {
    if (appTitle !== snapshot.title) setAppTitle(snapshot.title);
  }, [appTitle, setAppTitle, snapshot.title]);

  const tab = tabs.some(({ id }) => id === activeTabId) ? activeTabId : "overview";
  const defects = reviewedRows("defects", ["year", "bridgeGroup", "family", "priority", "section"]);
  const treatments = reviewedRows("treatment_queue", ["year", "bridgeGroup", "family", "priority", "section"]);
  const comparisons = reviewedRows("comparisons", ["bridgeGroup", "metric"]);
  const reports = reviewedRows("reports", ["year", "bridgeGroup"]);

  return <article className="bearing-page">
    <div className="bearing-ambient" aria-hidden="true">
      <span className="bearing-orb bearing-orb--one" />
      <span className="bearing-orb bearing-orb--two" />
    </div>
    <header className="bearing-hero">
      <SectionHeader id="bearing-dashboard-title" as="h1" title="桥梁支座病害与整治分析" />
      <p className="bearing-deck">基于 2021—2024 年检测报告的人工复核汇总，串联病害分布、前期整治排程和跨年度变化。</p>
    </header>
    <Filters sticky filters={snapshot.filters ?? []} queries={queries} values={filters} onChange={setFilter} />
    {tab === "overview" && <Overview defects={defects} />}
    {tab === "treatment" && <Treatment rows={treatments} />}
    {tab === "comparison" && <Comparison rows={comparisons} />}
    {tab === "evidence" && <Evidence reports={reports} />}
  </article>;
}

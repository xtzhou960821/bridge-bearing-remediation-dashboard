# 银白冰蓝毛玻璃 UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在保持现有数据、筛选、图表、表格和四页签结构不变的前提下，将桥梁支座分析站点升级为银白冰蓝、类苹果毛玻璃视觉，并重新发布到原 Sites 地址。

**Architecture:** 继续使用现有 React Data App 和原生 CSS，不引入依赖。`DashboardContent.jsx` 只增加语义化英雄区与纯装饰背景节点，视觉规则集中在 `example.css`；静态契约测试锁定玻璃层、响应式、焦点与减少动画后备，现有 Data App 构建和浏览器验收验证功能未回归。

**Tech Stack:** React 19、Data App 公共组件、原生 CSS、Node.js `node:test`、Sites 发布工具链

**Spec:** `docs/superpowers/specs/2026-11-10-silver-blue-glass-ui-design.md`

## Global Constraints

- 21 份报告、270 条病害/整治记录及所有统计结果保持不变。
- P1/P2/P3 定义、工程边界说明和跨年度比较口径保持不变。
- 四个页签、筛选器、图表、表格、来源查看与站点私有权限保持不变。
- 不引入外部字体、图片或新依赖。
- 使用苹果系统字体栈、银白冰蓝主色与克制的 P1/P2 风险语义色。
- 支持 `backdrop-filter` 后备背景和 `prefers-reduced-motion`。
- 正式 Sites 地址和项目 ID 保持不变。

## Review Focus

- 浏览器不支持 `backdrop-filter` 时，卡片仍应使用高不透明度浅色背景且文字清晰；由 Task 2 静态测试和浏览器视觉检查覆盖。
- 390px 窄屏时，背景装饰、筛选器和数据卡不得造成页面级横向溢出；由 Task 3 响应式检查覆盖。
- 深色系统偏好或 Data App 主题覆盖时，冰蓝主题变量仍应保持足够对比度；由 Task 2 浏览器主题检查覆盖。
- 键盘操作筛选器、页签和卡片菜单时必须有可见焦点环；由 Task 2 静态测试与键盘检查覆盖。
- 用户设置减少动画时，不应出现卡片位移、背景漂浮或长过渡；由 Task 2 静态测试覆盖。

---

### Task 1: 英雄区与背景氛围结构

**Files:**
- Modify: `src/content/dashboard/DashboardContent.jsx`
- Modify: `src/content/dashboard/example.css`
- Create: `tests/glass-theme.test.mjs`

**Interfaces:**
- Consumes: 现有 `SectionHeader`、`.bearing-page` 与四页签渲染逻辑。
- Produces: `.bearing-ambient`、`.bearing-orb--one`、`.bearing-orb--two`、`.bearing-hero` 及相应无障碍装饰结构。

- [ ] **Step 1: 编写失败的静态结构测试**

在 `tests/glass-theme.test.mjs` 使用 `node:test` 读取 JSX 与 CSS，断言 JSX 包含 `bearing-ambient`、`aria-hidden="true"`、`bearing-hero`，CSS 包含三组非均匀 `radial-gradient`、固定背景层和苹果系统字体栈。

- [ ] **Step 2: 运行测试并确认失败**

Run: `npm test -- --test-name-pattern="glass hero"`

Expected: FAIL，缺少英雄区或背景氛围选择器。

- [ ] **Step 3: 实现英雄区和银白冰蓝背景**

在 `DashboardContent.jsx` 中将主标题与副标题包入 `<header className="bearing-hero">`，在 `.bearing-page` 首部加入 `aria-hidden="true"` 的 `.bearing-ambient` 与两个光斑节点；不得改变标题 ID、筛选器位置或页签逻辑。扩展 `example.css` 的页面级变量、背景、纹理、光斑和标题排版。

- [ ] **Step 4: 运行结构测试并确认通过**

Run: `npm test -- --test-name-pattern="glass hero"`

Expected: PASS。

- [ ] **Step 5: 提交英雄区改造**

```bash
git add src/content/dashboard/DashboardContent.jsx src/content/dashboard/example.css tests/glass-theme.test.mjs
git commit -m "feat: add silver blue glass dashboard backdrop"
```

### Task 2: 玻璃表面、配色和交互状态

**Files:**
- Modify: `src/content/dashboard/example.css`
- Modify: `src/content/dashboard/DashboardContent.jsx`
- Modify: `tests/glass-theme.test.mjs`

**Interfaces:**
- Consumes: Task 1 的页面变量、英雄区和装饰层选择器。
- Produces: 指标卡、图表、筛选器、提示框、评分条、证据块、表格的统一玻璃视觉与交互后备。

- [ ] **Step 1: 扩展失败的视觉契约测试**

断言 CSS 包含 `backdrop-filter`、`-webkit-backdrop-filter`、高不透明度后备背景、复合边框/内阴影、冰蓝焦点环、`prefers-reduced-motion`、悬停与按下状态；断言 JSX 图表颜色只使用冰蓝、青蓝、蓝灰与风险语义色。

- [ ] **Step 2: 运行测试并确认失败**

Run: `npm test -- --test-name-pattern="glass surfaces"`

Expected: FAIL，缺少玻璃表面或无障碍交互规则。

- [ ] **Step 3: 实现玻璃视觉系统**

在 `example.css` 中为 `.dashboard-component`、`.filters`、`.data-executive-summary`、`.bearing-callout`、`.bearing-score-strip`、`.bearing-evidence-intro` 和表格容器设置分级透明度、模糊、折射边框与蓝灰阴影；为按钮、筛选器、页签和表格行添加 180–260ms 的悬停、按下及焦点反馈。保留 P1 珊瑚红、P2 琥珀色。

- [ ] **Step 4: 统一图表色彩**

在 `DashboardContent.jsx` 中将 `--bearing-blue`、`--bearing-teal`、`--bearing-orange` 的消费映射调整为冰蓝、青蓝与蓝灰体系；风险标签不随图表配色改变。

- [ ] **Step 5: 添加不支持模糊和减少动画后备**

在 `example.css` 添加 `@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px)))` 与 `@media (prefers-reduced-motion: reduce)`，前者提升表面不透明度，后者关闭位移、漂浮和过渡。

- [ ] **Step 6: 运行视觉契约测试并确认通过**

Run: `npm test -- --test-name-pattern="glass surfaces"`

Expected: PASS。

- [ ] **Step 7: 提交玻璃组件改造**

```bash
git add src/content/dashboard/DashboardContent.jsx src/content/dashboard/example.css tests/glass-theme.test.mjs
git commit -m "feat: polish dashboard glass surfaces and interactions"
```

### Task 3: 构建与响应式浏览器验收

**Files:**
- Modify only if defects are found: `src/content/dashboard/example.css`
- Modify only if defects are found: `src/content/dashboard/DashboardContent.jsx`

**Interfaces:**
- Consumes: Task 1–2 的最终页面结构和视觉规则。
- Produces: 通过构建、功能与宽窄屏视觉验收的最终本地 Data App。

- [ ] **Step 1: 运行全部静态测试**

Run: `npm test`

Expected: 全部 PASS。

- [ ] **Step 2: 构建最终 Data App**

Run: `node <data-plugin-root>/scripts/data-app.mjs build --project-dir <project> --separate-data`

Expected: `Data app authored content verified.`，构建状态为 `complete`。

- [ ] **Step 3: 在本地回环 HTTP 打开站点**

启动 `dist` 静态服务并在 Codex 内置浏览器打开总体概览；确认 5,018、182、17、20 等关键指标未变化，四页签均可进入。

- [ ] **Step 4: 验收桌面端**

设置 1440×1000 视口，检查主标题、背景光晕、四张指标卡、两张图表卡和宽图表的玻璃层次；断言 `document.documentElement.scrollWidth === window.innerWidth`，控制台无 error/warn。

- [ ] **Step 5: 验收窄屏与交互**

设置 390×844 视口，确认单列布局无页面级横向溢出；切换整治清单、跨年度对比和报告证据，操作年度筛选器并验证指标随筛选变化；用键盘 Tab 验证焦点环可见。

- [ ] **Step 6: 如发现缺陷，最小修复并重复 Steps 1–5**

只允许修改本任务列出的两个文件；每次修复后重新运行测试、构建和对应视口验收。

- [ ] **Step 7: 提交验收修复**

```bash
git add src/content/dashboard/DashboardContent.jsx src/content/dashboard/example.css
git commit -m "fix: refine responsive glass dashboard layout"
```

若无修复则不创建空提交。

### Task 4: 重新封装并发布到原 Sites 项目

**Files:**
- Generated outside source commit: `dist/`, `.data-app-assets/`, `.data-app-offline/`
- Create fresh publication checkout: `../bridge-bearing-dashboard-publication-source-v2/`

**Interfaces:**
- Consumes: Task 3 验收通过的 `separate-data-v1` 构建与原项目 ID `appgprj_6af176519c3c8191a872024b5f22cbbf`。
- Produces: 原 URL 上的新私有版本、完整数据资产上传回执和可恢复发布源。

- [ ] **Step 1: 复核站点身份、私有访问和所有者环境变量**

调用 Sites `get_site` 与环境变量读取，要求当前用户为 owner、恰好一位 owner、无意外外部访客，并验证 `DATA_APP_OWNER_EMAIL_SHA256` 保持匹配。

- [ ] **Step 2: 生成一次性部署令牌并执行最终封装**

使用非 shell 参数数组调用 `package-data-app-for-sites.mjs`；只传部署令牌 SHA-256 和 12 小时内到期时间，不把任何凭据写入源码、命令行或日志。此后不得重建或修改客户端。

- [ ] **Step 3: 创建并提交新的发布源**

使用 `createPublicationSource` 从作者工程生成全新发布检出目录，绑定当前作者 Git HEAD、同一项目 ID 和正式 URL；提交到现有 Sites 源仓库分支，保留远端祖先，不强推。

- [ ] **Step 4: 保存并部署私有版本**

从已封装的发布源构建包含 `.openai/hosting.json` 与 `dist/server/index.js` 的归档，调用 `save_version_and_deploy_private`，轮询至 `succeeded`。

- [ ] **Step 5: 上传并回读完整资产**

通过 `upload-data-app-assets.mjs` 的 stdin JSON 传入临时授权与部署令牌，上传 HTML 和 snapshot；要求 HTML 与 snapshot 的 SHA-256、字节数、6 个查询及 582 行数据全部匹配。

- [ ] **Step 6: 线上验收和访问策略复核**

重新打开 `https://bridge-bearing-remediation.xtzhou.chatgpt.site` 的总体概览视图，验证新视觉、关键指标和四页签；再次确认站点仍为私有、1 位所有者、无其他用户和外部访客。

- [ ] **Step 7: 记录最终交付**

报告正式 URL、本地工程路径、版本与验收结论；明确发布内容为 2026-11-09 生成的数据快照，毛玻璃改版未改变数据口径。

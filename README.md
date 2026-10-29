<div align="center">

# 📘 LEDGER

### Minimalist, Local-First Personal Finance & Cloud-Synchronized Ledger
### 极简·本地优先·云端实时同步个人财务记账系统

**A high-performance, distraction-free expense tracker built for Web & Android.**  
*Instant offline entry • End-to-end user isolation with Supabase RLS • Tactile native haptics • Daily timeline journaling • Visual analytics & budget monitoring.*

[![GitHub Release](https://img.shields.io/github/v/release/LEESC88/ledger?style=for-the-badge&color=0D9488&label=Latest%20Release)](https://github.com/LEESC88/ledger/releases/latest)
[![CI Build Status](https://img.shields.io/github/actions/workflow/status/LEESC88/ledger/ci.yml?branch=master&style=for-the-badge&label=Build%20%26%20APK)](https://github.com/LEESC88/ledger/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-3B82F6?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Platform: Android & Web](https://img.shields.io/badge/Platform-Android%20%7C%20Web%20%7C%20PWA-10B981?style=for-the-badge)](https://github.com/LEESC88/ledger/releases)

<br/>

[📱 **Download Latest APK (安卓安装包直接下载)**](https://github.com/LEESC88/ledger/releases/latest/download/LEDGER.apk) • [📦 **All Releases (历史版本)**](https://github.com/LEESC88/ledger/releases) • [🇬🇧 **English Docs**](#-english-documentation) • [🇨🇳 **中文文档**](#-中文文档-chinese-documentation)

</div>

---

## 📱 Standalone Android APK Download / 安卓 APK 直接下载

Install and run **LEDGER** directly on your Android phone without needing to host or deploy any backend server:

* 🚀 **[Download Latest Android APK (`LEDGER.apk`)](https://github.com/LEESC88/ledger/releases/latest/download/LEDGER.apk)**
* 📦 **[View Release Notes & Historical Versions](https://github.com/LEESC88/ledger/releases)**
* 🔄 **In-App Auto Update**: Check and install new versions on the fly directly inside **Settings ➔ Application Version ➔ Check & Update**.

---

<div id="english-documentation"></div>

## 🇬🇧 English Documentation

### ✨ Overview

**LEDGER** cuts through the noise of bloated commercial bookkeeping apps filled with credit promotions, social feeds, and intrusive trackers. It returns personal finance to its core: **speed, clarity, autonomy, and tactile joy**.

Built on a **Local-First + Direct Supabase Cloud (PostgreSQL)** architecture, LEDGER functions with 100% autonomy:
* **Offline / In-Flight**: Sub-millisecond instant record entry into an optimistic queue with `⚡ Draft` indicator.
* **Online**: Background two-way synchronization with Supabase PostgreSQL protected by Row-Level Security (RLS).
* **Native Feel**: Web Haptics mechanical vibrations, fluid bottom sheet drag physics, and smooth 150ms cross-fades.

---

### 🏗️ System Architecture

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        LEDGER CLIENT RUNTIME                           │
│                                                                        │
│   [Android Native APK (Capacitor 6)]       [Web & PWA Browser Engine]  │
│                                                                        │
│   • UI / Interaction: Modern Vanilla JS (ES2022) • Container Queries   │
│   • Motion & Touch: Web Haptic API • Physics Bottom Sheet Drag Handle  │
│   • Visuals: Chart.js 4 (High-Contrast Category Donut & Daily Trend)   │
│   • Offline Resilience: LocalStorage Event Queue • Optimistic Engine   │
│   • Localization: Modular Bilingual Engine (public/i18n.js)            │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │ (HTTPS / OAuth 2.0 / REST)
                                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        CLOUD & BACKEND PLATFORM                        │
│                                                                        │
│   [Supabase Cloud Platform (Primary)]        [NestJS API Server (Opt)] │
│   • Google OAuth 2.0 Native Deep-Link        • RFC 4180 CSV Exporter   │
│   • PostgreSQL with Row-Level Security       • Data Pruning & Archives │
│   • Real-Time Cloud User Profile Metadata    • In-App Release Registry │
└────────────────────────────────────────────────────────────────────────┘
```

---

### 🌟 Key Features

#### 1. 📅 Daily Timeline Grouping
* **Sticky Date Headers**: Groups all transactions by day with a sticky calendar header displaying formatted date (e.g. `10月27日 周二` / `Tue, Oct 27`), `Today` / `Yesterday` badges, and daily income/expense summaries.
* **Instant Filtering & Search**: Instant filter by `All`, `Expense`, or `Income`, filter by payment channel, or perform instant text searches across notes and categories.

#### 2. 💳 Multi-Account & Asset Wallets (Accounts & Wallets)
* **Real-time Balance Tracking**: Supports four foundational payment channels:
  * 💵 **Cash**
  * 📱 **eWallet (Electronic Wallet)**
  * 🏦 **Bank Card**
  * 💳 **Credit Card**
* **Initial Capital & Net Worth**: Configure starting balances for each account and track your live consolidated **Net Worth**.

#### 3. 📊 Visual Analytics & Spending Trend
* **Monthly Budget Tracker**: Real-time spending progress bar with dynamic color alerts (`< 80% Normal` ➔ `80-100% Warning` ➔ `> 100% Deficit`).
* **High-Contrast Category Donut Chart**: Every category possesses a distinct, non-overlapping signature color (Dining Orange, Transport Sky Blue, Shopping Pink, Housing Gold, Entertainment Purple, Healthcare Red Coral, Subscriptions Cyan, Other Slate).
* **Daily Spending Trend Line / Area Chart**: Interactive trajectory showing daily expenses from day 1 to 31, highlighting the month's spending peak day.

#### 4. 🔥 Daily Recording Streak & Motivation Badges
* **Flame Pill (`🔥 7d`)**: Top bar streak counter tracking consecutive days of recording.
* **Badges Wall**: 5-tier unlockable milestone badges (`🌱 First Step`, `🥉 3-Day Spark`, `🥈 Week Hero`, `🥇 Habit Master`, `👑 Century Legend`).

#### 5. 📳 Tactile Haptic Micro-Interactions & Gestures
* **Web Haptics Feedback**: Crisp 10ms mechanical vibration on record save, tab switch, and transaction deletion.
* **Native Bottom Sheet**: Transaction modal features a physical drag handle with smooth pull-down swipe-to-dismiss gesture.
* **Tactile Button Press**: Global `:active` scale physics (`0.96`) and smooth 150ms page cross-fade transitions.

#### 6. 🎯 Sinking Funds & 👥 Split Bill Claims
* **Sinking Funds (专款专用)**: Set dedicated savings targets (e.g., Annual Travel, Car Maintenance, Tech Devices) with dual budgeting modes (`Budget Deduct` vs `Extra Target Fund`). Automatically track spent progress against reserved allocations and release remaining balances back to the active month's budget upon completion.
* **Split Bill Claims (代垫与报销)**: Itemize multi-person shared expenses and group activities with granular per-friend debt tracking, individual payment status toggling, and one-tap total settlements.
* **Triple-Layer Cloud Persistence**: Synchronized across Supabase PostgreSQL tables (`projects`, `claims`), Supabase Auth user metadata (`user_metadata`), and NestJS SQLite backend with tombstone-aware conflict resolution to prevent accidental overwrites or data loss upon refresh.

#### 7. 🛡️ Enterprise Security, Data Retention & CSV Export
* **Native Google OAuth 2.0**: Zero-port deep-link scheme (`com.leesc88.ledger://oauth`) with isolated account data.
* **Row-Level Security (RLS)**: Data isolation enforced at the PostgreSQL database level.
* **Flexible CSV Export & Native Android Sheet**: Export transactions for the current year or historical thresholds (1, 2, 3, or 5 years) directly via the native Android Share/Save sheet into your phone's File Manager.
* **Storage Protection**: Built-in 50,000 record capacity limit per user with visual warning badges to prevent cloud database exhaustion.

---

### 🛠️ Tech Stack & Specifications

| Dimension | Technologies |
| :--- | :--- |
| **Mobile Runtime** | Capacitor 6 Android, PWA Service Worker, Web App Manifest |
| **Frontend Architecture** | Modern Vanilla JavaScript (ES2022), CSS Variables, Container Queries |
| **Data Visualization** | Chart.js 4 (Doughnut breakdown + Line/Area Daily Trend) |
| **Cloud & Database** | Supabase (PostgreSQL 15+, Row-Level Security, Auth, Storage) |
| **Optional Backend** | NestJS (TypeScript), TypeORM, PostgreSQL (`pg`) / SQLite (`better-sqlite3`) |
| **CI / CD Pipeline** | GitHub Actions (Automated Gradle Build, Key Signing, GitHub Releases) |

---

### 🚀 Quick Start (Local Development)

#### Prerequisites
* **Node.js** >= 18.0.0
* **npm** >= 9.0.0
* *(Optional for Android build)* **Android Studio** & JDK 17+

#### 1. Clone & Install
```bash
git clone https://github.com/LEESC88/ledger.git
cd ledger
npm install
```

#### 2. Environment Configuration
Create a `.env` file in the root directory:
```env
PORT=3000
DATABASE_URL="postgresql://<user>:<password>@<host>:6543/postgres"
SUPABASE_URL="https://<your-project>.supabase.co"
SUPABASE_ANON_KEY="<your-anon-key>"
```

#### 3. Build & Run Local Server
```bash
# Compile NestJS server and verify frontend assets
npm run build

# Start production server
npm run start:prod
```
Access the application at `http://localhost:3000`.

#### 4. Build Android APK Locally (Optional)
```bash
# Sync web assets to Capacitor Android project
npx cap sync android

# Open project in Android Studio or build via Gradle
cd android
./gradlew assembleRelease
```

---

<div id="中文文档"></div>

## 🇨🇳 中文文档 (Chinese Documentation)

### 📖 目录
1. [项目愿景与设计哲学](#-1-项目愿景与设计哲学)
2. [系统技术架构与核心分层](#-2-系统技术架构与核心分层)
3. [核心功能与业务模块详解](#-3-核心功能与业务模块详解)
4. [数据库表结构与安全策略设计](#-4-数据库表结构与安全策略设计)
5. [交互设计与微动效体系](#-5-交互设计与微动效体系)
6. [本地快速上手与环境配置](#-6-本地快速上手与环境配置)
7. [常见问题解答 (FAQ)](#-7-常见问题解答-faq)

---

### 💡 1. 项目愿景与设计哲学

商业记账软件普遍存在严重痛点：**臃肿、开屏广告、贷款理财推销、记账需要多层点击、断网无法使用、用户数据被滥用挖掘**。

**LEDGER** 诞生于对个人财务记账本质的回归与纯粹追求：

* **⚡ 本地优先（Local-First）**：
  将数据控制权彻底还给用户。断网、弱网、飞行模式下记账零等待，毫秒级本地存盘并即时刷新统计；网络恢复后，后台事件队列静默且安全地完成云端双向增量同步。
* **🪶 零运行时冗余（Zero Framework Bloat）**：
  客户端采用纯粹的原生现代 JavaScript（ES2022）、现代 CSS 容器查询（Container Queries）与原生 Web 动画，拒绝庞大的虚拟 DOM 库。整体打包体积仅 3.8 MB，冷启动只需 200~300ms，在老旧机型上依然丝滑流畅。
* **🔒 银行级数据隔离（Privacy by Default）**：
  基于 Google OAuth 2.0 认证和 PostgreSQL 行级安全（Row-Level Security, RLS），在数据库物理底层实现跨租户隔离，任何人（包括匿名接口）无权访问他人财务隐私。
* **📱 顶级原生交互质感（Native Ergonomics）**：
  借助原生微震动（Web Haptics）、抽屉物理跟手拖拽（Bottom Sheet）、按键机械回弹和时间轴吸顶头，让网页核心的应用脱离平庸，媲美顶尖原生 App 的手感。

---

### 🏛️ 2. 系统技术架构与核心分层

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        LEDGER 终端应用层 (Client)                      │
│                                                                        │
│   [Android 原生独立 APK]              [桌面 / 移动端 PWA 浏览器应用]   │
│   • 运行基座: Capacitor 6 原生 WebView   • 离线拦截: Service Worker 缓存│
│   • 原生通信: Deep Link 授权回调唤醒     • 安装标准: Web App Manifest  │
│                                                                        │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │ 业务核心引擎 (public/app.js) & 模块化字典 (public/i18n.js)      │   │
│   │                                                                │   │
│   │  • 时间轴分组渲染器: groupRecordsByDate(records)               │   │
│   │  • 每日开销走势引擎: calculateDailySpendingTrend(...)           │   │
│   │  • 坚持激励打卡体系: calculateStreak(...) & evaluateBadges()  │   │
│   │  • 触感交互反馈总线: triggerHaptic(10ms) & 下拉阻尼手势        │   │
│   │  • 离线乐观更新队列: LocalStorage Event Queue & 自动重试机制   │   │
│   │  • 视觉可视化核心: Chart.js 4 (环形分布图 + 每日开销渐变图)    │   │
│   └────────────────────────────────────────────────────────────────┘   │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │ (HTTPS / OAuth 2.0 / REST)
                                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│                       云端服务与数据库层 (Cloud Backend)               │
│                                                                        │
│   [Supabase Cloud Platform (首选直连)]   [NestJS 企业级后端 (可选服务端)]│
│   • Google OAuth 2.0 用户鉴权            • RFC 4180 CSV 格式化导出     │
│   • PostgreSQL 15+ 关系型核心数据库      • 历史账单阈值清理与归档接口  │
│   • 行级安全策略 (RLS) 强制权限过滤      • In-App 自建版本控制与分发   │
│   • 用户个性化 Profile 元数据同步        • TypeORM 实体模型与数据校验  │
└────────────────────────────────────────────────────────────────────────┘
```

#### 技术选型亮点对比：

| 维度 | 传统混合记账 App | LEDGER 架构优势 |
| :--- | :--- | :--- |
| **前端框架** | React / Vue / Angular (打包体积 15MB+) | **Modern Vanilla JS** (打包体积仅 3.8MB，零虚拟 DOM 开销) |
| **网络模式** | Cloud-First (无网络时报红甚至无法进入) | **Local-First** (离线秒记，后台自动重试增量同步) |
| **手感体验** | 生硬网页点击，无物理反馈 | **Web Haptic API + 阻尼下压 + 拖拽手柄关闭** |
| **视觉体系** | 复杂低对比度报表，分类色彩单一混淆 | **8 种高对比度专属色彩心理学配色 + 粘性时间轴** |
| **数据安全** | 中心化明文或简单鉴权，存在数据泄露风险 | **PostgreSQL RLS 物理级行权限隔离** |

---

### 🧩 3. 核心功能与业务模块详解

#### 1. 按天时间轴分组账单（Daily Timeline Grouping）
* **视觉层级**：彻底摒弃无止境平铺的陈旧长列表，以天为单位构建消费时间轴。
* **粘性吸顶头（Sticky Date Header）**：
  * 显示清晰的日期与星期（例如 `10月27日 周二` 或 `Tue, Oct 27`）；
  * 自动标记 `今天 (Today)`、`昨天 (Yesterday)` 专属高亮胶囊；
  * 右侧实时汇总当天支出总额（`-RM 45.00`）与收入总额（`+RM 100.00`），每日财务健康一目了然。
* **卡片自适应容器**：在移动端屏幕（宽度 `< 600px`）通过 CSS 容器查询自动将传统表格平滑折叠为极简触控卡片。

#### 2. 多资产账户与资金池管理（Accounts & Wallets）
* **四维主流支付渠道**：
  * 💵 **现金 (Cash)**：日常零钱收支；
  * 📱 **电子钱包 (eWallet)**：覆盖各大扫码与在线移动支付；
  * 🏦 **银行卡 (Bank Card)**：储蓄卡流水与工资入账；
  * 💳 **信用卡 (Credit Card)**：信贷消费与账期管理。
* **初始资金与动态净资产**：
  * 支持为每个账户分别设定**初始资金（Initial Balance）**；
  * 结合历史所有收入与支出流水，实时动态推算各账户结余及**全盘总净资产（Net Worth）**。
  * 内置完全向后兼容逻辑，老账单历史数据平滑映射，绝不丢数据。

#### 3. 智能图表与当月开销走势分析（Analytics & Daily Trend）
* **月度总预算监控条（Monthly Budget Tracker）**：
  * 支持随时调整当月预算限额（如 RM 3,000）；
  * 动态进度条具有智能三段式警示变色：`< 80%` 健康常态、`80%~100%` 橙黄预警、`> 100%` 红色超支提示。
* **高对比度分类环形占比图（Donut Chart）**：
  * 告别同色系扎堆，为餐饮美食（暖橙 `#F97316`）、交通出行（蔚蓝 `#0EA5E9`）、购物消费（粉红 `#EC4899`）、居家水电（金黄 `#EAB308`）、休闲娱乐（靓紫 `#8B5CF6`）、医疗健康（红 `#EF4444`）、会员订阅（青蓝 `#06B6D4`）、其他杂项（板岩灰 `#64748B`）定义独立色彩。
* **每日开销走势面积图（Daily Spending Trend）**：
  * 横轴呈现当月 1 号至月末每天，纵轴直观反映支出金额起伏；
  * 自动定位并徽章标记当月消费**最高峰值日（Peak Day）**，周末狂欢或大额消费一清二楚。

#### 4. 连续记账打卡与成就徽章墙（Streak & Motivation Badges）
* **火焰打卡胶囊（Streak Counter）**：首页右上角显眼展示当前连续记账天数（如 `🔥 7d`），算法兼顾今天与昨天打卡锚点，断签自动判定。
* **5 阶成就徽章里程碑**：
  * 🌱 **初出茅庐 (First Step)**：完成第 1 笔记录；
  * 🥉 **三日星火 (3-Day Spark)**：连续记账满 3 天；
  * 🥈 **周常英雄 (Week Hero)**：连续记账满 7 天；
  * 🥇 **习惯大师 (Habit Master)**：连续记账满 30 天；
  * 👑 **百日传奇 (Century Legend)**：连续记账满 100 天。

#### 5. 原生下抽屉（Bottom Sheet）与记账弹窗
* 弹窗顶部设有深色/浅色自适应微型**拖拽手柄条（Drag Handle）**；
* 支持单手下滑超过 80px 触发阻尼跟手顺滑关闭；
* 内置金额快捷递增药丸（`+10`、`+20`、`+50`、`+100`、`Reset`）与九宫格大图标分类选择器。

#### 6. 专款储备（Sinking Funds）与 AA 制代垫报销（Split Bill Claims）
* **专项储备金（专款专用）**：
  * 支持为特定目标建立独立储蓄资金池（如汽车保养、年度旅游、数码设备采购）；
  * 双归集模式：**从当月预算扣除（Budget Deduct）** 或 **额外专款储备（Extra Target Fund）**；
  * 记账时可直接勾选关联专款，实时扣减储备进度；专款结项时支持一键将剩余款项**回滚释放至当月预算**。
* **AA 制代垫与报销管理**：
  * 多人聚餐、活动采购分账明细，精确记录每位好友应付金额及本人分摊；
  * 支持逐个好友标记「已结清」或一键「全额结清归档」。
* **三重云端持久化保障**：
  * **PostgreSQL 云端业务表**（`projects`、`claims` 表）实时读写；
  * **Supabase Auth 元数据自动备份**（`user_metadata` 跨设备即时同步）；
  * **NestJS SQLite 本地/服务端双向同步**，搭载墓碑防误删合并（Tombstone-aware Merge）与缺失自动回填，刷新零丢失。

#### 7. 历史归档、本年数据与 RFC 4180 CSV 导出
* **全周期与本年度导出**：支持即时导出**「📅 本年度账单」**及 1年、2年、3年、5年前的历史账单；
* **原生安卓文件管理器直存**：在手机端一键唤起系统分享与保存面板，可自由选择保存到本地任意目录；
* **容量防爆保护**：内置单用户 50,000 条记录容量限额与预警防护，有效防止云端数据库过载。

#### 8. 模块化多语言与外观主题
* **独立字典文件（[public/i18n.js](public/i18n.js)）**：116 个中英文键值按 10 个业务模块严谨归类，支持中文与英文一秒无刷新热切换；
* **三模外观**：纯净高对比浅色（Light）、深邃蓝黑防眩晕深色（Dark）与跟随系统（System）。

---

### 🗄️ 4. 数据库表结构与安全策略设计

本项目采用 PostgreSQL 关系型结构构建，在 Supabase Cloud 上启用 **Row-Level Security (RLS)** 强制行安全隔离。

#### 核心数据表设计：

```sql
-- 1. 账单流水表 (records)
CREATE TABLE public.records (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type VARCHAR(10) NOT NULL CHECK (type IN ('expense', 'income')),
    amount NUMERIC(10, 2) NOT NULL CHECK (amount > 0),
    category VARCHAR(50) NOT NULL,
    account_name VARCHAR(50) DEFAULT 'Cash',
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    note TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 资产账户余额表 (accounts)
CREATE TABLE public.accounts (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,
    initial_balance NUMERIC(10, 2) DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, name)
);

-- 3. 月度预算限额表 (budgets)
CREATE TABLE public.budgets (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    month VARCHAR(7) NOT NULL, -- 格式 'YYYY-MM'
    limit_amount NUMERIC(10, 2) NOT NULL CHECK (limit_amount >= 0),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, month)
);
```

#### RLS 行级安全规则（以 records 表为例）：
```sql
ALTER TABLE public.records ENABLE ROW LEVEL SECURITY;

-- 仅允许用户读写属于自己的账单
CREATE POLICY "Users can only access their own records"
ON public.records
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
```
> **安全保证**：任何客户端发起的数据库查询，PostgreSQL 都会首先核对当前 JWT 中的 `auth.uid()` 是否与数据行的 `user_id` 匹配。因此即使匿名公钥（`anonKey`）公开在前端，第三方也**绝不可能越权跨库查询其他用户的账单**。

---

### 🎛️ 5. 交互设计与微动效体系

为了提供媲美 iOS/Android 原生应用的精致感，LEDGER 建立了成套的物理触感与视觉反馈体系：

1. **机械触感震动（Web Haptics）**：
   - 采用标准 W3C Vibration API，封装为安全优雅的 `triggerHaptic(duration)`；
   - 切换底部导航（10ms）、点击保存记账（15ms）、滑动关闭弹窗（10ms）、删除账单（12ms）、切换收支筛选（8ms），均提供清脆、微弱但扎实的微机械触觉反馈。
2. **全局物理阻尼按压反馈（`:active` 缩放）**：
   - 针对所有操作按钮、导航 Tab、分类药丸和快捷金额胶囊应用了物理阻尼按压：
     ```css
     button:active:not(:disabled),
     .tab-btn:active,
     .segment-btn:active,
     .category-chip:active,
     .bottom-nav-item:active {
       transform: scale(0.96);
       transition: transform 60ms cubic-bezier(0.2, 0, 0, 1);
     }
     ```
   - 手指按下时有明显的弹性收缩，抬起时顺畅回弹。
3. **平滑淡入转场（Cross-fade Transitions）**：
   - 页面间切换并非僵硬的瞬间替换，而是加入 150ms 优雅透明度淡入淡出动效。

---

### 💻 6. 本地快速上手与环境配置

#### 环境前置准备：
- [Node.js](https://nodejs.org/) (推荐 LTS 18.x 或 20.x, 22.x)
- [Git](https://git-scm.com/)
- *(如需本地打包 APK)* 安装 [Android Studio](https://developer.android.com/studio) 及 JDK 17+

#### 步骤 1：克隆代码仓库
```bash
git clone https://github.com/LEESC88/ledger.git
cd ledger
npm install
```

#### 步骤 2：配置环境变量 (`.env`)
在项目根目录下创建或编辑 `.env` 文件：
```env
# 服务端端口 (默认为 3000)
PORT=3000

# PostgreSQL 数据库直连连接串 (来自 Supabase 数据库设置)
DATABASE_URL="postgresql://postgres.<project-ref>:<db-password>@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres"

# Supabase 项目 API 凭证 (来自 Supabase Project Settings -> API)
SUPABASE_URL="https://<your-project>.supabase.co"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

#### 步骤 3：启动本地全栈服务
```bash
# 编译 NestJS 后端与校验前端资源
npm run build

# 启动服务端 (生产模式)
npm run start:prod

# 或启动开发监听模式 (热重载)
npm run start:dev
```
在浏览器中打开 `http://localhost:3000` 即可开始使用。

#### 步骤 4：本地打包 Android APK（Capacitor 原生同步）
```bash
# 将 public/ 下所有最新 Web 前端资产同步至 Android 工程
npx cap sync android

# 方式 A：直接使用 Gradle 命令行编译生成 APK
cd android
./gradlew assembleRelease

# 方式 B：使用 Android Studio 打开工程并视窗化调试
npx cap open android
```
编译产物位于 `android/app/build/outputs/apk/release/app-release.apk`。

---

### ❓ 7. 常见问题解答 (FAQ)

#### Q1：我可以直接把导出的 APK 安装到手机上离线使用吗？
**完全可以**。LEDGER 采用 **Local-First** 架构，即使不连接任何云端网络、飞行模式下，所有记账、预算、图表和资产计算都可以在手机本地毫秒级完成。

#### Q2：如果不小心断网记账了，数据会丢失吗？
**绝不会丢失**。所有离线记录会自动保存在手机本地离线队列（标记为 `⚡`）。一旦检测到网络恢复连接，后台自动静默推送同步到 Supabase 云端。

#### Q3：换了新手机后，如何恢复以前的记账数据？
在新手机上打开 LEDGER，点击「使用 Google 账号登录」。登录成功后，云端存储的所有历史账单、资产账户与个人设置将在 1 秒内全量自动恢复同步到本机。

#### Q4：应用更新时需要去浏览器重新下载安装包吗？
**不需要**。当 GitHub 发布了新版本后，直接在手机 App 内进入【设置】页面，点击**「检查更新」**，应用内内置下载器会自动拉取新版本安装包并调起系统安装升级。

---

## 📄 开源许可证 (License)

本项目基于 **[MIT License](LICENSE)** 开源发布。  
你可以自由地使用、修改、分发与二次开发，欢迎提出 Issue 与 Pull Request！

<div align="center">

# 📘 LEDGER

### Minimalist, Local-First Personal Finance & Cloud-Synchronized Ledger

**A high-performance, distraction-free expense tracker built for Web & Android.**  
*Instant offline entry • End-to-end user isolation with Supabase RLS • Tactile native haptics • Daily timeline journaling • Visual analytics & budget monitoring.*

[![GitHub Release](https://img.shields.io/github/v/release/LEESC88/ledger?style=for-the-badge&color=0D9488&label=Latest%20Release)](https://github.com/LEESC88/ledger/releases/latest)
[![CI Build Status](https://img.shields.io/github/actions/workflow/status/LEESC88/ledger/ci.yml?branch=master&style=for-the-badge&label=Build%20%26%20APK)](https://github.com/LEESC88/ledger/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-3B82F6?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Platform: Android & Web](https://img.shields.io/badge/Platform-Android%20%7C%20Web%20%7C%20PWA-10B981?style=for-the-badge)](https://github.com/LEESC88/ledger/releases)

<br/>

[📱 **Download Latest APK**](https://github.com/LEESC88/ledger/releases/latest/download/LEDGER.apk) • [📦 **All Releases**](https://github.com/LEESC88/ledger/releases) • [🇬🇧 **English Docs**](#-overview) • [🇨🇳 **中文文档**](#-项目全景介绍-chinese)

</div>

---

## 📱 Standalone Android APK Download

Install and run **LEDGER** directly on your Android phone without needing to host or deploy any backend server:

* 🚀 **[Download Latest Android APK (`LEDGER.apk`)](https://github.com/LEESC88/ledger/releases/latest/download/LEDGER.apk)**
* 📦 **[View Release Notes & Historical Versions](https://github.com/LEESC88/ledger/releases)**
* 🔄 **In-App Auto Update**: Check and install new versions on the fly directly inside **Settings ➔ Application Version ➔ Check & Update**.

---

## ✨ Overview

**LEDGER** cuts through the noise of bloated commercial bookkeeping apps filled with credit promotions, social feeds, and intrusive trackers. It returns personal finance to its core: **speed, clarity, autonomy, and tactile joy**.

Built on a **Local-First + Direct Supabase Cloud (PostgreSQL)** architecture, LEDGER functions with 100% autonomy:
* **Offline / In-Flight**: Sub-millisecond instant record entry into an optimistic queue with `⚡ Draft` indicator.
* **Online**: Background two-way synchronization with Supabase PostgreSQL protected by Row-Level Security (RLS).
* **Native Feel**: Web Haptics mechanical vibrations, fluid bottom sheet drag physics, and smooth 150ms cross-fades.

---

## 🏗️ System Architecture

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

## 🌟 Key Features

### 1. 📅 Daily Timeline Grouping
* **Sticky Date Headers**: Groups all transactions by day with a sticky calendar header displaying formatted date (e.g. `10月27日 周二` / `Tue, Oct 27`), `Today` / `Yesterday` badges, and daily income/expense summaries.
* **Instant Filtering & Search**: Instant filter by `All`, `Expense`, or `Income`, filter by payment channel, or perform instant text searches across notes and categories.

### 2. 💳 Multi-Account & Asset Wallets (Accounts & Wallets)
* **Real-time Balance Tracking**: Supports four foundational payment channels:
  * 💵 **Cash**
  * 📱 **eWallet (Electronic Wallet)**
  * 🏦 **Bank Card**
  * 💳 **Credit Card**
* **Initial Capital & Net Worth**: Configure starting balances for each account and track your live consolidated **Net Worth**.

### 3. 📊 Visual Analytics & Spending Trend
* **Monthly Budget Tracker**: Real-time spending progress bar with dynamic color alerts (`< 80% Normal` ➔ `80-100% Warning` ➔ `> 100% Deficit`).
* **High-Contrast Category Donut Chart**: Every category possesses a distinct, non-overlapping signature color (Dining Orange, Transport Sky Blue, Shopping Pink, Housing Gold, Entertainment Purple, Healthcare Red Coral, Subscriptions Cyan, Other Slate).
* **Daily Spending Trend Line / Area Chart**: Interactive trajectory showing daily expenses from day 1 to 31, highlighting the month's spending peak day.

### 4. 🔥 Daily Recording Streak & Motivation Badges
* **Flame Pill (`🔥 7d`)**: Top bar streak counter tracking consecutive days of recording.
* **Badges Wall**: 5-tier unlockable milestone badges (`🌱 First Step`, `🥉 3-Day Spark`, `🥈 Week Hero`, `🥇 Habit Master`, `👑 Century Legend`).

### 5. 📳 Tactile Haptic Micro-Interactions & Gestures
* **Web Haptics Feedback**: Crisp 10ms mechanical vibration on record save, tab switch, and transaction deletion.
* **Native Bottom Sheet**: Transaction modal features a physical drag handle with smooth pull-down swipe-to-dismiss gesture.
* **Tactile Button Press**: Global `:active` scale physics (`0.96`) and smooth 150ms page cross-fade transitions.

### 6. 🛡️ Enterprise Security & Data Ownership
* **Native Google OAuth 2.0**: Zero-port deep-link scheme (`com.leesc88.ledger://oauth`) with isolated account data.
* **Row-Level Security (RLS)**: Data isolation enforced at the PostgreSQL database level.
* **Historical Data Retention & RFC 4180 CSV Export**: Backup records older than 1, 2, 3, or 5 years and purge obsolete history on demand.

---

## 🛠️ Tech Stack & Specifications

| Dimension | Technologies |
| :--- | :--- |
| **Mobile Runtime** | Capacitor 6 Android, PWA Service Worker, Web App Manifest |
| **Frontend Architecture** | Modern Vanilla JavaScript (ES2022), CSS Variables, Container Queries |
| **Data Visualization** | Chart.js 4 (Doughnut breakdown + Line/Area Daily Trend) |
| **Cloud & Database** | Supabase (PostgreSQL 15+, Row-Level Security, Auth, Storage) |
| **Optional Backend** | NestJS (TypeScript), TypeORM, PostgreSQL (`pg`) / SQLite (`better-sqlite3`) |
| **CI / CD Pipeline** | GitHub Actions (Automated Gradle Build, Key Signing, GitHub Releases) |

---

## 🚀 Local Development & Setup

### Prerequisites
* **Node.js** >= 18.0.0
* **npm** >= 9.0.0
* *(Optional for Android build)* **Android Studio** & JDK 17+

### 1. Clone & Install
```bash
git clone https://github.com/LEESC88/ledger.git
cd ledger
npm install
```

### 2. Environment Configuration
Create a `.env` file in the root directory:
```env
PORT=3000
DATABASE_URL="postgresql://<user>:<password>@<host>:6543/postgres"
SUPABASE_URL="https://<your-project>.supabase.co"
SUPABASE_ANON_KEY="<your-anon-key>"
```

### 3. Build & Run Local Server
```bash
# Compile NestJS server and verify frontend assets
npm run build

# Start production server
npm run start:prod
```
Access the application at `http://localhost:3000`.

### 4. Build Android APK Locally (Optional)
```bash
# Sync web assets to Capacitor Android project
npx cap sync android

# Open project in Android Studio or build via Gradle
cd android
./gradlew assembleRelease
```

---

<div id="中文文档"></div>

## 🇨🇳 项目全景介绍 (Chinese)

### 💡 核心设计理念

**LEDGER** 是一款以**极简无干扰、本地优先（Local-First）、原生级移动交互**为宗旨的现代化个人财务记账系统。

市面上的记账软件充斥着金融理财推荐、借贷广告和繁琐的多级菜单，**LEDGER** 专注于做好一件事：**用最快的速度、最舒服的质感把每一笔消费记录清楚，并提供清晰直观的财务全貌**。

---

### 🌟 核心能力矩阵

1. **按天时间轴分组（Daily Timeline Grouping）**
   - 账单列表不再是一张扁平长列表，采用**粘性吸顶日期分组头（Sticky Date Header）**，自动计算单日总支出与总收入，配有 `今天` / `昨天` 相对日期标识与日历图示。
2. **多资产账户中心（Accounts & Wallets）**
   - 涵盖四大核心支付渠道：现金、电子钱包（eWallet）、银行卡、信用卡；
   - 支持设置初始资金，实时动态统计每个账户余额与全盘**总净资产（Net Worth）**。
3. **高对比度分类图表与每日开销趋势（Analytics & Spending Trend）**
   - **8 种高对比度专属色**（餐饮橙、交通蓝、购物粉、居家金、娱乐紫、医疗红、订阅青、其他灰），彻底解决传统图表深浅绿色撞色混淆的问题；
   - **每日开销走势图**：直观展示当月 1~31 号每天的支出节奏，自动标出当月消费最高峰值日。
4. **原生触感与微动效（Haptic Micro-interactions）**
   - 保存记账、切换导航、删除流水时触发 10ms 清脆机械震动；
   - 全局按键具备 `:active` 物理下压反馈，页面切换带 150ms 丝滑淡入。
5. **原生“下抽屉”记账（Bottom Sheet）**
   - 记账弹窗顶部配备微型拖拽小横条，支持手指单手向下滑动跟手顺畅关闭。
6. **连续记账打卡与成就徽章（Streak & Motivation Badges）**
   - 首页顶部火焰胶囊（`🔥 7d`）记录坚持天数；
   - 5 级成就里程碑墙（`🌱 初出茅庐`、`🥉 三日星火`、`🥈 周常英雄`、`🥇 习惯大师`、`👑 百日传奇`）。
7. **独立模块化中英文引擎（[public/i18n.js](public/i18n.js)）**
   - 字典从业务引擎完全解耦，按 10 个业务模块清晰分类管理，支持中英文即时无刷新切换。
8. **应用内在线一键更新（In-App Auto Update）**
   - 内置更新检查器，当云端发布新版本时支持在【设置】内一键静默拉取安装。

---

## 📄 License

This project is open-sourced under the **[MIT License](LICENSE)**.
Feel free to use, modify, and distribute with attribution.

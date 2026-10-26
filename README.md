<div align="center">

# LEDGER — Personal Finance & Cloud-Synced Expense Tracker

**A high-contrast, mobile-first personal finance application with Local-First offline support and direct Supabase Cloud synchronization.**

[![Latest Release](https://img.shields.io/github/v/release/LEESC88/ledger?style=for-the-badge&color=4F46E5&label=Download%20APK)](https://github.com/LEESC88/ledger/releases/latest/download/LEDGER.apk)
[![All Releases](https://img.shields.io/badge/GitHub-Releases-1E293B?style=for-the-badge&logo=github)](https://github.com/LEESC88/ledger/releases)
[![License](https://img.shields.io/badge/License-MIT-059669?style=for-the-badge)](#license)

**[🇬🇧 English](#overview) | [🇨🇳 中文说明](#中文说明)**

</div>

---

## 📱 Download Android APK

Get the standalone Android application (`.apk`) directly from GitHub Releases—no backend server deployment required:

- 👉 **[Direct Download Latest `LEDGER.apk`](https://github.com/LEESC88/ledger/releases/latest/download/LEDGER.apk)**
- 📦 **[View All Releases & Changelogs](https://github.com/LEESC88/ledger/releases)**

---

## ✨ Overview

**LEDGER** is a modern, full-stack and mobile-ready expense tracking application designed for speed, legibility, and zero-friction daily bookkeeping.

Built on a **Local-First + Direct BaaS (Supabase PostgreSQL)** architecture, LEDGER works 100% standalone on Android and Web browsers:
- **Online**: Transactions and monthly budgets sync directly with **Supabase Cloud PostgreSQL** in milliseconds.
- **Offline**: Records are saved instantly to the local device queue (`localStorage` / SQLite) with a `⚡ Pending` badge and automatically pushed to the cloud the moment connectivity returns.

### Key Features

- **🎨 High-Contrast Light & Dark Themes (WCAG AA/AAA Compliant)**:
  - Supports **Light**, **Dark**, and **System** appearance modes with ultra-high-contrast typography (`#0F172A` on `#FFFFFF` in Light Mode; `#F8FAFC` / `#E2E8F0` on `#151F32` in Dark Mode) so numbers and labels remain razor-sharp in any lighting condition.
- **📱 Mobile-First Ergonomics**:
  - **Responsive Card Ledger**: Automatically transforms wide desktop tables into touch-friendly stacked cards on mobile viewports (`@container` queries).
  - **Quick Amount Chips**: One-tap `+10`, `+20`, `+50`, `+100`, and `Reset` buttons for rapid single-handed entry.
  - **44px+ Touch Targets**: Compliant with mobile accessibility guidelines.
- **☁️ Multi-Tenant Cloud Sync & Flexible Identity**:
  - Sign in with **Google OAuth 2.0** or configure a **Custom Sync User ID** (e.g., `my-family-ledger`) to share and sync records across phones and desktops.
- **⚡ Offline-First Draft Queue**:
  - Record expenses anywhere—even on a plane or in a subway. Offline entries update dashboard metrics immediately and auto-sync upon reconnection.
- **📊 Dynamic Monthly Budget & Category Analytics**:
  - Visual progress ring & bar with automatic color-coded threshold alerts (**Normal** -> **80% Warning** -> **100% Exceeded**) and a Doughnut chart breakdown by category.
- **🔄 Built-In One-Click Update System**:
  - Checks GitHub for new releases automatically and provides a one-click **Update Now / Check & Update** button right inside **Settings**.
- **🧹 6-Month Data Retention Controls**:
  - Optional automated or manual cleanup of records older than 6 months to keep your ledger lean.

---

## 🏗️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Mobile App** | Capacitor Android (`LEDGER.apk`), PWA Service Worker & Web App Manifest |
| **Frontend** | Vanilla ES2022+, CSS3 Container Queries, Chart.js 4, `@supabase/supabase-js` v2 |
| **Cloud Database** | Supabase PostgreSQL (Row-Level Security + Direct REST/PostgREST BaaS) |
| **Optional Local Backend** | NestJS 12, TypeORM, SQLite (`better-sqlite3`) / PostgreSQL (`pg`) |
| **CI / CD** | GitHub Actions Automated Android APK Build & Release Pipeline |

---

## 🚀 Quick Start (Local Development)

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/LEESC88/ledger.git
cd ledger
npm install
```

### 2. Initialize Database & Environment (Windows One-Click)

Double-click `init.bat` or run:

```bash
node database/init-db.mjs
```

### 3. Start the Local Server

```bash
npm run build
npm run start:prod
```

Open `http://localhost:3000` in your browser.

---

<div id="中文说明"></div>

## 🇨🇳 中文说明 (Chinese Documentation)

### 项目简介

**LEDGER** 是一款专为手机端与桌面端打造的高对比度、极速个人记账与财务管理应用。

本项目采用 **Local-First（本地优先）+ Supabase 云数据库直连（BaaS）** 架构，打包后的 Android `.apk` 安装包**无需额外部署任何后端服务器**即可独立运行：
- **联网状态**：账目与月度预算通过 `@supabase/supabase-js` 毫秒级直连同步至 **Supabase PostgreSQL** 云端数据库。
- **离线状态**：无网络时记账毫秒级存入本机离线队列（带有 `⚡ Pending` 标识），恢复网络连接后自动静默同步上云，绝不丢失任何一笔账单。

### 📲 安卓 APK 直接下载

无需配置环境，直接下载安装即可在手机上使用：

- 👉 **[点击直接下载最新版 `LEDGER.apk`](https://github.com/LEESC88/ledger/releases/latest/download/LEDGER.apk)**
- 📦 **[前往 GitHub Releases 查看所有版本](https://github.com/LEESC88/ledger/releases)**

### 核心亮点

1. **极高对比度深浅双色主题（Light / Dark / System）**
   - 全面支持**浅色（Light）**、**深色（Dark）**与**跟随系统（System）**三种模式，并针对深色模式下的所有卡片背景与字体对比度进行了彻底重构（纯白主字 `#F8FAFC` + 亮银辅字 `#CBD5E1` 搭配深邃蓝黑卡片 `#151F32`），杜绝深色模式下文字看不清的问题。
2. **原生级移动端交互体验**
   - **自适应卡片账单**：在手机屏幕上自动将传统表格转换为清爽的双栏卡片布局，拒绝横向滚动条。
   - **快捷金额胶囊**：内置 `+10`、`+20`、`+50`、`+100` 与 `Reset` 快捷按钮，单手即可快速完成记账。
3. **多端数据同步（Google 登录 & 自定义同步 ID）**
   - 支持 **Google OAuth 2.0** 一键登录，也支持在右上角个人菜单中自定义 **Sync ID（用户 ID）**，轻松在手机与电脑之间实时同步同一份账本。
4. **月度预算监控与分类图表**
   - 实时计算当月总收入、总支出、净结余与预算使用率，超过 80% 自动变黄预警，超过 100% 变红提醒，并配有直观的分类占比环形图。
5. **一键检查与更新（One-Click Update）**
   - 当有新版本发布时，顶部自动弹出更新横幅；也可随时在 **Settings（设置）-> Application Version** 中点击 **Check & Update** 一键获取最新 APK 或刷新应用缓存。

---

## 📄 License

This project is licensed under the **MIT License**.

# 📘 简易个人账本系统 (Simple Ledger) - 架构设计与项目规范 (SQLite 中文版)

> **代码与数据语言规范 (重要规则)**：
> 所有代码实现、注释、数据库建表语句、API 响应、错误信息和系统脚本，统一**以英文（English-first）为准**。后续系统开发完善后，再统一引入多语言前端国际化。

---

## 1. 项目概述与敏捷开发模型 (Agile SDLC)

* **零外部软件依赖（轻量可移植）**：选用 **SQLite 3**，数据库为一个独立的本地文件，**直接保存在当前项目根目录的 `data/ledger.db`**。不占用系统后台服务，无需安装任何外部大型数据库软件，拷贝即走，删除即净。
* **敏捷快速迭代（Agile Sprints）**：小步快跑，优先打通 **P0 (最小可行性产品 MVP)** 垂直切片（数据库 -> 业务逻辑 -> 极简页面）。

---

## 2. GitHub 经典开源项目参考

* **Actual Budget** (`actualbudget/actual`)：经典开源记账软件，核心同样采用 **SQLite 本地文件存储** 与 TypeScript 架构。
* **Firefly III** (`firefly-iii/firefly-iii`)：交易流水与分类的经典财务建模。
* **NestJS Clean Architecture**：规范的 Controller -> Service -> Repository 解耦模式。

---

## 3. 功能清单与优先级划分 (P0 核心优先)

### 3.1 [P0] 核心基础功能 (第一优先级 - MVP 必做)
* **记账基础流水管理 (CRUD)**：创建记账、月度流水查询、编辑明细、删除记录。
* **财务收支汇总看板**：实时计算当月总收入、总支出、当前结余。
* **数据库与基础设施**：
  * 本地数据库文件直接存放于 `data/ledger.db`。
  * 严格关闭 `synchronize: false`，使用 `database/schema.sql` 精确控制表结构。
  * 提供 Windows 一键初始化启动脚本 (`init.bat`)。
* **可视化交互文档**：挂载 Swagger UI (`/api-docs`)。

### 3.2 [P1] 数据分析与可视化 (第二优先级)
* **分类支出占比饼图 (Chart.js)**：直观展现本月各分类支出占比。
* **快速月份切换器**：快速切换查看过往月份历史数据。

### 3.3 [P2] 进阶实用功能 (第三优先级)
* 月度预算超支预警条、关键字备注搜索、CSV 账单导出。

---

## 4. 技术选型与表结构

* **后端**：NestJS 12 (TypeScript, ESM)
* **前端**：原生 HTML5 + CSS3 + Fetch API（静态托管在 `public/`）
* **数据库**：**SQLite 3**（文件存放在 `data/ledger.db`）
* **持久层**：TypeORM (`@nestjs/typeorm`, `sqlite3`)

### 数据表规范 (`database/schema.sql`)
```sql
CREATE TABLE IF NOT EXISTS records (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type TEXT CHECK(type IN ('income', 'expense')) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  category TEXT NOT NULL,
  date TEXT NOT NULL,
  note TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_records_date ON records(date);
CREATE INDEX IF NOT EXISTS idx_records_category ON records(category);
CREATE INDEX IF NOT EXISTS idx_records_type ON records(type);
```

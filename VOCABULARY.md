# 📖 Ledger Project - Key Vocabulary & Code Dictionary (词汇与代码全拆解词典)

> 本词典是项目开发过程中涉及的所有 **装饰器、关键字、方法、参数** 的字面直译与底层作用全记录。
> **永久保留，持续累加更新**，作为你随时查阅的学习伴侣！

---

## 目录
1. [一、 数据库与实体层 (Entity & Database)](#一-数据库与实体层-entity--database)
2. [二、 参数校验与 DTO 层 (Validation & DTO)](#二-参数校验与-dto-层-validation--dto)
3. [三、 模块与系统装配层 (Module & App Config)](#三-模块与系统装配层-module--app-config)
4. [四、 业务逻辑与仓储层 (Service & TypeORM)](#四-业务逻辑与仓储层-service--typeorm)
5. [五、 网络接口与路由层 (Controller & Routing)](#五-网络接口与路由层-controller--routing)
6. [六、 系统入口与安全大门 (Bootstrap & Security)](#六-系统入口与安全大门-bootstrap--security)

---

## 一、 数据库与实体层 (Entity & Database)

| 代码 / 单词 | 字面直译 (我: me) | 底层真正作用与意义 |
| :--- | :--- | :--- |
| **`@Entity('records')`** | 实体（records） | 告诉 TypeORM：这个 TypeScript 类和 SQLite 里的 `records` 数据表一一绑定。 |
| **`@PrimaryGeneratedColumn()`**| 主键 + 生成 + 列 | 声明该字段为主键（Primary Key），每新增一条记录，数字自增（1, 2, 3...）。 |
| **`@Column({ type: 'text' })`**| 普通数据列 | 声明数据表中的普通字段，存储字符串/枚举。 |
| **`@Column({ type: 'decimal' })`**| 高精度小数列 | 声明存储金额的字段，防止浮点数精度丢失。`precision: 10, scale: 2` 表示最多10位，保留2位小数。 |
| **`nullable: true`** | 允许为 null | 数据库约束：允许该列为空（用户可以不填备注）。 |
| **`@CreateDateColumn(...)`** | 创建日期列 | 自动记录该行数据首次插入数据库的精确时间戳。 |
| **`@UpdateDateColumn(...)`** | 更新日期列 | 每次修改这一行数据时，TypeORM 自动刷新为修改时的最新时间戳。 |
| **`enum TransactionType`** | 枚举（交易类型） | 限制取值范围：只能是 `'income'`（收入）或 `'expense'`（支出）。 |

---

## 二、 参数校验与 DTO 层 (Validation & DTO)

| 代码 / 单词 | 字面直译 (我: me) | 底层真正作用与意义 |
| :--- | :--- | :--- |
| **`DTO`** | 数据传输对象 | 前端发给后端的数据“包裹单”，负责安检与类型约束。 |
| **`@IsEnum(TransactionType)`**| 是否为指定枚举 | 校验：前端传来的值必须只能是 `'income'` 或 `'expense'`，传其他直接打回 400。 |
| **`@IsNumber()`** | 是否为数字 | 校验：金额必须是合法的数值类型，传 `"abc"` 直接拦截。 |
| **`@IsPositive()`** | 是否为正数 | 校验：金额必须大于 0，绝对禁止传入 0 或负数金额。 |
| **`@IsString()`** | 是否为字符串 | 校验：分类名、日期文本必须是字符串类型。 |
| **`@IsNotEmpty()`** | 是否非空 | 校验：分类名不能为空白字符（禁止传 `""` 或空白）。 |
| **`@IsDateString()`** | 是否为标准日期串 | 校验：前端传的必须符合 ISO 标准日期（如 `YYYY-MM-DD`）。 |
| **`@IsOptional()`** | 是否为可选参数 | 校验：标记此字段可传可不传；如果不传跳过校验，传了再校验。 |
| **`@MaxLength(255)`** | 最大字符长度 | 校验：限制备注文本最多 255 个字，防止恶意超长文本撑爆数据库。 |
| **`@ApiProperty(...)`** | API 属性元数据 | 在 Swagger 网页文档里画出一个必填输入框，并展示示例值（example）。 |
| **`@ApiPropertyOptional(...)`**| API 可选属性元数据| 在 Swagger 网页文档里画出一个选填输入框。 |

---

## 三、 模块与系统装配层 (Module & App Config)

| 代码 / 单词 | 字面直译 (我: me) | 底层真正作用与意义 |
| :--- | :--- | :--- |
| **`@Module({ ... })`** | 模块容器 | NestJS 组织代码的积木单元，把相关的 Controller、Service、Entity 打包在一起。 |
| **`ConfigModule.forRoot(...)`**| 启动配置模块 | 读取项目根目录下的 `.env` 环境变量文件。 |
| **`isGlobal: true`** | 是否设为全局可用 | 设为 true 后，整个系统任何角落都能直接读 `.env`，不需要重复 import。 |
| **`TypeOrmModule.forRoot(...)`**| 启动 TypeORM 根连接| 建立与数据库（SQLite）的核心物理连接池。 |
| **`type: 'better-sqlite3'`** | 驱动类型：现代化 SQLite | 指定使用高性能、现代化的 SQLite 驱动库。 |
| **`synchronize: false`** | 数据库同步设为关 | **生产级铁律**：严禁程序自动修改表结构，必须靠 SQL 脚本安全控制。 |
| **`TypeOrmModule.forFeature([Record])`** | 为特定实体开辟特性 | 告诉系统：“请为 `Record` 这张表制造专属的操作工具（Repository）”。 |
| **`providers: [RecordsService]`** | 供应者 / 服务商 | 将 Service 注册到模块中，以便系统能进行依赖注入（DI）。 |
| **`controllers: [RecordsController]`**| 控制器列表 | 将 Controller 注册到模块中，以便 NestJS 知道去监听哪些 URL 路由。 |

---

## 四、 业务逻辑与仓储层 (Service & TypeORM)

| 代码 / 单词 | 字面直译 (我: me) | 底层真正作用与意义 |
| :--- | :--- | :--- |
| **`constructor(...)`** | 构造函数 | 当类被创建实例的一瞬间，系统自动运行的方法。 |
| **`@InjectRepository(Record)`**| 注入 Record 仓储 | 叫系统把能操作 `Record` 表的专属工具箱塞进构造函数。 |
| **`private readonly`** | 私有的 + 只读的 | 只有本文件内部可调用，且赋值后绝对不允许篡改。 |
| **`Repository<Record>`** | 记录仓库类型 | TypeORM 官方提供的仓储泛型，自带 `.save()`、`.find()`、`.delete()` 等全套工具。 |
| **`async` / `await`** | 异步 / 等待 | 告诉电脑存取硬盘需要时间，先等等，等真正写完读完再往下执行。 |
| **`Promise<T>`** | 期约 / 凭据 | 异步函数的返回值凭据，承诺未来会兑现类型为 `T` 的真实结果。 |
| **`.create(dto)`** | 在内存中捏造实例 | **不碰数据库**！只是把前端的普通 JSON 数据包装成符合 Record 实体规范的对象。 |
| **`.save(entity)`** | 保存入库 | **真正写盘**！底层的 SQL 语句 `INSERT INTO records ...` 在这一行执行。 |
| **`.find({ order: ... })`** | 查找全部并排序 | 底层执行 `SELECT * FROM records ORDER BY ...`。 |
| **`date: 'DESC'`** | 降序排列 | Descending 缩写：日期由大到小（从最新到最旧）。 |
| **`.delete(id)`** | 删除指定主键行 | 底层执行 `DELETE FROM records WHERE id = ?`。 |
| **`result.affected`** | 受影响的行数 | 检查刚才的 SQL 到底删除了几行。如果是 0，说明数据库里本来就没有这个 id。 |
| **`NotFoundException`** | 未找到异常 | NestJS 内置错误类：抛出此错误会自动给前端返回 `HTTP 404 Not Found`。 |
| **`{ [key: string]: number }`** | 索引签名对象 | 声明键为字符串、值为数字的字典对象，避免与实体类名 `Record` 发生命名撞车。 |
| **`.startsWith(prefix)`** | 以...开头 | 字符串方法：判断日期是否以某月份开头（如 `'2026-10-21'.startsWith('2026-10')` 为真）。 |
| **`Number(val)`** | 数字强制类型转换 | 强制将变量转为纯数字，防止 SQLite 的 Decimal 文本在做 `+` 时变成字符串拼接。 |
| **`.toFixed(2)`** | 固定保留小数位 | 把数字四舍五入保留 2 位小数（返回字符串，通常再包一层 `Number(...)` 转回数字）。 |
| **`(obj[k] \|\| 0) + val`** | 字典安全累加 | 常用算法技巧：若该分类首次出现尚无数值，则以 0 为初始基数进行累加。 |

---

## 五、 网络接口与路由层 (Controller & Routing)

| 代码 / 单词 | 字面直译 (我: me) | 底层真正作用与意义 |
| :--- | :--- | :--- |
| **`@Controller('api/records')`**| 路由控制器前缀 | 告诉网络总机：凡是以 `http://localhost:3000/api/records` 开头的请求全归我管。 |
| **`@ApiTags('Records')`** | Swagger 标签 | 将所有相关接口在 Swagger 文档网页中归类收纳在 "Records" 分组下。 |
| **`@Post()`** | 监听 POST 请求 | 对应 HTTP POST 动词，通常用于客户端“提交新建”数据。 |
| **`@Get()`** | 监听 GET 请求 | 对应 HTTP GET 动词，通常用于客户端“获取查询”数据。 |
| **`@Get('summary')`** | 监听 GET /summary | 组合完整路由为 `GET /api/records/summary`。 |
| **`@Delete(':id')`** | 监听 DELETE /:id | 监听带动态参数的删除请求（如 `DELETE /api/records/5`）。冒号表示变量。 |
| **`@Body()`** | 提取请求体 | 把客户端通过网络发过来的 HTTP 请求体（Body 中的 JSON）提取出来。 |
| **`@Param('id')`** | 提取路径变量 | 把 URL 网址路径里的占位参数（如 `5`）抓取出来。 |
| **`ParseIntPipe`** | 整数转换管道 | 强制转换器：把 URL 里的字符串 `"5"` 变成纯数字 `5`；如果传了 `"abc"` 自动拦截打回 400。 |
| **`@Query('month')`** | 提取查询参数 | 从网址问号后面抓参数（例如 `/summary?month=2026-10` 中抓出 `"2026-10"`）。 |
| **`@ApiOperation({ summary })`**| 接口摘要描述 | 在 Swagger 网页上为接口展示一行清晰明了的中文/英文功能标题。 |
| **`@ApiParam(...)`** | 路径参数描述 | 在 Swagger 网页上为路径参数生成专门的输入框与说明。 |
| **`@ApiQuery(...)`** | 查询参数描述 | 在 Swagger 网页上为问号参数生成专门的输入框与说明。 |

---

## 六、 系统入口与安全大门 (Bootstrap & Security)

| 代码 / 单词 | 字面直译 (我: me) | 底层真正作用与意义 |
| :--- | :--- | :--- |
| **`app.useGlobalPipes(...)`** | 全局安装管道 | 安装全局安检门，所有从外部进来的请求必须强行经过管道清洗和质检。 |
| **`whitelist: true`** | 白名单保护 | 如果恶意攻击者传了 DTO 里面没有定义的额外字段，系统自动全部无情剔除。 |
| **`forbidNonWhitelisted: true`**| 禁止多余字段 | 只要传了非法多余字段，不仅剔除，直接亮红灯拒绝请求（400 Bad Request）。 |
| **`transform: true`** | 自动类型变形转换 | 把网络传进来的普通 JSON Object 真正实例化为 DTO 类的对象。 |
| **`DocumentBuilder()`** | 文档构建器 | Swagger 的配置工厂类，用来流水线式设置网页标题、说明和版本。 |
| **`.build()`** | 构建生成 | 生成最终的 OpenAPI 规范配置对象。 |
| **`SwaggerModule.createDocument`**| 创建文档模型 | 扫描全系统所有带 `@Api...` 标签的控制器，自动生成全套数据结构树。 |
| **`SwaggerModule.setup(...)`** | 挂载网页端点 | 把做好的 Swagger 交互界面正式托管到 `http://localhost:3000/api-docs`。 |
| **`app.listen(port)`** | 启动并监听端口 | 让 Node.js 开启本地网络监听（默认 3000 端口），正式开始对外服务。 |

---

## 七、 前端静态托管与数据交互 (Frontend & Static Serving)

| 代码 / 单词 | 字面直译 (我: me) | 底层真正作用与意义 |
| :--- | :--- | :--- |
| **`ServeStaticModule.forRoot(...)`** | 启动静态文件托管 | 告诉 NestJS：把本地目录当作网站服务器托管，浏览器直接访问 `http://localhost:3000` 即可加载网页。 |
| **`rootPath: join(process.cwd(), 'public')`** | 静态资源物理路径 | 动态获取当前项目根目录下的 `public` 文件夹绝对路径。 |
| **`exclude: ['/api/(.*)']`** | 排除特定路由规则 | 关键安全保护：凡是访问 `/api/` 接口或 `/api-docs` 文档的请求，不当作网页文件处理，直接透传给后端路由。 |
| **`fetch('/api/records', { ... })`** | 浏览器抓取网络请求 | 现代浏览器内置的原生网络请求函数，向后端 API 发送或获取 JSON 数据。 |
| **`e.preventDefault()`** | 阻止默认事件行为 | 阻止表单在点击提交按钮时默认导致的整页重新刷新跳转，保持单页面（SPA）丝滑体验。 |
| **`.toLocaleString('en-US', ...)`** | 本地化字符串格式化 | 将数字格式化为标准货币格式（如自动添加千分位逗号 `1,250.50` 并保留 2 位小数）。 |
| **`font-variant-numeric: tabular-nums`** | 等宽制表数字 | CSS 排版特性：让所有数字的字符宽度完全一致，确保表格上下行的金额、小数点垂直对齐不晃动。 |
| **`escapeHtml(str)`** | 转义特殊 HTML 字符 | 前端安全防线：将 `<`, `>`, `&` 等符号转为 HTML 实体，彻底防御 XSS 跨站脚本注入攻击。 |

---

## 八、 版本管理、多端适配与交付部署 (Git, Responsive & Distribution)

| 代码 / 单词 | 字面直译 (我: me) | 底层真正作用与意义 |
| :--- | :--- | :--- |
| **`.gitkeep`** | Git 保持占位文件 | Git 默认不会追踪空文件夹。在空目录下放置一个空的 `.gitkeep`，既能把 `data/` 目录结构同步到 GitHub，又不会暴露数据库文件。 |
| **`.gitignore`** | Git 忽略规则清单 | 告诉 Git 哪些文件是个人隐私或自动生成的文件（如 `data/*.db`、`.env`、`node_modules/`），绝对不提交上传到远程仓库。 |
| **`git tag -a v1.0-beta`** | 打上发布版本标签 | 在 Git 版本历史上盖上一个里程碑印章（Release 标签），用于标记 `1.0-beta` 正式版发布节点。 |
| **`@media (max-width: 640px)`** | 媒体查询断点 | CSS 响应式核心：当屏幕宽度小于等于 640px（手机竖屏）时，自动激活专门为移动端定制的样式（如 3 列自动折叠为单列）。 |
| **`127.0.0.1` vs `0.0.0.0`** | 本地回环 vs 全网监听 | `127.0.0.1`（localhost）只允许本机自己访问自己；`0.0.0.0` 表示监听电脑所有的网卡 IP，允许同一 WiFi 下的手机或局域网朋友直接访问。 |
| **`PWA (Progressive Web App)`** | 渐进式网页应用 | 让网页具备手机 App 的能力，在手机浏览器里点击“添加到主屏幕”，即可像原生 App 一样全屏离线打开运行。 |
| **`ngrok / Tunnel`** | 内网穿透隧道 | 在本机电脑与公网之间搭一座临时安全桥梁，自动生成一个公网 HTTPS 临时网址，发送给异地朋友就能立刻打开你的电脑网站。 |
| **`Electron / Tauri`** | 桌面端跨平台打包框架 | 把前端网页 + 后端逻辑 + SQLite 数据库打包成一个独立的 Windows `.exe` 安装程序，用户双击就能开箱即用，无需配置 Node.js 环境。 |

---

## 九、 数据可视化与文件导出 (Data Visualization & File Export - Sprint 4)

| 代码 / 单词 | 字面直译 (我: me) | 底层真正作用与意义 |
| :--- | :--- | :--- |
| **`Chart.js`** | 现代开源图表引擎库 | 极轻量但功能强大的 HTML5 Canvas 数据可视化库，把枯燥的数字转换为精美的环形图、折线图与柱状图。 |
| **`type: 'doughnut'`** | 甜甜圈 / 环形图类型 | 指定图表形态为环形图（空心圆饼），中间镂空便于营造现代高级金融仪表盘质感。 |
| **`cutout: '70%'`** | 内部镂空圆环比例 | 设定环形图中心空洞的半径占比为 70%，形成轻盈细致的细环造型。 |
| **`maintainAspectRatio: false`**| 关闭强制宽高比 | 允许图表自由铺满父级容器的高度与宽度，防止在不同屏幕尺寸下发生溢出或变形。 |
| **`chartInstance.destroy()`** | 销毁图表实例 | **防内存泄漏铁律**：在重新绘制新月份数据前，必须彻底清除旧的 Canvas 监听器与图元，否则图表会叠影或闪烁。 |
| **`Blob`** | 二进制大对象 (Binary Large Object) | 浏览器在内存中直接开辟的一块二进制文件数据块，用于在前端直接合成 CSV、Excel 或图片文件。 |
| **`\uFEFF`** | UTF-8 字节顺序标记 (BOM) | **防乱码圣旨**：告诉 Windows 系统的 Excel 软件：“本文件使用 UTF-8 编码，包含中文时请勿显示为乱码！” |
| **`URL.createObjectURL(blob)`** | 生成内存文件访问直链 | 将内存中的 Blob 包装成一个临时的浏览器伪网址（形如 `blob:http://...`），供浏览器点击下载。 |
| **`URL.revokeObjectURL(url)`** | 释放内存文件直链 | 文件触发下载后，立即通知浏览器回收该临时内存网址，避免内存泄露占用系统资源。 |
| **`RFC 4180 CSV 转义`** | 国际通用逗号分隔文件标准 | 将文字里的英文双引号转义为 `""` 并用双引号包裹单元格，防止备注里的逗号破坏表格列对齐。 |

---

## 十、 数据生命周期与归档清理策略 (Data Retention & Purging Strategy - Sprint 4 Step 2)

| 代码 / 单词 | 字面直译 (我: me) | 底层真正作用与意义 |
| :--- | :--- | :--- |
| **`createQueryBuilder()`** | 创建查询构造器 | TypeORM 强大的原生 SQL 构造工具，用于执行复杂的批量条件删除、聚合或联表操作。 |
| **`DefaultValuePipe(3)`** | 默认值管道 | NestJS 参数管道：当客户端请求网址没有传 `?years=` 参数时，系统自动赋予默认值 `3`。 |
| **`.where('date < :cutoff', { cutoff })`** | 参数化条件筛选 | 安全的 SQL 参数占位符语法，防止黑客通过恶意传入日期参数进行 SQL 注入攻击。 |
| **`静态路由优先于动态路由`** | 路由排队铁律 | `@Delete('purge')` 必须写在 `@Delete(':id')` 的**上方**！否则 Express 会误把单词 `"purge"` 当成数字 `:id` 解析而报错 400。 |
| **`Cutoff Date`** | 截止日期分水岭 | 计算历史数据的分水岭时间点（如今天减去 3 年），早于该日期的属于“历史老账”，晚于该日期的属于“当前活跃数据”。 |
| **`Data Retention Policy`** | 数据保留合规策略 | 商业金融与云数据库核心策略：设定数据在系统中的存活期限，定期归档清理以维持数据库性能与免费配额。 |
| **`Modal Dialog`** | 模态弹窗对话框 | 阻断式全屏遮罩弹窗，用于执行归档、危险删除等高风险操作，强迫用户集中注意力确认。 |

---

## 十一、 云端 PostgreSQL 与 Supabase 数据库集成 (Cloud PostgreSQL & Supabase Integration)

| 代码 / 单词 | 字面直译 (我: me) | 底层真正作用与意义 |
| :--- | :--- | :--- |
| **`pg` (node-postgres)** | Node 官方 PostgreSQL 驱动 | Node.js 与 PostgreSQL 通信的核心底层协议驱动，TypeORM 连接云端 Postgres 的必备插件。 |
| **`DATABASE_URL`** | 数据库统一连接串 (URI) | 包含协议、用户名、密码、主机域名、端口和数据库名的标准单行连接字符串。 |
| **`ssl: { rejectUnauthorized: false }`** | SSL 传输层安全配置 | 云数据库通信必须开启安全加密（TLS/SSL）；设为 false 允许云端托管的自签名安全证书正常握手。 |
| **`BIGSERIAL`** | 64 位大整数自增主键 | PostgreSQL 专属主键类型，支持多达 $9 \times 10^{18}$ 笔数据，彻底杜绝数据量爆表溢出。 |
| **`TIMESTAMPTZ`** | 带时区的时间戳 (Timestamp with Time Zone) | PostgreSQL 高级时间类型，在全球任何时区存入或读取时都能自动转换，防止跨国记账出现时差错乱。 |
| **`Session Pooler (端口 6543/5432)`** | Supabase 连接池代理 (Supavisor) | Supabase 官方提供的高并发连接池，不仅防止数据库连接被耗尽，而且自带对 IPv4 网络的原生兼容。 |
| **`Dynamic DB Driver Switching`** | 动态双驱动热切换 | 在 `AppModule` 中根据环境变量判断：有 `DATABASE_URL` 连云端 Supabase，没有则无缝降级使用本地 SQLite。 |

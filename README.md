# AI 内容生成工具

一个基于 Next.js + TypeScript + TailwindCSS + Deepseek API 的 Web 内容生成工具。

## 功能特性

- ✅ **内容生成**：根据关键词和模板结构生成原创内容
- ✅ **基于搜索的内容生成**：搜索排名前20的文章，基于搜索结果和自定义模版生成原创内容（新功能）
- ✅ **自定义模版**：支持自定义内容主体代码模版
- ✅ **内链生成**：自动为内容添加内链
- ✅ **SEO 优化**：自动生成关键词和描述
- ✅ **布局代码**：生成 HTML / React / Markdown / JSON Schema 布局代码

## 技术栈

- **框架**：Next.js 14 (App Router)
- **语言**：TypeScript
- **样式**：TailwindCSS
- **AI**：Deepseek API（兼容 OpenAI 格式，性能优秀，价格实惠）

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env.local` 并填入你的 Deepseek API Key：

```bash
cp .env.example .env.local
```

编辑 `.env.local`：

```env
# Deepseek API 配置（必需）
DEEPSEEK_API_KEY=sk-your-api-key-here

# 搜索API配置（可选，用于基于搜索的内容生成功能）
# 方式1：使用 SerpAPI（推荐）
SERP_API_KEY=your_serp_api_key

# 方式2：使用 Google Custom Search
# GOOGLE_SEARCH_API_KEY=your_google_api_key
# GOOGLE_SEARCH_ENGINE_ID=your_search_engine_id
```

### 3. 运行开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

### 4. 构建生产版本

```bash
npm run build
npm start
```

## 项目结构

```
projectAicontent/
├── app/
│   ├── api/                    # API 路由
│   │   ├── generate-content/
│   │   ├── generate-research-content/  # 基于搜索的内容生成
│   │   ├── generate-links/
│   │   ├── generate-seo/
│   │   └── generate-layout/
│   ├── components/             # UI 组件
│   │   ├── InputField.tsx
│   │   ├── SelectField.tsx
│   │   └── ResultBox.tsx
│   ├── services/               # 业务逻辑
│   │   ├── aiClient.ts
│   │   ├── contentGenerator.ts
│   │   ├── searchService.ts          # 搜索服务（新）
│   │   ├── researchContentGenerator.ts  # 基于搜索的内容生成（新）
│   │   ├── internalLinker.ts
│   │   ├── seoGenerator.ts
│   │   └── layoutBuilder.ts
│   ├── templates/              # 内容模板
│   │   └── contentTemplates.ts
│   └── page.tsx                # 主页面
├── styles/
│   └── globals.css             # 全局样式
├── package.json
├── .env.example
└── README.md
```

## 使用说明

### 基础内容生成

1. **输入关键词**：在输入框中输入关键词（支持多行）
2. **选择模板**：选择内容模板类型
3. **设置内链**：添加需要插入的内链（关键词和 URL）
4. **选择输出格式**：选择内容输出格式
5. **设置长度**：选择内容长度
6. **生成内容**：点击"生成内容"按钮

### 基于搜索的内容生成（新功能）

1. **输入关键词**：输入要搜索的关键词
2. **自定义模版**（可选）：输入自定义的内容结构模版
3. **启用搜索**：勾选"使用搜索结果"选项
4. **生成内容**：点击"基于搜索生成内容"按钮
5. 系统会：
   - 搜索关键词相关的排名前20的文章
   - 分析这些文章的内容
   - 根据自定义模版和搜索结果生成原创文章

### 其他功能

- **生成内链**：为已生成的内容添加内链
- **生成SEO信息**：自动生成关键词和描述
- **生成布局代码**：生成 HTML / Markdown / React / JSON Schema 代码

## 搜索API配置

### 方式1：SerpAPI（推荐）

1. 访问 [SerpAPI](https://serpapi.com/)
2. 注册账号并获取 API Key
3. 在 `.env.local` 中添加：`SERP_API_KEY=your_api_key`

### 方式2：Google Custom Search

1. 访问 [Google Custom Search](https://developers.google.com/custom-search)
2. 创建搜索引擎并获取 API Key 和 Engine ID
3. 在 `.env.local` 中添加：
   ```
   GOOGLE_SEARCH_API_KEY=your_api_key
   GOOGLE_SEARCH_ENGINE_ID=your_engine_id
   ```

## 注意事项

- 确保 Deepseek API Key 有效且有足够额度
- 如需使用基于搜索的内容生成功能，需要配置搜索API（SerpAPI 或 Google Custom Search）
- 建议在开发环境中测试，避免产生过多 API 调用费用
- 所有 AI 处理都在服务端完成，客户端不包含 API Key
- 基于搜索的内容生成会消耗更多 API 调用（搜索 + 内容生成）
- Deepseek API 价格实惠，性能优秀，是 OpenAI 的良好替代方案

## 许可证

MIT



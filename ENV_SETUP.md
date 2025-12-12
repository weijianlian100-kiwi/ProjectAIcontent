# 环境变量配置

请创建 `.env.local` 文件（在项目根目录），并添加以下配置：

```env
# Deepseek API 配置（必需）
DEEPSEEK_API_KEY=your_deepseek_api_key_here

# 可选：指定模型（默认使用 deepseek-chat）
# 可用模型选项：
# - deepseek-chat（推荐，通用对话模型，性能优秀，价格实惠）
# - deepseek-coder（代码专用模型，适合代码生成任务）
# DEEPSEEK_MODEL=deepseek-chat

# 搜索API配置（可选，用于基于搜索的内容生成功能）
# 方式1：使用 SerpAPI（推荐）
# SERP_API_KEY=your_serp_api_key

# 方式2：使用 Google Custom Search
# GOOGLE_SEARCH_API_KEY=your_google_api_key
# GOOGLE_SEARCH_ENGINE_ID=your_search_engine_id
```

## 获取 Deepseek API Key

1. 访问 [Deepseek Platform](https://platform.deepseek.com/)
2. 登录或注册账号
3. 进入 API Keys 页面
4. 创建新的 API Key
5. 复制 Key 并粘贴到 `.env.local` 文件中

## 模型选择建议

### 通用推荐
- **deepseek-chat**：默认选择，通用对话模型，性能优秀，价格实惠，适合大多数内容生成任务

### 代码生成任务
- **deepseek-coder**：代码专用模型，适合需要生成代码、布局代码等任务

## 常见错误处理

### 404 错误：模型不存在
如果遇到 404 错误，说明模型名称不正确或没有访问权限。请尝试使用 `deepseek-chat`。

### 429 错误：配额已用完
如果遇到 429 错误并提示配额已用完，可能的原因：
- 免费额度已用完
- 账户余额不足
- 已达到使用限制

**解决方案：**
1. 检查账户余额：https://platform.deepseek.com/balance
2. 查看使用情况：https://platform.deepseek.com/usage
3. 添加付款方式或充值：https://platform.deepseek.com/billing
4. 如果是免费账户，等待配额重置

## 搜索API配置（可选）

### 方式1：SerpAPI（推荐）

1. 访问 [SerpAPI](https://serpapi.com/)
2. 注册账号（有免费额度）
3. 获取 API Key
4. 在 `.env.local` 中添加：`SERP_API_KEY=your_api_key`

**优点**：
- 使用简单，无需额外配置
- 有免费额度
- 支持多种搜索引擎

### 方式2：Google Custom Search

1. 访问 [Google Custom Search API](https://developers.google.com/custom-search)
2. 创建项目并启用 Custom Search API
3. 创建搜索引擎，获取 Engine ID
4. 获取 API Key
5. 在 `.env.local` 中添加：
   ```
   GOOGLE_SEARCH_API_KEY=your_api_key
   GOOGLE_SEARCH_ENGINE_ID=your_engine_id
   ```

**注意**：Google Custom Search 有每日免费配额限制（100次/天）

## 注意事项

- `.env.local` 文件已添加到 `.gitignore`，不会被提交到版本控制
- 确保 Deepseek API Key 有足够的额度
- 如需使用基于搜索的内容生成功能，需要配置搜索API
- 建议在开发环境中测试，避免产生过多费用
- 如果遇到 404 错误（模型不存在），请尝试使用 `deepseek-chat`
- 如果遇到 429 错误（配额用完），需要充值账户或等待配额重置
- 基于搜索的内容生成会消耗更多 API 调用（搜索 + 内容生成）
- Deepseek API 价格实惠，性能优秀，是 OpenAI 的良好替代方案


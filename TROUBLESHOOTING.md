# 故障排除指南

## "生成失败，请检查网络连接" 错误

这个错误通常表示 API 请求失败。请按照以下步骤排查：

### 1. 检查 API Key 配置

**最常见的原因：API Key 未配置或无效**

#### 检查步骤：
1. 确认项目根目录存在 `.env.local` 文件
2. 打开 `.env.local` 文件，检查是否包含：
   ```env
   DEEPSEEK_API_KEY=sk-your-api-key-here
   ```
3. 确认 API Key 格式正确（通常以 `sk-` 开头）
4. 确认没有多余的空格或引号

#### 如何获取 API Key：
1. 访问 [Deepseek Platform](https://platform.deepseek.com/)
2. 登录或注册账号
3. 进入 [API Keys 页面](https://platform.deepseek.com/api_keys)
4. 创建新的 API Key
5. 复制 Key 并粘贴到 `.env.local` 文件中

#### 验证 API Key：
- 检查账户余额：https://platform.deepseek.com/balance
- 查看使用情况：https://platform.deepseek.com/usage

### 2. 检查服务器是否运行

#### 确认开发服务器正在运行：
```bash
# 在项目根目录运行
npm run dev
```

应该看到类似输出：
```
✓ Ready in 2.3s
○ Local:        http://localhost:3000
```

#### 如果服务器未运行：
1. 打开终端/命令行
2. 进入项目目录：`cd projectAicontent`
3. 运行：`npm run dev`
4. 等待服务器启动完成

### 3. 检查网络连接

#### 浏览器控制台检查：
1. 按 `F12` 打开开发者工具
2. 切换到 "Network"（网络）标签
3. 点击"生成内容"按钮
4. 查看是否有失败的请求（红色）
5. 点击失败的请求查看详细信息

#### 常见网络问题：
- **CORS 错误**：检查服务器是否正常运行
- **404 错误**：API 路由不存在，检查路由文件
- **500 错误**：服务器内部错误，查看服务器日志
- **超时**：API 响应时间过长，可能是网络问题或 API 服务问题

### 4. 检查浏览器控制台错误

#### 查看详细错误信息：
1. 按 `F12` 打开开发者工具
2. 切换到 "Console"（控制台）标签
3. 查看是否有红色错误信息
4. 错误信息会显示具体的问题原因

#### 常见错误类型：

**API Key 未配置：**
```
Deepseek API Key 未配置。请创建 .env.local 文件并添加：DEEPSEEK_API_KEY=your_api_key_here
```
**解决方案**：配置 API Key（见步骤1）

**API Key 无效：**
```
API Key 无效或未配置。请检查 .env.local 文件中的 DEEPSEEK_API_KEY 是否正确。
```
**解决方案**：检查 API Key 是否正确，重新生成新的 API Key

**配额已用完：**
```
❌ API 配额已用完
```
**解决方案**：
- 检查账户余额：https://platform.deepseek.com/balance
- 充值账户：https://platform.deepseek.com/billing
- 如果是免费账户，等待配额重置

**请求过于频繁：**
```
⚠️ 请求过于频繁，请稍后再试
```
**解决方案**：等待几分钟后重试，减少请求频率

**模型不存在：**
```
模型 "xxx" 不存在或您没有访问权限
```
**解决方案**：在 `.env.local` 中添加 `DEEPSEEK_MODEL=deepseek-chat`

### 5. 检查服务器日志

#### 查看服务器终端输出：
服务器终端会显示详细的错误信息，包括：
- API 调用失败的原因
- 错误堆栈信息
- 网络请求详情

#### 常见服务器错误：

**环境变量未加载：**
```
❌ DEEPSEEK_API_KEY 未配置！
```
**解决方案**：
1. 确认 `.env.local` 文件存在
2. 确认文件内容正确
3. 重启开发服务器（`Ctrl+C` 然后 `npm run dev`）

**API 调用失败：**
```
Deepseek API 调用失败: [错误详情]
```
**解决方案**：根据错误详情处理（见步骤4）

### 6. 重启开发服务器

有时环境变量更改后需要重启服务器：

1. 在终端按 `Ctrl+C` 停止服务器
2. 重新运行 `npm run dev`
3. 等待服务器启动完成
4. 刷新浏览器页面
5. 再次尝试生成内容

### 7. 验证 API Key 是否有效

#### 使用 curl 测试（可选）：
```bash
curl https://api.deepseek.com/v1/models \
  -H "Authorization: Bearer YOUR_API_KEY"
```

如果返回模型列表，说明 API Key 有效。

### 8. 检查防火墙和代理

#### 如果使用代理或 VPN：
- 确保可以访问 `https://api.deepseek.com`
- 检查防火墙设置
- 尝试关闭 VPN 后重试

### 9. 联系支持

如果以上步骤都无法解决问题：

1. **收集错误信息**：
   - 浏览器控制台的完整错误信息
   - 服务器终端的错误日志
   - 网络请求的详细信息（F12 > Network）

2. **检查 Deepseek 服务状态**：
   - 访问 Deepseek 官网查看是否有服务公告
   - 检查 API 文档是否有更新

3. **查看项目 Issues**：
   - 检查是否有类似问题
   - 提交新的 Issue 并附上错误信息

## 快速检查清单

- [ ] `.env.local` 文件存在
- [ ] `DEEPSEEK_API_KEY` 已配置
- [ ] API Key 格式正确（以 `sk-` 开头）
- [ ] 开发服务器正在运行（`npm run dev`）
- [ ] 浏览器可以访问 `http://localhost:3000`
- [ ] 浏览器控制台没有错误
- [ ] 服务器终端没有错误
- [ ] API Key 有足够余额
- [ ] 网络连接正常

## 常见错误消息对照表

| 错误消息 | 可能原因 | 解决方案 |
|---------|---------|---------|
| "生成失败，请检查网络连接" | 网络请求失败 | 检查网络、API Key、服务器状态 |
| "API Key 未配置" | 缺少环境变量 | 创建 `.env.local` 并配置 API Key |
| "API Key 无效" | API Key 错误 | 检查并更新 API Key |
| "配额已用完" | 账户余额不足 | 充值账户或等待配额重置 |
| "请求过于频繁" | 速率限制 | 等待后重试 |
| "模型不存在" | 模型名称错误 | 使用 `deepseek-chat` |

## 获取帮助

如果问题仍未解决，请提供以下信息：

1. 浏览器控制台的完整错误信息
2. 服务器终端的错误日志
3. `.env.local` 文件内容（**隐藏 API Key**）
4. 使用的 Node.js 版本（`node -v`）
5. 使用的 npm 版本（`npm -v`）
6. 操作系统信息



import OpenAI from 'openai';

// 检查 API Key 是否配置
const apiKey = process.env.DEEPSEEK_API_KEY;
if (!apiKey) {
  console.error('❌ DEEPSEEK_API_KEY 未配置！请创建 .env.local 文件并添加 API Key');
}

const openai = new OpenAI({
  apiKey: apiKey || '',
  baseURL: 'https://api.deepseek.com',
});

// 默认使用 deepseek-chat（Deepseek 通用对话模型）
// 可选模型：deepseek-chat, deepseek-coder
const DEFAULT_MODEL = process.env.DEEPSEEK_MODEL || 'deepseek-chat';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

/**
 * 调用 Deepseek API 生成内容
 */
export async function callOpenAI(
  messages: ChatMessage[],
  model: string = DEFAULT_MODEL,
  temperature: number = 0.7
): Promise<string> {
  // 检查 API Key
  if (!apiKey) {
    throw new Error(
      'Deepseek API Key 未配置。请创建 .env.local 文件并添加：DEEPSEEK_API_KEY=your_api_key_here\n' +
      '获取 API Key: https://platform.deepseek.com/api_keys'
    );
  }

  try {
    const response = await openai.chat.completions.create({
      model,
      messages: messages as any,
      temperature,
      max_tokens: 4000,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('Deepseek API 返回空内容');
    }

    return content;
  } catch (error: any) {
    console.error('Deepseek API 调用失败:', error);
    
    // 提供更友好的错误提示
    if (error.status === 401) {
      throw new Error(
        'API Key 无效或未配置。请检查 .env.local 文件中的 DEEPSEEK_API_KEY 是否正确。\n' +
        '获取 API Key: https://platform.deepseek.com/api_keys'
      );
    }
    
    // 模型不存在或无权访问
    if (error.status === 404) {
      throw new Error(
        `模型 "${model}" 不存在或您没有访问权限。\n` +
        `请尝试在 .env.local 中设置其他模型，例如：\n` +
        `- deepseek-chat（推荐，通用对话模型）\n` +
        `- deepseek-coder（代码专用模型）\n` +
        `设置方法：在 .env.local 中添加 DEEPSEEK_MODEL=deepseek-chat`
      );
    }
    
    // 配额已用完
    if (error.status === 429) {
      const errorMessage = error.message || '';
      if (errorMessage.includes('quota') || errorMessage.includes('billing')) {
        throw new Error(
          '❌ API 配额已用完\n\n' +
          '可能的原因：\n' +
          '1. 免费额度已用完\n' +
          '2. 账户余额不足\n' +
          '3. 已达到使用限制\n\n' +
          '解决方案：\n' +
          '• 检查账户余额：https://platform.deepseek.com/balance\n' +
          '• 查看使用情况：https://platform.deepseek.com/usage\n' +
          '• 添加付款方式或充值：https://platform.deepseek.com/billing\n' +
          '• 等待配额重置（如果是免费账户）\n\n' +
          '如需继续使用，请充值账户或升级到付费计划。'
        );
      } else {
        // 速率限制（Rate Limit）
        throw new Error(
          '⚠️ 请求过于频繁，请稍后再试\n\n' +
          '建议：\n' +
          '• 等待几分钟后重试\n' +
          '• 减少请求频率\n' +
          '• 查看限制详情：https://platform.deepseek.com/docs'
        );
      }
    }
    
    throw new Error(`AI 调用失败: ${error.message || '未知错误'}`);
  }
}

/**
 * 生成单次对话内容
 */
export async function generateText(
  prompt: string,
  systemPrompt?: string
): Promise<string> {
  const messages: ChatMessage[] = [];
  
  if (systemPrompt) {
    messages.push({ role: 'system', content: systemPrompt });
  }
  
  messages.push({ role: 'user', content: prompt });

  return await callOpenAI(messages);
}


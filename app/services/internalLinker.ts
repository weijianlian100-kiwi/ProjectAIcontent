import { generateText } from './aiClient';

export interface InternalLink {
  keyword: string;
  url: string;
}

/**
 * 为内容添加内链
 * 强调自然、不过度堆叠
 */
export async function addInternalLinks(
  content: string,
  links: InternalLink[]
): Promise<string> {
  if (!links || links.length === 0) {
    return content;
  }

  const linksDescription = links
    .map((link, index) => `${index + 1}. 关键词："${link.keyword}"，链接：${link.url}`)
    .join('\n');

  const systemPrompt = `你是一名 SEO 内容优化专家，擅长在文章中自然插入内链。
要求：
1. 内链插入要自然，不影响阅读体验
2. 每个关键词最多出现 1-2 次链接（根据内容长度决定）
3. 优先在关键词首次出现时添加链接
4. 不要过度堆叠，保持内容可读性
5. 使用 HTML 格式：<a href="URL">关键词</a>`;

  const userPrompt = `请为以下内容添加内链：

原始内容：
${content}

需要添加的内链：
${linksDescription}

请返回添加内链后的完整内容（使用 HTML 格式），确保：
- 内链自然融入内容
- 不过度堆叠
- 保持内容流畅性
- 使用正确的 HTML 链接格式`;

  try {
    const result = await generateText(userPrompt, systemPrompt);
    return result.trim();
  } catch (error) {
    console.error('内链生成失败:', error);
    // 如果 AI 调用失败，返回原始内容
    return content;
  }
}






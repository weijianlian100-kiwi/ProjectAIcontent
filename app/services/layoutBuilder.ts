import { generateText } from './aiClient';

export type LayoutFormat = 'html' | 'markdown' | 'react' | 'json-schema';

/**
 * 根据内容生成布局代码
 */
export async function generateLayout(
  content: string,
  format: LayoutFormat
): Promise<string> {
  const formatDescriptions: Record<LayoutFormat, string> = {
    html: '生成 HTML 格式，只生成 <article></article> 标签内的内容和 HTML 标签，不要包含 <article> 标签本身',
    markdown: '生成 Markdown 格式，使用标题、列表、代码块等语法',
    react: '生成 React JSX 组件代码，使用函数组件和现代 React 语法',
    'json-schema': '生成 JSON Schema 格式，描述内容的结构和字段',
  };

  const systemPrompt = `你是一名前端开发专家，擅长根据内容生成各种格式的布局代码。
要求：
1. 代码规范、可读性强
2. 符合最佳实践
3. 结构清晰，易于维护
${format === 'html' ? '4. 对于 HTML 格式，只生成 <article></article> 标签内的内容，不要包含 <article> 标签本身' : ''}`;

  const htmlSpecificPrompt = format === 'html' 
    ? '\n重要：只生成 <article></article> 标签内的 HTML 内容，不要包含 <article> 标签本身。例如：\n<article>\n  <h1>标题</h1>\n  <p>内容</p>\n</article>\n应该只返回：\n  <h1>标题</h1>\n  <p>内容</p>'
    : '';

  const userPrompt = `请根据以下内容生成 ${formatDescriptions[format]} 布局代码：

内容：
${content}

要求：
- 根据内容结构生成对应的布局代码
- 使用 ${format} 格式
- 代码要完整、可运行（如适用）
- 添加必要的注释说明${htmlSpecificPrompt}`;

  try {
    let result = await generateText(userPrompt, systemPrompt);
    result = result.trim();

    // 如果是 HTML 格式，确保只返回 <article> 标签内的内容
    if (format === 'html') {
      // 尝试提取 <article> 标签内的内容
      const articleMatch = result.match(/<article[^>]*>([\s\S]*?)<\/article>/i);
      if (articleMatch) {
        result = articleMatch[1].trim();
      } else {
        // 如果没有找到 <article> 标签，尝试移除可能存在的 <article> 标签
        result = result.replace(/<\/?article[^>]*>/gi, '').trim();
      }
    }

    return result;
  } catch (error) {
    console.error('布局代码生成失败:', error);
    throw error;
  }
}





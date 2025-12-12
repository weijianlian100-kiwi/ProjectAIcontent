import { generateText } from './aiClient';
import { Language, getSystemPromptForLanguage } from '../utils/languageConfig';

export interface SEOInfo {
  keywords: string[];
  description: string;
}

/**
 * 生成 SEO 信息（关键词和描述）
 */
export async function generateSEO(content: string, language: Language = 'zh'): Promise<SEOInfo> {
  const baseSystemPrompt = `你是一名 SEO 专家，擅长分析内容并提取关键词和生成描述。
要求：
1. 关键词：5-10 个，与内容高度相关
2. 描述：准确概括内容，吸引点击
3. 输出格式：JSON 格式
4. 关键词和描述必须使用与内容相同的语言`;

  const systemPrompt = getSystemPromptForLanguage(language, baseSystemPrompt);

  const lengthUnit = language === 'zh' ? '字' : language === 'en' ? 'words' : 'слов';
  const descLength = language === 'zh' ? '150字左右' : language === 'en' ? 'approximately 150 words' : 'примерно 150 слов';

  const userPrompt = language === 'zh'
    ? `请为以下内容生成 SEO 信息：

内容：
${content}

请返回 JSON 格式：
{
  "keywords": ["关键词1", "关键词2", ...],
  "description": "${descLength}的描述"
}

要求：
- keywords: 5-10 个相关关键词，使用中文
- description: ${descLength}，准确概括内容，使用中文`
    : language === 'en'
    ? `Please generate SEO information for the following content:

Content:
${content}

Please return in JSON format:
{
  "keywords": ["keyword1", "keyword2", ...],
  "description": "Description of ${descLength}"
}

Requirements:
- keywords: 5-10 relevant keywords, in English
- description: ${descLength}, accurately summarize the content, in English`
    : `Пожалуйста, создайте SEO информацию для следующего контента:

Контент:
${content}

Пожалуйста, верните в формате JSON:
{
  "keywords": ["ключевое слово1", "ключевое слово2", ...],
  "description": "Описание из ${descLength}"
}

Требования:
- keywords: 5-10 релевантных ключевых слов, на русском языке
- description: ${descLength}, точно обобщите контент, на русском языке`;

  try {
    const result = await generateText(userPrompt, systemPrompt);
    
    // 尝试解析 JSON
    try {
      const jsonMatch = result.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          keywords: Array.isArray(parsed.keywords) ? parsed.keywords : [],
          description: parsed.description || '',
        };
      }
    } catch (parseError) {
      console.warn('JSON 解析失败，尝试提取信息:', parseError);
    }

    // 如果 JSON 解析失败，尝试从文本中提取
    const keywordsPattern = language === 'zh' 
      ? /关键词[：:]\s*([^\n]+)/i
      : language === 'en'
      ? /keywords?[：:]\s*([^\n]+)/i
      : /ключевые\s+слова?[：:]\s*([^\n]+)/i;
    
    const descPattern = language === 'zh'
      ? /描述[：:]\s*([^\n]+)/i
      : language === 'en'
      ? /description[：:]\s*([^\n]+)/i
      : /описание[：:]\s*([^\n]+)/i;
    
    const keywordsMatch = result.match(keywordsPattern);
    const descMatch = result.match(descPattern);

    return {
      keywords: keywordsMatch
        ? keywordsMatch[1].split(/[,，]/).map((k) => k.trim()).filter(Boolean)
        : [],
      description: descMatch ? descMatch[1].trim() : '',
    };
  } catch (error) {
    console.error('SEO 生成失败:', error);
    return {
      keywords: [],
      description: '',
    };
  }
}





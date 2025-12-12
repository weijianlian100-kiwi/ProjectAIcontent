import { generateText } from './aiClient';
import { getTemplateStructure, TemplateType } from '../templates/contentTemplates';
import { Language, getSystemPromptForLanguage } from '../utils/languageConfig';

export interface ContentGenerationParams {
  keywords: string;
  templateType: TemplateType;
  length: number;
  language?: Language;
}

/**
 * 生成原创内容
 */
export async function generateContent(
  params: ContentGenerationParams
): Promise<string> {
  const { keywords, templateType, length, language = 'zh' } = params;
  
  const templateStructure = getTemplateStructure(templateType);
  
  const baseSystemPrompt = `你是一名专业的内容创作者，擅长根据关键词和模板结构生成高质量、原创的内容。
要求：
1. 内容必须原创，不得抄袭
2. 语言自然流畅，符合目标受众阅读习惯
3. 结构清晰，逻辑严密
4. 确保内容长度符合要求
5. 内容必须本土化，符合目标语言地区的文化背景和表达习惯`;

  const systemPrompt = getSystemPromptForLanguage(language, baseSystemPrompt);

  // 根据语言生成不同的提示词
  const lengthUnit = language === 'zh' ? '字' : language === 'en' ? 'words' : 'слов';
  
  const userPrompt = language === 'zh' 
    ? `请根据以下信息生成原创内容：

关键词：${keywords}

模版结构：
${templateStructure}

长度要求：约 ${length} ${lengthUnit}

请生成完整的内容，确保：
- 内容原创且有价值
- 结构符合模板要求
- 长度接近 ${length} ${lengthUnit}
- 语言流畅自然，符合中文表达习惯
- 内容本土化，适合中文读者阅读`
    : language === 'en'
    ? `Please generate original content based on the following information:

Keywords: ${keywords}

Template Structure:
${templateStructure}

Length Requirement: Approximately ${length} ${lengthUnit}

Please generate complete content, ensuring:
- Content is original and valuable
- Structure follows the template requirements
- Length is close to ${length} ${lengthUnit}
- Language is fluent and natural, following English writing conventions
- Content is localized for English-speaking readers`
    : `Пожалуйста, создайте оригинальный контент на основе следующей информации:

Ключевые слова: ${keywords}

Структура шаблона:
${templateStructure}

Требование к длине: Приблизительно ${length} ${lengthUnit}

Пожалуйста, создайте полный контент, обеспечивая:
- Контент оригинален и ценен
- Структура соответствует требованиям шаблона
- Длина близка к ${length} ${lengthUnit}
- Язык плавный и естественный, следует правилам русского языка
- Контент локализован для русскоязычных читателей`;

  try {
    const content = await generateText(userPrompt, systemPrompt);
    return content.trim();
  } catch (error) {
    console.error('内容生成失败:', error);
    throw error;
  }
}





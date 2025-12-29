import { generateText } from './aiClient';
import { getTemplateStructure, TemplateType } from '../templates/contentTemplates';
import { Language, getSystemPromptForLanguage } from '../utils/languageConfig';
import { getWritingGuidelinesPrompt, generateOpeningQuestion } from '../utils/writingGuidelines';

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
5. 内容必须本土化，符合目标语言地区的文化背景和表达习惯
6. 严格遵守AI撰写规范，避免机械化表达`;

  // 添加撰写规范到系统提示词
  const writingGuidelines = getWritingGuidelinesPrompt(language);
  const systemPrompt = getSystemPromptForLanguage(language, `${baseSystemPrompt}\n\n${writingGuidelines}`);

  // 根据语言生成不同的提示词
  const lengthUnit = language === 'zh' ? '字' : language === 'en' ? 'words' : 'слов';
  
  // 生成开头疑问句建议
  const openingSuggestion = generateOpeningQuestion(keywords, language);
  
  const userPrompt = language === 'zh' 
    ? `请根据以下信息生成原创内容：

关键词：${keywords}

模版结构：
${templateStructure}

长度要求：约 ${length} ${lengthUnit}

开头建议：可以使用类似"${openingSuggestion}"这样的疑问句开头，吸引读者注意力。

请生成完整的内容，确保：
- **开头必须使用疑问句形式**，例如："你是否曾经想过..."、"你知道...吗？"、"为什么...？"等
- 内容原创且有价值
- 结构符合模板要求
- 长度接近 ${length} ${lengthUnit}
- 语言流畅自然，像真人对话一样，避免机械化表达
- 内容本土化，适合中文读者阅读
- **绝对不要使用**："首先"、"其次"、"最后"、"总之"、"综上所述"、"值得注意的是"等AI常见词汇
- 使用口语化、接地气的表达，避免书面语和套话`
    : language === 'en'
    ? `Please generate original content based on the following information:

Keywords: ${keywords}

Template Structure:
${templateStructure}

Length Requirement: Approximately ${length} ${lengthUnit}

Opening Suggestion: You can start with a question like "${openingSuggestion}" to attract reader attention.

Please generate complete content, ensuring:
- **Opening must use question form**, such as "Have you ever wondered...", "Did you know that...", "What if...", etc.
- Content is original and valuable
- Structure follows the template requirements
- Length is close to ${length} ${lengthUnit}
- Language is fluent and natural, like real conversation, avoid mechanical expressions
- Content is localized for English-speaking readers
- **Never use**: "First of all", "Secondly", "In conclusion", "It is worth noting", etc.
- Use conversational, down-to-earth expressions, avoid formal clichés`
    : `Пожалуйста, создайте оригинальный контент на основе следующей информации:

Ключевые слова: ${keywords}

Структура шаблона:
${templateStructure}

Требование к длине: Приблизительно ${length} ${lengthUnit}

Предложение для начала: Вы можете начать с вопроса, например "${openingSuggestion}", чтобы привлечь внимание читателя.

Пожалуйста, создайте полный контент, обеспечивая:
- **Начало должно быть в форме вопроса**, например "Вы когда-нибудь задумывались...", "Знаете ли вы...", "Что если..." и т.д.
- Контент оригинален и ценен
- Структура соответствует требованиям шаблона
- Длина близка к ${length} ${lengthUnit}
- Язык плавный и естественный, как настоящий разговор, избегайте механических выражений
- Контент локализован для русскоязычных читателей
- **Никогда не используйте**: "Во-первых", "Во-вторых", "В заключение", "Стоит отметить" и т.д.
- Используйте разговорные, простые выражения, избегайте формальных клише`;

  try {
    const content = await generateText(userPrompt, systemPrompt);
    return content.trim();
  } catch (error) {
    console.error('内容生成失败:', error);
    throw error;
  }
}





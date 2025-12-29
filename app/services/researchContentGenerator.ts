import { generateText } from './aiClient';
import { searchTopArticles, getArticlesSummary } from './searchService';
import { Language, getSystemPromptForLanguage } from '../utils/languageConfig';
import { getWritingGuidelinesPrompt, generateOpeningQuestion } from '../utils/writingGuidelines';

export interface ResearchContentParams {
  keywords: string;
  customTemplate: string;
  length: number;
  useSearchResults: boolean;
  language?: Language;
}

/**
 * 基于搜索结果生成原创内容
 * 1. 搜索关键词获取排名前20的文章
 * 2. 分析这些文章的内容
 * 3. 根据自定义模版和搜索结果生成原创文章
 */
export async function generateResearchContent(
  params: ResearchContentParams
): Promise<{ content: string; searchResults?: any[] }> {
  const { keywords, customTemplate, length, useSearchResults, language = 'zh' } = params;

  let searchResultsSummary = '';
  let searchResults: any[] = [];

  // 如果需要使用搜索结果
  if (useSearchResults) {
    try {
      // 搜索排名前20的文章
      const searchResponse = await searchTopArticles(keywords);
      searchResults = searchResponse.results;

      if (searchResults.length === 0) {
        throw new Error('未找到相关搜索结果');
      }

      // 获取文章内容摘要
      searchResultsSummary = await getArticlesSummary(searchResults);

      console.log(`找到 ${searchResults.length} 篇相关文章`);
    } catch (error: any) {
      console.error('搜索失败:', error);
      // 如果搜索失败，仍然可以生成内容，但不使用搜索结果
      searchResultsSummary = '';
    }
  }

  const baseSystemPrompt = `你是一名专业的内容创作者和SEO专家，擅长基于搜索结果和参考文章创作高质量、原创的内容。

要求：
1. 内容必须完全原创，不能直接复制参考文章的内容
2. 可以借鉴参考文章的观点、数据、结构，但必须用自己的语言重新表达
3. 内容要有独特见解，不能只是简单汇总
4. 语言自然流畅，符合目标受众阅读习惯
5. 结构清晰，逻辑严密
6. 确保内容长度符合要求
7. 内容必须本土化，符合目标语言地区的文化背景和表达习惯
8. 严格遵守AI撰写规范，避免机械化表达`;

  // 添加撰写规范到系统提示词
  const writingGuidelines = getWritingGuidelinesPrompt(language);
  const systemPrompt = getSystemPromptForLanguage(language, `${baseSystemPrompt}\n\n${writingGuidelines}`);

  const lengthUnit = language === 'zh' ? '字' : language === 'en' ? 'words' : 'слов';
  const noTemplateText = language === 'zh' 
    ? '无特定模版，请根据内容自然组织'
    : language === 'en'
    ? 'No specific template, organize naturally based on content'
    : 'Нет конкретного шаблона, организуйте естественно на основе контента';

  // 生成开头疑问句建议
  const openingSuggestion = generateOpeningQuestion(keywords, language);
  
  let userPrompt = '';

  if (searchResultsSummary) {
    userPrompt = language === 'zh'
      ? `请根据以下信息生成原创内容：

关键词：${keywords}

自定义模版结构：
${customTemplate || noTemplateText}

参考文章（排名前20的搜索结果）：
${searchResultsSummary}

长度要求：约 ${length} ${lengthUnit}

开头建议：可以使用类似"${openingSuggestion}"这样的疑问句开头，吸引读者注意力。

请基于以上参考文章，生成一篇原创文章。要求：
- **开头必须使用疑问句形式**，例如："你是否曾经想过..."、"你知道...吗？"、"为什么...？"等
- 内容必须原创，不能直接复制参考文章
- 可以借鉴参考文章的观点、数据、结构，但要用自己的语言表达
- 要有独特见解，不能只是简单汇总
- 结构符合自定义模版要求
- 长度接近 ${length} ${lengthUnit}
- 语言流畅自然，像真人对话一样，避免机械化表达
- 内容本土化，适合中文读者阅读
- **绝对不要使用**："首先"、"其次"、"最后"、"总之"、"综上所述"、"值得注意的是"等AI常见词汇
- 使用口语化、接地气的表达，避免书面语和套话`
      : language === 'en'
      ? `Please generate original content based on the following information:

Keywords: ${keywords}

Custom Template Structure:
${customTemplate || noTemplateText}

Reference Articles (Top 20 Search Results):
${searchResultsSummary}

Length Requirement: Approximately ${length} ${lengthUnit}

Opening Suggestion: You can start with a question like "${openingSuggestion}" to attract reader attention.

Please generate an original article based on the above reference articles. Requirements:
- **Opening must use question form**, such as "Have you ever wondered...", "Did you know that...", "What if...", etc.
- Content must be original, cannot directly copy reference articles
- Can draw inspiration from reference articles' viewpoints, data, and structure, but must express in your own words
- Must have unique insights, not just a simple summary
- Structure follows custom template requirements
- Length is close to ${length} ${lengthUnit}
- Language is fluent and natural, like real conversation, avoid mechanical expressions
- Content is localized for English-speaking readers
- **Never use**: "First of all", "Secondly", "In conclusion", "It is worth noting", etc.
- Use conversational, down-to-earth expressions, avoid formal clichés`
      : `Пожалуйста, создайте оригинальный контент на основе следующей информации:

Ключевые слова: ${keywords}

Структура пользовательского шаблона:
${customTemplate || noTemplateText}

Справочные статьи (Топ-20 результатов поиска):
${searchResultsSummary}

Требование к длине: Приблизительно ${length} ${lengthUnit}

Предложение для начала: Вы можете начать с вопроса, например "${openingSuggestion}", чтобы привлечь внимание читателя.

Пожалуйста, создайте оригинальную статью на основе вышеуказанных справочных статей. Требования:
- **Начало должно быть в форме вопроса**, например "Вы когда-нибудь задумывались...", "Знаете ли вы...", "Что если..." и т.д.
- Контент должен быть оригинальным, нельзя напрямую копировать справочные статьи
- Можно черпать вдохновение из точек зрения, данных и структуры справочных статей, но необходимо выражать своими словами
- Должны быть уникальные идеи, а не просто краткое изложение
- Структура соответствует требованиям пользовательского шаблона
- Длина близка к ${length} ${lengthUnit}
- Язык плавный и естественный, как настоящий разговор, избегайте механических выражений
- Контент локализован для русскоязычных читателей
- **Никогда не используйте**: "Во-первых", "Во-вторых", "В заключение", "Стоит отметить" и т.д.
- Используйте разговорные, простые выражения, избегайте формальных клише`;
  } else {
    userPrompt = language === 'zh'
      ? `请根据以下信息生成原创内容：

关键词：${keywords}

自定义模版结构：
${customTemplate || noTemplateText}

长度要求：约 ${length} ${lengthUnit}

开头建议：可以使用类似"${openingSuggestion}"这样的疑问句开头，吸引读者注意力。

请生成完整的内容，确保：
- **开头必须使用疑问句形式**，例如："你是否曾经想过..."、"你知道...吗？"、"为什么...？"等
- 内容原创且有价值
- 结构符合自定义模版要求
- 长度接近 ${length} ${lengthUnit}
- 语言流畅自然，像真人对话一样，避免机械化表达
- 内容本土化，适合中文读者阅读
- **绝对不要使用**："首先"、"其次"、"最后"、"总之"、"综上所述"、"值得注意的是"等AI常见词汇
- 使用口语化、接地气的表达，避免书面语和套话`
      : language === 'en'
      ? `Please generate original content based on the following information:

Keywords: ${keywords}

Custom Template Structure:
${customTemplate || noTemplateText}

Length Requirement: Approximately ${length} ${lengthUnit}

Opening Suggestion: You can start with a question like "${openingSuggestion}" to attract reader attention.

Please generate complete content, ensuring:
- **Opening must use question form**, such as "Have you ever wondered...", "Did you know that...", "What if...", etc.
- Content is original and valuable
- Structure follows custom template requirements
- Length is close to ${length} ${lengthUnit}
- Language is fluent and natural, like real conversation, avoid mechanical expressions
- Content is localized for English-speaking readers
- **Never use**: "First of all", "Secondly", "In conclusion", "It is worth noting", etc.
- Use conversational, down-to-earth expressions, avoid formal clichés`
      : `Пожалуйста, создайте оригинальный контент на основе следующей информации:

Ключевые слова: ${keywords}

Структура пользовательского шаблона:
${customTemplate || noTemplateText}

Требование к длине: Приблизительно ${length} ${lengthUnit}

Предложение для начала: Вы можете начать с вопроса, например "${openingSuggestion}", чтобы привлечь внимание читателя.

Пожалуйста, создайте полный контент, обеспечивая:
- **Начало должно быть в форме вопроса**, например "Вы когда-нибудь задумывались...", "Знаете ли вы...", "Что если..." и т.д.
- Контент оригинален и ценен
- Структура соответствует требованиям пользовательского шаблона
- Длина близка к ${length} ${lengthUnit}
- Язык плавный и естественный, как настоящий разговор, избегайте механических выражений
- Контент локализован для русскоязычных читателей
- **Никогда не используйте**: "Во-первых", "Во-вторых", "В заключение", "Стоит отметить" и т.д.
- Используйте разговорные, простые выражения, избегайте формальных клише`;
  }

  try {
    const content = await generateText(userPrompt, systemPrompt);
    return {
      content: content.trim(),
      searchResults: searchResults.length > 0 ? searchResults : undefined,
    };
  } catch (error) {
    console.error('内容生成失败:', error);
    throw error;
  }
}




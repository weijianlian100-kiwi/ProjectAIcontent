/**
 * AI 撰写规范和指南
 * 用于优化生成内容的自然度和本地化程度
 */

/**
 * 禁止使用的AI常见词汇列表
 * 这些词汇会让内容显得机械化、不自然
 */
export const FORBIDDEN_AI_WORDS = [
  // 开头常用词
  '首先', '其次', '最后', '总之', '综上所述', '总的来说',
  '值得注意的是', '需要指出的是', '值得一提的是',
  '众所周知', '不言而喻', '显而易见',
  
  // 过渡词
  '接下来', '然后', '接着', '随后',
  '与此同时', '另外', '此外', '除此之外',
  
  // 总结词
  '综上所述', '总而言之', '简而言之', '概括来说',
  '总的来说', '归根结底', '说到底',
  
  // 强调词（过度使用）
  '非常重要', '极其重要', '至关重要', '特别重要',
  '非常关键', '极其关键',
  
  // 机械化表达
  '本文将', '本文旨在', '本文主要', '本文详细',
  '通过本文', '在本文中',
  
  // 生硬连接
  '因此', '所以', '故而', '因而', '于是',
  '然而', '但是', '不过', '可是',
  
  // 套话
  '毋庸置疑', '毫无疑问', '毫无疑问地',
  '不可否认', '必须承认',
];

/**
 * 本地化表达建议
 * 用于替换生硬的表达，使其更符合本地化用语
 */
export const LOCALIZATION_GUIDELINES = {
  zh: {
    // 开头引导性疑问句模板
    openingQuestions: [
      '你是否曾经...',
      '你有没有想过...',
      '你知道...吗？',
      '为什么...？',
      '如何...？',
      '什么才是...？',
      '...到底是怎么回事？',
      '...真的那么重要吗？',
      '...到底有什么好处？',
      '...和...有什么区别？',
    ],
    
    // 自然过渡词（替代生硬连接）
    naturalTransitions: [
      '话说回来', '其实', '实际上', '说白了',
      '换句话说', '打个比方', '举个例子',
      '比如', '比方说', '就拿...来说',
    ],
    
    // 口语化表达（让内容更接地气）
    colloquialExpressions: [
      '说白了', '说白了就是', '说白了就是',
      '说白了', '说白了就是', '说白了就是',
      '说白了', '说白了就是', '说白了就是',
    ],
    
    // 避免使用的生硬表达
    avoidExpressions: [
      '本文将', '本文旨在', '本文主要介绍',
      '通过本文', '在本文中', '本文详细阐述',
      '首先', '其次', '最后', '总之',
    ],
  },
  
  en: {
    openingQuestions: [
      'Have you ever wondered...',
      'Did you know that...',
      'What if...',
      'Why is...',
      'How can...',
      'What makes...',
      'Is it really...',
      'What\'s the difference between...',
    ],
    
    naturalTransitions: [
      'Actually', 'In fact', 'To put it simply',
      'In other words', 'For example', 'Take...for instance',
    ],
    
    avoidExpressions: [
      'This article will', 'This article aims to',
      'In this article', 'First of all', 'In conclusion',
    ],
  },
  
  ru: {
    openingQuestions: [
      'Вы когда-нибудь задумывались...',
      'Знаете ли вы...',
      'Что если...',
      'Почему...',
      'Как...',
      'В чем разница между...',
    ],
    
    naturalTransitions: [
      'На самом деле', 'Проще говоря', 'Другими словами',
      'Например', 'Возьмем...',
    ],
    
    avoidExpressions: [
      'В этой статье', 'Эта статья направлена на',
      'Во-первых', 'В заключение',
    ],
  },
};

/**
 * 获取撰写规范提示词
 */
export function getWritingGuidelinesPrompt(language: 'zh' | 'en' | 'ru'): string {
  const guidelines = LOCALIZATION_GUIDELINES[language];
  const forbiddenWords = FORBIDDEN_AI_WORDS.join('、');
  
  if (language === 'zh') {
    return `【重要撰写规范 - 必须严格遵守】

1. **禁止使用AI常见词汇**：
   绝对不要使用以下词汇：${forbiddenWords}
   这些词汇会让内容显得机械化、不自然。

2. **开头必须使用疑问句引导**：
   文章开头必须使用疑问句形式，例如：
   - "你是否曾经想过..."
   - "你知道...吗？"
   - "为什么...？"
   - "如何...？"
   - "...到底是怎么回事？"
   用疑问句吸引读者注意力，激发阅读兴趣。

3. **使用本地化自然表达**：
   - 使用口语化、接地气的表达方式
   - 避免书面语、官方语、套话
   - 使用"其实"、"说白了"、"举个例子"等自然过渡
   - 避免"首先"、"其次"、"最后"等生硬结构

4. **语言风格要求**：
   - 语言要自然流畅，像真人对话一样
   - 避免过于正式、学术化的表达
   - 使用短句，避免过长的复合句
   - 适当使用口语化词汇，让内容更亲切

5. **内容组织**：
   - 不要使用"本文将"、"本文旨在"等套话
   - 直接进入主题，开门见山
   - 用故事、案例、场景来阐述观点
   - 避免机械化的列举和总结

6. **检查清单**：
   生成内容后，请自检：
   - ✓ 开头是否使用了疑问句？
   - ✓ 是否避免了所有禁止词汇？
   - ✓ 语言是否自然、口语化？
   - ✓ 是否避免了机械化表达？
   - ✓ 是否符合本地化用语习惯？`;
  } else if (language === 'en') {
    return `【Important Writing Guidelines - Must Strictly Follow】

1. **Forbidden AI Common Words**:
   Never use these words: ${FORBIDDEN_AI_WORDS.slice(0, 10).join(', ')}
   These words make content sound mechanical and unnatural.

2. **Opening Must Use Question Form**:
   Article opening must use question form, such as:
   - "Have you ever wondered..."
   - "Did you know that..."
   - "What if..."
   - "Why is..."
   - "How can..."
   Use questions to attract reader attention and spark interest.

3. **Use Natural Localized Expressions**:
   - Use conversational, down-to-earth expressions
   - Avoid formal, academic language
   - Use natural transitions like "Actually", "In fact", "For example"
   - Avoid rigid structures like "First of all", "Secondly", "In conclusion"

4. **Language Style Requirements**:
   - Language should be natural and fluent, like real conversation
   - Avoid overly formal, academic expressions
   - Use short sentences, avoid overly long compound sentences
   - Appropriately use colloquial vocabulary to make content more friendly

5. **Content Organization**:
   - Don't use clichés like "This article will", "This article aims to"
   - Get straight to the point
   - Use stories, cases, scenarios to illustrate points
   - Avoid mechanical listing and summarizing`;
  } else {
    return `【Важные правила написания - необходимо строго соблюдать】

1. **Запрещенные слова ИИ**:
   Никогда не используйте эти слова: ${FORBIDDEN_AI_WORDS.slice(0, 10).join(', ')}
   Эти слова делают контент механическим и неестественным.

2. **Начало должно быть в форме вопроса**:
   Начало статьи должно быть в форме вопроса, например:
   - "Вы когда-нибудь задумывались..."
   - "Знаете ли вы..."
   - "Что если..."
   - "Почему..."
   - "Как..."
   Используйте вопросы для привлечения внимания читателя.

3. **Используйте естественные локализованные выражения**:
   - Используйте разговорные, простые выражения
   - Избегайте формального, академического языка
   - Используйте естественные переходы
   - Избегайте жестких структур`;
  }
}

/**
 * 检查内容是否包含禁止词汇
 */
export function containsForbiddenWords(content: string): string[] {
  const found: string[] = [];
  FORBIDDEN_AI_WORDS.forEach(word => {
    if (content.includes(word)) {
      found.push(word);
    }
  });
  return found;
}

/**
 * 生成开头疑问句建议
 */
export function generateOpeningQuestion(keywords: string, language: 'zh' | 'en' | 'ru'): string {
  const templates = LOCALIZATION_GUIDELINES[language].openingQuestions;
  const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
  
  // 提取第一个关键词
  let firstKeyword = '';
  if (language === 'zh') {
    firstKeyword = keywords.split(/[，,、\s]/)[0].trim();
  } else {
    firstKeyword = keywords.split(/[,\s]/)[0].trim();
  }
  
  // 如果关键词为空，使用默认值
  if (!firstKeyword) {
    firstKeyword = language === 'zh' ? '这个话题' : language === 'en' ? 'this topic' : 'эту тему';
  }
  
  // 替换模板中的占位符
  return randomTemplate.replace('...', firstKeyword);
}


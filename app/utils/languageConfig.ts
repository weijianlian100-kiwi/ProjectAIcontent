/**
 * 语言配置和工具函数
 */

export type Language = 'zh' | 'en' | 'ru';

export interface LanguageConfig {
  code: Language;
  name: string;
  nativeName: string;
  description: string;
}

export const SUPPORTED_LANGUAGES: Record<Language, LanguageConfig> = {
  zh: {
    code: 'zh',
    name: 'Chinese',
    nativeName: '中文',
    description: '简体中文',
  },
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    description: 'English',
  },
  ru: {
    code: 'ru',
    name: 'Russian',
    nativeName: 'Русский',
    description: 'Русский язык',
  },
};

/**
 * 获取语言配置
 */
export function getLanguageConfig(language: Language): LanguageConfig {
  return SUPPORTED_LANGUAGES[language] || SUPPORTED_LANGUAGES.zh;
}

/**
 * 获取所有支持的语言列表
 */
export function getAllLanguages(): LanguageConfig[] {
  return Object.values(SUPPORTED_LANGUAGES);
}

/**
 * 获取语言的本土化提示词
 */
export function getLocalizationPrompt(language: Language): string {
  const config = getLanguageConfig(language);
  
  const prompts: Record<Language, string> = {
    zh: `请使用简体中文生成内容。要求：
- 使用地道的中文表达方式
- 符合中文读者的阅读习惯
- 使用中文标点符号
- 语言自然流畅，避免生硬翻译`,
    en: `Please generate content in English. Requirements:
- Use natural English expressions
- Follow English writing conventions
- Use proper English punctuation
- Write in a fluent and natural style, avoid literal translation`,
    ru: `Пожалуйста, создайте контент на русском языке. Требования:
- Используйте естественные русские выражения
- Следуйте правилам русского языка
- Используйте правильную русскую пунктуацию
- Пишите естественно и плавно, избегайте дословного перевода`,
  };
  
  return prompts[language] || prompts.zh;
}

/**
 * 获取语言特定的系统提示词
 */
export function getSystemPromptForLanguage(language: Language, basePrompt: string): string {
  const localization = getLocalizationPrompt(language);
  return `${basePrompt}\n\n${localization}`;
}





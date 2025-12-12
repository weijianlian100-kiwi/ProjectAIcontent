/**
 * 内容模板定义
 */

export type TemplateType = 
  | 'blog' 
  | 'seo-article' 
  | 'product' 
  | 'tutorial' 
  | 'landing-page';

export interface ContentTemplate {
  name: string;
  description: string;
  structure: string;
}

export const CONTENT_TEMPLATES: Record<TemplateType, ContentTemplate> = {
  blog: {
    name: '博客文章',
    description: '适合博客、新闻类文章',
    structure: `标题：吸引人的标题
引言：简要介绍主题
正文：
  - 第一段：核心观点
  - 第二段：详细阐述
  - 第三段：实例或案例
  - 第四段：总结或展望
结尾：总结全文，可包含行动号召`,
  },
  'seo-article': {
    name: 'SEO 文章',
    description: '针对搜索引擎优化的文章',
    structure: `H1 标题：包含主关键词
引言段落：包含关键词，吸引读者
正文结构：
  - H2 小标题1：相关长尾关键词
    - 段落内容（300-500字）
  - H2 小标题2：相关长尾关键词
    - 段落内容（300-500字）
  - H2 小标题3：相关长尾关键词
    - 段落内容（300-500字）
结尾：总结并包含主关键词`,
  },
  product: {
    name: '产品介绍',
    description: '产品功能、特点介绍',
    structure: `产品名称与定位
核心功能特点：
  - 功能点1：详细说明
  - 功能点2：详细说明
  - 功能点3：详细说明
使用场景：
  - 场景1
  - 场景2
优势总结
行动号召（CTA）`,
  },
  tutorial: {
    name: '教程/指南',
    description: '步骤式教程内容',
    structure: `教程标题
前置要求说明
步骤1：标题
  - 详细说明
  - 注意事项
步骤2：标题
  - 详细说明
  - 注意事项
步骤3：标题
  - 详细说明
  - 注意事项
常见问题（FAQ）
总结`,
  },
  'landing-page': {
    name: '落地页',
    description: '营销落地页模块化内容',
    structure: `Hero 区域：
  - 主标题
  - 副标题
  - CTA 按钮文案
优势区域：
  - 优势1：标题 + 描述
  - 优势2：标题 + 描述
  - 优势3：标题 + 描述
功能展示区域：
  - 功能点1
  - 功能点2
  - 功能点3
客户见证/案例
最终 CTA 区域`,
  },
};

/**
 * 获取模板结构文本
 */
export function getTemplateStructure(type: TemplateType): string {
  return CONTENT_TEMPLATES[type].structure;
}

/**
 * 获取所有模板类型
 */
export function getAllTemplateTypes(): TemplateType[] {
  return Object.keys(CONTENT_TEMPLATES) as TemplateType[];
}






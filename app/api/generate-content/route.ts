import { NextRequest, NextResponse } from 'next/server';
import { generateContent } from '../../services/contentGenerator';
import { TemplateType } from '../../templates/contentTemplates';
import { Language } from '../../utils/languageConfig';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { keywords, templateType, length, language } = body;

    // 验证输入
    if (!keywords || typeof keywords !== 'string') {
      return NextResponse.json(
        { success: false, message: '关键词不能为空' },
        { status: 400 }
      );
    }

    if (!templateType || !['blog', 'seo-article', 'product', 'tutorial', 'landing-page'].includes(templateType)) {
      return NextResponse.json(
        { success: false, message: '无效的模板类型' },
        { status: 400 }
      );
    }

    const contentLength = parseInt(length) || 800;
    if (contentLength < 100 || contentLength > 5000) {
      return NextResponse.json(
        { success: false, message: '内容长度应在 100-5000 字之间' },
        { status: 400 }
      );
    }

    // 验证语言参数
    const validLanguages: Language[] = ['zh', 'en', 'ru'];
    const contentLanguage: Language = validLanguages.includes(language) ? language : 'zh';

    // 生成内容
    const content = await generateContent({
      keywords,
      templateType: templateType as TemplateType,
      length: contentLength,
      language: contentLanguage,
    });

    return NextResponse.json({
      success: true,
      data: { content },
      message: '内容生成成功',
    });
  } catch (error: any) {
    console.error('内容生成 API 错误:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || '内容生成失败',
      },
      { status: 500 }
    );
  }
}


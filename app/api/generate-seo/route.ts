import { NextRequest, NextResponse } from 'next/server';
import { generateSEO } from '../../services/seoGenerator';
import { Language } from '../../utils/languageConfig';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, language } = body;

    // 验证输入
    if (!content || typeof content !== 'string') {
      return NextResponse.json(
        { success: false, message: '内容不能为空' },
        { status: 400 }
      );
    }

    if (content.length < 50) {
      return NextResponse.json(
        { success: false, message: '内容太短，无法生成有效的 SEO 信息' },
        { status: 400 }
      );
    }

    // 验证语言参数
    const validLanguages: Language[] = ['zh', 'en', 'ru'];
    const contentLanguage: Language = validLanguages.includes(language) ? language : 'zh';

    // 生成 SEO 信息
    const seoInfo = await generateSEO(content, contentLanguage);

    return NextResponse.json({
      success: true,
      data: seoInfo,
      message: 'SEO 信息生成成功',
    });
  } catch (error: any) {
    console.error('SEO 生成 API 错误:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'SEO 生成失败',
      },
      { status: 500 }
    );
  }
}


import { NextRequest, NextResponse } from 'next/server';
import { generateResearchContent } from '../../services/researchContentGenerator';
import { Language } from '../../utils/languageConfig';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { keywords, customTemplate, length, useSearchResults, language } = body;

    // 验证输入
    if (!keywords || typeof keywords !== 'string') {
      return NextResponse.json(
        { success: false, message: '关键词不能为空' },
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

    // 如果使用搜索结果，检查是否配置了搜索API
    if (useSearchResults) {
      const hasSerpAPI = !!process.env.SERP_API_KEY;
      const hasGoogleSearch = !!(
        process.env.GOOGLE_SEARCH_API_KEY && process.env.GOOGLE_SEARCH_ENGINE_ID
      );

      if (!hasSerpAPI && !hasGoogleSearch) {
        return NextResponse.json(
          {
            success: false,
            message:
              '未配置搜索API。请在 .env.local 中配置以下之一：\n' +
              '1. SERP_API_KEY（推荐，访问 https://serpapi.com/）\n' +
              '2. GOOGLE_SEARCH_API_KEY 和 GOOGLE_SEARCH_ENGINE_ID',
          },
          { status: 400 }
        );
      }
    }

    // 验证语言参数
    const validLanguages: Language[] = ['zh', 'en', 'ru'];
    const contentLanguage: Language = validLanguages.includes(language) ? language : 'zh';

    // 生成内容
    const result = await generateResearchContent({
      keywords,
      customTemplate: customTemplate || '',
      length: contentLength,
      useSearchResults: useSearchResults || false,
      language: contentLanguage,
    });

    return NextResponse.json({
      success: true,
      data: result,
      message: '内容生成成功',
    });
  } catch (error: any) {
    console.error('研究型内容生成 API 错误:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || '内容生成失败',
      },
      { status: 500 }
    );
  }
}




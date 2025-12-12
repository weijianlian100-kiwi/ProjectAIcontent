import { NextRequest, NextResponse } from 'next/server';
import { generateLayout, LayoutFormat } from '../../services/layoutBuilder';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, format } = body;

    // 验证输入
    if (!content || typeof content !== 'string') {
      return NextResponse.json(
        { success: false, message: '内容不能为空' },
        { status: 400 }
      );
    }

    const validFormats: LayoutFormat[] = ['html', 'markdown', 'react', 'json-schema'];
    if (!format || !validFormats.includes(format)) {
      return NextResponse.json(
        { success: false, message: `无效的格式，支持: ${validFormats.join(', ')}` },
        { status: 400 }
      );
    }

    // 生成布局代码
    const layoutCode = await generateLayout(content, format);

    return NextResponse.json({
      success: true,
      data: { code: layoutCode, format },
      message: '布局代码生成成功',
    });
  } catch (error: any) {
    console.error('布局代码生成 API 错误:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || '布局代码生成失败',
      },
      { status: 500 }
    );
  }
}


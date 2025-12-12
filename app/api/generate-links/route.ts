import { NextRequest, NextResponse } from 'next/server';
import { addInternalLinks } from '../../services/internalLinker';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, links } = body;

    // 验证输入
    if (!content || typeof content !== 'string') {
      return NextResponse.json(
        { success: false, message: '内容不能为空' },
        { status: 400 }
      );
    }

    if (!Array.isArray(links)) {
      return NextResponse.json(
        { success: false, message: '内链格式错误，应为数组' },
        { status: 400 }
      );
    }

    // 验证内链格式
    const validLinks = links.filter((link: any) => {
      return (
        link &&
        typeof link.keyword === 'string' &&
        typeof link.url === 'string' &&
        link.keyword.trim() &&
        link.url.trim()
      );
    });

    if (validLinks.length === 0) {
      return NextResponse.json({
        success: true,
        data: { content },
        message: '没有有效的内链，返回原始内容',
      });
    }

    // 添加内链
    const contentWithLinks = await addInternalLinks(content, validLinks);

    return NextResponse.json({
      success: true,
      data: { content: contentWithLinks },
      message: '内链添加成功',
    });
  } catch (error: any) {
    console.error('内链生成 API 错误:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || '内链生成失败',
      },
      { status: 500 }
    );
  }
}


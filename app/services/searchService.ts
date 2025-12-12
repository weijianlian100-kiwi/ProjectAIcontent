/**
 * 搜索服务 - 获取关键词相关的排名前20的文章
 * 支持多种搜索API：SerpAPI、Google Custom Search等
 */

export interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  position: number;
}

export interface SearchResponse {
  results: SearchResult[];
  total: number;
}

/**
 * 使用 SerpAPI 搜索（推荐）
 * 需要配置 SERP_API_KEY 环境变量
 */
async function searchWithSerpAPI(keyword: string): Promise<SearchResponse> {
  const apiKey = process.env.SERP_API_KEY;
  if (!apiKey) {
    throw new Error('SERP_API_KEY 未配置。请访问 https://serpapi.com/ 获取 API Key');
  }

  const url = `https://serpapi.com/search.json?q=${encodeURIComponent(keyword)}&num=20&api_key=${apiKey}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    const results: SearchResult[] = (data.organic_results || []).slice(0, 20).map((item: any, index: number) => ({
      title: item.title || '',
      url: item.link || '',
      snippet: item.snippet || '',
      position: index + 1,
    }));

    return {
      results,
      total: results.length,
    };
  } catch (error: any) {
    console.error('SerpAPI 搜索失败:', error);
    throw new Error(`搜索失败: ${error.message || '未知错误'}`);
  }
}

/**
 * 使用 Google Custom Search API
 * 需要配置 GOOGLE_SEARCH_API_KEY 和 GOOGLE_SEARCH_ENGINE_ID 环境变量
 */
async function searchWithGoogleCustom(keyword: string): Promise<SearchResponse> {
  const apiKey = process.env.GOOGLE_SEARCH_API_KEY;
  const engineId = process.env.GOOGLE_SEARCH_ENGINE_ID;

  if (!apiKey || !engineId) {
    throw new Error('GOOGLE_SEARCH_API_KEY 或 GOOGLE_SEARCH_ENGINE_ID 未配置');
  }

  const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${engineId}&q=${encodeURIComponent(keyword)}&num=20`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message || '搜索失败');
    }

    const results: SearchResult[] = (data.items || []).slice(0, 20).map((item: any, index: number) => ({
      title: item.title || '',
      url: item.link || '',
      snippet: item.snippet || '',
      position: index + 1,
    }));

    return {
      results,
      total: results.length,
    };
  } catch (error: any) {
    console.error('Google Custom Search 失败:', error);
    throw new Error(`搜索失败: ${error.message || '未知错误'}`);
  }
}

/**
 * 获取文章内容（通过URL）
 */
async function fetchArticleContent(url: string): Promise<string> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!response.ok) {
      return '';
    }

    const html = await response.text();
    
    // 简单的HTML内容提取（实际项目中可以使用更专业的库如cheerio）
    // 这里只提取文本内容，去除HTML标签
    const text = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    return text.substring(0, 5000); // 限制长度
  } catch (error) {
    console.error(`获取文章内容失败 (${url}):`, error);
    return '';
  }
}

/**
 * 搜索关键词并获取排名前20的文章
 */
export async function searchTopArticles(keyword: string): Promise<SearchResponse> {
  // 优先使用 SerpAPI，如果没有配置则使用 Google Custom Search
  if (process.env.SERP_API_KEY) {
    return await searchWithSerpAPI(keyword);
  } else if (process.env.GOOGLE_SEARCH_API_KEY && process.env.GOOGLE_SEARCH_ENGINE_ID) {
    return await searchWithGoogleCustom(keyword);
  } else {
    throw new Error(
      '未配置搜索API。请选择以下方式之一：\n' +
      '1. 配置 SERP_API_KEY（推荐，访问 https://serpapi.com/）\n' +
      '2. 配置 GOOGLE_SEARCH_API_KEY 和 GOOGLE_SEARCH_ENGINE_ID（访问 https://developers.google.com/custom-search）'
    );
  }
}

/**
 * 获取搜索结果的文章内容摘要
 */
export async function getArticlesSummary(searchResults: SearchResult[]): Promise<string> {
  const summaries: string[] = [];

  // 限制只获取前10篇文章的详细内容（避免请求过多）
  const limitedResults = searchResults.slice(0, 10);

  for (const result of limitedResults) {
    const content = await fetchArticleContent(result.url);
    if (content) {
      summaries.push(`标题: ${result.title}\nURL: ${result.url}\n摘要: ${result.snippet}\n内容片段: ${content.substring(0, 1000)}`);
    } else {
      summaries.push(`标题: ${result.title}\nURL: ${result.url}\n摘要: ${result.snippet}`);
    }
  }

  return summaries.join('\n\n---\n\n');
}





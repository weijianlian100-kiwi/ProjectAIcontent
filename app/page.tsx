'use client';

import React, { useState } from 'react';
import InputField from './components/InputField';
import SelectField from './components/SelectField';
import ResultBox from './components/ResultBox';
import { CONTENT_TEMPLATES, TemplateType } from './templates/contentTemplates';
import { Language, getAllLanguages } from './utils/languageConfig';

interface InternalLink {
  keyword: string;
  url: string;
}

export default function Home() {
  // 输入状态
  const [keywords, setKeywords] = useState('');
  const [templateType, setTemplateType] = useState<TemplateType>('blog');
  const [customTemplate, setCustomTemplate] = useState('');
  const [useSearchResults, setUseSearchResults] = useState(false);
  const [outputFormat, setOutputFormat] = useState('text');
  const [contentLength, setContentLength] = useState('800');
  const [language, setLanguage] = useState<Language>('zh');
  const [internalLinks, setInternalLinks] = useState<InternalLink[]>([]);
  const [newLinkKeyword, setNewLinkKeyword] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');

  // 输出状态
  const [generatedContent, setGeneratedContent] = useState('');
  const [contentWithLinks, setContentWithLinks] = useState('');
  const [seoInfo, setSeoInfo] = useState<{ keywords: string[]; description: string } | null>(null);
  const [layoutCode, setLayoutCode] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);

  // 加载状态
  const [loading, setLoading] = useState({
    content: false,
    research: false,
    links: false,
    seo: false,
    layout: false,
    allInOne: false,
  });

  // 进度状态
  const [progress, setProgress] = useState<{
    current: string;
    completed: string[];
    percentage: number;
  }>({
    current: '',
    completed: [],
    percentage: 0,
  });

  // 模板选项
  const templateOptions = Object.entries(CONTENT_TEMPLATES).map(([value, template]) => ({
    value,
    label: `${template.name} - ${template.description}`,
  }));

  const formatOptions = [
    { value: 'text', label: '纯文本' },
    { value: 'html', label: 'HTML' },
    { value: 'markdown', label: 'Markdown' },
    { value: 'react', label: 'React JSX' },
    { value: 'json-schema', label: 'JSON Schema' },
  ];

  const lengthOptions = [
    { value: '500', label: '500 字' },
    { value: '800', label: '800 字' },
    { value: '1500', label: '1500 字' },
    { value: '2000', label: '2000 字' },
  ];

  const languageOptions = getAllLanguages().map((lang) => ({
    value: lang.code,
    label: `${lang.nativeName} (${lang.name})`,
  }));

  // 添加内链
  const handleAddLink = () => {
    if (newLinkKeyword.trim() && newLinkUrl.trim()) {
      setInternalLinks([
        ...internalLinks,
        { keyword: newLinkKeyword.trim(), url: newLinkUrl.trim() },
      ]);
      setNewLinkKeyword('');
      setNewLinkUrl('');
    }
  };

  // 删除内链
  const handleRemoveLink = (index: number) => {
    setInternalLinks(internalLinks.filter((_, i) => i !== index));
  };

  // 更新进度
  const updateProgress = (current: string, completed: string[], percentage: number) => {
    setProgress({ current, completed, percentage });
  };

  // 生成内容
  const handleGenerateContent = async () => {
    if (!keywords.trim()) {
      alert('请输入关键词');
      return;
    }

    setLoading({ ...loading, content: true });
    try {
      const response = await fetch('/api/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          keywords,
          templateType,
          length: parseInt(contentLength),
          language,
        }),
      });

      // 检查响应状态
      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `请求失败 (状态码: ${response.status})`;
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorMessage;
        } catch {
          errorMessage = errorText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      if (data.success) {
        setGeneratedContent(data.data.content);
        setContentWithLinks('');
        setSeoInfo(null);
        setLayoutCode('');
        setSearchResults([]);
      } else {
        throw new Error(data.message || '生成失败');
      }
    } catch (error: any) {
      console.error('生成内容失败:', error);
      const errorMessage = error.message || '生成失败，请检查网络连接';
      alert(`生成失败：${errorMessage}\n\n可能的原因：\n1. API Key 未配置或无效\n2. 网络连接问题\n3. 服务器错误\n\n请检查浏览器控制台获取详细信息。`);
    } finally {
      setLoading({ ...loading, content: false });
    }
  };

  // 一键生成所有内容（包括内链、SEO、布局）
  const handleGenerateAll = async () => {
    if (!keywords.trim()) {
      alert('请输入关键词');
      return;
    }

    // 重置状态
    setGeneratedContent('');
    setContentWithLinks('');
    setSeoInfo(null);
    setLayoutCode('');
    setSearchResults([]);
    setLoading({ ...loading, allInOne: true });
    updateProgress('正在生成内容...', [], 0);

    try {
      // 步骤1: 生成内容
      updateProgress('正在生成内容...', [], 10);
      const contentResponse = await fetch('/api/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          keywords,
          templateType,
          length: parseInt(contentLength),
          language,
        }),
      });

      // 检查响应状态
      if (!contentResponse.ok) {
        const errorText = await contentResponse.text();
        let errorMessage = `内容生成请求失败 (状态码: ${contentResponse.status})`;
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorMessage;
        } catch {
          errorMessage = errorText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const contentData = await contentResponse.json();
      if (!contentData.success) {
        throw new Error(contentData.message || '内容生成失败');
      }

      const baseContent = contentData.data.content;
      // 立即显示生成的内容
      setGeneratedContent(baseContent);
      updateProgress('正在添加内链...', ['内容生成完成'], 30);
      
      // 添加小延迟以便用户看到内容更新
      await new Promise(resolve => setTimeout(resolve, 300));

      // 步骤2: 添加内链（如果有内链）
      let finalContent = baseContent;
      if (internalLinks.length > 0) {
        try {
          const linksResponse = await fetch('/api/generate-links', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              content: baseContent,
              links: internalLinks,
            }),
          });

          if (!linksResponse.ok) {
            throw new Error(`内链生成请求失败 (状态码: ${linksResponse.status})`);
          }

          const linksData = await linksResponse.json();
          if (linksData.success) {
            finalContent = linksData.data.content;
            // 立即显示添加内链后的内容
            setContentWithLinks(finalContent);
            updateProgress('正在生成SEO信息...', ['内容生成完成', '内链添加完成'], 50);
            await new Promise(resolve => setTimeout(resolve, 300));
          } else {
            console.warn('内链生成失败，使用原始内容:', linksData.message);
            updateProgress('正在生成SEO信息...', ['内容生成完成', '内链添加跳过'], 50);
          }
        } catch (linkError: any) {
          console.warn('内链生成失败，使用原始内容:', linkError.message);
          updateProgress('正在生成SEO信息...', ['内容生成完成', '内链添加跳过'], 50);
        }
      } else {
        updateProgress('正在生成SEO信息...', ['内容生成完成'], 50);
      }

      // 步骤3: 生成SEO信息
      try {
        const seoResponse = await fetch('/api/generate-seo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: finalContent, language }),
        });

        if (!seoResponse.ok) {
          throw new Error(`SEO生成请求失败 (状态码: ${seoResponse.status})`);
        }

        const seoData = await seoResponse.json();
        if (seoData.success) {
          // 立即显示SEO信息
          setSeoInfo(seoData.data);
          updateProgress('正在生成布局代码...', ['内容生成完成', internalLinks.length > 0 ? '内链添加完成' : '', 'SEO信息生成完成'].filter(Boolean), 70);
          await new Promise(resolve => setTimeout(resolve, 300));
        } else {
          console.warn('SEO生成失败:', seoData.message);
          updateProgress('正在生成布局代码...', ['内容生成完成', internalLinks.length > 0 ? '内链添加完成' : ''].filter(Boolean), 70);
        }
      } catch (seoError: any) {
        console.warn('SEO生成失败:', seoError.message);
        updateProgress('正在生成布局代码...', ['内容生成完成', internalLinks.length > 0 ? '内链添加完成' : ''].filter(Boolean), 70);
      }

      // 步骤4: 生成布局代码（如果输出格式不是纯文本）
      if (outputFormat !== 'text') {
        try {
          const layoutResponse = await fetch('/api/generate-layout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              content: finalContent,
              format: outputFormat,
            }),
          });

          if (!layoutResponse.ok) {
            throw new Error(`布局代码生成请求失败 (状态码: ${layoutResponse.status})`);
          }

          const layoutData = await layoutResponse.json();
          if (layoutData.success) {
            // 立即显示布局代码
            setLayoutCode(layoutData.data.code);
            updateProgress('完成', ['内容生成完成', internalLinks.length > 0 ? '内链添加完成' : '', 'SEO信息生成完成', '布局代码生成完成'].filter(Boolean), 100);
            await new Promise(resolve => setTimeout(resolve, 300));
          } else {
            console.warn('布局代码生成失败:', layoutData.message);
            updateProgress('完成', ['内容生成完成', internalLinks.length > 0 ? '内链添加完成' : '', 'SEO信息生成完成'].filter(Boolean), 90);
          }
        } catch (layoutError: any) {
          console.warn('布局代码生成失败:', layoutError.message);
          updateProgress('完成', ['内容生成完成', internalLinks.length > 0 ? '内链添加完成' : '', 'SEO信息生成完成'].filter(Boolean), 90);
        }
      } else {
        updateProgress('完成', ['内容生成完成', internalLinks.length > 0 ? '内链添加完成' : '', 'SEO信息生成完成'].filter(Boolean), 100);
      }
    } catch (error: any) {
      console.error('一键生成失败:', error);
      const errorMessage = error.message || '生成失败，请检查网络连接';
      alert(`生成失败：${errorMessage}\n\n可能的原因：\n1. API Key 未配置或无效\n2. 网络连接问题\n3. 服务器错误\n\n请检查浏览器控制台（F12）获取详细信息。`);
      updateProgress('生成失败', [], 0);
    } finally {
      setLoading({ ...loading, allInOne: false });
      // 3秒后清除进度提示
      setTimeout(() => {
        setProgress({ current: '', completed: [], percentage: 0 });
      }, 3000);
    }
  };

  // 基于搜索生成内容
  const handleGenerateResearchContent = async () => {
    if (!keywords.trim()) {
      alert('请输入关键词');
      return;
    }

    setLoading({ ...loading, research: true });
    try {
      const response = await fetch('/api/generate-research-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          keywords,
          customTemplate,
          length: parseInt(contentLength),
          useSearchResults,
          language,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setGeneratedContent(data.data.content);
        setSearchResults(data.data.searchResults || []);
        setContentWithLinks('');
        setSeoInfo(null);
        setLayoutCode('');
      } else {
        alert(data.message || '生成失败');
      }
    } catch (error) {
      console.error('生成研究型内容失败:', error);
      alert('生成失败，请检查网络连接');
    } finally {
      setLoading({ ...loading, research: false });
    }
  };

  // 生成内链
  const handleGenerateLinks = async () => {
    if (!generatedContent) {
      alert('请先生成内容');
      return;
    }

    if (internalLinks.length === 0) {
      alert('请先添加内链');
      return;
    }

    setLoading({ ...loading, links: true });
    try {
      const response = await fetch('/api/generate-links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: generatedContent,
          links: internalLinks,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setContentWithLinks(data.data.content);
      } else {
        alert(data.message || '生成失败');
      }
    } catch (error) {
      console.error('生成内链失败:', error);
      alert('生成失败，请检查网络连接');
    } finally {
      setLoading({ ...loading, links: false });
    }
  };

  // 生成 SEO
  const handleGenerateSEO = async () => {
    const content = contentWithLinks || generatedContent;
    if (!content) {
      alert('请先生成内容');
      return;
    }

    setLoading({ ...loading, seo: true });
    try {
      const response = await fetch('/api/generate-seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, language }),
      });

      const data = await response.json();
      if (data.success) {
        setSeoInfo(data.data);
      } else {
        alert(data.message || '生成失败');
      }
    } catch (error) {
      console.error('生成 SEO 失败:', error);
      alert('生成失败，请检查网络连接');
    } finally {
      setLoading({ ...loading, seo: false });
    }
  };

  // 生成布局代码
  const handleGenerateLayout = async () => {
    const content = contentWithLinks || generatedContent;
    if (!content) {
      alert('请先生成内容');
      return;
    }

    setLoading({ ...loading, layout: true });
    try {
      const response = await fetch('/api/generate-layout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          format: outputFormat,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setLayoutCode(data.data.code);
      } else {
        alert(data.message || '生成失败');
      }
    } catch (error) {
      console.error('生成布局代码失败:', error);
      alert('生成失败，请检查网络连接');
    } finally {
      setLoading({ ...loading, layout: false });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
          AI 内容生成工具
        </h1>
        <p className="text-gray-600 text-center mb-8">
          支持内容生成、内链、SEO 优化和布局代码生成
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 左侧：输入区域 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">输入设置</h2>

            <InputField
              label="关键词"
              value={keywords}
              onChange={setKeywords}
              placeholder="请输入关键词，支持多行"
              type="textarea"
              rows={3}
              required
            />

            <SelectField
              label="内容模板"
              value={templateType}
              onChange={(v) => setTemplateType(v as TemplateType)}
              options={templateOptions}
              required
            />

            <SelectField
              label="生成语言"
              value={language}
              onChange={(v) => setLanguage(v as Language)}
              options={languageOptions}
              required
            />

            <InputField
              label="自定义模版（可选，用于基于搜索的内容生成）"
              value={customTemplate}
              onChange={setCustomTemplate}
              placeholder="例如：\n标题：{{title}}\n引言：{{intro}}\n正文：\n  - 第一部分\n  - 第二部分\n结尾：{{conclusion}}"
              type="textarea"
              rows={5}
            />

            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={useSearchResults}
                  onChange={(e) => setUseSearchResults(e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm font-medium text-gray-700">
                  使用搜索结果（搜索排名前20的文章作为参考）
                </span>
              </label>
              <p className="text-xs text-gray-500 mt-1 ml-6">
                需要配置搜索API（SERP_API_KEY 或 Google Custom Search）
              </p>
            </div>

            <SelectField
              label="内容长度"
              value={contentLength}
              onChange={setContentLength}
              options={lengthOptions}
            />

            <SelectField
              label="输出格式（用于布局代码）"
              value={outputFormat}
              onChange={setOutputFormat}
              options={formatOptions}
            />

            {/* 内链设置 */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                内链设置
              </label>
              <div className="space-y-2 mb-2">
                {internalLinks.map((link, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-2 bg-gray-50 rounded"
                  >
                    <span className="flex-1 text-sm">
                      <strong>{link.keyword}</strong> → {link.url}
                    </span>
                    <button
                      onClick={() => handleRemoveLink(index)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      删除
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newLinkKeyword}
                  onChange={(e) => setNewLinkKeyword(e.target.value)}
                  placeholder="关键词"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
                <input
                  type="text"
                  value={newLinkUrl}
                  onChange={(e) => setNewLinkUrl(e.target.value)}
                  placeholder="URL"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
                <button
                  onClick={handleAddLink}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
                >
                  添加
                </button>
              </div>
            </div>

            {/* 进度显示 */}
            {loading.allInOne && progress.current && (
              <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-800">{progress.current}</span>
                  <span className="text-sm text-blue-600">{progress.percentage}%</span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress.percentage}%` }}
                  />
                </div>
                {progress.completed.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {progress.completed.map((item, index) => (
                      <div key={index} className="flex items-center text-xs text-blue-700">
                        <span className="mr-2">✓</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 操作按钮 */}
            <div className="space-y-2 mt-6">
              <button
                onClick={handleGenerateAll}
                disabled={loading.allInOne || loading.content || loading.research}
                className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-md hover:from-blue-700 hover:to-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold shadow-md"
              >
                {loading.allInOne ? '正在生成...' : '🚀 一键生成所有内容'}
              </button>
              <div className="text-xs text-gray-500 text-center mb-2">
                将自动完成：内容生成 → 内链插入 → SEO优化 → 布局代码生成
              </div>
              <div className="border-t pt-2">
                <p className="text-xs text-gray-500 mb-2 text-center">单独功能：</p>
                <button
                  onClick={handleGenerateContent}
                  disabled={loading.allInOne || loading.content || loading.research}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm"
                >
                  {loading.content ? '生成中...' : '仅生成内容'}
                </button>
                <button
                  onClick={handleGenerateResearchContent}
                  disabled={loading.allInOne || loading.content || loading.research}
                  className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm mt-2"
                >
                  {loading.research ? '搜索并生成中...' : '基于搜索生成内容'}
                </button>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <button
                    onClick={handleGenerateLinks}
                    disabled={loading.allInOne || loading.links || !generatedContent}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm"
                  >
                    {loading.links ? '生成中...' : '生成内链'}
                  </button>
                  <button
                    onClick={handleGenerateSEO}
                    disabled={loading.allInOne || loading.seo || !generatedContent}
                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm"
                  >
                    {loading.seo ? '生成中...' : '生成SEO'}
                  </button>
                </div>
                <button
                  onClick={handleGenerateLayout}
                  disabled={loading.allInOne || loading.layout || !generatedContent}
                  className="w-full px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm mt-2"
                >
                  {loading.layout ? '生成中...' : '生成布局代码'}
                </button>
              </div>
            </div>
          </div>

          {/* 右侧：输出区域 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">生成结果</h2>
              {loading.allInOne && progress.percentage > 0 && (
                <span className="text-xs text-gray-500">进度: {progress.percentage}%</span>
              )}
            </div>

            {searchResults.length > 0 && (
              <div className="mb-6 border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-700">
                    参考文章（共 {searchResults.length} 篇）
                  </h3>
                </div>
                <div className="p-4 bg-white max-h-60 overflow-y-auto">
                  <div className="space-y-2">
                    {searchResults.map((result, index) => (
                      <div key={index} className="text-sm border-b border-gray-100 pb-2 last:border-0">
                        <div className="font-medium text-gray-800">{result.position}. {result.title}</div>
                        <div className="text-xs text-gray-500 truncate">{result.url}</div>
                        {result.snippet && (
                          <div className="text-xs text-gray-600 mt-1 line-clamp-2">{result.snippet}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {generatedContent && !contentWithLinks && (
              <ResultBox
                title="生成内容"
                content={generatedContent}
                format="text"
              />
            )}

            {contentWithLinks && (
              <ResultBox
                title="内容（已添加内链）"
                content={contentWithLinks}
                format="text"
              />
            )}

            {seoInfo && (
              <div className="mb-6 border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-700">SEO 信息</h3>
                </div>
                <div className="p-4 bg-white">
                  <div className="mb-3">
                    <strong className="text-sm text-gray-700">关键词：</strong>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {seoInfo.keywords.map((keyword, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <strong className="text-sm text-gray-700">描述：</strong>
                    <p className="mt-1 text-sm text-gray-800">{seoInfo.description}</p>
                  </div>
                </div>
              </div>
            )}

            {layoutCode && (
              <ResultBox
                title={`布局代码 (${outputFormat.toUpperCase()})${outputFormat === 'html' ? ' - 仅包含 <article> 标签内内容' : ''}`}
                content={layoutCode}
                format={outputFormat === 'html' ? 'text' : 'code'}
                language={outputFormat}
              />
            )}

            {!generatedContent && !contentWithLinks && !seoInfo && !layoutCode && (
              <div className="text-center text-gray-400 py-12">
                生成的内容将显示在这里
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}



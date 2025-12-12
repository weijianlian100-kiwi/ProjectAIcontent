'use client';

import React, { useState } from 'react';

interface ResultBoxProps {
  title: string;
  content: string;
  format?: 'text' | 'code';
  language?: string;
}

export default function ResultBox({
  title,
  content,
  format = 'text',
  language = 'text',
}: ResultBoxProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('复制失败:', error);
    }
  };

  if (!content) {
    return null;
  }

  return (
    <div className="mb-6 border border-gray-200 rounded-lg overflow-hidden">
      <div className="bg-gray-50 px-4 py-2 flex justify-between items-center border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
        <button
          onClick={handleCopy}
          className="text-xs px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          {copied ? '已复制' : '复制'}
        </button>
      </div>
      <div className="p-4 bg-white">
        {format === 'code' ? (
          <pre className="overflow-x-auto">
            <code className={`language-${language}`}>{content}</code>
          </pre>
        ) : (
          <div
            className="prose prose-sm max-w-none text-sm text-gray-800"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        )}
      </div>
    </div>
  );
}





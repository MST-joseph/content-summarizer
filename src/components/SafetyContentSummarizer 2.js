import React, { useState, useRef } from 'react';
import { Upload, FileText, Brain, Shield, AlertTriangle, CheckCircle, Loader, Download, Copy, Check } from 'lucide-react';

const SafetyContentSummarizer = () => {
  const [activeTab, setActiveTab] = useState('file');
  const [textInput, setTextInput] = useState('');
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const fileInputRef = useRef(null);

  // API Gateway URL
  const API_BASE_URL = 'https://q3998olzb5.execute-api.ap-northeast-2.amazonaws.com/dev';

  const copyToClipboard = async (text, index) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000); // 2초 후 아이콘 되돌리기
    } catch (err) {
      console.error('복사 실패:', err);
    }
  };

  const handleFileSelect = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const allowedTypes = ['.vtt', '.pdf', '.txt'];
      const fileExtension = selectedFile.name.toLowerCase().substring(selectedFile.name.lastIndexOf('.'));
      
      if (allowedTypes.includes(fileExtension)) {
        setFile(selectedFile);
        setError(null);
      } else {
        setError('지원되는 파일 형식: .vtt, .pdf, .txt');
        setFile(null);
      }
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile) {
      const allowedTypes = ['.vtt', '.pdf', '.txt'];
      const fileExtension = droppedFile.name.toLowerCase().substring(droppedFile.name.lastIndexOf('.'));
      
      if (allowedTypes.includes(fileExtension)) {
        setFile(droppedFile);
        setError(null);
      } else {
        setError('지원되는 파일 형식: .vtt, .pdf, .txt');
      }
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const processFile = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(e);
      reader.readAsText(file);
    });
  };

  const handleSubmit = async () => {
    if (!textInput.trim() && !file) {
      setError('텍스트를 입력하거나 파일을 업로드해주세요.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      let response;

      if (activeTab === 'text' && textInput.trim()) {
        // 텍스트 직접 입력 API 호출
        response = await fetch(`${API_BASE_URL}/summarize`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text_input: textInput.trim()
          })
        });
      } else if (activeTab === 'file' && file) {
        // 파일 업로드의 경우 두 단계로 처리
        // 1. 파일 업로드
        const fileContent = await processFile(file);
        const uploadResponse = await fetch(`${API_BASE_URL}/upload`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            file_content: fileContent,
            file_name: file.name,
            file_type: file.type || 'text/plain'
          })
        });

        if (!uploadResponse.ok) {
          throw new Error('파일 업로드 실패');
        }

        const uploadResult = await uploadResponse.json();
        
        // 2. 업로드된 파일로 요약 생성
        response = await fetch(`${API_BASE_URL}/summarize`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            file_key: uploadResult.file_key
          })
        });
      }

      if (!response.ok) {
        throw new Error(`API 호출 실패: ${response.status}`);
      }

      const result = await response.json();
      setResult(result);
    } catch (err) {
      setError('요약 생성 중 오류가 발생했습니다. 다시 시도해주세요.');
      console.error('API 호출 오류:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMindMap = (mindmap) => {
    if (!mindmap) return null;

    return (
      <div className="bg-gradient-to-br from-slate-50 to-indigo-50 p-6 rounded-lg">
        <div className="text-center mb-6">
          <div className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-full font-semibold text-lg shadow-lg">
            {mindmap.central_topic}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mindmap.branches?.map((branch, index) => (
            <div key={index} className="bg-white rounded-lg p-4 shadow-md border border-slate-200">
              <h4 className="font-semibold text-indigo-700 mb-2 text-center">{branch.topic}</h4>
              <ul className="space-y-1">
                {branch.subtopics?.map((subtopic, subIndex) => (
                  <li key={subIndex} className="text-sm text-slate-600 flex items-center">
                    <div className="w-2 h-2 bg-indigo-400 rounded-full mr-2"></div>
                    {subtopic}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50" style={{fontFamily: 'Inter, system-ui, -apple-system, sans-serif'}}>
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-slate-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center">
            {/* Logo - 이미지로 교체 가능 */}
            <img 
              src="./public/mzc.png" 
              alt="로고"
              className="w-8 h-8 mr-3"
            />
            {/* 아이콘을 사용하려면 아래 주석을 해제하고 위의 img 태그를 주석처리하세요 */}
            {/* <Shield className="w-8 h-8 text-indigo-600 mr-3" /> */}
            <h1 className="text-3xl font-bold text-slate-800">콘텐츠 요약 시스템</h1>
          </div>
          <p className="text-center text-slate-600 mt-2">AI 기반 자료 분석 및 요약 서비스</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Input Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-slate-200">
          <h2 className="text-xl font-semibold text-slate-800 mb-6 flex items-center">
            <Brain className="w-5 h-5 text-indigo-600 mr-2" />
            콘텐츠 입력
          </h2>

          {/* Tab Navigation */}
          <div className="flex mb-6 bg-slate-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('text')}
              className={`flex-1 py-2.5 px-4 rounded-md font-medium text-sm transition-colors ${
                activeTab === 'text'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-indigo-600'
              }`}
            >
              <FileText className="w-4 h-4 inline mr-2" />
              직접 입력
            </button>
            <button
              onClick={() => setActiveTab('file')}
              className={`flex-1 py-2.5 px-4 rounded-md font-medium text-sm transition-colors ${
                activeTab === 'file'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-indigo-600'
              }`}
            >
              <Upload className="w-4 h-4 inline mr-2" />
              파일 업로드
            </button>
          </div>

          {/* Text Input Tab */}
          {activeTab === 'text' && (
            <div className="space-y-4">
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="텍스트를 입력해주세요..."
                className="w-full h-32 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-sm"
              />
            </div>
          )}

          {/* File Upload Tab */}
          {activeTab === 'file' && (
            <div className="space-y-4">
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-indigo-500 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                <p className="text-slate-600 mb-2 text-sm">
                  파일을 드래그하여 놓거나 클릭하여 선택하세요
                </p>
                <p className="text-xs text-slate-500">
                  지원 형식: .vtt, .pdf, .txt (최대 10MB)
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".vtt,.pdf,.txt"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
              
              {file && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 flex items-center">
                  <CheckCircle className="w-4 h-4 text-emerald-600 mr-2" />
                  <span className="text-emerald-800 text-sm">선택된 파일: {file.name}</span>
                </div>
              )}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center mt-4">
              <AlertTriangle className="w-4 h-4 text-red-600 mr-2" />
              <span className="text-red-800 text-sm">{error}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={isLoading || (!textInput.trim() && !file)}
            className="w-full mt-6 bg-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-indigo-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center text-sm"
          >
            {isLoading ? (
              <>
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                분석 중...
              </>
            ) : (
              <>
                <Brain className="w-4 h-4 mr-2" />
                AI 요약 생성
              </>
            )}
          </button>
        </div>

        {/* Results Section */}
        {result && (
          <div className="space-y-6">
            {/* Title */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200 relative">
              <button
                onClick={() => copyToClipboard(result.title, 'title')}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 transition-colors"
                title="제목 복사"
              >
                {copiedIndex === 'title' ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                <FileText className="w-5 h-5 text-indigo-600 mr-2" />
                제목
              </h3>
              <h2 className="text-xl font-bold text-slate-800 pr-10 text-left">{result.title}</h2>
            </div>

            {/* Keywords */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200 relative">
              <button
                onClick={() => copyToClipboard(result.keywords?.map(k => `#${k}`).join(' '), 'keywords')}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 transition-colors"
                title="키워드 복사"
              >
                {copiedIndex === 'keywords' ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                <Brain className="w-5 h-5 text-indigo-600 mr-2" />
                키워드
              </h3>
              <div className="flex flex-wrap gap-2 pr-10 justify-start">
                {result.keywords?.map((keyword, index) => (
                  <span
                    key={index}
                    className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    #{keyword}
                  </span>
                ))}
              </div>
            </div>

            {/* Core Summary Q&A */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200 relative">
              <button
                onClick={() => copyToClipboard(`${result.core_summary?.main_question}\n${result.core_summary?.main_answer}\n\n${result.core_summary?.safety_question}\n${result.core_summary?.safety_points?.map(p => `• ${p}`).join('\n')}`, 'core_summary')}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 transition-colors"
                title="핵심 요약 복사"
              >
                {copiedIndex === 'core_summary' ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
              
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                <Shield className="w-5 h-5 text-indigo-600 mr-2" />
                핵심 요약
              </h3>
              
              {/* Main Question */}
              <div className="mb-6 pr-10 text-left">
                <div className="flex items-start mb-3">
                  <span className="text-red-500 mr-2 mt-0.5">📌</span>
                  <h4 className="font-semibold text-slate-800">
                    {result.core_summary?.main_question}
                  </h4>
                </div>
                <p className="text-slate-700 text-sm leading-relaxed ml-6">
                  {result.core_summary?.main_answer}
                </p>
              </div>

              {/* Safety Question */}
              <div className="pr-10 text-left">
                <div className="flex items-start mb-3">
                  <span className="text-blue-500 mr-2 mt-0.5">💡</span>
                  <h4 className="font-semibold text-slate-800">
                    {result.core_summary?.safety_question}
                  </h4>
                </div>
                <ul className="ml-6 space-y-2">
                  {result.core_summary?.safety_points?.map((point, index) => (
                    <li key={index} className="text-slate-700 text-sm flex items-start">
                      <span className="text-slate-400 mr-2 mt-0.5">•</span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Structured Summary */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200 relative">
              <button
                onClick={() => copyToClipboard(`${result.structured_summary?.introduction}\n\n${result.structured_summary?.key_topics?.map(topic => `${topic.number}. ${topic.title}\n${topic.content}\n${topic.sub_points?.map(p => `• ${p}`).join('\n')}`).join('\n\n')}`, 'structured_summary')}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 transition-colors"
                title="정리 내용 복사"
              >
                {copiedIndex === 'structured_summary' ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
              
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                <CheckCircle className="w-5 h-5 text-indigo-600 mr-2" />
                세부 요약
              </h3>
              
              {/* Introduction */}
              <div className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200 text-left">
                <p className="text-slate-700 text-sm leading-relaxed">
                  {result.structured_summary?.introduction}
                </p>
              </div>

              {/* Key Topics */}
              <div className="space-y-4">
                {result.structured_summary?.key_topics?.map((topic, index) => (
                  <div key={index} className="text-left">
                    <h4 className="font-semibold text-slate-800 mb-3 flex items-center">
                      <span className="w-6 h-6 bg-indigo-600 text-white rounded-full text-xs flex items-center justify-center mr-3">
                        {topic.number}
                      </span>
                      {topic.title}
                    </h4>
                    
                    {/* Topic Content */}
                    <div className="ml-9 mb-3 text-left">
                      <p className="text-slate-700 text-sm leading-relaxed mb-3">
                        {topic.content}
                      </p>
                      
                      {/* Sub Points */}
                      <ul className="space-y-1">
                        {topic.sub_points?.map((point, pointIndex) => (
                          <li key={pointIndex} className="text-slate-600 text-sm flex items-start">
                            <span className="text-indigo-500 mr-2 mt-0.5 text-xs">•</span>
                            <span className="text-slate-600">
                              {point}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Banner Section */}
      <section className="bg-white py-8 mt-16 border-t border-slate-200">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Banner 1 */}
            <div className="flex justify-center">
              <a 
                href="https://www.megazone.com" 
                className="block rounded-lg overflow-hidden hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-xl"
                target="_blank" 
                rel="noopener noreferrer"
              >
                <img 
                  src="https://via.placeholder.com/400x200/3b82f6/ffffff?text=MegaZone+Cloud" 
                  alt="MegaZone Cloud 배너"
                  className="w-full h-auto"
                />
              </a>
            </div>
            
            {/* Banner 2 */}
            <div className="flex justify-center">
              <a 
                href="https://aws.amazon.com" 
                className="block rounded-lg overflow-hidden hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-xl"
                target="_blank" 
                rel="noopener noreferrer"
              >
                <img 
                  src="https://via.placeholder.com/400x200/f59e0b/ffffff?text=AWS+Services" 
                  alt="AWS Services 배너"
                  className="w-full h-auto"
                />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-slate-300">
            © Copyright 2025. MEGAZONECLOUD Corp. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default SafetyContentSummarizer;
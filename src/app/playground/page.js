'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Loader2, Search, KeyRound } from 'lucide-react';

export default function Playground() {
  const [apiKeys, setApiKeys] = useState([]);
  const [inputApiKey, setInputApiKey] = useState('');
  const [checkResult, setCheckResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingKeys, setIsLoadingKeys] = useState(true);

  // API 키 목록 로딩
  useEffect(() => {
    const fetchKeys = async () => {
      setIsLoadingKeys(true);
      try {
        const response = await fetch('/api/keys');
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'API 키를 불러오는데 실패했습니다.');
        }

        if (Array.isArray(data)) {
          const formattedData = data.map(key => ({ ...key, value: key.key_value, type: key.key_type }));
          setApiKeys(formattedData);
        } else {
          setApiKeys([]);
        }
      } catch (error) {
        console.error("Failed to fetch API keys:", error);
        setApiKeys([]);
      }
      setIsLoadingKeys(false);
    };
    fetchKeys();
  }, []);

  // API 키 확인
  const checkApiKey = () => {
    if (!inputApiKey.trim()) {
      alert('확인할 API 키를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setCheckResult(null);

    // 키 목록에서 입력된 키 찾기
    const foundKey = apiKeys.find(key => key.value === inputApiKey.trim());

    setTimeout(() => {
      if (foundKey) {
        setCheckResult({
          success: true,
          message: '유효한 API 키입니다.',
          details: `이 키는 '${foundKey.name}' 이름으로 저장되어 있습니다. (타입: ${foundKey.type})`,
        });
      } else {
        setCheckResult({
          success: false,
          message: '저장되지 않은 API 키입니다.',
          details: '입력한 키가 맞는지 확인하거나, 대시보드에서 키를 추가해주세요.',
        });
      }
      setIsLoading(false);
    }, 500); // 인위적인 딜레이 추가
  };

  return (
    <div className="font-sans text-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">API Key Playground</h1>
          <p className="text-gray-600">입력한 API 키가 유효한지(저장되어 있는지) 확인합니다.</p>
        </div>

        {/* API 키 입력 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">API 키 확인</h2>
          
          {isLoadingKeys ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="animate-spin h-6 w-6 text-indigo-600" />
              <span className="ml-2 text-gray-600">저장된 키 목록을 불러오는 중...</span>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label htmlFor="api-key-input" className="block text-sm font-medium text-gray-700 mb-2">
                  API 키
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="api-key-input"
                    type="text"
                    value={inputApiKey}
                    onChange={(e) => setInputApiKey(e.target.value)}
                    placeholder="API 키를 여기에 붙여넣으세요..."
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
              
              <button
                onClick={checkApiKey}
                disabled={isLoading}
                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                    확인 중...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    API 키 확인
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* 확인 결과 */}
        {checkResult && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">확인 결과</h2>
            
            <div className={`p-4 rounded-lg border ${
              checkResult.success 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-start">
                {checkResult.success ? (
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 mr-3" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600 mt-0.5 mr-3" />
                )}
                <div className="flex-1">
                  <h3 className={`font-medium ${
                    checkResult.success ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {checkResult.message}
                  </h3>
                  <p className={`mt-1 text-sm ${
                    checkResult.success ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {checkResult.details}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 사용법 안내 */}
        <div className="bg-blue-50 rounded-lg border border-blue-200 p-4 sm:p-6 mt-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">사용법</h3>
          <ul className="text-blue-800 space-y-2 text-sm">
            <li>• 가지고 있는 API 키를 입력창에 붙여넣습니다.</li>
            <li>• "API 키 확인" 버튼을 클릭합니다.</li>
            <li>• 입력한 키가 대시보드에 저장된 키 목록에 있는지 확인하고 결과를 알려줍니다.</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 
'use client';

import { useState, useEffect } from 'react';
import { Eye, EyeOff, Copy, Edit, Trash2, Plus, X } from 'lucide-react';

export default function Dashboard() {
  const [apiKeys, setApiKeys] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [keyName, setKeyName] = useState('');
  const [keyValue, setKeyValue] = useState('');
  
  const [editingKey, setEditingKey] = useState(null);
  const [keyToDelete, setKeyToDelete] = useState(null);
  const [copiedKeyId, setCopiedKeyId] = useState(null);

  // 데이터 로딩
  useEffect(() => {
    const fetchKeys = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/keys');
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'API 키를 불러오는데 실패했습니다.');
        }

        if (Array.isArray(data)) {
          // Supabase에서 key_value로 오므로 value로 매핑
          const formattedData = data.map(key => ({ ...key, value: key.key_value, type: key.key_type }));
          setApiKeys(formattedData);
        } else {
          console.error("API did not return an array:", data);
          setApiKeys([]);
        }
      } catch (error) {
        console.error("Failed to fetch API keys:", error);
        setApiKeys([]); // 에러 발생 시 빈 배열로 초기화
      }
      setIsLoading(false);
    };
    fetchKeys();
  }, []);
  
  const openModalForNew = () => {
    setEditingKey(null);
    setKeyName('');
    setKeyValue('');
    setIsModalOpen(true);
  };

  const openModalForEdit = (key) => {
    setEditingKey(key);
    setKeyName(key.name);
    setKeyValue(key.value);
    setIsModalOpen(true);
  };

  const openDeleteConfirmation = (key) => {
    setKeyToDelete(key);
    setIsDeleteModalOpen(true);
  };
  
  // 키 추가 또는 수정
  const handleSaveKey = async () => {
    if (!keyName.trim() || !keyValue.trim()) {
      alert('키 이름과 값을 모두 입력해주세요.');
      return;
    }

    const keyData = {
      name: keyName.trim(),
      value: keyValue.trim(),
      type: 'dev' // 기본값
    };

    try {
      let response;
      const url = editingKey ? `/api/keys/${editingKey.id}` : '/api/keys';
      const method = editingKey ? 'PUT' : 'POST';

      response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(keyData),
      });

      const resultData = await response.json();

      if (!response.ok) {
        throw new Error(resultData.error || '키 저장에 실패했습니다.');
      }
      
      const formattedKey = { ...resultData, value: resultData.key_value, type: resultData.key_type };
      
      if (editingKey) {
        setApiKeys(apiKeys.map(k => (k.id === formattedKey.id ? formattedKey : k)));
      } else {
        setApiKeys([formattedKey, ...apiKeys]);
      }

    } catch(error) {
      console.error("Failed to save API key:", error);
      alert(error.message || '키 저장에 실패했습니다.');
    }
    
    setIsModalOpen(false);
  };

  // 키 삭제
  const handleConfirmDelete = async () => {
    if (!keyToDelete) return;
    try {
      const response = await fetch(`/api/keys/${keyToDelete.id}`, { method: 'DELETE' });
      
      if (!response.ok) {
          const errorText = await response.text();
          try {
              const errorJson = JSON.parse(errorText);
              throw new Error(errorJson.error || '키 삭제에 실패했습니다.');
          } catch(e) {
              throw new Error(errorText || '키 삭제에 실패했습니다.');
          }
      }
      
      setApiKeys(apiKeys.filter(key => key.id !== keyToDelete.id));
    } catch (error) {
      console.error("Failed to delete API key:", error);
      alert(error.message || '키 삭제에 실패했습니다.');
    }
    setIsDeleteModalOpen(false);
    setKeyToDelete(null);
  };

  // 키 값 복사
  const copyToClipboard = (key) => {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(key.value).then(() => {
        setCopiedKeyId(key.id);
        setTimeout(() => setCopiedKeyId(null), 2000);
      }).catch(err => {
        console.error('클립보드 복사 실패:', err);
        alert('클립보드에 복사할 수 없습니다.');
      });
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = key.value;
      textArea.style.position = 'fixed';
      textArea.style.top = '-9999px';
      textArea.style.left = '-9999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        setCopiedKeyId(key.id);
        setTimeout(() => setCopiedKeyId(null), 2000);
      } catch (err) {
        console.error('대체 복사 방법 실패:', err);
        alert('클립보드에 복사할 수 없습니다.');
      }
      document.body.removeChild(textArea);
    }
  };

  // 키 값 가시성 토글
  const toggleVisibility = (id) => {
    const updatedKeys = apiKeys.map(key => 
      key.id === id ? { ...key, isVisible: !key.isVisible } : key
    );
    setApiKeys(updatedKeys);
  };

  const maskKey = (value) => {
    if(!value) return '';
    const lastDashIndex = value.lastIndexOf('-');
    if (lastDashIndex !== -1) {
      const prefix = value.substring(0, lastDashIndex + 1);
      return prefix + '*'.repeat(32);
    }
    if (value.length > 8) {
        return value.substring(0, 4) + '*'.repeat(value.length - 8) + value.substring(value.length - 4);
    }
    return '*'.repeat(value.length);
  };

  return (
    <div className="font-sans text-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center gap-4 mb-4">
          <h1 className="text-2xl font-semibold">API Keys</h1>
          <button
            onClick={openModalForNew}
            className="flex items-center justify-center w-9 h-9 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 text-gray-600"
          >
            <Plus size={18} />
          </button>
        </div>
        <p className="text-gray-600 mb-8">
          The key is used to authenticate your requests to the Research API. To learn more, see the <a href="#" className="text-blue-600 underline">documentation page</a>.
        </p>

        <div className="border border-gray-200 rounded-lg overflow-x-auto">
          <table className="w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usage</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Key</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Options</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    Loading API keys...
                  </td>
                </tr>
              ) : apiKeys.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    No API keys found.
                  </td>
                </tr>
              ) : (
                apiKeys.map(key => (
                  <tr key={key.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{key.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="px-2 py-1 text-xs font-semibold text-gray-600 bg-gray-100 border border-gray-200 rounded-md">
                        {key.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{key.usage}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="font-mono bg-white border border-gray-300 rounded-lg px-3 py-1.5 inline-flex items-center gap-2">
                        <span>{key.isVisible ? key.value : maskKey(key.value)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-4 text-gray-500">
                        <button onClick={() => toggleVisibility(key.id)} className="hover:text-gray-900">
                          {key.isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                        <button onClick={() => copyToClipboard(key)} className="hover:text-gray-900 relative">
                          <Copy size={16} />
                          {copiedKeyId === key.id && (
                            <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded">
                              Copied!
                            </span>
                          )}
                        </button>
                        <button onClick={() => openModalForEdit(key)} className="hover:text-gray-900">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => openDeleteConfirmation(key)} className="hover:text-red-600">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">{editingKey ? 'Edit API Key' : 'Create API Key'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-800">
                <X size={24} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label htmlFor="keyName" className="block text-sm font-medium text-gray-700 mb-1">Key Name</label>
                <input
                  type="text"
                  id="keyName"
                  value={keyName}
                  onChange={(e) => setKeyName(e.target.value)}
                  placeholder="e.g. My App"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="keyValue" className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
                <input
                  type="text"
                  id="keyValue"
                  value={keyValue}
                  onChange={(e) => setKeyValue(e.target.value)}
                  placeholder="Paste your API key here"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>
            </div>
            <div className="mt-8 flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveKey}
                className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
              >
                {editingKey ? 'Save Changes' : 'Create Key'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 삭제 확인 모달 */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Delete API Key</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete the key <strong className="text-gray-900">{keyToDelete?.name}</strong>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 
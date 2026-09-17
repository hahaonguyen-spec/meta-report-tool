import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, Bot, Send, Copy, RefreshCw, AlertCircle, 
  MessageSquare, TrendingUp, Check, ExternalLink, ShieldCheck, ChevronRight 
} from 'lucide-react';
import { analyzeMarketingData, chatWithGeminiAdvisor } from '../services/geminiService';

export default function GeminiAdvisorModal({ 
  isOpen, 
  onClose, 
  apiKey, 
  onOpenSettings, 
  marketingContext 
}) {
  const [activeTab, setActiveTab] = useState('audit'); // 'audit' | 'chat'
  
  // Audit State
  const [auditResult, setAuditResult] = useState('');
  const [loadingAudit, setLoadingAudit] = useState(false);
  const [auditError, setAuditError] = useState(null);
  const [copiedAudit, setCopiedAudit] = useState(false);

  // Chat State
  const [messages, setMessages] = useState([
    {
      id: 'msg_welcome',
      role: 'assistant',
      text: 'Xin chào! Tôi là Trợ lý AI Phân Tích Marketing & CRM (Powered by Google Gemini). Tôi đã đọc toàn bộ số liệu chiến dịch và phễu khách hàng của bạn. Bạn muốn tôi hỗ trợ tối ưu chiến lược, giảm chi phí CPL hay xử lý lời từ chối của khách hàng nào?'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [loadingChat, setLoadingChat] = useState(false);
  const [chatError, setChatError] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Auto-run audit when modal opens if no audit exists yet and apiKey is present
  useEffect(() => {
    if (isOpen && apiKey && !auditResult && !loadingAudit) {
      handleRunAudit();
    }
  }, [isOpen, apiKey]);

  if (!isOpen) return null;

  const handleRunAudit = async () => {
    if (!apiKey) {
      setAuditError('Chưa cấu hình Google Gemini API Key. Vui lòng nhấn vào "Cài Đặt" để nhập API Key.');
      return;
    }

    setLoadingAudit(true);
    setAuditError(null);

    try {
      const result = await analyzeMarketingData(apiKey, marketingContext);
      setAuditResult(result);
    } catch (err) {
      setAuditError(err.message || 'Lỗi trong quá trình phân tích số liệu với Gemini.');
    } finally {
      setLoadingAudit(false);
    }
  };

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim() || loadingChat) return;

    if (!apiKey) {
      setChatError('Chưa cấu hình Google Gemini API Key. Vui lòng mở Cài Đặt để nhập API Key.');
      return;
    }

    const userText = inputMessage.trim();
    setInputMessage('');
    setChatError(null);

    const userMsgObj = {
      id: `usr_${Date.now()}`,
      role: 'user',
      text: userText
    };

    setMessages(prev => [...prev, userMsgObj]);
    setLoadingChat(true);

    try {
      const reply = await chatWithGeminiAdvisor(
        apiKey,
        messages,
        userText,
        marketingContext
      );

      setMessages(prev => [
        ...prev,
        {
          id: `ai_${Date.now()}`,
          role: 'assistant',
          text: reply
        }
      ]);
    } catch (err) {
      setChatError(err.message || 'Lỗi khi gửi tin nhắn tới Gemini.');
    } finally {
      setLoadingChat(false);
    }
  };

  const handleQuickQuestion = (q) => {
    setInputMessage(q);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedAudit(true);
    setTimeout(() => setCopiedAudit(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-3 sm:p-6">
      <div className="bg-[#0a0f1c] border border-white/15 rounded-3xl w-full max-w-4xl shadow-2xl relative max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-white/10 bg-gradient-to-r from-purple-900/30 via-[#0a0f1c] to-blue-900/30 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-purple-500/25 flex-shrink-0">
              <Sparkles className="w-6 h-6 text-amber-200" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Trợ Lý Chiến Lược Marketing & CRM (Gemini AI)
              </h2>
              <p className="text-xs text-gray-400">
                Phân tích điểm nghẽn, đề xuất điều chỉnh chiến dịch và kịch bản tăng tỷ lệ chốt nạp tiền
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors text-lg"
          >
            ✕
          </button>
        </div>

        {/* Missing API Key Warning */}
        {!apiKey && (
          <div className="bg-amber-500/10 border-b border-amber-500/20 px-5 py-3 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-amber-300">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>Chưa tìm thấy Gemini API Key. Bạn cần nhập API Key để kích hoạt trợ lý AI thông minh.</span>
            </div>
            <button
              type="button"
              onClick={() => { onClose(); onOpenSettings(); }}
              className="px-3 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 font-bold border border-amber-500/30 transition-all flex-shrink-0 cursor-pointer"
            >
              Mở Cài Đặt
            </button>
          </div>
        )}

        {/* Tab Switcher */}
        <div className="px-5 py-2.5 bg-black/30 border-b border-white/5 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('audit')}
              className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all ${
                activeTab === 'audit'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              Báo Cáo Chiến Lược Tự Động
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all ${
                activeTab === 'chat'
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Trò Chuyện Với Trợ Lý AI
            </button>
          </div>

          {activeTab === 'audit' && (
            <div className="flex items-center gap-2">
              {auditResult && (
                <button
                  type="button"
                  onClick={() => copyToClipboard(auditResult)}
                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 flex items-center gap-1.5 transition-all text-[11px]"
                >
                  <Copy className="w-3.5 h-3.5" />
                  {copiedAudit ? 'Đã sao chép' : 'Sao chép'}
                </button>
              )}
              <button
                type="button"
                onClick={handleRunAudit}
                disabled={loadingAudit}
                className="px-3.5 py-1.5 rounded-lg bg-[#33CCFF]/15 hover:bg-[#33CCFF]/25 border border-[#33CCFF]/30 text-[#33CCFF] font-semibold flex items-center gap-1.5 transition-all disabled:opacity-40 text-[11px] cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingAudit ? 'animate-spin' : ''}`} />
                {loadingAudit ? 'Đang phân tích...' : 'Phân Tích Lại'}
              </button>
            </div>
          )}
        </div>

        {/* Tab Body */}
        <div className="p-5 overflow-y-auto flex-1 text-xs">
          {activeTab === 'audit' ? (
            /* TAB 1: STRATEGIC AUDIT REPORT */
            <div className="space-y-4">
              {loadingAudit ? (
                <div className="py-16 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full border-2 border-purple-400 border-t-transparent animate-spin mx-auto" />
                  <p className="font-semibold text-white text-sm">Gemini AI đang tổng hợp số liệu & phân tích phễu...</p>
                  <p className="text-gray-400 text-xs">Đo lường drop-off rate, đánh giá CPL, CAC và thiết lập 5 giải pháp điều chỉnh tối ưu</p>
                </div>
              ) : auditError ? (
                <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-300 space-y-2">
                  <div className="flex items-center gap-2 font-bold">
                    <AlertCircle className="w-4 h-4" />
                    <span>Lỗi phân tích:</span>
                  </div>
                  <p>{auditError}</p>
                </div>
              ) : auditResult ? (
                <div className="bg-[#070b14] border border-white/10 rounded-2xl p-6 shadow-inner relative leading-relaxed text-gray-200 whitespace-pre-wrap font-sans text-xs">
                  {auditResult}
                </div>
              ) : (
                <div className="py-16 text-center space-y-3 text-gray-400">
                  <Bot className="w-12 h-12 mx-auto text-gray-500" />
                  <p className="text-sm font-semibold text-white">Chưa có kết quả phân tích</p>
                  <p className="text-xs">Bấm nút "Phân Tích Lại" ở góc trên để khởi động Gemini AI Audit.</p>
                </div>
              )}
            </div>
          ) : (
            /* TAB 2: INTERACTIVE AI CHATBOT */
            <div className="flex flex-col h-[520px]">
              {/* Messages Container */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-2 mb-3">
                {messages.map(m => (
                  <div 
                    key={m.id} 
                    className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {m.role === 'assistant' && (
                      <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white flex-shrink-0 mt-0.5">
                        <Sparkles className="w-3.5 h-3.5" />
                      </div>
                    )}
                    <div className={`p-3.5 rounded-2xl max-w-[80%] whitespace-pre-wrap leading-relaxed ${
                      m.role === 'user' 
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-br-none' 
                        : 'bg-white/5 border border-white/10 text-gray-200 rounded-bl-none'
                    }`}>
                      {m.text}
                    </div>
                  </div>
                ))}
                {loadingChat && (
                  <div className="flex gap-3 justify-start items-center text-gray-400 text-xs">
                    <div className="w-7 h-7 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-300 animate-pulse">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                    <span>Gemini đang soạn câu trả lời...</span>
                  </div>
                )}
                {chatError && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs">
                    {chatError}
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Questions Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto py-1 mb-2 text-[11px] no-scrollbar">
                <span className="text-gray-500 font-semibold flex-shrink-0">Gợi ý:</span>
                <button
                  type="button"
                  onClick={() => handleQuickQuestion("Làm sao để giảm CPL cho chiến dịch Facebook Ads?")}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 whitespace-nowrap"
                >
                  📉 Cách giảm CPL Facebook Ads?
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickQuestion("Tại sao tỷ lệ từ Tư vấn sang Mở tài khoản lại rớt nhiều?")}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 whitespace-nowrap"
                >
                  🔍 Lý do khách rớt ở bước KYC?
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickQuestion("Gợi ý kịch bản xử lý khi khách bảo 'Để anh nghiên cứu thêm'?")}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 whitespace-nowrap"
                >
                  💬 Kịch bản xử lý từ chối?
                </button>
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Hỏi Gemini về cách tối ưu chi phí, nâng cao tỷ lệ chốt đơn..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  className="flex-1 bg-[#070b14] border border-white/15 rounded-2xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#33CCFF]"
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim() || loadingChat}
                  className="px-5 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-2xl text-xs flex items-center gap-1.5 shadow-md hover:opacity-90 disabled:opacity-40 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" /> Gửi
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

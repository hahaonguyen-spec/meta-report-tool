import React from 'react';
import { 
  X, 
  ExternalLink, 
  ThumbsUp, 
  MessageCircle, 
  Share2, 
  Globe, 
  Sparkles, 
  Users, 
  DollarSign, 
  Target, 
  Award,
  Layers
} from 'lucide-react';

export default function AdPostDetailModal({
  isOpen,
  adPost,
  leads = [],
  onClose,
  onSelectLead
}) {
  if (!isOpen || !adPost) return null;

  // Tìm các leads trong CRM đến từ chiến dịch / post này
  const matchingLeads = leads.filter(l => 
    l.campaign && adPost.campaignName && (
      l.campaign.toLowerCase().includes(adPost.campaignName.toLowerCase()) ||
      adPost.campaignName.toLowerCase().includes(l.campaign.toLowerCase())
    )
  );

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-[#0a0f1c] border border-white/15 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">
                  Chi Tiết Bài Post Chạy Quảng Cáo (Ad Creative)
                </h2>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                  adPost.status === 'ACTIVE' 
                    ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' 
                    : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                }`}>
                  {adPost.status || 'ACTIVE'}
                </span>
              </div>
              <p className="text-xs text-gray-400">
                Chiến dịch: <span className="text-[#33CCFF] font-medium">{adPost.campaignName}</span> • ID Bài viết: <code className="text-gray-300">{adPost.postId || adPost.id}</code>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {adPost.permalinkUrl && (
              <a
                href={adPost.permalinkUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded-xl text-blue-300 text-xs font-semibold transition-colors"
                title="Xem trực tiếp trên Facebook"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Mở Trên Facebook
              </a>
            )}
            <button 
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs custom-scrollbar">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white/[0.02] border border-white/10 rounded-xl p-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#33CCFF]/10 text-[#33CCFF] flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase">Leads Thu Về</p>
                <p className="text-base font-bold text-white font-mono">{adPost.metrics?.leadsCount || matchingLeads.length || 0}</p>
              </div>
            </div>

            <div className="bg-white/[0.02] border border-white/10 rounded-xl p-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase">Chi Phí Đã Chạy</p>
                <p className="text-base font-bold text-emerald-400 font-mono">${(adPost.metrics?.spend || 0).toLocaleString()}</p>
              </div>
            </div>

            <div className="bg-white/[0.02] border border-white/10 rounded-xl p-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
                <Target className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase">Giá Mỗi Lead (CPL)</p>
                <p className="text-base font-bold text-purple-300 font-mono">${adPost.metrics?.cpl || '8.5'}</p>
              </div>
            </div>

            <div className="bg-white/[0.02] border border-white/10 rounded-xl p-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-pink-500/10 text-pink-400 flex items-center justify-center">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase">Tương Tác Xã Hội</p>
                <p className="text-base font-bold text-pink-300 font-mono">{((adPost.metrics?.reactions || 0) + (adPost.metrics?.comments || 0)).toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Main Content Layout: Left = Facebook Feed Mockup, Right = Target Audience & Lead List */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Facebook Feed Card Mockup */}
            <div className="lg:col-span-7 bg-[#0c1222] border border-white/15 rounded-2xl p-4 shadow-xl flex flex-col space-y-3.5">
              {/* Facebook Page Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img 
                    src={adPost.pageAvatar || 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=120&h=120&fit=crop'} 
                    alt={adPost.pageName} 
                    className="w-10 h-10 rounded-full border border-white/10 object-cover"
                  />
                  <div>
                    <h4 className="font-bold text-white text-xs">{adPost.pageName || 'Fanpage Doanh Nghiệp'}</h4>
                    <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
                      <span>Được tài trợ (Sponsored)</span>
                      <span>•</span>
                      <Globe className="w-2.5 h-2.5 text-gray-400" />
                    </div>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-mono">
                  Meta Ad
                </span>
              </div>

              {/* Post Caption / Message */}
              <div className="text-gray-200 text-xs whitespace-pre-line leading-relaxed font-normal">
                {adPost.message}
              </div>

              {/* Image / Video Creative Banner */}
              {adPost.imageUrl && (
                <div className="rounded-xl overflow-hidden border border-white/10 relative group bg-black/40">
                  <img 
                    src={adPost.imageUrl} 
                    alt={adPost.headline} 
                    className="w-full max-h-72 object-cover object-center"
                  />
                  {adPost.callToAction && (
                    <div className="p-3 bg-[#0a0f1c] border-t border-white/10 flex items-center justify-between">
                      <div className="truncate pr-2">
                        <p className="text-[10px] text-gray-400 uppercase truncate">metareport.internal</p>
                        <p className="font-bold text-white text-xs truncate">{adPost.headline}</p>
                      </div>
                      <span className="px-3 py-1.5 bg-[#33CCFF] hover:bg-[#33CCFF]/90 text-black font-bold rounded-lg text-xs flex-shrink-0">
                        {adPost.callToAction.split(' ')[0]}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Social Interactions bar */}
              <div className="flex items-center justify-between pt-2 border-t border-white/10 text-[11px] text-gray-400">
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center text-white text-[9px]">
                    <ThumbsUp className="w-2.5 h-2.5" />
                  </div>
                  <span>{(adPost.metrics?.reactions || 1200).toLocaleString()} lượt thích</span>
                </div>
                <div className="flex items-center gap-3">
                  <span>{(adPost.metrics?.comments || 180).toLocaleString()} bình luận</span>
                  <span>{(adPost.metrics?.shares || 45).toLocaleString()} chia sẻ</span>
                </div>
              </div>

              {/* Social Action Buttons */}
              <div className="grid grid-cols-3 gap-2 pt-1 border-t border-white/5 text-gray-400 text-center font-medium">
                <div className="py-1.5 hover:bg-white/5 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer">
                  <ThumbsUp className="w-3.5 h-3.5" /> Thích
                </div>
                <div className="py-1.5 hover:bg-white/5 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer">
                  <MessageCircle className="w-3.5 h-3.5" /> Bình luận
                </div>
                <div className="py-1.5 hover:bg-white/5 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer">
                  <Share2 className="w-3.5 h-3.5" /> Chia sẻ
                </div>
              </div>
            </div>

            {/* Right: Targeting Audience & Leads from this ad */}
            <div className="lg:col-span-5 space-y-4">
              {/* Target Audience Card */}
              <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-4 space-y-2">
                <h4 className="font-bold text-white flex items-center gap-2 text-xs">
                  <Target className="w-4 h-4 text-amber-400" />
                  Chân Dung Đối Tượng Nhắm Tới (Targeting)
                </h4>
                <p className="text-gray-300 text-[11px] leading-relaxed">
                  {adPost.targetAudience || 'Khách hàng quan tâm tài chính, đầu tư, giao dịch ngoại hối và các chương trình ưu đãi vốn.'}
                </p>
                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px]">
                  <span className="text-gray-400">Độ tuổi & Khu vực:</span>
                  <span className="text-white font-medium">25 - 45 tuổi, Toàn quốc</span>
                </div>
              </div>

              {/* Associated Leads from this Post */}
              <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white flex items-center gap-2 text-xs">
                    <Users className="w-4 h-4 text-[#33CCFF]" />
                    Khách Hàng Đăng Ký Từ Bài Post Này ({matchingLeads.length})
                  </h4>
                  <span className="text-[10px] text-gray-500">Gần nhất</span>
                </div>

                {matchingLeads.length === 0 ? (
                  <p className="text-gray-500 italic text-[11px] py-4 text-center">
                    Chưa có khách hàng nào được gán cụ thể cho chiến dịch này trong dữ liệu mẫu.
                  </p>
                ) : (
                  <div className="space-y-2 max-h-56 overflow-y-auto custom-scrollbar">
                    {matchingLeads.map(l => (
                      <div 
                        key={l.id}
                        onClick={() => {
                          if (onSelectLead) onSelectLead(l);
                        }}
                        className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-[#33CCFF]/30 transition-all cursor-pointer flex items-center justify-between"
                      >
                        <div>
                          <p className="font-semibold text-white">{l.name}</p>
                          <p className="text-[10px] text-gray-400 font-mono">{l.phone || l.email}</p>
                        </div>
                        <div className="text-right">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                            l.status === 'funded' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-blue-500/20 text-blue-300'
                          }`}>
                            ${(l.deposit || 0).toLocaleString()}
                          </span>
                          <p className="text-[9px] text-gray-500 mt-0.5">{l.createdAt}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-3 border-t border-white/10 bg-white/[0.02]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}

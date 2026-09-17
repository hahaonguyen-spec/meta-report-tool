import React, { useState } from 'react';
import { 
  User, Phone, Mail, MessageSquare, Calendar, Clock, DollarSign, 
  Tag, Flame, Sparkles, Send, CheckCircle2, ChevronRight, Copy, 
  ExternalLink, Edit3, Plus, Trash2, PhoneCall, AlertCircle, Eye,
  Lock, Layers
} from 'lucide-react';
import { generateLeadPitch } from '../services/geminiService';
import { hasPermission, maskPhoneNumber, maskEmail } from '../constants/permissions';
import { getAdPostForLead } from '../services/adPostService';

export default function LeadDetailModal({ 
  lead, 
  onClose, 
  onSaveLead, 
  profiles = [], 
  stages = [], 
  geminiApiKey,
  crmCurrency = 'VND',
  customRates = {},
  currentUser,
  onOpenAdPost
}) {
  const [currentTab, setCurrentTab] = useState('details'); // 'details' | 'timeline' | 'ai_pitch'
  
  // Quyền hạn của user hiện tại
  const canViewSensitive = hasPermission(currentUser, 'leads:view_sensitive');
  const canEdit = hasPermission(currentUser, 'leads:edit');
  const canChangeStage = hasPermission(currentUser, 'leads:change_stage');
  const canAssign = hasPermission(currentUser, 'leads:assign');
  const canUseAi = hasPermission(currentUser, 'ai:use_pitch_generator');

  // Lấy thông tin bài post quảng cáo liên kết với lead
  const adPost = getAdPostForLead(lead);

  // Lead state
  const [name, setName] = useState(lead.name || '');
  const [phone, setPhone] = useState(lead.phone || '');
  const [email, setEmail] = useState(lead.email || '');
  const [status, setStatus] = useState(lead.status || 'new');
  const [priority, setPriority] = useState(lead.priority || 'warm'); // 'hot', 'warm', 'cold'
  const [deposit, setDeposit] = useState(lead.deposit || 0);
  const [assignedTo, setAssignedTo] = useState(lead.assignedTo || (profiles[0] ? profiles[0].id : 'prof_admin'));
  const [followUpDate, setFollowUpDate] = useState(lead.followUpDate || '');
  const [tags, setTags] = useState(lead.tags || ['Tiềm Năng']);
  const [tagInput, setTagInput] = useState('');
  const [notes, setNotes] = useState(lead.notes || '');
  
  // Timeline activities
  const [activities, setActivities] = useState(lead.activities || [
    {
      id: 'act_init',
      type: 'created',
      title: 'Khách hàng được tiếp nhận vào hệ thống',
      note: `Nguồn: ${lead.source || 'Facebook Ads'}${lead.campaign ? ` • Campaign: ${lead.campaign}` : ''}`,
      timestamp: lead.createdAt || new Date().toISOString().slice(0, 10),
      author: 'Hệ thống'
    }
  ]);

  // Log activity input
  const [newLogType, setNewLogType] = useState('call'); // 'call', 'email', 'zalo', 'note'
  const [newLogNote, setNewLogNote] = useState('');

  // AI Pitch state
  const [aiPitch, setAiPitch] = useState(lead.aiPitch || '');
  const [generatingPitch, setGeneratingPitch] = useState(false);
  const [aiPitchError, setAiPitchError] = useState(null);
  const [copiedPitch, setCopiedPitch] = useState(false);

  // Currency Formatter
  const formatMoney = (valInUsd) => {
    const rate = customRates[crmCurrency] || 1;
    const val = (parseFloat(valInUsd) || 0) * rate;
    if (crmCurrency === 'VND') {
      return `${Math.round(val).toLocaleString('vi-VN')} ₫`;
    }
    return `$${val.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
  };

  const handleAddTag = (e) => {
    if (!canEdit) return;
    if (e.key === 'Enter' || e.type === 'click') {
      e.preventDefault();
      if (tagInput.trim() && !tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
        setTagInput('');
      }
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    if (!canEdit) return;
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleAddActivity = (e) => {
    e.preventDefault();
    if (!canEdit) {
      alert("Bạn không có quyền chỉnh sửa hoặc thêm ghi chú!");
      return;
    }
    if (!newLogNote.trim()) return;

    const typeTitles = {
      call: 'Cuộc gọi tư vấn',
      email: 'Gửi Email báo giá / tài liệu',
      zalo: 'Nhắn tin qua Zalo / Chat',
      note: 'Ghi chú nội bộ'
    };

    const newActivity = {
      id: `act_${Date.now()}`,
      type: newLogType,
      title: typeTitles[newLogType] || 'Hoạt động mới',
      note: newLogNote.trim(),
      timestamp: new Date().toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' }),
      author: currentUser?.name || profiles.find(p => p.id === assignedTo)?.name || 'Nhân sự'
    };

    setActivities([newActivity, ...activities]);
    setNewLogNote('');
  };

  const handleGeneratePitch = async () => {
    if (!canUseAi) {
      setAiPitchError('Tài khoản của bạn không được cấp quyền sử dụng AI.');
      return;
    }

    if (!geminiApiKey || !geminiApiKey.trim()) {
      setAiPitchError('Chưa cấu hình Google Gemini API Key. Vui lòng vào Cài Đặt để nhập API Key.');
      return;
    }

    setGeneratingPitch(true);
    setAiPitchError(null);

    try {
      const pitchResult = await generateLeadPitch(geminiApiKey, {
        name,
        phone: canViewSensitive ? phone : maskPhoneNumber(phone),
        email: canViewSensitive ? email : maskEmail(email),
        source: lead.source,
        campaign: lead.campaign,
        adHeadline: adPost?.headline,
        adMessage: adPost?.message,
        status,
        deposit,
        priority,
        tags,
        notes
      });
      setAiPitch(pitchResult);
    } catch (err) {
      setAiPitchError(err.message || 'Lỗi khi tạo kịch bản tư vấn.');
    } finally {
      setGeneratingPitch(false);
    }
  };

  const handleSave = () => {
    if (!canEdit) {
      alert("Bạn không có quyền lưu chỉnh sửa khách hàng này!");
      return;
    }

    const updatedLead = {
      ...lead,
      name: name.trim(),
      phone: canViewSensitive ? phone.trim() : lead.phone,
      email: canViewSensitive ? email.trim() : lead.email,
      status,
      priority,
      deposit: parseFloat(deposit) || 0,
      assignedTo,
      followUpDate,
      tags,
      notes: notes.trim(),
      activities,
      aiPitch,
      updatedAt: new Date().toISOString().slice(0, 10)
    };
    onSaveLead(updatedLead);
    onClose();
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedPitch(true);
    setTimeout(() => setCopiedPitch(false), 2500);
  };

  const currentStageObj = stages.find(s => s.id === status) || stages[0];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-[#070d09] border border-emerald-500/25 rounded-3xl w-full max-w-3xl shadow-2xl relative max-h-[92vh] flex flex-col overflow-hidden">
        {/* Top Header */}
        <div className="p-5 border-b border-white/10 bg-white/[0.02] flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-600/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-lg flex-shrink-0 font-levents">
              {name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-bold text-white truncate font-levents">{name}</h2>
                {/* Priority Selector */}
                <select
                  value={priority}
                  disabled={!canEdit}
                  onChange={(e) => setPriority(e.target.value)}
                  className={`text-[11px] font-bold rounded-lg px-2 py-0.5 border cursor-pointer focus:outline-none ${
                    priority === 'hot' ? 'bg-red-500/20 text-red-300 border-red-500/40' :
                    priority === 'warm' ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' :
                    'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  }`}
                >
                  <option value="hot" className="bg-[#070d09]">🔥 Khách Nóng (Hot)</option>
                  <option value="warm" className="bg-[#070d09]">⚡ Tiềm Năng (Warm)</option>
                  <option value="cold" className="bg-[#070d09]">❄️ Đang Theo Dõi (Cold)</option>
                </select>

                {/* Stage Selector */}
                <select
                  value={status}
                  disabled={!canChangeStage}
                  onChange={(e) => setStatus(e.target.value)}
                  className={`text-[11px] font-semibold rounded-lg px-2.5 py-0.5 border cursor-pointer focus:outline-none ${currentStageObj.color}`}
                >
                  {stages.map(s => (
                    <option key={s.id} value={s.id} className="bg-[#070d09] text-white">{s.label}</option>
                  ))}
                </select>
              </div>

              <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-2 flex-wrap">
                <span>Nguồn: <strong className="text-gray-300">{lead.source || 'Facebook Ads'}</strong></span>
                {lead.campaign && (
                  <span>• Chiến dịch: <strong className="text-emerald-400">{lead.campaign}</strong></span>
                )}
                <span>• Ngày nhận: {lead.createdAt || 'Mới đây'}</span>
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors text-lg cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Quick Contact & Action Ribbon */}
        <div className="px-5 py-2.5 bg-black/40 border-b border-white/5 flex items-center justify-between gap-2 flex-wrap text-xs">
          <div className="flex items-center gap-2">
            {phone && (
              canViewSensitive ? (
                <a
                  href={`tel:${phone}`}
                  className="px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 font-semibold flex items-center gap-1.5 transition-all"
                >
                  <PhoneCall className="w-3.5 h-3.5" /> Gọi điện: {phone}
                </a>
              ) : (
                <span className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 flex items-center gap-1.5" title="SĐT đã được che mờ theo phân quyền">
                  <Lock className="w-3 h-3 text-amber-400" /> SĐT: {maskPhoneNumber(phone)}
                </span>
              )
            )}
            {email && (
              canViewSensitive ? (
                <a
                  href={`mailto:${email}`}
                  className="px-3 py-1.5 rounded-xl bg-blue-500/15 hover:bg-blue-500/25 border border-blue-500/30 text-blue-300 font-semibold flex items-center gap-1.5 transition-all"
                >
                  <Mail className="w-3.5 h-3.5" /> {email}
                </a>
              ) : (
                <span className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 flex items-center gap-1.5" title="Email đã được che mờ theo phân quyền">
                  <Lock className="w-3 h-3 text-amber-400" /> {maskEmail(email)}
                </span>
              )
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentTab('details')}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer uppercase font-levents text-xs ${
                currentTab === 'details' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-gray-400 hover:text-white'
              }`}
            >
              Hồ Sơ & Chi Tiết
            </button>
            <button
              onClick={() => setCurrentTab('timeline')}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer uppercase font-levents text-xs ${
                currentTab === 'timeline' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-gray-400 hover:text-white'
              }`}
            >
              Lịch Sử Chăm Sóc
            </button>
            <button
              onClick={() => setCurrentTab('ai_pitch')}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all flex items-center gap-1 cursor-pointer uppercase font-levents text-xs ${
                currentTab === 'ai_pitch' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              Kịch Bản AI
            </button>
          </div>
        </div>

        {/* Modal Body Content */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4 text-xs custom-scrollbar">
          {/* TAB 1: DETAILS */}
          {currentTab === 'details' && (
            <div className="space-y-4">
              {/* Ad Creative Connection Block */}
              {adPost && (
                <div className="bg-gradient-to-r from-blue-950/40 via-indigo-950/20 to-purple-950/30 border border-blue-500/30 rounded-2xl p-3.5 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {adPost.imageUrl && (
                      <img 
                        src={adPost.imageUrl} 
                        alt={adPost.headline} 
                        className="w-14 h-14 rounded-xl object-cover border border-white/10 flex-shrink-0 shadow"
                      />
                    )}
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="px-2 py-0.2 rounded-full text-[9px] bg-blue-500/20 text-blue-300 font-bold border border-blue-500/30 flex items-center gap-1">
                          <Layers className="w-2.5 h-2.5" /> Bài Post Quảng Cáo Đã Tương Tác
                        </span>
                        <span className="text-gray-400 text-[10px]">{adPost.pageName}</span>
                      </div>
                      <p className="font-bold text-white text-xs mt-0.5 truncate">{adPost.headline}</p>
                      <p className="text-gray-300 text-[10px] line-clamp-1 italic">{adPost.message}</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onOpenAdPost && onOpenAdPost(adPost)}
                    className="px-3.5 py-1.5 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 flex-shrink-0 transition-all cursor-pointer shadow-sm uppercase font-levents"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Xem Chi Tiết Bài Post
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-gray-400 font-semibold mb-1">Tên khách hàng</label>
                  <input
                    type="text"
                    disabled={!canEdit}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#070b14] border border-white/15 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-emerald-400 disabled:opacity-60"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 font-semibold mb-1 flex items-center justify-between">
                    <span>Số điện thoại</span>
                    {!canViewSensitive && <span className="text-amber-400 text-[10px] flex items-center gap-1"><Lock className="w-2.5 h-2.5" /> Che mờ</span>}
                  </label>
                  <input
                    type="text"
                    disabled={!canEdit || !canViewSensitive}
                    value={canViewSensitive ? phone : maskPhoneNumber(phone)}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#070b14] border border-white/15 rounded-xl px-3.5 py-2 text-white font-mono focus:outline-none focus:border-emerald-400 disabled:opacity-60"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-gray-400 font-semibold mb-1 flex items-center justify-between">
                    <span>Email</span>
                    {!canViewSensitive && <span className="text-amber-400 text-[10px] flex items-center gap-1"><Lock className="w-2.5 h-2.5" /> Che mờ</span>}
                  </label>
                  <input
                    type="email"
                    disabled={!canEdit || !canViewSensitive}
                    value={canViewSensitive ? email : maskEmail(email)}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#070b14] border border-white/15 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-emerald-400 disabled:opacity-60"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 font-semibold mb-1">Nhân sự phụ trách</label>
                  <select
                    value={assignedTo}
                    disabled={!canAssign}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    className="w-full bg-[#070b14] border border-white/15 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-emerald-400 cursor-pointer disabled:opacity-60"
                  >
                    {profiles.map(p => (
                      <option key={p.id} value={p.id} className="bg-[#070d09]">{p.name} ({p.role})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-gray-400 font-semibold">Tiền Nạp ($ USD)</label>
                    <span className="text-emerald-400 font-bold">{formatMoney(deposit)}</span>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2 text-gray-500 font-bold">$</span>
                    <input
                      type="number"
                      disabled={!canEdit}
                      value={deposit}
                      onChange={(e) => setDeposit(e.target.value)}
                      className="w-full bg-[#070b14] border border-white/15 rounded-xl pl-8 pr-3.5 py-2 text-white font-mono focus:outline-none focus:border-emerald-400 disabled:opacity-60"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-400 font-semibold mb-1 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    Hẹn ngày chăm sóc (Follow-up Date)
                  </label>
                  <input
                    type="date"
                    disabled={!canEdit}
                    value={followUpDate}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                    className="w-full bg-[#070b14] border border-white/15 rounded-xl px-3.5 py-2 text-white font-mono focus:outline-none focus:border-amber-400 disabled:opacity-60"
                  />
                </div>
              </div>

              {/* Tags Section */}
              <div>
                <label className="block text-gray-400 font-semibold mb-1.5 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-emerald-400" />
                  Thẻ Phân Loại (Tags)
                </label>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  {tags.map((t, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-emerald-300 flex items-center gap-1.5">
                      #{t}
                      {canEdit && (
                        <button type="button" onClick={() => handleRemoveTag(t)} className="text-gray-400 hover:text-red-400 cursor-pointer">
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </span>
                  ))}
                </div>

                {canEdit && (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Thêm tag (VD: VIP, Quan tâm Forex, Chờ gọi lại...)"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleAddTag}
                      className="flex-1 bg-[#070b14] border border-white/15 rounded-xl px-3.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-400"
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="px-3 py-1.5 bg-white/10 hover:bg-white/15 text-white rounded-xl text-xs font-semibold cursor-pointer"
                    >
                      Thêm Tag
                    </button>
                  </div>
                )}
              </div>

              {/* General Notes */}
              <div>
                <label className="block text-gray-400 font-semibold mb-1">Ghi Chú Tổng Hợp</label>
                <textarea
                  rows={3}
                  disabled={!canEdit}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ghi chú về nhu cầu, khẩu vị đầu tư, sở thích của khách..."
                  className="w-full bg-[#070b14] border border-white/15 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-400 disabled:opacity-60"
                />
              </div>
            </div>
          )}

          {/* TAB 2: TIMELINE ACTIVITIES */}
          {currentTab === 'timeline' && (
            <div className="space-y-4">
              {/* Form Add New Activity */}
              {canEdit && (
                <form onSubmit={handleAddActivity} className="p-3.5 rounded-2xl bg-black/40 border border-white/10 space-y-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 font-semibold">Loại tương tác:</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setNewLogType('call')}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer ${newLogType === 'call' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'text-gray-400 hover:text-white'}`}
                      >
                        📞 Cuộc gọi
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewLogType('zalo')}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer ${newLogType === 'zalo' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 'text-gray-400 hover:text-white'}`}
                      >
                        💬 Zalo / Chat
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewLogType('email')}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer ${newLogType === 'email' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'text-gray-400 hover:text-white'}`}
                      >
                        ✉️ Email
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewLogType('note')}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer ${newLogType === 'note' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-gray-400 hover:text-white'}`}
                      >
                        📝 Ghi chú
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      placeholder="Nhập nội dung tương tác (VD: Đã gọi trao đổi về chính sách nạp rút, khách hẹn thứ 6 gọi lại)..."
                      value={newLogNote}
                      onChange={(e) => setNewLogNote(e.target.value)}
                      className="flex-1 bg-[#070b14] border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-90 text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-950/40 transition-all flex-shrink-0 cursor-pointer font-levents uppercase"
                    >
                      <Send className="w-3.5 h-3.5" /> Ghi Lại
                    </button>
                  </div>
                </form>
              )}

              {/* Timeline list */}
              <div className="space-y-3 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/10 pl-2">
                {activities.map((act) => (
                  <div key={act.id} className="relative flex items-start gap-3.5 pl-6 group">
                    <div className={`absolute left-2.5 top-1.5 w-3.5 h-3.5 rounded-full border-2 border-[#070d09] flex items-center justify-center -translate-x-1/2 ${
                      act.type === 'call' ? 'bg-emerald-500' :
                      act.type === 'zalo' ? 'bg-blue-500' :
                      act.type === 'email' ? 'bg-purple-500' :
                      act.type === 'created' ? 'bg-emerald-500' :
                      'bg-amber-500'
                    }`} />
                    <div className="flex-1 bg-white/[0.02] border border-white/10 rounded-2xl p-3.5 space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-white flex items-center gap-1.5">
                          {act.title}
                        </span>
                        <span className="text-gray-500 font-mono text-[10px]">{act.timestamp}</span>
                      </div>
                      <p className="text-gray-300 text-xs leading-relaxed">{act.note}</p>
                      <p className="text-gray-500 text-[10px] pt-1">Thực hiện bởi: <strong className="text-gray-400">{act.author}</strong></p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: AI PITCH GENERATOR */}
          {currentTab === 'ai_pitch' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-emerald-950/40 via-[#070d09] to-teal-950/30 border border-emerald-500/30 rounded-2xl p-4 space-y-3 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-white flex items-center gap-2 text-sm font-levents uppercase">
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                      Trợ Lý AI Tạo Kịch Bản Telesales & Chốt Deal
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Gemini đọc thông tin khách hàng, nguồn bài post và lịch sử để gợi ý kịch bản mở đầu và xử lý từ chối.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleGeneratePitch}
                    disabled={generatingPitch || !canUseAi}
                    className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-90 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-950/40 transition-all disabled:opacity-40 flex-shrink-0 cursor-pointer font-levents uppercase"
                  >
                    <Sparkles className={`w-3.5 h-3.5 ${generatingPitch ? 'animate-spin' : ''}`} />
                    {generatingPitch ? 'Đang soạn kịch bản...' : aiPitch ? 'Tạo Kịch Bản Mới' : 'Tạo Kịch Bản Tư Vấn'}
                  </button>
                </div>

                {!canUseAi && (
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-center gap-2">
                    <Lock className="w-4 h-4 flex-shrink-0" />
                    Tài khoản của bạn chưa được cấp quyền sử dụng trợ lý AI kịch bản.
                  </div>
                )}

                {aiPitchError && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {aiPitchError}
                  </div>
                )}
              </div>

              {aiPitch && (
                <div className="bg-[#070b14] border border-emerald-500/30 rounded-2xl p-4 relative">
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/10">
                    <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider font-levents">
                      Gợi Ý Kịch Bản Dành Riêng Cho: {name}
                    </span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(aiPitch)}
                      className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/15 text-gray-200 text-[11px] flex items-center gap-1 font-medium transition-all cursor-pointer font-levents"
                    >
                      <Copy className="w-3 h-3" />
                      {copiedPitch ? 'Đã sao chép!' : 'Sao chép nội dung'}
                    </button>
                  </div>
                  <div className="prose prose-invert max-w-none text-xs leading-relaxed text-gray-300 whitespace-pre-wrap">
                    {aiPitch}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-white/10 bg-black/40 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 transition-all font-medium cursor-pointer"
          >
            Đóng
          </button>
          {canEdit && (
            <button
              type="button"
              onClick={handleSave}
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold uppercase font-levents shadow-lg shadow-emerald-950/40 hover:opacity-95 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" /> Lưu Thay Đổi
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Shield, Lock, Mail, User, Check, ArrowRight, UserPlus, Sparkles, Key, Eye, EyeOff } from 'lucide-react';

export default function AuthLogin({ profiles, onLogin }) {
  const [isRegisterTab, setIsRegisterTab] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  
  // Register state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState('Media Buyer');
  const [regNotes, setRegNotes] = useState('');

  // 1-Click Demo Logins
  const demoAccounts = [
    {
      id: 'prof_admin',
      name: 'Nguyễn Hạo Hà',
      email: 'admin@metareport.vn',
      role: 'Admin',
      badge: 'Toàn Quyền Quản Trị',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'prof_buyer1',
      name: 'Media Buyer Vietnam',
      email: 'buyer.vn@agency.com',
      role: 'Media Buyer',
      badge: 'Quản Lý Ads & Leads',
      color: 'from-emerald-500 to-teal-500'
    },
    {
      id: 'prof_sales',
      name: 'Sales Specialist',
      email: 'sales@metareport.vn',
      role: 'Sales Specialist',
      badge: 'Chăm Sóc & Chốt Deal',
      color: 'from-amber-500 to-orange-500'
    },
    {
      id: 'prof_client',
      name: 'Client VIP Alpha',
      email: 'client.alpha@enterprise.com',
      role: 'Client',
      badge: 'Theo Dõi Báo Cáo',
      color: 'from-purple-500 to-pink-500'
    }
  ];

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setError('');

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      setError('Vui lòng nhập Email hoặc Tên đăng nhập!');
      return;
    }

    // Find profile matching email or demo credentials
    const foundProfile = profiles.find(
      p => (p.email && p.email.toLowerCase() === cleanEmail) || p.name.toLowerCase() === cleanEmail
    );

    if (foundProfile) {
      // Check password if configured, or accept demo password
      if (foundProfile.password && password && foundProfile.password !== password) {
        setError('Mật khẩu không chính xác. Hãy thử mật khẩu demo: 123456 hoặc click Đăng nhập nhanh.');
        return;
      }
      onLogin(foundProfile, rememberMe);
    } else {
      // Allow dynamic login as new user or admin
      const tempUser = {
        id: `prof_${Date.now()}`,
        name: cleanEmail.split('@')[0],
        email: cleanEmail,
        role: 'Media Buyer',
        status: 'Active',
        assignedAccounts: [],
        notes: 'Người dùng đăng nhập mới',
        avatarBg: 'bg-gradient-to-r from-blue-500 to-cyan-500'
      };
      onLogin(tempUser, rememberMe);
    }
  };

  const handleQuickLogin = (demo) => {
    const existing = profiles.find(p => p.id === demo.id || p.email === demo.email);
    if (existing) {
      onLogin(existing, true);
    } else {
      onLogin({
        id: demo.id,
        name: demo.name,
        email: demo.email,
        role: demo.role,
        status: 'Active',
        assignedAccounts: ['mock_1', 'mock_2', 'mock_3'],
        notes: demo.badge,
        avatarBg: `bg-gradient-to-r ${demo.color}`
      }, true);
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!regName.trim() || !regEmail.trim()) {
      setError('Vui lòng điền họ tên và email hợp lệ!');
      return;
    }

    const newUser = {
      id: `prof_${Date.now()}`,
      name: regName.trim(),
      email: regEmail.trim().toLowerCase(),
      password: regPassword.trim() || '123456',
      role: regRole,
      status: 'Active',
      assignedAccounts: ['mock_1'],
      notes: regNotes.trim() || `Tài khoản tạo mới ngày ${new Date().toLocaleDateString('vi-VN')}`,
      avatarBg: regRole === 'Admin' ? 'bg-gradient-to-r from-blue-500 to-cyan-500' :
                regRole === 'Media Buyer' ? 'bg-gradient-to-r from-emerald-500 to-teal-500' :
                regRole === 'Sales Specialist' ? 'bg-gradient-to-r from-amber-500 to-orange-500' :
                'bg-gradient-to-r from-purple-500 to-pink-500'
    };

    onLogin(newUser, true, true); // true = isNewRegistration
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-white flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Background decorative glowing orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-teal-800/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-10 right-1/3 w-64 h-64 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-600/10 border border-emerald-500/30 shadow-xl shadow-emerald-950/20 mb-3">
            <Shield className="w-7 h-7 text-emerald-400" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white flex items-center justify-center gap-2 uppercase font-levents">
            META CRM & ANALYTICS <Sparkles className="w-4 h-4 text-emerald-400" />
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Hệ thống Báo Cáo Hiệu Quả Marketing & Quản Trị Khách Hàng Tích Hợp AI
          </p>
        </div>

        {/* Auth Card */}
        <div className="insure-glass border border-emerald-500/25 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          {/* Tab Switcher */}
          <div className="flex rounded-xl bg-white/5 p-1 mb-6 border border-white/10">
            <button
              type="button"
              onClick={() => { setIsRegisterTab(false); setError(''); }}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all uppercase font-levents ${
                !isRegisterTab
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Đăng Nhập
            </button>
            <button
              type="button"
              onClick={() => { setIsRegisterTab(true); setError(''); }}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all uppercase font-levents ${
                isRegisterTab
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Tạo Tài Khoản
            </button>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/25 text-red-300 text-xs flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
              {error}
            </div>
          )}

          {!isRegisterTab ? (
            /* LOGIN FORM */
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Email hoặc Tên đăng nhập
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="admin@metareport.vn hoặc Tên"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#070b14] border border-white/15 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-400 transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-gray-300">
                    Mật khẩu
                  </label>
                  <span className="text-[10px] text-gray-500">
                    (Mặc định demo: 123456)
                  </span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#070b14] border border-white/15 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-400 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-400 select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded bg-white/10 border-white/20 text-emerald-400 focus:ring-0 cursor-pointer"
                  />
                  Ghi nhớ đăng nhập
                </label>
                <span className="text-[11px] text-emerald-400 hover:underline cursor-pointer" onClick={() => setEmail('admin@metareport.vn')}>
                  Dùng tài khoản Admin
                </span>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-xs shadow-lg shadow-emerald-950/40 hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer uppercase font-levents"
              >
                Đăng Nhập Vào Hệ Thống <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            /* REGISTER FORM */
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Họ và tên *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="VD: Trần Hoàng Anh"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full bg-[#070b14] border border-white/15 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Địa chỉ Email *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="hoanganh@company.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full bg-[#070b14] border border-white/15 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Mật khẩu
                  </label>
                  <input
                    type="password"
                    placeholder="Tùy chọn"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full bg-[#070b14] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Vai trò (Role)
                  </label>
                  <select
                    value={regRole}
                    onChange={(e) => setRegRole(e.target.value)}
                    className="w-full bg-[#070b14] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400 cursor-pointer"
                  >
                    <option value="Media Buyer" className="bg-[#070d09]">Media Buyer</option>
                    <option value="Sales Specialist" className="bg-[#070d09]">Sales Specialist</option>
                    <option value="Admin" className="bg-[#070d09]">Quản trị viên (Admin)</option>
                    <option value="Client" className="bg-[#070d09]">Khách hàng / Client</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Ghi chú chuyên môn
                </label>
                <input
                  type="text"
                  placeholder="VD: Phụ trách thị trường Đông Nam Á..."
                  value={regNotes}
                  onChange={(e) => setRegNotes(e.target.value)}
                  className="w-full bg-[#070b14] border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-400"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-xs shadow-lg shadow-emerald-950/40 hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer uppercase font-levents"
              >
                <UserPlus className="w-4 h-4" /> Hoàn Tất Đăng Ký & Vào Hệ Thống
              </button>
            </form>
          )}

          {/* Quick Demo Login Section */}
          <div className="mt-6 pt-5 border-t border-white/10">
            <p className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold text-center mb-3 flex items-center justify-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-amber-400" /> Đăng nhập nhanh 1-Click (Demo)
            </p>

            <div className="grid grid-cols-2 gap-2">
              {demoAccounts.map(demo => (
                <button
                  key={demo.id}
                  type="button"
                  onClick={() => handleQuickLogin(demo)}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-emerald-500/30 transition-all text-left flex items-center gap-2 cursor-pointer group"
                >
                  <span className={`w-7 h-7 rounded-lg bg-gradient-to-r ${demo.color} flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0 shadow-sm`}>
                    {demo.name.charAt(0)}
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-white truncate group-hover:text-emerald-400 transition-colors">
                      {demo.name}
                    </p>
                    <p className="text-[10px] text-gray-400 truncate">{demo.role}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-[11px] text-gray-500 mt-6">
          Meta Report & CRM Intelligence • An toàn, bảo mật nội bộ
        </p>
      </div>
    </div>
  );
}

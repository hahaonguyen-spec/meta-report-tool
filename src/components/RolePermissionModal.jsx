import React, { useState } from 'react';
import { 
  Shield, 
  ShieldCheck, 
  ShieldAlert, 
  Check, 
  X, 
  Users, 
  Lock, 
  Sparkles, 
  FileText, 
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { 
  PERMISSION_GROUPS, 
  PERMISSION_DEFINITIONS, 
  ROLE_PERMISSIONS_PRESET, 
  ROLES_LIST 
} from '../constants/permissions';

export default function RolePermissionModal({
  isOpen,
  editingProfile,
  adAccounts = [],
  onClose,
  onSave
}) {
  if (!isOpen) return null;

  const [name, setName] = useState(editingProfile ? editingProfile.name : '');
  const [email, setEmail] = useState(editingProfile ? editingProfile.email : '');
  const [role, setRole] = useState(editingProfile ? editingProfile.role : 'Sales Specialist');
  const [assignedAccounts, setAssignedAccounts] = useState(
    editingProfile ? (editingProfile.assignedAccounts || []) : []
  );
  const [notes, setNotes] = useState(editingProfile ? editingProfile.notes : '');

  // Custom permissions state: if profile has customPermissions array, use it; otherwise use role preset
  const [permissions, setPermissions] = useState(() => {
    if (editingProfile && editingProfile.customPermissions && Array.isArray(editingProfile.customPermissions)) {
      return [...editingProfile.customPermissions];
    }
    const initialRole = editingProfile ? editingProfile.role : 'Sales Specialist';
    return [...(ROLE_PERMISSIONS_PRESET[initialRole] || [])];
  });

  const [activeGroup, setActiveGroup] = useState('all');

  // Handle role preset change
  const handleRoleChange = (newRole) => {
    setRole(newRole);
    // Tự động load quyền mẫu của role mới
    const preset = ROLE_PERMISSIONS_PRESET[newRole] || [];
    setPermissions([...preset]);
  };

  // Toggle 1 quyền cụ thể
  const togglePermission = (key) => {
    if (permissions.includes(key)) {
      setPermissions(permissions.filter(k => k !== key));
    } else {
      setPermissions([...permissions, key]);
    }
  };

  // Chọn tất cả quyền
  const selectAllPermissions = () => {
    setPermissions(PERMISSION_DEFINITIONS.map(p => p.key));
  };

  // Khôi phục về mặc định theo Role
  const resetToRolePreset = () => {
    const preset = ROLE_PERMISSIONS_PRESET[role] || [];
    setPermissions([...preset]);
  };

  // Toggle gán tài khoản ads
  const toggleAccount = (accId) => {
    if (assignedAccounts.includes(accId)) {
      setAssignedAccounts(assignedAccounts.filter(id => id !== accId));
    } else {
      setAssignedAccounts([...assignedAccounts, accId]);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Vui lòng nhập tên người dùng!");
      return;
    }

    const avatarBgs = [
      'bg-gradient-to-r from-blue-500 to-cyan-500',
      'bg-gradient-to-r from-emerald-500 to-teal-500',
      'bg-gradient-to-r from-purple-500 to-pink-500',
      'bg-gradient-to-r from-amber-500 to-orange-500'
    ];

    const updatedProfile = {
      id: editingProfile ? editingProfile.id : `prof_${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      role,
      status: editingProfile?.status || 'Active',
      assignedAccounts,
      notes: notes.trim(),
      customPermissions: permissions, // Lưu bộ quyền tùy biến
      avatarBg: editingProfile?.avatarBg || avatarBgs[Math.floor(Math.random() * avatarBgs.length)]
    };

    onSave(updatedProfile);
  };

  const filteredPermissions = activeGroup === 'all' 
    ? PERMISSION_DEFINITIONS 
    : PERMISSION_DEFINITIONS.filter(p => p.group === activeGroup);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-[#0a0f1c] border border-white/15 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                {editingProfile ? 'Cấu Hình Hồ Sơ & Phân Quyền Chi Tiết (RBAC)' : 'Tạo Hồ Sơ Người Dùng Mới'}
              </h2>
              <p className="text-xs text-gray-400">
                Thiết lập thông tin tài khoản, vai trò chuẩn và tùy chỉnh các quyền truy cập hệ thống
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-6 text-xs custom-scrollbar">
          {/* Section 1: Thông tin cơ bản */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white/[0.02] border border-white/10 p-4 rounded-xl">
            <div>
              <label className="block text-gray-300 font-semibold mb-1">Tên Người Dùng *</label>
              <input 
                type="text" 
                required
                placeholder="VD: Trần Văn Bình"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#070b14] border border-white/15 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#33CCFF]"
              />
            </div>

            <div>
              <label className="block text-gray-300 font-semibold mb-1">Email Đăng Nhập</label>
              <input 
                type="email" 
                placeholder="user@metareport.internal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#070b14] border border-white/15 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#33CCFF]"
              />
            </div>

            <div>
              <label className="block text-gray-300 font-semibold mb-1">Vai Trò Chuẩn (Role Preset)</label>
              <select
                value={role}
                onChange={(e) => handleRoleChange(e.target.value)}
                className="w-full bg-[#070b14] border border-white/15 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#33CCFF] font-medium"
              >
                {ROLES_LIST.map(r => (
                  <option key={r.id} value={r.id} className="bg-[#0a0f1c]">{r.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Section 2: Tài khoản quảng cáo phụ trách */}
          <div className="bg-white/[0.02] border border-white/10 p-4 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <label className="text-gray-300 font-semibold">Tài Khoản Quảng Cáo Phụ Trách</label>
              <span className="text-[11px] text-gray-500">Đã chọn: {assignedAccounts.length} tài khoản</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {adAccounts.map(acc => {
                const isSelected = assignedAccounts.includes(acc.account_id);
                return (
                  <div
                    key={acc.account_id}
                    onClick={() => toggleAccount(acc.account_id)}
                    className={`flex items-center justify-between p-2.5 rounded-lg border cursor-pointer transition-all ${
                      isSelected 
                        ? 'bg-[#33CCFF]/10 border-[#33CCFF]/40 text-white shadow-sm' 
                        : 'bg-white/5 border-white/5 text-gray-400 hover:border-white/15'
                    }`}
                  >
                    <span className="truncate font-medium">{acc.name || acc.account_id}</span>
                    <div className={`w-4 h-4 rounded border flex items-center justify-center ${isSelected ? 'bg-[#33CCFF] border-[#33CCFF]' : 'border-gray-600'}`}>
                      {isSelected && <Check className="w-3 h-3 text-black" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 3: Ma Trận Phân Quyền Chi Tiết (Granular Permissions) */}
          <div className="bg-white/[0.02] border border-white/10 p-5 rounded-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
              <div>
                <h3 className="font-bold text-white flex items-center gap-2 text-sm">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Ma Trận Quyền Hạn Chi Tiết ({permissions.length}/{PERMISSION_DEFINITIONS.length} Quyền Đang Kích Hoạt)
                </h3>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Bạn có thể tùy chỉnh bật/tắt từng quyền cụ thể vượt ra ngoài vai trò mặc định
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={resetToRolePreset}
                  className="px-2.5 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-gray-300 text-[11px] flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Khôi phục quyền theo Role"
                >
                  <RotateCcw className="w-3 h-3 text-[#33CCFF]" />
                  Theo Role "{role}"
                </button>
                <button
                  type="button"
                  onClick={selectAllPermissions}
                  className="px-2.5 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-gray-300 text-[11px] transition-colors cursor-pointer"
                >
                  Chọn Tất Cả
                </button>
              </div>
            </div>

            {/* Filter Permission Tabs */}
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => setActiveGroup('all')}
                className={`px-3 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer ${
                  activeGroup === 'all' 
                    ? 'bg-[#33CCFF] text-black font-semibold' 
                    : 'bg-white/5 text-gray-400 hover:text-white'
                }`}
              >
                Tất Cả ({PERMISSION_DEFINITIONS.length})
              </button>
              {PERMISSION_GROUPS.map(g => {
                const countInGroup = PERMISSION_DEFINITIONS.filter(p => p.group === g.id).length;
                const activeCount = permissions.filter(k => {
                  const def = PERMISSION_DEFINITIONS.find(p => p.key === k);
                  return def && def.group === g.id;
                }).length;

                return (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setActiveGroup(g.id)}
                    className={`px-3 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer ${
                      activeGroup === g.id 
                        ? 'bg-[#33CCFF] text-black font-semibold' 
                        : 'bg-white/5 text-gray-400 hover:text-white'
                    }`}
                  >
                    {g.name} ({activeCount}/{countInGroup})
                  </button>
                );
              })}
            </div>

            {/* Permission Checkbox List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              {filteredPermissions.map(perm => {
                const isChecked = permissions.includes(perm.key);
                const isSensitive = perm.key === 'leads:export' || perm.key === 'system:manage_users' || perm.key === 'system:manage_api_keys' || perm.key === 'ads:control';

                return (
                  <div
                    key={perm.key}
                    onClick={() => togglePermission(perm.key)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer select-none flex items-start justify-between gap-3 ${
                      isChecked 
                        ? 'bg-blue-500/10 border-blue-500/30' 
                        : 'bg-white/[0.01] border-white/5 hover:border-white/15 opacity-70'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`font-semibold ${isChecked ? 'text-white' : 'text-gray-400'}`}>
                          {perm.label}
                        </span>
                        {isSensitive && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center gap-0.5" title="Quyền nhạy cảm / Quản trị cấp cao">
                            <AlertTriangle className="w-2.5 h-2.5" /> Nhạy cảm
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-500 leading-snug">
                        {perm.description}
                      </p>
                    </div>

                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                      isChecked ? 'bg-[#33CCFF] border-[#33CCFF]' : 'border-gray-600 bg-black/20'
                    }`}>
                      {isChecked && <Check className="w-3.5 h-3.5 text-black" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 4: Ghi chú */}
          <div>
            <label className="block text-gray-300 font-semibold mb-1">Ghi Chú Nhân Sự / Khách Hàng</label>
            <textarea 
              rows={2}
              placeholder="VD: Quản lý chi nhánh miền Nam, chịu trách nhiệm doanh số Q2..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-[#070b14] border border-white/15 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#33CCFF]"
            />
          </div>
        </form>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/10 bg-white/[0.02]">
          <div className="text-[11px] text-gray-400">
            {role === 'Client' && (
              <span className="text-amber-400 flex items-center gap-1">
                <Lock className="w-3 h-3" /> Tài khoản Client sẽ tự động che mờ SĐT và Email của khách hàng.
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl transition-colors cursor-pointer"
            >
              Hủy Bỏ
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 bg-gradient-to-r from-blue-600 to-[#33CCFF] hover:opacity-90 text-black font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
            >
              Lưu Phân Quyền
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

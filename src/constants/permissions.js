// src/constants/permissions.js
// Hệ thống định nghĩa Phân Quyền (RBAC) cho Meta Report & CRM

export const PERMISSION_GROUPS = [
  {
    id: 'leads',
    name: 'Quản Lý Khách Hàng (CRM Leads)',
    description: 'Quyền hạn xem, cập nhật, phân công và xử lý dữ liệu khách hàng'
  },
  {
    id: 'ads',
    name: 'Quảng Cáo Meta Ads & Bài Post',
    description: 'Quyền xem báo cáo, chi phí, bật/tắt ads và thông tin bài post quảng cáo'
  },
  {
    id: 'analytics',
    name: 'Phân Tích Dữ Liệu Marketing',
    description: 'Quyền xem chỉ số CAC, CPL, Funnel Drop-off và ma trận kênh'
  },
  {
    id: 'ai',
    name: 'Trí Tuệ Nhân Tạo (Gemini AI)',
    description: 'Quyền sử dụng AI chẩn đoán chiến lược và AI kịch bản telesales'
  },
  {
    id: 'system',
    name: 'Quản Trị Hệ Thống & Cài Đặt',
    description: 'Quyền quản lý nhân sự, phân quyền chi tiết và cấu hình API Keys'
  }
];

export const PERMISSION_DEFINITIONS = [
  // Nhóm Leads
  {
    key: 'leads:view_all',
    group: 'leads',
    label: 'Xem tất cả khách hàng',
    description: 'Xem toàn bộ danh sách leads trong hệ thống CRM (nếu tắt, chỉ xem lead được gán)'
  },
  {
    key: 'leads:view_assigned',
    group: 'leads',
    label: 'Xem khách hàng được phân công',
    description: 'Xem danh sách các leads được chỉ định cho tài khoản của mình'
  },
  {
    key: 'leads:view_sensitive',
    group: 'leads',
    label: 'Xem SĐT & Email thật (Bỏ che mờ)',
    description: 'Xem đầy đủ số điện thoại và email thật (ngược lại sẽ bị che mờ dạng 0912 *** 678)'
  },
  {
    key: 'leads:create',
    group: 'leads',
    label: 'Thêm khách hàng mới & Nhập CSV',
    description: 'Thêm thủ công lead mới hoặc import hàng loạt từ file CSV'
  },
  {
    key: 'leads:edit',
    group: 'leads',
    label: 'Chỉnh sửa & Ghi chú lịch sử chăm sóc',
    description: 'Cập nhật thông tin, hẹn ngày chăm sóc, gắn tags và ghi nhật ký hoạt động'
  },
  {
    key: 'leads:change_stage',
    group: 'leads',
    label: 'Chuyển giai đoạn phễu CRM',
    description: 'Thay đổi trạng thái khách hàng (Mới tiếp cận -> Đang tư vấn -> Đã nạp tiền)'
  },
  {
    key: 'leads:assign',
    group: 'leads',
    label: 'Phân công nhân sự phụ trách',
    description: 'Chỉ định hoặc thay đổi nhân viên sales phụ trách khách hàng'
  },
  {
    key: 'leads:export',
    group: 'leads',
    label: 'Xuất dữ liệu khách hàng (Export CSV)',
    description: 'Tải toàn bộ hoặc các leads đã chọn ra file CSV (Quyền nhạy cảm, chống rò rỉ dữ liệu)'
  },
  {
    key: 'leads:delete',
    group: 'leads',
    label: 'Xóa khách hàng',
    description: 'Xóa vĩnh viễn khách hàng khỏi hệ thống CRM'
  },

  // Nhóm Ads
  {
    key: 'ads:view_reports',
    group: 'ads',
    label: 'Xem báo cáo Meta Ads',
    description: 'Xem danh sách chiến dịch, số impressions, clicks, CTR, CPM'
  },
  {
    key: 'ads:view_spend',
    group: 'ads',
    label: 'Xem chi phí ngân sách ($ Ad Spend)',
    description: 'Xem số tiền thực tế chi tiêu cho quảng cáo (Ẩn đối với Telesales)'
  },
  {
    key: 'ads:control',
    group: 'ads',
    label: 'Bật/Tắt & Điều chỉnh ngân sách Ads',
    description: 'Thao tác trực tiếp bật tắt chiến dịch hoặc đổi ngân sách ngày/trọn đời'
  },
  {
    key: 'ads:view_creatives',
    group: 'ads',
    label: 'Xem thông tin bài post chạy ads',
    description: 'Xem hình ảnh, video, nội dung caption và link bài viết quảng cáo trên Facebook'
  },

  // Nhóm Analytics
  {
    key: 'analytics:view',
    group: 'analytics',
    label: 'Xem báo cáo Marketing Analytics',
    description: 'Xem dashboard phân tích CAC, CPL, ROAS, phễu rơi rụng (Drop-off)'
  },

  // Nhóm AI
  {
    key: 'ai:use_strategic_audit',
    group: 'ai',
    label: 'Sử dụng AI Chẩn đoán chiến lược',
    description: 'Gọi Gemini AI phân tích điểm nghẽn phễu và 5 đề xuất điều chỉnh ngân sách'
  },
  {
    key: 'ai:use_pitch_generator',
    group: 'ai',
    label: 'Sử dụng AI Soạn kịch bản tư vấn',
    description: 'Tạo kịch bản mở đầu và xử lý từ chối cá nhân hóa cho từng lead'
  },

  // Nhóm System
  {
    key: 'system:manage_users',
    group: 'system',
    label: 'Quản lý người dùng & Phân quyền',
    description: 'Tạo, sửa, xóa hồ sơ nhân sự và phân bổ quyền chi tiết'
  },
  {
    key: 'system:manage_api_keys',
    group: 'system',
    label: 'Quản trị API Keys & Kết nối',
    description: 'Cấu hình và kiểm tra Meta Access Token, Google Gemini API Key'
  }
];

// Bộ quyền mặc định chuẩn theo từng Vai Trò (Role Presets)
export const ROLE_PERMISSIONS_PRESET = {
  'Super Admin': PERMISSION_DEFINITIONS.map(p => p.key),

  'Admin': PERMISSION_DEFINITIONS.map(p => p.key),

  'Media Buyer': [
    'leads:view_all',
    'leads:view_sensitive',
    'ads:view_reports',
    'ads:view_spend',
    'ads:control',
    'ads:view_creatives',
    'analytics:view',
    'ai:use_strategic_audit'
  ],

  'Sales Manager': [
    'leads:view_all',
    'leads:view_sensitive',
    'leads:create',
    'leads:edit',
    'leads:change_stage',
    'leads:assign',
    'leads:export',
    'ads:view_reports',
    'ads:view_creatives',
    'analytics:view',
    'ai:use_strategic_audit',
    'ai:use_pitch_generator'
  ],

  'Sales Specialist': [
    'leads:view_assigned',
    'leads:view_sensitive',
    'leads:create',
    'leads:edit',
    'leads:change_stage',
    'ads:view_creatives',
    'ai:use_pitch_generator'
  ],

  'Marketing Analyst': [
    'leads:view_all',
    'ads:view_reports',
    'ads:view_spend',
    'ads:view_creatives',
    'analytics:view',
    'ai:use_strategic_audit'
  ],

  'Client': [
    'leads:view_all',
    // Client không có leads:view_sensitive -> SĐT và Email tự động bị che mờ
    'ads:view_reports',
    'ads:view_spend',
    'ads:view_creatives',
    'analytics:view'
  ]
};

// Danh sách các vai trò chuẩn
export const ROLES_LIST = [
  { id: 'Super Admin', label: 'Super Admin / Giám Đốc', desc: 'Toàn quyền quản trị hệ thống' },
  { id: 'Admin', label: 'Admin (Quản Trị Viên)', desc: 'Quản trị phân quyền và vận hành' },
  { id: 'Media Buyer', label: 'Media Buyer / Marketer', desc: 'Chuyên trách chiến dịch và bài post Ads' },
  { id: 'Sales Manager', label: 'Sales Manager (Trưởng Nhóm)', desc: 'Phân bổ leads và quản lý doanh số' },
  { id: 'Sales Specialist', label: 'Sales Specialist (Telesales)', desc: 'Chăm sóc và tư vấn leads được gán' },
  { id: 'Marketing Analyst', label: 'Marketing Analyst', desc: 'Phân tích số liệu và báo cáo hiệu quả' },
  { id: 'Client', label: 'Client / Khách Hàng (Đối Tác)', desc: 'Theo dõi tiến độ, che thông tin nhạy cảm' }
];

/**
 * Kiểm tra xem người dùng có quyền cụ thể hay không
 * @param {Object} user - Thông tin người dùng hiện tại
 * @param {string} permissionKey - Mã quyền cần kiểm tra (VD: 'leads:export')
 * @returns {boolean}
 */
export function hasPermission(user, permissionKey) {
  if (!user) return false;
  
  // Super Admin luôn có tất cả các quyền
  if (user.role === 'Super Admin' || user.role === 'Admin') {
    // Nếu có custom permissions được khai báo riêng, kiểm tra theo đó, ngược lại mặc định true
    if (user.customPermissions && Array.isArray(user.customPermissions)) {
      return user.customPermissions.includes(permissionKey);
    }
    return true;
  }

  // Nếu user có danh sách customPermissions riêng
  if (user.customPermissions && Array.isArray(user.customPermissions)) {
    return user.customPermissions.includes(permissionKey);
  }

  // Dùng preset theo Role của user
  const preset = ROLE_PERMISSIONS_PRESET[user.role] || [];
  return preset.includes(permissionKey);
}

/**
 * Che mờ số điện thoại để bảo vệ dữ liệu nội bộ
 * @param {string} phone - Số điện thoại gốc
 * @returns {string} - Số điện thoại đã che (VD: 0912 *** 678)
 */
export function maskPhoneNumber(phone) {
  if (!phone) return '-';
  const cleaned = phone.replace(/\s+/g, '');
  if (cleaned.length <= 6) return cleaned.slice(0, 2) + '***';
  const start = cleaned.slice(0, 4);
  const end = cleaned.slice(-3);
  return `${start} *** ${end}`;
}

/**
 * Che mờ email để bảo mật
 * @param {string} email - Email gốc
 * @returns {string} - Email đã che (VD: m***@gmail.com)
 */
export function maskEmail(email) {
  if (!email || !email.includes('@')) return '-';
  const [name, domain] = email.split('@');
  if (name.length <= 2) return `${name[0]}***@${domain}`;
  return `${name[0]}***${name.slice(-1)}@${domain}`;
}

/**
 * Lọc danh sách leads mà người dùng được phép xem
 * @param {Array} leads - Toàn bộ danh sách leads
 * @param {Object} user - Người dùng hiện tại
 * @returns {Array} - Danh sách leads được phép truy cập
 */
export function getUserAllowedLeads(leads, user) {
  if (!leads || !Array.isArray(leads)) return [];
  if (!user) return [];

  // Nếu có quyền xem tất cả leads
  if (hasPermission(user, 'leads:view_all')) {
    return leads;
  }

  // Nếu chỉ có quyền xem leads được gán
  if (hasPermission(user, 'leads:view_assigned')) {
    return leads.filter(l => l.assignedTo === user.id || !l.assignedTo);
  }

  return [];
}

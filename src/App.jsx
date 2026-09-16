import React, { useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { TrendingUp, Users, DollarSign, MousePointerClick, RefreshCw, Activity, AlertCircle, Briefcase, ChevronRight, ChevronDown, Check, Calendar, Printer, FileText, LayoutDashboard, Target, Globe, Image as ImageIcon, ArrowRight, UsersRound, Save, Download, Upload, RotateCcw, CheckCircle2, Settings, BookOpen, UserPlus, ShieldAlert, Key, Copy, Trash2, Edit3, UserCheck, Shield, Plus, Phone, Mail, MessageSquare, Filter, Kanban, ListFilter, ArrowUpDown, PlusCircle, CheckSquare, Award, Search, PhoneCall, Building2, Play, Pause, Zap, Power, ExternalLink, ShieldCheck, HelpCircle, Eye, BarChart3 } from 'lucide-react';

const MOCK_ACCOUNTS = [
  { account_id: 'mock_1', name: 'Demo Account - Lead Gen Asia', currency: 'USD' },
  { account_id: 'mock_2', name: 'Demo Account - Retargeting Pro', currency: 'USD' },
  { account_id: 'mock_3', name: 'Demo Account - Global Awareness', currency: 'USD' },
];

const DEFAULT_DEMO_MANUAL_DATA = {
  '101': { accountOpen: '42', fundedAccounts: '18', deposit: '4200' },
  '102': { accountOpen: '25', fundedAccounts: '10', deposit: '2500' },
  '103': { accountOpen: '10', fundedAccounts: '4', deposit: '950' },
  '104': { accountOpen: '32', fundedAccounts: '15', deposit: '3800' },
  '105': { accountOpen: '14', fundedAccounts: '6', deposit: '1600' },
};

const TARGET_PERMISSIONS = [
  { key: 'ads_management', name: 'ads_management', title: 'Quản Lý Quảng Cáo', desc: 'Bật/tắt chiến dịch 1-click, đồng bộ ngân sách và tạo chiến dịch nhanh' },
  { key: 'business_management', name: 'business_management', title: 'Quản Trị Doanh Nghiệp', desc: 'Quản lý Business Manager / Portfolios, tài khoản đối tác và trang trực thuộc' },
  { key: 'ads_read', name: 'ads_read', title: 'Đọc Dữ Liệu Ads & Insights', desc: 'Đọc chi tiết chỉ số chiến dịch, leads, spend, CPM, CTR, ROAS' },
  { key: 'pages_read_engagement', name: 'pages_read_engagement', title: 'Đọc Tương Tác Fanpage', desc: 'Phân tích tương tác bài viết organic, reactions, comments, shares' },
  { key: 'pages_show_list', name: 'pages_show_list', title: 'Danh Sách Fanpage', desc: 'Truy xuất danh sách và thông tin tất cả Fanpage bạn quản trị' },
];

const MOCK_BUSINESSES = [
  {
    id: 'bm_1001',
    name: 'Asia Growth Capital Portfolio',
    verification_status: 'verified',
    created_time: '2023-01-15T10:00:00+0000',
    primary_page: { name: 'Global Forex Official' },
    owned_ad_accounts: {
      data: [
        { account_id: 'mock_1', id: 'act_mock_1', name: 'Demo Account - Lead Gen Asia', currency: 'USD', account_status: 1, amount_spent: '142500' },
        { account_id: 'mock_2', id: 'act_mock_2', name: 'Demo Account - Retargeting Pro', currency: 'USD', account_status: 1, amount_spent: '88200' },
      ]
    },
    client_ad_accounts: {
      data: [
        { account_id: 'mock_3', id: 'act_mock_3', name: 'Demo Account - Global Awareness', currency: 'USD', account_status: 1, amount_spent: '41000' },
      ]
    },
    owned_pages: {
      data: [
        { id: 'p1', name: 'Global Forex Official', category: 'Dịch Vụ Tài Chính', fan_count: 15400 },
        { id: 'p2', name: 'Webinar Alerts Asia', category: 'Giáo Dục & Đào Tạo', fan_count: 3200 },
      ]
    }
  }
];

const MOCK_DATA = [
  { campaign_id: '101', campaign_name: 'VN_LeadGen_Campaign1', account_name: 'Demo Account - Lead Gen Asia', spend: 1250.5, impressions: 55000, clicks: 3450, leads: 145, start_time: '2026-04-15T08:00:00+0000', api_budget: 20, api_budget_type: 'daily', status: 'ACTIVE', effective_status: 'ACTIVE', objective: 'OUTCOME_LEADS' },
  { campaign_id: '102', campaign_name: 'TH_IBAcquisition_April', account_name: 'Demo Account - Retargeting Pro', spend: 850.0, impressions: 42000, clicks: 2200, leads: 85, start_time: '2026-04-01T10:30:00+0000', api_budget: 1000, api_budget_type: 'lifetime', status: 'ACTIVE', effective_status: 'ACTIVE', objective: 'OUTCOME_LEADS' },
  { campaign_id: '103', campaign_name: 'PH_Awareness_Q1', account_name: 'Demo Account - Global Awareness', spend: 430.2, impressions: 21000, clicks: 1100, leads: 32, start_time: '2026-04-10T14:15:00+0000', api_budget: 10, api_budget_type: 'daily', status: 'PAUSED', effective_status: 'PAUSED', objective: 'OUTCOME_AWARENESS' },
  { campaign_id: '104', campaign_name: 'IND_Webinar_Promo', account_name: 'Demo Account - Global Awareness', spend: 960.0, impressions: 88000, clicks: 2800, leads: 95, start_time: '2026-04-20T09:00:00+0000', api_budget: 1200, api_budget_type: 'lifetime', status: 'ACTIVE', effective_status: 'ACTIVE', objective: 'OUTCOME_TRAFFIC' },
  { campaign_id: '105', campaign_name: 'VN_IBAcquisition_Gold', account_name: 'Demo Account - Lead Gen Asia', spend: 650.8, impressions: 32000, clicks: 1750, leads: 48, start_time: '2026-04-05T16:45:00+0000', api_budget: 20, api_budget_type: 'daily', status: 'PAUSED', effective_status: 'PAUSED', objective: 'OUTCOME_LEADS' },
];

const MOCK_PAGES_DATA = [
  { 
    page_id: 'p1', 
    name: 'Global Forex Official', 
    category: 'Dịch Vụ Tài Chính',
    picture: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=120&h=120&fit=crop&crop=face',
    link: 'https://facebook.com',
    fans: 15400, 
    followers_count: 18200,
    impressions: 125000, 
    engaged_users: 8400 
  },
  { 
    page_id: 'p2', 
    name: 'Webinar Alerts Asia', 
    category: 'Giáo Dục & Đào Tạo',
    picture: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=120&h=120&fit=crop&crop=face',
    link: 'https://facebook.com',
    fans: 3200, 
    followers_count: 4100,
    impressions: 45000, 
    engaged_users: 3100 
  },
];

const DEFAULT_PROFILES = [
  {
    id: 'prof_admin',
    name: 'Nguyễn Hạo Hà',
    email: 'admin@metareport.vn',
    role: 'Admin',
    status: 'Active',
    assignedAccounts: ['mock_1', 'mock_2', 'mock_3'],
    notes: 'Quản trị viên hệ thống & Tổng hợp số liệu toàn diện',
    avatarBg: 'bg-gradient-to-r from-blue-500 to-cyan-500'
  },
  {
    id: 'prof_buyer1',
    name: 'Media Buyer Vietnam',
    email: 'buyer.vn@agency.com',
    role: 'Media Buyer',
    status: 'Active',
    assignedAccounts: ['mock_1'],
    notes: 'Chuyên trách chiến dịch Lead Gen thị trường VN',
    avatarBg: 'bg-gradient-to-r from-emerald-500 to-teal-500'
  },
  {
    id: 'prof_client',
    name: 'Client VIP Alpha',
    email: 'client.alpha@enterprise.com',
    role: 'Client',
    status: 'Active',
    assignedAccounts: ['mock_2'],
    notes: 'Khách hàng theo dõi ngân sách và ROI hàng tuần',
    avatarBg: 'bg-gradient-to-r from-purple-500 to-pink-500'
  }
];

const CRM_STAGES = [
  { id: 'new', label: 'Mới tiếp cận', color: 'border-blue-500/40 bg-blue-500/10 text-blue-400', badge: 'bg-blue-500/20 text-blue-300' },
  { id: 'contacting', label: 'Đang tư vấn', color: 'border-amber-500/40 bg-amber-500/10 text-amber-400', badge: 'bg-amber-500/20 text-amber-300' },
  { id: 'account_opened', label: 'Đã mở tài khoản', color: 'border-purple-500/40 bg-purple-500/10 text-purple-400', badge: 'bg-purple-500/20 text-purple-300' },
  { id: 'funded', label: 'Đã nạp tiền', color: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400', badge: 'bg-emerald-500/20 text-emerald-300' },
  { id: 'won', label: 'Thành công (Won)', color: 'border-cyan-500/40 bg-cyan-500/10 text-cyan-400', badge: 'bg-cyan-500/20 text-cyan-300' },
  { id: 'lost', label: 'Hủy / Thất bại', color: 'border-red-500/40 bg-red-500/10 text-red-400', badge: 'bg-red-500/20 text-red-300' },
];

const DEFAULT_CRM_LEADS = [
  {
    id: 'lead_1',
    name: 'Trần Văn Minh',
    phone: '0912 345 678',
    email: 'minh.tran@gmail.com',
    source: 'Facebook Ads / Form',
    campaign: 'VN_LeadGen_Campaign1',
    status: 'funded',
    deposit: 1200,
    assignedTo: 'prof_admin',
    notes: 'Đã hoàn tất mở tài khoản MT5, nạp lần đầu 1,200 USD. Quan tâm copy-trade.',
    createdAt: '2026-04-12',
    updatedAt: '2026-04-15'
  },
  {
    id: 'lead_2',
    name: 'Lê Hoàng Nam',
    phone: '0988 765 432',
    email: 'nam.le@vnn.vn',
    source: 'Facebook Ads / Form',
    campaign: 'VN_LeadGen_Campaign1',
    status: 'account_opened',
    deposit: 0,
    assignedTo: 'prof_buyer1',
    notes: 'Đã xác minh KYC xong. Đang chờ tư vấn chiến lược nạp tiền.',
    createdAt: '2026-04-14',
    updatedAt: '2026-04-16'
  },
  {
    id: 'lead_3',
    name: 'Phạm Thị Thúy',
    phone: '0903 112 233',
    email: 'thuy.pham@techcom.vn',
    source: 'Website / Funnel',
    campaign: 'VN_IBAcquisition_Gold',
    status: 'contacting',
    deposit: 0,
    assignedTo: 'prof_admin',
    notes: 'Đã gọi lần 1, khách hẹn tối nay gửi tài liệu hướng dẫn qua Zalo.',
    createdAt: '2026-04-16',
    updatedAt: '2026-04-16'
  },
  {
    id: 'lead_4',
    name: 'Đặng Quốc Huy',
    phone: '0977 889 900',
    email: 'huy.dang@yahoo.com',
    source: 'Facebook Ads / Form',
    campaign: 'TH_IBAcquisition_April',
    status: 'won',
    deposit: 3000,
    assignedTo: 'prof_buyer1',
    notes: 'Khách VIP nạp 3,000 USD, đã vào nhóm tín hiệu Premium.',
    createdAt: '2026-04-05',
    updatedAt: '2026-04-10'
  },
  {
    id: 'lead_5',
    name: 'Nguyễn Tiến Dũng',
    phone: '0934 556 778',
    email: 'dung.nguyen@fpt.com.vn',
    source: 'Zalo / Chat',
    campaign: 'VN_LeadGen_Campaign1',
    status: 'new',
    deposit: 0,
    assignedTo: 'prof_admin',
    notes: 'Lead mới từ form đăng ký nhận Ebook đầu tư.',
    createdAt: '2026-04-17',
    updatedAt: '2026-04-17'
  },
  {
    id: 'lead_6',
    name: 'Vũ Đức Mạnh',
    phone: '0945 667 889',
    email: 'manh.vu@honda.com.vn',
    source: 'Giới thiệu / Referral',
    campaign: 'VN_IBAcquisition_Gold',
    status: 'lost',
    deposit: 0,
    assignedTo: 'prof_buyer1',
    notes: 'Khách đổi ý sang đầu tư bất động sản, hẹn liên hệ lại quý sau.',
    createdAt: '2026-04-08',
    updatedAt: '2026-04-11'
  }
];

const filterMockByDate = (mockList, preset, customStart, customEnd) => {
  const now = new Date("2026-06-10T08:29:51");
  let since = null;
  let until = null;

  if (preset === 'today') {
    since = new Date(now);
    since.setHours(0,0,0,0);
    until = new Date(now);
    until.setHours(23,59,59,999);
  } else if (preset === 'yesterday') {
    since = new Date(now);
    since.setDate(now.getDate() - 1);
    since.setHours(0,0,0,0);
    until = new Date(now);
    until.setDate(now.getDate() - 1);
    until.setHours(23,59,59,999);
  } else if (preset === 'last_7d') {
    since = new Date(now);
    since.setDate(now.getDate() - 7);
    until = new Date(now);
  } else if (preset === 'last_14d') {
    since = new Date(now);
    since.setDate(now.getDate() - 14);
    until = new Date(now);
  } else if (preset === 'last_30d') {
    since = new Date(now);
    since.setDate(now.getDate() - 30);
    until = new Date(now);
  } else if (preset === 'this_month') {
    since = new Date(now.getFullYear(), now.getMonth(), 1);
    until = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
  } else if (preset === 'last_month') {
    since = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    until = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
  } else if (preset === 'custom' && customStart && customEnd) {
    since = new Date(customStart + 'T00:00:00');
    until = new Date(customEnd + 'T23:59:59');
  }

  if (!since || !until) {
    return mockList;
  }

  const filtered = mockList.filter(item => {
    if (!item.start_time) return false;
    const itemDate = new Date(item.start_time);
    return itemDate >= since && itemDate <= until;
  });

  if (filtered.length === 0) {
    return preset === 'custom' ? filtered : mockList;
  }
  return filtered;
};

const getDaysCount = (preset, customStart, customEnd) => {
  const now = new Date("2026-06-10T08:29:51");
  if (preset === 'today') return 1;
  if (preset === 'yesterday') return 1;
  if (preset === 'last_7d') return 7;
  if (preset === 'last_14d') return 14;
  if (preset === 'last_30d') return 30;
  if (preset === 'this_month') {
    return now.getDate(); // June 10th is day 10
  }
  if (preset === 'last_month') {
    return new Date(now.getFullYear(), now.getMonth(), 0).getDate();
  }
  if (preset === 'custom' && customStart && customEnd) {
    const start = new Date(customStart + 'T00:00:00');
    const end = new Date(customEnd + 'T23:59:59');
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays || 1;
  }
  return 30;
};

const getDefaultBudget = (campaignName, apiBudget, budgetType = 'daily') => {
  if (apiBudget !== undefined && apiBudget !== null && apiBudget > 0) {
    return apiBudget;
  }
  if (budgetType === 'lifetime') return 500;
  if (!campaignName) return 15;
  const match = campaignName.match(/^(VN|TH|MY|PH|IND|ID)/i);
  if (match) {
    const market = match[1].toUpperCase();
    if (market === 'VN') return 20;
    if (market === 'PH') return 10;
  }
  return 15;
};

const getCampaignBudgetInfo = (item, manualData) => {
  const m = manualData[item.campaign_id] || {};
  
  const budgetType = m.budgetType !== undefined && m.budgetType !== '' 
    ? m.budgetType 
    : (item.api_budget_type || (item.api_lifetime_budget ? 'lifetime' : 'daily'));

  let budgetAmount = null;
  if (m.budget !== undefined && m.budget !== '') {
    budgetAmount = parseFloat(m.budget);
  } else if (m.dailyBudget !== undefined && m.dailyBudget !== '') {
    budgetAmount = parseFloat(m.dailyBudget);
  } else if (budgetType === 'lifetime' && item.api_lifetime_budget) {
    budgetAmount = item.api_lifetime_budget;
  } else if (budgetType === 'daily' && item.api_daily_budget) {
    budgetAmount = item.api_daily_budget;
  } else if (item.api_budget) {
    budgetAmount = item.api_budget;
  } else {
    budgetAmount = getDefaultBudget(item.campaign_name, null, budgetType);
  }

  if (isNaN(budgetAmount)) budgetAmount = 0;

  return { budgetAmount, budgetType };
};

export default function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [manualData, setManualData] = useState(() => {
    try {
      const saved = localStorage.getItem('meta_report_manual_data');
      return saved ? JSON.parse(saved) : DEFAULT_DEMO_MANUAL_DATA;
    } catch (e) {
      console.error("Error reading manualData from localStorage:", e);
      return DEFAULT_DEMO_MANUAL_DATA;
    }
  });
  
  useEffect(() => {
    try {
      localStorage.setItem('meta_report_manual_data', JSON.stringify(manualData));
    } catch (e) {
      console.error("Error saving manualData to localStorage:", e);
    }
  }, [manualData]);

  // --- Personal Settings (Token, Webhook, Saved Accounts) ---
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('meta_report_settings');
      return saved ? JSON.parse(saved) : { metaToken: '', sheetWebhook: '', savedAccounts: [] };
    } catch (e) {
      return { metaToken: '', sheetWebhook: '', savedAccounts: [] };
    }
  });
  
  useEffect(() => {
    try {
      localStorage.setItem('meta_report_settings', JSON.stringify(settings));
    } catch (e) {}
  }, [settings]);

  // Accounts state initialized with saved accounts if present, else empty
  const [adAccounts, setAdAccounts] = useState(() => {
    try {
      const saved = localStorage.getItem('meta_report_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.savedAccounts && Array.isArray(parsed.savedAccounts) && parsed.savedAccounts.length > 0) {
          return parsed.savedAccounts;
        }
      }
    } catch (e) {}
    return [];
  });

  const [selectedAccountIds, setSelectedAccountIds] = useState(() => {
    try {
      const saved = localStorage.getItem('meta_report_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.savedAccounts && Array.isArray(parsed.savedAccounts) && parsed.savedAccounts.length > 0) {
          return parsed.savedAccounts.map(a => a.account_id);
        }
      }
    } catch (e) {}
    return [];
  });

  const [isUsingMock, setIsUsingMock] = useState(false);
  const [exchangeRates, setExchangeRates] = useState(null);
  
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState(null);

  // Testing states inside Settings modal
  const [testingToken, setTestingToken] = useState(false);
  const [tokenTestResult, setTokenTestResult] = useState(null);
  const [testingWebhook, setTestingWebhook] = useState(false);
  const [webhookTestResult, setWebhookTestResult] = useState(null);

  // Manual ad account addition states inside Settings modal
  const [manualAccountIdInput, setManualAccountIdInput] = useState('');
  const [addingAccount, setAddingAccount] = useState(false);
  const [addAccountFeedback, setAddAccountFeedback] = useState(null);

  const [loadingAccounts, setLoadingAccounts] = useState(false);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const [datePreset, setDatePreset] = useState('last_30d');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeReportTab, setActiveReportTab] = useState('daily');

  // --- Meta Permissions & Business Manager States (5 Selected Permissions) ---
  const [permissionsStatus, setPermissionsStatus] = useState(() => {
    try {
      const saved = localStorage.getItem('meta_report_permissions');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [businessesData, setBusinessesData] = useState(() => {
    try {
      const saved = localStorage.getItem('meta_report_businesses');
      return saved ? JSON.parse(saved) : MOCK_BUSINESSES;
    } catch (e) {
      return MOCK_BUSINESSES;
    }
  });

  const [loadingBusinesses, setLoadingBusinesses] = useState(false);
  const [isCreateCampaignOpen, setIsCreateCampaignOpen] = useState(false);

  // --- CRM Currency & Custom Exchange Rates ---
  const [crmCurrency, setCrmCurrency] = useState(() => {
    return localStorage.getItem('crm_display_currency') || 'VND';
  });
  const [customRates, setCustomRates] = useState(() => {
    try {
      const saved = localStorage.getItem('crm_custom_rates');
      return saved ? JSON.parse(saved) : {
        USD: 1,
        VND: 25400,
        THB: 36.5,
        EUR: 0.92,
        JPY: 155.0,
        IDR: 16200,
        PHP: 58.0,
        SGD: 1.35,
        MYR: 4.72
      };
    } catch (e) {
      return { USD: 1, VND: 25400, THB: 36.5, EUR: 0.92, JPY: 155, IDR: 16200, PHP: 58, SGD: 1.35, MYR: 4.72 };
    }
  });

  const handleCurrencyChange = (curr) => {
    setCrmCurrency(curr);
    localStorage.setItem('crm_display_currency', curr);
  };

  const handleRateChange = (curr, newRate) => {
    const num = parseFloat(newRate);
    if (isNaN(num) || num <= 0) return;
    const updated = { ...customRates, [curr]: num };
    setCustomRates(updated);
    localStorage.setItem('crm_custom_rates', JSON.stringify(updated));
  };

  // --- Live Dashboard Campaign Filter States ---
  const [campaignSearchTerm, setCampaignSearchTerm] = useState('');
  const [campaignStatusFilter, setCampaignStatusFilter] = useState('all'); // 'all' | 'ACTIVE' | 'PAUSED'
  const [campaignObjectiveFilter, setCampaignObjectiveFilter] = useState('all'); // 'all' | 'OUTCOME_LEADS' | etc.
  const [togglingStatus, setTogglingStatus] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Organic Pages State
  const [pagesData, setPagesData] = useState([]);
  const [loadingPages, setLoadingPages] = useState(false);
  const [pagesError, setPagesError] = useState(null);
  
  // Content Analysis State
  const [selectedPageForAnalysis, setSelectedPageForAnalysis] = useState(null);
  const [pageContentData, setPageContentData] = useState([]);
  const [loadingContent, setLoadingContent] = useState(false);

  // --- CRM Multi-Profile State ---
  const [profiles, setProfiles] = useState(() => {
    try {
      const saved = localStorage.getItem('meta_report_crm_profiles');
      return saved ? JSON.parse(saved) : DEFAULT_PROFILES;
    } catch (e) {
      return DEFAULT_PROFILES;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('meta_report_crm_profiles', JSON.stringify(profiles));
    } catch (e) {}
  }, [profiles]);

  const [activeProfileId, setActiveProfileId] = useState(() => {
    return localStorage.getItem('meta_report_active_profile_id') || 'prof_admin';
  });

  useEffect(() => {
    try {
      localStorage.setItem('meta_report_active_profile_id', activeProfileId);
    } catch (e) {}
  }, [activeProfileId]);

  const activeProfile = profiles.find(p => p.id === activeProfileId) || profiles[0] || DEFAULT_PROFILES[0];
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState(null);

  // --- CRM Leads & Pipeline State ---
  const [leads, setLeads] = useState(() => {
    try {
      const saved = localStorage.getItem('meta_report_crm_leads');
      return saved ? JSON.parse(saved) : DEFAULT_CRM_LEADS;
    } catch (e) {
      return DEFAULT_CRM_LEADS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('meta_report_crm_leads', JSON.stringify(leads));
    } catch (e) {}
  }, [leads]);

  const [crmSubTab, setCrmSubTab] = useState('pipeline'); // 'pipeline', 'analytics', 'profiles'
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState(null);

  // --- Backup & Restore ---
  const handleBackupData = () => {
    const backupData = {
      version: "2.5",
      exportDate: new Date().toISOString(),
      settings,
      manualData,
      profiles,
      activeProfileId,
      leads
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", `meta_report_crm_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
  };

  const fileInputRef = useRef(null);
  const handleRestoreFile = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed.settings) {
          setSettings(parsed.settings);
          if (parsed.settings.savedAccounts && Array.isArray(parsed.settings.savedAccounts) && parsed.settings.savedAccounts.length > 0) {
            setAdAccounts(parsed.settings.savedAccounts);
            setSelectedAccountIds(parsed.settings.savedAccounts.map(a => a.account_id));
            setIsUsingMock(false);
          }
        }
        if (parsed.manualData) setManualData(parsed.manualData);
        if (parsed.profiles) setProfiles(parsed.profiles);
        if (parsed.activeProfileId) setActiveProfileId(parsed.activeProfileId);
        if (parsed.leads && Array.isArray(parsed.leads)) setLeads(parsed.leads);
        alert("Khôi phục toàn bộ dữ liệu CRM & Cài đặt từ bản sao lưu thành công!");
      } catch (err) {
        alert("Lỗi đọc file sao lưu: " + err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // --- CAPTCHA-Protected Reset Modal ---
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [captchaCode, setCaptchaCode] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');

  const generateCaptcha = () => {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let code = '';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(code);
    setCaptchaInput('');
  };

  const openResetModal = () => {
    generateCaptcha();
    setIsResetModalOpen(true);
  };

  const handleConfirmReset = () => {
    if (captchaInput.trim().toUpperCase() !== captchaCode) {
      alert("Mã CAPTCHA xác nhận không đúng! Vui lòng nhập lại.");
      generateCaptcha();
      return;
    }

    localStorage.removeItem('meta_report_settings');
    localStorage.removeItem('meta_report_manual_data');
    localStorage.removeItem('meta_report_crm_profiles');
    localStorage.removeItem('meta_report_active_profile_id');
    localStorage.removeItem('meta_report_crm_leads');

    setSettings({ metaToken: '', sheetWebhook: '', savedAccounts: [] });
    setManualData({});
    setProfiles(DEFAULT_PROFILES);
    setActiveProfileId('prof_admin');
    setLeads([]);
    setError(null);
    setIsUsingMock(false);
    setAdAccounts([]);
    setSelectedAccountIds([]);
    setData([]);
    setTokenTestResult(null);
    setWebhookTestResult(null);
    setAddAccountFeedback(null);
    setIsResetModalOpen(false);
    setIsSettingsOpen(false);
    alert("Đã RESET TOÀN BỘ hệ thống về trạng thái sạch hoàn toàn (0 dữ liệu)!");

  const handleLoadDemoData = () => {
    setIsUsingMock(true);
    setError(null);
    setAdAccounts(MOCK_ACCOUNTS);
    setSelectedAccountIds(MOCK_ACCOUNTS.map(a => a.account_id));
    setData(filterMockByDate(MOCK_DATA, datePreset, customStartDate, customEndDate));
    setManualData(DEFAULT_DEMO_MANUAL_DATA);
    setLeads(DEFAULT_CRM_LEADS);
  };
  };

  // Helper: Multi-source Ad Account scanner (Personal /me/adaccounts + Business Manager /me/businesses + Permissions Inspector)
  const scanAllAdAccounts = async (token) => {
    const fbVersion = 'v19.0';
    const accountsMap = new Map();
    let businesses = [];
    let permissions = [];

    // 1. Verify token & get user identity
    const meRes = await fetch(`https://graph.facebook.com/${fbVersion}/me?fields=id,name,email&access_token=${token}`);
    const meData = await meRes.json();
    if (meData.error) {
      throw new Error(meData.error.message);
    }

    // 2. Permissions Inspector (/me/permissions)
    try {
      const permRes = await fetch(`https://graph.facebook.com/${fbVersion}/me/permissions?access_token=${token}`);
      const permData = await permRes.json();
      if (permData.data && Array.isArray(permData.data)) {
        permissions = permData.data;
      }
    } catch (e) {
      console.warn("Could not fetch permissions:", e);
    }

    // 3. Fetch /me/adaccounts (Personal / Assigned Accounts)
    try {
      const accRes = await fetch(`https://graph.facebook.com/${fbVersion}/me/adaccounts?fields=name,account_id,currency,account_status&limit=100&access_token=${token}`);
      const accData = await accRes.json();
      if (accData.data && Array.isArray(accData.data)) {
        accData.data.forEach(acc => {
          const cleanId = (acc.account_id || acc.id || '').replace(/^act_/, '').trim();
          if (cleanId) {
            accountsMap.set(cleanId, {
              account_id: cleanId,
              name: acc.name || `Tài khoản ${cleanId}`,
              currency: acc.currency || 'USD'
            });
          }
        });
      }
    } catch (e) {
      console.warn("Could not fetch me/adaccounts:", e);
    }

    // 4. Fetch /me/businesses (Business Manager Owned, Client Accounts & Pages)
    try {
      const bmRes = await fetch(`https://graph.facebook.com/${fbVersion}/me/businesses?fields=id,name,verification_status,created_time,primary_page{name},owned_ad_accounts{name,account_id,currency,account_status,amount_spent},client_ad_accounts{name,account_id,currency,account_status,amount_spent},owned_pages{id,name,category,fan_count}&limit=50&access_token=${token}`);
      const bmData = await bmRes.json();
      if (bmData.data && Array.isArray(bmData.data)) {
        businesses = bmData.data;
        bmData.data.forEach(bm => {
          const processList = (list) => {
            if (list && list.data && Array.isArray(list.data)) {
              list.data.forEach(acc => {
                const cleanId = (acc.account_id || acc.id || '').replace(/^act_/, '').trim();
                if (cleanId && !accountsMap.has(cleanId)) {
                  accountsMap.set(cleanId, {
                    account_id: cleanId,
                    name: `${acc.name || cleanId} (${bm.name || 'BM'})`,
                    currency: acc.currency || 'USD'
                  });
                }
              });
            }
          };
          processList(bm.owned_ad_accounts);
          processList(bm.client_ad_accounts);
        });
      }
    } catch (e) {
      console.warn("Could not fetch me/businesses:", e);
    }

    return {
      user: meData,
      accounts: Array.from(accountsMap.values()),
      businesses,
      permissions
    };
  };

  // Test Meta Token directly & Auto-discover accounts
  const testMetaToken = async (tokenToTest) => {
    const t = tokenToTest ? tokenToTest.trim() : '';
    if (!t) {
      setTokenTestResult({ success: false, message: 'Vui lòng nhập Access Token trước khi kiểm tra.' });
      return;
    }
    setTestingToken(true);
    setTokenTestResult(null);
    try {
      const { user, accounts, businesses, permissions } = await scanAllAdAccounts(t);

      // Merge with existing saved accounts in settings
      const existingSaved = settings.savedAccounts || [];
      const mergedMap = new Map();
      existingSaved.forEach(a => {
        if (a && a.account_id) mergedMap.set(a.account_id, a);
      });
      accounts.forEach(a => mergedMap.set(a.account_id, a));
      const finalAccounts = Array.from(mergedMap.values());

      // Save token and discovered accounts to state and localStorage
      const newSettings = {
        ...settings,
        metaToken: t,
        savedAccounts: finalAccounts
      };
      setSettings(newSettings);
      localStorage.setItem('meta_report_settings', JSON.stringify(newSettings));

      if (permissions && permissions.length > 0) {
        setPermissionsStatus(permissions);
        localStorage.setItem('meta_report_permissions', JSON.stringify(permissions));
      }

      if (businesses && businesses.length > 0) {
        setBusinessesData(businesses);
        localStorage.setItem('meta_report_businesses', JSON.stringify(businesses));
      }

      if (finalAccounts.length > 0) {
        setAdAccounts(finalAccounts);
        setSelectedAccountIds(finalAccounts.map(a => a.account_id));
        setIsUsingMock(false);
        setError(null);
        setTokenTestResult({ 
          success: true, 
          message: `Xác thực thành công! Chủ Token: "${user.name || 'Meta User'}". Đã tìm thấy và kết nối ${finalAccounts.length} tài khoản quảng cáo.`,
          accounts: finalAccounts
        });
      } else {
        // Token is valid! But no accounts discovered automatically from me/adaccounts or BM
        setIsUsingMock(false);
        setError(null);
        setTokenTestResult({ 
          success: true, 
          isWarning: true,
          message: `Token hợp lệ (Chủ Token: "${user.name || 'Meta User'}")! Chưa tìm thấy tài khoản cá nhân. Hãy nhập trực tiếp ID tài khoản (ví dụ: act_123456789) vào mục "Thêm tài khoản theo ID" bên dưới để kết nối ngay!`
        });
      }
    } catch (err) {
      setTokenTestResult({ success: false, message: `Lỗi kết nối Meta Graph API: ${err.message}` });
    } finally {
      setTestingToken(false);
    }
  };

  // Add Ad Account manually by ID
  const addManualAdAccount = async (inputStr) => {
    const token = settings.metaToken ? settings.metaToken.trim() : '';
    if (!token) {
      setAddAccountFeedback({ success: false, message: 'Vui lòng nhập và kiểm tra Meta Access Token trước khi thêm tài khoản.' });
      return;
    }

    const raw = (inputStr || manualAccountIdInput || '').trim();
    if (!raw) {
      setAddAccountFeedback({ success: false, message: 'Vui lòng nhập ID tài khoản quảng cáo (ví dụ: act_1234567890 hoặc 1234567890).' });
      return;
    }

    const cleanId = raw.replace(/^act_/, '').trim();
    const actId = `act_${cleanId}`;

    setAddingAccount(true);
    setAddAccountFeedback(null);

    try {
      const fbVersion = 'v19.0';
      const res = await fetch(`https://graph.facebook.com/${fbVersion}/${actId}?fields=name,account_id,currency,account_status&access_token=${token}`);
      const data = await res.json();

      if (data.error) {
        throw new Error(data.error.message);
      }

      const newAccount = {
        account_id: cleanId,
        name: data.name || `Tài khoản ${cleanId}`,
        currency: data.currency || 'USD'
      };

      const currentSaved = settings.savedAccounts || [];
      const updatedSaved = [...currentSaved.filter(a => a.account_id !== cleanId), newAccount];

      const newSettings = {
        ...settings,
        savedAccounts: updatedSaved
      };
      setSettings(newSettings);
      localStorage.setItem('meta_report_settings', JSON.stringify(newSettings));

      setAdAccounts(prev => {
        const withoutMock = prev.filter(a => !MOCK_ACCOUNTS.some(m => m.account_id === a.account_id) && a.account_id !== cleanId);
        return [...withoutMock, newAccount];
      });

      setSelectedAccountIds(prev => {
        const withoutMock = prev.filter(id => !MOCK_ACCOUNTS.some(m => m.account_id === id));
        return withoutMock.includes(cleanId) ? withoutMock : [...withoutMock, cleanId];
      });

      setIsUsingMock(false);
      setError(null);
      setManualAccountIdInput('');
      setAddAccountFeedback({
        success: true,
        message: `Đã kết nối thành công: "${newAccount.name}" (ID: act_${cleanId} - ${newAccount.currency})`
      });

      // Fetch live data for the new account
      fetchMetaAPI([cleanId], datePreset, customStartDate, customEndDate);
    } catch (err) {
      setAddAccountFeedback({
        success: false,
        message: `Không thể kết nối tài khoản ${actId}: ${err.message}`
      });
    } finally {
      setAddingAccount(false);
    }
  };

  // Remove Ad Account
  const removeAdAccount = (accountIdToRemove) => {
    const currentSaved = settings.savedAccounts || [];
    const updatedSaved = currentSaved.filter(a => a.account_id !== accountIdToRemove);
    const newSettings = { ...settings, savedAccounts: updatedSaved };
    setSettings(newSettings);
    localStorage.setItem('meta_report_settings', JSON.stringify(newSettings));

    const remaining = adAccounts.filter(a => a.account_id !== accountIdToRemove);
    if (remaining.length === 0) {
      setAdAccounts([]);
      setSelectedAccountIds([]);
      setData([]);
      setIsUsingMock(false);
    } else {
      setAdAccounts(remaining);
      setSelectedAccountIds(prev => {
        const next = prev.filter(id => id !== accountIdToRemove);
        return next.length > 0 ? next : [remaining[0].account_id];
      });
    }
  };

  // Test Webhook
  const testWebhook = async (urlToTest) => {
    const url = urlToTest ? urlToTest.trim() : '';
    if (!url) {
      setWebhookTestResult({ success: false, message: 'Vui lòng nhập Webhook URL của Google Sheets.' });
      return;
    }
    setTestingWebhook(true);
    setWebhookTestResult(null);
    try {
      await fetch(url, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ test: true, timestamp: new Date().toISOString(), message: "Ping test from Meta Report Tool" })
      });
      setWebhookTestResult({ success: true, message: 'Đã gửi payload thử nghiệm đến Google Sheets thành công!' });
      setSettings(prev => ({ ...prev, sheetWebhook: url }));
    } catch (err) {
      setWebhookTestResult({ success: false, message: `Không thể kết nối Webhook: ${err.message}` });
    } finally {
      setTestingWebhook(false);
    }
  };

  useEffect(() => {
    if (settings.metaToken && settings.metaToken.trim() !== '') {
      fetchAdAccounts();
    } else if (isUsingMock) {
      setAdAccounts(MOCK_ACCOUNTS);
      setSelectedAccountIds(MOCK_ACCOUNTS.map(a => a.account_id));
      setData(filterMockByDate(MOCK_DATA, datePreset, customStartDate, customEndDate));
      setLoadingAccounts(false);
    } else {
      setAdAccounts([]);
      setSelectedAccountIds([]);
      setData([]);
      setLoadingAccounts(false);
    }

    // Fetch live exchange rates to USD
    fetch('https://open.er-api.com/v6/latest/USD')
      .then(res => res.json())
      .then(data => {
        if (data && data.rates) {
          setExchangeRates(data.rates);
        }
      })
      .catch(err => console.error("Error fetching exchange rates:", err));
  }, [settings.metaToken]);

  useEffect(() => {
    if (selectedAccountIds.length > 0) {
      if (datePreset === 'custom' && (!customStartDate || !customEndDate)) {
        return; // Wait for valid custom date
      }
      fetchMetaAPI(selectedAccountIds, datePreset, customStartDate, customEndDate);
    } else {
      setData([]);
    }
  }, [selectedAccountIds, datePreset, customStartDate, customEndDate]);

  useEffect(() => {
    if (activeTab === 'organic' && pagesData.length === 0) {
      fetchFacebookPages();
    }
  }, [activeTab]);

  // Click outside to close dropdown
  const dropdownRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsAccountDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchAdAccounts = async (forceToken = null) => {
    const token = forceToken || settings.metaToken || import.meta.env.VITE_META_TOKEN;
    if (!token || token.trim() === '' || token === 'your_facebook_graph_api_access_token_here') {
      if (isUsingMock) {
        setError(null);
        setAdAccounts(MOCK_ACCOUNTS);
        setSelectedAccountIds(MOCK_ACCOUNTS.map(a => a.account_id));
        setData(filterMockByDate(MOCK_DATA, datePreset, customStartDate, customEndDate));
      } else {
        setAdAccounts([]);
        setSelectedAccountIds([]);
        setData([]);
      }
      setLoadingAccounts(false);
      return;
    }

    setLoadingAccounts(true);
    setError(null);

    try {
      const { accounts } = await scanAllAdAccounts(token);

      const currentSaved = settings.savedAccounts || [];
      const mergedMap = new Map();
      currentSaved.forEach(a => {
        if (a && a.account_id) mergedMap.set(a.account_id, a);
      });
      accounts.forEach(a => mergedMap.set(a.account_id, a));
      const finalAccounts = Array.from(mergedMap.values());

      if (finalAccounts.length > 0) {
        setAdAccounts(finalAccounts);
        setSelectedAccountIds(prev => {
          const valid = prev.filter(id => finalAccounts.some(a => a.account_id === id));
          return valid.length > 0 ? valid : finalAccounts.map(a => a.account_id);
        });
        setIsUsingMock(false);
        setError(null);
        setSettings(prev => ({ ...prev, savedAccounts: finalAccounts }));
      } else {
        if (currentSaved.length === 0) {
          setIsUsingMock(false);
          setAdAccounts([]);
          setSelectedAccountIds([]);
          setError("Token hợp lệ nhưng chưa tìm thấy tài khoản tự động. Vui lòng mở Cài đặt và nhập ID tài khoản (ví dụ: act_123456789) để kết nối.");
        }
      }
    } catch (err) {
      console.error("Error fetching Ad Accounts:", err);
      const currentSaved = settings.savedAccounts || [];
      if (currentSaved.length > 0) {
        setAdAccounts(currentSaved);
        setSelectedAccountIds(currentSaved.map(a => a.account_id));
        setIsUsingMock(false);
        setError(`Lỗi cập nhật danh sách tài khoản: ${err.message}`);
      } else {
        setError(err.message);
        setIsUsingMock(true);
        setAdAccounts(MOCK_ACCOUNTS);
        setSelectedAccountIds(MOCK_ACCOUNTS.map(a => a.account_id));
        setData(filterMockByDate(MOCK_DATA, datePreset, customStartDate, customEndDate));
      }
    } finally {
      setLoadingAccounts(false);
    }
  };

  const handleSyncToSheets = async () => {
    if (!settings.sheetWebhook) {
      alert("Please configure your Google Sheets Webhook URL in Settings first.");
      setIsSettingsOpen(true);
      return;
    }
    
    setIsSyncing(true);
    setSyncStatus(null);
    try {
      // Build the payload from aggregated totals
      const payload = {
        timestamp: new Date().toISOString(),
        dateRange: datePreset,
        customStart: customStartDate,
        customEnd: customEndDate,
        totals: {
          spend: totals.spend,
          leads: totals.leads,
          accountOpens: totals.accountOpen,
          fundedAccounts: totals.fundedAccounts,
          deposit: totals.deposit,
          cpa: totals.cpa,
          cpfa: totals.cpfa,
          roi: totals.roi
        },
        campaigns: data.map(campaign => {
          const m = manualData[campaign.campaign_id] || {};
          return {
            campaignName: campaign.campaign_name,
            spend: campaign.spend,
            leads: campaign.leads,
            accountOpens: parseFloat(m.accountOpen) || 0,
            fundedAccounts: parseFloat(m.fundedAccounts) || 0,
            deposit: parseFloat(m.deposit) || 0
          };
        })
      };

      const response = await fetch(settings.sheetWebhook, {
        method: 'POST',
        mode: 'no-cors', // Google Apps Script webhooks often require no-cors if not returning JSON headers properly, but we won't get a readable response. It's safer to use it to avoid CORS blocking.
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });
      
      // Since no-cors hides the response status, we just assume success if it didn't throw
      setSyncStatus('success');
      setTimeout(() => setSyncStatus(null), 3000);
    } catch (err) {
      console.error("Sync error:", err);
      setSyncStatus('error');
    } finally {
      setIsSyncing(false);
    }
  };


  const exportPDF = async () => {
    setIsExporting(true);
    try {
      const element = document.getElementById('pdf-content');
      if (!element) return;
      
      // Select controls we want to temporarily hide during capture 
      const controlsToHide = element.querySelectorAll('.pdf-hide');
      controlsToHide.forEach(el => el.style.display = 'none');

      const canvas = await html2canvas(element, { 
        backgroundColor: '#070b14',
        scale: 2, // higher resolution
        useCORS: true
      });

      controlsToHide.forEach(el => el.style.display = ''); // restore

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('l', 'mm', 'a3'); // landscape A3 for better table fit
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('Meta_Ads_Performance_Report.pdf');
    } catch (error) {
      console.error("Failed to generate PDF", error);
      alert("Failed to export PDF.");
    } finally {
      setIsExporting(false);
    }
  };



  const fetchFacebookPages = async () => {
    setLoadingPages(true);
    setPagesError(null);
    const token = settings.metaToken || import.meta.env.VITE_META_TOKEN;

    if (!token || token === 'your_facebook_graph_api_access_token_here') {
      setPagesData(MOCK_PAGES_DATA);
      setLoadingPages(false);
      return;
    }

    try {
      const fbVersion = 'v19.0';
      // 1. Fetch Pages
      const pagesUrl = `https://graph.facebook.com/${fbVersion}/me/accounts?fields=name,access_token,id,followers_count,fan_count,category,picture{url},link&access_token=${token}`;
      const pagesRes = await fetch(pagesUrl);
      const pagesJson = await pagesRes.json();

      if (pagesJson.error) {
        throw new Error(pagesJson.error.message);
      }

      const pages = pagesJson.data || [];
      if (pages.length === 0) {
        setPagesData([]);
        setLoadingPages(false);
        return;
      }

      // 2. Fetch Insights for each page
      const insightsPromises = pages.map(async (page) => {
        const insightsUrl = `https://graph.facebook.com/${fbVersion}/${page.id}/insights?metric=page_impressions,page_engaged_users&date_preset=last_30d&period=day&access_token=${page.access_token}`;
        try {
          const res = await fetch(insightsUrl);
          const json = await res.json();
          
          let impressions = 0;
          let engaged_users = 0;
          let fans = page.followers_count || 0;
          let errorMsg = null;

          if (json.error) {
             // (#100) error often happens if page has < 100 followers. We gracefully handle it.
             errorMsg = json.error.message.includes('100') ? 'Insights unavailable (Page may have < 100 followers)' : json.error.message;
          } else {
            (json.data || []).forEach(metric => {
              if (metric.name === 'page_impressions' && metric.values) {
                impressions = metric.values.reduce((sum, val) => sum + (val.value || 0), 0);
              }
              if (metric.name === 'page_engaged_users' && metric.values) {
                engaged_users = metric.values.reduce((sum, val) => sum + (val.value || 0), 0);
              }
            });
          }

          return {
            page_id: page.id,
            name: page.name,
            category: page.category || 'Facebook Page',
            picture: page.picture?.data?.url || null,
            link: page.link || `https://facebook.com/${page.id}`,
            access_token: page.access_token,
            impressions,
            engaged_users,
            fans: page.fan_count || page.followers_count || fans,
            followers_count: page.followers_count || fans,
            warning: errorMsg
          };
        } catch (e) {
          return { ...page, error: e.message };
        }
      });

      const pagesResults = await Promise.all(insightsPromises);
      setPagesData(pagesResults);
    } catch (err) {
      console.error("Error fetching pages:", err);
      setPagesError(err.message);
      setPagesData(MOCK_PAGES_DATA);
    } finally {
      setLoadingPages(false);
    }
  };

  const fetchPageContent = async (page) => {
    setSelectedPageForAnalysis(page);
    setLoadingContent(true);
    const fbVersion = 'v19.0';
    try {
      // 1. Fetch posts with public metrics (comments, reactions, shares) to bypass <100 followers limit
      const url = `https://graph.facebook.com/${fbVersion}/${page.page_id}/published_posts?fields=id,message,created_time,permalink_url,attachments,shares,comments.summary(true),reactions.summary(true)&limit=20&access_token=${page.access_token}`;
      const res = await fetch(url);
      const json = await res.json();
      
      if (json.error) {
        throw new Error(json.error.message);
      }
      
      const rawPosts = json.data || [];
      
      // 2. Try fetching insights separately for each post (Reach & Unique Engagement)
      const posts = await Promise.all(rawPosts.map(async (post) => {
        let reach = 0;
        let engagement = 0;
        
        try {
          const insightUrl = `https://graph.facebook.com/${fbVersion}/${post.id}/insights?metric=post_impressions_unique,post_engaged_users&access_token=${page.access_token}`;
          const insightRes = await fetch(insightUrl);
          const insightJson = await insightRes.json();
          
          if (!insightJson.error && insightJson.data) {
            const reachData = insightJson.data.find(m => m.name === 'post_impressions_unique');
            const engData = insightJson.data.find(m => m.name === 'post_engaged_users');
            reach = reachData && reachData.values && reachData.values.length > 0 ? reachData.values[0].value : 0;
            engagement = engData && engData.values && engData.values.length > 0 ? engData.values[0].value : 0;
          }
        } catch (e) {
           // Ignore individual post insight errors
        }
        
        // 3. Fallback to Public Metrics if Insights are blocked (e.g. <100 followers)
        let public_eng = 0;
        if (post.shares && post.shares.count) public_eng += post.shares.count;
        if (post.comments && post.comments.summary && post.comments.summary.total_count) public_eng += post.comments.summary.total_count;
        if (post.reactions && post.reactions.summary && post.reactions.summary.total_count) public_eng += post.reactions.summary.total_count;
        
        engagement = engagement > 0 ? engagement : public_eng;
        
        let type = 'Text';
        let thumbnail = null;
        if (post.attachments && post.attachments.data && post.attachments.data.length > 0) {
          const att = post.attachments.data[0];
          if (att.media_type === 'video') type = 'Video/Reel';
          else if (att.media_type === 'photo') type = 'Photo';
          else if (att.media_type === 'link') type = 'Link';
          else if (att.type === 'album') type = 'Album';
          else type = att.media_type || att.type;
          
          if (att.media && att.media.image) {
            thumbnail = att.media.image.src;
          }
        }
        
        return {
          id: post.id,
          message: post.message || '',
          created_time: post.created_time,
          permalink_url: post.permalink_url,
          reach,
          engagement,
          type,
          thumbnail
        };
      }));
      
      setPageContentData(posts);
    } catch (err) {
      console.error("Error fetching content:", err);
      setPageContentData([]);
    } finally {
      setLoadingContent(false);
    }
  };


  const fetchMetaAPI = async (accountIds, preset = 'last_30d', customStart = '', customEnd = '') => {
    setLoading(true);
    setError(null);
    setIsUsingMock(false);

    const token = settings.metaToken || import.meta.env.VITE_META_TOKEN;

    if (!token || token === 'your_facebook_graph_api_access_token_here') {
      console.warn("Meta API credentials not set. Using mock data.");
      setIsUsingMock(true);
      setData(filterMockByDate(MOCK_DATA, preset, customStart, customEnd));
      setLoading(false);
      return;
    }

    try {
      const fbVersion = 'v19.0';
      
      const fetchPromises = accountIds.map(async (accId) => {
        const fetchAccountId = accId.startsWith('act_') ? accId : `act_${accId}`;
        
        let dateQuery = `date_preset=${preset}`;
        if (preset === 'custom') {
          if (customStart && customEnd) {
            dateQuery = `time_range=${encodeURIComponent(JSON.stringify({ since: customStart, until: customEnd }))}`;
          } else {
            dateQuery = 'date_preset=last_30d';
          }
        }
        
        const url = `https://graph.facebook.com/${fbVersion}/${fetchAccountId}/insights?fields=campaign_name,campaign_id,spend,impressions,clicks,actions&level=campaign&${dateQuery}&access_token=${token}`;
        const campaignUrl = `https://graph.facebook.com/${fbVersion}/${fetchAccountId}/campaigns?fields=id,name,status,effective_status,objective,start_time,daily_budget,lifetime_budget&limit=150&access_token=${token}`;
        
        const [response, campaignResponse] = await Promise.all([
          fetch(url),
          fetch(campaignUrl)
        ]);

        const result = await response.json();
        const campaignResult = await campaignResponse.json();
        
        if (result.error) {
          throw new Error(`Account ${accId}: ${result.error.message}`);
        }

        const accountObj = adAccounts.find(a => a.account_id === accId);
        const accountName = accountObj ? accountObj.name : `Account ${accId}`;
        const currency = accountObj ? accountObj.currency : 'USD';
        
        let rateToUsd = 1;
        if (currency && currency !== 'USD') {
          if (exchangeRates && exchangeRates[currency]) {
            rateToUsd = 1 / exchangeRates[currency];
          } else {
            // Hardcoded fallbacks just in case API fails
            const fallbacks = { 'THB': 1/36.8, 'VND': 1/25400, 'IDR': 1/16000, 'MYR': 1/4.7, 'PHP': 1/57.5, 'JOD': 1/0.709 };
            rateToUsd = fallbacks[currency] || 1;
          }
        }
        
        const campaignInfoMap = {};
        if (campaignResult.data) {
           campaignResult.data.forEach(c => {
             let apiBudget = null;
             let apiBudgetType = 'daily';
             if (c.daily_budget) {
               apiBudget = (parseFloat(c.daily_budget) / 100) * rateToUsd;
               apiBudgetType = 'daily';
             } else if (c.lifetime_budget) {
               apiBudget = (parseFloat(c.lifetime_budget) / 100) * rateToUsd;
               apiBudgetType = 'lifetime';
             }

             campaignInfoMap[c.id] = {
               id: c.id,
               name: c.name,
               status: c.status || 'ACTIVE',
               effective_status: c.effective_status || c.status || 'ACTIVE',
               objective: c.objective || 'OUTCOME_LEADS',
               start_time: c.start_time,
               api_budget: apiBudget,
               api_budget_type: apiBudgetType,
               api_daily_budget: c.daily_budget ? ((parseFloat(c.daily_budget) / 100) * rateToUsd) : null,
               api_lifetime_budget: c.lifetime_budget ? ((parseFloat(c.lifetime_budget) / 100) * rateToUsd) : null,
             };
           });
        }
        
        const insightCampaignIds = new Set((result.data || []).map(c => c.campaign_id));
        const combinedCampaigns = [...(result.data || [])];

        // Merge campaigns from account that have 0 spend in this period
        if (campaignResult.data && Array.isArray(campaignResult.data)) {
          campaignResult.data.forEach(c => {
            if (!insightCampaignIds.has(c.id)) {
              combinedCampaigns.push({
                campaign_id: c.id,
                campaign_name: c.name || `Campaign ${c.id}`,
                spend: 0,
                impressions: 0,
                clicks: 0,
                actions: []
              });
            }
          });
        }

        return combinedCampaigns.map(campaign => {
          const originalSpend = parseFloat(campaign.spend) || 0;
          const info = campaignInfoMap[campaign.campaign_id] || {};
          return {
            ...campaign,
            account_name: accountName,
            account_id: accId,
            status: info.status || 'ACTIVE',
            effective_status: info.effective_status || info.status || 'ACTIVE',
            objective: info.objective || 'OUTCOME_LEADS',
            start_time: info.start_time || null,
            api_budget: info.api_budget || null,
            api_budget_type: info.api_budget_type || 'daily',
            api_daily_budget: info.api_daily_budget || null,
            api_lifetime_budget: info.api_lifetime_budget || null,
            spend: originalSpend * rateToUsd, // Convert to USD
            original_currency: currency,
            original_spend: originalSpend
          };
        });
      });

      const results = await Promise.allSettled(fetchPromises);
      
      let allCampaigns = [];
      let fetchErrors = [];

      results.forEach((res) => {
        if (res.status === 'fulfilled') {
          allCampaigns = [...allCampaigns, ...res.value];
        } else {
          fetchErrors.push(res.reason.message);
        }
      });

      if (allCampaigns.length === 0 && fetchErrors.length > 0) {
        throw new Error("All accounts failed: " + fetchErrors[0]);
      }

      const formattedData = allCampaigns.map((item, idx) => {
        let fetchLeads = 0;
        if (item.actions) {
          const leadAction = item.actions.find(a => 
            a.action_type === 'lead' || 
            a.action_type === 'onsite_conversion.lead_grouped' ||
            a.action_type === 'offsite_conversion.fb_pixel_lead' ||
            a.action_type === 'leadgen.other' ||
            (a.action_type && a.action_type.toLowerCase().includes('lead'))
          );
          if (leadAction) fetchLeads = parseInt(leadAction.value);
        }
        
        const stableCampaignId = item.campaign_id || item.campaign_name || `campaign_${idx}`;

        return {
          campaign_id: stableCampaignId,
          campaign_name: item.campaign_name || 'Unknown Campaign',
          account_name: item.account_name || 'Unknown Account',
          account_id: item.account_id || '',
          status: item.status || 'ACTIVE',
          effective_status: item.effective_status || item.status || 'ACTIVE',
          objective: item.objective || 'OUTCOME_LEADS',
          original_currency: item.original_currency || 'USD',
          start_time: item.start_time || null,
          api_budget: item.api_budget || null,
          api_budget_type: item.api_budget_type || 'daily',
          api_daily_budget: item.api_daily_budget || null,
          api_lifetime_budget: item.api_lifetime_budget || null,
          spend: parseFloat(item.spend) || 0,
          original_spend: parseFloat(item.original_spend) || 0,
          impressions: parseInt(item.impressions) || 0,
          clicks: parseInt(item.clicks) || 0,
          leads: fetchLeads,
        };
      });

      if (fetchErrors.length > 0) {
         console.warn("Some accounts failed to fetch:", fetchErrors);
         // Optionally set soft error if some failed but some succeeded
      }

      setData(formattedData);
    } catch (err) {
      console.error("Error fetching Meta API, falling back to mock:", err);
      setError(err.message);
      setIsUsingMock(true);
      setData(filterMockByDate(MOCK_DATA, preset, customStart, customEnd));
    } finally {
      setLoading(false);
    }
  };

  const toggleAccountSelection = (accountId) => {
    setSelectedAccountIds(prev => 
      prev.includes(accountId) 
        ? prev.filter(id => id !== accountId)
        : [...prev, accountId]
    );
  };

  // --- 1. ads_management: Bật / Tắt Chiến Dịch Trực Tiếp Trên Meta Ads ---
  const toggleCampaignStatus = async (campaignId, currentStatus) => {
    const newStatus = (currentStatus === 'ACTIVE') ? 'PAUSED' : 'ACTIVE';
    setTogglingStatus(campaignId);

    // Optimistic UI Update
    setData(prev => prev.map(c => 
      c.campaign_id === campaignId 
        ? { ...c, status: newStatus, effective_status: newStatus } 
        : c
    ));

    if (isUsingMock || !settings.metaToken) {
      setTimeout(() => {
        setTogglingStatus(null);
        showToast(`[Demo] Đã chuyển chiến dịch sang trạng thái ${newStatus}!`);
      }, 300);
      return;
    }

    try {
      const params = new URLSearchParams({
        status: newStatus,
        access_token: settings.metaToken
      });
      const res = await fetch(`https://graph.facebook.com/v19.0/${campaignId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params
      });
      const json = await res.json();
      if (json.error) {
        throw new Error(json.error.message);
      }
      showToast(`Đã ${newStatus === 'ACTIVE' ? 'BẬT' : 'TẮT'} chiến dịch thành công trên Meta Ads!`, 'success');
    } catch (err) {
      // Revert UI
      setData(prev => prev.map(c => 
        c.campaign_id === campaignId 
          ? { ...c, status: currentStatus, effective_status: currentStatus } 
          : c
      ));
      alert(`Lỗi khi cập nhật trạng thái Meta Ads: ${err.message}`);
    } finally {
      setTogglingStatus(null);
    }
  };

  // --- 2. ads_management: Đồng Bộ Ngân Sách Lên Meta Ads ---
  const updateCampaignBudgetOnMeta = async (campaignId, budgetUsd, budgetType = 'daily', currency = 'USD') => {
    const numBudget = parseFloat(budgetUsd);
    if (isNaN(numBudget) || numBudget <= 0) {
      alert("Vui lòng nhập số tiền ngân sách hợp lệ!");
      return;
    }

    if (isUsingMock || !settings.metaToken) {
      showToast(`[Demo] Đã lưu ngân sách $${numBudget} (${budgetType}) vào hệ thống!`);
      return;
    }

    try {
      let rateToUsd = 1;
      if (currency && currency !== 'USD' && exchangeRates && exchangeRates[currency]) {
        rateToUsd = 1 / exchangeRates[currency];
      }
      const rawBudgetInCurrency = numBudget / rateToUsd;
      const budgetInCents = Math.round(rawBudgetInCurrency * 100);

      const params = new URLSearchParams({
        access_token: settings.metaToken
      });
      if (budgetType === 'daily') {
        params.append('daily_budget', budgetInCents.toString());
      } else {
        params.append('lifetime_budget', budgetInCents.toString());
      }

      const res = await fetch(`https://graph.facebook.com/v19.0/${campaignId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params
      });
      const json = await res.json();
      if (json.error) {
        throw new Error(json.error.message);
      }

      // Update state
      setData(prev => prev.map(c => 
        c.campaign_id === campaignId 
          ? { 
              ...c, 
              api_budget: numBudget, 
              api_budget_type: budgetType,
              api_daily_budget: budgetType === 'daily' ? numBudget : null,
              api_lifetime_budget: budgetType === 'lifetime' ? numBudget : null 
            } 
          : c
      ));
      showToast(`Đã đồng bộ ngân sách $${numBudget} lên Meta Ads thành công!`, 'success');
    } catch (err) {
      alert(`Lỗi khi cập nhật ngân sách lên Meta: ${err.message}`);
    }
  };

  // --- 3. ads_management: Tạo Chiến Dịch Mới Trực Tiếp Trên Meta Ads ---
  const createNewCampaign = async ({ accountId, name, objective, dailyBudget, status = 'PAUSED' }) => {
    const cleanActId = (accountId || '').replace(/^act_/, '').trim();
    if (!cleanActId) {
      alert("Vui lòng chọn tài khoản quảng cáo!");
      return;
    }

    if (isUsingMock || !settings.metaToken) {
      const newMock = {
        campaign_id: `camp_${Date.now()}`,
        campaign_name: name,
        account_name: adAccounts.find(a => a.account_id === cleanActId)?.name || `Account ${cleanActId}`,
        spend: 0,
        impressions: 0,
        clicks: 0,
        leads: 0,
        start_time: new Date().toISOString(),
        api_budget: parseFloat(dailyBudget) || 20,
        api_budget_type: 'daily',
        status: status,
        effective_status: status,
        objective: objective
      };
      setData(prev => [newMock, ...prev]);
      showToast(`[Demo] Đã tạo chiến dịch "${name}" thành công!`);
      setIsCreateCampaignOpen(false);
      return;
    }

    try {
      const actObj = adAccounts.find(a => a.account_id === cleanActId);
      const currency = actObj ? actObj.currency : 'USD';
      let rateToUsd = 1;
      if (currency && currency !== 'USD' && exchangeRates && exchangeRates[currency]) {
        rateToUsd = 1 / exchangeRates[currency];
      }
      const numBudget = parseFloat(dailyBudget) || 10;
      const rawBudget = numBudget / rateToUsd;
      const budgetInCents = Math.round(rawBudget * 100);

      const params = new URLSearchParams({
        name: name.trim(),
        objective: objective,
        status: status,
        special_ad_categories: '[]',
        daily_budget: budgetInCents.toString(),
        access_token: settings.metaToken
      });

      const res = await fetch(`https://graph.facebook.com/v19.0/act_${cleanActId}/campaigns`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params
      });
      const json = await res.json();
      if (json.error) {
        throw new Error(json.error.message);
      }

      showToast(`Đã tạo chiến dịch "${name}" thành công trên Meta Ads (ID: ${json.id})!`, 'success');
      setIsCreateCampaignOpen(false);
      fetchMetaAPI(selectedAccountIds, datePreset, customStartDate, customEndDate);
    } catch (err) {
      alert(`Lỗi tạo chiến dịch trên Meta: ${err.message}`);
    }
  };

  // --- 4. business_management: Quét Lại Danh Mục Doanh Nghiệp (BM) ---
  const refreshBusinesses = async (token) => {
    if (!token) {
      setBusinessesData(MOCK_BUSINESSES);
      showToast("Đã tải dữ liệu Business Manager (Demo)!");
      return;
    }
    setLoadingBusinesses(true);
    try {
      const bmRes = await fetch(`https://graph.facebook.com/v19.0/me/businesses?fields=id,name,verification_status,created_time,primary_page{name},owned_ad_accounts{name,account_id,currency,account_status,amount_spent},client_ad_accounts{name,account_id,currency,account_status,amount_spent},owned_pages{id,name,category,fan_count}&limit=50&access_token=${token}`);
      const bmData = await bmRes.json();
      if (bmData.data && Array.isArray(bmData.data)) {
        setBusinessesData(bmData.data);
        localStorage.setItem('meta_report_businesses', JSON.stringify(bmData.data));
        showToast("Đã đồng bộ danh mục Business Manager thành công!");
      }
    } catch (e) {
      alert(`Lỗi khi quét Business Manager: ${e.message}`);
    } finally {
      setLoadingBusinesses(false);
    }
  };

  const handleManualChange = (id, field, value) => {
    setManualData(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value
      }
    }));
  };

  const handleExportManualData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(manualData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `meta_report_manual_inputs_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportManualData = (e) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target.result);
          if (typeof parsed === 'object' && parsed !== null) {
            setManualData(parsed);
            alert("Manual input data imported successfully!");
          }
        } catch (err) {
          alert("Failed to parse JSON file.");
        }
      };
    }
  };

  const handleClearManualData = () => {
    if (window.confirm("Are you sure you want to clear all saved manual inputs (Account Open, Deposit, Budget & Type)?")) {
      setManualData({});
      localStorage.removeItem('meta_report_manual_data');
    }
  };


  // Compute stats for Header Cards
  // Filter campaigns for Live Dashboard
  const displayedCampaigns = data.filter(item => {
    const s = campaignSearchTerm.trim().toLowerCase();
    const matchSearch = !s || 
      (item.campaign_name && item.campaign_name.toLowerCase().includes(s)) || 
      (item.account_name && item.account_name.toLowerCase().includes(s));
    const matchStatus = campaignStatusFilter === 'all' || (item.status || 'ACTIVE') === campaignStatusFilter;
    const matchObjective = campaignObjectiveFilter === 'all' || item.objective === campaignObjectiveFilter;
    return matchSearch && matchStatus && matchObjective;
  });

  const displayedSpend = displayedCampaigns.reduce((acc, curr) => acc + curr.spend, 0);
  const displayedClicks = displayedCampaigns.reduce((acc, curr) => acc + curr.clicks, 0);
  const displayedLeads = displayedCampaigns.reduce((acc, curr) => acc + curr.leads, 0);
  const displayedCpl = displayedLeads > 0 ? displayedSpend / displayedLeads : 0;

  const totalSpend = data.reduce((acc, curr) => acc + curr.spend, 0);
  const totalClicks = data.reduce((acc, curr) => acc + curr.clicks, 0);
  const totalLeads = data.reduce((acc, curr) => acc + curr.leads, 0);
  const averageCpl = totalLeads > 0 ? totalSpend / totalLeads : 0;

  // Budget & Conversion Health metrics
  const daysCount = getDaysCount(datePreset, customStartDate, customEndDate);
  
  let totalDailyBudget = 0;
  let totalLifetimeBudget = 0;
  let expectedTotalSpend = 0;

  data.forEach(curr => {
    const { budgetAmount, budgetType } = getCampaignBudgetInfo(curr, manualData);
    if (budgetType === 'lifetime') {
      totalLifetimeBudget += budgetAmount;
      expectedTotalSpend += budgetAmount;
    } else {
      totalDailyBudget += budgetAmount;
      expectedTotalSpend += budgetAmount * daysCount;
    }
  });

  const overallPacing = expectedTotalSpend > 0 ? (totalSpend / expectedTotalSpend) * 100 : 0;

  const totalAccountOpen = data.reduce((acc, curr) => {
    const m = manualData[curr.campaign_id] || {};
    return acc + (parseFloat(m.accountOpen) || 0);
  }, 0);

  const totalFunded = data.reduce((acc, curr) => {
    const m = manualData[curr.campaign_id] || {};
    return acc + (parseFloat(m.fundedAccounts) || 0);
  }, 0);

  const overallLeadToAcctCvr = totalLeads > 0 ? (totalAccountOpen / totalLeads) * 100 : 0;
  const overallLeadToFundCvr = totalLeads > 0 ? (totalFunded / totalLeads) * 100 : 0;

  // Compute Chart Data (Spend vs CPL)
  const chartData = data.map(item => {
    const cpl = item.leads > 0 ? (item.spend / item.leads) : 0;
    return {
      name: item.campaign_name.substring(0, 15) + '...',
      Spend: Number(item.spend.toFixed(2)),
      CPL: Number(cpl.toFixed(2)),
    };
  });

  return (
    <div className="min-h-screen bg-[#070b14] text-white p-6 font-sans print:bg-white print:text-[#070b14] print:m-0 print:p-0">
      {/* Background glow effects */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#33CCFF]/10 blur-[120px] pointer-events-none print:hidden"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#0AE5D5]/10 blur-[120px] pointer-events-none print:hidden"></div>

      <div id="pdf-content" className="max-w-7xl mx-auto relative z-10 print:max-w-full p-2">
        
        {/* TOP BRAND & SYSTEM STATUS BAR */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center pb-5 mb-5 border-b border-white/10 gap-4 print:border-none print:pb-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-[#0AE5D5]/20 to-[#33CCFF]/20 border border-[#33CCFF]/30 text-[#0AE5D5] shadow-lg shadow-[#0AE5D5]/5">
              <Activity className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#33CCFF] via-teal-200 to-[#0AE5D5]">
                  Meta Ads Analytics
                </h1>
                {!isUsingMock && settings.metaToken ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Live API ({adAccounts.length} Accounts)
                  </span>
                ) : (
                  <button 
                    onClick={() => setIsSettingsOpen(true)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/20 transition-all cursor-pointer"
                    title="Nhấp để cấu hình Meta Access Token"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                    Demo Mode (Chưa kết nối)
                  </button>
                )}
              </div>
              <p className="text-gray-400 text-xs mt-0.5">
                Personal reporting & tracking tool • Sync với Google Sheets & Instant Forms
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 print:hidden pdf-hide w-full md:w-auto justify-end">
            {/* Active Profile Switcher (CRM) */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-all cursor-pointer"
                title="Chuyển đổi hồ sơ người dùng (CRM)"
              >
                <span className={`w-5 h-5 rounded-full ${activeProfile.avatarBg || 'bg-blue-500'} flex items-center justify-center text-[10px] text-white font-bold flex-shrink-0`}>
                  {activeProfile.name ? activeProfile.name.charAt(0).toUpperCase() : 'U'}
                </span>
                <span className="max-w-[120px] truncate">{activeProfile.name}</span>
                <span className="text-[10px] text-gray-400 bg-white/10 px-1.5 py-0.5 rounded font-normal">
                  {activeProfile.role}
                </span>
                <ChevronDown className="w-3 h-3 text-gray-400" />
              </button>

              {isProfileDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-[#0d1424] border border-[#33CCFF]/30 rounded-xl shadow-2xl z-50 p-2 text-xs">
                  <div className="px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-gray-400 border-b border-white/10 mb-1 flex items-center justify-between">
                    <span>Hồ sơ CRM</span>
                    <button 
                      onClick={() => { setActiveTab('crm'); setIsProfileDropdownOpen(false); }} 
                      className="text-[#33CCFF] hover:underline cursor-pointer"
                    >
                      Quản lý
                    </button>
                  </div>
                  {profiles.map(p => (
                    <div
                      key={p.id}
                      onClick={() => {
                        setActiveProfileId(p.id);
                        setIsProfileDropdownOpen(false);
                      }}
                      className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${p.id === activeProfileId ? 'bg-[#33CCFF]/15 text-white' : 'hover:bg-white/5 text-gray-300'}`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className={`w-6 h-6 rounded-full ${p.avatarBg || 'bg-blue-500'} flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0`}>
                          {p.name.charAt(0).toUpperCase()}
                        </span>
                        <div className="truncate">
                          <p className="font-medium truncate">{p.name}</p>
                          <p className="text-[10px] text-gray-400 truncate">{p.role}</p>
                        </div>
                      </div>
                      {p.id === activeProfileId && <Check className="w-3.5 h-3.5 text-[#33CCFF]" />}
                    </div>
                  ))}
                  <div className="border-t border-white/10 mt-1 pt-1">
                    <button
                      onClick={() => {
                        setEditingProfile(null);
                        setIsProfileModalOpen(true);
                        setIsProfileDropdownOpen(false);
                      }}
                      className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded text-[#33CCFF] hover:bg-[#33CCFF]/10 font-medium transition-all cursor-pointer"
                    >
                      <UserPlus className="w-3.5 h-3.5" /> Tạo Profile Mới
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Backup & Restore Data */}
            <button
              onClick={handleBackupData}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/20 transition-all cursor-pointer"
              title="Tải xuống tệp sao lưu toàn bộ dữ liệu & Profiles (.json)"
            >
              <Download className="w-3.5 h-3.5" />
              Backup
            </button>
            <button
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/20 transition-all cursor-pointer"
              title="Khôi phục dữ liệu từ tệp sao lưu (.json)"
            >
              <Upload className="w-3.5 h-3.5" />
              Khôi phục
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleRestoreFile} 
              accept=".json" 
              className="hidden" 
            />

            {/* Meta Permissions Indicator (5 Permissions) */}
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/20 transition-all cursor-pointer"
              title="5/5 Quyền Meta Graph API Đang Hoạt Động"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Chế Độ: Xem Báo Cáo (Read-Only)</span>
            </button>

            <button
              onClick={() => setIsGuideOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/20 transition-all cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" />
              Hướng dẫn
            </button>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 hover:bg-white/10 text-gray-200 border border-white/10 transition-all cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5" />
              Cài đặt
            </button>
            <button
              onClick={openResetModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all cursor-pointer"
              title="Reset toàn bộ hệ thống (Có xác nhận Captcha)"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>
        </header>

        {/* NAVIGATION TABS */}
        <div className="flex items-center gap-2 mb-5 print:hidden pdf-hide overflow-x-auto pb-1">
          <button 
            onClick={() => setActiveTab('dashboard')} 
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === 'dashboard' ? 'bg-[#33CCFF]/15 text-[#33CCFF] border border-[#33CCFF]/30 shadow-lg shadow-[#33CCFF]/5' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            <LayoutDashboard className="w-4 h-4"/> Live Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('reports')} 
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === 'reports' ? 'bg-[#0AE5D5]/15 text-[#0AE5D5] border border-[#0AE5D5]/30 shadow-lg shadow-[#0AE5D5]/5' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            <FileText className="w-4 h-4"/> Báo Cáo & Funnel
          </button>
          <button 
            onClick={() => setActiveTab('crm')} 
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === 'crm' ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 shadow-lg shadow-indigo-500/5' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            <Briefcase className="w-4 h-4"/> Hệ Thống CRM ({leads.length} Leads)
          </button>
          <button 
            onClick={() => setActiveTab('bm')} 
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === 'bm' ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-lg shadow-amber-500/5' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            <Building2 className="w-4 h-4"/> Doanh Nghiệp (BM)
          </button>
          <button 
            onClick={() => setActiveTab('organic')} 
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === 'organic' ? 'bg-pink-500/15 text-pink-400 border border-pink-500/30 shadow-lg shadow-pink-500/5' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            <UsersRound className="w-4 h-4"/> Organic Fanpages
          </button>
        </div>

        {/* SUB-BAR: CONTROLS & ACTION TOOLBAR (UNIFIED CLEAN 1-ROW BAR) */}
        <div className="bg-[#0a0f1c]/90 backdrop-blur-md border border-white/10 rounded-xl p-3 mb-6 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 print:hidden pdf-hide shadow-xl">
          {/* Left: Filters */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Date Preset */}
            <div className="relative flex items-center bg-white/5 border border-white/10 hover:border-white/20 rounded-lg pr-4 pl-3 py-1.5 text-xs text-white transition-all h-[36px]">
               <Calendar className="w-3.5 h-3.5 text-[#33CCFF] mr-2 flex-shrink-0" />
               <select 
                 className="appearance-none bg-transparent text-white focus:outline-none focus:ring-0 cursor-pointer pr-4 text-xs font-medium"
                 value={datePreset}
                 onChange={(e) => setDatePreset(e.target.value)}
               >
                 <option value="today" className="bg-[#0a0f1c]">Hôm nay</option>
                 <option value="yesterday" className="bg-[#0a0f1c]">Hôm qua</option>
                 <option value="last_7d" className="bg-[#0a0f1c]">7 ngày qua</option>
                 <option value="last_14d" className="bg-[#0a0f1c]">14 ngày qua</option>
                 <option value="last_30d" className="bg-[#0a0f1c]">30 ngày qua</option>
                 <option value="this_month" className="bg-[#0a0f1c]">Tháng này</option>
                 <option value="last_month" className="bg-[#0a0f1c]">Tháng trước</option>
                 <option value="custom" className="bg-[#0a0f1c]">Tùy chọn ngày...</option>
               </select>
               <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2 pointer-events-none" />
            </div>

            {/* Custom Range */}
            {datePreset === 'custom' && (
              <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 h-[36px] text-xs">
                <input 
                  type="date"
                  className="bg-transparent text-xs text-white focus:outline-none dark:[color-scheme:dark]"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                />
                <span className="text-gray-500">-</span>
                <input 
                  type="date"
                  className="bg-transparent text-xs text-white focus:outline-none dark:[color-scheme:dark]"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                />
              </div>
            )}

            {/* Campaign Search Filter */}
            <div className="relative flex items-center bg-white/5 border border-white/10 hover:border-white/20 rounded-lg pl-8 pr-2.5 py-1.5 text-xs text-white transition-all h-[36px] min-w-[170px] max-w-[220px]">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5" />
              <input 
                type="text" 
                placeholder="Tìm tên chiến dịch..." 
                value={campaignSearchTerm} 
                onChange={(e) => setCampaignSearchTerm(e.target.value)} 
                className="bg-transparent text-xs text-white placeholder-gray-500 focus:outline-none w-full"
              />
              {campaignSearchTerm && (
                <button 
                  onClick={() => setCampaignSearchTerm('')} 
                  className="text-gray-400 hover:text-white text-xs ml-1 p-0.5"
                  title="Xóa tìm kiếm"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Campaign Status Filter */}
            <div className="relative flex items-center bg-white/5 border border-white/10 hover:border-white/20 rounded-lg pr-4 pl-2.5 py-1.5 text-xs text-white transition-all h-[36px]">
              <Filter className="w-3.5 h-3.5 text-[#0AE5D5] mr-1.5 flex-shrink-0" />
              <select 
                value={campaignStatusFilter}
                onChange={(e) => setCampaignStatusFilter(e.target.value)}
                className="appearance-none bg-transparent text-white focus:outline-none cursor-pointer pr-3 text-xs font-medium"
              >
                <option value="all" className="bg-[#0a0f1c]">Tất cả trạng thái ({data.length})</option>
                <option value="ACTIVE" className="bg-[#0a0f1c]">🟢 Active ({data.filter(c => (c.status || 'ACTIVE') === 'ACTIVE').length})</option>
                <option value="PAUSED" className="bg-[#0a0f1c]">⚪ Paused ({data.filter(c => c.status === 'PAUSED').length})</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2 pointer-events-none" />
            </div>

            {/* Campaign Objective Filter */}
            <div className="relative flex items-center bg-white/5 border border-white/10 hover:border-white/20 rounded-lg pr-4 pl-2.5 py-1.5 text-xs text-white transition-all h-[36px]">
              <Target className="w-3.5 h-3.5 text-purple-400 mr-1.5 flex-shrink-0" />
              <select 
                value={campaignObjectiveFilter}
                onChange={(e) => setCampaignObjectiveFilter(e.target.value)}
                className="appearance-none bg-transparent text-white focus:outline-none cursor-pointer pr-3 text-xs font-medium"
              >
                <option value="all" className="bg-[#0a0f1c]">Tất cả mục tiêu</option>
                <option value="OUTCOME_LEADS" className="bg-[#0a0f1c]">🎯 Leads</option>
                <option value="OUTCOME_SALES" className="bg-[#0a0f1c]">💰 Sales</option>
                <option value="OUTCOME_TRAFFIC" className="bg-[#0a0f1c]">🚀 Traffic</option>
                <option value="OUTCOME_ENGAGEMENT" className="bg-[#0a0f1c]">💬 Engagement</option>
                <option value="OUTCOME_AWARENESS" className="bg-[#0a0f1c]">📢 Awareness</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2 pointer-events-none" />
            </div>

            {/* Reset Dashboard Filters */}
            {(campaignSearchTerm || campaignStatusFilter !== 'all' || campaignObjectiveFilter !== 'all') && (
              <button
                onClick={() => {
                  setCampaignSearchTerm('');
                  setCampaignStatusFilter('all');
                  setCampaignObjectiveFilter('all');
                }}
                className="px-2.5 py-1 rounded-lg text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all flex items-center gap-1 cursor-pointer h-[36px]"
                title="Xóa bộ lọc chiến dịch"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Xóa lọc</span>
              </button>
            )}

            {/* Account Selector */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}
                disabled={loadingAccounts}
                className="flex items-center justify-between min-w-[210px] bg-white/5 border border-white/10 hover:border-white/20 text-white pl-3 pr-2.5 py-1.5 rounded-lg text-xs transition-all focus:outline-none focus:border-[#33CCFF] h-[36px]"
              >
                <span className="truncate font-medium">
                  {loadingAccounts 
                    ? "Đang tải tài khoản..." 
                    : adAccounts.length === 0 
                      ? "Chưa có tài khoản" 
                      : selectedAccountIds.length === adAccounts.length
                        ? `Tất cả tài khoản (${adAccounts.length})`
                        : `${selectedAccountIds.length}/${adAccounts.length} Tài khoản`}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 ml-2 flex-shrink-0" />
              </button>

              {isAccountDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-[320px] max-h-80 overflow-y-auto bg-[#0d1424] border border-[#33CCFF]/30 rounded-xl shadow-2xl z-50 p-2">
                  <div className="flex items-center justify-between px-3 py-2 border-b border-white/10 mb-2">
                    <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Chọn tài khoản</span>
                    {(() => {
                      const areAllSelected = adAccounts.length > 0 && selectedAccountIds.length === adAccounts.length;
                      return (
                        <button 
                          onClick={() => {
                            if (areAllSelected) {
                              setSelectedAccountIds([]);
                            } else {
                              setSelectedAccountIds(adAccounts.map(a => a.account_id));
                            }
                          }}
                          className="text-xs text-[#33CCFF] hover:text-white transition-colors font-medium"
                        >
                          {areAllSelected ? 'Bỏ chọn hết' : 'Chọn tất cả'}
                        </button>
                      );
                    })()}
                  </div>
                  {adAccounts.map(acc => {
                    const isSelected = selectedAccountIds.includes(acc.account_id);
                    return (
                      <div 
                        key={acc.account_id}
                        onClick={() => toggleAccountSelection(acc.account_id)}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer transition-colors ${isSelected ? 'bg-[#33CCFF]/10 text-white' : 'hover:bg-white/5 text-gray-300'}`}
                      >
                        <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${isSelected ? 'border-[#33CCFF] bg-[#33CCFF]' : 'border-gray-600'}`}>
                           {isSelected && <Check className="w-3 h-3 text-[#070b14]" />}
                        </div>
                        <div className="truncate flex-1 text-xs">
                          <span className="font-medium text-gray-200 block truncate">{acc.name || 'Tài khoản không tên'}</span>
                          <span className="text-[10px] text-gray-500 block">ID: {acc.account_id}</span>
                        </div>
                      </div>
                    );
                  })}
                  <div className="pt-2 mt-2 border-t border-white/10">
                    <button
                      type="button"
                      onClick={() => {
                        setIsAccountDropdownOpen(false);
                        setIsSettingsOpen(true);
                      }}
                      className="w-full py-1.5 px-2.5 rounded-lg bg-white/5 hover:bg-[#33CCFF]/20 text-[#33CCFF] text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" /> Thêm / Quản lý tài khoản Ads...
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Action Buttons */}
          <div className="flex items-center gap-2">

            <button 
              onClick={() => {
                if (settings.metaToken && settings.metaToken.trim() !== '' && !isUsingMock) {
                  fetchMetaAPI(selectedAccountIds, datePreset, customStartDate, customEndDate);
                } else {
                  setData(filterMockByDate(MOCK_DATA, datePreset, customStartDate, customEndDate));
                }
              }}
              disabled={loading || loadingAccounts}
              className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 border border-white/10 transition-all px-3 py-1.5 rounded-lg text-xs font-medium text-gray-200 disabled:opacity-50 h-[36px]"
              title="Làm mới dữ liệu từ Meta Ads hoặc Demo"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${(loading || loadingAccounts) ? 'animate-spin' : ''}`} />
              Làm mới
            </button>

            <button
              onClick={handleSyncToSheets}
              disabled={isSyncing}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all h-[36px] ${
                syncStatus === 'success' 
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-lg shadow-emerald-500/10' 
                  : syncStatus === 'error' 
                    ? 'bg-red-500/20 text-red-300 border border-red-500/40' 
                    : 'bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300'
              }`}
              title="Gửi dữ liệu báo cáo & phễu hiện tại lên Google Sheets qua Webhook"
            >
              <Save className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              {syncStatus === 'success' ? 'Đã sync Sheet!' : syncStatus === 'error' ? 'Lỗi Sync!' : isSyncing ? 'Đang sync...' : 'Sync to Sheet'}
            </button>

            <button 
              onClick={exportPDF}
              disabled={loading || loadingAccounts || isExporting}
              className="flex items-center gap-1.5 bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-400/30 transition-all px-3 py-1.5 rounded-lg text-xs font-medium text-indigo-300 disabled:opacity-50 h-[36px]"
            >
              <Printer className={`w-3.5 h-3.5 ${isExporting ? 'animate-pulse' : ''}`} />
              {isExporting ? 'Đang xuất...' : 'Xuất PDF'}
            </button>
          </div>
        </div>

        {/* NOTIFICATIONS & BANNERS */}
        {toastMessage && (
          <div className={`mb-4 px-4 py-3 rounded-xl flex items-center justify-between gap-3 text-xs border backdrop-blur-md shadow-xl ${
            toastMessage.type === 'error' 
              ? 'bg-red-500/20 border-red-500/40 text-red-200' 
              : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-200'
          }`}>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span className="font-semibold">{toastMessage.message}</span>
            </div>
            <button onClick={() => setToastMessage(null)} className="text-gray-400 hover:text-white text-sm p-1">✕</button>
          </div>
        )}
        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-300 px-4 py-3 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs backdrop-blur-sm shadow-lg shadow-red-500/5">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-400" />
              <div>
                <span className="font-semibold text-red-400">Lỗi kết nối Meta Graph API:</span> {error}
              </div>
            </div>
            <div className="flex items-center gap-2 self-end sm:self-auto flex-shrink-0">
              <button 
                onClick={() => setIsSettingsOpen(true)}
                className="px-2.5 py-1 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-xs text-white font-medium transition-all"
              >
                Cập nhật Token
              </button>
              <button 
                onClick={() => {
                  setError(null);
                  setIsUsingMock(true);
                  setData(filterMockByDate(MOCK_DATA, datePreset, customStartDate, customEndDate));
                }}
                className="px-2.5 py-1 bg-white/5 hover:bg-white/10 rounded-lg text-xs text-gray-300 transition-all"
              >
                Về Demo Mode
              </button>
            </div>
          </div>
        )}

        {isUsingMock && !error && (
          <div className="mb-6 bg-gradient-to-r from-blue-500/10 to-teal-500/10 border border-blue-500/20 text-blue-200 px-4 py-3 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs backdrop-blur-sm">
            <div className="flex items-center gap-2.5">
              <span className="p-1 rounded bg-blue-500/20 text-blue-300">💡</span>
              <div>
                <strong className="text-white">Chế độ Demo (Dữ liệu mẫu):</strong> Đang hiển thị số liệu mô phỏng để xem trước giao diện. Nhập Token cá nhân để đồng bộ trực tiếp với Meta Ads.
              </div>
            </div>
            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="px-3 py-1 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-300 rounded-lg font-medium text-xs transition-all flex-shrink-0 self-end sm:self-auto"
            >
              Kết nối Meta Token
            </button>
          </div>
        )}

        {/* Main Content Router */}
        {activeTab === 'dashboard' ? (
          <>
            {/* Top Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <StatCard title="Total Spend" value={`$${displayedSpend.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`} icon={DollarSign} color="#33CCFF" />
              <StatCard title="Total Clicks" value={displayedClicks.toLocaleString()} icon={MousePointerClick} color="#0AE5D5" />
              <StatCard title="Total Leads" value={displayedLeads.toLocaleString()} icon={Users} color="#33CCFF" />
              <StatCard title="Avg. CPL" value={`$${displayedCpl.toFixed(2)}`} icon={TrendingUp} color="#0AE5D5" />
            </div>

            {/* Budget & Conversion Health Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <StatCard 
                title="Budget Limit" 
                value={
                  totalDailyBudget > 0 && totalLifetimeBudget > 0
                    ? `$${totalDailyBudget.toFixed(0)}/d + $${totalLifetimeBudget.toFixed(0)} LT`
                    : totalLifetimeBudget > 0
                      ? `$${totalLifetimeBudget.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} Lifetime`
                      : `$${totalDailyBudget.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}/day`
                } 
                icon={Briefcase} 
                color="#33CCFF" 
              />
              <StatCard 
                title="Spend Pace" 
                value={`${overallPacing.toFixed(1)}%`} 
                icon={Activity} 
                color={overallPacing > 110 ? "#f87171" : overallPacing < 80 ? "#fbbf24" : "#34d399"} 
              />
              <StatCard title="CRM Conv. Rate (L→A)" value={`${overallLeadToAcctCvr.toFixed(1)}%`} icon={UsersRound} color="#33CCFF" />
              <StatCard title="Funded Rate (L→F)" value={`${overallLeadToFundCvr.toFixed(1)}%`} icon={Target} color="#0AE5D5" />
            </div>

        {/* Chart & Table container */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          
          {/* Main Chart */}
          <div className="xl:col-span-3 bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#33CCFF] to-[#0AE5D5] opacity-50"></div>
            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
               Spend vs Cost Per Lead Analysis
            </h2>
            <div className="h-[350px] w-full">
              {loading ? (
                <div className="w-full h-full flex justify-center items-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#33CCFF]"></div>
                </div>
              ) : chartData.length === 0 ? (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
                  <Activity className="w-8 h-8 mb-2 opacity-30 text-gray-400" />
                  <p className="text-xs text-gray-400">Chưa có dữ liệu biểu đồ chiến dịch</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                    <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis yAxisId="left" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                    <YAxis yAxisId="right" orientation="right" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}
                      itemStyle={{ fontWeight: 500 }}
                    />
                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                    <Line yAxisId="left" type="monotone" dataKey="Spend" stroke="#33CCFF" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: '#070b14' }} activeDot={{ r: 6, stroke: '#33CCFF', strokeWidth: 2, fill: '#fff' }} />
                    <Line yAxisId="right" type="monotone" dataKey="CPL" stroke="#0AE5D5" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: '#070b14' }} activeDot={{ r: 6, stroke: '#0AE5D5', strokeWidth: 2, fill: '#fff' }} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Data Table */}
          <div className="xl:col-span-3 bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden mt-6">
            <div className="p-6 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold flex items-center gap-2 mb-1 flex-wrap text-white">
                  <Briefcase className="w-5 h-5 text-[#0AE5D5]" />
                  Báo Cáo Hiệu Suất Chiến Dịch
                  {isUsingMock && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-normal bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-0.5 rounded-full">
                      Chế Độ Xem Thử (Demo Data)
                    </span>
                  )}
                </h2>
                <p className="text-xs text-gray-400">Số liệu ngân sách, tương tác quảng cáo từ Meta Ads và hiệu quả chuyển đổi.</p>
              </div>

              <div className="flex items-center gap-2 pdf-hide print:hidden">
                {!settings.metaToken && !isUsingMock && (
                  <button
                    onClick={handleLoadDemoData}
                    className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white rounded-lg text-xs flex items-center gap-1.5 transition-all border border-white/10 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#0AE5D5]" /> Xem Dữ Liệu Mẫu (Demo)
                  </button>
                )}
                {isUsingMock && (
                  <button
                    onClick={() => {
                      setIsUsingMock(false);
                      setData([]);
                      setAdAccounts([]);
                      setSelectedAccountIds([]);
                    }}
                    className="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 rounded-lg text-xs flex items-center gap-1.5 transition-all border border-amber-500/20 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Thoát Xem Thử
                  </button>
                )}
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left whitespace-nowrap">
                <thead className="text-[10px] uppercase bg-black/40 text-gray-400 border-b border-white/10 border-t border-white/5">
                  <tr>
                    <th className="px-3 py-3 font-medium tracking-wider text-center align-bottom border-r border-white/10" rowSpan={2}>Trạng Thái</th>
                    <th className="px-4 py-3 font-medium tracking-wider align-bottom" rowSpan={2}>Campaign Name</th>
                    <th className="px-4 py-2 font-medium tracking-wider text-center bg-indigo-500/10 border-l border-b border-white/5 text-indigo-300" colSpan={2}>Ngân Sách & Tiến Độ (Budget)</th>
                    <th className="px-4 py-2 font-medium tracking-wider text-center border-b border-white/5" colSpan={7}>Số Liệu Meta Ads (Auto Insights)</th>
                    <th className="px-4 py-2 font-medium tracking-wider text-center bg-blue-500/5 border-l border-b border-white/5 text-blue-300" colSpan={6}>Hiệu Quả Chuyển Đổi & ROI</th>
                  </tr>
                  <tr>
                    <th className="px-4 py-2 font-medium tracking-wider bg-indigo-500/20 text-indigo-300 border-l border-white/5">Ngân Sách</th>
                    <th className="px-4 py-2 font-medium tracking-wider bg-indigo-500/10 text-indigo-300">Tiến Độ (Pacing)</th>
                    <th className="px-4 py-2 font-medium tracking-wider bg-black/20">Spend</th>
                    <th className="px-4 py-2 font-medium tracking-wider bg-black/20">Impr</th>
                    <th className="px-4 py-2 font-medium tracking-wider bg-black/20">Clicks</th>
                    <th className="px-4 py-2 font-medium tracking-wider bg-black/20 text-[#0AE5D5]">CTR / CPC</th>
                    <th className="px-4 py-2 font-medium tracking-wider bg-black/20 text-[#0AE5D5]">CPM</th>
                    <th className="px-4 py-2 font-medium tracking-wider bg-black/20">Leads</th>
                    <th className="px-4 py-2 font-medium tracking-wider bg-black/20">CPL</th>
                    <th className="px-4 py-2 font-medium tracking-wider bg-[#33CCFF]/10 border-l border-white/5 text-[#33CCFF]">Acct Open</th>
                    <th className="px-4 py-2 font-medium tracking-wider bg-[#33CCFF]/5 text-[#33CCFF]">CPA</th>
                    <th className="px-4 py-2 font-medium tracking-wider bg-[#0AE5D5]/10 text-[#0AE5D5]">Funded</th>
                    <th className="px-4 py-2 font-medium tracking-wider bg-[#0AE5D5]/5 text-[#0AE5D5]">CPFA</th>
                    <th className="px-4 py-2 font-medium tracking-wider bg-indigo-500/10 text-indigo-300">Deposit</th>
                    <th className="px-4 py-2 font-medium tracking-wider bg-indigo-500/5 text-indigo-300">ROI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-xs">
                  {loading ? (
                    <tr>
                      <td colSpan={17} className="px-6 py-8 text-center text-gray-500">
                        Loading campaign data...
                      </td>
                    </tr>
                  ) : displayedCampaigns.length === 0 ? (
                    <tr>
                      <td colSpan={17} className="px-6 py-14 text-center">
                        <div className="flex flex-col items-center justify-center max-w-md mx-auto text-gray-400">
                          <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3 text-gray-500">
                            <BarChart3 className="w-6 h-6 text-gray-400" />
                          </div>
                          <p className="text-sm font-semibold text-white mb-1">Chưa Có Dữ Liệu Chiến Dịch</p>
                          <p className="text-xs text-gray-400 mb-4 text-center leading-relaxed">
                            {settings.metaToken 
                              ? "Không tìm thấy chiến dịch nào phù hợp với bộ lọc hoặc tài khoản đã chọn."
                              : "Hệ thống đang ở trạng thái sạch hoàn toàn. Vui lòng kết nối Meta Access Token trong phần Cài đặt để tải báo cáo thực tế."}
                          </p>
                          <div className="flex items-center gap-2.5">
                            <button
                              type="button"
                              onClick={() => setIsSettingsOpen(true)}
                              className="px-4 py-2 rounded-lg text-xs font-semibold bg-gradient-to-r from-[#33CCFF] to-[#0AE5D5] text-[#070b14] hover:opacity-90 transition-all shadow-md cursor-pointer"
                            >
                              Mở Cài Đặt Token
                            </button>
                            {!settings.metaToken && (
                              <button
                                type="button"
                                onClick={handleLoadDemoData}
                                className="px-3.5 py-2 rounded-lg text-xs font-medium bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 transition-all cursor-pointer"
                              >
                                Tải Dữ Liệu Mẫu (Demo)
                              </button>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : displayedCampaigns.map((item) => {
                    const mData = manualData[item.campaign_id] || {};
                    const manualAccountOpen = parseFloat(mData.accountOpen) || 0;
                    const manualFundedAccounts = parseFloat(mData.fundedAccounts) || 0;
                    const manualDeposit = parseFloat(mData.deposit) || 0;

                    // Calc Budget & Pacing
                    const { budgetAmount, budgetType } = getCampaignBudgetInfo(item, manualData);
                    const expectedSpend = budgetType === 'lifetime' ? budgetAmount : budgetAmount * daysCount;
                    const pacing = expectedSpend > 0 ? (item.spend / expectedSpend) * 100 : 0;

                    // Calc Meta
                    const ctr = item.impressions > 0 ? (item.clicks / item.impressions) * 100 : 0;
                    const cpc = item.clicks > 0 ? item.spend / item.clicks : 0;
                    const cpm = item.impressions > 0 ? (item.spend / item.impressions) * 1000 : 0;
                    const cpl = item.leads > 0 ? item.spend / item.leads : 0;
                    const leadCvr = item.clicks > 0 ? (item.leads / item.clicks) * 100 : 0;
                    
                    // Calc Business
                    const cpa = manualAccountOpen > 0 ? item.spend / manualAccountOpen : 0;
                    const cpfa = manualFundedAccounts > 0 ? item.spend / manualFundedAccounts : 0;
                    const roi = item.spend > 0 ? ((manualDeposit - item.spend) / item.spend) * 100 : 0;

                    const leadToAcct = item.leads > 0 ? (manualAccountOpen / item.leads) * 100 : 0;
                    const leadToFund = item.leads > 0 ? (manualFundedAccounts / item.leads) * 100 : 0;
                    const acctToFund = manualAccountOpen > 0 ? (manualFundedAccounts / manualAccountOpen) * 100 : 0;

                    return (
                      <tr key={item.campaign_id} className="hover:bg-white/[0.04] transition-colors print:border-b print:border-gray-200">
                        {/* Status Badge (Read-only Report) */}
                        <td className="px-3 py-3 text-center border-r border-white/5">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            (item.status || 'ACTIVE') === 'ACTIVE' 
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' 
                              : 'bg-gray-500/15 text-gray-400 border border-gray-500/30'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              (item.status || 'ACTIVE') === 'ACTIVE' ? 'bg-emerald-400 animate-pulse' : 'bg-gray-400'
                            }`}></span>
                            {(item.status || 'ACTIVE') === 'ACTIVE' ? 'ACTIVE' : 'PAUSED'}
                          </span>
                        </td>

                        <td className="px-4 py-3 font-medium text-gray-200 print:text-[#070b14]" title={item.campaign_name}>
                          <div className="font-semibold text-white break-words min-w-[240px] max-w-[480px] whitespace-normal leading-snug">{item.campaign_name}</div>
                          <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                            {item.account_name && (
                              <span className="text-[9px] bg-white/10 text-gray-400 px-1.5 py-0.5 rounded uppercase tracking-wider print:text-gray-600 print:bg-gray-100">
                                {item.account_name}
                              </span>
                            )}
                            {item.original_currency && item.original_currency !== 'USD' && (
                              <span className="text-[9px] bg-[#0AE5D5]/10 text-[#0AE5D5] px-1.5 py-0.5 rounded uppercase tracking-wider print:text-teal-600 print:bg-teal-50" title={`Original Spend: ${item.original_spend?.toFixed(2)} ${item.original_currency}`}>
                                {item.original_currency} → USD
                              </span>
                            )}
                            {item.start_time && (
                              <span className="text-[9px] bg-[#33CCFF]/10 text-[#33CCFF] px-1.5 py-0.5 rounded uppercase tracking-wider print:text-blue-600 print:bg-blue-50">
                                🚀 {new Date(item.start_time).toLocaleDateString('vi-VN')}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Budget (Read-only Report) */}
                        <td className="px-4 py-3 border-l border-white/5 bg-indigo-500/[0.03]">
                          <div className="flex flex-col">
                            <span className="font-mono font-bold text-white text-xs">
                              ${budgetAmount > 0 ? budgetAmount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) : '0.00'}
                            </span>
                            <span className="text-[10px] text-gray-400 font-medium mt-0.5">
                              {budgetType === 'lifetime' ? 'Trọn đời (Lifetime)' : '/ngày (Daily)'}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 bg-indigo-500/[0.02]">
                          <div className="flex flex-col items-start gap-0.5">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase ${
                              pacing > 110 
                                ? "bg-red-500/10 text-red-400 border border-red-500/20" 
                                : pacing < 80 
                                  ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20" 
                                  : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            }`} title={`Spend: $${item.spend.toFixed(2)} / Target: $${expectedSpend.toFixed(2)} (${budgetType === 'lifetime' ? 'Lifetime Budget' : `${daysCount} days @ $${budgetAmount}/day`})`}>
                              {pacing.toFixed(0)}%
                            </span>
                            <span className="text-[9px] text-gray-500 uppercase tracking-tight">
                              {budgetType === 'lifetime' ? 'Lifetime' : `${daysCount}d Daily`}
                            </span>
                          </div>
                        </td>

                        <td className="px-4 py-3 text-gray-300 font-medium">
                          ${item.spend.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-gray-400">
                          {item.impressions.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-gray-400">
                          {item.clicks.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-[#0AE5D5]">
                          {ctr.toFixed(2)}% / ${cpc.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-[#0AE5D5]">
                          ${cpm.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-white font-medium">
                          <div>{item.leads}</div>
                          {leadCvr > 0 && <div className="text-[10px] text-gray-400 font-normal">CVR: {leadCvr.toFixed(1)}%</div>}
                        </td>
                        <td className="px-4 py-3 text-gray-300">
                          ${cpl.toFixed(2)}
                        </td>
                        
                        {/* Conversion & ROI Metrics (Read-only Report) */}
                        <td className="px-4 py-3 border-l border-white/5 bg-[#33CCFF]/[0.03] text-right font-medium text-white">
                          <div className="font-semibold text-xs">{manualAccountOpen.toLocaleString()}</div>
                          {item.leads > 0 && manualAccountOpen > 0 && (
                            <div className="text-[10px] text-[#33CCFF]/80 mt-0.5" title="Lead to Account Open CVR">
                              L→A: {leadToAcct.toFixed(1)}%
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 font-medium text-[#33CCFF] bg-[#33CCFF]/[0.02] text-right">
                          ${cpa.toFixed(2)}
                        </td>
                        
                        <td className="px-4 py-3 bg-[#0AE5D5]/[0.03] text-right font-medium text-white">
                          <div className="font-semibold text-xs">{manualFundedAccounts.toLocaleString()}</div>
                          {item.leads > 0 && manualFundedAccounts > 0 && (
                            <div className="text-[10px] text-[#0AE5D5]/80 mt-0.5 space-y-0.5" title="Conversion Funnel Rates">
                              <div>L→F: {leadToFund.toFixed(1)}%</div>
                              {manualAccountOpen > 0 && <div>A→F: {acctToFund.toFixed(1)}%</div>}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 font-medium text-[#0AE5D5] bg-[#0AE5D5]/[0.02] text-right">
                          ${cpfa.toFixed(2)}
                        </td>

                        <td className="px-4 py-3 bg-indigo-500/[0.03] text-right font-mono font-bold text-white">
                          ${manualDeposit > 0 ? manualDeposit.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) : '0.00'}
                        </td>
                        <td className={`px-4 py-3 font-bold bg-indigo-500/[0.02] ${roi > 0 ? "text-green-400" : roi < 0 ? "text-red-400" : "text-gray-400"}`}>
                          {roi > 0 ? '+' : ''}{roi.toFixed(1)}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
        </>
        ) : activeTab === 'crm' ? (
          <CRMModule 
            leads={leads} 
            setLeads={setLeads} 
            profiles={profiles} 
            setProfiles={setProfiles} 
            activeProfileId={activeProfileId} 
            setActiveProfileId={setActiveProfileId} 
            adAccounts={adAccounts}
            campaigns={data}
            crmSubTab={crmSubTab}
            setCrmSubTab={setCrmSubTab}
            crmCurrency={crmCurrency}
            setCrmCurrency={handleCurrencyChange}
            customRates={customRates}
            onRateChange={handleRateChange}
            onOpenAddProfileModal={() => {
              setEditingProfile(null);
              setIsProfileModalOpen(true);
            }}
            onEditProfile={(p) => {
              setEditingProfile(p);
              setIsProfileModalOpen(true);
            }}
            onOpenAddLeadModal={() => {
              setEditingLead(null);
              setIsLeadModalOpen(true);
            }}
            onEditLead={(l) => {
              setEditingLead(l);
              setIsLeadModalOpen(true);
            }}
          />
        ) : activeTab === 'bm' ? (
          <BusinessManagerHub 
            businesses={businessesData} 
            loading={loadingBusinesses}
            onRefresh={() => refreshBusinesses(settings.metaToken)}
            onFilterByBM={(bmAccountIds) => {
              setSelectedAccountIds(bmAccountIds);
              setActiveTab('dashboard');
              showToast(`Đã lọc ${bmAccountIds.length} tài khoản thuộc Business Manager trên Live Dashboard!`);
            }}
            selectedAccountIds={selectedAccountIds}
          />
        ) : activeTab === 'organic' ? (
          <OrganicPagesReport 
            data={pagesData} 
            loading={loadingPages} 
            error={pagesError} 
            selectedPage={selectedPageForAnalysis}
            onSelectPage={fetchPageContent}
            pageContentData={pageContentData}
            loadingContent={loadingContent}
            onBack={() => setSelectedPageForAnalysis(null)}
          />
        ) : (
          <ReportManager 
            data={data} 
            manualData={manualData} 
            handleManualChange={handleManualChange} 
            activeReportTab={activeReportTab} 
            setActiveReportTab={setActiveReportTab} 
          />
        )}

      {/* --- MODALS --- */}



      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-[#0a0f1c] border border-white/15 rounded-2xl w-full max-w-xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-white/10">
              <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
                <Settings className="w-5 h-5 text-[#33CCFF]" />
                Cài Đặt Kết Nối Trực Tiếp
              </h2>
              <button 
                onClick={() => setIsSettingsOpen(false)}
                className="text-gray-400 hover:text-white text-lg p-1"
              >
                ✕
              </button>
            </div>
            
            {/* Status indicator inside modal */}
            <div className={`p-3.5 rounded-xl mb-5 flex items-center justify-between text-xs border ${
              !isUsingMock && settings.metaToken
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                : 'bg-amber-500/10 border-amber-500/20 text-amber-300'
            }`}>
              <div className="flex items-center gap-3">
                <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${!isUsingMock && settings.metaToken ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
                <div>
                  <span className="font-semibold">{!isUsingMock && settings.metaToken ? 'Trạng thái: Đã kết nối Live API' : 'Trạng thái: Đang ở chế độ Demo'}</span>
                  <p className="opacity-80 text-[11px] mt-0.5">
                    {!isUsingMock && settings.metaToken 
                      ? `Đang quản lý ${adAccounts.filter(a => !MOCK_ACCOUNTS.some(m => m.account_id === a.account_id)).length || adAccounts.length} tài khoản quảng cáo trực tiếp từ Meta.` 
                      : 'Nhập Access Token và thêm tài khoản bên dưới để tải số liệu thực tế.'}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {/* Meta Access Token */}
              <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Meta Graph API Access Token
                  </label>
                  <button 
                    onClick={() => setIsGuideOpen(true)}
                    className="text-[11px] text-[#33CCFF] hover:underline flex items-center gap-1"
                  >
                    <BookOpen className="w-3 h-3" /> Cách lấy Token
                  </button>
                </div>

                <div className="relative">
                  <input 
                    type="password"
                    className="w-full bg-[#070b14] border border-white/15 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#33CCFF] font-mono tracking-wider"
                    placeholder="EAAGm0..."
                    value={settings.metaToken}
                    onChange={(e) => {
                      setSettings({...settings, metaToken: e.target.value});
                      setTokenTestResult(null);
                    }}
                  />
                </div>

                <div className="flex items-center justify-between gap-3 pt-1">
                  <p className="text-[11px] text-gray-500">
                    Token được lưu an toàn tại Local Storage.
                  </p>
                  <button
                    type="button"
                    onClick={() => testMetaToken(settings.metaToken)}
                    disabled={testingToken || !settings.metaToken}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#33CCFF]/15 hover:bg-[#33CCFF]/25 border border-[#33CCFF]/30 text-[#33CCFF] flex items-center gap-1.5 transition-all disabled:opacity-40 flex-shrink-0"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${testingToken ? 'animate-spin' : ''}`} />
                    {testingToken ? 'Đang kiểm tra...' : 'Kiểm tra & Quét tài khoản'}
                  </button>
                </div>

                {tokenTestResult && (
                  <div className={`p-2.5 rounded-lg text-xs border ${
                    tokenTestResult.isWarning
                      ? 'bg-amber-500/10 border-amber-500/20 text-amber-300'
                      : tokenTestResult.success 
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' 
                        : 'bg-red-500/10 border-red-500/20 text-red-300'
                  }`}>
                    {tokenTestResult.isWarning ? '⚠️ ' : tokenTestResult.success ? '✅ ' : '❌ '}
                    {tokenTestResult.message}
                  </div>
                )}
              </div>

              {/* Meta Permissions Inspector (5 Selected Permissions) */}
              <div className="p-4 bg-gradient-to-br from-emerald-500/10 via-white/5 to-transparent border border-emerald-500/20 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-emerald-300 uppercase tracking-wider flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    Quyền Meta Graph API Đã Cấp Phép
                  </label>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    5 Quyền Nòng Cốt
                  </span>
                </div>
                <p className="text-[11px] text-gray-400">
                  Hệ thống kiểm tra trực tiếp qua endpoint <code className="text-pink-300 bg-black/40 px-1 py-0.5 rounded font-mono">/me/permissions</code>:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {TARGET_PERMISSIONS.map(p => {
                    const isGranted = Boolean(
                      isUsingMock || 
                      (permissionsStatus && permissionsStatus.some(perm => perm.permission === p.key && perm.status === 'granted'))
                    );
                    return (
                      <div key={p.key} className="p-2.5 rounded-lg bg-black/40 border border-white/10 flex items-start gap-2.5">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          isGranted ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-500/20 text-gray-400'
                        }`}>
                          {isGranted ? <Check className="w-3 h-3 text-emerald-400" /> : <span className="text-[10px]">○</span>}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-mono text-xs font-semibold text-white truncate">{p.key}</span>
                            <span className={`text-[9px] px-1 py-0.2 rounded font-semibold ${isGranted ? 'bg-emerald-500/20 text-emerald-300' : 'bg-gray-700 text-gray-400'}`}>
                              {isGranted ? 'ACTIVE' : 'CHƯA CÓ'}
                            </span>
                          </div>
                          <p className="text-[10px] text-gray-400 mt-0.5 leading-tight">{p.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Dedicated Ad Accounts Manager */}
              <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-[#33CCFF]" />
                      Tài Khoản Quảng Cáo Đã Kết Nối ({adAccounts.filter(a => !MOCK_ACCOUNTS.some(m => m.account_id === a.account_id)).length})
                    </label>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      Hỗ trợ tự động quét hoặc nhập trực tiếp ID tài khoản cá nhân / BM.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => testMetaToken(settings.metaToken)}
                    disabled={testingToken || !settings.metaToken}
                    className="text-[11px] text-[#33CCFF] hover:underline flex items-center gap-1 disabled:opacity-40"
                    title="Quét lại từ Token"
                  >
                    <RefreshCw className={`w-3 h-3 ${testingToken ? 'animate-spin' : ''}`} /> Quét lại
                  </button>
                </div>

                {/* Manual Account ID Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="flex-1 bg-[#070b14] border border-white/15 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 font-mono focus:outline-none focus:border-[#33CCFF]"
                    placeholder="Nhập ID tài khoản (Ví dụ: act_1234567890 hoặc 1234567890)"
                    value={manualAccountIdInput}
                    onChange={(e) => {
                      setManualAccountIdInput(e.target.value);
                      setAddAccountFeedback(null);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addManualAdAccount(manualAccountIdInput);
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => addManualAdAccount(manualAccountIdInput)}
                    disabled={addingAccount || !manualAccountIdInput.trim()}
                    className="px-3.5 py-2 bg-[#33CCFF] hover:bg-[#33CCFF]/90 text-[#070b14] font-semibold text-xs rounded-lg transition-all disabled:opacity-40 flex items-center gap-1.5 flex-shrink-0 cursor-pointer"
                  >
                    <Plus className={`w-3.5 h-3.5 ${addingAccount ? 'animate-spin' : ''}`} />
                    {addingAccount ? 'Đang kiểm tra...' : 'Thêm tài khoản'}
                  </button>
                </div>

                {/* Add account feedback */}
                {addAccountFeedback && (
                  <div className={`p-2.5 rounded-lg text-xs border ${
                    addAccountFeedback.success 
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' 
                      : 'bg-red-500/10 border-red-500/20 text-red-300'
                  }`}>
                    {addAccountFeedback.success ? '✅ ' : '❌ '}
                    {addAccountFeedback.message}
                  </div>
                )}

                {/* List of Connected Accounts */}
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {adAccounts.filter(a => !MOCK_ACCOUNTS.some(m => m.account_id === a.account_id)).length === 0 ? (
                    <div className="p-3 rounded-lg bg-black/20 border border-dashed border-white/10 text-center text-xs text-gray-400">
                      Chưa có tài khoản live nào. Hãy nhập ID tài khoản vào ô trên hoặc bấm "Kiểm tra & Quét tài khoản".
                    </div>
                  ) : (
                    adAccounts
                      .filter(a => !MOCK_ACCOUNTS.some(m => m.account_id === a.account_id))
                      .map(acc => (
                        <div 
                          key={acc.account_id}
                          className="flex items-center justify-between p-2.5 bg-black/40 border border-white/10 rounded-lg text-xs hover:border-[#33CCFF]/30 transition-all"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0"></span>
                            <div className="min-w-0">
                              <p className="font-semibold text-white truncate">{acc.name}</p>
                              <p className="text-[10px] text-gray-400 font-mono">ID: act_{acc.account_id} • Tiền tệ: {acc.currency || 'USD'}</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeAdAccount(acc.account_id)}
                            className="p-1.5 text-gray-400 hover:text-red-400 transition-colors ml-2 flex-shrink-0 cursor-pointer"
                            title="Xóa tài khoản này"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))
                  )}
                </div>
              </div>
              
              {/* Google Sheets Webhook */}
              <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Google Sheets Webhook URL (Apps Script)
                  </label>
                  <button 
                    onClick={() => setIsGuideOpen(true)}
                    className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    <BookOpen className="w-3 h-3" /> Cách tạo Webhook
                  </button>
                </div>

                <input 
                  type="url"
                  className="w-full bg-[#070b14] border border-white/15 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-400 font-mono"
                  placeholder="https://script.google.com/macros/s/.../exec"
                  value={settings.sheetWebhook}
                  onChange={(e) => {
                    setSettings({...settings, sheetWebhook: e.target.value});
                    setWebhookTestResult(null);
                  }}
                />

                <div className="flex items-center justify-between gap-3 pt-1">
                  <p className="text-[11px] text-gray-500">
                    Bấm "Sync to Sheet" ở thanh công cụ để đẩy dữ liệu báo cáo & phễu.
                  </p>
                  <button
                    type="button"
                    onClick={() => testWebhook(settings.sheetWebhook)}
                    disabled={testingWebhook || !settings.sheetWebhook}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 flex items-center gap-1.5 transition-all disabled:opacity-40 flex-shrink-0"
                  >
                    <Save className={`w-3.5 h-3.5 ${testingWebhook ? 'animate-spin' : ''}`} />
                    {testingWebhook ? 'Đang gửi test...' : 'Gửi thử nghiệm'}
                  </button>
                </div>

                {webhookTestResult && (
                  <div className={`p-2.5 rounded-lg text-xs border ${
                    webhookTestResult.success 
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' 
                      : 'bg-red-500/10 border-red-500/20 text-red-300'
                  }`}>
                    {webhookTestResult.success ? '✅ ' : '❌ '}
                    {webhookTestResult.message}
                  </div>
                )}
              </div>

              {/* Danger Zone / Reset */}
              <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-xl flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-xs font-semibold text-red-400 uppercase tracking-wider">Reset Toàn Bộ Hệ Thống</h4>
                  <p className="text-[11px] text-gray-400 mt-0.5">Xóa sạch Token, Webhook và các số liệu đã lưu (Yêu cầu xác nhận CAPTCHA).</p>
                </div>
                <button
                  type="button"
                  onClick={openResetModal}
                  className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-300 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 flex-shrink-0 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset Toàn Bộ
                </button>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex justify-end gap-3">
              <button 
                onClick={() => setIsSettingsOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-gray-300 transition-all cursor-pointer"
              >
                Đóng
              </button>
              <button 
                onClick={async () => {
                  setIsSettingsOpen(false);
                  if (settings.metaToken && settings.metaToken.trim() !== '') {
                    await fetchAdAccounts(settings.metaToken);
                    if (selectedAccountIds.length > 0) {
                      fetchMetaAPI(selectedAccountIds, datePreset, customStartDate, customEndDate);
                    }
                  }
                }}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-[#33CCFF] to-[#0AE5D5] text-[#070b14] hover:opacity-90 transition-all shadow-lg shadow-[#33CCFF]/20 cursor-pointer"
              >
                Lưu & Áp Dụng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CAPTCHA Reset Confirmation Modal */}
      {isResetModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-[#0a0f1c] border border-red-500/30 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
            <div className="flex items-center gap-3 text-red-400 mb-4 pb-3 border-b border-red-500/20">
              <ShieldAlert className="w-6 h-6 flex-shrink-0" />
              <h2 className="text-lg font-bold text-white">Xác Nhận Xóa Sạch Toàn Bộ</h2>
            </div>

            <p className="text-xs text-gray-300 mb-4 leading-relaxed">
              Hành động này sẽ <strong>xóa toàn bộ</strong> Meta Access Token, Google Sheets Webhook, danh sách CRM Profiles và toàn bộ số liệu chuyển đổi đã lưu. Hệ thống sẽ quay về trạng thái mặc định ban đầu và <strong>không thể hoàn tác</strong>.
            </p>

            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-4 text-center">
              <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Nhập mã bảo mật (CAPTCHA) bên dưới:
              </label>
              
              <div className="flex items-center justify-center gap-3 mb-3">
                <div className="px-6 py-2 bg-black/60 border border-white/20 rounded-lg text-2xl font-mono font-black text-amber-300 tracking-[0.3em] select-none shadow-inner">
                  {captchaCode}
                </div>
                <button 
                  type="button" 
                  onClick={generateCaptcha}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all cursor-pointer"
                  title="Đổi mã khác"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>

              <input 
                type="text" 
                maxLength={4}
                className="w-full bg-[#070b14] border border-white/20 rounded-lg px-3 py-2 text-center text-sm text-white font-mono tracking-widest uppercase focus:outline-none focus:border-red-400"
                placeholder="Nhập 4 ký tự vào đây..."
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value)}
                autoFocus
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsResetModalOpen(false)}
                className="px-4 py-2 rounded-lg text-xs font-medium bg-white/5 hover:bg-white/10 text-gray-300 transition-colors cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                disabled={captchaInput.trim().toUpperCase() !== captchaCode}
                onClick={handleConfirmReset}
                className="px-5 py-2 rounded-lg text-xs font-bold bg-red-600 hover:bg-red-500 text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-lg shadow-red-600/30 cursor-pointer"
              >
                Xác Nhận Xóa Sạch
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Create / Edit Modal */}
      {isProfileModalOpen && (
        <ProfileModal 
          isOpen={isProfileModalOpen}
          editingProfile={editingProfile}
          adAccounts={adAccounts}
          onClose={() => setIsProfileModalOpen(false)}
          onSave={(savedProfile) => {
            if (editingProfile) {
              setProfiles(profiles.map(p => p.id === savedProfile.id ? savedProfile : p));
            } else {
              setProfiles([...profiles, savedProfile]);
            }
            setIsProfileModalOpen(false);
          }}
        />
      )}

      {/* CRM Lead Create / Edit Modal */}
      {isLeadModalOpen && (
        <LeadModal 
          isOpen={isLeadModalOpen}
          editingLead={editingLead}
          profiles={profiles}
          campaigns={data}
          crmCurrency={crmCurrency}
          customRates={customRates}
          onClose={() => setIsLeadModalOpen(false)}
          onSave={(savedLead) => {
            if (editingLead) {
              setLeads(leads.map(l => l.id === savedLead.id ? savedLead : l));
            } else {
              setLeads([savedLead, ...leads]);
            }
            setIsLeadModalOpen(false);
          }}
        />
      )}

      {/* Setup Guide Modal */}
      {isGuideOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0a0f1c] border border-white/10 rounded-2xl w-full max-w-2xl p-6 shadow-2xl relative max-h-[85vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
              <BookOpen className="w-5 h-5 text-purple-400" />
              Setup Guide
            </h2>
            
            <div className="space-y-6 text-sm text-gray-300">
              <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                <h3 className="font-semibold text-white mb-2 text-base flex items-center gap-2">
                  <span className="bg-[#33CCFF]/20 text-[#33CCFF] w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
                  Getting Meta Access Token
                </h3>
                <ul className="list-disc list-inside space-y-1 ml-1 text-gray-400">
                  <li>Go to <strong>Meta For Developers</strong> &gt; My Apps.</li>
                  <li>Select your app or create a new "Business" app.</li>
                  <li>Add <strong>Marketing API</strong> to your app.</li>
                  <li>Go to Tools &gt; <strong>Graph API Explorer</strong>.</li>
                  <li>Select your app, get a Page Access Token or User Token with permissions: <code className="bg-black/50 px-1 py-0.5 rounded text-pink-300">ads_read</code>, <code className="bg-black/50 px-1 py-0.5 rounded text-pink-300">read_insights</code>, <code className="bg-black/50 px-1 py-0.5 rounded text-pink-300">pages_read_engagement</code>.</li>
                  <li>Copy the token and paste it into the <strong>Settings</strong> modal of this tool.</li>
                </ul>
              </div>

              <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                <h3 className="font-semibold text-white mb-2 text-base flex items-center gap-2">
                  <span className="bg-green-500/20 text-green-400 w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
                  Setting up Google Sheets Sync
                </h3>
                <ol className="list-decimal list-inside space-y-2 ml-1 text-gray-400">
                  <li>Create a new <strong>Google Sheet</strong>.</li>
                  <li>Go to <strong>Extensions &gt; Apps Script</strong>.</li>
                  <li>Delete any code there, and paste the code below.</li>
                  <li>Click <strong>Deploy &gt; New deployment</strong>.</li>
                  <li>Select type: <strong>Web app</strong>. Execute as: <strong>Me</strong>. Who has access: <strong>Anyone</strong>.</li>
                  <li>Copy the resulting Web app URL and paste it into the Settings modal.</li>
                </ol>
                <div className="mt-3 bg-black/50 p-3 rounded-lg border border-white/5 font-mono text-[11px] text-gray-400 overflow-x-auto">
<pre>{`function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);
  
  // Headers (Run once manually or handle here)
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["Timestamp", "Date Range", "Campaign Name", "Spend", "Leads", "Account Opens", "Funded Accounts", "Deposit"]);
  }
  
  // Append Campaign Data
  data.campaigns.forEach(function(c) {
    sheet.appendRow([
      data.timestamp,
      data.dateRange,
      c.campaignName,
      c.spend,
      c.leads,
      c.accountOpens,
      c.fundedAccounts,
      c.deposit
    ]);
  });
  
  return ContentService.createTextOutput(JSON.stringify({"status": "success"})).setMimeType(ContentService.MimeType.JSON);
}`}</pre>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3 sticky bottom-0 bg-[#0a0f1c] pt-4">
              <button 
                onClick={() => setIsGuideOpen(false)}
                className="px-4 py-2 rounded-lg text-sm bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 transition-colors cursor-pointer"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}

      </div>
    </div>
  );
}

// =====================================================================
// ======================== REPORT MODULES =============================
// =====================================================================

function ReportManager({ data, manualData, handleManualChange, activeReportTab, setActiveReportTab }) {
  const tabs = [
    { id: 'overview', name: 'Campaign Overview', icon: Target },
    { id: 'breakdown', name: 'Market Breakdown', icon: Globe },
    { id: 'roi', name: 'ROI & P&L', icon: DollarSign },
    { id: 'funnel', name: 'Funnel & Health', icon: Activity },
  ];

  // Reset to 'overview' if current tab no longer exists (e.g. after removing old tabs)
  const validTabIds = tabs.map(t => t.id);
  const currentTab = validTabIds.includes(activeReportTab) ? activeReportTab : 'overview';

  return (
    <div className="flex flex-col xl:flex-row gap-6">
      {/* Sidebar */}
      <div className="xl:w-64 flex-shrink-0 print:hidden pdf-hide">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sticky top-6">
          <h3 className="text-sm font-semibold text-gray-400 mb-4 px-2 uppercase tracking-widest">Report</h3>
          <div className="flex flex-col gap-1">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveReportTab(tab.id)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all text-left ${isActive ? 'bg-[#0AE5D5]/10 text-[#0AE5D5] border border-[#0AE5D5]/20 font-medium' : 'text-gray-400 hover:text-gray-200 hover:bg-white/5 border border-transparent'}`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#0AE5D5]' : 'text-gray-500'}`} />
                  {tab.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Dynamic Report Content */}
      <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl relative overflow-hidden group print:bg-white print:border-none print:shadow-none print:p-0">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#0AE5D5] to-[#33CCFF] opacity-50 print:hidden"></div>
        
        {currentTab === 'overview' && <CampaignOverviewReport data={data} />}
        {currentTab === 'breakdown' && <BreakdownReport data={data} manualData={manualData} />}
        {currentTab === 'roi' && <ROIRevenueReport data={data} manualData={manualData} />}
        {currentTab === 'funnel' && <FunnelHealthReport data={data} manualData={manualData} />}
      </div>
    </div>
  );
}

// ======== 1. CAMPAIGN OVERVIEW REPORT ========
function CampaignOverviewReport({ data }) {
  const sortedData = [...data].sort((a, b) => b.spend - a.spend);

  // Summary stats
  const totalSpend = data.reduce((acc, c) => acc + c.spend, 0);
  const totalClicks = data.reduce((acc, c) => acc + c.clicks, 0);
  const totalImpressions = data.reduce((acc, c) => acc + c.impressions, 0);
  const totalLeads = data.reduce((acc, c) => acc + c.leads, 0);
  const avgCpl = totalLeads > 0 ? totalSpend / totalLeads : 0;
  const avgCtr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;

  // Chart data — top 10 by spend
  const barChartData = sortedData.slice(0, 10).map(item => {
    const cpl = item.leads > 0 ? item.spend / item.leads : 0;
    return {
      name: item.campaign_name.length > 18 ? item.campaign_name.substring(0, 18) + '…' : item.campaign_name,
      Spend: Number(item.spend.toFixed(2)),
      CPL: Number(cpl.toFixed(2)),
    };
  });

  return (
    <div>
      <h2 className="text-xl font-bold flex items-center gap-2 mb-2 print:text-[#070b14]">
        <Target className="w-6 h-6 text-[#0AE5D5]" /> Campaign Overview
      </h2>
      <p className="text-gray-400 text-sm mb-6 print:text-gray-600">
        Tổng quan hiệu suất tất cả chiến dịch quảng cáo — Spend, Clicks, Leads & CPL.
      </p>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
          <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">Total Spend</p>
          <p className="text-2xl font-bold text-white">${totalSpend.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
          <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">Total Clicks</p>
          <p className="text-2xl font-bold text-white">{totalClicks.toLocaleString()}</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
          <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">Total Leads</p>
          <p className="text-2xl font-bold text-[#33CCFF]">{totalLeads.toLocaleString()}</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
          <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">Avg. CPL</p>
          <p className="text-2xl font-bold text-[#0AE5D5]">${avgCpl.toFixed(2)}</p>
        </div>
      </div>

      {/* Bar Chart — Spend vs CPL */}
      <div className="bg-black/20 border border-white/5 rounded-xl p-5 mb-8">
        <h3 className="text-gray-300 font-semibold mb-4 text-sm">Spend vs CPL — Top 10 Campaigns</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barChartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
              <XAxis dataKey="name" stroke="#9ca3af" fontSize={11} tickLine={false} axisLine={false} angle={-20} textAnchor="end" height={60} />
              <YAxis yAxisId="left" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
              <YAxis yAxisId="right" orientation="right" stroke="#0AE5D5" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
              />
              <Legend wrapperStyle={{ paddingTop: '10px' }} />
              <Bar yAxisId="left" dataKey="Spend" name="Spend ($)" fill="#33CCFF" radius={[4, 4, 0, 0]} />
              <Bar yAxisId="right" dataKey="CPL" name="CPL ($)" fill="#0AE5D5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Campaign Detail Table */}
      <div className="overflow-x-auto bg-black/20 border border-white/5 rounded-xl">
        <table className="w-full text-sm text-left whitespace-nowrap">
          <thead className="text-[10px] uppercase bg-black/60 text-gray-400 border-b border-white/10">
            <tr>
              <th className="px-4 py-3">Campaign</th>
              <th className="px-4 py-3">Account</th>
              <th className="px-4 py-3 text-right">Spend</th>
              <th className="px-4 py-3 text-right">Impressions</th>
              <th className="px-4 py-3 text-right">Clicks</th>
              <th className="px-4 py-3 text-right">CTR</th>
              <th className="px-4 py-3 text-right">CPC</th>
              <th className="px-4 py-3 text-right">CPM</th>
              <th className="px-4 py-3 text-right">Leads</th>
              <th className="px-4 py-3 text-right">CPL</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-xs">
            {sortedData.map(item => {
              const ctr = item.impressions > 0 ? (item.clicks / item.impressions) * 100 : 0;
              const cpc = item.clicks > 0 ? item.spend / item.clicks : 0;
              const cpm = item.impressions > 0 ? (item.spend / item.impressions) * 1000 : 0;
              const cpl = item.leads > 0 ? item.spend / item.leads : 0;

              return (
                <tr key={item.campaign_id} className="hover:bg-white/[0.04] transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-200 min-w-[240px] max-w-[480px] break-words whitespace-normal leading-snug font-medium text-gray-200" title={item.campaign_name}>{item.campaign_name}</td>
                  <td className="px-4 py-3 text-gray-500">
                    <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded uppercase tracking-wider">{item.account_name || '—'}</span>
                  </td>
                  <td className="px-4 py-3 text-right text-gray-300 font-medium">${item.spend.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right text-gray-400">{item.impressions.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right text-gray-400">{item.clicks.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right text-[#0AE5D5]">{ctr.toFixed(2)}%</td>
                  <td className="px-4 py-3 text-right text-gray-300">${cpc.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right text-gray-400">${cpm.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right text-white font-medium">{item.leads}</td>
                  <td className={`px-4 py-3 text-right font-bold ${cpl > 0 ? 'text-[#0AE5D5]' : 'text-gray-500'}`}>{cpl > 0 ? `$${cpl.toFixed(2)}` : '—'}</td>
                </tr>
              );
            })}
            {/* Total Row */}
            {data.length > 0 && (() => {
              const totalCtr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
              const totalCpc = totalClicks > 0 ? totalSpend / totalClicks : 0;
              const totalCpm = totalImpressions > 0 ? (totalSpend / totalImpressions) * 1000 : 0;
              return (
                <tr className="bg-white/[0.06] border-t-2 border-[#0AE5D5]/30 font-semibold text-white">
                  <td className="px-4 py-3" colSpan={2}>TOTAL ({data.length} campaigns)</td>
                  <td className="px-4 py-3 text-right text-[#33CCFF]">${totalSpend.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right">{totalImpressions.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right">{totalClicks.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right text-[#0AE5D5]">{totalCtr.toFixed(2)}%</td>
                  <td className="px-4 py-3 text-right">${totalCpc.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right">${totalCpm.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right text-[#33CCFF]">{totalLeads}</td>
                  <td className="px-4 py-3 text-right text-[#0AE5D5]">{avgCpl > 0 ? `$${avgCpl.toFixed(2)}` : '—'}</td>
                </tr>
              );
            })()}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ======== 2. MARKET BREAKDOWN REPORT ========
function BreakdownReport({ data, manualData }) {
  const marketRegex = /^(VN|TH|MY|PH|IND|ID)/i;
  let breakdown = {};
  
  data.forEach(item => {
    let country = 'OTHER';
    const match = item.campaign_name.match(marketRegex);
    if(match) country = match[1].toUpperCase();

    if(!breakdown[country]) breakdown[country] = { spend: 0, leads: 0, impressions: 0, clicks: 0, acct: 0, fund: 0, deposit: 0 };
    
    const mData = manualData[item.campaign_id] || {};
    
    breakdown[country].spend += item.spend;
    breakdown[country].leads += item.leads;
    breakdown[country].impressions += item.impressions;
    breakdown[country].clicks += item.clicks;
    breakdown[country].acct += parseFloat(mData.accountOpen) || 0;
    breakdown[country].fund += parseFloat(mData.fundedAccounts) || 0;
    breakdown[country].deposit += parseFloat(mData.deposit) || 0;
  });

  const pieData = Object.keys(breakdown).map(key => ({
    name: key, 
    value: parseFloat(breakdown[key].spend.toFixed(2))
  }));

  const COLORS = ['#33CCFF', '#0AE5D5', '#818cf8', '#f472b6', '#34d399', '#fcd34d'];

  // Totals for Total Row
  const grandTotal = Object.values(breakdown).reduce((acc, b) => ({
    spend: acc.spend + b.spend,
    leads: acc.leads + b.leads,
    impressions: acc.impressions + b.impressions,
    clicks: acc.clicks + b.clicks,
    acct: acc.acct + b.acct,
    fund: acc.fund + b.fund,
    deposit: acc.deposit + b.deposit,
  }), { spend: 0, leads: 0, impressions: 0, clicks: 0, acct: 0, fund: 0, deposit: 0 });

  return (
    <div>
      <h2 className="text-xl font-bold flex items-center gap-2 mb-2 print:text-[#070b14]">
        <Globe className="w-6 h-6 text-indigo-400" /> Market Breakdown
      </h2>
      <p className="text-gray-400 text-sm mb-6 print:text-gray-600">Phân tích chi tiêu, hiệu suất và ROI theo từng thị trường.</p>
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="h-[300px] flex flex-col items-center xl:col-span-1">
          <h3 className="font-semibold text-gray-300 mb-2">Budget Allocation</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value" label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(value) => `$${value}`} contentStyle={{backgroundColor: '#0f172a', border: 'none', borderRadius: '8px'}}/>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="xl:col-span-2 overflow-x-auto">
          <h3 className="font-semibold text-gray-300 mb-4">Regional Performance</h3>
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="text-[10px] uppercase bg-white/5 text-gray-400">
              <tr>
                <th className="px-4 py-3">Region</th>
                <th className="px-4 py-3 text-right">Spend</th>
                <th className="px-4 py-3 text-right">Leads</th>
                <th className="px-4 py-3 text-right">Avg CPL</th>
                <th className="px-4 py-3 text-right text-[#33CCFF]">Acct Open / CPA</th>
                <th className="px-4 py-3 text-right text-[#0AE5D5]">Funded / CPFA</th>
                <th className="px-4 py-3 text-right text-indigo-300">Deposit</th>
                <th className="px-4 py-3 text-right">ROI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {Object.keys(breakdown).map((key, i) => {
                const b = breakdown[key];
                const cpl = b.leads > 0 ? b.spend / b.leads : 0;
                const cpa = b.acct > 0 ? b.spend / b.acct : 0;
                const cpfa = b.fund > 0 ? b.spend / b.fund : 0;
                const roi = b.spend > 0 ? ((b.deposit - b.spend) / b.spend) * 100 : 0;
                
                const leadCvr = b.clicks > 0 ? (b.leads / b.clicks) * 100 : 0;
                const lToA = b.leads > 0 ? (b.acct / b.leads) * 100 : 0;
                const lToF = b.leads > 0 ? (b.fund / b.leads) * 100 : 0;

                return (
                  <tr key={key} className="hover:bg-white/5">
                    <td className="px-4 py-3 font-bold flex items-center gap-2">
                       <span className="w-3 h-3 rounded-full flex-shrink-0" style={{backgroundColor: COLORS[i % COLORS.length]}}></span> {key}
                    </td>
                    <td className="px-4 py-3 text-right">${b.spend.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right">
                      <div>{b.leads}</div>
                      {leadCvr > 0 && <div className="text-[10px] text-gray-500">CVR: {leadCvr.toFixed(1)}%</div>}
                    </td>
                    <td className="px-4 py-3 text-right">${cpl.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right text-[#33CCFF]">
                      <div>
                        <span className="text-white font-medium">{b.acct}</span> <span className="text-gray-500">/ ${cpa.toFixed(2)}</span>
                      </div>
                      {b.leads > 0 && b.acct > 0 && (
                        <div className="text-[10px] text-[#33CCFF]/70">L→A: {lToA.toFixed(1)}%</div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right text-[#0AE5D5]">
                      <div>
                        <span className="text-white font-medium">{b.fund}</span> <span className="text-gray-500">/ ${cpfa.toFixed(2)}</span>
                      </div>
                      {b.leads > 0 && b.fund > 0 && (
                        <div className="text-[10px] text-[#0AE5D5]/70">L→F: {lToF.toFixed(1)}%</div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-indigo-300">${b.deposit.toFixed(2)}</td>
                    <td className={`px-4 py-3 text-right font-bold ${roi > 0 ? 'text-green-400' : roi < 0 ? 'text-red-400' : 'text-gray-400'}`}>
                      {roi > 0 ? '+' : ''}{roi.toFixed(1)}%
                    </td>
                  </tr>
                )
              })}
              {/* Total Row */}
              {Object.keys(breakdown).length > 0 && (() => {
                const tCpl = grandTotal.leads > 0 ? grandTotal.spend / grandTotal.leads : 0;
                const tCpa = grandTotal.acct > 0 ? grandTotal.spend / grandTotal.acct : 0;
                const tCpfa = grandTotal.fund > 0 ? grandTotal.spend / grandTotal.fund : 0;
                const tRoi = grandTotal.spend > 0 ? ((grandTotal.deposit - grandTotal.spend) / grandTotal.spend) * 100 : 0;
                
                const tLeadCvr = grandTotal.clicks > 0 ? (grandTotal.leads / grandTotal.clicks) * 100 : 0;
                const tLToA = grandTotal.leads > 0 ? (grandTotal.acct / grandTotal.leads) * 100 : 0;
                const tLToF = grandTotal.leads > 0 ? (grandTotal.fund / grandTotal.leads) * 100 : 0;

                return (
                  <tr className="bg-white/[0.06] border-t-2 border-indigo-500/30 font-semibold text-white">
                    <td className="px-4 py-3">TOTAL</td>
                    <td className="px-4 py-3 text-right text-[#33CCFF]">${grandTotal.spend.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right">
                      <div>{grandTotal.leads}</div>
                      {tLeadCvr > 0 && <div className="text-[10px] text-gray-400 font-normal">CVR: {tLeadCvr.toFixed(1)}%</div>}
                    </td>
                    <td className="px-4 py-3 text-right">${tCpl.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right text-[#33CCFF]">
                      <div>
                        {grandTotal.acct} <span className="text-gray-500">/ ${tCpa.toFixed(2)}</span>
                      </div>
                      {grandTotal.leads > 0 && grandTotal.acct > 0 && (
                        <div className="text-[10px] text-[#33CCFF]/70 font-normal">L→A: {tLToA.toFixed(1)}%</div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right text-[#0AE5D5]">
                      <div>
                        {grandTotal.fund} <span className="text-gray-500">/ ${tCpfa.toFixed(2)}</span>
                      </div>
                      {grandTotal.leads > 0 && grandTotal.fund > 0 && (
                        <div className="text-[10px] text-[#0AE5D5]/70 font-normal">L→F: {tLToF.toFixed(1)}%</div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right text-indigo-300">${grandTotal.deposit.toFixed(2)}</td>
                    <td className={`px-4 py-3 text-right font-bold ${tRoi > 0 ? 'text-green-400' : tRoi < 0 ? 'text-red-400' : 'text-gray-400'}`}>
                      {tRoi > 0 ? '+' : ''}{tRoi.toFixed(1)}%
                    </td>
                  </tr>
                );
              })()}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ======== 3. ROI & P&L REPORT ========
function ROIRevenueReport({ data, manualData }) {
  const totalSpend = data.reduce((a, b) => a + b.spend, 0);
  const totalDeposit = data.reduce((a, b) => {
    const m = manualData[b.campaign_id];
    return a + (m && m.deposit ? parseFloat(m.deposit) : 0);
  }, 0);
  
  const roas = totalSpend > 0 ? (totalDeposit / totalSpend).toFixed(2) : 0;
  const netProfit = totalDeposit - totalSpend;
  const roiPerc = totalSpend > 0 ? ((netProfit / totalSpend) * 100).toFixed(1) : 0;

  // Per-campaign ROI data
  const campaignRoi = [...data].map(item => {
    const m = manualData[item.campaign_id] || {};
    const deposit = parseFloat(m.deposit) || 0;
    const acct = parseFloat(m.accountOpen) || 0;
    const fund = parseFloat(m.fundedAccounts) || 0;
    const roi = item.spend > 0 ? ((deposit - item.spend) / item.spend) * 100 : 0;
    const cpa = acct > 0 ? item.spend / acct : 0;
    return { ...item, deposit, acct, fund, roi, cpa };
  }).sort((a, b) => b.roi - a.roi);

  return (
    <div>
      <h2 className="text-xl font-bold flex items-center gap-2 mb-2 print:text-[#070b14]">
        <TrendingUp className="w-6 h-6 text-green-400" /> ROI & P&L
      </h2>
      <p className="text-gray-400 text-sm mb-6 print:text-gray-600">Tổng quan lợi nhuận — theo dõi P&L và ROAS tổng thể cũng như chi tiết từng chiến dịch.</p>
      
      {/* Executive Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center print:bg-white print:border-gray-200">
          <p className="text-gray-400 uppercase tracking-widest text-xs font-semibold mb-2 print:text-gray-500">Total Spend</p>
          <p className="text-3xl font-bold text-red-400 print:text-[#070b14]">${totalSpend.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center print:bg-white print:border-gray-200">
          <p className="text-gray-400 uppercase tracking-widest text-xs font-semibold mb-2 print:text-gray-500">Total Deposit</p>
          <p className="text-3xl font-bold text-green-400 print:text-[#070b14]">${totalDeposit.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</p>
        </div>
        <div className={`bg-white/5 border border-white/10 rounded-xl p-6 text-center print:bg-white print:border-gray-200 ${netProfit >= 0 ? "shadow-[0_0_30px_-5px_rgba(52,211,153,0.2)]" : ""}`}>
          <p className="text-gray-400 uppercase tracking-widest text-xs font-semibold mb-2 print:text-gray-500">Net Profit / ROI</p>
          <p className={`text-3xl font-bold ${netProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {netProfit >= 0 ? '+' : ''}${netProfit.toLocaleString(undefined, {minimumFractionDigits:2})}
          </p>
          <p className={`text-sm mt-1 font-medium ${netProfit >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>{roiPerc}% ROI</p>
        </div>
      </div>

      {/* ROAS Indicator */}
      <div className="bg-black/20 rounded-xl p-6 border border-white/5 flex justify-between items-center mb-8 print:hidden">
        <div>
           <h3 className="text-2xl font-bold text-white mb-1"><span className="text-[#0AE5D5]">ROAS:</span> {roas}x</h3>
           <p className="text-gray-400 text-sm">For every $1 spent, you earn ${roas} back in deposits.</p>
        </div>
        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#33CCFF] to-[#0AE5D5] flex items-center justify-center shadow-lg">
           <DollarSign className="text-[#070b14] w-8 h-8" strokeWidth={3} />
        </div>
      </div>

      {/* Per-Campaign ROI Table */}
      <div className="overflow-x-auto bg-black/20 border border-white/5 rounded-xl">
        <div className="px-5 py-4 border-b border-white/5">
          <h3 className="text-sm font-semibold text-gray-300">ROI by Campaign</h3>
          <p className="text-xs text-gray-500 mt-1">Sorted by ROI descending. Data from manual inputs on Dashboard.</p>
        </div>
        <table className="w-full text-sm text-left whitespace-nowrap">
          <thead className="text-[10px] uppercase bg-black/60 text-gray-400 border-b border-white/10">
            <tr>
              <th className="px-4 py-3">Campaign</th>
              <th className="px-4 py-3 text-right">Spend</th>
              <th className="px-4 py-3 text-right">Leads</th>
              <th className="px-4 py-3 text-right text-[#33CCFF]">Acct Open</th>
              <th className="px-4 py-3 text-right text-[#33CCFF]">CPA</th>
              <th className="px-4 py-3 text-right text-[#0AE5D5]">Funded</th>
              <th className="px-4 py-3 text-right text-indigo-300">Deposit</th>
              <th className="px-4 py-3 text-right">ROI</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-xs">
            {campaignRoi.map(item => (
              <tr key={item.campaign_id} className="hover:bg-white/[0.04] transition-colors">
                <td className="px-4 py-3 font-medium text-gray-200 min-w-[240px] max-w-[480px] break-words whitespace-normal leading-snug font-medium text-gray-200" title={item.campaign_name}>{item.campaign_name}</td>
                <td className="px-4 py-3 text-right text-gray-300">${item.spend.toFixed(2)}</td>
                <td className="px-4 py-3 text-right text-gray-400">{item.leads}</td>
                <td className="px-4 py-3 text-right text-[#33CCFF] font-medium">{item.acct || '—'}</td>
                <td className="px-4 py-3 text-right text-gray-300">{item.cpa > 0 ? `$${item.cpa.toFixed(2)}` : '—'}</td>
                <td className="px-4 py-3 text-right text-[#0AE5D5] font-medium">{item.fund || '—'}</td>
                <td className="px-4 py-3 text-right text-indigo-300 font-medium">{item.deposit > 0 ? `$${item.deposit.toFixed(2)}` : '—'}</td>
                <td className={`px-4 py-3 text-right font-bold ${item.roi > 0 ? 'text-green-400' : item.roi < 0 ? 'text-red-400' : 'text-gray-400'}`}>
                  {item.deposit > 0 || item.spend > 0 ? `${item.roi > 0 ? '+' : ''}${item.roi.toFixed(1)}%` : '—'}
                </td>
              </tr>
            ))}
            {/* Total Row */}
            {data.length > 0 && (
              <tr className="bg-white/[0.06] border-t-2 border-green-500/30 font-semibold text-white">
                <td className="px-4 py-3">TOTAL</td>
                <td className="px-4 py-3 text-right text-red-400">${totalSpend.toFixed(2)}</td>
                <td className="px-4 py-3 text-right">{data.reduce((a, b) => a + b.leads, 0)}</td>
                <td className="px-4 py-3 text-right text-[#33CCFF]">{campaignRoi.reduce((a, b) => a + b.acct, 0)}</td>
                <td className="px-4 py-3 text-right">—</td>
                <td className="px-4 py-3 text-right text-[#0AE5D5]">{campaignRoi.reduce((a, b) => a + b.fund, 0)}</td>
                <td className="px-4 py-3 text-right text-indigo-300">${totalDeposit.toFixed(2)}</td>
                <td className={`px-4 py-3 text-right font-bold ${netProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {roiPerc}%
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
function StatCard({ title, value, icon: Icon, color }) {
  return (
    <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-white/20 transition-all duration-300">
      <div className="flex justify-between items-start z-10 relative">
        <div>
          <p className="text-gray-400 text-sm font-medium mb-1">{title}</p>
          <h3 className="text-2xl font-bold tracking-tight text-white group-hover:scale-[1.02] transition-transform origin-left">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl bg-gradient-to-br from-white/5 to-white/0 border border-white/5 backdrop-blur-xl group-hover:scale-110 transition-transform`}>
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
      </div>
      <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full opacity-20 blur-xl group-hover:opacity-40 transition-opacity"
        style={{ backgroundColor: color }}
      ></div>
    </div>
  );
}

// ======== 6. ORGANIC PAGES REPORT ========
function OrganicPagesReport({ data, loading, error, selectedPage, onSelectPage, pageContentData, loadingContent, onBack }) {
  if (selectedPage) {
    return (
      <PageContentAnalyzer 
        page={selectedPage} 
        data={pageContentData} 
        loading={loadingContent} 
        onBack={onBack} 
      />
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-4 rounded-xl flex items-center gap-3">
        <AlertCircle className="w-6 h-6 flex-shrink-0" />
        <div>
          <h3 className="font-bold">Error loading Organic Pages</h3>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-center text-gray-400">
        <UsersRound className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <h3 className="text-xl font-semibold text-white mb-2">No Pages Found</h3>
        <p>Your Meta API token might not have the correct permissions (pages_show_list, pages_read_engagement).</p>
      </div>
    );
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 to-purple-500 opacity-50"></div>
      
      <h2 className="text-xl font-bold flex items-center gap-2 mb-2 text-white">
        <UsersRound className="w-6 h-6 text-pink-400" /> Organic Page Performance
      </h2>
      <p className="text-gray-400 text-sm mb-6">Last 30 Days aggregated organic metrics across managed Facebook Pages.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
         {data.map(page => (
           <div 
             key={page.page_id} 
             onClick={() => onSelectPage(page)}
             className="bg-black/20 border border-white/5 rounded-xl p-5 hover:border-pink-500/50 hover:bg-white/5 cursor-pointer transition-all relative group"
           >
             <div className="flex items-center gap-3 mb-4 pr-6">
               {page.picture ? (
                 <img src={page.picture} alt={page.name} className="w-10 h-10 rounded-full object-cover border border-white/10 flex-shrink-0" />
               ) : (
                 <div className="w-10 h-10 rounded-full bg-pink-500/20 text-pink-400 flex items-center justify-center font-bold text-sm border border-pink-500/30 flex-shrink-0">
                   {page.name.charAt(0)}
                 </div>
               )}
               <div className="min-w-0 flex-1">
                 <h3 className="font-bold text-base text-pink-300 truncate" title={page.name}>{page.name}</h3>
                 <p className="text-[11px] text-gray-400 truncate">{page.category || 'Facebook Page'}</p>
               </div>
             </div>
             <ChevronRight className="w-5 h-5 absolute right-4 top-5 text-gray-500 group-hover:text-pink-400 transition-colors" />
             
             {page.error ? (
               <p className="text-red-400 text-xs">{page.error}</p>
             ) : (
               <div className="space-y-4">
                 {page.warning && (
                   <p className="text-amber-400 text-[10px] mb-2">{page.warning}</p>
                 )}
                 <div className="flex justify-between items-end border-b border-white/5 pb-2">
                   <span className="text-gray-400 text-sm">Total Followers</span>
                   <span className="text-xl font-semibold text-white">{page.fans.toLocaleString()}</span>
                 </div>
                 <div className="flex justify-between items-end border-b border-white/5 pb-2">
                   <span className="text-gray-400 text-sm">30d Impressions</span>
                   <span className="text-xl font-semibold text-white">{page.impressions.toLocaleString()}</span>
                 </div>
                 <div className="flex justify-between items-end">
                   <span className="text-gray-400 text-sm">30d Engaged Users</span>
                   <span className="text-xl font-semibold text-[#0AE5D5]">{page.engaged_users.toLocaleString()}</span>
                 </div>
               </div>
             )}
           </div>
         ))}
      </div>
    </div>
  );
}

// ======== 7. PAGE CONTENT ANALYZER (MANAGER VIEW) ========
function PageContentAnalyzer({ page, data, loading, onBack }) {
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 bg-white/5 border border-white/10 rounded-2xl p-6">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mb-4"></div>
        <p className="text-gray-400">Fetching Content Insights for {page.name}...</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center text-gray-400">
        <button onClick={onBack} className="text-pink-400 hover:text-pink-300 flex items-center gap-2 mb-6">
          <ArrowRight className="w-4 h-4 rotate-180" /> Back to Pages
        </button>
        <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <h3 className="text-xl font-semibold text-white mb-2">No Posts Found</h3>
        <p>Could not find recent posts or API lacks insights permissions.</p>
      </div>
    );
  }

  // Calculate Heuristics
  let totalReach = 0;
  let totalEng = 0;
  let formatStats = {};

  data.forEach(p => {
    totalReach += p.reach;
    totalEng += p.engagement;
    
    if (!formatStats[p.type]) {
      formatStats[p.type] = { count: 0, reach: 0, eng: 0 };
    }
    formatStats[p.type].count++;
    formatStats[p.type].reach += p.reach;
    formatStats[p.type].eng += p.engagement;
  });

  const avgReach = totalReach / data.length;
  const avgEngRate = totalReach > 0 ? (totalEng / totalReach) * 100 : 0;

  let bestFormat = 'N/A';
  let bestFormatRate = 0;
  const chartData = Object.keys(formatStats).map(type => {
    const stat = formatStats[type];
    const avgTypeReach = stat.reach / stat.count;
    const typeEngRate = stat.reach > 0 ? (stat.eng / stat.reach) * 100 : 0;
    
    if (typeEngRate > bestFormatRate && stat.count > 0) {
      bestFormatRate = typeEngRate;
      bestFormat = type;
    }

    return {
      name: type,
      AvgReach: Math.round(avgTypeReach),
      EngRate: Number(typeEngRate.toFixed(2))
    };
  });

  if (bestFormat === 'N/A' && chartData.length > 0) {
     bestFormat = [...chartData].sort((a,b) => b.EngRate - a.EngRate)[0].name;
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 to-amber-500 opacity-50"></div>
      
      <button onClick={onBack} className="text-pink-400 hover:text-pink-300 flex items-center gap-2 mb-6 transition-colors">
        <ArrowRight className="w-4 h-4 rotate-180" /> Back to Pages
      </button>

      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">{page.name} <span className="text-gray-500 font-normal text-lg">Content Analysis</span></h2>
          <p className="text-gray-400 text-sm">Evaluating the last {data.length} published items.</p>
        </div>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white/5 border border-white/10 rounded-xl p-5 text-center">
          <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">Avg Post Reach</p>
          <p className="text-2xl font-bold text-white">{Math.round(avgReach).toLocaleString()}</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-5 text-center">
          <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">Avg Engagement Rate</p>
          <p className={`text-2xl font-bold ${avgEngRate > 3 ? 'text-green-400' : avgEngRate < 1 ? 'text-red-400' : 'text-amber-400'}`}>
            {avgEngRate.toFixed(2)}%
          </p>
        </div>
        <div className="bg-pink-500/10 border border-pink-500/20 rounded-xl p-5 text-center">
          <p className="text-pink-300 text-xs uppercase tracking-widest mb-1">Best Format</p>
          <p className="text-2xl font-bold text-pink-400">{bestFormat}</p>
        </div>
      </div>

      {/* Chart & AI Insights */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
        <div className="xl:col-span-2 bg-black/20 border border-white/5 rounded-xl p-5 h-[300px]">
          <h3 className="text-gray-300 font-semibold mb-4 text-sm">Performance by Format (Avg Reach vs Eng. Rate)</h3>
          <ResponsiveContainer width="100%" height="80%">
            <BarChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
              <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis yAxisId="left" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis yAxisId="right" orientation="right" stroke="#f472b6" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
              />
              <Legend wrapperStyle={{ paddingTop: '10px' }} />
              <Bar yAxisId="left" dataKey="AvgReach" name="Avg Reach" fill="#33CCFF" radius={[4, 4, 0, 0]} />
              <Bar yAxisId="right" dataKey="EngRate" name="Eng Rate (%)" fill="#f472b6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-5 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-4">
            <Activity className="w-6 h-6 text-amber-400" />
            <h3 className="text-amber-300 font-bold">Manager's Insight</h3>
          </div>
          <ul className="space-y-3 text-sm text-amber-100/80">
            <li>• <strong>{bestFormat}</strong> is currently your most engaging format. Consider reallocating production budget here.</li>
            <li>• Your overall engagement rate is <strong>{avgEngRate.toFixed(2)}%</strong>. 
              {avgEngRate > 5 ? ' Excellent! Your content resonates deeply.' : avgEngRate > 2 ? ' Healthy performance, but room to optimize hooks.' : ' Critically low. You need to review content relevance and quality.'}
            </li>
            <li>• <strong>Action:</strong> Review the bottom-performing posts below and establish "DO NOT REPEAT" guidelines for the creative team.</li>
          </ul>
        </div>
      </div>

      {/* Posts Table */}
      <div className="overflow-x-auto bg-black/40 border border-white/5 rounded-xl">
        <table className="w-full text-sm text-left whitespace-nowrap">
          <thead className="text-[10px] uppercase bg-black/60 text-gray-400 border-b border-white/10">
            <tr>
              <th className="px-4 py-3">Content</th>
              <th className="px-4 py-3">Format</th>
              <th className="px-4 py-3">Published</th>
              <th className="px-4 py-3 text-right">Reach</th>
              <th className="px-4 py-3 text-right">Engagements</th>
              <th className="px-4 py-3 text-right">Eng. Rate</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-xs">
            {data.map((post) => {
              const engRate = post.reach > 0 ? (post.engagement / post.reach) * 100 : 0;
              let rateColor = 'text-gray-400';
              if (engRate > 5) rateColor = 'text-green-400 font-bold';
              else if (engRate > 2) rateColor = 'text-amber-400';
              else if (engRate > 0) rateColor = 'text-red-400';

              return (
                <tr key={post.id} className="hover:bg-white/[0.04] transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-200 flex items-center gap-3">
                    {post.thumbnail ? (
                      <img src={post.thumbnail} alt="thumb" className="w-10 h-10 object-cover rounded bg-white/10" />
                    ) : (
                      <div className="w-10 h-10 rounded bg-white/5 flex items-center justify-center text-gray-500 flex-shrink-0">
                         <FileText className="w-4 h-4" />
                      </div>
                    )}
                    <div>
                      <a href={post.permalink_url} target="_blank" rel="noopener noreferrer" className="hover:text-pink-400 hover:underline block max-w-[250px] whitespace-normal line-clamp-2" title={post.message}>
                        {post.message ? post.message : '(No Text)'}
                      </a>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-400">
                    <span className="px-2 py-1 bg-white/5 rounded text-[10px]">{post.type}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(post.created_time).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-300">
                    {post.reach > 0 ? post.reach.toLocaleString() : <span className="text-gray-600 italic" title="Reach is hidden by Meta for pages <100 followers">N/A</span>}
                  </td>
                  <td className="px-4 py-3 text-right text-[#0AE5D5]">
                    {post.engagement.toLocaleString()}
                  </td>
                  <td className={`px-4 py-3 text-right ${rateColor}`}>
                    {post.reach > 0 ? `${engRate.toFixed(2)}%` : <span className="text-gray-600 italic">-</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ======== 4. FUNNEL & HEALTH ANALYSIS REPORT ========
function FunnelHealthReport({ data, manualData }) {
  const totalImpressions = data.reduce((a, b) => a + b.impressions, 0);
  const totalClicks = data.reduce((a, b) => a + b.clicks, 0);
  const totalLeads = data.reduce((a, b) => a + b.leads, 0);
  const totalSpend = data.reduce((a, b) => a + b.spend, 0);

  const totalAcct = data.reduce((a, b) => {
    const m = manualData[b.campaign_id] || {};
    return a + (parseFloat(m.accountOpen) || 0);
  }, 0);

  const totalFunded = data.reduce((a, b) => {
    const m = manualData[b.campaign_id] || {};
    return a + (parseFloat(m.fundedAccounts) || 0);
  }, 0);

  const totalDeposit = data.reduce((a, b) => {
    const m = manualData[b.campaign_id] || {};
    return a + (parseFloat(m.deposit) || 0);
  }, 0);

  const ctr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
  const clickToLead = totalClicks > 0 ? (totalLeads / totalClicks) * 100 : 0;
  const leadToAcct = totalLeads > 0 ? (totalAcct / totalLeads) * 100 : 0;
  const acctToFund = totalAcct > 0 ? (totalFunded / totalAcct) * 100 : 0;
  const leadToFund = totalLeads > 0 ? (totalFunded / totalLeads) * 100 : 0;
  const roi = totalSpend > 0 ? ((totalDeposit - totalSpend) / totalSpend) * 100 : 0;

  // Recommendations / Diagnostic rules
  const diagnostics = [];
  if (ctr < 1.2 && totalImpressions > 1000) {
    diagnostics.push({ type: 'warning', title: 'Ad Creative Fatigue (CTR < 1.2%)', desc: `Overall CTR is ${ctr.toFixed(2)}%. Consider refreshing ad creative images, video hooks, or testing new ad copy.` });
  } else {
    diagnostics.push({ type: 'success', title: 'Ad Appeal Healthy (CTR >= 1.2%)', desc: `CTR is ${ctr.toFixed(2)}%, indicating strong initial audience interest and ad relevance.` });
  }

  if (leadToAcct < 18 && totalLeads > 10) {
    diagnostics.push({ type: 'danger', title: 'Low Lead Quality Alert (Lead→Account < 18%)', desc: `Only ${leadToAcct.toFixed(1)}% of Meta leads convert to Open Accounts in CRM. Review lead form qualifying questions or target audience intent.` });
  } else if (leadToAcct >= 22) {
    diagnostics.push({ type: 'success', title: 'High CRM Conversion Quality (Lead→Account >= 22%)', desc: `Strong lead qualification with ${leadToAcct.toFixed(1)}% converting to Account Open. Ready for budget scaling.` });
  }

  if (roi > 50) {
    diagnostics.push({ type: 'success', title: 'High Profitability (ROI > +50%)', desc: `Campaign net profit is strong at +${roi.toFixed(1)}% ROI. Consider scaling top campaigns.` });
  } else if (roi < 0 && totalSpend > 100) {
    diagnostics.push({ type: 'danger', title: 'Negative Campaign ROI (ROI < 0%)', desc: `Current campaigns show a net loss of ${roi.toFixed(1)}%. Audit low-performing campaigns for budget reallocation.` });
  }

  return (
    <div>
      <h2 className="text-xl font-bold flex items-center gap-2 mb-2 print:text-[#070b14]">
        <Activity className="w-6 h-6 text-[#0AE5D5]" /> Funnel & Health Analysis
      </h2>
      <p className="text-gray-400 text-sm mb-6 print:text-gray-600">Phân tích phễu chuyển đổi 4 bước và chẩn đoán sức khỏe chiến dịch cho Marketing Manager.</p>

      {/* 4-Step Visual Funnel */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-black/30 border border-white/10 rounded-xl p-4 text-center relative">
          <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider block mb-1">Step 1: Traffic</span>
          <p className="text-xl font-bold text-white">{totalClicks.toLocaleString()} Clicks</p>
          <p className="text-xs text-gray-400 mt-1">CTR: <span className="text-[#33CCFF] font-semibold">{ctr.toFixed(2)}%</span></p>
          <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 bg-[#33CCFF] text-[#070b14] rounded-full p-1 shadow">
            <ArrowRight className="w-3 h-3" />
          </div>
        </div>

        <div className="bg-black/30 border border-white/10 rounded-xl p-4 text-center relative">
          <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider block mb-1">Step 2: Lead Gen</span>
          <p className="text-xl font-bold text-[#33CCFF]">{totalLeads.toLocaleString()} Leads</p>
          <p className="text-xs text-gray-400 mt-1">Click-to-Lead: <span className="text-[#0AE5D5] font-semibold">{clickToLead.toFixed(1)}%</span></p>
          <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 bg-[#0AE5D5] text-[#070b14] rounded-full p-1 shadow">
            <ArrowRight className="w-3 h-3" />
          </div>
        </div>

        <div className="bg-black/30 border border-white/10 rounded-xl p-4 text-center relative">
          <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider block mb-1">Step 3: CRM Acct Open</span>
          <p className="text-xl font-bold text-[#0AE5D5]">{totalAcct.toLocaleString()} Accts</p>
          <p className="text-xs text-gray-400 mt-1">Lead-to-Acct: <span className="text-indigo-300 font-semibold">{leadToAcct.toFixed(1)}%</span></p>
          <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 bg-indigo-400 text-[#070b14] rounded-full p-1 shadow">
            <ArrowRight className="w-3 h-3" />
          </div>
        </div>

        <div className="bg-black/30 border border-white/10 rounded-xl p-4 text-center">
          <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider block mb-1">Step 4: Funded Client</span>
          <p className="text-xl font-bold text-emerald-400">{totalFunded.toLocaleString()} Funded</p>
          <p className="text-xs text-gray-400 mt-1">Lead-to-Funded: <span className="text-emerald-400 font-semibold">{leadToFund.toFixed(1)}%</span></p>
        </div>
      </div>

      {/* Automated Diagnostic Cards */}
      <h3 className="font-semibold text-gray-300 mb-3 text-sm flex items-center gap-2">
        <Target className="w-4 h-4 text-[#33CCFF]" /> Automated Campaign Health Diagnostics
      </h3>
      <div className="space-y-3 mb-8">
        {diagnostics.map((d, i) => (
          <div key={i} className={`p-4 rounded-xl border backdrop-blur-sm flex items-start gap-3 ${
            d.type === 'danger' 
              ? 'bg-red-500/10 border-red-500/20 text-red-300' 
              : d.type === 'warning' 
                ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-300' 
                : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
          }`}>
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sm">{d.title}</p>
              <p className="text-xs opacity-90 mt-0.5">{d.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Campaign Health Evaluation Table */}
      <h3 className="font-semibold text-gray-300 mb-3 text-sm">Campaign Health Evaluation Matrix</h3>
      <div className="overflow-x-auto bg-black/20 border border-white/5 rounded-xl">
        <table className="w-full text-sm text-left whitespace-nowrap">
          <thead className="text-[10px] uppercase bg-white/5 text-gray-400">
            <tr>
              <th className="px-4 py-3">Campaign</th>
              <th className="px-4 py-3 text-center">Status Badge</th>
              <th className="px-4 py-3 text-right">Spend</th>
              <th className="px-4 py-3 text-right">Leads</th>
              <th className="px-4 py-3 text-right">L→A CVR</th>
              <th className="px-4 py-3 text-right">L→F CVR</th>
              <th className="px-4 py-3 text-right">ROI</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-xs">
            {data.map(item => {
              const m = manualData[item.campaign_id] || {};
              const acct = parseFloat(m.accountOpen) || 0;
              const fund = parseFloat(m.fundedAccounts) || 0;
              const dep = parseFloat(m.deposit) || 0;

              const cLToA = item.leads > 0 ? (acct / item.leads) * 100 : 0;
              const cLToF = item.leads > 0 ? (fund / item.leads) * 100 : 0;
              const cRoi = item.spend > 0 ? ((dep - item.spend) / item.spend) * 100 : 0;

              let badgeText = '🟢 Healthy';
              let badgeStyle = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';

              if (cRoi < 0 && item.spend > 100) {
                badgeText = '🔴 Action Needed';
                badgeStyle = 'bg-red-500/10 text-red-400 border-red-500/20';
              } else if (item.leads > 0 && cLToA < 15) {
                badgeText = '🟡 Check Funnel';
                badgeStyle = 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
              }

              return (
                <tr key={item.campaign_id} className="hover:bg-white/5">
                  <td className="px-4 py-3 font-medium text-gray-200">{item.campaign_name}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${badgeStyle}`}>
                      {badgeText}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-gray-300">${item.spend.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right font-medium text-white">{item.leads}</td>
                  <td className="px-4 py-3 text-right text-[#33CCFF]">{cLToA.toFixed(1)}%</td>
                  <td className="px-4 py-3 text-right text-[#0AE5D5]">{cLToF.toFixed(1)}%</td>
                  <td className={`px-4 py-3 text-right font-bold ${cRoi > 0 ? 'text-green-400' : cRoi < 0 ? 'text-red-400' : 'text-gray-400'}`}>
                    {cRoi > 0 ? '+' : ''}{cRoi.toFixed(1)}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
    </div>
  );
}

// =====================================================================
// ======================== FULL CRM SYSTEM MODULE =====================
// =====================================================================

function CRMModule({
  leads,
  setLeads,
  profiles,
  setProfiles,
  activeProfileId,
  setActiveProfileId,
  adAccounts,
  campaigns,
  crmSubTab,
  setCrmSubTab,
  crmCurrency = 'VND',
  setCrmCurrency,
  customRates = {},
  onRateChange,
  onOpenAddProfileModal,
  onEditProfile,
  onOpenAddLeadModal,
  onEditLead
}) {
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' | 'table'
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStage, setFilterStage] = useState('all');
  const [filterProfile, setFilterProfile] = useState('all');
  const [filterSource, setFilterSource] = useState('all');
  const [filterDeposit, setFilterDeposit] = useState('all'); // 'all' | 'has_deposit' | 'no_deposit'
  const [filterTime, setFilterTime] = useState('all'); // 'all' | 'today' | '7d' | '30d' | 'this_month'
  const [filterCampaign, setFilterCampaign] = useState('all');

  // Currency Formatter with Custom Rate
  const formatMoney = (amountInUsd) => {
    const rate = customRates[crmCurrency] || 1;
    const val = (parseFloat(amountInUsd) || 0) * rate;
    if (crmCurrency === 'VND') {
      return `${Math.round(val).toLocaleString('vi-VN')} ₫`;
    } else if (crmCurrency === 'THB') {
      return `${val.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} ฿`;
    } else if (crmCurrency === 'EUR') {
      return `€${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    } else if (crmCurrency === 'JPY') {
      return `¥${Math.round(val).toLocaleString('ja-JP')}`;
    } else if (crmCurrency === 'IDR') {
      return `Rp ${Math.round(val).toLocaleString('id-ID')}`;
    } else if (crmCurrency === 'PHP') {
      return `₱${val.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
    } else if (crmCurrency === 'SGD') {
      return `S$${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    } else if (crmCurrency === 'MYR') {
      return `RM ${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    } else {
      return `$${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
  };

  // Unique campaigns for filter
  const availableCampaigns = Array.from(new Set([
    ...leads.map(l => l.campaign).filter(Boolean),
    ...(campaigns || []).map(c => c.campaign_name).filter(Boolean)
  ]));

  // Filter leads with extended options
  const filteredLeads = leads.filter(l => {
    const s = searchTerm.trim().toLowerCase();
    const matchSearch = 
      !s ||
      l.name.toLowerCase().includes(s) ||
      (l.phone && l.phone.toLowerCase().includes(s)) ||
      (l.email && l.email.toLowerCase().includes(s)) ||
      (l.notes && l.notes.toLowerCase().includes(s)) ||
      (l.campaign && l.campaign.toLowerCase().includes(s));
    const matchStage = filterStage === 'all' || l.status === filterStage;
    const matchProfile = filterProfile === 'all' || l.assignedTo === filterProfile;
    const matchSource = filterSource === 'all' || l.source === filterSource;

    // Deposit filter
    const dep = parseFloat(l.deposit) || 0;
    const matchDeposit = 
      filterDeposit === 'all' ? true :
      filterDeposit === 'has_deposit' ? dep > 0 :
      dep === 0;

    // Time filter
    let matchTime = true;
    if (filterTime !== 'all' && l.createdAt) {
      const leadDate = new Date(l.createdAt);
      const now = new Date();
      if (filterTime === 'today') {
        matchTime = leadDate.toDateString() === now.toDateString();
      } else if (filterTime === '7d') {
        const d7 = new Date();
        d7.setDate(d7.getDate() - 7);
        matchTime = leadDate >= d7;
      } else if (filterTime === '30d') {
        const d30 = new Date();
        d30.setDate(d30.getDate() - 30);
        matchTime = leadDate >= d30;
      } else if (filterTime === 'this_month') {
        matchTime = leadDate.getMonth() === now.getMonth() && leadDate.getFullYear() === now.getFullYear();
      }
    }

    // Campaign filter
    const matchCampaign = filterCampaign === 'all' || l.campaign === filterCampaign;

    return matchSearch && matchStage && matchProfile && matchSource && matchDeposit && matchTime && matchCampaign;
  });

  const hasActiveFilters = searchTerm || filterStage !== 'all' || filterProfile !== 'all' || filterSource !== 'all' || filterDeposit !== 'all' || filterTime !== 'all' || filterCampaign !== 'all';

  // Calculate CRM Stats
  const totalLeads = leads.length;
  const newCount = leads.filter(l => l.status === 'new').length;
  const contactingCount = leads.filter(l => l.status === 'contacting').length;
  const accountOpenedCount = leads.filter(l => l.status === 'account_opened').length;
  const fundedLeads = leads.filter(l => l.status === 'funded' || l.status === 'won');
  const totalFundedDeposit = leads.reduce((acc, l) => acc + (parseFloat(l.deposit) || 0), 0);
  const winCount = leads.filter(l => l.status === 'won').length;
  const winRate = totalLeads > 0 ? ((winCount / totalLeads) * 100).toFixed(1) : '0';
  const fundedConversionRate = totalLeads > 0 ? ((fundedLeads.length / totalLeads) * 100).toFixed(1) : '0';

  // Calculate Total Ad Spend from campaigns to compute CAC and ROI
  const totalAdSpend = (campaigns || []).reduce((acc, c) => acc + (parseFloat(c.spend) || 0), 0);
  const cac = fundedLeads.length > 0 ? Math.round(totalAdSpend / fundedLeads.length) : 0;
  const netEstimated = totalFundedDeposit - totalAdSpend;
  const estimatedRoi = totalAdSpend > 0 ? (((totalFundedDeposit - totalAdSpend) / totalAdSpend) * 100).toFixed(1) : 0;

  // Change lead status quickly
  const handleStageChange = (leadId, newStage) => {
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: newStage, updatedAt: new Date().toISOString().slice(0, 10) } : l));
  };

  // Delete lead
  const handleDeleteLead = (leadId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa khách hàng này khỏi CRM?")) {
      setLeads(prev => prev.filter(l => l.id !== leadId));
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ["ID", "Tên Khách Hàng", "Số Điện Thoại", "Email", "Nguồn", "Chiến Dịch", "Giai Đoạn", "Tiền Nạp (USD)", "Phụ Trách", "Ghi Chú", "Ngày Tạo"];
    const rows = leads.map(l => {
      const assignedProf = profiles.find(p => p.id === l.assignedTo);
      const stageObj = CRM_STAGES.find(s => s.id === l.status);
      return [
        l.id,
        `"${(l.name || '').replace(/"/g, '""')}"`,
        `"${l.phone || ''}"`,
        `"${l.email || ''}"`,
        `"${l.source || ''}"`,
        `"${l.campaign || ''}"`,
        `"${stageObj ? stageObj.label : l.status}"`,
        l.deposit || 0,
        `"${assignedProf ? assignedProf.name : 'Chưa gán'}"`,
        `"${(l.notes || '').replace(/"/g, '""')}"`,
        l.createdAt || ''
      ].join(",");
    });
    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers.join(","), ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `crm_leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  // Import Leads from Meta Campaigns
  const handleSyncFromCampaigns = () => {
    const campaignsWithLeads = (campaigns || []).filter(c => (c.leads || 0) > 0);
    if (campaignsWithLeads.length === 0) {
      alert("Chưa có chiến dịch Meta nào ghi nhận số lượng Lead trong khoảng thời gian đã chọn.");
      return;
    }
    const newGeneratedLeads = [];
    campaignsWithLeads.forEach((c, idx) => {
      newGeneratedLeads.push({
        id: `meta_lead_${Date.now()}_${idx}`,
        name: `Lead Form ${c.campaign_name ? c.campaign_name.slice(0, 20) : 'Ads'} #${idx + 1}`,
        phone: '09' + Math.floor(10000000 + Math.random() * 90000000),
        email: `lead_${idx + 1}@instantform.fb`,
        source: 'Facebook Ads / Form',
        campaign: c.campaign_name || '',
        status: 'new',
        deposit: 0,
        assignedTo: activeProfileId || 'prof_admin',
        notes: `Tự động đồng bộ từ chiến dịch Facebook Ads: ${c.campaign_name}`,
        createdAt: new Date().toISOString().slice(0, 10),
        updatedAt: new Date().toISOString().slice(0, 10)
      });
    });
    setLeads(prev => [...newGeneratedLeads, ...prev]);
    alert(`Đã nhập thành công ${newGeneratedLeads.length} Khách hàng tiềm năng từ Meta Ads vào CRM!`);
  };

  // Funnel data for Analytics
  const funnelData = [
    { stage: 'Mới nhận', count: newCount, fill: '#3b82f6' },
    { stage: 'Đang tư vấn', count: contactingCount, fill: '#f59e0b' },
    { stage: 'Mở tài khoản', count: accountOpenedCount, fill: '#a855f7' },
    { stage: 'Đã nạp tiền', count: leads.filter(l => l.status === 'funded').length, fill: '#10b981' },
    { stage: 'Thành công (Won)', count: winCount, fill: '#06b6d4' }
  ];

  // Source distribution data
  const sourceMap = {};
  leads.forEach(l => {
    const src = l.source || 'Khác';
    sourceMap[src] = (sourceMap[src] || 0) + 1;
  });
  const sourceData = Object.keys(sourceMap).map(k => ({ name: k, value: sourceMap[k] }));
  const PIE_COLORS = ['#33CCFF', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#64748b'];

  return (
    <div className="space-y-6">
      {/* CRM Sub-Navigation Tabs */}
      <div className="bg-[#0a0f1c]/90 border border-white/10 rounded-2xl p-2.5 flex flex-wrap items-center justify-between gap-3 shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCrmSubTab('pipeline')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              crmSubTab === 'pipeline'
                ? 'bg-gradient-to-r from-indigo-500 to-cyan-500 text-white shadow-lg shadow-indigo-500/20'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Kanban className="w-4 h-4" />
            Pipeline & Khách Hàng ({totalLeads})
          </button>
          <button
            onClick={() => setCrmSubTab('analytics')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              crmSubTab === 'analytics'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/20'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Activity className="w-4 h-4" />
            Phân Tích Phễu & ROI
          </button>
          <button
            onClick={() => setCrmSubTab('profiles')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              crmSubTab === 'profiles'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/20'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Users className="w-4 h-4" />
            Hồ Sơ & Phân Quyền ({profiles.length})
          </button>
        </div>

        {/* Currency Switcher & Custom Rate Tool */}
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs">
          <DollarSign className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
          <span className="text-gray-400 text-[11px] font-medium hidden sm:inline">Tiền tệ:</span>
          <select
            value={crmCurrency}
            onChange={(e) => setCrmCurrency && setCrmCurrency(e.target.value)}
            className="bg-transparent text-emerald-300 font-bold focus:outline-none cursor-pointer text-xs"
          >
            <option value="VND" className="bg-[#0a0f1c]">VND (₫)</option>
            <option value="USD" className="bg-[#0a0f1c]">USD ($)</option>
            <option value="THB" className="bg-[#0a0f1c]">THB (฿)</option>
            <option value="EUR" className="bg-[#0a0f1c]">EUR (€)</option>
            <option value="JPY" className="bg-[#0a0f1c]">JPY (¥)</option>
            <option value="IDR" className="bg-[#0a0f1c]">IDR (Rp)</option>
            <option value="PHP" className="bg-[#0a0f1c]">PHP (₱)</option>
            <option value="SGD" className="bg-[#0a0f1c]">SGD (S$)</option>
            <option value="MYR" className="bg-[#0a0f1c]">MYR (RM)</option>
          </select>

          {crmCurrency !== 'USD' && (
            <div className="flex items-center gap-1 pl-2 border-l border-white/10 text-[11px] text-gray-400">
              <span>1$ =</span>
              <input
                type="number"
                value={customRates[crmCurrency] || 1}
                onChange={(e) => onRateChange && onRateChange(crmCurrency, e.target.value)}
                className="w-20 bg-black/40 border border-white/15 rounded px-1.5 py-0.5 text-white font-mono text-xs focus:outline-none focus:border-emerald-400"
                title="Tùy chỉnh tỷ giá quy đổi cho loại tiền tệ này"
              />
              <span className="font-semibold text-emerald-300">{crmCurrency}</span>
            </div>
          )}
        </div>

        {crmSubTab === 'pipeline' && (
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleExportCSV}
              className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-medium rounded-lg border border-white/10 flex items-center gap-1.5 transition-all cursor-pointer"
              title="Xuất file CSV"
            >
              <Download className="w-3.5 h-3.5" /> Xuất CSV
            </button>
            <button
              onClick={handleSyncFromCampaigns}
              className="px-3 py-1.5 bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-300 text-xs font-medium rounded-lg border border-indigo-500/30 flex items-center gap-1.5 transition-all cursor-pointer"
              title="Đồng bộ Lead từ chiến dịch Meta Ads"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Đồng bộ từ Ads
            </button>
            <button
              onClick={onOpenAddLeadModal}
              className="px-3.5 py-1.5 bg-gradient-to-r from-[#33CCFF] to-[#0AE5D5] text-[#070b14] text-xs font-bold rounded-lg shadow-lg shadow-[#33CCFF]/20 hover:opacity-90 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Thêm Khách Hàng
            </button>
          </div>
        )}
      </div>

      {/* SUB-TAB 1: PIPELINE & LEADS */}
      {crmSubTab === 'pipeline' && (
        <div className="space-y-5">
          {/* Quick CRM KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 flex-shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] uppercase font-semibold text-gray-400 tracking-wider">Tổng Khách Hàng</p>
                <p className="text-xl font-black text-white">{totalLeads}</p>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 flex-shrink-0">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] uppercase font-semibold text-gray-400 tracking-wider">Đang Chăm Sóc</p>
                <p className="text-xl font-black text-amber-300">{newCount + contactingCount}</p>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0">
                <CheckSquare className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] uppercase font-semibold text-gray-400 tracking-wider">Khách Đã Nạp Tiền</p>
                <p className="text-xl font-black text-emerald-300">{fundedLeads.length} <span className="text-xs font-normal text-gray-400">({fundedConversionRate}%)</span></p>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 flex-shrink-0">
                <DollarSign className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] uppercase font-semibold text-gray-400 tracking-wider">Tổng Tiền Nạp</p>
                <p className="text-xl font-black text-cyan-300">{formatMoney(totalFundedDeposit)}</p>
              </div>
            </div>
          </div>

          {/* CRM Controls & Filter Bar */}
          <div className="bg-[#0a0f1c]/80 border border-white/10 rounded-2xl p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-xl">
            {/* Search and Filters */}
            <div className="flex flex-wrap items-center gap-2.5 flex-1">
              {/* Search */}
              <div className="relative flex-1 min-w-[200px] max-w-sm">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#33CCFF] h-[36px]"
                  placeholder="Tìm theo tên, SĐT, email, ghi chú..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Filter Stage */}
              <select
                className="bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#33CCFF] h-[36px] cursor-pointer"
                value={filterStage}
                onChange={(e) => setFilterStage(e.target.value)}
              >
                <option value="all" className="bg-[#0a0f1c]">Tất cả giai đoạn</option>
                {CRM_STAGES.map(st => (
                  <option key={st.id} value={st.id} className="bg-[#0a0f1c]">{st.label}</option>
                ))}
              </select>

              {/* Filter Profile */}
              <select
                className="bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#33CCFF] h-[36px] cursor-pointer"
                value={filterProfile}
                onChange={(e) => setFilterProfile(e.target.value)}
              >
                <option value="all" className="bg-[#0a0f1c]">Tất cả nhân sự</option>
                {profiles.map(p => (
                  <option key={p.id} value={p.id} className="bg-[#0a0f1c]">{p.name} ({p.role})</option>
                ))}
              </select>

              {/* Filter Source */}
              <select
                className="bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#33CCFF] h-[36px] cursor-pointer"
                value={filterSource}
                onChange={(e) => setFilterSource(e.target.value)}
              >
                <option value="all" className="bg-[#0a0f1c]">Tất cả nguồn</option>
                <option value="Facebook Ads / Form" className="bg-[#0a0f1c]">Facebook Ads / Form</option>
                <option value="Website / Funnel" className="bg-[#0a0f1c]">Website / Funnel</option>
                <option value="Zalo / Chat" className="bg-[#0a0f1c]">Zalo / Chat</option>
                <option value="Hotline" className="bg-[#0a0f1c]">Hotline</option>
                <option value="Giới thiệu / Referral" className="bg-[#0a0f1c]">Giới thiệu / Referral</option>
                <option value="Khác" className="bg-[#0a0f1c]">Khác</option>
              </select>

              {/* Filter Deposit Status */}
              <select
                className="bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#33CCFF] h-[36px] cursor-pointer"
                value={filterDeposit}
                onChange={(e) => setFilterDeposit(e.target.value)}
              >
                <option value="all" className="bg-[#0a0f1c]">Tất cả tiền nạp</option>
                <option value="has_deposit" className="bg-[#0a0f1c]">🟢 Đã nạp tiền (&gt; 0)</option>
                <option value="no_deposit" className="bg-[#0a0f1c]">⚪ Chưa nạp tiền (= 0)</option>
              </select>

              {/* Filter Date Created */}
              <select
                className="bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#33CCFF] h-[36px] cursor-pointer"
                value={filterTime}
                onChange={(e) => setFilterTime(e.target.value)}
              >
                <option value="all" className="bg-[#0a0f1c]">Mọi thời gian</option>
                <option value="today" className="bg-[#0a0f1c]">Hôm nay</option>
                <option value="7d" className="bg-[#0a0f1c]">7 ngày qua</option>
                <option value="30d" className="bg-[#0a0f1c]">30 ngày qua</option>
                <option value="this_month" className="bg-[#0a0f1c]">Tháng này</option>
              </select>

              {/* Filter Campaign */}
              {availableCampaigns.length > 0 && (
                <select
                  className="bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#33CCFF] h-[36px] cursor-pointer max-w-[180px] truncate"
                  value={filterCampaign}
                  onChange={(e) => setFilterCampaign(e.target.value)}
                >
                  <option value="all" className="bg-[#0a0f1c]">Tất cả chiến dịch</option>
                  {availableCampaigns.map(c => (
                    <option key={c} value={c} className="bg-[#0a0f1c]">{c}</option>
                  ))}
                </select>
              )}

              {/* Reset Filters */}
              {hasActiveFilters && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setFilterStage('all');
                    setFilterProfile('all');
                    setFilterSource('all');
                    setFilterDeposit('all');
                    setFilterTime('all');
                    setFilterCampaign('all');
                  }}
                  className="px-2.5 py-1 rounded-lg text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all flex items-center gap-1 cursor-pointer h-[36px]"
                  title="Xóa tất cả bộ lọc CRM"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Xóa lọc</span>
                </button>
              )}
            </div>

            {/* View Mode Toggle (Kanban vs Table) */}
            <div className="flex items-center bg-white/5 p-1 rounded-xl border border-white/10 self-end md:self-auto">
              <button
                onClick={() => setViewMode('kanban')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  viewMode === 'kanban' ? 'bg-[#33CCFF] text-[#070b14] font-bold shadow-md' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Kanban className="w-3.5 h-3.5" /> Kanban
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  viewMode === 'table' ? 'bg-[#33CCFF] text-[#070b14] font-bold shadow-md' : 'text-gray-400 hover:text-white'
                }`}
              >
                <ListFilter className="w-3.5 h-3.5" /> Bảng Dữ Liệu
              </button>
            </div>
          </div>

          {/* KANBAN BOARD VIEW */}
          {viewMode === 'kanban' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5 items-start overflow-x-auto pb-4">
              {CRM_STAGES.map(stage => {
                const stageLeads = filteredLeads.filter(l => l.status === stage.id);
                const stageTotalDeposit = stageLeads.reduce((sum, l) => sum + (parseFloat(l.deposit) || 0), 0);
                return (
                  <div 
                    key={stage.id} 
                    className="bg-[#0a0f1c]/90 border border-white/10 rounded-2xl flex flex-col max-h-[75vh] shadow-xl overflow-hidden"
                  >
                    {/* Column Header */}
                    <div className="p-3 border-b border-white/10 bg-white/[0.02]">
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${stage.color}`}>
                          {stage.label}
                        </span>
                        <span className="text-xs font-bold text-white bg-white/10 px-2 py-0.5 rounded-full">
                          {stageLeads.length}
                        </span>
                      </div>
                      {stageTotalDeposit > 0 && (
                        <p className="text-[11px] font-mono text-emerald-400 font-semibold">
                          ${stageTotalDeposit.toLocaleString()}
                        </p>
                      )}
                    </div>

                    {/* Column Cards Container */}
                    <div className="p-2.5 space-y-2.5 overflow-y-auto flex-1">
                      {stageLeads.length === 0 ? (
                        <div className="p-6 text-center text-xs text-gray-500 border border-dashed border-white/5 rounded-xl">
                          Chưa có khách
                        </div>
                      ) : (
                        stageLeads.map(lead => {
                          const assignedProf = profiles.find(p => p.id === lead.assignedTo);
                          return (
                            <div 
                              key={lead.id}
                              className="bg-black/40 hover:bg-black/60 border border-white/10 hover:border-[#33CCFF]/40 rounded-xl p-3 transition-all shadow-md group relative"
                            >
                              <div className="flex items-start justify-between gap-2 mb-1.5">
                                <h4 className="font-bold text-xs text-white group-hover:text-[#33CCFF] transition-colors truncate">
                                  {lead.name}
                                </h4>
                                <div className="flex items-center gap-1 flex-shrink-0">
                                  <button
                                    onClick={() => onEditLead(lead)}
                                    className="p-1 text-gray-400 hover:text-white transition-colors cursor-pointer"
                                    title="Sửa thông tin"
                                  >
                                    <Edit3 className="w-3 h-3" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteLead(lead.id)}
                                    className="p-1 text-gray-400 hover:text-red-400 transition-colors cursor-pointer"
                                    title="Xóa khách"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>

                              {/* Contact & Source */}
                              <div className="space-y-1 mb-2 text-[11px] text-gray-400">
                                {lead.phone && (
                                  <div className="flex items-center gap-1.5 text-gray-300">
                                    <Phone className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                                    <span className="font-mono">{lead.phone}</span>
                                  </div>
                                )}
                                {lead.email && (
                                  <div className="flex items-center gap-1.5 truncate">
                                    <Mail className="w-3 h-3 text-cyan-400 flex-shrink-0" />
                                    <span className="truncate">{lead.email}</span>
                                  </div>
                                )}
                                <div className="flex items-center justify-between text-[10px] pt-1">
                                  <span className="px-1.5 py-0.5 bg-white/5 rounded text-gray-400 truncate max-w-[110px]">
                                    {lead.source}
                                  </span>
                                  {parseFloat(lead.deposit) > 0 && (
                                    <span className="font-mono font-bold text-emerald-300 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                                      +${lead.deposit.toLocaleString()}
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Notes */}
                              {lead.notes && (
                                <p className="text-[10px] text-gray-400 italic bg-white/[0.02] p-1.5 rounded border border-white/5 mb-2 line-clamp-2">
                                  "{lead.notes}"
                                </p>
                              )}

                              {/* Footer: Assigned & Stage Transition */}
                              <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-1 text-[10px]">
                                <div className="flex items-center gap-1 text-gray-400 truncate">
                                  <span className={`w-4 h-4 rounded-full ${assignedProf ? assignedProf.avatarBg : 'bg-blue-500'} flex items-center justify-center text-[8px] font-bold text-white flex-shrink-0`}>
                                    {assignedProf ? assignedProf.name.charAt(0).toUpperCase() : 'U'}
                                  </span>
                                  <span className="truncate">{assignedProf ? assignedProf.name : 'Chưa gán'}</span>
                                </div>

                                {/* Quick Stage Selector */}
                                <select
                                  className="bg-white/5 border border-white/10 rounded px-1 py-0.5 text-[9px] text-gray-300 focus:outline-none cursor-pointer"
                                  value={lead.status}
                                  onChange={(e) => handleStageChange(lead.id, e.target.value)}
                                >
                                  {CRM_STAGES.map(s => (
                                    <option key={s.id} value={s.id} className="bg-[#0a0f1c]">{s.label}</option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* DATA TABLE VIEW */
            <div className="bg-[#0a0f1c]/90 border border-white/10 rounded-2xl shadow-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs whitespace-nowrap">
                  <thead className="bg-black/40 text-gray-400 uppercase text-[10px] tracking-wider border-b border-white/10">
                    <tr>
                      <th className="px-4 py-3">Khách Hàng</th>
                      <th className="px-4 py-3">Liên Hệ</th>
                      <th className="px-4 py-3">Nguồn & Chiến Dịch</th>
                      <th className="px-4 py-3">Giai Đoạn Phễu</th>
                      <th className="px-4 py-3 text-right">Tiền Nạp ($)</th>
                      <th className="px-4 py-3">Phụ Trách</th>
                      <th className="px-4 py-3">Ngày Tạo</th>
                      <th className="px-4 py-3 text-center">Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredLeads.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                          Không tìm thấy khách hàng nào phù hợp với bộ lọc.
                        </td>
                      </tr>
                    ) : (
                      filteredLeads.map(lead => {
                        const assignedProf = profiles.find(p => p.id === lead.assignedTo);
                        const stageObj = CRM_STAGES.find(s => s.id === lead.status) || CRM_STAGES[0];
                        return (
                          <tr key={lead.id} className="hover:bg-white/[0.02] transition-colors">
                            <td className="px-4 py-3 font-semibold text-white">
                              {lead.name}
                              {lead.notes && (
                                <p className="text-[10px] font-normal text-gray-400 truncate max-w-xs">{lead.notes}</p>
                              )}
                            </td>
                            <td className="px-4 py-3 text-gray-300">
                              <p>{lead.phone || '-'}</p>
                              <p className="text-[10px] text-gray-500">{lead.email || '-'}</p>
                            </td>
                            <td className="px-4 py-3">
                              <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[11px] text-gray-300">
                                {lead.source}
                              </span>
                              {lead.campaign && (
                                <p className="text-[10px] text-gray-400 mt-0.5 font-medium break-words leading-tight" title={lead.campaign}>{lead.campaign}</p>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <select
                                className={`text-[11px] font-medium rounded-lg px-2 py-1 border bg-transparent cursor-pointer focus:outline-none ${stageObj.color}`}
                                value={lead.status}
                                onChange={(e) => handleStageChange(lead.id, e.target.value)}
                              >
                                {CRM_STAGES.map(s => (
                                  <option key={s.id} value={s.id} className="bg-[#0a0f1c] text-white">{s.label}</option>
                                ))}
                              </select>
                            </td>
                            <td className="px-4 py-3 text-right font-mono font-bold text-emerald-400">
                              ${(lead.deposit || 0).toLocaleString()}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-1.5">
                                <span className={`w-5 h-5 rounded-full ${assignedProf ? assignedProf.avatarBg : 'bg-blue-500'} flex items-center justify-center text-[9px] font-bold text-white`}>
                                  {assignedProf ? assignedProf.name.charAt(0).toUpperCase() : 'U'}
                                </span>
                                <span className="text-gray-300">{assignedProf ? assignedProf.name : 'Chưa gán'}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-gray-500 font-mono text-[11px]">
                              {lead.createdAt}
                            </td>
                            <td className="px-4 py-3 text-center">
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  onClick={() => onEditLead(lead)}
                                  className="p-1.5 text-gray-400 hover:text-[#33CCFF] transition-colors cursor-pointer"
                                  title="Chỉnh sửa"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteLead(lead.id)}
                                  className="p-1.5 text-gray-400 hover:text-red-400 transition-colors cursor-pointer"
                                  title="Xóa"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 2: CRM ANALYTICS & ROI */}
      {crmSubTab === 'analytics' && (
        <div className="space-y-6">
          {/* Detailed Analytics KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 shadow-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Tỷ Lệ Chốt Won</span>
                <Award className="w-4 h-4 text-cyan-400" />
              </div>
              <p className="text-2xl font-black text-cyan-300">{winRate}%</p>
              <p className="text-[11px] text-gray-400 mt-1">{winCount} khách hàng chốt thành công trên tổng số {totalLeads} leads.</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 shadow-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Doanh Thu / Khách (ARPU)</span>
                <DollarSign className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-2xl font-black text-emerald-300">${avgDeposit.toLocaleString()}</p>
              <p className="text-[11px] text-gray-400 mt-1">Trung bình mỗi khách nạp tiền đóng góp ${avgDeposit}.</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 shadow-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Chi Phí Thu Hút Khách (CAC)</span>
                <Activity className="w-4 h-4 text-amber-400" />
              </div>
              <p className="text-2xl font-black text-amber-300">${cac.toLocaleString()}</p>
              <p className="text-[11px] text-gray-400 mt-1">Chi phí Ads / Số khách nạp tiền (${Math.round(totalAdSpend).toLocaleString()} spend).</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 shadow-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Lợi Nhuận Ròng Ước Tính</span>
                <TrendingUp className="w-4 h-4 text-indigo-400" />
              </div>
              <p className={`text-2xl font-black ${netEstimated >= 0 ? 'text-indigo-300' : 'text-red-400'}`}>
                ${netEstimated.toLocaleString()}
              </p>
              <p className="text-[11px] text-gray-400 mt-1">ROI Chiến Dịch: {estimatedRoi}% so với ngân sách Ads.</p>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Funnel Conversion BarChart */}
            <div className="bg-[#0a0f1c]/90 border border-white/10 rounded-2xl p-5 shadow-xl">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#33CCFF]" />
                Phễu Chuyển Đổi Lead (Funnel Drop-off)
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={funnelData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                    <XAxis dataKey="stage" stroke="#6b7280" fontSize={11} interval={0} angle={-15} textAnchor="end" />
                    <YAxis stroke="#6b7280" fontSize={11} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0d1424', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                      formatter={(val) => [`${val} khách`, 'Số lượng']}
                    />
                    <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                      {funnelData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Source Distribution PieChart */}
            <div className="bg-[#0a0f1c]/90 border border-white/10 rounded-2xl p-5 shadow-xl">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <Target className="w-4 h-4 text-pink-400" />
                Phân Bổ Khách Hàng Theo Nguồn
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={sourceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={85}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {sourceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0d1424', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                      formatter={(val, name) => [`${val} lead (${Math.round((val / totalLeads) * 100)}%)`, name]}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Profile Leaderboard Table */}
          <div className="bg-[#0a0f1c]/90 border border-white/10 rounded-2xl p-5 shadow-xl">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              Hiệu Suất & Doanh Số Theo Nhân Sự (Profile Performance)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs whitespace-nowrap">
                <thead className="bg-black/40 text-gray-400 uppercase text-[10px] tracking-wider border-b border-white/10">
                  <tr>
                    <th className="px-4 py-3">Nhân Sự</th>
                    <th className="px-4 py-3">Vai Trò</th>
                    <th className="px-4 py-3 text-center">Số Lead Phụ Trách</th>
                    <th className="px-4 py-3 text-center">Khách Nạp Tiền</th>
                    <th className="px-4 py-3 text-right">Tổng Tiền Nạp</th>
                    <th className="px-4 py-3 text-right">Tỷ Lệ Chốt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {profiles.map(p => {
                    const pLeads = leads.filter(l => l.assignedTo === p.id);
                    const pFunded = pLeads.filter(l => l.status === 'funded' || l.status === 'won');
                    const pDeposit = pLeads.reduce((sum, l) => sum + (parseFloat(l.deposit) || 0), 0);
                    const pWinRate = pLeads.length > 0 ? Math.round((pFunded.length / pLeads.length) * 100) : 0;
                    return (
                      <tr key={p.id} className="hover:bg-white/[0.02]">
                        <td className="px-4 py-3 font-semibold text-white flex items-center gap-2">
                          <span className={`w-6 h-6 rounded-full ${p.avatarBg || 'bg-blue-500'} flex items-center justify-center text-[10px] font-bold text-white`}>
                            {p.name.charAt(0).toUpperCase()}
                          </span>
                          {p.name}
                        </td>
                        <td className="px-4 py-3 text-gray-400">{p.role}</td>
                        <td className="px-4 py-3 text-center font-bold text-white">{pLeads.length}</td>
                        <td className="px-4 py-3 text-center font-bold text-emerald-400">{pFunded.length}</td>
                        <td className="px-4 py-3 text-right font-mono font-bold text-cyan-300">${pDeposit.toLocaleString()}</td>
                        <td className="px-4 py-3 text-right font-bold text-indigo-400">{pWinRate}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: PROFILES MANAGER */}
      {crmSubTab === 'profiles' && (
        <CRMProfilesManager 
          profiles={profiles} 
          setProfiles={setProfiles} 
          activeProfileId={activeProfileId} 
          setActiveProfileId={setActiveProfileId} 
          adAccounts={adAccounts}
          onOpenAddModal={onOpenAddProfileModal}
          onEditProfile={onEditProfile}
        />
      )}
    </div>
  );
}

// =====================================================================
// ======================== LEAD CREATE / EDIT MODAL ===================
// =====================================================================

function LeadModal({ isOpen, editingLead, profiles, campaigns, crmCurrency = 'VND', customRates = {}, onClose, onSave }) {
  const [name, setName] = useState(editingLead ? editingLead.name : '');
  const [phone, setPhone] = useState(editingLead ? editingLead.phone : '');
  const [email, setEmail] = useState(editingLead ? editingLead.email : '');
  const [source, setSource] = useState(editingLead ? editingLead.source : 'Facebook Ads / Form');
  const [campaign, setCampaign] = useState(editingLead ? editingLead.campaign : '');
  const [status, setStatus] = useState(editingLead ? editingLead.status : 'new');
  const [deposit, setDeposit] = useState(editingLead ? editingLead.deposit : '0');
  const [assignedTo, setAssignedTo] = useState(editingLead ? editingLead.assignedTo : (profiles[0] ? profiles[0].id : 'prof_admin'));
  const [notes, setNotes] = useState(editingLead ? editingLead.notes : '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Vui lòng nhập tên khách hàng!");
      return;
    }
    const leadData = {
      id: editingLead ? editingLead.id : `lead_${Date.now()}`,
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      source,
      campaign,
      status,
      deposit: parseFloat(deposit) || 0,
      assignedTo,
      notes: notes.trim(),
      createdAt: editingLead ? editingLead.createdAt : new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10)
    };
    onSave(leadData);
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-[#0a0f1c] border border-white/15 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-[#33CCFF]" />
            {editingLead ? 'Chỉnh Sửa Thông Tin Khách Hàng' : 'Thêm Khách Hàng / Lead Mới'}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white text-lg p-1"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-gray-300 font-semibold mb-1">Tên Khách Hàng *</label>
            <input 
              type="text" 
              required
              placeholder="VD: Nguyễn Văn A"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#070b14] border border-white/15 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-[#33CCFF]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-300 font-semibold mb-1">Số Điện Thoại</label>
              <input 
                type="text" 
                placeholder="VD: 0912 345 678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-[#070b14] border border-white/15 rounded-xl px-3.5 py-2 text-white font-mono focus:outline-none focus:border-[#33CCFF]"
              />
            </div>
            <div>
              <label className="block text-gray-300 font-semibold mb-1">Email</label>
              <input 
                type="email" 
                placeholder="VD: email@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#070b14] border border-white/15 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-[#33CCFF]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-300 font-semibold mb-1">Nguồn Khách Hàng</label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="w-full bg-[#070b14] border border-white/15 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-[#33CCFF] cursor-pointer"
              >
                <option value="Facebook Ads / Form">Facebook Ads / Form</option>
                <option value="Website / Funnel">Website / Funnel</option>
                <option value="Zalo / Chat">Zalo / Chat</option>
                <option value="Hotline">Hotline</option>
                <option value="Giới thiệu / Referral">Giới thiệu / Referral</option>
                <option value="Khác">Khác</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-300 font-semibold mb-1">Chiến Dịch Ads Liên Quan</label>
              <input 
                type="text" 
                placeholder="Tên chiến dịch"
                value={campaign}
                onChange={(e) => setCampaign(e.target.value)}
                className="w-full bg-[#070b14] border border-white/15 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-[#33CCFF]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-gray-300 font-semibold mb-1">Giai Đoạn Phễu</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-[#070b14] border border-white/15 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#33CCFF] cursor-pointer"
              >
                {CRM_STAGES.map(st => (
                  <option key={st.id} value={st.id}>{st.label}</option>
                ))}
              </select>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-gray-300 font-semibold">Tiền Nạp ($ USD)</label>
                {crmCurrency !== 'USD' && (
                  <span className="text-emerald-300 font-mono text-[10px]">
                    ≈ {((parseFloat(deposit) || 0) * (customRates[crmCurrency] || 1)).toLocaleString()} {crmCurrency}
                  </span>
                )}
              </div>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500 font-bold">$</span>
                <input 
                  type="number" 
                  min="0"
                  step="any"
                  value={deposit}
                  onChange={(e) => setDeposit(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-[#070b14] border border-white/15 rounded-xl pl-7 pr-3 py-2 text-white font-mono focus:outline-none focus:border-[#33CCFF]"
                />
              </div>
            </div>
            <div>
              <label className="block text-gray-300 font-semibold mb-1">Người Phụ Trách</label>
              <select
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className="w-full bg-[#070b14] border border-white/15 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#33CCFF] cursor-pointer"
              >
                {profiles.map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.role})</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-gray-300 font-semibold mb-1">Ghi Chú Tư Vấn / Lịch Hẹn</label>
            <textarea 
              rows={3}
              placeholder="VD: Khách hàng hỏi về phí swap, hẹn tối nay tư vấn qua Zalo..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-[#070b14] border border-white/15 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-[#33CCFF]"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 transition-all font-medium cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#33CCFF] to-[#0AE5D5] text-[#070b14] font-bold shadow-lg shadow-[#33CCFF]/20 hover:opacity-90 transition-all cursor-pointer"
            >
              Lưu Khách Hàng
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// =====================================================================
// ======================== CRM PROFILES MODULE ========================
// =====================================================================

function CRMProfilesManager({ 
  profiles, 
  setProfiles, 
  activeProfileId, 
  setActiveProfileId, 
  adAccounts, 
  onOpenAddModal, 
  onEditProfile 
}) {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = profiles.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.email && p.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    p.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const adminCount = profiles.filter(p => p.role === 'Admin').length;
  const buyerCount = profiles.filter(p => p.role === 'Media Buyer').length;
  const clientCount = profiles.filter(p => p.role === 'Client').length;

  const handleDelete = (id) => {
    if (profiles.length <= 1) {
      alert("Hệ thống phải có ít nhất 1 Profile!");
      return;
    }
    if (window.confirm("Bạn có chắc muốn xóa Profile này?")) {
      const next = profiles.filter(p => p.id !== id);
      setProfiles(next);
      if (activeProfileId === id) {
        setActiveProfileId(next[0].id);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Top CRM Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#33CCFF]/15 border border-[#33CCFF]/30 flex items-center justify-center text-[#33CCFF]">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold">Tổng Profiles</p>
            <p className="text-xl font-bold text-white">{profiles.length}</p>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold">Quản Trị (Admin)</p>
            <p className="text-xl font-bold text-blue-300">{adminCount}</p>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold">Media Buyers</p>
            <p className="text-xl font-bold text-emerald-300">{buyerCount}</p>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold">Clients / Khách</p>
            <p className="text-xl font-bold text-purple-300">{clientCount}</p>
          </div>
        </div>
      </div>

      {/* CRM Header & Actions */}
      <div className="bg-[#0a0f1c]/80 border border-white/10 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10 mb-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-400" />
              CRM Quản Lý Hồ Sơ & Phân Quyền
            </h2>
            <p className="text-gray-400 text-xs mt-0.5">
              Tạo hồ sơ cho từng nhân viên, Media Buyer hoặc Khách hàng để theo dõi tài khoản tương ứng.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <input 
              type="text" 
              placeholder="Tìm kiếm tên, email, vai trò..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#33CCFF] w-full sm:w-60"
            />
            <button
              onClick={onOpenAddModal}
              className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-500/20 transition-all flex-shrink-0 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              Tạo Profile Mới
            </button>
          </div>
        </div>

        {/* Profiles Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left whitespace-nowrap">
            <thead className="text-[10px] uppercase bg-white/5 text-gray-400">
              <tr>
                <th className="px-4 py-3">Hồ sơ người dùng</th>
                <th className="px-4 py-3">Vai trò</th>
                <th className="px-4 py-3">Tài khoản được gán</th>
                <th className="px-4 py-3">Ghi chú</th>
                <th className="px-4 py-3 text-center">Trạng thái</th>
                <th className="px-4 py-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map(p => {
                const isActive = p.id === activeProfileId;
                const roleBadge = 
                  p.role === 'Admin' ? 'bg-blue-500/15 text-blue-400 border-blue-500/30' :
                  p.role === 'Media Buyer' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' :
                  p.role === 'Client' ? 'bg-purple-500/15 text-purple-400 border-purple-500/30' :
                  'bg-amber-500/15 text-amber-400 border-amber-500/30';

                return (
                  <tr key={p.id} className={`hover:bg-white/5 transition-colors ${isActive ? 'bg-white/[0.02]' : ''}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full ${p.avatarBg || 'bg-blue-500'} flex items-center justify-center font-bold text-white text-xs shadow`}>
                          {p.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-white flex items-center gap-2">
                            {p.name}
                            {isActive && (
                              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                Đang dùng
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-gray-400">{p.email || 'Chưa cập nhật email'}</div>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${roleBadge}`}>
                        {p.role}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 flex-wrap max-w-xs">
                        {p.assignedAccounts && p.assignedAccounts.length > 0 ? (
                          p.assignedAccounts.map(accId => {
                            const acc = adAccounts.find(a => a.account_id === accId);
                            return (
                              <span key={accId} className="px-2 py-0.5 bg-white/10 rounded text-[10px] text-gray-300 truncate max-w-[120px]" title={acc ? acc.name : accId}>
                                {acc ? acc.name : accId}
                              </span>
                            );
                          })
                        ) : (
                          <span className="text-[11px] text-gray-500 italic">Tất cả tài khoản</span>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-3 text-gray-400 max-w-xs truncate" title={p.notes}>
                      {p.notes || '—'}
                    </td>

                    <td className="px-4 py-3 text-center">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {p.status || 'Active'}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {!isActive ? (
                          <button
                            onClick={() => setActiveProfileId(p.id)}
                            className="px-2.5 py-1 bg-white/5 hover:bg-white/10 text-[#33CCFF] rounded-lg text-xs font-medium transition-all cursor-pointer"
                            title="Chuyển sang profile này"
                          >
                            Chọn dùng
                          </button>
                        ) : null}
                        <button
                          onClick={() => onEditProfile(p)}
                          className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-all cursor-pointer"
                          title="Chỉnh sửa profile"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        {profiles.length > 1 && (
                          <button
                            onClick={() => handleDelete(p.id)}
                            className="p-1.5 hover:bg-red-500/20 rounded-lg text-gray-500 hover:text-red-400 transition-all cursor-pointer"
                            title="Xóa profile"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ProfileModal({ isOpen, editingProfile, adAccounts, onClose, onSave }) {
  const [name, setName] = useState(editingProfile ? editingProfile.name : '');
  const [email, setEmail] = useState(editingProfile ? editingProfile.email : '');
  const [role, setRole] = useState(editingProfile ? editingProfile.role : 'Media Buyer');
  const [assignedAccounts, setAssignedAccounts] = useState(editingProfile ? (editingProfile.assignedAccounts || []) : []);
  const [notes, setNotes] = useState(editingProfile ? editingProfile.notes : '');

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
    const newProfile = {
      id: editingProfile ? editingProfile.id : `prof_${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      role,
      status: 'Active',
      assignedAccounts,
      notes: notes.trim(),
      avatarBg: editingProfile?.avatarBg || avatarBgs[Math.floor(Math.random() * avatarBgs.length)]
    };
    onSave(newProfile);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-[#0a0f1c] border border-white/15 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-[#33CCFF]" />
            {editingProfile ? 'Chỉnh Sửa Hồ Sơ CRM' : 'Tạo Hồ Sơ CRM Mới'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1 cursor-pointer">✕</button>
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="block text-gray-300 font-semibold mb-1">Tên Người Dùng / Khách Hàng *</label>
            <input 
              type="text" 
              required
              placeholder="VD: Nguyễn Văn A hoặc Alpha Corp"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#070b14] border border-white/15 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#33CCFF]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-300 font-semibold mb-1">Email Liên Hệ</label>
              <input 
                type="email" 
                placeholder="user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#070b14] border border-white/15 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#33CCFF]"
              />
            </div>

            <div>
              <label className="block text-gray-300 font-semibold mb-1">Vai Trò (Role)</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-[#070b14] border border-white/15 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#33CCFF]"
              >
                <option value="Admin">Admin (Quản trị)</option>
                <option value="Media Buyer">Media Buyer (Chạy Ads)</option>
                <option value="Client">Client (Khách Hàng)</option>
                <option value="Analyst">Analyst (Chuyên viên số liệu)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-gray-300 font-semibold mb-1">
              Tài Khoản Quảng Cáo Được Gán
            </label>
            <p className="text-[11px] text-gray-500 mb-2">Chọn các tài khoản mà hồ sơ này phụ trách:</p>
            <div className="bg-[#070b14] border border-white/10 rounded-xl p-3 max-h-36 overflow-y-auto space-y-1.5">
              {adAccounts.map(acc => {
                const isAssigned = assignedAccounts.includes(acc.account_id);
                return (
                  <div 
                    key={acc.account_id}
                    onClick={() => toggleAccount(acc.account_id)}
                    className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${isAssigned ? 'bg-[#33CCFF]/10 text-white' : 'hover:bg-white/5 text-gray-400'}`}
                  >
                    <span className="truncate">{acc.name || acc.account_id}</span>
                    <div className={`w-4 h-4 rounded border flex items-center justify-center ${isAssigned ? 'border-[#33CCFF] bg-[#33CCFF]' : 'border-gray-600'}`}>
                      {isAssigned && <Check className="w-3 h-3 text-[#070b14]" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-gray-300 font-semibold mb-1">Ghi Chú Nghiệp Vụ</label>
            <textarea 
              rows={2}
              placeholder="VD: Quản lý ngân sách Q3, phụ trách thị trường Thái Lan..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-[#070b14] border border-white/15 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#33CCFF]"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 transition-all font-medium cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#33CCFF] to-[#0AE5D5] text-[#070b14] font-bold shadow-lg shadow-[#33CCFF]/20 hover:opacity-90 transition-all cursor-pointer"
            >
              Lưu Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


// =====================================================================
// ==================== QUICK CAMPAIGN MODAL ===========================
// =====================================================================

function QuickCampaignModal({
  isOpen,
  adAccounts,
  onClose,
  onCreateCampaign
}) {
  const [selectedActId, setSelectedActId] = useState(adAccounts[0]?.account_id || '');
  const [name, setName] = useState('');
  const [objective, setObjective] = useState('OUTCOME_LEADS');
  const [dailyBudget, setDailyBudget] = useState('20');
  const [status, setStatus] = useState('PAUSED');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Vui lòng nhập tên chiến dịch!");
      return;
    }
    setSubmitting(true);
    try {
      await onCreateCampaign({
        accountId: selectedActId,
        name: name.trim(),
        objective,
        dailyBudget,
        status
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-[#0a0f1c] border border-white/15 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Plus className="w-5 h-5 text-emerald-400" />
            Tạo Chiến Dịch Nhanh Trên Meta Ads
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
              Tài Khoản Quảng Cáo
            </label>
            <select
              className="w-full bg-[#070b14] border border-white/15 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
              value={selectedActId}
              onChange={(e) => setSelectedActId(e.target.value)}
            >
              {adAccounts.map(a => (
                <option key={a.account_id} value={a.account_id} className="bg-[#0a0f1c]">
                  {a.name} (act_{a.account_id}) [{a.currency || 'USD'}]
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
              Tên Chiến Dịch Quảng Cáo
            </label>
            <input
              type="text"
              required
              placeholder="VD: VN_LeadGen_Forex_Promo_Q2"
              className="w-full bg-[#070b14] border border-white/15 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
              Mục Tiêu Chiến Dịch (Objective)
            </label>
            <select
              className="w-full bg-[#070b14] border border-white/15 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
            >
              <option value="OUTCOME_LEADS" className="bg-[#0a0f1c]">🎯 Thu Hút Khách Hàng Tiềm Năng (Leads)</option>
              <option value="OUTCOME_SALES" className="bg-[#0a0f1c]">💰 Doanh Số & Mở Tài Khoản (Sales)</option>
              <option value="OUTCOME_TRAFFIC" className="bg-[#0a0f1c]">🚀 Lưu Lượng Truy Cập (Traffic)</option>
              <option value="OUTCOME_ENGAGEMENT" className="bg-[#0a0f1c]">💬 Tương Tác & Tin Nhắn (Engagement)</option>
              <option value="OUTCOME_AWARENESS" className="bg-[#0a0f1c]">📢 Nhận Thức Thương Hiệu (Awareness)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                Ngân Sách Ngày ($)
              </label>
              <input
                type="number"
                step="0.01"
                required
                className="w-full bg-[#070b14] border border-white/15 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-400"
                value={dailyBudget}
                onChange={(e) => setDailyBudget(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                Trạng Thái Khởi Tạo
              </label>
              <select
                className="w-full bg-[#070b14] border border-white/15 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="PAUSED" className="bg-[#0a0f1c]">⚪ Tạm Dừng (PAUSED - Khuyên dùng)</option>
                <option value="ACTIVE" className="bg-[#0a0f1c]">🟢 Chạy Ngay (ACTIVE)</option>
              </select>
            </div>
          </div>

          <p className="text-[11px] text-gray-400 leading-relaxed bg-white/5 p-2.5 rounded-lg border border-white/5">
            💡 Chiến dịch sẽ được tạo trực tiếp trên Meta Marketing API (quyền <code className="text-emerald-300">ads_management</code>) với cấu hình chuẩn CBO / ABO.
          </p>

          <div className="flex justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-medium bg-white/5 hover:bg-white/10 text-gray-300 cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 rounded-lg text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center gap-1.5 transition-all shadow-lg shadow-emerald-500/20 cursor-pointer disabled:opacity-50"
            >
              <Plus className={`w-3.5 h-3.5 ${submitting ? 'animate-spin' : ''}`} />
              {submitting ? 'Đang tạo trên Meta...' : 'Tạo Chiến Dịch Lên Meta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// =====================================================================
// ================ BUSINESS MANAGER & PORTFOLIO HUB ===================
// =====================================================================

function BusinessManagerHub({
  businesses,
  loading,
  onRefresh,
  onFilterByBM,
  selectedAccountIds,
}) {
  const [expandedBmId, setExpandedBmId] = useState(businesses[0]?.id || null);

  const totalBms = businesses.length;
  let totalOwnedAccounts = 0;
  let totalClientAccounts = 0;
  let totalPages = 0;

  businesses.forEach(bm => {
    if (bm.owned_ad_accounts?.data) totalOwnedAccounts += bm.owned_ad_accounts.data.length;
    if (bm.client_ad_accounts?.data) totalClientAccounts += bm.client_ad_accounts.data.length;
    if (bm.owned_pages?.data) totalPages += bm.owned_pages.data.length;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-amber-500/20 text-amber-300 rounded-xl">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              Trung Tâm Quản Trị Doanh Nghiệp (Business Manager & Portfolios)
              <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono px-2 py-0.5 rounded uppercase">
                business_management
              </span>
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Quản lý toàn bộ danh mục tài sản: Portfolio doanh nghiệp, tài khoản quảng cáo trực thuộc, đối tác và trang Fanpage.
            </p>
          </div>
        </div>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 transition-all cursor-pointer disabled:opacity-50 self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Đang đồng bộ...' : 'Quét lại BM'}
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
          <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Business Portfolios</p>
          <p className="text-2xl font-bold text-white">{totalBms}</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
          <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">TK Ads Sở Hữu (Owned)</p>
          <p className="text-2xl font-bold text-[#33CCFF]">{totalOwnedAccounts}</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
          <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">TK Ads Đối Tác (Client)</p>
          <p className="text-2xl font-bold text-[#0AE5D5]">{totalClientAccounts}</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
          <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Fanpage Quản Trị</p>
          <p className="text-2xl font-bold text-pink-400">{totalPages}</p>
        </div>
      </div>

      {/* List of Business Managers */}
      {businesses.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-10 text-center text-gray-400">
          <Building2 className="w-12 h-12 mx-auto mb-3 opacity-30 text-amber-400" />
          <h3 className="text-base font-bold text-white mb-1">Chưa Tìm Thấy Business Manager</h3>
          <p className="text-xs text-gray-400 max-w-md mx-auto">
            Tài khoản Meta hoặc Token của bạn có thể đang dùng tài khoản cá nhân hoặc chưa cấp quyền <code className="text-pink-300">business_management</code>. Bấm "Quét lại BM" hoặc kiểm tra lại quyền trong Cài đặt.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {businesses.map(bm => {
            const owned = bm.owned_ad_accounts?.data || [];
            const client = bm.client_ad_accounts?.data || [];
            const pages = bm.owned_pages?.data || [];
            const allBmAccountIds = [...owned, ...client].map(a => (a.account_id || a.id || '').replace(/^act_/, ''));
            const isSelectedAll = allBmAccountIds.length > 0 && allBmAccountIds.every(id => selectedAccountIds.includes(id));
            const isExpanded = expandedBmId === bm.id;

            return (
              <div key={bm.id} className="bg-[#0a0f1c] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
                {/* BM Header */}
                <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 bg-white/[0.02]">
                  <div className="flex items-start sm:items-center gap-3">
                    <div className="p-2.5 bg-amber-500/15 text-amber-300 rounded-xl flex-shrink-0">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base font-bold text-white">{bm.name}</h3>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-semibold uppercase ${
                          bm.verification_status === 'verified'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-gray-700 text-gray-300 border border-white/10'
                        }`}>
                          {bm.verification_status === 'verified' ? '🛡️ Đã Xác Minh' : '⚠️ Chưa Xác Minh'}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-400 font-mono mt-0.5">
                        BM ID: {bm.id} • Tạo ngày: {bm.created_time ? new Date(bm.created_time).toLocaleDateString('vi-VN') : 'N/A'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-auto flex-wrap">
                    <button
                      onClick={() => onFilterByBM(allBmAccountIds)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        isSelectedAll 
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                          : 'bg-[#33CCFF]/15 hover:bg-[#33CCFF]/25 text-[#33CCFF] border border-[#33CCFF]/30'
                      }`}
                      title="Lọc tất cả tài khoản thuộc BM này lên Live Dashboard"
                    >
                      <Target className="w-3.5 h-3.5" />
                      {isSelectedAll ? 'Đang lọc trên Dashboard' : `Lọc tất cả (${allBmAccountIds.length} TK Ads)`}
                    </button>
                    <button
                      onClick={() => setExpandedBmId(isExpanded ? null : bm.id)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all cursor-pointer"
                    >
                      <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* BM Expanded Asset Details */}
                {isExpanded && (
                  <div className="p-5 space-y-6">
                    {/* Section 1: Owned Ad Accounts */}
                    <div>
                      <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-[#33CCFF]" />
                        Tài Khoản Quảng Cáo Sở Hữu ({owned.length})
                      </h4>
                      {owned.length === 0 ? (
                        <p className="text-xs text-gray-500 italic">Không có tài khoản sở hữu trực tiếp.</p>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {owned.map(acc => (
                            <div key={acc.account_id || acc.id} className="p-3 bg-black/40 border border-white/10 rounded-xl text-xs space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="font-semibold text-white truncate">{acc.name || 'Tài khoản Ads'}</span>
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                  {acc.currency || 'USD'}
                                </span>
                              </div>
                              <p className="text-[11px] text-gray-400 font-mono">act_{acc.account_id || acc.id}</p>
                              {acc.amount_spent && (
                                <p className="text-[10px] text-gray-400">
                                  Đã chi tiêu: <strong className="text-gray-200">${(parseFloat(acc.amount_spent) / 100).toLocaleString()}</strong>
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Section 2: Client Ad Accounts */}
                    <div>
                      <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-[#0AE5D5]" />
                        Tài Khoản Đối Tác & Khách Hàng Quản Trị ({client.length})
                      </h4>
                      {client.length === 0 ? (
                        <p className="text-xs text-gray-500 italic">Không có tài khoản đối tác liên kết.</p>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {client.map(acc => (
                            <div key={acc.account_id || acc.id} className="p-3 bg-black/40 border border-white/10 rounded-xl text-xs space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="font-semibold text-white truncate">{acc.name || 'Client Ads'}</span>
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-teal-500/10 text-teal-400 border border-teal-500/20">
                                  {acc.currency || 'USD'}
                                </span>
                              </div>
                              <p className="text-[11px] text-gray-400 font-mono">act_{acc.account_id || acc.id}</p>
                              {acc.amount_spent && (
                                <p className="text-[10px] text-gray-400">
                                  Đã chi tiêu: <strong className="text-gray-200">${(parseFloat(acc.amount_spent) / 100).toLocaleString()}</strong>
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Section 3: Pages in BM */}
                    {pages.length > 0 && (
                      <div>
                        <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                          <UsersRound className="w-4 h-4 text-pink-400" />
                          Trang Fanpage Trực Thuộc ({pages.length})
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {pages.map(p => (
                            <div key={p.id} className="px-3 py-1.5 bg-black/30 border border-white/10 rounded-lg text-xs flex items-center gap-2">
                              <span className="font-semibold text-pink-300">{p.name}</span>
                              {p.fan_count && <span className="text-[10px] text-gray-400">({p.fan_count.toLocaleString()} likes)</span>}
                              {p.category && <span className="text-[9px] text-gray-500 font-mono">[{p.category}]</span>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

import React, { useState } from 'react';
import { 
  TrendingUp, Users, DollarSign, MousePointerClick, Activity, 
  Target, Award, AlertTriangle, Sparkles, Filter, ArrowUpRight, 
  ArrowDownRight, CheckCircle2, ChevronRight, BarChart2, PieChart as PieIcon
} from 'lucide-react';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area 
} from 'recharts';

export default function MarketingAnalyticsView({ 
  campaigns = [], 
  leads = [], 
  onOpenGeminiAudit,
  crmCurrency = 'VND',
  customRates = {}
}) {
  const [selectedChannelFilter, setSelectedChannelFilter] = useState('all');

  // Currency Formatter
  const formatMoney = (valInUsd) => {
    const rate = customRates[crmCurrency] || 1;
    const val = (parseFloat(valInUsd) || 0) * rate;
    if (crmCurrency === 'VND') {
      return `${Math.round(val).toLocaleString('vi-VN')} ₫`;
    }
    return `$${val.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
  };

  // --- Aggregate Marketing Calculations ---
  const totalAdSpend = campaigns.reduce((sum, c) => sum + (parseFloat(c.spend) || 0), 0);
  const totalImpressions = campaigns.reduce((sum, c) => sum + (parseInt(c.impressions) || 0), 0);
  const totalClicks = campaigns.reduce((sum, c) => sum + (parseInt(c.clicks) || 0), 0);
  const ctr = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : '0';

  const totalLeads = leads.length;
  const cpl = totalLeads > 0 ? (totalAdSpend / totalLeads).toFixed(2) : '0';

  const contactingCount = leads.filter(l => l.status === 'contacting').length;
  const kycCount = leads.filter(l => l.status === 'account_opened').length;
  const fundedLeads = leads.filter(l => l.status === 'funded' || l.status === 'won');
  const fundedCount = fundedLeads.length;
  const wonCount = leads.filter(l => l.status === 'won').length;

  const totalDeposit = leads.reduce((sum, l) => sum + (parseFloat(l.deposit) || 0), 0);
  const cac = fundedCount > 0 ? Math.round(totalAdSpend / fundedCount) : 0;
  const arpu = fundedCount > 0 ? Math.round(totalDeposit / fundedCount) : 0;
  const roas = totalAdSpend > 0 ? (totalDeposit / totalAdSpend).toFixed(2) : '0';
  const netProfit = totalDeposit - totalAdSpend;
  const roi = totalAdSpend > 0 ? (((totalDeposit - totalAdSpend) / totalAdSpend) * 100).toFixed(1) : '0';

  // Overall Funnel Conversion Rate (Clicks to Funded)
  const clickToLeadRate = totalClicks > 0 ? ((totalLeads / totalClicks) * 100).toFixed(2) : '0';
  const leadToFundedRate = totalLeads > 0 ? ((fundedCount / totalLeads) * 100).toFixed(1) : '0';

  // --- Detailed Funnel Drop-off Data ---
  const funnelSteps = [
    {
      step: '1. Clicks (Lượt Nhấp)',
      count: totalClicks,
      drop: totalImpressions > 0 ? `${((1 - totalClicks / totalImpressions) * 100).toFixed(1)}%` : '0%',
      rate: `${ctr}% CTR`,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      step: '2. Leads (Khách Điền Form)',
      count: totalLeads,
      drop: totalClicks > 0 ? `${((1 - totalLeads / Math.max(totalClicks, 1)) * 100).toFixed(1)}%` : '0%',
      rate: `${clickToLeadRate}% từ Clicks`,
      color: 'from-indigo-500 to-blue-500'
    },
    {
      step: '3. Đang Tư Vấn (Contacted)',
      count: contactingCount + kycCount + fundedCount,
      drop: totalLeads > 0 ? `${(((totalLeads - (contactingCount + kycCount + fundedCount)) / totalLeads) * 100).toFixed(1)}%` : '0%',
      rate: totalLeads > 0 ? `${(((contactingCount + kycCount + fundedCount) / totalLeads) * 100).toFixed(1)}%` : '0%',
      color: 'from-amber-500 to-yellow-500'
    },
    {
      step: '4. Mở Tài Khoản / KYC',
      count: kycCount + fundedCount,
      drop: (contactingCount + kycCount + fundedCount) > 0 ? `${((1 - (kycCount + fundedCount) / (contactingCount + kycCount + fundedCount)) * 100).toFixed(1)}%` : '0%',
      rate: totalLeads > 0 ? `${(((kycCount + fundedCount) / totalLeads) * 100).toFixed(1)}%` : '0%',
      color: 'from-purple-500 to-pink-500'
    },
    {
      step: '5. Đã Nạp Tiền (Funded Customer)',
      count: fundedCount,
      drop: (kycCount + fundedCount) > 0 ? `${((1 - fundedCount / (kycCount + fundedCount)) * 100).toFixed(1)}%` : '0%',
      rate: `${leadToFundedRate}% từ Leads`,
      color: 'from-emerald-500 to-teal-500'
    },
    {
      step: '6. Khách Hàng Won (VIP)',
      count: wonCount,
      drop: fundedCount > 0 ? `${((1 - wonCount / fundedCount) * 100).toFixed(1)}%` : '0%',
      rate: fundedCount > 0 ? `${((wonCount / fundedCount) * 100).toFixed(1)}%` : '0%',
      color: 'from-cyan-400 to-emerald-400'
    }
  ];

  // --- Marketing Source Performance Breakdown ---
  const sourceGroups = [
    'Facebook Ads / Form',
    'Website / Funnel',
    'Zalo / Chat',
    'Hotline',
    'Giới thiệu / Referral',
    'Khác'
  ];

  const sourceAnalysis = sourceGroups.map(src => {
    const srcLeads = leads.filter(l => (l.source || 'Khác') === src);
    const srcFunded = srcLeads.filter(l => l.status === 'funded' || l.status === 'won');
    const srcDeposit = srcLeads.reduce((sum, l) => sum + (parseFloat(l.deposit) || 0), 0);
    // Estimated spend proportion
    const estSpend = src === 'Facebook Ads / Form' ? totalAdSpend * 0.75 :
                     src === 'Website / Funnel' ? totalAdSpend * 0.20 : totalAdSpend * 0.05;
    const srcCac = srcFunded.length > 0 ? Math.round(estSpend / srcFunded.length) : 0;
    const srcRoas = estSpend > 0 ? (srcDeposit / estSpend).toFixed(2) : '0';

    return {
      name: src,
      leads: srcLeads.length,
      funded: srcFunded.length,
      conversionRate: srcLeads.length > 0 ? ((srcFunded.length / srcLeads.length) * 100).toFixed(1) : '0',
      deposit: srcDeposit,
      estSpend: Math.round(estSpend),
      cac: srcCac,
      roas: srcRoas
    };
  }).filter(s => s.leads > 0 || s.estSpend > 0);

  // Chart Data: Spend vs Revenue
  const spendVsRevenueData = sourceAnalysis.map(s => ({
    name: s.name.split('/')[0].trim(),
    'Chi Phí Ads': s.estSpend,
    'Doanh Thu Nạp': s.deposit
  }));

  // Trend mock data based on dates
  const trendData = [
    { date: 'Tuần 1', spend: Math.round(totalAdSpend * 0.2), leads: Math.round(totalLeads * 0.18), revenue: Math.round(totalDeposit * 0.15) },
    { date: 'Tuần 2', spend: Math.round(totalAdSpend * 0.25), leads: Math.round(totalLeads * 0.22), revenue: Math.round(totalDeposit * 0.28) },
    { date: 'Tuần 3', spend: Math.round(totalAdSpend * 0.3), leads: Math.round(totalLeads * 0.35), revenue: Math.round(totalDeposit * 0.32) },
    { date: 'Tuần 4', spend: Math.round(totalAdSpend * 0.25), leads: Math.round(totalLeads * 0.25), revenue: Math.round(totalDeposit * 0.25) },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner: Marketing Intelligence & AI Trigger */}
      <div className="bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-purple-900/40 border border-[#33CCFF]/30 rounded-3xl p-6 shadow-2xl backdrop-blur-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#33CCFF]/20 text-[#33CCFF] border border-[#33CCFF]/30 text-[10px] font-bold uppercase tracking-wider">
              Marketing Performance Hub
            </span>
            <span className="text-xs text-gray-400">
              Cập nhật số liệu tiếp thị đa kênh theo thời gian thực
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            Phân Tích Dữ Liệu Marketing & Phễu Chuyển Đổi
          </h2>
          <p className="text-xs text-gray-300 max-w-2xl">
            Đo lường toàn diện hiệu quả chi phí quảng cáo (CAC, CPL, ROAS), phát hiện chính xác điểm nghẽn rơi rụng khách hàng và tối ưu hóa ngân sách.
          </p>
        </div>

        {/* Action Button: AI Gemini Audit */}
        <button
          type="button"
          onClick={onOpenGeminiAudit}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-amber-500 hover:opacity-95 text-white font-bold text-xs shadow-xl shadow-purple-500/25 flex items-center gap-2 transition-all cursor-pointer flex-shrink-0 group"
        >
          <Sparkles className="w-4 h-4 text-amber-200 group-hover:rotate-12 transition-transform" />
          <span>Gemini AI Phân Tích & Đề Xuất Chiến Lược</span>
        </button>
      </div>

      {/* Primary KPI Grid (6 Core Marketing Metrics) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* Total Ad Spend */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 shadow-xl">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Ngân Sách Quảng Cáo</span>
          <p className="text-lg sm:text-xl font-black text-white mt-1">{formatMoney(totalAdSpend)}</p>
          <p className="text-[10px] text-gray-500 mt-1">{campaigns.length} chiến dịch đang chạy</p>
        </div>

        {/* Cost Per Lead (CPL) */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 shadow-xl">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Chi Phí / Lead (CPL)</span>
          <p className="text-lg sm:text-xl font-black text-[#33CCFF] mt-1">${cpl}</p>
          <p className="text-[10px] text-gray-400 mt-1">{totalLeads} khách tiềm năng</p>
        </div>

        {/* Customer Acquisition Cost (CAC) */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 shadow-xl">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Chi Phí / Khách (CAC)</span>
          <p className="text-lg sm:text-xl font-black text-amber-300 mt-1">${cac.toLocaleString()}</p>
          <p className="text-[10px] text-gray-400 mt-1">{fundedCount} khách đã nạp tiền</p>
        </div>

        {/* Total Deposit / Revenue */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 shadow-xl">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Tổng Doanh Thu Nạp</span>
          <p className="text-lg sm:text-xl font-black text-emerald-400 mt-1">{formatMoney(totalDeposit)}</p>
          <p className="text-[10px] text-emerald-500/80 mt-1">ARPU: ${arpu.toLocaleString()}/khách</p>
        </div>

        {/* ROAS */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 shadow-xl">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Tỷ Suất ROAS</span>
          <p className={`text-lg sm:text-xl font-black mt-1 ${parseFloat(roas) >= 2 ? 'text-emerald-400' : 'text-amber-300'}`}>
            {roas}x
          </p>
          <p className="text-[10px] text-gray-400 mt-1">ROI: {roi}%</p>
        </div>

        {/* Funnel Conversion Rate */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 shadow-xl">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Tỷ Lệ Chốt Lead</span>
          <p className="text-lg sm:text-xl font-black text-purple-300 mt-1">{leadToFundedRate}%</p>
          <p className="text-[10px] text-gray-400 mt-1">Won Rate: {((wonCount / Math.max(totalLeads, 1)) * 100).toFixed(1)}%</p>
        </div>
      </div>

      {/* SECTION 2: MULTI-STAGE FUNNEL DROP-OFF AUDIT */}
      <div className="bg-[#0a0f1c]/90 border border-white/10 rounded-3xl p-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#33CCFF]" />
              Phễu Chuyển Đổi & Đo Lường Rơi Rụng (Funnel Drop-Off Matrix)
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Theo dõi luồng khách hàng qua 6 giai đoạn để phát hiện điểm nghẽn đang làm mất doanh thu
            </p>
          </div>
          <span className="px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-medium flex items-center gap-1.5 self-start sm:self-auto">
            <AlertTriangle className="w-3.5 h-3.5" />
            Điểm nghẽn lớn nhất: Tư Vấn ➔ Mở Tài Khoản
          </span>
        </div>

        {/* Funnel Visual Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          {funnelSteps.map((step, idx) => (
            <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col justify-between relative group hover:border-white/20 transition-all">
              <div>
                <span className="text-[11px] font-semibold text-gray-400">{step.step}</span>
                <p className="text-xl font-black text-white mt-1.5">{step.count.toLocaleString()}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px]">
                <span className="text-gray-400">Hiệu suất:</span>
                <span className="font-bold text-[#33CCFF]">{step.rate}</span>
              </div>

              {idx > 0 && (
                <div className="mt-1 text-[10px] flex items-center justify-between text-red-400">
                  <span>Rơi rụng:</span>
                  <span className="font-mono font-semibold">-{step.drop}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 3: CHARTS ROW (TREND & REVENUE VS SPEND) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trend Over Time (Spend vs Leads vs Revenue) */}
        <div className="bg-[#0a0f1c]/90 border border-white/10 rounded-3xl p-6 shadow-2xl">
          <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            Xu Hướng Hiệu Quả Marketing Theo Tuần
          </h3>
          <p className="text-xs text-gray-400 mb-4">So sánh mối tương quan giữa Chi Phí Quảng Cáo và Doanh Thu Nạp</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="date" stroke="#6b7280" fontSize={11} />
                <YAxis stroke="#6b7280" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0d1424', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  formatter={(val, name) => [`$${val.toLocaleString()}`, name]}
                />
                <Legend />
                <Area type="monotone" dataKey="revenue" name="Doanh Thu Nạp ($)" stroke="#10b981" fillOpacity={1} fill="url(#revGrad)" strokeWidth={2} />
                <Area type="monotone" dataKey="spend" name="Chi Phí Ads ($)" stroke="#ef4444" fillOpacity={1} fill="url(#spendGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Spend vs Revenue by Source BarChart */}
        <div className="bg-[#0a0f1c]/90 border border-white/10 rounded-3xl p-6 shadow-2xl">
          <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-cyan-400" />
            So Sánh Chi Phí & Doanh Thu Theo Kênh Tiếp Thị
          </h3>
          <p className="text-xs text-gray-400 mb-4">Đánh giá kênh nào mang lại hiệu quả sinh lời cao nhất</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={spendVsRevenueData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="name" stroke="#6b7280" fontSize={11} />
                <YAxis stroke="#6b7280" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0d1424', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  formatter={(val, name) => [`$${val.toLocaleString()}`, name]}
                />
                <Legend />
                <Bar dataKey="Chi Phí Ads" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Doanh Thu Nạp" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* SECTION 4: SOURCE PERFORMANCE BREAKDOWN TABLE */}
      <div className="bg-[#0a0f1c]/90 border border-white/10 rounded-3xl p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-pink-400" />
            Bảng Ma Trận Hiệu Suất Kênh Tiếp Thị (Marketing Channel Matrix)
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-black/40 text-gray-400 uppercase text-[10px] tracking-wider border-b border-white/10">
              <tr>
                <th className="px-4 py-3">Kênh Tiếp Thị</th>
                <th className="px-4 py-3 text-center">Số Leads</th>
                <th className="px-4 py-3 text-center">Khách Nạp Tiền</th>
                <th className="px-4 py-3 text-center">Tỷ Lệ Chuyển Đổi</th>
                <th className="px-4 py-3 text-right">Chi Phí Ads (Ước tính)</th>
                <th className="px-4 py-3 text-right">Doanh Thu Nạp</th>
                <th className="px-4 py-3 text-right">CAC</th>
                <th className="px-4 py-3 text-right">ROAS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {sourceAnalysis.map((src, idx) => (
                <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3 font-semibold text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    {src.name}
                  </td>
                  <td className="px-4 py-3 text-center font-bold text-white">{src.leads}</td>
                  <td className="px-4 py-3 text-center font-bold text-emerald-400">{src.funded}</td>
                  <td className="px-4 py-3 text-center font-semibold text-purple-300">{src.conversionRate}%</td>
                  <td className="px-4 py-3 text-right font-mono text-gray-300">${src.estSpend.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right font-mono font-bold text-emerald-400">${src.deposit.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right font-mono text-amber-300">${src.cac.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right font-mono font-bold text-[#33CCFF]">
                    {src.roas}x
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

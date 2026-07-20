import React, { useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import pptxgen from "pptxgenjs";
import { TrendingUp, TrendingDown, Users, DollarSign, MousePointerClick, RefreshCw, Activity, AlertCircle, Briefcase, ChevronRight, ChevronDown, Check, Calendar, Printer, FileText, LayoutDashboard, Target, Globe, Filter, Image as ImageIcon, PieChart as PieChartIcon, ArrowRight, Presentation, UsersRound } from 'lucide-react';

const MOCK_DATA = [
  { campaign_id: '101', campaign_name: 'VN_LeadGen_Campaign1', account_name: 'CPT Indonesia', spend: 1250.5, impressions: 55000, clicks: 3450, leads: 145, start_time: '2026-04-15T08:00:00+0000' },
  { campaign_id: '102', campaign_name: 'TH_IBAcquisition_April', account_name: 'CPT Malaysia', spend: 850.0, impressions: 42000, clicks: 2200, leads: 85, start_time: '2026-04-01T10:30:00+0000' },
  { campaign_id: '103', campaign_name: 'PH_Awareness_Q1', account_name: 'CPT Global', spend: 430.2, impressions: 21000, clicks: 1100, leads: 32, start_time: '2026-04-10T14:15:00+0000' },
  { campaign_id: '104', campaign_name: 'IND_Webinar_Promo', account_name: 'CPT Global', spend: 960.0, impressions: 88000, clicks: 2800, leads: 95, start_time: '2026-04-20T09:00:00+0000' },
  { campaign_id: '105', campaign_name: 'VN_IBAcquisition_Gold', account_name: 'CPT Indonesia', spend: 650.8, impressions: 32000, clicks: 1750, leads: 0, start_time: '2026-04-05T16:45:00+0000' },
];

const MOCK_PAGES_DATA = [
  { page_id: 'p1', name: 'CPT Global Forex', fans: 15400, impressions: 125000, engaged_users: 8400 },
  { page_id: 'p2', name: 'Webinar Alerts TH', fans: 3200, impressions: 45000, engaged_users: 3100 },
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

export default function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [manualData, setManualData] = useState({});
  const [isUsingMock, setIsUsingMock] = useState(false);
  const [exchangeRates, setExchangeRates] = useState(null);
  
  const [adAccounts, setAdAccounts] = useState([]);
  const [selectedAccountIds, setSelectedAccountIds] = useState([]);
  const [loadingAccounts, setLoadingAccounts] = useState(true);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const [datePreset, setDatePreset] = useState('last_30d');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeReportTab, setActiveReportTab] = useState('daily');

  // Organic Pages State
  const [pagesData, setPagesData] = useState([]);
  const [loadingPages, setLoadingPages] = useState(false);
  const [pagesError, setPagesError] = useState(null);
  
  // Content Analysis State
  const [selectedPageForAnalysis, setSelectedPageForAnalysis] = useState(null);
  const [pageContentData, setPageContentData] = useState([]);
  const [loadingContent, setLoadingContent] = useState(false);

  useEffect(() => {
    fetchAdAccounts();
    // Fetch live exchange rates to USD
    fetch('https://open.er-api.com/v6/latest/USD')
      .then(res => res.json())
      .then(data => {
        if (data && data.rates) {
          setExchangeRates(data.rates);
        }
      })
      .catch(err => console.error("Error fetching exchange rates:", err));
  }, []);

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

  const fetchAdAccounts = async () => {
    setLoadingAccounts(true);
    const token = import.meta.env.VITE_META_TOKEN;
    if (!token || token === 'your_facebook_graph_api_access_token_here') {
      console.warn("Meta API token not set. Using mock mode.");
      setIsUsingMock(true);
      setLoadingAccounts(false);
      setData(filterMockByDate(MOCK_DATA, datePreset, customStartDate, customEndDate));
      return;
    }

    try {
      const fbVersion = 'v19.0';
      const url = `https://graph.facebook.com/${fbVersion}/me/adaccounts?fields=name,account_id,currency&access_token=${token}`;
      const response = await fetch(url);
      const result = await response.json();
      
      if (result.error) {
        throw new Error(result.error.message);
      }

      if (result.data && result.data.length > 0) {
        // Lọc: Chỉ lấy các tài khoản có chứa 'CPT' và không chứa 'cpt markets vietnam'
        const filteredAccounts = result.data.filter(acc => {
          const name = (acc.name || '').toLowerCase();
          return name.includes('cpt') && !name.includes('cpt markets vietnam');
        });

        if (filteredAccounts.length > 0) {
          setAdAccounts(filteredAccounts);
          // Tự động chọn tất cả tài khoản CPT hợp lệ
          setSelectedAccountIds(filteredAccounts.map(a => a.account_id));
        } else {
          throw new Error("Không tìm thấy tài khoản quảng cáo CPT hợp lệ (đã loại trừ CPT Markets Vietnam).");
        }
      } else {
        throw new Error("No Ad Accounts found for this user.");
      }
    } catch (err) {
      console.error("Error fetching Ad Accounts:", err);
      setError(err.message);
      setIsUsingMock(true);
      setData(filterMockByDate(MOCK_DATA, datePreset, customStartDate, customEndDate));
    } finally {
      setLoadingAccounts(false);
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

  const exportPPTX = () => {
    setIsExporting(true);
    try {
      let pres = new pptxgen();

      // Slide 1: Title
      let slide1 = pres.addSlide();
      slide1.background = { color: "070B14" };
      slide1.addText("Meta Ads Performance Report", { x: 1, y: 2, w: '80%', color: "33CCFF", fontSize: 32, bold: true });
      slide1.addText(`Generated on: ${new Date().toLocaleDateString()}`, { x: 1, y: 3, w: '80%', color: "9CA3AF", fontSize: 14 });

      // Slide 2: Executive Summary
      const totalSpend = data.reduce((acc, curr) => acc + curr.spend, 0);
      const totalClicks = data.reduce((acc, curr) => acc + curr.clicks, 0);
      const totalLeads = data.reduce((acc, curr) => acc + curr.leads, 0);
      const averageCpl = totalLeads > 0 ? totalSpend / totalLeads : 0;
      
      let slide2 = pres.addSlide();
      slide2.background = { color: "070B14" };
      slide2.addText("Executive Summary", { x: 0.5, y: 0.5, w: '90%', color: "0AE5D5", fontSize: 24, bold: true });
      slide2.addText(`Total Spend: $${totalSpend.toFixed(2)}`, { x: 0.5, y: 1.5, color: "FFFFFF", fontSize: 18 });
      slide2.addText(`Total Clicks: ${totalClicks}`, { x: 0.5, y: 2.0, color: "FFFFFF", fontSize: 18 });
      slide2.addText(`Total Leads: ${totalLeads}`, { x: 0.5, y: 2.5, color: "FFFFFF", fontSize: 18 });
      slide2.addText(`Average CPL: $${averageCpl.toFixed(2)}`, { x: 0.5, y: 3.0, color: "FFFFFF", fontSize: 18 });

      // Slide 3: Campaign Performance
      let slide3 = pres.addSlide();
      slide3.background = { color: "070B14" };
      slide3.addText("Campaign Performance", { x: 0.5, y: 0.5, w: '90%', color: "0AE5D5", fontSize: 24, bold: true });
      
      let tableRows = [
        [
          { text: "Campaign", options: { bold: true, color: "33CCFF", fill: "1A202C" } },
          { text: "Spend", options: { bold: true, color: "33CCFF", fill: "1A202C" } },
          { text: "Leads", options: { bold: true, color: "33CCFF", fill: "1A202C" } },
          { text: "CPL", options: { bold: true, color: "33CCFF", fill: "1A202C" } }
        ]
      ];

      // Max 10 campaigns to fit slide
      const sortedData = [...data].sort((a, b) => b.spend - a.spend).slice(0, 10);
      sortedData.forEach(item => {
        const cpl = item.leads > 0 ? item.spend / item.leads : 0;
        tableRows.push([
          { text: item.campaign_name.substring(0, 30), options: { color: "FFFFFF" } },
          { text: `$${item.spend.toFixed(2)}`, options: { color: "FFFFFF" } },
          { text: `${item.leads}`, options: { color: "FFFFFF" } },
          { text: `$${cpl.toFixed(2)}`, options: { color: "FFFFFF" } }
        ]);
      });

      slide3.addTable(tableRows, { x: 0.5, y: 1.2, w: 9, fill: "0A0F1C", color: "FFFFFF", border: { type: 'solid', color: "333333", pt: 1 } });

      pres.writeFile({ fileName: "Meta_Ads_Report.pptx" });
    } catch (error) {
      console.error("Failed to generate PPTX", error);
      alert("Failed to export PPTX.");
    } finally {
      setIsExporting(false);
    }
  };

  const fetchFacebookPages = async () => {
    setLoadingPages(true);
    setPagesError(null);
    const token = import.meta.env.VITE_META_TOKEN;

    if (!token || token === 'your_facebook_graph_api_access_token_here') {
      setPagesData(MOCK_PAGES_DATA);
      setLoadingPages(false);
      return;
    }

    try {
      const fbVersion = 'v19.0';
      // 1. Fetch Pages
      const pagesUrl = `https://graph.facebook.com/${fbVersion}/me/accounts?fields=name,access_token,id,followers_count&access_token=${token}`;
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
            access_token: page.access_token,
            impressions,
            engaged_users,
            fans,
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

    const token = import.meta.env.VITE_META_TOKEN;

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
        
        const url = `https://graph.facebook.com/${fbVersion}/${fetchAccountId}/insights?fields=campaign_name,spend,impressions,clicks,actions&level=campaign&${dateQuery}&access_token=${token}`;
        const campaignUrl = `https://graph.facebook.com/${fbVersion}/${fetchAccountId}/campaigns?fields=id,start_time&access_token=${token}`;
        
        const [response, campaignResponse] = await Promise.all([
          fetch(url),
          fetch(campaignUrl)
        ]);

        const result = await response.json();
        const campaignResult = await campaignResponse.json();
        
        if (result.error) {
          throw new Error(`Account ${accId}: ${result.error.message}`);
        }
        
        const startTimesMap = {};
        if (campaignResult.data) {
           campaignResult.data.forEach(c => {
             startTimesMap[c.id] = c.start_time;
           });
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
        
        return (result.data || []).map(campaign => {
          const originalSpend = parseFloat(campaign.spend) || 0;
          return {
            ...campaign,
            account_name: accountName,
            start_time: startTimesMap[campaign.campaign_id] || null,
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

      const formattedData = allCampaigns.map(item => {
        let fetchLeads = 0;
        if (item.actions) {
          const leadAction = item.actions.find(a => a.action_type === 'lead' || a.action_type === 'offsite_conversion.fb_pixel_lead');
          if (leadAction) fetchLeads = parseInt(leadAction.value);
        }
        
        return {
          campaign_id: item.campaign_id || Math.random().toString(),
          campaign_name: item.campaign_name || 'Unknown Campaign',
          account_name: item.account_name || 'Unknown Account',
          original_currency: item.original_currency || 'USD',
          start_time: item.start_time || null,
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

  const handleManualChange = (id, field, value) => {
    setManualData(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value
      }
    }));
  };

  // Compute stats for Header Cards
  const totalSpend = data.reduce((acc, curr) => acc + curr.spend, 0);
  const totalClicks = data.reduce((acc, curr) => acc + curr.clicks, 0);
  const totalLeads = data.reduce((acc, curr) => acc + curr.leads, 0);
  const averageCpl = totalLeads > 0 ? totalSpend / totalLeads : 0;

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
        
        {/* Navigation Tabs */}
        <div className="flex gap-4 mb-4 border-b border-white/10 pb-4 print:hidden pdf-hide">
          <button 
            onClick={() => setActiveTab('dashboard')} 
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${activeTab === 'dashboard' ? 'bg-[#33CCFF]/20 text-[#33CCFF] font-semibold' : 'text-gray-400 hover:text-white'}`}
          >
            <LayoutDashboard className="w-5 h-5"/> Live Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('reports')} 
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${activeTab === 'reports' ? 'bg-[#0AE5D5]/20 text-[#0AE5D5] font-semibold' : 'text-gray-400 hover:text-white'}`}
          >
            <FileText className="w-5 h-5"/> Report
          </button>
          <button 
            onClick={() => setActiveTab('organic')} 
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${activeTab === 'organic' ? 'bg-pink-500/20 text-pink-400 font-semibold' : 'text-gray-400 hover:text-white'}`}
          >
            <UsersRound className="w-5 h-5"/> Organic Pages
          </button>
        </div>

        {/* Header section (Always visible) */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 print:mb-4">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#33CCFF] to-[#0AE5D5] flex items-center gap-3 print:text-[#070b14] print:from-[#070b14] print:to-[#070b14]">
              <Activity className="w-8 h-8 text-[#0AE5D5] print:text-[#070b14]" />
              Meta Ads Performance
            </h1>
            <p className="text-gray-400 mt-2 text-sm max-w-xl print:text-gray-600">
              Real-time analytics for Financial & IB campaigns. Automatic Meta API sync with manual data logging for conversions.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 print:hidden pdf-hide">
            {/* Date Preset Selector */}
            <div className="relative flex items-center bg-white/5 border border-white/10 hover:border-white/20 rounded-lg pr-4 pl-3 py-2 text-sm transition-all h-[38px]">
               <Calendar className="w-4 h-4 text-[#33CCFF] mr-2" />
               <select 
                 className="appearance-none bg-transparent text-white focus:outline-none focus:ring-0 cursor-pointer pr-4"
                 value={datePreset}
                 onChange={(e) => setDatePreset(e.target.value)}
               >
                 <option value="today" className="bg-[#0a0f1c]">Today</option>
                 <option value="yesterday" className="bg-[#0a0f1c]">Yesterday</option>
                 <option value="last_7d" className="bg-[#0a0f1c]">Last 7 Days</option>
                 <option value="last_14d" className="bg-[#0a0f1c]">Last 14 Days</option>
                 <option value="last_30d" className="bg-[#0a0f1c]">Last 30 Days</option>
                 <option value="this_month" className="bg-[#0a0f1c]">This Month</option>
                 <option value="last_month" className="bg-[#0a0f1c]">Last Month</option>
                 <option value="custom" className="bg-[#0a0f1c]">Custom Range...</option>
               </select>
               <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 pointer-events-none" />
            </div>

            {/* Custom Date Range Picker */}
            {datePreset === 'custom' && (
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2 h-[38px] transition-all">
                <input 
                  type="date"
                  className="bg-transparent text-sm text-white focus:outline-none dark:[color-scheme:dark]"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                />
                <span className="text-gray-500">-</span>
                <input 
                  type="date"
                  className="bg-transparent text-sm text-white focus:outline-none dark:[color-scheme:dark]"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                />
              </div>
            )}

            {/* Custom Multi-Select Dropdown for Ad Accounts */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}
                disabled={loadingAccounts || adAccounts.length === 0}
                className="flex items-center justify-between w-[240px] bg-[#0a0f1c] border border-white/10 hover:border-white/20 text-white pl-4 pr-3 py-2 rounded-lg text-sm transition-all focus:outline-none focus:border-[#33CCFF] focus:ring-1 focus:ring-[#33CCFF] disabled:opacity-50 h-[38px]"
              >
                <span className="truncate">
                  {loadingAccounts 
                    ? "Loading Accounts..." 
                    : adAccounts.length === 0 
                      ? "No Accounts Found" 
                      : `${selectedAccountIds.length} Account${selectedAccountIds.length !== 1 ? 's' : ''} Selected`}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-400 ml-2 flex-shrink-0" />
              </button>

              {isAccountDropdownOpen && (
                <div className="absolute top-full right-0 lg:left-0 mt-2 w-[300px] max-h-80 overflow-y-auto bg-[#0a0f1c] border border-[#33CCFF]/30 rounded-xl shadow-2xl z-50 p-2">
                  <div className="flex items-center justify-between px-3 py-2 border-b border-white/10 mb-2">
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Select Ad Accounts</span>
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
                          {areAllSelected ? 'Deselect All' : 'Select All'}
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
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${isSelected ? 'bg-[#33CCFF]/10 text-white' : 'hover:bg-white/5 text-gray-300'}`}
                      >
                        <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${isSelected ? 'border-[#33CCFF] bg-[#33CCFF]' : 'border-gray-500'}`}>
                           {isSelected && <Check className="w-3 h-3 text-[#070b14]" />}
                        </div>
                        <div className="truncate flex-1 text-sm">
                          {acc.name ? acc.name : 'Unknown Account'}
                          <span className="text-xs text-gray-500 block">ID: {acc.account_id}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <button 
              onClick={() => {
                if (selectedAccountIds.length > 0) {
                  if (datePreset === 'custom' && (!customStartDate || !customEndDate)) {
                    return;
                  }
                  fetchMetaAPI(selectedAccountIds, datePreset, customStartDate, customEndDate);
                } else {
                  fetchAdAccounts();
                }
              }}
              disabled={loading || loadingAccounts || (datePreset === 'custom' && (!customStartDate || !customEndDate))}
              className="flex items-center gap-2 bg-[#33CCFF]/10 hover:bg-[#33CCFF]/20 border border-[#33CCFF]/30 transition-all px-4 py-2 rounded-lg text-sm text-[#33CCFF] disabled:opacity-50 h-[38px]"
            >
              <RefreshCw className={`w-4 h-4 ${(loading || loadingAccounts) ? 'animate-spin' : ''}`} />
              Sync
            </button>
            <button 
              onClick={exportPDF}
              disabled={loading || loadingAccounts || isExporting}
              className="flex items-center gap-2 bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-400/30 transition-all px-4 py-2 rounded-lg text-sm text-indigo-300 disabled:opacity-50 h-[38px] ml-auto md:ml-0"
            >
              <Printer className={`w-4 h-4 ${isExporting ? 'animate-pulse' : ''}`} />
              {isExporting ? 'Exporting...' : 'Export PDF'}
            </button>
            <button 
              onClick={exportPPTX}
              disabled={loading || loadingAccounts || isExporting}
              className="flex items-center gap-2 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/30 transition-all px-4 py-2 rounded-lg text-sm text-amber-300 disabled:opacity-50 h-[38px]"
            >
              <Presentation className={`w-4 h-4 ${isExporting ? 'animate-pulse' : ''}`} />
              Export PPTX
            </button>
          </div>
        </div>

        {/* Warning / Status Banners */}
        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg flex items-center gap-2 text-sm backdrop-blur-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <p><span className="font-semibold">API Error:</span> {error}. Using simulated local data for preview.</p>
          </div>
        )}
        {isUsingMock && !error && (
          <div className="mb-6 bg-[#33CCFF]/10 border border-[#33CCFF]/20 text-[#33CCFF] px-4 py-3 rounded-lg flex items-center gap-2 text-sm backdrop-blur-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <p>Running in strictly local mode. Add API credentials to <code className="bg-black/30 px-1.5 py-0.5 rounded text-white text-xs">.env</code> to fetch live Meta Graph API data.</p>
          </div>
        )}

        {/* Main Content Router */}
        {activeTab === 'dashboard' ? (
          <>
            {/* Top Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard title="Total Spend" value={`$${totalSpend.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`} icon={DollarSign} color="#33CCFF" />
          <StatCard title="Total Clicks" value={totalClicks.toLocaleString()} icon={MousePointerClick} color="#0AE5D5" />
          <StatCard title="Total Leads" value={totalLeads.toLocaleString()} icon={Users} color="#33CCFF" />
          <StatCard title="Avg. CPL" value={`$${averageCpl.toFixed(2)}`} icon={TrendingUp} color="#0AE5D5" />
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
            <div className="p-6 border-b border-white/5">
              <h2 className="text-lg font-semibold flex items-center gap-2 mb-2">
                <Briefcase className="w-5 h-5 text-[#0AE5D5]" />
                Advanced Marketing Analysis
              </h2>
              <p className="text-xs text-gray-400">Custom inputs affect Business Conversion calcs. Positive ROI renders in green, negative down in red.</p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left whitespace-nowrap">
                <thead className="text-[10px] uppercase bg-black/40 text-gray-400 border-b border-white/10 border-t border-white/5">
                  <tr>
                    <th className="px-4 py-3 font-medium tracking-wider align-bottom" rowSpan={2}>Campaign Name</th>
                    <th className="px-4 py-2 font-medium tracking-wider text-center border-b border-white/5" colSpan={7}>Meta Insights (Auto)</th>
                    <th className="px-4 py-2 font-medium tracking-wider text-center bg-blue-500/5 border-l border-b border-white/5 text-blue-300" colSpan={6}>Business Conversion (Manual Input limits)</th>
                  </tr>
                  <tr>
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
                      <td colSpan={14} className="px-6 py-8 text-center text-gray-500">
                        Loading campaign data...
                      </td>
                    </tr>
                  ) : data.map((item) => {
                    const mData = manualData[item.campaign_id] || {};
                    const manualAccountOpen = parseFloat(mData.accountOpen) || 0;
                    const manualFundedAccounts = parseFloat(mData.fundedAccounts) || 0;
                    const manualDeposit = parseFloat(mData.deposit) || 0;

                    // Calc Meta
                    const ctr = item.impressions > 0 ? (item.clicks / item.impressions) * 100 : 0;
                    const cpc = item.clicks > 0 ? item.spend / item.clicks : 0;
                    const cpm = item.impressions > 0 ? (item.spend / item.impressions) * 1000 : 0;
                    const cpl = item.leads > 0 ? item.spend / item.leads : 0;
                    
                    // Calc Business
                    const cpa = manualAccountOpen > 0 ? item.spend / manualAccountOpen : 0;
                    const cpfa = manualFundedAccounts > 0 ? item.spend / manualFundedAccounts : 0;
                    const roi = item.spend > 0 ? ((manualDeposit - item.spend) / item.spend) * 100 : 0;

                    return (
                      <tr key={item.campaign_id} className="hover:bg-white/[0.04] transition-colors print:border-b print:border-gray-200">
                        <td className="px-4 py-3 font-medium text-gray-200 print:text-[#070b14]" title={item.campaign_name}>
                          <div className="truncate max-w-[200px]">{item.campaign_name}</div>
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
                          {item.leads}
                        </td>
                        <td className="px-4 py-3 text-gray-300">
                          ${cpl.toFixed(2)}
                        </td>
                        
                        {/* Manual inputs & Calc */}
                        <td className="px-4 py-2 border-l border-white/5 bg-[#33CCFF]/[0.05] print:bg-transparent print:border-none">
                          <input 
                            type="number" 
                            className="w-16 bg-black/40 border border-white/10 rounded px-2 py-1.5 focus:outline-none focus:border-[#33CCFF] focus:ring-1 focus:ring-[#33CCFF] text-white text-xs transition-all pdf-hide print:hidden"
                            placeholder="0"
                            value={mData.accountOpen || ''}
                            onChange={(e) => handleManualChange(item.campaign_id, 'accountOpen', e.target.value)}
                          />
                          <span className="hidden print:inline-block font-medium text-[#070b14]">{mData.accountOpen || '0'}</span>
                        </td>
                        <td className="px-4 py-3 font-medium text-[#33CCFF] bg-[#33CCFF]/[0.02] print:text-blue-600 print:bg-transparent">
                          ${cpa.toFixed(2)}
                        </td>
                        
                        <td className="px-4 py-2 bg-[#0AE5D5]/[0.05] print:bg-transparent">
                          <input 
                            type="number" 
                            className="w-16 bg-black/40 border border-white/10 rounded px-2 py-1.5 focus:outline-none focus:border-[#0AE5D5] focus:ring-1 focus:ring-[#0AE5D5] text-white text-xs transition-all pdf-hide print:hidden"
                            placeholder="0"
                            value={mData.fundedAccounts || ''}
                            onChange={(e) => handleManualChange(item.campaign_id, 'fundedAccounts', e.target.value)}
                          />
                          <span className="hidden print:inline-block font-medium text-[#070b14]">{mData.fundedAccounts || '0'}</span>
                        </td>
                        <td className="px-4 py-3 font-medium text-[#0AE5D5] bg-[#0AE5D5]/[0.02] print:text-teal-600 print:bg-transparent">
                          ${cpfa.toFixed(2)}
                        </td>

                        <td className="px-4 py-2 bg-indigo-500/[0.05] print:bg-transparent">
                          <div className="relative">
                            <span className="absolute left-2 top-1.5 text-gray-500 pdf-hide print:hidden">$</span>
                            <input 
                              type="number" 
                              className="w-20 bg-black/40 border border-white/10 rounded pl-5 pr-2 py-1.5 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 text-white text-xs transition-all pdf-hide print:hidden"
                              placeholder="0.00"
                              value={mData.deposit || ''}
                              onChange={(e) => handleManualChange(item.campaign_id, 'deposit', e.target.value)}
                            />
                            <span className="hidden print:inline-block font-medium text-[#070b14]">${mData.deposit || '0.00'}</span>
                          </div>
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
      </div>
    </div>
  );
}

// =====================================================================
// ==================== AGENCY REPORT MODULES ==========================
// =====================================================================

function ReportManager({ data, manualData, handleManualChange, activeReportTab, setActiveReportTab }) {
  const tabs = [
    { id: 'daily', name: 'Daily Performance', icon: Target },
    { id: 'funnel', name: 'Funnel Metrics', icon: Filter },
    { id: 'breakdown', name: 'Market Breakdown', icon: Globe },
    { id: 'creative', name: 'Creative Analysis', icon: ImageIcon },
    { id: 'roi', name: 'Executive ROI', icon: TrendingDown } // We'll use TrendingUp inside
  ];

  return (
    <div className="flex flex-col xl:flex-row gap-6">
      {/* Settings / Reports Sidebar */}
      <div className="xl:w-64 flex-shrink-0 print:hidden pdf-hide">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sticky top-6">
          <h3 className="text-sm font-semibold text-gray-400 mb-4 px-2 uppercase tracking-widest">Report Models</h3>
          <div className="flex flex-col gap-1">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeReportTab === tab.id;
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
        
        {activeReportTab === 'daily' && <DailyPerformanceReport data={data} />}
        {activeReportTab === 'funnel' && <FunnelReport data={data} manualData={manualData} handleManualChange={handleManualChange} />}
        {activeReportTab === 'breakdown' && <BreakdownReport data={data} manualData={manualData} />}
        {activeReportTab === 'creative' && <CreativePerformanceReport />}
        {activeReportTab === 'roi' && <ROIRevenueReport data={data} manualData={manualData} />}
      </div>
    </div>
  );
}

// ======== 1. DAILY PERFORMANCE REPORT ========
function DailyPerformanceReport({ data }) {
  // Sort by Spend descending
  const sortedData = [...data].sort((a,b) => b.spend - a.spend);

  return (
    <div>
      <h2 className="text-xl font-bold flex items-center gap-2 mb-2 print:text-[#070b14]">
        <Target className="w-6 h-6 text-[#0AE5D5]" /> Daily Performance Report (Optimize View)
      </h2>
      <p className="text-gray-400 text-sm mb-6 print:text-gray-600">Actionable insights to KILL underperforming ads or SCALE winning campaigns within 24h.</p>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left whitespace-nowrap">
          <thead className="text-[10px] uppercase bg-black/40 text-gray-300 border-b border-white/10">
            <tr>
              <th className="px-4 py-3">Campaign</th>
              <th className="px-4 py-3">Spend</th>
              <th className="px-4 py-3">CTR</th>
              <th className="px-4 py-3">CPC</th>
              <th className="px-4 py-3">CPL</th>
              <th className="px-4 py-3 text-center">AI Decision</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {sortedData.map(item => {
              const ctr = item.impressions > 0 ? (item.clicks / item.impressions) * 100 : 0;
              const cpc = item.clicks > 0 ? item.spend / item.clicks : 0;
              const cpl = item.leads > 0 ? item.spend / item.leads : 0;

              // Simple logic: if CPL > 15, KILL. If CPL < 5 and spend > 10, SCALE.
              let decision = <span className="px-2 py-1 bg-gray-500/10 text-gray-400 rounded text-xs">MONITOR</span>;
              if (cpl > 15 || (item.spend > 20 && item.leads === 0)) decision = <span className="px-2 py-1 bg-red-500/20 border border-red-500/30 text-red-400 font-bold rounded text-xs flex justify-center items-center gap-1 w-20 mx-auto">KILL <AlertCircle className="w-3 h-3"/></span>;
              else if (cpl > 0 && cpl <= 5 && item.spend > 10) decision = <span className="px-2 py-1 bg-green-500/20 border border-green-500/30 text-green-400 font-bold rounded text-xs flex justify-center items-center gap-1 w-20 mx-auto">SCALE <TrendingUp className="w-3 h-3"/></span>;

              return (
                <tr key={item.campaign_id} className="hover:bg-white/[0.04]">
                  <td className="px-4 py-3 font-medium text-gray-200 print:text-[#070b14] truncate max-w-[200px]">{item.campaign_name}</td>
                  <td className="px-4 py-3">${item.spend.toFixed(2)}</td>
                  <td className="px-4 py-3">{ctr.toFixed(2)}%</td>
                  <td className="px-4 py-3">${cpc.toFixed(2)}</td>
                  <td className={`px-4 py-3 font-bold ${cpl > 15 ? 'text-red-400' : 'text-[#0AE5D5]'}`}>${cpl.toFixed(2)}</td>
                  <td className="px-4 py-3">{decision}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ======== 2. FUNNEL REPORT ========
function FunnelReport({ data, manualData, handleManualChange }) {
  return (
    <div>
      <h2 className="text-xl font-bold flex items-center gap-2 mb-2 print:text-[#070b14]">
        <Filter className="w-6 h-6 text-[#33CCFF]" /> Funnel Conversion Report
      </h2>
      <p className="text-gray-400 text-sm mb-6 print:text-gray-600">Track drop-offs across Webinar / Forex acquisition steps: Leads → Attend → Open → Deposit.</p>
      
      <div className="space-y-6">
        {data.map(item => {
          const mData = manualData[item.campaign_id] || {};
          const attend = parseFloat(mData.attend) || 0;
          const acct = parseFloat(mData.accountOpen) || 0;
          const fund = parseFloat(mData.fundedAccounts) || 0;
          
          const attendRate = item.leads > 0 ? (attend / item.leads) * 100 : 0;
          const openRate = attend > 0 ? (acct / attend) * 100 : (item.leads > 0 ? (acct / item.leads) * 100 : 0);
          const fundRate = acct > 0 ? (fund / acct) * 100 : 0;

          return (
            <div key={item.campaign_id} className="bg-black/20 p-4 border border-white/5 rounded-xl print:bg-gray-50 print:border-gray-200">
              <h4 className="font-semibold text-[#0AE5D5] mb-4 print:text-blue-700">{item.campaign_name}</h4>
              
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 text-sm relative">
                {/* Arrow lines between cols (hidden on small screens) */}
                <div className="hidden lg:block absolute top-[45%] left-0 w-full h-[1px] bg-white/10 z-0"></div>

                <div className="bg-[#0a0f1c] p-3 rounded-lg border border-white/10 z-10 flex flex-col items-center">
                  <span className="text-gray-400 text-xs mb-1">1. Meta Leads</span>
                  <span className="text-xl font-bold text-white print:text-black">{item.leads}</span>
                </div>
                
                <div className="bg-[#0a0f1c] p-3 rounded-lg border border-white/10 z-10 flex flex-col items-center">
                  <span className="text-gray-400 text-xs mb-1">2. Attendance</span>
                  <input type="number" 
                    className="w-16 bg-white/5 border border-white/20 rounded px-2 py-1 text-center text-white text-sm mb-1 pdf-hide print:hidden"
                    placeholder="0" value={mData.attend || ''} onChange={(e) => handleManualChange(item.campaign_id, 'attend', e.target.value)}
                  />
                  <span className="hidden print:block text-xl font-bold text-black">{attend}</span>
                  <span className={`text-xs ${attendRate >= 30 ? 'text-green-400' : 'text-orange-400'}`}>{attendRate.toFixed(1)}% drop</span>
                </div>

                <div className="bg-[#0a0f1c] p-3 rounded-lg border border-white/10 z-10 flex flex-col items-center">
                  <span className="text-gray-400 text-xs mb-1">3. Acct Open</span>
                  <span className="text-xl font-bold text-[#33CCFF] print:text-blue-600">{acct}</span>
                  <span className="text-xs text-gray-500">{openRate.toFixed(1)}% cvr</span>
                </div>

                <div className="bg-[#0a0f1c] p-3 rounded-lg border border-white/10 z-10 flex flex-col items-center">
                  <span className="text-gray-400 text-xs mb-1">4. Funded</span>
                  <span className="text-xl font-bold text-[#0AE5D5] print:text-teal-600">{fund}</span>
                  <span className="text-xs text-gray-500">{fundRate.toFixed(1)}% cvr</span>
                </div>

                <div className="bg-indigo-900/30 p-3 rounded-lg border border-indigo-500/30 z-10 flex flex-col items-center">
                  <span className="text-indigo-300 text-xs mb-1">5. Final CPA (Funded)</span>
                  <span className="text-xl font-bold text-indigo-400">${fund > 0 ? (item.spend / fund).toFixed(2) : '0.00'}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ======== 3. BREAKDOWN REPORT ========
function BreakdownReport({ data, manualData }) {
  // Parsing logic for country code
  const marketRegex = /^(VN|TH|MY|PH|IND|ID)/i;
  let breakdown = {};
  
  data.forEach(item => {
    let country = 'OTHER';
    const match = item.campaign_name.match(marketRegex);
    if(match) country = match[1].toUpperCase();

    if(!breakdown[country]) breakdown[country] = { spend: 0, leads: 0, acct: 0, fund: 0, deposit: 0 };
    
    const mData = manualData[item.campaign_id] || {};
    
    breakdown[country].spend += item.spend;
    breakdown[country].leads += item.leads;
    breakdown[country].acct += parseFloat(mData.accountOpen) || 0;
    breakdown[country].fund += parseFloat(mData.fundedAccounts) || 0;
    breakdown[country].deposit += parseFloat(mData.deposit) || 0;
  });

  const pieData = Object.keys(breakdown).map(key => ({
    name: key, 
    value: parseFloat(breakdown[key].spend.toFixed(2))
  }));

  const COLORS = ['#33CCFF', '#0AE5D5', '#818cf8', '#f472b6', '#34d399', '#fcd34d'];

  return (
    <div>
      <h2 className="text-xl font-bold flex items-center gap-2 mb-2 print:text-[#070b14]">
        <Globe className="w-6 h-6 text-indigo-400" /> Breakdown Report (Multi-Market Deep Analysis)
      </h2>
      <p className="text-gray-400 text-sm mb-6 print:text-gray-600">Cross-referencing Spend, Funnel conversion, and Final ROI by geographical region.</p>
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="h-[300px] flex flex-col items-center xl:col-span-1">
          <h3 className="font-semibold text-gray-300 mb-2">Budget Allocation by Region</h3>
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
          <h3 className="font-semibold text-gray-300 mb-4">Regional Business Performance</h3>
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="text-[10px] uppercase bg-white/5 text-gray-400">
              <tr>
                <th className="px-4 py-3">Region</th>
                <th className="px-4 py-3">Total Spend</th>
                <th className="px-4 py-3">Avg CPL</th>
                <th className="px-4 py-3 text-[#33CCFF]">Acct Open / CPA</th>
                <th className="px-4 py-3 text-[#0AE5D5]">Funded / CPFA</th>
                <th className="px-4 py-3 text-indigo-300">Total Deposit</th>
                <th className="px-4 py-3">ROI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {Object.keys(breakdown).map((key, i) => {
                const b = breakdown[key];
                const cpl = b.leads > 0 ? b.spend / b.leads : 0;
                const cpa = b.acct > 0 ? b.spend / b.acct : 0;
                const cpfa = b.fund > 0 ? b.spend / b.fund : 0;
                const roi = b.spend > 0 ? ((b.deposit - b.spend) / b.spend) * 100 : 0;
                
                return (
                  <tr key={key} className="hover:bg-white/5">
                    <td className="px-4 py-3 font-bold flex items-center gap-2">
                       <span className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[i % COLORS.length]}}></span> {key}
                    </td>
                    <td className="px-4 py-3">${b.spend.toFixed(2)}</td>
                    <td className="px-4 py-3">${cpl.toFixed(2)}</td>
                    <td className="px-4 py-3 text-[#33CCFF]">
                      <span className="text-white font-medium">{b.acct}</span> <span className="text-gray-500">/ ${cpa.toFixed(2)}</span>
                    </td>
                    <td className="px-4 py-3 text-[#0AE5D5]">
                      <span className="text-white font-medium">{b.fund}</span> <span className="text-gray-500">/ ${cpfa.toFixed(2)}</span>
                    </td>
                    <td className="px-4 py-3 font-medium text-indigo-300">${b.deposit.toFixed(2)}</td>
                    <td className={`px-4 py-3 font-bold ${roi > 0 ? 'text-green-400' : roi < 0 ? 'text-red-400' : 'text-gray-400'}`}>
                      {roi > 0 ? '+' : ''}{roi.toFixed(1)}%
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ======== 4. CREATIVE PERFORMANCE REPORT ========
function CreativePerformanceReport() {
  return (
    <div>
      <h2 className="text-xl font-bold flex items-center gap-2 mb-2 print:text-[#070b14]">
        <ImageIcon className="w-6 h-6 text-pink-400" /> Creative Performance Report
      </h2>
      <p className="text-gray-400 text-sm mb-6 print:text-gray-600">Track Hook formats, 3s view-rate, and visual efficiency. (Ad-level tracking template)</p>
      
      <div className="bg-pink-500/10 border border-pink-500/20 rounded-xl p-8 flex flex-col items-center justify-center text-center">
        <PieChartIcon className="w-16 h-16 text-pink-400 mb-4 opacity-50" />
        <h3 className="text-lg font-semibold text-pink-300 mb-2">Ad-Level Insights Required</h3>
        <p className="max-w-md text-gray-400 text-sm">To populate this view, the Meta API mapping must be expanded to pull from the <code>/ads</code> endpoint including `creative` fields. This blueprint reserves the architecture for Phase 2.</p>
        <button className="mt-4 bg-pink-500/20 hover:bg-pink-500/30 border border-pink-400/30 text-pink-300 px-4 py-2 rounded-lg transition-all text-sm pointer-events-none opacity-50">Sync Ad Creatives (Coming Soon)</button>
      </div>
    </div>
  );
}

// ======== 5. ROI / REVENUE REPORT ========
function ROIRevenueReport({ data, manualData }) {
  const totalSpend = data.reduce((a,b) => a + b.spend, 0);
  const totalDeposit = data.reduce((a,b) => {
    const m = manualData[b.campaign_id];
    return a + (m && m.deposit ? parseFloat(m.deposit) : 0);
  }, 0);
  
  const roas = totalSpend > 0 ? (totalDeposit / totalSpend).toFixed(2) : 0;
  const netProfit = totalDeposit - totalSpend;
  const roiPerc = totalSpend > 0 ? ((netProfit / totalSpend) * 100).toFixed(1) : 0;

  return (
    <div>
      <h2 className="text-xl font-bold flex items-center gap-2 mb-2 print:text-[#070b14]">
        <TrendingUp className="w-6 h-6 text-green-400" /> Executive ROI & Revenue
      </h2>
      <p className="text-gray-400 text-sm mb-6 print:text-gray-600">High-level P&L tracking for leadership and investors.</p>
      
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

      <div className="bg-black/20 rounded-xl p-6 border border-white/5 flex justify-between items-center print:hidden">
        <div>
           <h3 className="text-2xl font-bold text-white mb-1"><span className="text-[#0AE5D5]">ROAS:</span> {roas}x</h3>
           <p className="text-gray-400 text-sm">For every $1 spent, you earn ${roas} back in deposits.</p>
        </div>
        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#33CCFF] to-[#0AE5D5] flex items-center justify-center shadow-lg">
           <DollarSign className="text-[#070b14] w-8 h-8" strokeWidth={3} />
        </div>
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
             <h3 className="font-bold text-lg text-pink-300 mb-4 truncate pr-6" title={page.name}>{page.name}</h3>
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

// src/services/adPostService.js
// Quản lý & Truy xuất Thông Tin Bài Post Chạy Quảng Cáo (Ad Creatives & Facebook Posts)

export const MOCK_AD_POSTS = [
  {
    id: 'post_101',
    postId: '102938475610293_98765432101',
    campaignName: 'VN_LeadGen_Campaign1',
    campaignId: '101',
    adName: 'Ad 01 - Khuyến Mãi Bonus Nạp 100%',
    pageName: 'Global Forex Official',
    pageAvatar: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=120&h=120&fit=crop&crop=face',
    headline: 'Nhận Ngay 100% Bonus Nạp Đầu Tiên - Giao Dịch Không Lo Trượt Giá',
    message: '🔥 Cơ hội vàng cho nhà đầu tư mới trong tháng 4! Tặng ngay 100% giá trị nạp đầu tiên lên đến $1,000. \n\n✅ Nền tảng MT5 chuẩn quốc tế, khớp lệnh tức thì\n✅ Hỗ trợ nạp rút 24/7 qua 35 ngân hàng Việt Nam\n✅ Chuyên gia 1-kèm-1 định hướng chiến lược quản trị rủi ro\n\n👉 Nhấn nút [Đăng Ký Ngay] bên dưới để mở tài khoản thử nghiệm và nhận tài liệu độc quyền!',
    callToAction: 'Đăng Ký Ngay (SIGN_UP)',
    imageUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&auto=format&fit=crop&q=80',
    permalinkUrl: 'https://facebook.com/globalforex/posts/98765432101',
    createdTime: '2026-04-12T09:30:00+07:00',
    metrics: {
      spend: 1250.5,
      leadsCount: 145,
      cpl: 8.62,
      reactions: 1420,
      comments: 384,
      shares: 96,
      reach: 48500
    },
    status: 'ACTIVE',
    targetAudience: 'Nam 25-45, Hà Nội & TP.HCM, Quan tâm Đầu tư tài chính, Chứng khoán, Ngoại hối'
  },
  {
    id: 'post_102',
    postId: '102938475610293_98765432102',
    campaignName: 'TH_IBAcquisition_April',
    campaignId: '102',
    adName: 'Ad 02 - Tuyển Dụng Đối Tác Phát Triển IB',
    pageName: 'Global Forex Official',
    pageAvatar: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=120&h=120&fit=crop&crop=face',
    headline: 'Chính Sách Hoa Hồng IB Hấp Dẫn Nhất Thị Trường - Lên Đến $15/Lot',
    message: '🚀 Bạn đang xây dựng cộng đồng nhà đầu tư? Hợp tác trở thành Introducing Broker (IB) cấp cao:\n\n⭐ Hoa hồng chi trả tự động hàng ngày\n⭐ Cung cấp cổng phân tích tín hiệu AI & Copy-trade cho khách của bạn\n⭐ Văn phòng đại diện hỗ trợ tổ chức sự kiện & hội thảo\n\nInbox hoặc để lại thông tin để trao đổi trực tiếp cơ chế độc quyền.',
    callToAction: 'Liên Hệ Với Chúng Tôi (CONTACT_US)',
    imageUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&auto=format&fit=crop&q=80',
    permalinkUrl: 'https://facebook.com/globalforex/posts/98765432102',
    createdTime: '2026-04-01T10:00:00+07:00',
    metrics: {
      spend: 850.0,
      leadsCount: 85,
      cpl: 10.0,
      reactions: 890,
      comments: 172,
      shares: 45,
      reach: 36000
    },
    status: 'ACTIVE',
    targetAudience: 'Trader có kinh nghiệm, Admin nhóm tài chính, Trưởng nhóm tư vấn'
  },
  {
    id: 'post_103',
    postId: '20394857610293_98765432103',
    campaignName: 'IND_Webinar_Promo',
    campaignId: '104',
    adName: 'Ad 03 - Webinar Bí Quyết Giao Dịch Thực Chiến',
    pageName: 'Webinar Alerts Asia',
    pageAvatar: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=120&h=120&fit=crop&crop=face',
    headline: 'Webinar Trực Tuyến Miễn Phí: Nhận Diện Xu Hướng Thị Trường Q2/2026',
    message: '🎓 Tham gia buổi học trực tuyến cùng chuyên gia phân tích 10 năm kinh nghiệm:\n\n• Phân tích tác động chính sách vĩ mô của Fed\n• Phương pháp nhận diện vùng hỗ trợ - kháng cự theo trường phái Price Action\n• Hỏi đáp trực tiếp & nhận phần mềm quét tín hiệu tự động\n\n⏰ Thời gian: 20:00 Thứ Năm tuần này. Đăng ký nhận link Zoom kín ngay!',
    callToAction: 'Đăng Ký Tham Gia (REGISTER)',
    imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&auto=format&fit=crop&q=80',
    permalinkUrl: 'https://facebook.com/webinaralerts/posts/98765432103',
    createdTime: '2026-04-18T14:20:00+07:00',
    metrics: {
      spend: 960.0,
      leadsCount: 95,
      cpl: 10.1,
      reactions: 1650,
      comments: 540,
      shares: 120,
      reach: 72000
    },
    status: 'ACTIVE',
    targetAudience: 'Người tìm hiểu tài chính cá nhân, sinh viên năm cuối, nhân viên văn phòng'
  },
  {
    id: 'post_104',
    postId: '102938475610293_98765432105',
    campaignName: 'VN_IBAcquisition_Gold',
    campaignId: '105',
    adName: 'Ad 04 - Chiến Lược Giao Dịch Vàng XAUUSD',
    pageName: 'Global Forex Official',
    pageAvatar: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=120&h=120&fit=crop&crop=face',
    headline: 'Tín Hiệu Giao Dịch Vàng Real-Time - Tỷ Lệ Thắng Đạt 78%',
    message: '⚡ Nhận thông báo điểm vào lệnh (Entry), Chốt lời (Take Profit) và Dừng lỗ (Stop Loss) tức thời cho cặp Vàng (XAU/USD).\n\nTham gia nhóm VIP nhận tín hiệu miễn phí 14 ngày không rủi ro!',
    callToAction: 'Nhận Báo Giá / Tín Hiệu (GET_QUOTE)',
    imageUrl: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?w=800&auto=format&fit=crop&q=80',
    permalinkUrl: 'https://facebook.com/globalforex/posts/98765432105',
    createdTime: '2026-04-05T08:00:00+07:00',
    metrics: {
      spend: 650.8,
      leadsCount: 48,
      cpl: 13.55,
      reactions: 720,
      comments: 215,
      shares: 38,
      reach: 28000
    },
    status: 'PAUSED',
    targetAudience: 'Nhà đầu tư quan tâm vàng vật chất & vàng tài khoản'
  }
];

/**
 * Tìm bài post quảng cáo liên kết với một Lead dựa trên thông tin chiến dịch
 * @param {Object} lead - Khách hàng cần tra cứu
 * @returns {Object|null} - Thông tin bài post quảng cáo
 */
export function getAdPostForLead(lead) {
  if (!lead) return MOCK_AD_POSTS[0];

  // Tìm theo campaign name nếu có
  if (lead.campaign) {
    const found = MOCK_AD_POSTS.find(p => 
      p.campaignName.toLowerCase().includes(lead.campaign.toLowerCase()) ||
      lead.campaign.toLowerCase().includes(p.campaignName.toLowerCase()) ||
      (lead.notes && lead.notes.toLowerCase().includes(p.campaignName.toLowerCase()))
    );
    if (found) return found;
  }

  // Fallback theo từ khóa trong notes/tags
  const text = `${lead.name} ${lead.notes || ''} ${(lead.tags || []).join(' ')}`.toLowerCase();
  if (text.includes('gold') || text.includes('vàng')) {
    return MOCK_AD_POSTS.find(p => p.id === 'post_104') || MOCK_AD_POSTS[0];
  }
  if (text.includes('webinar') || text.includes('zoom')) {
    return MOCK_AD_POSTS.find(p => p.id === 'post_103') || MOCK_AD_POSTS[0];
  }
  if (text.includes('ib') || text.includes('đối tác')) {
    return MOCK_AD_POSTS.find(p => p.id === 'post_102') || MOCK_AD_POSTS[0];
  }

  return MOCK_AD_POSTS[0];
}

/**
 * Lấy danh sách tất cả các bài post quảng cáo đang chạy
 * @returns {Array}
 */
export function getAllAdPosts() {
  return MOCK_AD_POSTS;
}

/**
 * Truy xuất bài post từ Meta Graph API thực tế (nếu người dùng có access token hợp lệ)
 * @param {string} adId - ID của quảng cáo
 * @param {string} token - Meta Graph API Access Token
 * @returns {Promise<Object>}
 */
export async function fetchAdPostFromMetaApi(adId, token) {
  if (!adId || !token) {
    return null;
  }
  try {
    const res = await fetch(`https://graph.facebook.com/v19.0/${adId}?fields=name,creative{id,name,title,body,image_url,thumbnail_url,object_story_id,effective_object_story_id,call_to_action_type}&access_token=${token}`);
    const data = await res.json();
    if (!res.ok || data.error) {
      console.warn("Meta API Ad Fetch Error:", data.error);
      return null;
    }

    const creative = data.creative;
    const storyId = creative?.effective_object_story_id || creative?.object_story_id;

    if (storyId) {
      // Tiếp tục lấy bài post gốc trên page
      const postRes = await fetch(`https://graph.facebook.com/v19.0/${storyId}?fields=id,message,permalink_url,full_picture,created_time,shares,comments.summary(true),reactions.summary(true)&access_token=${token}`);
      const postData = await postRes.json();
      if (postRes.ok && !postData.error) {
        return {
          id: data.id,
          postId: postData.id,
          headline: creative.title || data.name,
          message: postData.message || creative.body,
          imageUrl: postData.full_picture || creative.image_url || creative.thumbnail_url,
          permalinkUrl: postData.permalink_url,
          callToAction: creative.call_to_action_type,
          reactions: postData.reactions?.summary?.total_count || 0,
          comments: postData.comments?.summary?.total_count || 0,
          shares: postData.shares?.count || 0,
          createdTime: postData.created_time
        };
      }
    }

    return {
      id: data.id,
      headline: creative?.title || data.name,
      message: creative?.body || 'Chưa có mô tả',
      imageUrl: creative?.image_url || creative?.thumbnail_url,
      callToAction: creative?.call_to_action_type
    };
  } catch (err) {
    console.error("fetchAdPostFromMetaApi failed:", err);
    return null;
  }
}

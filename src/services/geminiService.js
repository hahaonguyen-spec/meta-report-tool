// Google Gemini API Service for Marketing & CRM Insights

const DEFAULT_GEMINI_MODEL = 'gemini-1.5-flash';
const GEMINI_FALLBACK_MODELS = ['gemini-1.5-flash', 'gemini-2.0-flash', 'gemini-1.5-pro'];

/**
 * Helper to call Gemini REST API
 */
async function callGemini(apiKey, prompt, systemInstruction = '', model = DEFAULT_GEMINI_MODEL) {
  if (!apiKey || !apiKey.trim()) {
    throw new Error('Chưa cấu hình Google Gemini API Key. Vui lòng vào Cài Đặt để nhập khóa API.');
  }

  const cleanKey = apiKey.trim();
  const modelsToTry = [model, ...GEMINI_FALLBACK_MODELS.filter(m => m !== model)];
  let lastError = null;

  for (const currentModel of modelsToTry) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${currentModel}:generateContent?key=${cleanKey}`;
      
      const requestBody = {
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2500,
          topP: 0.95
        }
      };

      if (systemInstruction) {
        requestBody.systemInstruction = {
          parts: [{ text: systemInstruction }]
        };
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        const errMsg = errJson?.error?.message || response.statusText;
        if (response.status === 404) {
          lastError = new Error(`Model ${currentModel} không khả dụng: ${errMsg}`);
          continue;
        }
        throw new Error(errMsg || `Lỗi kết nối Gemini API (HTTP ${response.status})`);
      }

      const data = await response.json();
      const textOutput = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!textOutput) {
        throw new Error('Gemini không trả về nội dung hợp lệ.');
      }
      return textOutput;
    } catch (err) {
      lastError = err;
      if (err.message && (err.message.includes('API key') || err.message.includes('PERMISSION_DENIED') || err.message.includes('API_KEY_INVALID'))) {
        throw new Error('Gemini API Key không hợp lệ hoặc không có quyền truy cập. Vui lòng kiểm tra lại trên Google AI Studio.');
      }
    }
  }

  throw lastError || new Error('Không thể kết nối với Gemini API sau khi thử các model dự phòng.');
}

/**
 * 1. Test Gemini API Key Connection
 */
export async function testGeminiConnection(apiKey) {
  try {
    const res = await callGemini(
      apiKey,
      'Xin chào! Hãy phản hồi đúng 1 câu ngắn: "Kết nối Gemini API thành công."',
      'Bạn là trợ lý kiểm tra kết nối API.'
    );
    return { success: true, message: res.trim() };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

/**
 * 2. Phân Tích Toàn Diện Dữ Liệu Marketing & CRM (Marketing Diagnostic & Strategic Recommendations)
 */
export async function analyzeMarketingData(apiKey, contextData) {
  const systemInstruction = `
Bạn là một Giám Đốc Tiếp Thị (Chief Marketing Officer - CMO) và Chuyên Gia Tối Ưu Tăng Trưởng (Growth Hacker) hàng đầu chuyên về Performance Marketing và Quản Trị Khách Hàng (CRM).
Nhiệm vụ của bạn là nhận số liệu tiếp thị thực tế và đưa ra bản phân tích sâu sắc, logic, thực chiến bằng tiếng Việt, giúp tối ưu chi phí quảng cáo (Ad Spend), giảm giá mỗi khách hàng tiềm năng (CPL), giảm chi phí thu hút khách hàng (CAC), tăng tỷ lệ chuyển đổi và nhân đôi tỷ suất sinh lời (ROAS / ROI).

Cấu trúc bài phân tích BẮT BUỘC theo định dạng Markdown rõ ràng, dễ đọc:
# 📊 BÁO CÁO PHÂN TÍCH TIẾP THỊ & ĐỀ XUẤT CHIẾN LƯỢC TỐI ƯU
### 1. Đánh Giá Sức Khỏe Tổng Thể (Executive Summary)
- Nhận định tổng quan về các chỉ số: Chi phí quảng cáo, CPL, CAC, Doanh thu nạp tiền và ROAS.
- Điểm sáng (Highlights) và Điểm cần báo động đỏ (Red Flags).

### 2. Chẩn Đoán Điểm Nghẽn Phễu Chuyển Đổi (Bottleneck Diagnosis)
- Phân tích chi tiết từng bước rơi rụng (Drop-off rate): Từ Hiển thị -> Click -> Lead -> Tư vấn -> Mở tài khoản -> Nạp tiền -> Chốt đơn.
- Xác định chính xác bước nào đang làm thất thoát ngân sách và khách hàng nhiều nhất.

### 3. Đánh Giá Chiến Dịch & Kênh Tiếp Thị (Campaign & Channel Audit)
- Chỉ ra chiến dịch/kênh nào hiệu quả nhất (Nên Scale Up tăng ngân sách).
- Chỉ ra chiến dịch/kênh nào đang lãng phí tiền (Nên Tạm dừng hoặc Tối ưu lại).

### 4. 5 Phương Hướng Điều Chỉnh Cụ Thể Để Đạt Kết Quả Tốt Nhất (Action Plan)
- Đưa ra 5 bước hành động thực thi chi tiết (về Target đối tượng, Creative quảng cáo, Landing Page/Form, Quy trình Sale chăm sóc Lead, Phân bổ lại ngân sách).

### 5. Dự Báo Hiệu Quả Sau Điều Chỉnh (ROI Projection)
- Ước tính nếu áp dụng các đề xuất trên, CAC có thể giảm bao nhiêu % và ROAS có thể tăng trưởng thế nào.
`;

  const prompt = `
Dưới đây là bảng số liệu tiếp thị và khách hàng CRM hiện tại của chúng tôi:

=== SỐ LIỆU TỔNG QUAN ===
- Tổng chi phí quảng cáo (Total Ad Spend): $${contextData.totalSpend?.toLocaleString() || 0}
- Tổng số lượt hiển thị (Impressions): ${contextData.totalImpressions?.toLocaleString() || 0}
- Tổng số lượt nhấp (Clicks): ${contextData.totalClicks?.toLocaleString() || 0}
- Tỷ lệ nhấp (CTR): ${contextData.ctr || 0}%
- Tổng số Leads tạo ra: ${contextData.totalLeads || 0}
- Chi phí trên mỗi Lead (CPL): $${contextData.cpl || 0}
- Số khách đã nạp tiền / chốt đơn: ${contextData.fundedLeadsCount || 0}
- Chi phí thu hút 1 khách hàng trả phí (CAC): $${contextData.cac || 0}
- Tổng doanh thu nạp tiền / Giao dịch: $${contextData.totalDeposit?.toLocaleString() || 0}
- Doanh thu trung bình trên mỗi khách (ARPU): $${contextData.arpu || 0}
- ROAS (Doanh thu / Chi phí ads): ${contextData.roas || 0}x
- Tỷ lệ chốt thành công (Win Rate): ${contextData.winRate || 0}%

=== PHỄU CHUYỂN ĐỔI CHI TIẾT ===
${JSON.stringify(contextData.funnelData || [], null, 2)}

=== CHI TIẾT TỪNG CHIẾN DỊCH (TOP CAMPAIGNS) ===
${JSON.stringify(contextData.campaignsSummary || [], null, 2)}

=== PHÂN BỔ THEO NGUỒN TIẾP THỊ (SOURCES) ===
${JSON.stringify(contextData.sourceData || [], null, 2)}

Hãy phân tích thật sắc bén, chuyên sâu và đưa ra phương hướng hành động cụ thể để chúng tôi áp dụng ngay hôm nay!
`;

  return await callGemini(apiKey, prompt, systemInstruction);
}

/**
 * 3. Soạn Kịch Bản Tư Vấn Bán Hàng & Xử Lý Từ Chối Cho Lead Cụ Thể
 */
export async function generateLeadPitch(apiKey, leadData) {
  const systemInstruction = `
Bạn là Trưởng nhóm Telesales / Chuyên gia Tư vấn Chuyển đổi Lead đỉnh cao.
Nhiệm vụ của bạn là dựa vào hồ sơ của một khách hàng tiềm năng (Lead) để xây dựng:
1. Đánh giá nhanh tâm lý và nhu cầu của khách hàng này.
2. Kịch bản gọi điện mở đầu lôi cuốn (Hook trong 10 giây đầu).
3. 3 câu hỏi khai thác nhu cầu trọng tâm.
4. Mẫu tin nhắn Zalo / WhatsApp ngắn gọn, ấm áp gửi sau cuộc gọi.
5. Dự kiến 2 lời từ chối khách hàng thường đưa ra và cách xử lý (Objection Handling) để đưa khách tới bước tiếp theo (Mở tài khoản hoặc Nạp tiền).

Giọng văn tự nhiên, thuyết phục, lịch sự, đúng tâm lý khách hàng Việt Nam.
`;

  const prompt = `
Thông tin khách hàng:
- Tên khách hàng: ${leadData.name}
- Số điện thoại: ${leadData.phone || 'Chưa có'}
- Email: ${leadData.email || 'Chưa có'}
- Nguồn tiếp cận: ${leadData.source || 'Facebook Ads'}
- Chiến dịch quảng cáo: ${leadData.campaign || 'Chưa rõ'}
- Trạng thái hiện tại trong phễu: ${leadData.status}
- Mức tiền đã nạp: $${leadData.deposit || 0}
- Độ ưu tiên / Tiềm năng: ${leadData.priority || 'Warm'}
- Thẻ phân loại (Tags): ${(leadData.tags || []).join(', ') || 'Chưa có'}
- Ghi chú từ cuộc tư vấn trước: "${leadData.notes || 'Khách hàng mới tiếp cận, chưa có ghi chú thêm'}"

Hãy soạn kịch bản tư vấn và phương án chốt chuyển đổi tối ưu nhất cho khách hàng này!
`;

  return await callGemini(apiKey, prompt, systemInstruction);
}

/**
 * 4. Trợ Lý AI Marketing Hỏi Đáp Tương Tác (Chatbot)
 */
export async function chatWithGeminiAdvisor(apiKey, chatHistory, userMessage, contextSummary) {
  const systemInstruction = `
Bạn là "Gemini Marketing & CRM AI Advisor" - Trợ lý thông minh cao cấp tích hợp trong Meta Report Tool & CRM.
Bạn am hiểu sâu sắc về:
- Quảng cáo Facebook Ads (Meta Ads): Target, Creative, CPM, CTR, CPL, Budget Scaling, A/B Testing.
- Phễu chuyển đổi tiếp thị (Marketing Funnels) và giảm tỉ lệ rơi rụng (Drop-off rate).
- Chỉ số tài chính marketing: CAC, LTV, ROAS, ROI, Net Margin.
- Kỹ thuật Telesales, chăm sóc và nuôi dưỡng Lead CRM.

Dữ liệu tiếp thị thực tế hiện tại của doanh nghiệp người dùng:
${JSON.stringify(contextSummary, null, 2)}

Hãy trả lời trực diện, súc tích, chuyên nghiệp, đưa ra các gợi ý có thể áp dụng được ngay. Sử dụng định dạng markdown với gạch đầu dòng rõ ràng.
`;

  // Format chat context
  const previousTurns = chatHistory
    .slice(-6)
    .map(c => `${c.role === 'user' ? 'Người dùng' : 'Gemini'}: ${c.text}`)
    .join('\n\n');

  const fullPrompt = `${previousTurns ? `Lịch sử hội thoại trước:\n${previousTurns}\n\n` : ''}Người dùng hỏi: ${userMessage}`;

  return await callGemini(apiKey, fullPrompt, systemInstruction);
}

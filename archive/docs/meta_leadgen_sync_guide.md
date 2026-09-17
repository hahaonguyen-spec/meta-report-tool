# Hướng Dẫn Đồng Bộ Leads Từ Facebook Lead Form Xuống CRM

Tài liệu này hướng dẫn chi tiết 3 phương án kết nối và đồng bộ dữ liệu Leads thu thập từ Meta (Facebook/Instagram Lead Ads) về hệ thống CRM.

---

## 1. Phương Án 1: Meta Real-time Webhooks (Khuyên dùng - Chuẩn Doanh Nghiệp)

### Cơ chế hoạt động:
Khi khách hàng bấm Submit Form trên Facebook/Instagram Ads:
1. Meta gửi 1 HTTP POST payload (webhook) đến Webhook Endpoint của CRM backend trong vòng **< 1 giây**.
2. Backend nhận được `leadgen_id` và `page_id`.
3. Backend gọi Graph API: `GET https://graph.facebook.com/v19.0/{leadgen_id}?access_token={PAGE_ACCESS_TOKEN}` để lấy họ tên, số điện thoại, email, câu trả lời form.
4. Backend lưu vào Database CRM và kích hoạt thông báo Real-time (Socket/Zalo/Telegram/Email) cho nhân viên Sales gọi điện trong vòng 5 phút vàng.

### Các bước cấu hình:
1. **Tạo Meta App** trên [developers.facebook.com](https://developers.facebook.com) dạng Business.
2. Thêm sản phẩm **Webhooks**:
   - Chọn đối tượng `Page`.
   - Đăng ký nhận sự kiện `leadgen`.
   - Nhập `Callback URL` (ví dụ: `https://api.yourcrm.com/webhooks/facebook`) và `Verify Token`.
3. **Cấp quyền Access Token**:
   - Page Access Token cần có quyền: `leads_retrieval`, `pages_show_list`, `pages_manage_ads`, `pages_read_engagement`.
4. **Đăng ký Page vào App**:
   - Gọi API: `POST https://graph.facebook.com/v19.0/{PAGE_ID}/subscribed_apps?subscribed_fields=leadgen&access_token={PAGE_ACCESS_TOKEN}`.

---

## 2. Phương Án 2: Graph API Polling (Định kỳ quét Leads mới)

### Cơ chế hoạt động:
- Phù hợp khi hệ thống chưa có public webhook endpoint hoặc môi trường intranet/local.
- Chạy 1 Cron Job định kỳ (mỗi 5 hoặc 10 phút):
  ```http
  GET https://graph.facebook.com/v19.0/{FORM_ID}/leads?filtering=[{'field':'time_created','operator':'GREATER_THAN','value':{LAST_SYNC_TIMESTAMP}}]&access_token={PAGE_ACCESS_TOKEN}
  ```
- Kiểm tra danh sách leads trả về, đối soát xem lead đã tồn tại trong CRM chưa bằng SĐT hoặc `leadgen_id`, nếu chưa thì tạo mới.

---

## 3. Phương Án 3: Sử Dụng Cầu Nối Tự Động Hóa (No-Code: Zapier / Make.com / Google Sheets)

### Quy trình:
1. Tạo kịch bản (Scenario/Zap):
   - **Trigger**: Facebook Lead Ads -> New Lead.
   - **Action**: Gọi CRM Webhook / HTTP Request hoặc ghi vào Google Sheets.
2. CRM định kỳ đồng bộ từ Google Sheets hoặc nhận Webhook trực tiếp từ Make.com.
3. Ưu điểm: Triển khai trong 5 phút, không cần viết backend server webhook phức tạp.

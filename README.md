# Meta Ads Report & Personal CRM System

Hệ thống quản lý báo cáo Meta Ads và CRM tiếp thị / bán hàng cá nhân toàn diện. Hỗ trợ theo dõi hiệu quả quảng cáo, quản lý khách hàng tiềm năng (Leads & Deals), bảng Kanban theo giai đoạn phễu, phân tích CAC/ROI và quản lý phân quyền theo từng Profile.

![Meta Report Tool](https://img.shields.io/badge/Meta%20Ads-Analytics%20%26%20Reporting-0AE5D5?style=for-the-badge&logo=meta)
![Personal CRM](https://img.shields.io/badge/Personal%20CRM-Pipeline%20%26%20Leads-indigo?style=for-the-badge&logo=trello)
![Data Persistence](https://img.shields.io/badge/Data%20Storage-Local%20%26%20GitHub-emerald?style=for-the-badge&logo=github)

---

## 🌟 Tính Năng Nổi Bật

### 1. 🗂️ Hệ Thống CRM Cá Nhân Toàn Diện (Personal CRM Module)
- **Pipeline & Khách Hàng (Leads & Deals)**:
  - **Chế độ Kanban Board**: 6 cột theo từng giai đoạn phễu:
    `Mới tiếp cận` ➔ `Đang tư vấn` ➔ `Đã mở tài khoản` ➔ `Đã nạp tiền` ➔ `Thành công (Won)` ➔ `Hủy / Thất bại`.
    Chuyển giai đoạn 1-click hoặc qua dropdown ngay trên thẻ khách hàng.
  - **Chế độ Bảng Dữ Liệu (Data Table)**: Tìm kiếm nhanh, lọc theo giai đoạn, lọc theo nguồn, lọc theo nhân sự phụ trách.
  - **Quản lý Lead chi tiết**: Họ tên, Số điện thoại, Email, Nguồn (Facebook Form, Website, Zalo, Hotline...), Chiến dịch liên kết, Tiền nạp ($), Người phụ trách, Ghi chú tư vấn.
  - **Tự động đồng bộ từ Ads**: Tạo lead trực tiếp từ các chiến dịch Facebook Instant Form.
  - **Xuất file CSV**: Tải danh sách khách hàng ra file Excel CSV bất cứ lúc nào.

- **Phân Tích Phễu & ROI (CRM Analytics)**:
  - Tỷ lệ chốt đơn (Win Rate %).
  - Doanh thu trung bình trên mỗi khách nạp tiền (ARPU).
  - Chi phí thu hút 1 khách nạp tiền (**CAC** = Tổng Ad Spend / Số khách nạp tiền).
  - Lợi nhuận ròng & ROI thực tế so với chi phí quảng cáo.
  - Biểu đồ phễu chuyển đổi qua từng giai đoạn và Biểu đồ phân bổ nguồn khách hàng.
  - Bảng xếp hạng doanh số & hiệu suất theo từng nhân sự Profile.

- **Hồ Sơ & Phân Quyền (CRM Profiles)**:
  - Quản lý phân quyền: `Admin`, `Media Buyer`, `Client`.
  - Gán tài khoản quảng cáo phụ trách cho từng nhân sự.
  - Chuyển đổi Profile làm việc tức thì từ Header.

---

### 2. 📊 Live Dashboard & Bộ Điều Hành Meta Ads (5/5 Quyền Graph API)
- **⚡ `ads_management` (Điều Hành Chiến Dịch Trực Tiếp)**:
  - **Công tắc Bật / Tắt chiến dịch 1-click (Active / Paused)**: Chuyển đổi trạng thái chiến dịch ngay trên bảng mà không cần vào Facebook Ads Manager.
  - **Đồng bộ ngân sách lên Meta (`⚡ Lên Meta`)**: Chỉnh sửa và đẩy trực tiếp ngân sách ngày/trọn đời lên API.
  - **Tạo chiến dịch nhanh (`+ Tạo Chiến Dịch`)**: Khởi tạo chiến dịch mới với Objective (Leads, Sales, Traffic, Engagement) và ngân sách tùy biến.
- **🏢 `business_management` (Trung Tâm Quản Trị Doanh Nghiệp - BM Hub)**:
  - Quản lý danh mục Portfolio / Business Manager: Trạng thái xác minh doanh nghiệp, tài khoản Ads sở hữu, tài khoản đối tác liên kết và tổng chi tiêu.
  - 1-Click lọc tất cả tài khoản thuộc Business Manager lên Live Dashboard.
- **📈 `ads_read` (Đọc Dữ Liệu & Insights Chuyên Sâu)**:
  - Đọc toàn bộ chiến dịch (kể cả chiến dịch đang tắt để bật lại), chi phí, impressions, clicks, leads, CPM, CTR, ROAS.
- **📄 `pages_show_list` & `pages_read_engagement` (Quản Lý & Phân Tích Fanpage Organic)**:
  - Quản trị toàn bộ Fanpage: Ảnh đại diện, lượt thích, người theo dõi, hạng mục và link trực tiếp.
  - Phân tích tương tác bài viết Organic: Reactions 👍❤️, Comments 💬, Shares 🔁 và tỷ lệ tương tác (Engagement Rate %).
- **🛡️ Bộ Kiểm Tra Quyền Tự Động (Permissions Inspector)**:
  - Tự động gọi `/me/permissions` để kiểm tra và gắn huy hiệu xác nhận 5/5 quyền đã hoạt động.

---

### 3. 💾 Lưu Trữ Dữ Liệu Cá Nhân An Toàn & Bảo Mật
- **Lưu trữ hoàn toàn trên trình duyệt (LocalStorage)**: Toàn bộ Token, cấu hình Webhook, danh sách Lead CRM, Profiles được lưu an toàn trên máy cá nhân của bạn, không gửi qua bất kỳ máy chủ trung gian nào.
- **Sao Lưu (Backup)**: Nút **Backup** trên Header tải về file JSON chứa toàn bộ hệ sinh thái dữ liệu của bạn.
- **Khôi Phục (Restore)**: Tải file JSON lên để phục hồi nguyên vẹn dữ liệu bất kỳ lúc nào.
- **Reset an toàn với CAPTCHA**: Chống xóa nhầm dữ liệu bằng mã xác thực ngẫu nhiên.

---

## 💻 Hướng Dẫn Sử Dụng Trên Máy Cá Nhân (Local)

### 1. Tải về và cài đặt thư viện
```bash
git clone https://github.com/hahaonguyen-spec/meta-report-tool.git
cd meta-report-tool
npm install
```

### 2. Chạy ứng dụng local
```bash
npm run dev
```
Mở trình duyệt tại: `http://localhost:5173`

### 3. Cập nhật mã nguồn và đưa lên GitHub
```bash
git add .
git commit -m "update: personal crm data and settings"
git push origin main
```

---

## 🌐 Triển Khai Lên GitHub Pages

Để xuất bản bản build mới nhất lên GitHub Pages:
```bash
npm run deploy
```
Ứng dụng sẽ tự động build và xuất bản tại địa chỉ GitHub Pages của bạn:
`https://hahaonguyen-spec.github.io/meta-report-tool/`


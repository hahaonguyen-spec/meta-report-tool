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

### 2. 📊 Live Dashboard & Báo Cáo Meta Ads
- **Kết nối Meta Graph API**: Quét đa nguồn tự động từ tài khoản cá nhân (`/me/adaccounts`) và Trình quản lý Doanh nghiệp BM (`/me/businesses`).
- **Thêm tài khoản Ads bằng ID**: Nhập trực tiếp ID tài khoản (ví dụ `act_1234567890`) để xác thực và kết nối ngay.
- **Đồng bộ Google Sheets Webhook**: Đẩy báo cáo tự động sang Google Sheets chỉ với 1 cú click.
- **Báo cáo chuyên sâu**: Phân tích theo ngày, Báo cáo Doanh thu & ROI, Phễu chuyển đổi toàn diện.
- **Organic Fanpages**: Đo lường Reach, Engagement và phân tích định dạng bài viết tốt nhất.

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


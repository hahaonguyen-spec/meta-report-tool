# Thư Mục Lưu Trữ & Backup Hệ Thống (Meta CRM Archive)

Thư mục này được sử dụng để lưu trữ các tài liệu kiến trúc, template mẫu, backup dữ liệu leads và hướng dẫn tích hợp cho hệ thống Meta CRM & Ads Report Tool.

---

## 📁 Cấu Trúc Lưu Trữ

```text
archive/
├── README.md                        # Tài liệu tổng quan về thư mục lưu trữ
├── backups/                         # Thư mục chứa các bản sao lưu dữ liệu Leads, cấu hình
│   └── .gitkeep
├── docs/                            # Tài liệu hướng dẫn kỹ thuật & quy trình
│   ├── meta_leadgen_sync_guide.md   # Hướng dẫn đồng bộ Leads tự động từ Facebook Lead Form
│   └── rbac_permissions_matrix.md   # Ma trận phân quyền RBAC chi tiết
└── templates/                       # Các template mẫu định dạng
    └── leads_import_sample.csv      # File mẫu chuẩn hóa để import leads vào CRM
```

---

## 📑 1. Tài Liệu Kỹ Thuật (Technical Documents)

1. **[Tài liệu đồng bộ Leads từ Facebook Form xuống CRM](docs/meta_leadgen_sync_guide.md)**:
   - Phương thức 1: Meta Real-time Webhooks (Tối ưu nhất - Real-time < 1s).
   - Phương thức 2: Graph API Leadgen Polling (Dễ triển khai, polling định kỳ).
   - Phương thức 3: Kết nối trung gian qua Zapier / Make.com / Pabbly / Google Sheets.

2. **[Bảng Ma Trận Phân Quyền RBAC](docs/rbac_permissions_matrix.md)**:
   - 5 Vai trò: `admin`, `sales_leader`, `sales_rep`, `media_buyer`, `viewer`.
   - 17 Quyền hạn chi tiết cho Leads, Quản lý Ads, Marketing Analytics, Gemini AI Advisor, và Quản trị người dùng.

---

## 📥 2. Mẫu File Import (Templates)

- **`templates/leads_import_sample.csv`**: Mẫu danh sách leads bao gồm đầy đủ các trường: Tên, Số điện thoại, Email, Kênh tiếp cận (Facebook Ads, Google...), Giá trị dự kiến, Sản phẩm quan tâm, và Mã chiến dịch / Post ID.

---

## 🛡️ 3. Lưu Ý Bảo Mật

- **Không** lưu trữ các file chứa Access Token, Secret Key, Service Account, mật khẩu hoặc thông tin PII khách hàng thực tế chưa được mã hóa vào thư mục này.
- Mọi dữ liệu backup nhạy cảm cần được mã hóa trước khi đưa vào kho lưu trữ.

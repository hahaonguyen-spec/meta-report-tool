# Ma Trận Phân Quyền Vai Trò (RBAC Matrix) - Meta CRM

Tài liệu quy định và chuẩn hóa quyền hạn cho từng nhóm người dùng trong hệ thống CRM & Báo cáo Ads.

---

## 1. Danh Sách Các Vai Trò (Roles)

| Mã Vai Trò | Tên Vai Trò | Mục Đích Sử Dụng |
| :--- | :--- | :--- |
| `admin` | Giám Đốc / Quản Trị Viên | Toàn quyền kiểm soát hệ thống, quản lý người dùng, tài chính ads, cấu hình API |
| `sales_leader` | Trưởng Phòng Kinh Doanh | Xem toàn bộ leads, phân bổ lead cho nhân viên, xem báo cáo doanh thu & tỷ lệ chốt |
| `sales_rep` | Nhân Viên Tư Vấn (Telesale) | Chỉ xem và xử lý các leads được giao cho mình, cập nhật giai đoạn & ghi chú tư vấn |
| `media_buyer` | Chuyên Viên Chạy Ads | Xem và điều khiển quảng cáo (Bật/Tắt/Ngân sách), xem hiệu quả bài post, tối ưu CPL |
| `viewer` | Khách / Đối Tác Quan Sát | Chỉ xem tổng quan dạng Read-Only, không thể chỉnh sửa dữ liệu hoặc xem PII |

---

## 2. Bảng Ma Trận Quyền Hạn Chi Tiết

| Nhóm Quyền | Mã Quyền | Admin | Sales Leader | Sales Rep | Media Buyer | Viewer |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: |
| **Quản Lý Leads** | `leads:view_all` | ✅ | ✅ | ❌ *(Chỉ xem lead được giao)* | ❌ | ❌ |
| | `leads:view_assigned` | ✅ | ✅ | ✅ | ❌ | ✅ *(Read-only)* |
| | `leads:view_sensitive` *(SĐT, Email)* | ✅ | ✅ | ✅ | ❌ *(Che mờ)* | ❌ *(Che mờ)* |
| | `leads:create` | ✅ | ✅ | ✅ | ❌ | ❌ |
| | `leads:edit` | ✅ | ✅ | ✅ | ❌ | ❌ |
| | `leads:change_stage` | ✅ | ✅ | ✅ | ❌ | ❌ |
| | `leads:assign` *(Chia lead)* | ✅ | ✅ | ❌ | ❌ | ❌ |
| | `leads:export` *(Tải file CSV)* | ✅ | ✅ | ❌ | ❌ | ❌ |
| | `leads:delete` | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Quản Lý Ads** | `ads:view_reports` | ✅ | ✅ | ❌ | ✅ | ✅ |
| | `ads:view_spend` *(Chi phí quảng cáo)* | ✅ | ❌ | ❌ | ✅ | ❌ |
| | `ads:control` *(Bật/Tắt/Đổi budget)* | ✅ | ❌ | ❌ | ✅ | ❌ |
| | `ads:view_creatives` *(Xem bài post)* | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Báo Cáo Phân Tích** | `analytics:view` *(CAC, ROAS, Funnel)*| ✅ | ✅ | ❌ | ✅ | ❌ |
| **Trí Tuệ Nhân Tạo** | `ai:use_strategic_audit` | ✅ | ❌ | ❌ | ✅ | ❌ |
| | `ai:use_pitch_generator` | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Hệ Thống** | `system:manage_users` | ✅ | ❌ | ❌ | ❌ | ❌ |
| | `system:manage_api_keys` | ✅ | ❌ | ❌ | ❌ | ❌ |

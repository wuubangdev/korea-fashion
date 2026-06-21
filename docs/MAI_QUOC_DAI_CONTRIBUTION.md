# Phạm vi công việc của Mai Quốc Đại

## Bằng chứng từ lịch sử Git

- Thành viên trong `README.md`: Mai Quốc Đại.
- Danh tính Git cục bộ: `Mong Tuan <quocdai@gmail.com>`.
- Commit trực tiếp: `98b48b9` — `frontend update`, ngày 27/05/2026.
- Commit này thuộc cả `origin/main` và `origin/user-storefront-ui`.

Các file được thêm hoặc sửa trong commit:

- `apps/kf_fe/src/app/page.tsx`: trang chủ khách hàng.
- `apps/kf_fe/src/app/products/page.tsx`: danh sách, tìm kiếm và lọc sản phẩm.
- `apps/kf_fe/src/app/products/[id]/page.tsx`: chi tiết sản phẩm.
- `apps/kf_fe/src/app/cart/page.tsx`: giỏ hàng.
- `apps/kf_fe/src/app/checkout/page.tsx`: đặt hàng và kết nối API đơn hàng.
- `apps/kf_fe/src/components/ProductCard.tsx`: thẻ sản phẩm tái sử dụng.
- `apps/kf_fe/src/components/StoreHeader.tsx`: điều hướng cửa hàng.
- `apps/kf_fe/src/components/StoreFooter.tsx`: chân trang cửa hàng.
- `apps/kf_fe/yarn.lock` và `apps/kf_fe/package-lock.json`: dữ liệu khóa thư viện tại thời điểm commit.

## Cách trình bày trung thực

Các file trên đã được các thành viên khác tiếp tục phát triển sau commit `98b48b9`. Vì vậy nên nói:

> Tôi tham gia xây dựng phiên bản storefront ban đầu, tập trung vào hành trình xem sản phẩm, thêm giỏ hàng và đặt hàng. Sau khi tích hợp, nhóm tiếp tục mở rộng các file này với xác thực, yêu thích, SEO, thanh toán và các API mới.

Không nên nhận toàn bộ phiên bản hiện tại là phần cá nhân, vì lịch sử Git cho thấy có các commit tiếp nối của nhóm.

## Bảo trì trên nhánh báo cáo

Nhánh `mai-quoc-dai/storefront-maintenance-report` chỉ:

- gom quy tắc phí vận chuyển và tính tổng đơn vào hàm dùng chung;
- loại bỏ số cấu hình bị lặp giữa giỏ hàng và checkout;
- sửa định dạng code bị lệch;
- bổ sung tài liệu phạm vi công việc và checklist kiểm thử.

Các thay đổi này không chủ đích sửa UI, URL, dữ liệu gửi API hoặc quy trình người dùng.

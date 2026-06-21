# Checklist kiểm thử storefront

## Kiểm thử tự động

Chạy từ `apps/kf_fe`:

```bash
corepack yarn install --frozen-lockfile
corepack yarn lint
corepack yarn build
```

Chạy backend từ `apps/kf_be`:

```bash
./mvnw -B -ntp test
```

## Kiểm thử thủ công

- Trang chủ tải đủ hero, bộ sưu tập và danh sách sản phẩm.
- Bộ lọc sản phẩm cập nhật đúng danh sách và URL.
- Trang chi tiết hiển thị ảnh, giá, biến thể và đánh giá.
- Thêm, tăng, giảm và xóa sản phẩm trong giỏ hàng.
- Đơn dưới ngưỡng miễn phí vẫn có phí giao hàng mặc định.
- Đơn từ 1.000.000đ được miễn phí giao hàng.
- Coupon giảm giá và coupon miễn phí giao hàng cho ra đúng tổng tiền.
- Checkout gửi đúng sản phẩm, thông tin khách, phương thức giao/nhận và phí.
- Đăng nhập, yêu thích, lịch sử đơn và theo dõi đơn vẫn hoạt động.
- Kiểm tra responsive ở kích thước mobile, tablet và desktop.

## Tiêu chí hồi quy cho lần refactor này

- Không thay đổi nội dung trực quan ngoài cách `Intl.NumberFormat` hiển thị cùng ngưỡng 1.000.000 VND.
- Cùng `subtotal`, số sản phẩm, phí cơ bản và coupon phải cho cùng `shippingFee`.
- Tổng thanh toán vẫn bằng `max(subtotal - discount, 0) + shippingFee`.

# Tan Thanh Cinema — ASP.NET Core MVC

**Sinh viên:** Nguyễn Phan Tấn Thành  
**MSSV:** 31241022712  
**Website triển khai:** http://ptudw31241022712tt.somee.com

## 1. Giới thiệu

Tan Thanh Cinema là website bán vé phim trực tuyến được xây dựng cho bài tập cá nhân môn Phát triển ứng dụng thương mại điện tử. Website được cá nhân hóa theo phong cách điện ảnh hiện đại, hỗ trợ quản lý phim/thể loại, tải poster, giỏ hàng và đặt vé.

## 2. Công nghệ sử dụng

- ASP.NET Core MVC (.NET 10)
- Entity Framework Core + SQL Server
- ASP.NET Core Identity
- Razor Views, Bootstrap 5, CSS tùy biến
- Session cho giỏ hàng
- SMTP Gmail App Password để gửi email xác nhận
- Somee.com để lưu trữ website và SQL Server

## 3. Chức năng chính

- Đăng ký, đăng nhập và xác nhận tài khoản.
- CRUD phim và thể loại.
- Kiểm tra dữ liệu nhập: ngày phát hành, giá, xếp hạng và thể loại.
- Upload poster phim; tự dùng ảnh mặc định khi chưa chọn ảnh.
- Hiển thị danh sách phim dạng thẻ (card) responsive.
- Giỏ hàng theo Session: thêm, tăng số lượng, xóa và tính tổng tiền.
- Checkout: lưu hóa đơn, chi tiết hóa đơn và thông tin nhận vé vào SQL Server.
- Gửi email xác nhận đơn hàng.
- Triển khai website lên Somee.

## 4. Cấu trúc thư mục

```text
ASP-CORE/
├── SourceCode/              # Mã nguồn ASP.NET Core MVC
│   ├── Controllers/
│   ├── Data/
│   ├── Extension/
│   ├── Migrations/
│   ├── Models/
│   ├── Validation/
│   ├── Views/
│   ├── wwwroot/
│   ├── Program.cs
│   └── appsettings.example.json
├── Report/
│   └── images/              # Ảnh minh chứng cho báo cáo
└── README.md
```

## 5. Cài đặt và chạy dự án

1. Cài .NET SDK 10 và SQL Server/SQL Server Management Studio hoặc extension **SQL Server (mssql)** trên VS Code.
2. Mở terminal tại `ASP-CORE/SourceCode`.
3. Tạo file `appsettings.json` từ `appsettings.example.json`, sau đó điền chuỗi kết nối SQL Server và Gmail App Password của riêng bạn. **Không đưa file này lên GitHub.**
4. Khôi phục package và cập nhật CSDL:

```powershell
dotnet restore
dotnet ef database update
```

5. Chạy dự án:

```powershell
dotnet run --launch-profile https
```

6. Mở URL HTTPS mà terminal hiển thị, sau đó vào `/Movies`.

## 6. Lưu ý bảo mật

- Repository không lưu mật khẩu SQL Server, Gmail App Password, connection string thật hoặc dữ liệu cá nhân.
- Các thư mục `bin`, `obj`, `publish` và file tạm được loại trừ bằng `.gitignore`.
- Khi chụp ảnh báo cáo, cần làm mờ email, địa chỉ, số điện thoại và mật khẩu.

## 7. Minh chứng triển khai

- Website Somee: http://ptudw31241022712tt.somee.com
- Ảnh chụp quá trình thực hiện được lưu tại `Report/images`.

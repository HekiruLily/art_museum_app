# Artist App

Ứng dụng di động hiển thị danh sách nghệ sỹ và tác phẩm của họ từ Bảo tàng Metropolitan Museum of Art.

## Tính năng

- 📱 Hiển thị danh sách các nghệ sỹ nổi tiếng
- 🔍 Tìm kiếm nghệ sỹ theo tên
- 🎨 Xem portfolio tác phẩm của mỗi nghệ sỹ
- 📖 Thông tin chi tiết về nghệ sỹ và số lượng tác phẩm

## API

Ứng dụng sử dụng [Metropolitan Museum of Art Collection API](https://metmuseum.github.io/)

## Cách chạy

1. Cài đặt dependencies:
```bash
npm install
```

2. Chạy ứng dụng:
```bash
npm start
```

3. Chọn platform để chạy:
- Nhấn `a` để chạy trên Android
- Nhấn `i` để chạy trên iOS
- Nhấn `w` để chạy trên web

## Cấu trúc dự án

```
artist-app/
├── src/
│   ├── screens/
│   │   ├── HomeScreen.js              # Màn hình danh sách nghệ sỹ
│   │   └── ArtistDetailScreen.js      # Màn hình chi tiết nghệ sỹ
│   ├── components/
│   │   └── ArtistCard.js              # Component card hiển thị nghệ sỹ
│   └── services/
│       └── api.js                     # Service gọi API Met Museum
├── App.js                              # Root component với navigation
└── package.json
```

## Nghệ sỹ nổi tiếng

Ứng dụng hiển thị các nghệ sỹ nổi tiếng:
- Vincent van Gogh
- Pablo Picasso
- Claude Monet
- Leonardo da Vinci
- Rembrandt
- Johannes Vermeer
- Michelangelo
- Paul Cézanne
- Edgar Degas
- Pierre-Auguste Renoir

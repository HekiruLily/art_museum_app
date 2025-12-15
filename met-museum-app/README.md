# Met Museum App

Ứng dụng React Native Expo để khám phá bộ sưu tập nghệ thuật của Bảo tàng Metropolitan Museum of Art.

## Tính năng

- 🎨 Tìm kiếm tác phẩm nghệ thuật từ Met Museum API
- 🏛️ Lọc theo phòng ban (Department)
- 📱 Giao diện với LinearGradient đẹp mắt
- ❤️ Nút yêu thích với Icons8
- 📝 Mô tả chi tiết với nhiều thông tin
- 🖼️ Xem hình ảnh chất lượng cao

## Cài đặt

```bash
npm install
```

## Chạy ứng dụng

```bash
# Chạy trên Android
npx expo start --android

# Chạy trên iOS
npx expo start --ios

# Chạy trên web
npx expo start --web
```

## Công nghệ sử dụng

- React Native
- Expo SDK 54
- React Navigation
- expo-linear-gradient
- Met Museum Collection API

## Cấu trúc thư mục

```
met-museum-app/
├── src/
│   ├── components/
│   │   └── ArtworkCard.js
│   ├── screens/
│   │   ├── HomeScreen.js
│   │   └── DetailScreen.js
│   └── services/
│       └── api.js
├── App.js
└── package.json
```

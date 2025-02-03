import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Import các pages && component cần thiết
import NavBar from "./components/NavBar";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";

// Import các store để quản lý trạng thái (state) của ứng dụng
import { useAuthStore } from "./store/useAuthStore";
import { useThemeStore } from "./store/useThemeStore";

// Import các thành phần UI và thư viện hỗ trợ
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";

const App = () => {
  // Lấy theme từ store
  const { theme } = useThemeStore();

  // Lấy các giá trị và hàm từ store quản lý xác thực (auth)
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  // Sử dụng useEffect để kiểm tra xác thực người dùng khi component được mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Hiển thị loading spinner nếu đang trong quá trình kiểm tra xác thực và chưa có thông tin người dùng
  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    // Thiết lập theme cho toàn bộ ứng dụng
    <div data-theme={theme}>
      {/* Hiển thị thanh điều hướng (NavBar) */}
      <NavBar />

      {/* Định nghĩa các route (đường dẫn) của ứng dụng */}
      <Routes>
        {/* Route chính (HomePage) - Chỉ cho phép truy cập nếu đã đăng nhập */}
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to="/login" />}
        />

        {/* Route đăng ký (SignUpPage) - Chỉ cho phép truy cập nếu chưa đăng nhập */}
        <Route
          path="/signup"
          element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
        />

        {/* Route đăng nhập (LoginPage) - Chỉ cho phép truy cập nếu chưa đăng nhập */}
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
        />

        {/* Route cài đặt (SettingsPage) - Cho phép truy cập mà không cần xác thực */}
        <Route path="/settings" element={<SettingsPage />} />

        {/* Route hồ sơ (ProfilePage) - Chỉ cho phép truy cập nếu đã đăng nhập */}
        <Route
          path="/profile"
          element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
        />
      </Routes>

      {/* Hiển thị thông báo (toast) khi cần */}
      <Toaster />
    </div>
  );
};

export default App;
import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client" // Tạo ra socket instance

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : "/";

// set: Dùng để cập nhật state
// get: Dùng để truy cập vào state hiện tại
export const useAuthStore = create((set, get) => ({
  // authUser: Lưu trữ thông tin của người dùng (trừ password)
  authUser: null,

  // Cập nhật trạng thái loading để theo dõi tiến trình của các hành động: đăng ký, đăng nhập, cập nhật profile
  isSigningUp: false,
  isLoggingUp: false,
  isUpdatingProfile: false,

  // onlineUsers: Lưu trữ danh sách các users đang online
  onlineUsers: [],

  // socket: Lữu trữ kết nối socket.io
  socket: null,

  // isCheckingAuth: Trạng thái kiểm tra xác thực người dùng khi ứng dụng khởi chạy
  isCheckingAuth: true,

  // Hàm kiểm tra xác thực người dùng
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });

      // Kết nối socket nếu người dùng đã đăng nhập
      get().connectSocket();
    } catch (error) {
      console.log("Error in checkAuth", error);
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  // Hàm đăng ký người dùng mới
  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully!");

      // Kết nối socket khi người dùng đăng ký thành công
      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isSigningUp: false });
    }
  },

  // Hàm đăng nhập
  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully");

      // Kết nối socket nếu người dùng đăng nhập thành công
      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },
  
  // Hàm cập nhật ngày tháng năm sinh
  updateDate: async (data) => {
    try {
      const res = await axiosInstance.put("/auth/update-date", data);
      set({ authUser: res.data });
      toast.success("Date of birth updated successfully")
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  // Hàm cập nhật ảnh đại diện
  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set ({ authUser: res.data })
      toast.success("Profile updated successfully")
    } catch (error) {
      console.log("Error in update profile: ", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  // Logout
  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      
      // Xoá thông tin người dùng khỏi state
      set({ authUser: null });
      toast.success("Logged out successfully");

      // Ngắt kết nối socket khi đăng xuất
      get().disconnectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  // connect(), connected, disconnect()

  // Hàm kết nối socket
  connectSocket: () => {
    const { authUser } = get();
    // Nếu người dùng chưa đăng nhập hoặc socket đã kết nối thì return
    if (!authUser || get().socket?.connected) return;

    // Xuống đến đây là chưa kết nối socket() => Thiết lập kết nối

    // io(BASE_URL): Hàm io từ thư viện socket.io-client dùng để khởi tạo kết nối WebSocket đến server tại địa chỉ BASE_URL.
    // query: { userId: authUser._id }: Gửi thêm thông tin userId trong query string để server biết người dùng nào đang kết nối
    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id,
      },
    });
    // Connect socket
    socket.connect();

    // Lưu socket instance vào state zustand để cho phép truy cập vào quản lý socket từ bất cứ đâu trong ứng dụng
    set({ socket: socket });
    console.log(socket);

    // Lắng nghe sự kiện "getOnlineUsers" từ server để cập nhật danh sách người dùng online
    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds })
    });
  },

  // Hàm ngắt kết nối socket
  disconnectSocket: () => {
    // Nếu socket đang kết nối thì ngắt kết nối
    if (get().socket?.connected) return get().socket.disconnect();
  },
}));

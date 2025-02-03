import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

// get: lấy trạng thái hiện tại của store
export const useChatStore = create((set, get) => ({
  // List các tin nhắn (chứa đầy đủ cả id, message, v.v.), ex: [{…}, {…}, {…}]
  messages: [],
  users: [],

  // Người dùng hiện tại trả về tất cả thông tin nhé
  selectedUser: null,

  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/message/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  // Hàm lấy tin nhắn giữa 2 users
  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/message/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  // Hàm gửi tin nhắn
  sendMessage: async (messageData) => {
    // Biết vì sao có selectedUser ở đây không => Lấy id để gọi API
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(
        `/message/send/${selectedUser._id}`,
        messageData
      );
      // Cơ bản thì tạo một mảng mới trong đó copy hết list các message cũ và thêm res.data tức message mới vào cuối
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  // Đăng ký lắng nghe sự kiện newMessage từ socket để nhận tin nhắn mới
  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser =
        newMessage.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;

      set({
        messages: [...get().messages, newMessage],
      });
    });
  },
  // Hủy đăng ký lắng nghe tin nhắn mới
  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },

  // Tức là cập nhật từ null -> selectedUser
  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));

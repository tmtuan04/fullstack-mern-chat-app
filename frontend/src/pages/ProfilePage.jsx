import React, { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Upload, User, Mail, Calendar } from "lucide-react";
import { checkDate, formatDate } from "../lib/DateTime";

const ProfilePage = () => {
  // Bước đầu tiên
  const {
    authUser,
    isUpdatingProfile,
    updateProfile,
    updateDate
  } = useAuthStore();
  const [selectedImg, setSelectedImage] = useState(null);

  const [dateOfBirth, setDateOfBirth] = useState(authUser.dateOfBirth || "");

  // Hàm check DateOfBirth
  const handleDateChange = async (value) => {
    setDateOfBirth(value);
    if (checkDate(value)) {
      await updateDate({ dateOfBirth: value });
    }
  };

  const handleImageUpload = async (e) => {
    // e.target.files: chứa danh sách các file mà người dùng đã chọn
    const file = e.target.files[0];

    // file: lastModified, lastModifiedDate, size, type: image/jpeg, ...
    if (!file) return;

    // FileReader là một API của trình duyệt dùng để đọc nội dung của file
    const reader = new FileReader();
    // Đọc nội dung của file và chuyển nó sang chuỗi base64
    reader.readAsDataURL(file);

    // reader.onload được gọi khi FileReader hoàn tất việc đọc file.
    reader.onload = async () => {
      // Đã test API Oke, result: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAA
      const base64Image = reader.result;

      setSelectedImage(base64Image);

      // Truyền thế này mới hợp lệ trong API PUT
      await updateProfile({ profilePic: base64Image });
    };
  };

  return (
    <div className="m-h-screen pt-20">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold ">Profile</h1>
            <p className="mt-2">Your profile information</p>
          </div>

          {/* avatar upload section */}

          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              {/* Tại sao lại có 3 trường hợp: chưa có ảnh, đã upload từ trước (authUser.profilePic), ảnh vừa cập nhật (selectedImage) */}
              <img
                src={selectedImg || authUser.profilePic || "/avatar.png"}
                alt="Profile"
                className="size-32 rounded-full object-cover border-4 "
              />
              <label
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-0 right-0 
                  bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200
                  ${
                    isUpdatingProfile ? "animate-pulse pointer-events-none" : ""
                  }
                `}
              >
                <Upload className="w-5 h-5 text-base-200" />
                {/* This restricts the file types that can be uploaded to image files only (any format of images, such as PNG, JPEG, etc.). */}
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            <p className="text-sm text-zinc-400 font-medium">
              {isUpdatingProfile
                ? "Uploading..."
                : "Click the upload icon to update your photo"}
            </p>
          </div>

          {/* Full Name, Email Address, Date of birth */}

          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="text-sm font-medium text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                {/* ?. optional chaining, nếu là null hoặc undefined nó sẽ trả về undefined thay vì báo lỗi */}
                {authUser?.fullName}
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="text-sm font-medium text-zinc-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                {authUser?.email}
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="text-sm font-medium text-zinc-400 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Date of birth (dd-mm-yyyy)
              </div>
              <input
                value={dateOfBirth}
                type="text"
                className="px-4 py-2.5 bg-base-200 rounded-lg border w-full"
                placeholder="dd-mm-yyyy"
                onChange={(e) => handleDateChange(e.target.value)}
              />
            </div>
          </div>

          {/* Account Information */}
          <div className="mt-6 bg-base-300 rounded-xl p-6">
            <h2 className="text-lg font-medium  mb-4">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Member Since</span>
                <span>{formatDate(authUser?.createdAt)}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Account Status</span>
                <span className="text-green-500 font-bold">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

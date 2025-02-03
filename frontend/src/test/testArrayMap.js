// Tạo một mảng có 9 phần tử

// Nếu bạn chỉ dùng ...Array(9) mà không đặt trong dấu ngoặc vuông [ ], JavaScript sẽ báo lỗi vì ... không thể hoạt động một mình:
const array = [...Array(9)]; 

// const array = Array(9); // [ <9 empty items> ]
// Vì các phần tử không tồn tại, bạn không thể sử dụng trực tiếp các phương thức lặp như .map(), .forEach(), v.v., mà không gặp lỗi.

console.log("Mảng ban đầu: ", array); // [undefined, .., undefined]
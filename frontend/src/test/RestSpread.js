// Sử dụng Rest để tách riêng các thuộc tính.
// Sử dụng Spread để gộp các thuộc tính khi truyền dữ liệu.

// Dữ liệu mẫu
const user = {
  name: "John Doe",
  age: 28,
  email: "john@example.com",
  role: "Admin",
};

// Sử dụng Rest để tách giá trị
// { name, age, ...rest } dùng để tách name, age ra khỏi user và còn lại gộp vào rest
function logUserInfo({ name, age, ...rest }) {
  console.log(`Name: ${name}`);
  console.log(`Age: ${age}`);
  console.log("Other info:", rest);
}

logUserInfo(user);
// Name: John Doe
// Age: 28
// Other info:
// (2) {email: "john@example.com", role: "A...}

// Sử dụng Spread để gộp các thuộc tính
const additionalInfo = { address: "123 Main St", phone: "123-456-7890" };
const fullUserInfo = { ...user, ...additionalInfo };

console.log("Full user info:", fullUserInfo);
// Full user info: (6) {name: "John Doe", age: 28, email: "...}
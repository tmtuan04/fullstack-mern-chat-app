import jwt from 'jsonwebtoken'

export const generateToken = (userId, res) => {
    // jwt.sign(payload, secret, options)
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {
        expiresIn: "1d"
    });

    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // ms
        httpOnly: true, // Prevent XSS attacks cross-site scripting attacks
        sameSite: "strict", // Cookie chỉ được gửi khi yêu cầu đến từ cùng một miền, giúp bảo vệ khỏi tấn công CSRF (Cross-Site Request Forgery).
        secure: process.env.NODE_ENV !== "development", // Phần secure trong cookie được thiết lập để đảm bảo rằng cookie chỉ được gửi qua kết nối HTTPS
    });

    return token;
}
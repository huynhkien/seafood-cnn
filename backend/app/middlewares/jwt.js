const jwt = require('jsonwebtoken');

// Hàm tạo access token
const generateAccessToken = (uid, role) => {
    // Tạo một JWT mới với payload chứa user ID và vai trò
    // Token được ký bằng khóa bí mật lưu trong biến môi trường JWT_SECRET
    // Token này sẽ hết hạn sau 7 ngày
    return jwt.sign({_id: uid, role}, process.env.JWT_SECRET, {expiresIn: '7d'});
}

// Hàm tạo refresh token
const generateRefreshToken = (uid) => {
    // Tạo một JWT mới với payload chỉ chứa user ID
    // Token được ký bằng khóa bí mật lưu trong biến môi trường JWT_SECRET
    // Token này sẽ hết hạn sau 7 ngày
    return jwt.sign({_id: uid}, process.env.JWT_SECRET, {expiresIn: '7d'});
}
module.exports = {
    generateAccessToken,
    generateRefreshToken
}

const notFound = (req, res, next) => {
    const error = new Error(`Route ${req.originalUrl} not found`);
    res.status(404);
    next(error); // Gọi next để chuyển đối tượng lỗi đến middleware lỗi
}

const errorHandler = (error, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    return res.status(statusCode).json({
        success: false,
        message: error.message 
    })
}

module.exports = {
    notFound,
    errorHandler 
}

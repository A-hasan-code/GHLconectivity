const jwt = require('jsonwebtoken');
const User = require('../models/user.models')
exports.isAuthentication = async (req, res, next) => {
    const token = req.cookies.token
    console.log(token)
    if (!token) {
        return res.status(401).json({
            success: false, message: " unauthorized"
        });

    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = await User.findByPk(decoded.id)
        next()
    } catch (error) {
        return res.status(401).json({
            success: false, message: "Unauthorized"
        })
    }
}
exports.isAdmin = (user_type) => {
    return (req, res, next) => {
        if (req.user && req.user.user_type === user_type) {
            return next();
        }
        return res.status(403).json({ success: false, message: "Forbidden" });
    };
}
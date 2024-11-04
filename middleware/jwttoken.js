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
exports.isAdmin = (user_types) => {
    return (req, res, next) => {
        console.log("User Type:", req.user.user_type, "Expected Types:", user_types);

        if (user_types.includes(req.user.user_type)) {
            console.log("Access granted for user type:", req.user.user_type);
            return next();
        }

        console.log("Access denied for user type:", req.user.user_type);
        return res.status(403).json({ success: false, message: "Forbidden" });
    };
}

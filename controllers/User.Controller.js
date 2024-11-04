const User = require('../models/user.models')
const sendToken = require('../utils/SendToken')
const ErrorHandler = require('../utils/Errorhandler');
const catchAsyncError = require('../middleware/catchAsyncError')
const { userCreateSchema } = require('../Validations/User.Validation')

exports.create = catchAsyncError(
    async (req, res, next) => {
        const { error } = userCreateSchema.validate(req.body)
        if (error) {
            return next(new ErrorHandler(error.details[0].message, 400));
        }
        const { username, password, email, phone_number, first_name, last_name, } = req.body;

        // Trim whitespace from inputs
        const trimmedEmail = email.trim("");

        // Check if the user already exists
        const existingUser = await User.findOne({ where: { email: trimmedEmail } });
        if (existingUser) {
            return next(new ErrorHandler("Email already exists", 400));
        }
        const user = await User.create({
            username,
            first_name, last_name,
            email,
            password,
            phone_number,


        });

        // Send token and response
        sendToken(user, 201, res);
    }
)
exports.login = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
        return next(new ErrorHandler("Please provide all fields!", 400));
    }

    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
        return next(new ErrorHandler("Invslid User", 400));
    }

    // Trim password to remove any whitespace
    const trimmedPassword = password.trim();
    const isMatch = await user.comparePassword(trimmedPassword);
    if (!isMatch) {
        return next(new ErrorHandler("Invalid credentials", 400));
    }

    // Use the sendToken utility function
    sendToken(user, 200, res);
});
exports.Getuser = catchAsyncError(async (req, res, next) => {
    // Check if the user is authenticated and is either an admin or superadmin
    if (!req.user || (!req.user.isAdmin && !req.user.isSuperAdmin)) {
        return next(new ErrorHandler("Not authorized to access this resource", 403));
    }

    // Fetch users from the database
    const users = await User.findAll({
        where: {
            id: {
                [Op.ne]: req.user.id // Exclude the requesting user
            }
        }
    });

    res.status(200).json({ success: true, users });
});
exports.getUserById = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;

    // Check if the user is authenticated and is either an admin or superadmin
    if (!req.user || (!req.user.isAdmin && !req.user.isSuperAdmin)) {
        return next(new ErrorHandler("Not authorized to access this resource", 403));
    }

    // Fetch the user from the database
    const user = await User.findByPk(id);
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    res.status(200).json({ success: true, user });
});
exports.updateUser = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    const { username, email, phone_number, first_name, last_name, user_type } = req.body;

    // Check if the user is authenticated and is either an admin or superadmin
    if (!req.user || (!req.user.isAdmin && !req.user.isSuperAdmin)) {
        return next(new ErrorHandler("Not authorized to access this resource", 403));
    }

    // Check if the user exists
    const user = await User.findByPk(id);
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    // Update user details
    await user.update({
        username,
        email,
        phone_number,
        first_name,
        last_name,
        user_type
    });

    res.status(200).json({ success: true, user });
});
exports.updateUserStatus = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    const { status } = req.body; // Assume status is sent in the request body

    // Check if the user is authenticated and is either an admin or superadmin
    if (!req.user || (!req.user.isAdmin && !req.user.isSuperAdmin)) {
        return next(new ErrorHandler("Not authorized to access this resource", 403));
    }

    // Check if the user exists
    const user = await User.findByPk(id);
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    // Update user status
    await user.update({ status });

    res.status(200).json({ success: true, message: "User status updated successfully" });
});
exports.updateUserRole = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    const { user_type } = req.body; // Assume user_type is sent in the request body

    // Check if the user is authenticated and is either an admin or superadmin
    if (!req.user || (!req.user.isAdmin && !req.user.isSuperAdmin)) {
        return next(new ErrorHandler("Not authorized to access this resource", 403));
    }

    // Check if the user exists
    const user = await User.findByPk(id);
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    // Update user role
    await user.update({ user_type });

    res.status(200).json({ success: true, message: "User role updated successfully" });
});


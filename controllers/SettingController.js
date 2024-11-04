const ErrorHandler = require('../utils/Errorhandler');
const catchAsyncError = require('../middleware/catchAsyncError');
const Setting = require('../models/Setting');

// Create setting
exports.createSetting = [
    catchAsyncError(async (req, res, next) => {
        const { id: user_id } = req.user;
        const keys = Array.isArray(req.body.key) ? req.body.key : [];
        const values = Array.isArray(req.body.value) ? req.body.value : [];

        // Check if an image is uploaded and append its path
        if (req.file) values.push(req.file.path);

        // Validate required fields
        if (!user_id) return next(new ErrorHandler("User ID is required", 400));
        if (!keys.length) return next(new ErrorHandler("At least one key is required", 400));

        const createdSettings = [];

        // Create settings
        const settingPromises = keys.map((key, index) => {
            if (!key) return Promise.reject(new ErrorHandler("Key is required", 400));

            const value = values[index] ?? null;
            const type = value && typeof value === 'string' && value.includes('uploads') ? 'file' : 'text';

            const settingData = {
                user_id,
                key,
                value,
                type,
                created_at: new Date(),
                updated_at: new Date(),
            };

            return Setting.create(settingData).then(createdSetting => {
                createdSettings.push(createdSetting);
            });
        });

        try {
            await Promise.all(settingPromises);
        } catch (error) {
            console.error("Error creating setting:", error);
            return next(new ErrorHandler("Error creating setting", 500));
        }

        return res.status(201).json({
            success: true,
            message: 'Settings created successfully',
            data: createdSettings,
        });
    }),
];



// Get all settings
exports.getSettings = catchAsyncError(async (req, res, next) => {
    try {
        const settings = await Setting.find(); // Use find() for MongoDB

        return res.status(200).json({
            success: true,
            data: settings,
        });
    } catch (error) {
        console.error("Error retrieving settings:", error); // Log error for debugging
        return next(new ErrorHandler("Error retrieving settings", 500));
    }
});

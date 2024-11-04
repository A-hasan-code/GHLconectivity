const ErrorHandler = require('../utils/Errorhandler');
const catchAsyncError = require('../middleware/catchAsyncError');
const Setting = require('../models/Setting');

// Create setting
exports.createSetting = [
    catchAsyncError(async (req, res, next) => {
        console.log('Request Body:', req.body);
        console.log('Uploaded File:', req.file);

        const user_id = req.user.id;
        const keys = req.body.key || []; // Expect an array of keys
        const values = req.body.value || [];
        let finalValues = [...values]; // Copy values array to modify it

        // Check if an image is uploaded
        if (req.file) {
            finalValues.push(req.file.path); // Add image path to the values

        }

        // Validate required fields
        if (!user_id) {
            return next(new ErrorHandler("User ID is required", 400));
        }
        if (!Array.isArray(keys) || !Array.isArray(finalValues)) {
            return next(new ErrorHandler("Keys and values must be arrays", 400));
        }

        const createdSettings = []; // Store successfully created settings

        // Loop through keys and finalValues and store them one by one
        for (let i = 0; i < Math.max(keys.length, finalValues.length); i++) {
            const key = keys[i]; // Get corresponding key
            const value = finalValues[i]; // Get corresponding value

            // Check if key is provided
            if (!key) {
                return next(new ErrorHandler("Key is required", 400));
            }

            // Initialize setting data
            const settingData = {
                user_id,
                key,
                value: value !== undefined ? value : null, // Use value or null if not defined
                // type: value ? 'text' : 'file', // Set type based on the key
                created_at: new Date(),
                updated_at: new Date(),
            };
            console.log(settingData)
            try {
                const createdSetting = await Setting.create(settingData); // Store each setting one by one
                createdSettings.push(createdSetting); // Collect created settings
            } catch (error) {
                console.error("Error creating setting:", error); // Log the error for debugging
                return next(new ErrorHandler("Error creating setting", 500));
            }
        }

        return res.status(201).json({
            success: true,
            message: 'Settings created successfully',
            data: createdSettings, // Optionally return created settings
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

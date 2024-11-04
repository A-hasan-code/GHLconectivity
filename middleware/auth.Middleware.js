const Token = require('../models/Token');

async function checkToken(req, res, next) {
    const userId = 'Location'; // Adjust based on your logic
    const token = await Token.findOne({ where: { user_id: userId } });

    if (!token) {
        return res.status(401).json({ error: 'Token not found' });
    }

    // Check if the access token is expired
    if (new Date() >= new Date(token.expires_at)) {
        // Refresh the token if expired
        try {
            await authController.refreshAccessToken(userId);
        } catch (error) {
            return res.status(401).json({ error: error.message });
        }
    }

    req.accessToken = token.access_token; // Store access token for further use
    next();
}

module.exports = checkToken;

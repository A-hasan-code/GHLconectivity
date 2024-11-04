const axios = require('axios');
const qs = require('qs');
const Token = require('../models/Token');
const config = require('../config/config.json');

async function initiateAuth(req, res) {
    const redirectUri = "http://localhost:3000/api/callback";
    const url = `${config.ghl.baseUrl}/oauth/chooselocation?response_type=code&redirect_uri=${redirectUri}&client_id=${config.ghl.clientId}&scope=calendars.readonly campaigns.readonly contacts.readonly`;
    return res.redirect(url);
}

async function callback(req, res) {
    const data = qs.stringify({
        'client_id': config.ghl.clientId,
        'client_secret': config.ghl.clientSecret,
        'grant_type': 'authorization_code',
        'code': req.query.code,
        'user_type': 'Location',
        'redirect_uri': 'http://localhost:3000/api/callback'
    });

    const configAxios = {
        method: 'post',
        url: 'https://services.leadconnectorhq.com/oauth/token',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: data
    };

    try {
        const response = await axios.request(configAxios);
        const { access_token, refresh_token, locationId, companyId, userType, userId, expires_in } = response.data;

        console.log(response.data);
        const expiresAt = new Date(Date.now() + expires_in * 1000);

        // Find the existing token for the user
        const existingToken = await Token.findOne({ where: { user_id: userId } });

        if (existingToken) {
            // Update the existing token
            await Token.update({
                user_type: userType,
                company_id: companyId,
                location_id: locationId, // Adjust as needed
                access_token,
                refresh_token,
                expires_at: expiresAt
            }, {
                where: { user_id: userId }
            });
        } else {
            // Store the new tokens
            await Token.create({
                user_type: userType,
                company_id: companyId,
                location_id: locationId, // Adjust as needed
                access_token,
                refresh_token,
                user_id: userId,
                ghl_user_id: userId,
                expires_at: expiresAt
            });
        }

        return res.json({ data: response.data });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}


async function refreshAccessToken(res) {
    const token = await Token.findOne({ where: { locationId: "jcs2ScLxbuIEMjoYMEfX" } });

    if (!token) {
        throw new Error('Token not found');
    }

    const data = qs.stringify({
        'client_id': config.ghl.clientId,
        'client_secret': config.ghl.clientSecret,
        'grant_type': 'refresh_token',
        'refresh_token': token.refresh_token,
        'user_type': 'Location',
        'redirect_uri': 'http://localhost:3000/api/callback'
    });

    const configAxios = {
        method: 'post',
        url: 'https://services.leadconnectorhq.com/oauth/token',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: data
    };

    try {
        const response = await axios.request(configAxios);
        const { access_token, expires_in } = response.data;

        const expiresAt = new Date(Date.now() + expires_in * 1000);

        // Update the access token
        await Token.update(
            { access_token, expires_at: expiresAt },
            { where: { locationId: "jcs2ScLxbuIEMjoYMEfX" } }
        );
        console.log(response.data)
        return res.json({ data: response.data });
    } catch (err) {
        throw new Error('Failed to refresh access token: ' + err.message);
    }
}

module.exports = { initiateAuth, callback, refreshAccessToken };

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/oauth/initiate', authController.initiateAuth);
router.get('/callback', authController.callback);
router.get('/accesstoken', authController.refreshAccessToken)
module.exports = router;

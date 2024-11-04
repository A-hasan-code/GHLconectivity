const express = require('express');
const router = express.Router();
const { create, login, Getuser, getUserById, updateUser, updateUserStatus, updateUserRole } = require('../controllers/User.Controller');
const { isAuthentication, isAdmin } = require('../middleware/jwttoken');

// User registration (only superadmins can access this route)
router.post('/create', isAuthentication, create);

// User login
router.post('/login', login);

// Get all users (excluding the requester)
router.get("/user", isAuthentication, isAdmin('admin', 'superadmin'), Getuser);

// Get user by ID
router.get("/user/:id", isAuthentication, isAdmin('admin', 'superadmin'), getUserById);

// Update user
router.put("/user/:id", isAuthentication, isAdmin('admin', 'superadmin'), updateUser);

// Update user status
router.patch("/user/:id/status", isAuthentication, isAdmin('admin', 'superadmin'), updateUserStatus);

// Update user role
router.patch("/user/:id/role", isAuthentication, isAdmin('admin', 'superadmin'), updateUserRole);

module.exports = router;

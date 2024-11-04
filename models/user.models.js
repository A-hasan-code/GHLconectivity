const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
class User extends Model {
    // Method to check if the provided password matches the hashed password
    async comparePassword(password) {
        return await bcrypt.compare(password, this.password);
    }
    getJwtToken() {
        return jwt.sign({ id: this.id }, process.env.JWT_SECRET, { expiresIn: '90d' });
    }
}

// Initialize the User model
User.init({
    id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
    },
    username: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    first_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    last_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    location_id: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    company_id: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    ghl_user_id: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    ghl_api_key: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    added_by: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: '1',
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    phone_number: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    email_verified_at: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    user_type: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: 'company',
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: 'pending',
    },
    remember_token: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: true,
    }
}, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

// Hash the password before saving the user
User.beforeCreate(async (user) => {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
});

module.exports = User;

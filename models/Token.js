const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

class Token extends Model { }

Token.init({
    user_id:{
        type: DataTypes.STRING,
        allowNull: false
    },
    user_type: {
        type: DataTypes.STRING,
        allowNull: false
    },
    access_token: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    refresh_token: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    company_id: {
        type: DataTypes.STRING,
        allowNull: false
    },
    location_id: {
        type: DataTypes.STRING,
        allowNull: false
    },
    ghl_user_id: {
        type: DataTypes.STRING,
        allowNull: false
    },
    expires_at: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Token',
    tableName: 'tokens',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
});

module.exports = Token;

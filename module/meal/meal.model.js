
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db.config');
const Item = require('../item/item.model');


const Meal = sequelize.define('Meal', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    dayOfWeek: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

module.exports = Meal;

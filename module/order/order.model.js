const { DataTypes, UUID } = require('sequelize');
const sequelize = require('../../config/db.config');
const User = require('../user/user.model');
const Meal = require('../meal/meal.model');


const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    UserId: {
        type: DataTypes.UUID,
        references: {
            model: User,
            key: 'id',
        },
    },
    MealId: {
        type: DataTypes.INTEGER,
        references: {
            model: Meal,
            key: 'id',
        },
    },
    orderDay: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    no_meal: {
        type: DataTypes.BOOLEAN,
        defaultValue: false, 
    },
});

Order.belongsTo(User, { foreignKey: 'UserId' });
User.hasMany(Order, { foreignKey: 'UserId' });

Order.belongsTo(Meal, { foreignKey: 'MealId' });
Meal.hasMany(Order, { foreignKey: 'MealId' });

module.exports = Order;

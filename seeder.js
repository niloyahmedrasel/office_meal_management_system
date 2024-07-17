// seeder.js
const sequelize = require('./config/db.config');
const Meal = require('./module/meal/meal.model');
const Item = require('./module/item/item.model');
const User = require('./module/user/user.model');
const Order = require('./module/order/order.model');


Meal.belongsToMany(Item, { through: 'MealItem' });
Item.belongsToMany(Meal, { through: 'MealItem' });

Order.belongsToMany(Item, { through: 'OrderItem' });
Item.belongsToMany(Order, { through: 'OrderItem' });

User.hasMany(Order, { foreignKey: 'UserId' });
Order.belongsTo(User, { foreignKey: 'UserId' });


const syncDatabase = async () => {
    try {
        await sequelize.sync({ force:false });
        console.log('Database synced successfully');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

syncDatabase();

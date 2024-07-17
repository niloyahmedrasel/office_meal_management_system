const { DataTypes, UUIDV4 } = require('sequelize');
const sequelize = require('../../config/db.config');
const Order = require('./order.model');
const Item = require('../item/item.model');

const OrderItem = sequelize.define('OrderItem', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: UUIDV4,
    },
    OrderId: {
        type: DataTypes.INTEGER,
        references: {
            model: Order,
            key: 'id',
        },
    },
    ItemId: {
        type: DataTypes.UUID,
        references: {
            model: Item,
            key: 'id',
        },
    },
});

OrderItem.belongsTo(Order, { foreignKey: 'OrderId' });
Order.hasMany(OrderItem, { foreignKey: 'OrderId' });

OrderItem.belongsTo(Item, { foreignKey: 'ItemId' });
Item.hasMany(OrderItem, { foreignKey: 'ItemId' });

module.exports = OrderItem;

const {DataTypes, UUIDV4} = require('sequelize')
const sequelize = require('../../config/db.config');
const Category = require('../category/category.model')
const Meal = require('../meal/meal.model')



const Item = sequelize.define('Item',{
    id:{
        type:DataTypes.UUID,
        primaryKey:true,
        defaultValue:UUIDV4
    },
    item_name:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    category_id:{
        type:DataTypes.INTEGER,
        references:{
            model:Category,
            key:'id'
        }
    }
});

Category.hasMany(Item,{foreignKey:'category_id'});
Item.belongsTo(Category,{foreignKey:'category_id'});

module.exports = Item;
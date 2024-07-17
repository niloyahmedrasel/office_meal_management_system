const {DataTypes}= require('sequelize')
const sequelize = require('../../config/db.config')

const Category = sequelize.define('Category',{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
    },
    category_name:{
        type:DataTypes.STRING,
        allowNull:false,
    },
});
module.exports = Category
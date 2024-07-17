const User = require('../user/user.model')
const bcrypt = require('bcrypt')
const Category = require('../category/category.model')
const Item = require('../item/item.model')
const Meal = require('../meal/meal.model')
const { Op } = require('sequelize');
const OrderItem = require('../order/orderItem.model')
const Order = require('../order/order.model')

const createAdmin = async(req,res) =>{
    const hashPassword = await bcrypt.hash('admin123',10)
    try{
        const admin = await User.create({
            name:'admin',
            email:'admin@example.com',
            password:hashPassword,
            role: 'admin'

        })
        res.status(201).json({admin})

    }catch (err){   
        res.status(500).json({message:'internal server error'})
    }
}

const banUser = async(req, res) => {
    const id = req.params.id
    try{
        const user = await User.findByPk(id)

        if(!user){
            return res.status(404).json({message:'user not found'})
        }
        if(user.isBanned){
            return res.status(403).json({message:'user is already banned',user:user})
        }

        user.isBanned = true;
        await user.save();
        res.status(200).json({message:'user is banned'})

    } catch (err){
        console.log(err)
        res.status(500).json({message:'internal server error'})
    }
}

const getItems = async(req, res) => {
    const result = await Item.findAll({
        include: {
            model: Category,
            attributes: ['category_name'],
          },
    })
    res.send(result)
}

const addUser = async(req, res) => {
    const {name,email,password,role} = req.body
    const hashPassword = await bcrypt.hash(password,10)
    try{
        const user = await User.create({
        email: email,
        password: hashPassword,
        role: role,
        name: name
    })
        res.status(201).json({message:'successfully added user',user:user})
    } catch (err){
        console.log(err)
        res.status(500).json({message:'internal server error',})
    }
}

const addCategoryAndItem = async (req, res) =>{
    const { category_name, items } = req.body;
    try{
        const category = await Category.create({
          category_name: category_name
        })
  
        const createdItems = await Promise.all(items.map((item)=>{
          return Item.create({item_name:item,category_id:category.id})
        }));
        res.status(201).json({category, items:createdItems})
  
    }catch (err){
          console.log(err)
         res.status(500).json({err:'failed to create category and items'});
        }
}

const createMeal = async (req, res) => {
    const { dayOfWeek, items } = req.body;

    // Validate constraints
    if (items.length < 3) {
        return res.status(400).json({ message: 'A meal must have at least 3 items.' });
    }

    try {
        
        const itemDetails = await Item.findAll({
            where: { id: items },
            include: {
                model: Category,
                attributes: ['category_name']
            }
        });

        const categoryNames = itemDetails.map(item => item.Category.category_name);
        const hasRice = categoryNames.includes('starch');
        const proteinCount = categoryNames.filter(name => name === 'protein').length;

        if (!hasRice) {
            return res.status(400).json({ message: 'A meal must have a rice item to be complete.' });
        }
        if (proteinCount > 1) {
            return res.status(400).json({ message: 'A meal cannot have two protein sources at a time.' });
        }

        const existingMeals = await Meal.findAll({
            where: {
                dayOfWeek,
                id: {
                    [Op.in]: items
                }
            }
        });

        if (existingMeals.length >= 2) {
            return res.status(400).json({ message: 'The same meal can only be repeated a maximum of two days in a week.' });
        }

        const meal = await Meal.create({ dayOfWeek });
        await meal.addItems(items);
        res.status(201).json(meal);
    } catch (error) {
        console.error('Error creating meal:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
};

const getOrdersForAdmin = async (req, res) => {
    try {
        const orders = await Order.findAll({
            include: [
                {
                    model: User,
                    attributes: ['id', 'name'],
                },
                {
                    model: Item,
                    through: {
                        model: OrderItem,
                        attributes: []
                    },
                    attributes: ['id', 'item_name', 'category_id'],
                },
                {
                    model: Meal,
                    attributes: ['dayOfWeek'],
                }
            ],
        });
        res.status(200).json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};




module.exports = {
    createAdmin,
    banUser,
    addUser,
    addCategoryAndItem,
    getItems,
    createMeal,
    getOrdersForAdmin
}
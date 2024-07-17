const User = require('./user.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Meal = require('../meal/meal.model')
const Order = require('../order/order.model')
const OrderItem = require('../order/orderItem.model')
const Item = require('../item/item.model')

const register = async(req,res) => {
        const {name,email,password} = req.body
        const hashPassword = await bcrypt.hash(password,10)
    try{
        
        const user = await User.create({
        name: name,
        email: email,
        password: hashPassword,
    })
        res.send(user)

    }catch (error){
        console.log(error)
    }
    
}

const login = async(req, res) => {
    const {email,password} = req.body

    try{
        const user = await User.findOne({
            where:{
                email: email
            }
        })
        if(!user) {
            return res.status(401).json({message:'invalid email'})
        }
        const isMatched = await bcrypt.compare(password, user.password)

        if(user.isBanned) {
            return res.status(403).json({message:'you have been banned',user:user})
        }

        if(!isMatched) {
            res.status(401).json({message:'invalid password'})
        }

        const accessToken = jwt.sign({ id: user.id, role: user.role }, 'jwt-secret', {
            expiresIn: '1h',
          });
        res.cookie('access_token', accessToken, { httpOnly: true, signed: true });
        res.status(200).json({ accessToken ,user:user});

    }catch (error) {
        console.error(error)
        res.status(500).json({message:'internal server error'})
    }
}

const profile = async(req,res) => {
    try {
        const token = req.signedCookies['access_token']

        if(!token) {
           return res.send('bad request')
         }
        
        const payload = jwt.verify(token,'jwt-secret')
        const {id} = payload
    
        const user = await User.findOne({
            where: {
                id: id,
            }
        })
    
        if (user) {
            res.send(user)
        }
        else {
            res.send('user not found')
        }
    }
    catch(err) {
        res.send('internal server error: ' + err)
        console.log(err)
    }
}

const logOut = (req, res) => {
    res.clearCookie('access_token')
    res.send('log out')
}

const createOrder = async (req, res) => {
    const { UserId, MealId, orderDay, Items, no_meal } = req.body;

    console.log(req.body); 

    try {
        const user = await User.findOne({
            where: {
                id: UserId,
            }
        });

        const meal = await Meal.findOne({
            where: {
                id: MealId,
            }
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (!meal) {
            return res.status(404).json({ error: 'Meal not found' });
        }

        const order = await Order.create({
            UserId,
            MealId,
            orderDay,
            no_meal 
        });

        
        if (!no_meal) {
            await Promise.all(Items.map(item =>
                OrderItem.create({
                    OrderId: order.id,
                    ItemId: item.ItemId,
                })
            ));
        }

        res.status(201).json({ message: 'Order created successfully', order });
    } catch (error) {
        console.error(error); 
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};

const getWeeklyMealSchedule = async (req, res) => {
    try {
        const meals = await Meal.findAll({
            include: [
                {
                    model: Item,
                    through: { attributes: [] }
                }
            ]
        });
        res.status(200).json(meals);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};

const getUserOrders = async (req, res) => {
    try {
        const userId = req.params.userId; 

        const orders = await Order.findAll({
            where: { UserId: userId },
            include: [
                {
                    model: Item,
                    through: { attributes: [] },
                },
                {
                    model: Meal,
                    attributes: ['dayOfWeek',],
                },
            ],
        });

        if (orders.length > 0) {
            res.json(orders);
        } else {
            res.status(404).send('No orders found for this user');
        }
    } catch (err) {
        res.status(500).send('Internal server error: ' + err);
        console.log(err);
    }
};

module.exports = {
    register,
    login,
    profile,
    logOut,
    createOrder,
    getWeeklyMealSchedule,
    getUserOrders
    
}
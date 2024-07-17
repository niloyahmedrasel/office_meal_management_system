const express = require('express')
const router = express.Router()
const {register,login, profile, logOut, createOrder, getWeeklyMealSchedule,getMeals, getUserOrders} = require('./user.controller')
const authenticateToken = require('../../middlewares/authMiddleware')

router.post('/register', register)
router.post('/login', login)
router.get('/profile',authenticateToken, profile)
router.post('/logout', logOut)
router.post('/createOrder', createOrder)
router.get('/getMeals', getWeeklyMealSchedule)
router.get('/getOrders/:userId', getUserOrders)

module.exports = router;
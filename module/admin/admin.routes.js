const express = require('express');
const router = express.Router()
const authenticateToken = require('../../middlewares/authMiddleware')
const { createAdmin, banUser, addUser, addCategoryAndItem, createMeal, getItems, getOrdersForAdmin } = require('./admin.controller');

router.post('/create',createAdmin);
router.patch('/ban/:id',authenticateToken,banUser);
router.post('/addUser',authenticateToken,addUser);
router.post('/addItem',authenticateToken,addCategoryAndItem);
router.post('/createMeal',authenticateToken,createMeal);
router.get('/getItem',authenticateToken,getItems);
router.get('/getOrderItem',authenticateToken,getOrdersForAdmin);


module.exports = router;
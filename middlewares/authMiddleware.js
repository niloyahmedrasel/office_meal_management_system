const jwt = require('jsonwebtoken');
const User = require('../module/user/user.model');

const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
    console.log('No token provided');
    return res.sendStatus(401); 
    }

    jwt.verify(token, 'jwt-secret', async (err, user) => {
    if (err) {
      console.log('Invalid token');
      return res.sendStatus(403); 
    }
    console.log('Decoded User:', user);

    const authenticatedUser = await User.findByPk(user.id);
    if (!authenticatedUser) {
      console.log('User not found');
      return res.sendStatus(404);
    }

    req.user = authenticatedUser;
    next();
  });
};

module.exports = authenticateToken;

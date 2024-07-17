const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cookieParser = require('cookie-parser')
const userRouter = require('./module/user/user.routes')
const adminRouter = require('./module/admin/admin.routes');
require('./seeder');
const cors = require('cors')

app.use(cors())
app.use(express.json());
app.use(cookieParser('jwt-secret'));
app.use('/api/user', userRouter);
app.use('/api/admin', adminRouter);

app.get('/', (req, res) =>{
    res.send('app is running')
})

app.listen(port, ()=>{
    console.log('listening on port', port)
})


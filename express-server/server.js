// === Requirements config ====
const express = require('express');
const morgan = require('morgan')
const mongoose = require('mongoose')
const cors = require('cors')
const app = express();
const PORT = process.env.PORT || 4000;
// === End of Requirements config ====

// === App.use() Config
require('dotenv').config();
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());
app.use('/uploads', express.static('uploads'))
// === End of App.use() Config

// === Routes 
const driversRoutes = require('./api/routes/driversRoutes')
const ordersRoutes = require('./api/routes/ordersRoutes')
const restaurantsRoutes = require('./api/routes/restaurantsRoutes')
const usersRoutes = require('./api/routes/usersRoutes')
// === End of Routes 

mongoose.connect(
    'mongodb+srv://mongo:' + process.env.MONGO_ATLAS_PW + '@cluster0.kxpu2.mongodb.net/deliveryca?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
)
mongoose.Promise = global.Promise;

// Before any Routes, we send headers
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

app.use('/drivers', driversRoutes)
app.use('/orders', ordersRoutes)
app.use('/restaurants', restaurantsRoutes)
app.use('/users', usersRoutes)

// if we reach here (after above 2 routes, means no routes were able to handle the request)
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404; //404 error by definition is no fitting route
    next(error); //forward the error request
})

const db = mongoose.connection;
db.once("open", () => {
    app.listen(PORT, () => {
        console.log(`Server started at http://localhost:${PORT}`);
    })
})

module.exports = app;
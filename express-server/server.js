const express = require('express');
const morgan = require('morgan')
const mongoose = require('mongoose')
const cors = require('cors')

const app = express();

const PORT = process.env.PORT || 4000;

require('dotenv').config();
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());
app.use('/uploads', express.static('uploads'))

const multer = require('multer');
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + file.originalname);
    }
});
// fileFilter param for multer
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true); //accept file
    } else {
        cb(null, false); //reject file
    }
}
// upload.single
const upload = multer({
    storage: storage, 
    limits: {
        fileSize: 1024 * 1024 * 10 //5mb
    },
    fileFilter: fileFilter
});

mongoose.connect(
    'mongodb+srv://mongo:' + process.env.MONGO_ATLAS_PW + '@cluster0.kxpu2.mongodb.net/deliveryca?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
)
mongoose.Promise = global.Promise;

// Schema
var validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};
const userSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: {
        type: String, 
        trim: true,
        lowercase: true,
        unique: true,
        required: 'Email address is required',
        validate: [validateEmail, 'Please fill a valid email address'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    name: {type: String, required: true},
    password: {type: String, required: true},
    phone: {type: Number, required: true},
    address: {type: String, required: true}
})
const User = mongoose.model('User', userSchema);
// ===
const restSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type: String, required: true},
    email: {
        type: String, 
        trim: true,
        lowercase: true,
        unique: true,
        required: 'Email address is required',
        validate: [validateEmail, 'Please fill a valid email address'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    menu: [{
        item: String,
        price: String,
        picture: String
    }],
    phone: {type: Number, required: true},
    address: {type: String, required: true},
    resBanner: {type: String, required: false}
})
const Restaurant = mongoose.model('Restaurant', restSchema);
// ===
const orderSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    orderNum: 0,
    restaurantId: {type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true},
    customerId:  {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    items: [{
        item: String,
        quantity: String
    }],
    orderStatus: {type: String}
}) //https://masteringjs.io/tutorials/mongoose/array
const Order = mongoose.model('Order', orderSchema);
// ===
const drivSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type: String, required: true},
    email: {
        type: String, 
        trim: true,
        lowercase: true,
        unique: true,
        required: 'Email address is required',
        validate: [validateEmail, 'Please fill a valid email address'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    phone: {type: Number, required: true}
})
const Driver = mongoose.model('Driver', drivSchema);

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

/*
* ======
* Routes google.com
        
* ======
*/
app.get('/', (req, res) => {
    Restaurant.find().exec()
    .then(docs => {
        res.status(200).json({
            count: docs.length,
            restaurants: docs.map(doc => {
                return {
                    name: doc.name,
                    email: doc.email,
                    menu: doc.menu,
                    resBanner: doc.resBanner,
                    phone: doc.phone,
                    address: doc.address,
                    resBanner: doc.resBanner
                }
            })
        })
    })
    .catch(err => res.status(500).json({error: err}))
})

// Login route only for Users
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({email}).exec()
    if (!user || user.password !== password) {
        res.status(403).json({
            message: 'invalid login' 
        })
        return;
    } 
    res.status(200).json({
        message: 'Log in successful!'
    })
})

// Register route only for Users
app.post('/registerUser', async (req, res) => {
    const { email, name, password, phone, address } = req.body;

    if (await User.findOne({email}).exec()) {
        res.status(500).json({
            message: 'Registration invalid'
        })
        return;
    } else {
        const user = new User({
            _id: new mongoose.Types.ObjectId(),
            email: email,
            name: name,
            password: password,
            phone: phone,
            address: address
        });
        user.save()
            .then(result => {
                console.log(result);
                res.status(200).json({
                    message: 'User created successfully',
                    createdUser: {
                        _id: result._id,
                        email: result.email,
                        name: result.name,
                        password: result.password,
                        phone: result.phone,
                        address: result.address
                    }
                })
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({error: err})
            });
    }
})

// Register route only for Drivers
app.post('/registerDriver', async (req, res) => {
    const { name, email, phone } = req.body;

    if (await Driver.findOne({email}).exec()) {
        res.status(500).json({
            message: 'Registration invalid (ex)'
        })
        return;
    } else {
        const driver = new Driver({
            _id: new mongoose.Types.ObjectId(),
            name: name,
            email: email,
            phone: phone
        });
        driver.save()
            .then(result => {
                console.log(result);
                res.status(200).json({
                    message: 'Driver created successfully',
                    createdDriver: {
                        _id: result._id,
                        name: result.name,
                        email: result.email,
                        phone: result.phone
                    }
                })
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({error: err})
            });
    }
})

// Driver submitting orderId after delivering
app.post('/orders/:orderId', async (req, res) => {
    orderId = req.params.orderId;
    console.log(orderId)
    res.status(200)
})

// Restaurant creation
app.post('/registerRestaurant', upload.single('resBanner'), async (req, res) => {
    const { name } = req.body;
    if (await Restaurant.findOne({name}).exec()) {
        res.status(500).json({
            message: 'Restaurant already exists with this name... please check!'
        })
        return;
    } else {
        const restaurant = new Restaurant({
            _id: new mongoose.Types.ObjectId(),
            name: req.body.name,
            email: req.body.email,
            menu: [req.body.menu],
            phone: req.body.phone,
            address: req.body.address,
            resBanner: req.file.path
        })
        restaurant.save()
            .then(result => {
                console.log(result);
                res.status(200).json({
                    message: 'Restaurant created successfully',
                    createdDriver: {
                        _id: result._id,
                        name: result.name,
                        email: result.email,
                        menu: result.menu,
                        phone: result.phone,
                        address: result.address,
                        resBanner: result.resBanner
                    }
                })
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({error: err})
            });
    }
    

})

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
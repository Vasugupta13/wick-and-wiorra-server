
//PACKAGES
const express = require('express');
const mongoose = require('mongoose');

//IMPORTING ROUTES
const authRouter = require('./routes/auth');
const adminRouter = require('./routes/admin');
const productRouter = require('./routes/product');
const userRouter = require('./routes/user');
const phonePeRouter = require('./routes/phonePe_pg');
const cartRouter = require('./routes/cart');
const addressRouter = require('./routes/address');
//INITIALIZING EXPRESS
const app = express();
const port = 3000;
const DB = 'mongodb+srv://Vasu13:vasu1234@cluster0.dnz0cyz.mongodb.net/?retryWrites=true&w=majority';

//MIDDLEWARE
app.use(express.json()); 
app.use(authRouter);
app.use(adminRouter);
app.use(productRouter);
app.use(userRouter);
app.use(phonePeRouter);
app.use(cartRouter);
app.use(addressRouter)

//CONNECTING TO MONGODB
mongoose.connect(DB).then(()=>{
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.log(err);
});


app.listen(port, () => console.log(`Server listening on port ${port}!`));


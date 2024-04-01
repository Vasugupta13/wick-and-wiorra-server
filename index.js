
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

//CONNECTING TO MONGODB
mongoose.connect(DB).then(()=>{
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.log(err);
});


app.listen(port, () => console.log(`Server listening on port ${port}!`));

//CREATING AN API 
// app.get('/hello-world', (req, res) => {
//     res.json({'hi': 'Hello World'});
// });
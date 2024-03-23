
const express = require('express'); 
const User = require('../models/user');
const bcryptjs = require('bcryptjs');
const authRouter = express.Router();
const jwt = require('jsonwebtoken'); 
const auth = require('../middlewares/auth');

authRouter.post('/admin/signup',async (req, res) => {
   try{
      const { name, email, password, type } = req.body;
      const existingUser = await User.findOne({email});
      if(existingUser){
         return res.status(400).json({message: 'User already exists'});
      }
     const hashPassword = await bcryptjs.hash(password, 8);
      let user = new User ({
         name,
         email,
         password: hashPassword,
         type,
      })
      user = await user.save();
      res.json(user);

   }catch(err){
      res.status(500).json({error: err.message});
   }
  
});

//Signin Route

authRouter.post('/admin/signin', async (req, res) => {
   try{
      const { email, password } = req.body;
      const user = await User.findOne({email});
      if(!user){
         return res.status(400).json({message: 'User does not exist'});
      }
      const isMatch = await bcryptjs.compare(password, user.password);
      if(!isMatch){
         return res.status(400).json({message: 'Invalid credentials'});
      }
     const token = jwt.sign({id: user._id}, "passwordKey");
     res.json({token, ...user._doc});
   }catch(err){
      res.status(500).json({error: err.message});
   }
});

authRouter.post('/tokenIsValid', async (req, res) => {
   try{
      const token = req.header("x-auth-token");
      if(!token){
         return res.json(false);
      }  
      const verified = jwt.verify(token, "passwordKey");
      if(!verified){
         return res.json(false);
      }
      const user = await User.findById(verified.id);
      if(!user){
         return res.json(false);
      }
      res.json(true);
   }catch(err){
      res.status(500).json({error: err.message});
   }
});
authRouter.get('/',auth, async (req, res) => {
   const user = await User.findById(req.user);
   res.json({...user._doc,token: req.token});  });

module.exports = authRouter;
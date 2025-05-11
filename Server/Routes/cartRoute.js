import express from 'express'
import authUser from '../Middlewares/authUser.js';
import { updateCart } from '../Controllers/cartController.js';


const cartRouter=express.Router();
cartRouter.post('/update',authUser,updateCart)

export default cartRouter;
import express from "express"
import { isSellerAuth, sellerLogin, sellerLogout } from "../Controllers/sellerController.js";
import authSeller from "../Middlewares/authSeller.js";

const sellerRouter=express.Router();

sellerRouter.post('/login',sellerLogin);
sellerRouter.get('/is-auth',authSeller, isSellerAuth);
sellerRouter.post('/logout',sellerLogout);


export default sellerRouter;
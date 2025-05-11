import express from 'express'
import { upload } from '../config/multer.js';
import authSeller from '../Middlewares/authSeller.js';
import { addProduct, changeStock, productById, productList } from '../Controllers/productController.js';
const productRouter=express.Router();

productRouter.post('/add',upload.array('images',4),authSeller,addProduct)


productRouter.get('/list',productList)
productRouter.get('/:id',productById)

productRouter.post('/stock',authSeller,changeStock)

export default productRouter
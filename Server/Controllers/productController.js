// add product :/api/product/add 
import {v2 as cloudinary} from 'cloudinary'
import product from '../Models/Product.js'
export const addProduct=async (req,res)=>{
try{
    let productData=JSON.parse(req.body.productData)
    const images=req.files

    let imagesUrl=await Promise.all(
        images.map(async(item)=>{
            let result=await cloudinary.uploader.upload(item.path,{resource_type:'image'});
            return result.secure_url
        })
    )
    await product.create({...productData,image:imagesUrl})
    res.json({success:true,message:'product Added'})
}catch(error){
    console.log(error.message)
    res.json({success:false,message:error.message})
}

}


// get product:/api/product/list 
export const productList=async(req,res)=>{

    try{
        const products=await product.find({})
        res.json({success:true,products})
    }catch(error){
        console.log(error.message)
        res.json({success:false,message:error.message})
    }

}



// get single product :/api/product/id 
export const productById=async(req,res)=>{

    try{
        const {id}=req.params; 
        const Product=await product.findById(id);
        res.json({success:true,Product})
    }catch(error){
        console.log(error.message)
        res.json({success:false,message:error.message})
    }

}


// change product instock :/api/product/stock 

export const changeStock=async(req,res)=>{

    try{
        const{id,inStock}=req.body
        await product.findByIdAndUpdate(id,{inStock})
        res.json({success:true,message:'changed the stock'})
    }catch(error){
        console.log(error.message)
        res.json({success:false,message:error.message})
    }

}
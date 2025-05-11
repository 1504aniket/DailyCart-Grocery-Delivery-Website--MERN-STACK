// Register user :/api/user/registration
import User from "../Models/User.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
export const register=async(req,res)=>{
    try{
        const{name,email,password}=req.body;
        if(!name||!email||!password){
            return res.json({success:false,message:'Missing Details'})
        }
        const exisitngUser=await User.findOne({email})
        if(exisitngUser){
            return res.json({success:false,message:"user already exists"})
        }

const hashedPassword=await  bcrypt.hash(password,10)
const user=await User.create({name,email,password:hashedPassword})

const token=jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'5d'});
res.cookie('token',token,{
    httponly:true,
    secure:false,
    sameSite:'lax'
    ,
    maxAge:5*24*60*60*1000,  
})

return res.json({success:true,user:{email:user.email,name:user.name}})

    }catch(error){
        console.log(error.message);
        res.json({success:false,message:error.message})
    }
}


// Login user:/api/user/login
export const login=async(req,res)=>{
    try{
        const {email,password}=req.body;
        if(!email||!password){
            return res.json({success:false,message:'Email and password are required'});

        }
        const user=await User.findOne({email});
        if(!user){
            return res.json({success:false,message:'Invalid email or password'})
        }
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.json({success:false,message:"invalid email or password"})

        }
        const token=jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'5d'});
res.cookie('token',token,{
    httponly:true,
    secure:process.env.NODE_ENV==='production',
    sameSite:process.env.NODE_ENV==='production'?'none':'strict',
    maxAge:5*24*60*60*1000,  
})

return res.json({success:true,user:{email:user.email,name:user.name}})



    
}catch(error){
    console.log(error.message);
    res.json({success:false,message:error.message});
}
}


// check auth:/api/user/is-auth

export const isAuth=async(req,res)=>{
    try{
        const{userId}=req.user;
        const user=await User.findById(userId).select('-password')
        return res.json({success:true,user})
    }catch(err){
        console.log(err.message)
        res.json({success:false,message:err.message})
    }
}






// Logout
export const logout=async(req,res)=>{

    try{
    res.clearCookie('token',{
        httponly:true,
        secure:process.env.NODE_ENV==='production',
        sameSite:process.env.NODE_ENV==='production'?'none':'strict',
    })
    return res.json({success:true,message:"logged out"})
}catch(err){
    res.json({success:false,message:err.message})

}
}
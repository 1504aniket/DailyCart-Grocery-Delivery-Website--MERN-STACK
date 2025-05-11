import jwt from 'jsonwebtoken'
export const sellerLogin=async(req,res)=>{
    const{email,password}=req.body;

   try{ if(password===process.env.SELLER_PASSWORD&& email===process.env.SELLER_EMAIL){
        const token=jwt.sign({email},process.env.JWT_SECRET,{expiresIn:'5d'});

        res.cookie('sellertoken',token,{
            httponly:true,
            secure:process.env.NODE_ENV==='production',
            sameSite:process.env.NODE_ENV==='production'?'none':'strict',
            maxAge:5*24*60*60*1000,  
        })

        return res.json({success:true,message:"Logged In"})
    }else{
        return res.json({success:false,message:'invalid credentials'})
    }
}catch(err){
    console.log(err.message);
    res.json({success:false,message:err.message})
}
}

export const isSellerAuth=async(req,res)=>{
    try{
        
        
        return res.json({success:true})
    }catch(err){
        console.log(err.message)
        res.json({success:false,message:err.message})
    }
}


export const sellerLogout=async(req,res)=>{

    try{
    res.clearCookie('sellertoken',{
        httponly:true,
        secure:process.env.NODE_ENV==='production',
        sameSite:process.env.NODE_ENV==='production'?'none':'strict',
    })
    return res.json({success:true,message:"logged out"})
}catch(err){
    res.json({success:false,message:err.message})

}
}
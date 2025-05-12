import cookieParser from "cookie-parser";
import 'dotenv/config';
import express from "express";
import cors from 'cors';
import connectDB from "./config/db.js";
import userRouter from "./Routes/userRoutes.js";
import sellerRouter from "./Routes/sellerRoutes.js";
import connectCloudinary from "./config/cloudinary.js";
import productRouter from "./Routes/productRoute.js";
import cartRouter from "./Routes/cartRoute.js";
import addressRouter from "./Routes/addressRoute.js";
import orderRouter from "./Routes/orderRoute.js";
import { stripewebhooks } from "./Controllers/orderController.js";
const app=express();
const port=process.env.PORT||4000;
await connectDB()
await connectCloudinary()

// Allow multiple origins
const allowedorigins=['https://localhost:5173','https://dailycartfrontend.vercel.app',  /\.vercel\.app$/ ]


app.post('/stripe',express.raw({type:'application/json'}),stripewebhooks)


// Middleware configs
app.use(express.json());
app.use(cookieParser());
// app.use(cors({origin:allowedorigins,credentials:true}))
app.use(cors({
    origin: function (origin, callback) {
      if (!origin || allowedorigins.some(o =>
        typeof o === 'string' ? o === origin : o.test(origin)
      )) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS: " + origin));
      }
    },
    credentials: true
  }));
  


  
 
  
 

app.get('/',(req,res)=>{
    res.send("API is Working");
}
)

app.use('/api/user',userRouter)
app.use('/api/seller',sellerRouter)
app.use('/api/product',productRouter)
app.use('/api/cart',cartRouter)
app.use('/api/address',addressRouter)
app.use('/api/order',orderRouter)
app.listen(port,()=>{
    console.log(`Server is running on ://localhost:${port}`)
})

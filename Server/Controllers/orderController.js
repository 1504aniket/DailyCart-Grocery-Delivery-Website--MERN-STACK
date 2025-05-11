import product from "../Models/Product.js";
import User from "../Models/User.js";
import order from "../Models/order.js";
import Stripe from "stripe";


// place order :cod:/api/order/cod 
export const placeOrderCOD = async (req, res) => {
    try {
        const { userId, items, address } = req.body;
        if (!address || items.length === 0) {
            return res.json({ success: false, message: 'Invalid data' });
        }

        // Calculate total amount
        let amount = 0;
        for (const item of items) {
            const productDoc = await product.findById(item.product);
            if (!productDoc) {
                return res.json({ success: false, message: `Product not found: ${item.product}` });
            }
            amount += productDoc.offerprice * item.quantity;
        }

        // Add tax (2%)
        amount += Math.floor(amount * 0.02);

        // Create order
        await order.create({
            userId,
            items,
            amount,
            address,
            paymentType: 'COD',
        });

        return res.json({ success: true, message: 'Order placed successfully' });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};


// get order by user :/api/order/user 

export const getUserOrders=async (req,res)=>{
    try{
        const {userId}=req.query;
        const orders=await order.find({
            userId,
            $or:[{paymentType:'COD'},{isPaid:true}]
        }).populate('items.product address').sort({createdAt:-1});
        res.json({success:true,orders})
    }catch(error){
        res.json({success:false,message:error.message})
    }
}


// get all orders for seller :/api/order/seller 


export const getAllOrders=async (req,res)=>{
    try{
        
        const orders=await order.find({
            
            $or:[{paymentType:'COD'},{isPaid:true}]
        }).populate('items.product address').sort({createdAt:-1})
        res.json({success:true,orders})
    }catch(error){
        res.json({success:false,message:error.message})
    }
}

export const placeOrderStripe=async (req,res)=>{
    try{
        const {userId,items,address}=req.body;
        const{origin}=req.headers;
        if(!address||items.length===0){
            return res.json({success:false,message:'invalid data'})
        }
    

        let amount = 0;
        let productData = [];
        
        for (const item of items) {
            const productDoc = await product.findById(item.product);
            if (!productDoc) {
                return res.json({ success: false, message: `Product not found: ${item.product}` });
            }
        
            productData.push({
                name: productDoc.name,
                price: productDoc.offerprice,
                quantity: item.quantity,
            });
        
            amount += productDoc.offerprice * item.quantity;
        }
        
        amount += Math.floor(amount * 0.02);
        
     const neworder= await order.create({
        userId,
        items,
        amount,
        address,
        paymentType:'Online',
      })

    //   Stripe 
    const stripeInstance=new Stripe(process.env.STRIPE_SECRET_KEY);

    // create line item for stripe 
    const line_items=productData.map((item)=>{
        return {
            price_data:{
                currency:"aud",
                product_data:{
                    name:item.name,
                },
                unit_amount:Math.floor(item.price+item.price*0.02)*100
            },
            quantity:item.quantity,
        }
    })

    // create session 
    const session=await stripeInstance.checkout.sessions.create({
        line_items,
        mode:'payment',
        success_url:`${origin}/loader?next=my-order`,
        cancel_url:`${origin}/cart`,
        metadata:{
            orderId:neworder._id.toString(),
            userId,
        }
    })
      return res.json({success:true,url:session.url});


    }catch(error){
        return res.json({success:false,message:error.message})

    }
}

// stripe webhooks to verify payment 

export const stripewebhooks=async (request,response)=>{
    const stripeInstance=new Stripe(process.env.STRIPE_SECRET_KEY);
    const sig=request.headers['stripe-signature'];
    let event;
    try{
        event =stripeInstance.webhooks.constructEvent(
            request.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    }catch(error){
        response.status(400).send(`Webhook Error:${error.message}`)



    }


    switch(event.type){
        case "payment_intent.succeeded":{
            const paymentIntent=event.data.object;
            const paymentIntentId=paymentIntent.id;

            const session =await stripeInstance.checkout.sessions.list({
                payment_intent:paymentIntentId
            });

            const {orderId,userId}=session.data[0].metadata;

            await order.findByIdAndUpdate(orderId,{isPaid:true})

            await User.findByIdAndUpdate(userId,{cartitem:{}})
        }
        break;

        case "payment_intent.payment_failed":{
            const paymentIntent=event.data.object;
            const paymentIntentId=paymentIntent.id;


            const session =await stripeInstance.checkout.sessions.list({
                payment_intent:paymentIntentId,
            });
            const {orderId,userId}=session.data[0].metadata;
            await order.findByIdAndDelete(orderId);
            break;
        }
        default:
            console.error(`Unhandled event type ${event.type}`)
            break;

    }
    response.json({recieved:true})

}
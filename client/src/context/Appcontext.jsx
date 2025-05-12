import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dummyProducts } from "../assets/assets";
import {toast} from "react-hot-toast";

import axios from 'axios'
axios.defaults.withCredentials=true;
axios.defaults.baseURL=import.meta.env.VITE_BACKEND_URL;

export const Appcontext=createContext();
export const AppcontextProvider=({children})=>{
    const CURRENCY='₹';
    const navigate=useNavigate();
    const[user,setuser]=useState(false);
    const[isseller,setisseller]=useState(false);
    const[cartitem,setcartitem]=useState({});
   
    const[products,setproducts]=useState([]);
    const [showuserlogin, setshowuserlogin] = useState(false);
    const[searchquery,setsearchquery]=useState({});
    const [isLoggingOut, setIsLoggingOut] = useState(false);






    // fetch user status 

    // After successful login, save user to localStorage
    const fetchuser = async () => {
        try {
          // 1. Check auth via cookies (primary)
          
     
          const { data } = await axios.get('/api/user/is-auth');
          if (data.success) {
            setuser(data.user);
            localStorage.setItem('user', JSON.stringify(data.user)); // Sync to localStorage
          
          }
          else{
            setuser(null);
            localStorage.removeItem('user')
          }
        } catch (error) {
          console.error('Cookie auth failed:', error);
          setuser(null)
          localStorage.removeItem('user')
        }
      
        // 2. Fallback: Check localStorage (for UI only)
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          setuser(JSON.parse(savedUser)); // Show UI as logged in
          toast.error("Session expired. Please log in again.");
        } else {
          setuser(null);
        }
      };

    // fetch seller status 
    const fetchseller=async()=>{
           try{
            const{data}=await axios.get('/api/seller/is-auth')
            if(data.success){
                setisseller(true);
            }
            else{
                setisseller(false);
            }
        }catch(error){
            setisseller(false);

        }
    }


    const getcartcount=()=>{
        let totalcount=0;
        for(const item in cartitem){
            totalcount+=cartitem[item];
        }
        return totalcount;
    }


    //get cart total amount
    const getcartamount=()=>{
        let totalamount=0;
        for(const item in cartitem){
            let iteminfo=products.find((product)=>product._id===item);
            if(cartitem[item]>0){
                totalamount+=iteminfo.offerprice* cartitem[item]
            }
        }
        return Math.floor(totalamount*100)/100;
    }

    //fetch all products
    const fetchproducts=async ()=>{
      try{
        const {data}=await axios.get('/api/product/list');
        if(data.success){
            setproducts(data.products)
        }
        else{
            toast.error(data.message)
        }
      }catch(error){
        toast.error(error.message)
      }
    }
    //add prodcuct to cart
    const addtocart=(itemid)=>{
        let cartdata=JSON.parse(JSON.stringify(cartitem));
        if(cartdata[itemid]){
            cartdata[itemid]+=1;
        }else{
            cartdata[itemid]=1;
        }
        setcartitem(cartdata);
        toast.success("Added to Cart")
    }
    //update cart item quantity
    const updatecartitem = (itemid, quantity) => {
        let cartdata = structuredClone(cartitem);
        cartdata[itemid]=quantity;
        setcartitem(cartdata);
        toast.success("Cart Updated");
    }
    //remove product from cart
    const removefromcart=(itemid)=>{
        let cartdata=structuredClone(cartitem);
        if(cartdata[itemid]){
            cartdata[itemid]-=1;
            if(cartdata[itemid]===0){
                delete cartdata[itemid];
            }
        }
        toast.success("Removed from cart")
        setcartitem(cartdata);

    }
   
    useEffect(() => {
        if (user) {
            localStorage.setItem('cartitem', JSON.stringify(cartitem)); // Sync cart to localStorage
        }
    }, [cartitem]);
    
    
    useEffect(() => {
        fetchuser(); // Always check auth status from server first
        fetchproducts();
         fetchseller();
  
  // Load cart separately (not tied to auth)
  const savedCartItem = localStorage.getItem('cartitem');
  if (savedCartItem && savedCartItem !== "undefined") {
    setcartitem(JSON.parse(savedCartItem));
  }



        // if(!isLoggingOut){
        // const savedUser = localStorage.getItem('user');
        // const savedCartItem = localStorage.getItem('cartitem');
        
        // if (savedUser && savedUser !== "undefined") {
        //     setuser(JSON.parse(savedUser));
        // } else {
        //     fetchuser(); // Fetch user data from API if not in localStorage
        // }
    
        // if (savedCartItem && savedCartItem !== "undefined") {
        //     setcartitem(JSON.parse(savedCartItem)); // Load cart state from localStorage
        // }
    // }
        
        // fetchproducts();
        // fetchseller();
    }, []);
    
    useEffect(() => {
        if (!user) return;
    
        const updatecart = async () => {
            try {
                const { data } = await axios.post('/api/cart/update', {
                    userId: user._id,              // ✅ Send correct user ID
                    cartItems: cartitem            // ✅ Rename to match backend
                });
                if (!data.success) {
                    toast.error(data.message);
                }
            } catch (error) {
                toast.error(error.message);
            }
        };
    
        updatecart();
    }, [cartitem, user]);
    
    
    const value={navigate,user,setIsLoggingOut ,setuser,setisseller,isseller,showuserlogin,setshowuserlogin,products,CURRENCY,addtocart,updatecartitem,removefromcart,cartitem,searchquery,setsearchquery,getcartamount,getcartcount,axios,fetchproducts,setcartitem}
    return <Appcontext.Provider value={value}>
        {children}
    </Appcontext.Provider>

}
export const useAppcontext=()=>{
    return useContext(Appcontext)}
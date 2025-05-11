import React from 'react'
import Navbar from './components/Navbar'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import { Toaster } from 'react-hot-toast'
import Footer from './components/Footer'
import { useAppcontext } from './context/Appcontext'
import Login from './components/Login'
import AllProducts from './pages/AllProducts'
import ProductCategory from './pages/ProductCategory'
import ProductDetails from './pages/ProductDetails'
import Cart from './pages/Cart'
import AddAddress from './pages/AddAddress'
import MyOrders from './pages/MyOrders'
import SellerLogin from './components/seller/SellerLogin'
import SellerLayout from './pages/seller/SellerLayout'
import AddProduct from './pages/seller/AddProduct'
import ProductList from './pages/seller/ProductList'
import Orders from './pages/seller/Orders'
import Loading from './components/Loading'
import Contact from './pages/Contact'

const App = () => {
  const issellerpath=useLocation().pathname.includes('seller');
  const {showuserlogin,isseller}=useAppcontext();
  return (
    <div className='text-default min-h-screen text-gray-700 bg-white' >
      {issellerpath?null:<Navbar/>}
      {showuserlogin?<Login/>:null}
      <Toaster/>

      <div className={`${issellerpath?"":'px-6 md:px-16 lg:px-24 x1:px-32'}`}>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/products' element={<AllProducts/>}/>
          <Route path='/products/:category' element={<ProductCategory/>}/>
          <Route path='/products/:category/:id' element={<ProductDetails/>}/>
          <Route path='/cart' element={<Cart/>}/>
          <Route path='/add-address' element={<AddAddress/>}/>
          <Route path='/my-orders' element={<MyOrders/>}/>
          <Route path='/loader' element={<Loading/>}/>
          <Route path='/contact' element={<Contact/>}/>
          <Route path='/seller' element={isseller ? <SellerLayout/> :<SellerLogin/>}> 
           <Route index element={isseller?<AddProduct/>:null}/>
           <Route path='product-list' element={<ProductList/>}/>
           <Route path='orders' element={<Orders/>} />
           </Route>
        </Routes>
      </div>
      {!issellerpath&&<Footer/>}
      
    </div>
  )
}

export default App

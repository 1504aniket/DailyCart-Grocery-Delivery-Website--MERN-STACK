import React, { useEffect, useState } from 'react'
import { useAppcontext } from '../context/Appcontext'
import ProductCard from '../components/ProductCard';

const AllProducts = () => {
    const{products,searchquery}=useAppcontext();
    const[filteredproducts,setfilteredproducts]=useState([]);
    useEffect(()=>{
        if(searchquery.length>0){
            setfilteredproducts(products.filter(product => product.name.toLowerCase().includes(searchquery.toLowerCase())))

        }
        else{
            setfilteredproducts(products);
        }

    },[products,searchquery])
  return (
    <div className='mt-16 flex flex-col'>
        <div className='flex flex-col items-end w-max'>
            <p className='text-2xl font-medium uppercase'>All Products</p>

            <div className='w-16 h-0.5 bg-primary rounded-full'>

            </div>
        </div>
        <div className='grid grid-cols-2 gap-1 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-6 lg:grid-cols-5 mt-6'>
            {filteredproducts.filter((product)=>product.inStock).map((product,index)=>(
                <ProductCard key={index} product={product}/>
            ))}

        </div>
      
    </div>
  )
}

export default AllProducts

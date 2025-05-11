import React from 'react'
import { useAppcontext } from '../context/Appcontext'
import { useParams } from 'react-router-dom';
import { categories } from '../assets/assets';
import ProductCard from '../components/ProductCard';
const ProductCategory = () => {
    const{products}=useAppcontext();
    const {category}=useParams();
    const searchcategory=categories.find((item)=>item.path.toLowerCase()===category)
    const filteredproducts=products.filter((product)=>product.category.toLowerCase()===category)
  return (
    <div className='mt-16'> 
        {searchcategory&&(
            <div className='flex flex-col items-end w-max'>
                <p className='text-2xl font-medium '>{searchcategory.text.toUpperCase()}</p>
                <div className='w-16 h-0.5 bg-primary rounded-full'>

                </div>
            </div>
        )}
        {filteredproducts.length>0?(
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4  lf:grid-cols-5 gap-3 md:gap-6 mt-6'>
                {filteredproducts.map((product)=>(
                    <ProductCard key={product._id} product={product}/>
                ))}
            </div>
        ):(
            <div className='flex items-center justify-center h-[60vh'> 
                <p className='text-2xl font-medium text-primary'>No products found in this category</p>

            </div>
        
        )}
      
    </div>
  )
}

export default ProductCategory

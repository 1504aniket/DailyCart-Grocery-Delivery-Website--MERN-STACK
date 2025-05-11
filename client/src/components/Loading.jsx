import React, { useEffect } from 'react'
import { useAppcontext } from '../context/Appcontext'
import { useLocation } from 'react-router-dom';

const Loading = () => {
    const{navigate}=useAppcontext();
    let{search}=useLocation();
    const query =new URLSearchParams(search);
    const nexturl=query.get('next');

    useEffect(()=>{
        if(nexturl){
            setTimeout(() => {
                navigate('/{nexturl}')
                
            }, 5000);
        }
    })
  return (
    <div className='flex justify-center items-center h-screen'>
        <div className='animate-spin rounded-full h-24 w-24 border-4 border-gray-300 border-t-primary'> 

        </div>
      
    </div>
  )
}

export default Loading

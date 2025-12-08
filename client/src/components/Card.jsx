import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
  
const Card = ({ product, wishlist, addToWishlist, removeFromWishlist }) => {
  const [imgno, setImgno] = useState(0)
  const [liked, setLiked] = useState(null)

  useEffect(()=>{
    let data = wishlist.includes(product._id)
    setLiked(data)
  },[wishlist])

  const handleLike = (pid) => {
    if(liked){
      removeFromWishlist(pid)
      setLiked(false)
    }else{
      addToWishlist(pid)
      setLiked(true)
    }
  }

  return (
    <div class="group my-2 h-[400px] overflow-hidden flex w-[300px] flex-col border border-gray-100 bg-white shadow-md">
        <div class="relative flex flex-col h-[300px] overflow-hidden">
            <Link to={`/product/${product._id}`}>
              <img class="absolute top-0 right-0 h-full w-full object-cover" src={product.imageUrls[0]} alt="product image" />
            </Link>
            <div class="absolute right-16 bottom-0 mr-2 mb-4 space-y-2 transition-all duration-300 group-hover:right-0"></div>
        </div>
        <div class="flex flex-col pb-2 px-4 pt-1 h-[100px] overflow-hidden">
          <a href="#" className='flex items-center h-[60px]'>
            <h5 class="tracking-tight text-slate-900">{product.name}</h5>
          </a>
          <div class="h-[40px] flex flex-row items-center justify-center">
            <p className='w-full items-start'>
              <span class="font-bold text-slate-900">Rs. {product.price}</span>
            </p>
            <button class="pr-3 w-full flex items-center justify-end">
              <svg class="h-6 w-6 text-black hover:text-gray-600" onClick={()=>handleLike(product._id)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fillRule="evenodd" clipRule="evenodd" fill={liked?"black":"none"} stroke="black" strokeWidth="2">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
  )
}

export default Card
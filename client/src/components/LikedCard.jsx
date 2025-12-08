import React from 'react'
import { Link } from 'react-router-dom'

const LikedCard = ({product, removeFromWishlist}) => {

  return (
    <div class="relative group z-10 my-6 flex w-full h-[340px] max-w-[260px] flex-col overflow-hidden border border-gray-100 bg-white shadow-md">
          <span className='absolute top-2 right-2 group invisible font-b text-xl cursor-pointer group-hover:visible' onClick={()=>removeFromWishlist(product._id)}>
            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" fill="#343a40" viewBox="0 0 50 50">
              <path d="M 7.71875 6.28125 L 6.28125 7.71875 L 23.5625 25 L 6.28125 42.28125 L 7.71875 43.71875 L 25 26.4375 L 42.28125 43.71875 L 43.71875 42.28125 L 26.4375 25 L 43.71875 7.71875 L 42.28125 6.28125 L 25 23.5625 Z"></path>
            </svg>
          </span>
           <Link to={`http://localhost:5173/product/${product._id}`}>
            <a class="flex h-[260px] overflow-hidden" href="#">
              <img class="top-0 right-0 h-full w-full object-cover" src={product && product.imageUrls[0]} alt="product image" />
            </a>
          </Link>
        <div class="flex flex-col pb-2 px-4 pt-1 h-[80px] overflow-hidden">
          <div className='flex items-center h-[50px]'>
            <h5 class="tracking-tight text-slate-900">{product && product.name}</h5>
          </div>
          <div class="h-[40px] flex flex-row items-center justify-center">
            <p className='w-full items-start'>
              <span class="text-xl font-bold text-slate-900">Rs. {product &&product.price}</span>
            </p>
          </div>
        </div>
      </div>
  )
}

export default LikedCard
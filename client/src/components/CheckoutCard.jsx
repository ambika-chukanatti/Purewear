import React from 'react'
import { Link } from 'react-router-dom'

const Checkoutcard = ({ ci, cartItem, productItem }) => {
  
  return (
        <div class={`${!(ci==0) && 'border-t'} text-sm items-center relative group w-full py-3 flex flex-col md:flex-row`}>
          <img class="flex items-center justify-center my-1 mr-6 h-28 w-28 border object-cover object-center" src={productItem?.imageUrls[0]} alt="" />
          <div class="flex w-full flex-col justify-center items-center md:items-start px-4">
            <span class="font-semibold">{productItem?.name}</span>
            <div className='w-full flex flex-row md:flex-col justify-center items-center my-2 md:items-start'>
              <h2 className='text-gray-400 mr-4 mb-1'>{cartItem.size}</h2>
              <img src={cartItem.color} className='w-4 h-4'/>
            </div>
            <div className='w-full flex flex-col sm:flex-row items-center justify-center'>
              <div className='w-full py-1 flex justify-center md:justify-start'>
              Qty: {cartItem.quantity}
              </div>
              <p class="w-full flex justify-center sm:py-0 sm:justify-end font-bold">$ {productItem?.price*cartItem.quantity}</p>
            </div>
          </div>
        </div>
  )
}

export default Checkoutcard
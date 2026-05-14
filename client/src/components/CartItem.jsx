import {React, useEffect, useState} from 'react'
import { Link } from 'react-router-dom'

const CartItem = ({ ci, cartItem, productItem, handleQuantity, handleDeleteItem}) => {

  const handleQuantityChange = (e) => {
    handleQuantity(e.target.name, cartItem, productItem.price)
  }

  return (
        <div class={`items-center relative group w-full py-3 flex flex-col md:flex-row border-b`}>
          <Link to={`/product/${cartItem.pid}`}>
            <img class="flex items-center justify-center my-1 mr-6 h-32 w-32 border object-cover object-top" src={productItem?.imageUrls[0]} alt="" />
          </Link>
          <div class="flex w-full flex-col justify-center items-center md:items-start px-4">
            <span class="font-semibold">{productItem?.name}</span>
            <div className='w-full flex flex-row md:flex-col justify-center items-center py-1 md:items-start'>
              <h2 className='text-gray-400 my-1 mr-4'>{cartItem.size}</h2>
              <img src={cartItem.color} className='w-6 h-6'/>
            </div>
            <div className='w-full flex flex-col sm:flex-row items-center justify-center mt-3'>
              <div className='w-full flex flex-row justify-center items-center'>
                <div className='w-full flex justify-center sm:justify-start'>
                  <div className='flex flex-row border border-gray-300 px-2 items-center justify-center'>
                    <span className='pl-1 cursor-pointer text-xl'><button name='minus' onClick={handleQuantityChange}>&minus;</button></span>
                      <input type='text' className=' w-8 outline-none text-l text-center' value={cartItem.quantity}/>
                    <span className='pr-1 cursor-pointer text-xl'><button name='plus' onClick={handleQuantityChange}>&#43;</button></span>
                  </div>
                </div>
              </div>
              <p class="w-full flex justify-center pt-2 sm:py-0 sm:justify-end font-bold">$ {productItem?.price*cartItem.quantity}</p>
            </div>
          </div>
        </div>
  )
}

export default CartItem
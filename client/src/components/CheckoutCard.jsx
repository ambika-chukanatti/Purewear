import React from 'react';
import { Link } from 'react-router-dom';

const Checkoutcard = ({ ci, cartItem, productItem }) => {
  return (
    <div className={`${ci !== 0 && 'border-t'} text-sm items-center relative group w-full py-3 flex flex-col md:flex-row`}>
      <div className="flex-shrink-0 my-1 mr-6 h-28 w-28 border overflow-hidden bg-white">
        <img
          className="w-full h-full object-cover object-top"
          src={productItem?.imageUrls[0]}
          alt={productItem?.name || ''}
        />
      </div>
      <div className="flex w-full flex-col justify-center items-center md:items-start px-4">
        <span className="font-semibold">{productItem?.name}</span>
        <div className='w-full flex flex-row md:flex-col justify-center items-center my-2 md:items-start gap-1'>
          <h2 className='text-gray-400 mr-4 mb-1'>{cartItem.size}</h2>
          <div className='flex flex-row items-center gap-2'>
            <img src={cartItem.color} className='w-4 h-4 border border-gray-200' alt="" />
          </div>
        </div>
        <div className='w-full flex flex-col sm:flex-row items-center justify-center'>
          <div className='w-full py-1 flex justify-center md:justify-start'>
            Qty: {cartItem.quantity}
          </div>
          <p className="w-full flex justify-center sm:py-0 sm:justify-end font-bold">Rs. {productItem?.price * cartItem.quantity}</p>
        </div>
      </div>
    </div>
  );
};

export default Checkoutcard;
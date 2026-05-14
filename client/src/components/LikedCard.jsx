import React from 'react';
import { Link } from 'react-router-dom';

const LikedCard = ({ product, removeFromWishlist }) => {
  return (
    <div className="relative group my-2 flex w-full flex-col border border-gray-100 bg-white shadow-md">
      <span className='absolute top-2 right-2 z-10 invisible cursor-pointer group-hover:visible' onClick={() => removeFromWishlist(product._id)}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#343a40" viewBox="0 0 50 50">
          <path d="M 7.71875 6.28125 L 6.28125 7.71875 L 23.5625 25 L 6.28125 42.28125 L 7.71875 43.71875 L 25 26.4375 L 42.28125 43.71875 L 43.71875 42.28125 L 26.4375 25 L 43.71875 7.71875 L 42.28125 6.28125 L 25 23.5625 Z" />
        </svg>
      </span>
      <Link to={`/product/${product._id}`}>
        <div className="w-full aspect-[11/12] overflow-hidden bg-white">
          <img
            className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
            src={product?.imageUrls[0]}
            alt={product?.name}
          />
        </div>
      </Link>
      <div className="flex flex-col pb-2 px-4 pt-2">
        <h5 className="tracking-tight text-slate-900 line-clamp-1 text-sm">
          {product?.name}
        </h5>
        <div className="flex flex-row items-center justify-between mt-1">
          <span className="font-bold text-slate-900">Rs. {product?.price}</span>
        </div>
      </div>
    </div>
  );
};

export default LikedCard;
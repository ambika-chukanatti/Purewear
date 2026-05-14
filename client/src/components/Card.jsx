import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Card = ({ product, wishlist, addToWishlist, removeFromWishlist }) => {
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    setLiked(wishlist.includes(product._id));
  }, [wishlist, product._id]);

  const handleLike = (pid) => {
    if (liked) {
      removeFromWishlist(pid);
      setLiked(false);
    } else {
      addToWishlist(pid);
      setLiked(true);
    }
  };

  return (
    <div className="group my-2 flex w-[320px] flex-col border border-gray-100 bg-white shadow-md">
      <Link to={`/product/${product._id}`}>
        <div className="w-full aspect-[11/12] overflow-hidden bg-white">
          <img
            className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
            src={product.imageUrls[0]}
            alt={product.name}
          />
        </div>
      </Link>
      <div className="flex flex-col pb-2 px-4 pt-2">
        <h5 className="tracking-tight text-slate-900 line-clamp-1 text-sm">
          {product.name}
        </h5>
        <div className="flex flex-row items-center justify-between mt-1">
          <span className="font-bold text-slate-900">Rs. {product.price}</span>
          <button className="p-1">
            <svg
              className="h-6 w-6 text-black hover:text-gray-600"
              onClick={() => handleLike(product._id)}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fillRule="evenodd"
              clipRule="evenodd"
              fill={liked ? "black" : "none"}
              stroke="black"
              strokeWidth="2"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;
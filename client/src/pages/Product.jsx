import React, { useState, useEffect } from 'react';
import { Header, Footer, Alerts } from '../components';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ProductSkeleton } from '../components/SkeletonAnimations';

const Product = () => {
  const [loading, setLoading] = useState(false);
  const [setupDone, setSetupDone] = useState(false);
  const [user, setUser] = useState({});
  const [product, setProduct] = useState({});
  const [wishlist, setWishlist] = useState([]);
  const [liked, setLiked] = useState(false);
  const [imgIndex, setImgIndex] = useState(0);
  const [cart, setCart] = useState([]);
  const [cartItem, setCartItem] = useState({});
  const [alerts, setAlerts] = useState([]);

  const location = useLocation();
  const pid = location.pathname.split('/')[2];
  const navigate = useNavigate();
  const server = 'purewear.onrender.com';

  const addAlert = (type, message) => {
    setAlerts(prev => [...prev, { alertOn: true, type, message }]);
  };

  const handleAuthError = (err) => {
    if (err.response?.status === 401) navigate('/');
    addAlert('error', err.message);
  };

  useEffect(() => {
    const loadAll = async () => {
      setSetupDone(false);
      try {
        const [productRes, profileRes, wishlistRes, cartRes] = await Promise.all([
          axios.get(`https://${server}/api/product/get/${pid}`),
          axios.post(`https://${server}/api/user/profile/get`, {}, { withCredentials: true }),
          axios.post(`https://${server}/api/user/wishlist/get`, {}, { withCredentials: true }),
          axios.post(`https://${server}/api/user/cart/get`, {}, { withCredentials: true }),
        ]);

        if (productRes.status === 200) {
          const resItem = productRes.data.data;
          setProduct(resItem);
          setCartItem({ color: resItem.colors[0], size: resItem.sizes[0] });
        }
        if (profileRes.data.success) setUser(profileRes.data.data);
        if (wishlistRes.data.success) {
          setWishlist(wishlistRes.data.data);
          if (wishlistRes.data.data.includes(pid)) setLiked(true);
        }
        if (cartRes.data.success) setCart(cartRes.data.data);
      } catch (err) {
        handleAuthError(err);
      } finally {
        setSetupDone(true);
      }
    };
    loadAll();
  }, []);

  const handleLeftClick = () => {
    if (imgIndex >= product.imageUrls.length - 1) setImgIndex(0);
    else setImgIndex(prev => prev + 1);
  };

  const handleRightClick = () => {
    if (imgIndex <= 0) setImgIndex(product.imageUrls.length - 1);
    else setImgIndex(prev => prev - 1);
  };

  const addToWishlist = async (pid) => {
    try {
      const response = await axios.post(`https://${server}/api/user/wishlist/add`, { pid }, { withCredentials: true });
      if (response.data.success) {
        setWishlist(prev => [...prev, pid]);
        setLiked(true);
        addAlert('success', 'Added to wishlist');
      }
    } catch (err) { handleAuthError(err); }
  };

  const removeFromWishlist = async (pid) => {
    try {
      const response = await axios.post(`https://${server}/api/user/wishlist/remove`, { pid }, { withCredentials: true });
      if (response.status === 200) {
        setWishlist(prev => prev.filter(item => item !== pid));
        setLiked(false);
        addAlert('success', 'Removed from wishlist');
      }
    } catch (err) { handleAuthError(err); }
  };

  const handleWishlist = () => liked ? removeFromWishlist(pid) : addToWishlist(pid);

  const handleChange = (e) => {
    if (e.target.name === 'size') {
      setCartItem(prev => ({ ...prev, size: e.target.value }));
    } else if (e.target.name === 'color') {
      setCartItem(prev => ({ ...prev, color: product.colors[e.target.value] }));
      setImgIndex(Number(e.target.value));
    }
  };

  const addToCart = async () => {
    try {
      const response = await axios.post(
        `https://${server}/api/user/cart/add`,
        { pid, color: cartItem.color.url, colorName: cartItem.color.name, size: cartItem.size, quantity: 1 },
        { withCredentials: true }
      );
      if (response.data.success) addAlert('success', 'Added to cart');
    } catch (err) { handleAuthError(err); }
  };

  const handleAlertCancel = (alertIndex) => {
    setAlerts(prev => { const updated = [...prev]; updated.splice(alertIndex, 1); return updated; });
  };

  const handleLogout = async () => {
    try {
      const response = await axios.post(`https://${server}/api/auth/logout`, {}, { withCredentials: true });
      if (response.data.success) navigate('/');
    } catch (err) { handleAuthError(err); }
  };

  return (
    <div className='relative w-full flex flex-col items-center'>
      <Header user={user} handleLogout={handleLogout} />
      <div className='w-full z-40 flex flex-col items-end fixed px-3 right-1 md:right-4 top-14'>
        {alerts.map((alert, i) => (
          <Alerts key={i} i={i} alertOn={alert.alertOn} type={alert.type} message={alert.message} handleAlertCancel={handleAlertCancel} />
        ))}
      </div>

      {setupDone === false ? <ProductSkeleton /> : (
        <section className="mb-4 w-11/12">
          <Link to='/dashboard'>
            <svg xmlns="http://www.w3.org/2000/svg" className='w-6 h-6 cursor-pointer' viewBox="0 0 32 32">
              <path d="M32 15H3.41l8.29-8.29-1.41-1.42-10 10a1 1 0 0 0 0 1.41l10 10 1.41-1.41L3.41 17H32z" data-name="4-Arrow Left" />
            </svg>
          </Link>
          <div>
            <div className="lg:mt-8 mt-4 lg:col-gap-12 xl:col-gap-16 grid grid-cols-1 gap-12 lg:grid-cols-5 lg:gap-16">
              <div className="flex sm:items-center items-start justify-center lg:col-span-3 lg:row-end-1">
                <div className="lg:flex lg:items-start">
                  <div className="lg:order-2 lg:ml-5">
                    <div className="relative max-w-xl overflow-hidden">
                      <div className='absolute top-1/2 left-2 cursor-pointer z-10' onClick={handleRightClick}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M15 18l-6-6 6-6" />
                        </svg>
                      </div>
                      <div className="w-full aspect-[11/12] bg-gray-100 overflow-hidden">
                        <img className="w-full h-full object-cover object-top" src={product?.imageUrls?.[imgIndex]} alt={product?.name || ''} />
                      </div>
                      <div className='absolute top-1/2 right-2 cursor-pointer z-10' onClick={handleLeftClick}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M9 18l6-6-6-6" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center lg:items-start lg:col-span-2 lg:row-span-2 lg:row-end-2 px-4">
                <h1 className="sm:text-2xl font-bold text-gray-900 sm:text-3xl">{product.name}</h1>
                <div className='flex flex-row py-4 items-center'>
                  <h1 className="text-3xl font-bold">Rs. {product.price}</h1>
                </div>
                <p>Inclusive of all taxes</p>
                <h2 className="mt-8 text-base text-gray-900">Color</h2>
                <p className="text-sm text-gray-500 mt-2 capitalize">{cartItem?.color?.name}</p>
                <div className="mt-2 grid grid-cols-6 gap-3 select-none">
                  {product?.colors?.map((color, index) => (
                    <label key={color.url}>
                      <input type="radio" name="color" value={index} className="peer sr-only" defaultChecked={cartItem?.color && color.url === cartItem.color.url} onClick={handleChange} />
                      <img className='peer-checked:border border-black w-10 h-10 p-1 cursor-pointer' src={color.url} alt="" />
                    </label>
                  ))}
                </div>
                <h2 className="mt-8 mb-2 text-base text-gray-900">Size</h2>
                <div className="mt-2 grid grid-cols-6 gap-2 select-none">
                  {["S", "M", "L", "XL", "2XL", "3XL"].map((size) => (
                    <label key={size}>
                      <input type="radio" name="size" value={size} className="peer sr-only" defaultChecked={cartItem?.size && size === cartItem.size} disabled={product?.sizes && !product.sizes.includes(size)} onClick={handleChange} />
                      <p className={`peer-checked:border border-black cursor-pointer flex w-12 h-10 p-1 justify-center items-center ${product?.sizes?.includes(size) ? 'text-black' : 'text-gray-300'}`}>{size}</p>
                    </label>
                  ))}
                </div>
                <div className="mt-10 flex flex-row items-center justify-center border-t border-b py-4 sm:flex-row">
                  <div className='w-full flex flex-row items-center justify-start'>
                    <button type="button" className="inline-flex items-center justify-center rounded-md border-2 mr-8 border-transparent bg-gray-900 px-12 py-3 text-center text-base font-bold text-white transition-all duration-200 ease-in-out hover:bg-gray-800" onClick={addToCart}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="shrink-0 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      Add to cart
                    </button>
                    <button className='inline-flex items-center justify-center border border-black p-2 rounded-md bg-black' onClick={handleWishlist}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" stroke="white" fill={liked ? "white" : "currentColor"}>
                        <path fillRule="nonzero" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="nonzero" />
                      </svg>
                    </button>
                  </div>
                </div>
                <ul className="mt-8 space-y-2">
                  <li className="flex items-center text-left text-sm font-medium text-gray-600">
                    <svg className="mr-2 block h-5 w-5 align-middle text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Free shipping worldwide
                  </li>
                  <li className="flex items-center text-left text-sm font-medium text-gray-600">
                    <svg className="mr-2 block h-5 w-5 align-middle text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    Cancel Anytime
                  </li>
                </ul>
              </div>
              <div className="lg:col-span-3 pl-4">
                <div className='border-b border-gray-300 pb-2'>Description</div>
                <div className="mt-4 flow-root sm:mt-6 whitespace-pre-line">
                  <div>{product.description}</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
      <Footer />
    </div>
  );
};

export default Product;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Header, Footer, LikedCard, Alerts } from '../components';
import { Link, useNavigate } from 'react-router-dom';
import { WishlistSkeleton } from '../components/SkeletonAnimations';

const Wishlist = () => {
  const [loading, setLoading] = useState(false);
  const [setupDone, setSetupDone] = useState(false);
  const [user, setUser] = useState({});
  const [wishlist, setWishlist] = useState([]);
  const [alerts, setAlerts] = useState([]);

  const navigate = useNavigate();
  const server = 'purewear.onrender.com';

  const addAlert = (type, message) => {
    setAlerts(prev => [...prev, { alertOn: true, type, message }]);
  };

  const handleAuthError = (err) => {
    if (err.response?.status === 401) navigate('/');
    addAlert('error', err.message);
  };

  const setup = async () => {
    setSetupDone(false);
    try {
      const [wishlistRes, profileRes] = await Promise.all([
        axios.post(`https://${server}/api/user/wishlist/get`, {}, { withCredentials: true }),
        axios.post(`https://${server}/api/user/profile/get`, {}, { withCredentials: true }),
      ]);

      if (profileRes.data.success) setUser(profileRes.data.data);

      const wishlistIds = wishlistRes.data.data;
      const productPromises = wishlistIds.map((item) =>
        axios.get(`https://${server}/api/product/get/${item}`)
          .then(res => res.data.data)
          .catch(() => null)
      );
      const productsData = await Promise.all(productPromises);
      setWishlist([...productsData].filter(Boolean).reverse());
    } catch (err) {
      handleAuthError(err);
    } finally {
      setSetupDone(true);
    }
  };

  useEffect(() => {
    setup();
  }, []);

  const removeFromWishlist = async (pid) => {
    try {
      const response = await axios.post(
        `https://${server}/api/user/wishlist/remove`,
        { pid },
        { withCredentials: true }
      );
      if (response.data.success) {
        addAlert('success', 'Removed from wishlist');
        await setup();
      }
    } catch (err) {
      handleAuthError(err);
    }
  };

  const handleAlertCancel = (i) => {
    setAlerts(prev => { const updated = [...prev]; updated.splice(i, 1); return updated; });
  };

  const handleLogout = async () => {
    try {
      const response = await axios.post(`https://${server}/api/auth/logout`, {}, { withCredentials: true });
      if (response.data.success) navigate('/');
    } catch (err) {
      handleAuthError(err);
    }
  };

  return (
    <div className='w-full flex flex-col items-center justify-center'>
      <Header user={user} handleLogout={handleLogout} />
      <div className='w-full z-40 flex flex-col items-end fixed px-3 right-1 md:right-4 top-14'>
        {alerts.map((alert, i) => (
          <Alerts key={i} i={i} alertOn={alert.alertOn} type={alert.type} message={alert.message} handleAlertCancel={handleAlertCancel} />
        ))}
      </div>
      <div className='w-11/12 mt-2 flex flex-col justify-center items-center'>
        <Link to='/dashboard' className='w-full'>
          <svg xmlns="http://www.w3.org/2000/svg" className='flex w-6 h-6 cursor-pointer justify-start' viewBox="0 0 32 32">
            <path d="M32 15H3.41l8.29-8.29-1.41-1.42-10 10a1 1 0 0 0 0 1.41l10 10 1.41-1.41L3.41 17H32z" data-name="4-Arrow Left" />
          </svg>
        </Link>
        <p className="flex mt-2 w-full justify-start pl-8 text-xl font-bold">My Wishlist</p>
        {setupDone === false ? (
          <WishlistSkeleton />
        ) : wishlist.length > 0 ? (
          <div className='w-full flex justify-start items-center px-8'>
            <div className='grid lg:grid-cols-3 lg:gap-y-8 lg:gap-x-24 md:grid-cols-2 md:gap-x-12 md:gap-y-8 grid-cols-1 gap-y-6'>
              {wishlist.map((product) => (
                <div key={product._id}>
                  <LikedCard product={product} removeFromWishlist={removeFromWishlist} />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className='py-36 text-l'>Your wishlist has no items</div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Wishlist;
import React, { useState, useEffect } from 'react';
import { Header, Footer, CheckoutCard, CheckoutForm, Alerts, Loading } from '../components';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { PaymentSkeleton } from '../components/SkeletonAnimations';

const stripePromise = loadStripe("pk_test_51Q6TTCAOg9YpRsPQyX84dXHKVPrhmUTLpo2Zq39PrrzgIAbGF557FUKfzWSmpct5OuNRxBv0ZaCzuqvWD6AGkFnR00QAeYNpxB");

const loader = 'auto';

const appearance = {
  theme: 'flat',
  variables: {
    colorPrimary: '#000000',
    colorBackground: '#f9fafe',
    colorText: '#000000',
    colorDanger: '#ff0000',
    fontFamily: 'sans-serif, serif, monospace',
    fontSizeBase: '16px',
    borderRadius: '4px',
  },
};

const Payment = () => {
  const [loading, setLoading] = useState(false);
  const [setupDone, setSetupDone] = useState(false);
  const [user, setUser] = useState({});
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [clientSecret, setClientSecret] = useState('');
  const [checkout, setCheckout] = useState({});
  const [alerts, setAlerts] = useState([]);
  const [updating, setUpdating] = useState(false);

  const navigate = useNavigate();
  const server = 'purewear.onrender.com';

  const addAlert = (type, message) => {
    setAlerts(prev => [...prev, { alertOn: true, type, message }]);
  };

  const handleAuthError = (err) => {
    if (err.response?.status === 401) {
      navigate('/');
    }
    addAlert('error', err.message);
  };

  const setup = async () => {
    setSetupDone(false);
    try {
      const res1 = await axios.post(`https://${server}/api/user/profile/get`, {}, { withCredentials: true });
      if (res1.data.success) {
        setUser(res1.data.data);
      }

      const res2 = await axios.post(`https://${server}/api/user/checkout/get`, {}, { withCredentials: true });
      if (res2.data.success) {
        setCheckout(res2.data.data);
        const cartItems = res2.data.data.cartItems;

        const productPromises = cartItems.map((item) =>
          axios.get(`https://${server}/api/product/get/${item.pid}`).then(res => res.data.data)
        );
        const productsData = await Promise.all(productPromises);
        setProducts(productsData);

        let updatedTotal = 0;
        productsData.forEach((product, pi) => {
          updatedTotal += product.price * cartItems[pi].quantity;
        });
        setTotal(updatedTotal);

        const res4 = await axios.post(
          `https://${server}/api/user/cart/checkout/payment`,
          { amount: (updatedTotal + 30) * 100 },
          { withCredentials: true }
        );
        if (res4.data.success) {
          setClientSecret(res4.data.clientSecret);
        }
      }
    } catch (err) {
      handleAuthError(err);
    } finally {
      setSetupDone(true);
    }
  };

  useEffect(() => {
    setup();
  }, []);

  const updatePaymentMethod = async (paymentMethod) => {
    setUpdating(true);
    try {
      const response = await axios.post(
        `https://${server}/api/user/checkout/update`,
        { paymentMethod },
        { withCredentials: true }
      );
      setCheckout(response.data.data);
    } catch (err) {
      handleAuthError(err);
    } finally {
      setUpdating(false);
    }
  };

  const handleAlertCancel = (i) => {
    setAlerts(prev => {
      const updated = [...prev];
      updated.splice(i, 1);
      return updated;
    });
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`https://${server}/api/auth/logout`, {}, { withCredentials: true });
      if (response.data.success) {
        navigate('/');
      }
    } catch (err) {
      handleAuthError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAlert = (status, message) => {
    addAlert(status, message);
  };

  return (
    <div className='relative w-full flex flex-col items-center justify-center'>
      <Header user={user} handleLogout={handleLogout} />
      <Link to='/cart/checkout' className='w-11/12 flex justify-start py-3'>
        <svg xmlns="http://www.w3.org/2000/svg" className='w-6 h-6 cursor-pointer' viewBox="0 0 32 32">
          <path d="M32 15H3.41l8.29-8.29-1.41-1.42-10 10a1 1 0 0 0 0 1.41l10 10 1.41-1.41L3.41 17H32z" data-name="4-Arrow Left" />
        </svg>
      </Link>
      <div className='w-full z-40 flex flex-col items-end fixed px-3 right-1 md:right-4 top-14'>
        {alerts.map((alert, i) => (
          <Alerts key={i} i={i} alertOn={alert.alertOn} type={alert.type} message={alert.message} handleAlertCancel={handleAlertCancel} />
        ))}
      </div>

      {setupDone === false ? (<PaymentSkeleton />) : (
        <div className='w-11/12 flex flex-col md:flex-row items-start justify-center'>
          {clientSecret && (
            <Elements options={{ clientSecret, appearance, loader }} stripe={stripePromise}>
              <CheckoutForm user={user} checkout={checkout} updatePaymentMethod={updatePaymentMethod} handleAlert={handleAlert} />
            </Elements>
          )}
          <div className="w-full flex flex-col items-center md:items-start justify-center py-8 md:py-2">
            <div className='w-full flex flex-col px-6 py-3'>
              <p className="text-xl font-medium">Order Summary</p>
              <div className='flex flex-col w-full pt-2 items-center justify-center'>
                <div className="flex w-full flex-col justify-center border md:border-y md:border-x-0 sm:px-4">
                  {checkout?.cartItems?.map((cartItem, ci) => (
                    <div key={ci}>
                      <CheckoutCard ci={ci} cartItem={cartItem} productItem={products[ci]} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className='w-full mt-4 md:mt-0 px-6 border md:border-none'>
              <table className='w-full ml-4'>
                <tbody>
                  <tr>
                    <td className='w-9/12'>SubTotal:</td>
                    <td className='w-3/12'>Rs. {total}</td>
                  </tr>
                  <tr>
                    <td className='w-9/12'>Delivery Charge:</td>
                    <td className='w-3/12'>Rs. 30</td>
                  </tr>
                  <tr>
                    <td className='w-9/12 font-medium pt-3'>Total:</td>
                    <td className='w-3/12 font-medium pt-3'>Rs. {total + 30}</td>
                  </tr>
                </tbody>
              </table>
              <span className='px-5 text-sm italic text-gray-400'>(Inclusive of tax $0.00)</span>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default Payment;
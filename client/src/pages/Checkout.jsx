import React, { useState, useEffect } from 'react';
import { Header, Footer, CheckoutCard, Alerts, Loading } from '../components';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";

const Checkout = () => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({});
  const [checkout, setCheckout] = useState({});
  const [products, setProducts] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [currentAddress, setCurrentAddress] = useState({
    fname: '',
    lname: '',
    phone: '',
    area1: '',
    area2: '',
    city: '',
    state: '',
    pincode: ''
  });

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
    setLoading(true);
    try {
      const res1 = await axios.post(`https://${server}/api/user/address/get`, {}, { withCredentials: true });
      const res2 = await axios.post(`https://${server}/api/user/checkout/get`, {}, { withCredentials: true });
      const res3 = await axios.post(`https://${server}/api/user/profile/get`, {}, { withCredentials: true });

      if (res2.data.success) {
        setCheckout(res2.data.data);
        const cartItems = res2.data.data.cartItems;
        const productPromises = cartItems.map((item) =>
          axios.get(`https://${server}/api/product/get/${item.pid}`).then(res => res.data.data)
        );
        const productsData = await Promise.all(productPromises);
        setProducts(productsData);
      }

      if (res1.data.success) {
        const addressData = res1.data.data;
        setAddresses(addressData);
        if (addressData.addressList.length >= 1) {
          setCurrentAddress(addressData.addressList[addressData.defaultAddressIndex]);
        }
      }

      if (res3.data.success) {
        setUser(res3.data.data);
      }
    } catch (err) {
      handleAuthError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setup();
  }, []);

  const handleCurrentAddressChange = (e) => {
    const { name, value } = e.target;
    setCurrentAddress(prev => ({
      ...prev,
      [name]: name === 'phone' || name === 'pincode' ? Number(value) : value
    }));
  };

  const continueToPayment = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `https://${server}/api/user/checkout/update`,
        { address: currentAddress },
        { withCredentials: true }
      );
      if (response.data.success) {
        navigate('/cart/checkout/payment');
      }
    } catch (err) {
      handleAuthError(err);
    } finally {
      setLoading(false);
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
    <div className='w-full flex flex-col items-center justify-center'>
      <Header user={user} handleLogout={handleLogout} />
      <Link to='/cart' className='w-11/12 flex justify-start py-3'>
        <svg xmlns="http://www.w3.org/2000/svg" className='w-6 h-6 cursor-pointer' viewBox="0 0 32 32">
          <path d="M32 15H3.41l8.29-8.29-1.41-1.42-10 10a1 1 0 0 0 0 1.41l10 10 1.41-1.41L3.41 17H32z" data-name="4-Arrow Left" />
        </svg>
      </Link>
      {loading && (
        <div className='fixed z-50 top-1/2 left-1/2 flex justify-center items-center'>
          <Loading />
        </div>
      )}
      <div className='w-full z-40 flex flex-col items-end fixed px-3 right-1 md:right-4 top-14'>
        {alerts.map((alert, i) => (
          <Alerts key={i} i={i} alertOn={alert.alertOn} type={alert.type} message={alert.message} handleAlertCancel={handleAlertCancel} />
        ))}
      </div>
      <div className='w-10/12 flex flex-col md:flex-row items-start justify-center'>
        <div className='w-full border-r py-4 px-6'>
          <p className="text-xl font-medium mb-4 border-b py-2">Shipping Address</p>
          <div>
            <div className='flex flex-row'>
              <div className='flex flex-col w-full mr-2'>
                <label htmlFor="fname" className="mt-2 mb-2 block">First Name</label>
                <input type="text" name="fname" value={currentAddress.fname} onChange={handleCurrentAddressChange} className="w-full border border-gray-200 px-4 py-3 text-sm rounded outline-none focus:z-10 focus:border-gray-400" />
              </div>
              <div className='w-full flex flex-col ml-2'>
                <label htmlFor="lname" className="mt-2 mb-2 block">Last Name</label>
                <input type="text" name="lname" value={currentAddress.lname} onChange={handleCurrentAddressChange} className="w-full border border-gray-200 px-4 py-3 text-sm rounded outline-none focus:z-10 focus:border-gray-400" />
              </div>
            </div>
            <div className='flex flex-col w-full'>
              <label htmlFor="phone" className="mt-4 mb-2 block">Phone No</label>
              <input type="tel" name="phone" value={currentAddress.phone} onChange={handleCurrentAddressChange} className="w-full border rounded border-gray-200 px-4 py-3 text-sm outline-none focus:z-10 focus:border-gray-400" />
            </div>
            <div className='flex flex-col w-full'>
              <label htmlFor="area1" className="mt-4 mb-2 block">Address Line 1</label>
              <input type="text" name="area1" value={currentAddress.area1} onChange={handleCurrentAddressChange} className="w-full border rounded border-gray-200 px-4 py-3 text-sm outline-none focus:z-10 focus:border-gray-400" />
            </div>
            <div className='w-full flex flex-col'>
              <label htmlFor="area2" className="mt-4 mb-2 block">Address Line 2</label>
              <input type="text" name="area2" value={currentAddress.area2} onChange={handleCurrentAddressChange} className="w-full border border-gray-200 px-4 py-3 text-sm rounded outline-none focus:z-10 focus:border-gray-400" />
            </div>
            <div className='w-full flex flex-col'>
              <label htmlFor="city" className="mt-4 mb-2 block">City</label>
              <input type="text" name="city" value={currentAddress.city} onChange={handleCurrentAddressChange} className="w-full border border-gray-200 px-4 py-3 text-sm rounded outline-none focus:z-10 focus:border-gray-400" />
            </div>
            <div className='flex flex-row'>
              <div className='flex flex-col w-full mr-2'>
                <label htmlFor="state" className="mt-2 mb-2 block">State</label>
                <input type="text" name="state" value={currentAddress.state} onChange={handleCurrentAddressChange} className="w-full border border-gray-200 px-4 py-3 text-sm rounded outline-none focus:z-10 focus:border-gray-400" />
              </div>
              <div className='w-full flex flex-col ml-2'>
                <label htmlFor="pincode" className="mt-2 mb-2 block">Zip Code</label>
                <input type="tel" name="pincode" value={currentAddress.pincode} onChange={handleCurrentAddressChange} className="w-full border border-gray-200 px-4 py-3 text-sm rounded outline-none focus:z-10 focus:border-gray-400" />
              </div>
            </div>
          </div>
        </div>
        <div className="w-full flex flex-col items-center md:items-start justify-center py-2">
          <div className='w-full flex flex-col px-6 py-4'>
            <p className="text-xl font-medium">Order Summary</p>
            <div className='flex flex-col w-full pt-2 items-center justify-center'>
              <div className="flex w-full flex-col justify-center border md:border-y md:border-x-0 sm:px-4">
                {checkout && checkout.cartItems && checkout.cartItems.map((cartItem, ci) => (
                  <div key={ci}>
                    <CheckoutCard ci={ci} cartItem={cartItem} productItem={products[ci]} handleAlert={handleAlert} />
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
                  <td className='w-3/12'>${checkout?.totalAmount}</td>
                </tr>
                <tr>
                  <td className='w-9/12'>Delivery Charge:</td>
                  <td className='w-3/12'>$30</td>
                </tr>
                <tr>
                  <td className='w-9/12 font-medium pt-3'>Total:</td>
                  <td className='w-3/12 font-medium pt-3'>${checkout?.totalAmount && checkout.totalAmount + 30}</td>
                </tr>
              </tbody>
            </table>
            <span className='px-5 text-sm italic text-gray-400'>(Inclusive of tax $0.00)</span>
            <div className='flex items-center justify-center w-full py-2 mt-6 bg-black font-medium text-white'>
              <button onClick={continueToPayment}>Continue to Payment</button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Checkout;
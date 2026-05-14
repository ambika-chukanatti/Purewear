import React, { useState, useEffect } from 'react';
import { Header, Footer, Alerts, Loading } from '../components';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from "axios";
import { PaymentStatusSkeleton } from '../components/SkeletonAnimations';

const PaymentStatus = () => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);
  const [setupDone, setSetupDone] = useState(false);
  const [status, setStatus] = useState("default");
  const [intentId, setIntentId] = useState(null);
  const [order, setOrder] = useState({});
  const [alerts, setAlerts] = useState([]);

  const location = useLocation();
  const navigate = useNavigate();
  const server = 'purewear.onrender.com';

  const addAlert = (type, message) => {
    setAlerts(prev => [...prev, { alertOn: true, type, message }]);
  };

  const handleAuthError = (err) => {
    if (err.response?.status === 401) navigate('/');
    addAlert('error', err.message);
  };

  const SuccessIcon = (
    <svg className="stroke-2 stroke-current text-green-600 h-8 w-8 mr-2 flex-shrink-0" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M0 0h24v24H0z" stroke="none" />
      <circle cx="12" cy="12" r="9" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );

  const ErrorIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className='h-8 w-8' version="1.1" viewBox="0 0 29 29" xmlSpace="preserve">
      <path d="M14.637 27.065a12.457 12.457 0 0 1-8.838-3.655c-4.874-4.874-4.874-12.804 0-17.678a12.419 12.419 0 0 1 8.839-3.662c3.339 0 6.478 1.3 8.838 3.662 2.361 2.361 3.662 5.5 3.662 8.839s-1.3 6.478-3.662 8.839a12.46 12.46 0 0 1-8.839 3.655zm.001-22.995a10.428 10.428 0 0 0-7.425 3.076c-1.983 1.983-3.075 4.62-3.075 7.425s1.092 5.441 3.075 7.425c4.094 4.094 10.756 4.095 14.849 0 1.983-1.983 3.076-4.62 3.076-7.425s-1.092-5.441-3.076-7.425a10.432 10.432 0 0 0-7.424-3.076z" fill="#b91c1c" />
      <path d="M10.395 19.813a.999.999 0 0 1-.707-1.707l8.485-8.485a.999.999 0 1 1 1.414 1.414l-8.485 8.485a.993.993 0 0 1-.707.293z" fill="#b91c1c" />
      <path d="M18.88 19.813a.997.997 0 0 1-.707-.293l-8.485-8.485a.999.999 0 1 1 1.414-1.414l8.485 8.485a.999.999 0 0 1-.707 1.707z" fill="#b91c1c" />
    </svg>
  );

  const InfoIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 50 50">
      <path d="M 25 2 C 12.309295 2 2 12.309295 2 25 C 2 37.690705 12.309295 48 25 48 C 37.690705 48 48 37.690705 48 25 C 48 12.309295 37.690705 2 25 2 z M 25 4 C 36.609824 4 46 13.390176 46 25 C 46 36.609824 36.609824 46 25 46 C 13.390176 46 4 36.609824 4 25 C 4 13.390176 13.390176 4 25 4 z M 25 11 A 3 3 0 0 0 22 14 A 3 3 0 0 0 25 17 A 3 3 0 0 0 28 14 A 3 3 0 0 0 25 11 z M 21 21 L 21 23 L 22 23 L 23 23 L 23 36 L 22 36 L 21 36 L 21 38 L 22 38 L 23 38 L 27 38 L 28 38 L 29 38 L 29 36 L 28 36 L 27 36 L 27 21 L 26 21 L 22 21 L 21 21 z" />
    </svg>
  );

  const STATUS_CONTENT_MAP = {
    succeeded: {
      text: "Order Placed!",
      bg_color: "bg-green-100",
      text_color: "text-green-700",
      icon: SuccessIcon,
      message: "Your order will be delivered in 2-3 working days. Information about order summary sent to your email.",
    },
    processing: {
      text: "Your payment is processing.",
      bg_color: "bg-yellow-100",
      text_color: "text-yellow-700",
      icon: InfoIcon,
      message: "Your order is processing. Please wait.."
    },
    requires_payment_method: {
      text: "Your payment was not successful, please try again.",
      bg_color: "bg-red-100",
      text_color: "text-red-700",
      icon: ErrorIcon,
      message: "Your order is cancelled. If you wish to continue the payment please go to cart and place order"
    },
    default: {
      text: "Something went wrong, please try again.",
      bg_color: "bg-red-100",
      text_color: "text-red-700",
      icon: ErrorIcon,
      message: "Your order is cancelled. If you wish to continue the payment please go to cart and place order"
    }
  };

  const setup = async () => {
    setSetupDone(false);
    try {
      const res1 = await axios.post(`https://${server}/api/user/checkout/get`, {}, { withCredentials: true });
      if (res1.data.success) {
        const checkoutData = res1.data.data;
        const res2 = await axios.post(`https://${server}/api/user/order/create`, checkoutData, { withCredentials: true });
        if (res2.data.success) {
          setOrder(res2.data.data);
          await axios.post(`https://${server}/api/user/cart/clear`, {}, { withCredentials: true });
        }
        const res3 = await axios.post(`https://${server}/api/user/profile/get`, {}, { withCredentials: true });
        if (res3.data.success) setUser(res3.data.data);
      }
    } catch (err) {
      handleAuthError(err);
    } finally {
      setSetupDone(true);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const param1 = params.get('payment_intent');
    const param3 = params.get('redirect_status');
    setStatus(param3 ?? 'default');
    setIntentId(param1);
    if (param3 === 'succeeded') setup();
  }, []);

  const handleAlertCancel = (i) => {
    setAlerts(prev => { const updated = [...prev]; updated.splice(i, 1); return updated; });
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`https://${server}/api/auth/logout`, {}, { withCredentials: true });
      if (response.data.success) navigate('/');
    } catch (err) {
      handleAuthError(err);
    } finally {
      setLoading(false);
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

      {setupDone === false ? <PaymentStatusSkeleton /> : (
        <div className='w-full flex flex-col justify-center items-center pt-32 pb-24'>
          <div className={`w-3/5 ${STATUS_CONTENT_MAP[status].bg_color} rounded-md p-4 flex flex-col justify-center items-center`}>
            <div className={`${STATUS_CONTENT_MAP[status].text_color} w-full flex flex-col md:flex-row justify-center md:justify-between`}>
              <div className='flex flex-row justify-center pl-0 sm:pl-8 pr-4 pb-1'>
                {STATUS_CONTENT_MAP[status].icon}
                <div className="font-bold text-xl">{STATUS_CONTENT_MAP[status].text}</div>
              </div>
              <div className='flex justify-center'>
                {status === 'succeeded' && <span className='text-sm font-bold py-2 md:py-0 overflow-cover'>#{order._id}</span>}
              </div>
            </div>
            <div className={`${STATUS_CONTENT_MAP[status].text_color} pl-8`}>
              <div>{STATUS_CONTENT_MAP[status].message}</div>
              {status === 'succeeded' && <div className='text-l font-bold'>Thank you for shopping with us!</div>}
            </div>
          </div>
          <Link to='/dashboard' className="group mt-12 flex w-60 cursor-pointer select-none items-center justify-center bg-black py-2 text-white transition">
            <span className="group flex w-2/3 items-center justify-center py-1 text-center font-medium">Continue Shopping</span>
            <svg className="flex-0 mt-2 group-hover:w-7 ml-2 h-5 items-center w-0 transition-all" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 34 34" stroke="currentColor" strokeWidth="2">
              <path d="m31.71 15.29-10-10-1.42 1.42 8.3 8.29H0v2h28.59l-8.29 8.29 1.41 1.41 10-10a1 1 0 0 0 0-1.41z" data-name="3-Arrow Right" />
            </svg>
          </Link>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default PaymentStatus;
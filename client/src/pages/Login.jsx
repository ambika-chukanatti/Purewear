import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loading, Alerts } from '../components';
import img1 from '../assets/img1.jpg';
import axios from 'axios';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [userData, setUserData] = useState({
    email: '',
    password: ''
  });

  const navigate = useNavigate();
  const server = 'purewear.onrender.com';

  const addAlert = (type, message) => {
    setAlerts(prev => [...prev, { alertOn: true, type, message }]);
  };

  const handleUserDataChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`https://${server}/api/auth/login`, userData, { withCredentials: true });
      if (response.data.success) {
        navigate('/dashboard');
      }
    } catch (err) {
      addAlert('error', err.message);
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

  return (
    <div className='relative w-full h-screen flex flex-col md:flex-row'>
      {loading && (
        <div className='fixed z-50 top-1/2 left-1/2 flex justify-center items-center'>
          <Loading />
        </div>
      )}
      <div className='w-full z-40 flex flex-col items-end fixed px-3 right-1 md:right-4 top-8'>
        {alerts.map((alert, i) => (
          <Alerts key={i} i={i} alertOn={alert.alertOn} type={alert.type} message={alert.message} handleAlertCancel={handleAlertCancel} />
        ))}
      </div>
      <div className="absolute top-8 left-8 flex items-center font-bold text-gray-800 text-2xl mb-4">
        <svg className="fill-current text-gray-800 mr-2" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24">
          <path d="M5,22h14c1.103,0,2-0.897,2-2V9c0-0.553-0.447-1-1-1h-3V7c0-2.757-2.243-5-5-5S7,4.243,7,7v1H4C3.447,8,3,8.447,3,9v11 C3,21.103,3.897,22,5,22z M9,7c0-1.654,1.346-3,3-3s3,1.346,3,3v1H9V7z M5,10h2v2h2v-2h6v2h2v-2h2l0.002,10H5V10z" />
        </svg>
        PUREWEAR
      </div>
      <div className='w-full h-full'>
        <img src={img1} className='w-full h-full object-cover inset-0' />
      </div>
      <div className='w-full flex flex-col items-center justify-center py-48 md:py-0'>
        <div className='w-3/5 mb-4'>
          <h2 className='font-bold text-xl'>Welcome!</h2>
          <p className='text-gray-400 text-xs mt-1'>Please login here.</p>
        </div>
        <div className='w-3/5 flex flex-col justify-center'>
          <label>Email Address:</label>
          <input className='py-2 border border-gray-400 rounded-lg mt-2 mb-4 outline-gray-400 px-4' type='email' required name='email' value={userData.email} onChange={handleUserDataChange} />
          <label>Password:</label>
          <input className='py-2 border border-gray-400 rounded-lg mt-2 mb-4 outline-gray-400 px-4' type='password' required name='password' value={userData.password} onChange={handleUserDataChange} />
          <button className='bg-black text-white py-2 rounded-lg my-2' onClick={handleLogin}>Login</button>
        </div>
        <div className='w-3/5 mt-2 flex justify-between'>
          <Link to="/signup">Create an account?</Link>
          <Link to="/password/forgot">Forgot Password</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
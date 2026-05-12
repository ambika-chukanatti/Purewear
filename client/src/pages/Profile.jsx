import React, { useEffect, useState } from 'react';
import { Header, Footer, EditAddress, EditProfile, Alerts, Loading } from '../components';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Profile = () => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({});
  const [addresses, setAddresses] = useState({});
  const [isProfile, setIsProfile] = useState(true);
  const [alerts, setAlerts] = useState([]);

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

  const handleIsProfile = () => setIsProfile(prev => !prev);

  const setup = async () => {
    setLoading(true);
    try {
      const res1 = await axios.post(`https://${server}/api/user/profile/get`, {}, { withCredentials: true });
      const res2 = await axios.post(`https://${server}/api/user/address/get`, {}, { withCredentials: true });
      setUser(res1.data.data);
      setAddresses(res2.data.data);
    } catch (err) {
      handleAuthError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setup();
  }, []);

  const updateUserProfile = async (userData) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `https://${server}/api/user/profile/update`,
        {
          fname: userData.fname,
          lname: userData.lname,
          phone: userData.phone,
          email: userData.email
        },
        { withCredentials: true }
      );
      if (response.status === 200) {
        setUser(response.data.data);
        addAlert('success', 'User data updated');
      }
    } catch (err) {
      handleAuthError(err);
    } finally {
      setLoading(false);
    }
  };

  const addAddress = async (newAddress, isDefault) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `https://${server}/api/user/address/add`,
        { newAddress, isDefault },
        { withCredentials: true }
      );
      if (response.data.success) {
        setAddresses(response.data.data);
        addAlert('success', 'New address added');
      }
    } catch (err) {
      handleAuthError(err);
    } finally {
      setLoading(false);
    }
  };

  const editAddress = async (address, ai, isDefault) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `https://${server}/api/user/address/update`,
        { address, ai, isDefault },
        { withCredentials: true }
      );
      if (response.data.success) {
        setAddresses(response.data.data);
        addAlert('success', 'Address updated successfully');
      }
    } catch (err) {
      handleAuthError(err);
    } finally {
      setLoading(false);
    }
  };

  const removeAddress = async (ai) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `https://${server}/api/user/address/remove`,
        { ai },
        { withCredentials: true }
      );
      if (response.data.success) {
        setAddresses(response.data.data);
        addAlert('success', 'Address deleted successfully');
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

  return (
    <div className='relative w-full flex flex-col items-center'>
      <Header user={user} handleLogout={handleLogout} />
      <Link to='/dashboard' className='w-11/12 flex justify-start py-3'>
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
      <div className='w-11/12 flex md:flex-row flex-col items-start justify-center pt-8'>
        <div className='md:w-1/4 w-full border border-gray-400 flex md:flex-col flex-row items-center justify-start'>
          <h2 className='md:block hidden font-bold text-lg py-2'>Account</h2>
          <div className='py-2 border w-full flex flex-row items-center justify-center md:mx-0 mx-4'>
            <img src="https://as1.ftcdn.net/v2/jpg/03/53/11/00/1000_F_353110097_nbpmfn9iHlxef4EDIhXB1tdTD0lcWhG9.jpg" alt="profile" className='rounded-full w-8 h-8 object-cover mx-2' />
            <h1>{user?.fname} {user?.lname}</h1>
          </div>
          <div className='flex flex-col w-full items-center justify-start md:h-[64vh] md:pt-4 pt-2'>
            <div className={`py-1 cursor-pointer ${isProfile ? 'font-bold' : ''}`} onClick={handleIsProfile}>Profile</div>
            <div className={`py-1 cursor-pointer ${isProfile ? '' : 'font-bold'}`} onClick={handleIsProfile}>Addresses</div>
          </div>
        </div>
        <div className='md:w-3/4 w-full flex items-center justify-center'>
          <div className='w-full'>
            {isProfile
              ? <EditProfile user={user} updateUserProfile={updateUserProfile} />
              : <EditAddress userAddress={addresses} addAddress={addAddress} editAddress={editAddress} removeAddress={removeAddress} />
            }
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
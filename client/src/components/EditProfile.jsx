import React, { useState, useEffect } from 'react'

const EditProfile = ({user, updateUserProfile}) => {
  const [userData, setUserData] = useState({
    fname: '',
    lname: '',
    phone: '',
    email: ''
  })

  useEffect(() => {
    if (user) {
      setUserData({
        fname: user.fname,
        lname: user.lname,
        phone: user.phone,
        email: user.email
      });
    }
  }, [user])

  const isValidEmail = (email) => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
  }

  const handleChange = (e) => {
    if(e.target.name=='email'){
      if(isValidEmail(e.target.value)){
        setUserData({...userData, ['email']:e.target.value})
      }else{
        alert("Enter valid email id")
      }
    }
    setUserData({...userData, [e.target.name]:e.target.value})
  }

  return (
    <div className='w-full flex flex-col items-center justify-center border border-gray-400 px-4'>
        <div className='flex justify-center w-full py-4 text-lg font-bold'><span>Edit Details</span></div>
        <div className='w-3/4'>
          <div className='w-full flex flex-row'>
            <div className='flex flex-col w-full mr-2'>
              <label for="fname" class="mt-2 mb-2 block">First Name</label>
              <input type="text" name="fname" value={userData.fname} onChange={handleChange} class="w-full border border-gray-200 px-4 py-3 text-sm shadow-sm rounded outline-none focus:z-10 focus:border-gray-400"/>
            </div>
            <div className='w-full flex flex-col ml-2'>
              <label for="lname" class="mt-2 mb-2 block">Last Name</label>
              <input type="text" name="lname" value={userData.lname} onChange={handleChange} class="w-full border border-gray-200 px-4 py-3 text-sm shadow-sm rounded outline-none focus:z-10 focus:border-gray-400"/>
            </div>
          </div>
          <div className='w-full flex flex-col'>
            <label for="email" class="mt-4 mb-2 block">Email</label>
            <input type="email" name="email" value={userData.email} onChange={handleChange} class="w-full border border-gray-200 px-4 py-3 text-sm shadow-sm rounded outline-none focus:z-10 focus:border-gray-400"/>
          </div>
          <div className='w-full flex flex-col'>
            <label for="phone" class="mt-4 mb-2 block">Phone no</label>
            <input type="tel" maxLength="10" pattern="\d{10}" name="phone" value={userData.phone} onChange={handleChange} class="w-full border border-gray-200 px-4 py-3 text-sm shadow-sm rounded outline-none focus:z-10 focus:border-gray-400"/>
          </div>
          <button class="my-8 w-full bg-gray-900 px-6 py-3 font-medium text-white rounded" onClick={()=>updateUserProfile(userData)}>Save Details</button>
        </div>   
    </div>
  )
}

export default EditProfile
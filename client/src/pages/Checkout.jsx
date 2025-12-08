import React, { useState, useEffect} from 'react';
import { Header, Footer,CheckoutCard, Alerts, Loading } from '../components';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";

const Checkout = () => {
    const [loading, setLoading] = useState(false)
    const [user, setUser] = useState({})
    const [checkout, setCheckout] = useState({})
    const [products, setProducts] = useState([])
    const [addresses, setAddresses] = useState([])
    const [alerts, setAlerts] = useState([])
    const [currentAddress, setCurrentAddress] = useState({
      fname: '',
      lname: '', 
      phone: '',
      area1: '',
      area2: '',
      city: '',
      state: '',
      pincode: ''
    })

    const navigate = useNavigate()

    const setup = async() => {
        const data = {
        }
        setLoading(true)
        try{
            const res1 = await axios.post('https://purewear-server.onrender.com/api/user/address/get',data,{withCredentials:true})
            const res2 = await axios.post('https://purewear-server.onrender.com/api/user/checkout/get', data,{withCredentials:true})
            const res3 = await axios.post('https://purewear-server.onrender.com/api/user/profile/get',{},{withCredentials: true})
            if(res2.data.success){
              setCheckout(res2.data.data)
              const cartItems = res2.data.data.cartItems

                const productPromises = cartItems.map(async (item) => {
                    const res3 = await axios.get(`https://purewear-server.onrender.com/api/product/get/${item.pid}`);
                    return res3.data.data;
                });

                const productsData = await Promise.all(productPromises)
                setProducts(productsData)
            }
    
            if(res1.data.success){
              const addressData = res1.data.data
              setAddresses(addressData)
              if(addressData.addressList.length>=1){
                setCurrentAddress(addressData.addressList[addressData.defaultAddressIndex])
              }
            }

            if(res3.data.success){
              setUser(res3.data.data)
            }
        }catch(err){
          if(err.status==401){
            navigate('/')
          }
          setAlerts([...alerts,{alertOn:true, type:'error',message:err.message}])
        }finally{
          setLoading(false)
        }
      }
    
      useEffect(()=>{
        setup()
      },[])

    const handleCurrentAddressChange = (e) => {
      if(e.target.name=='phone' || e.target.name=='pincode'){
        const data = Number(e.target.value)
        setCurrentAddress({...currentAddress, [e.target.name]:data})
      }else{
        setCurrentAddress({...currentAddress, [e.target.name]:e.target.value})
      }
    }

    const continueToPayment = async() => {
      const data = {
        address: currentAddress
      }
      setLoading(true)
      try{
        const response = await axios.post('https://purewear-server.onrender.com/api/user/checkout/update',data,{withCredentials:true})
        console.log(response.data.data)
        
        if(response.data.success){
          navigate('/cart/checkout/payment')
        }
      }catch(err){
        if(err.status==401){
          navigate('/')
        }
        setAlerts([...alerts,{alertOn:true, type:'error',message:err.message}])
      }finally{
        setLoading(false)
      }
    }

    const handleAlertCancel = (i) => {
      const updatedAlert = [...alerts]
      updatedAlert.splice(i,1)
      setAlerts(updatedAlert)
    }

    const handleLogout = async() => {
      setLoading(true)
      try{
        const response = await axios.post('https://purewear-server.onrender.com/api/auth/logout',{},{withCredentials: true})
        if(response.data.success){
          navigate('/')
        }
      }catch(err){
        if(err.status==401){
          navigate('/')
        }
        setAlerts([...alerts,{alertOn:true, type:'error',message:err.message}])
      }finally{
        setLoading(false)
      }
    }

    const handleAlert = (status,message) => {
      setAlerts([...alerts,{alertOn:true, type:status, message:message}])
    }

    return (
        <div className='w-full flex flex-col items-center justify-center'>
            <Header user={user} handleLogout={handleLogout}/>
            <Link to={`/cart`} className='w-11/12 flex justify-start py-3'>
                <svg xmlns="http://www.w3.org/2000/svg" className='w-6 h-6 cursor-pointer' viewBox="0 0 32 32"><path d="M32 15H3.41l8.29-8.29-1.41-1.42-10 10a1 1 0 0 0 0 1.41l10 10 1.41-1.41L3.41 17H32z" data-name="4-Arrow Left"/></svg>
            </Link>
            { loading && 
              <div className='fixed z-50 top-1/2 left-1/2 flex justify-center items-center'>
                  <Loading/>
              </div>
            }
            <div className='w-full z-40 flex flex-col items-end fixed px-3 right-1 md:right-4 top-14'>
                { alerts.map((alert,i) => (
                  <Alerts i={i} alertOn={alert.alertOn} type={alert.type} message={alert.message} handleAlertCancel={handleAlertCancel}/>
                ))}
            </div>
            <div className='w-10/12 flex flex-col md:flex-row items-start justify-center'>
              { addresses && addresses.addressList && addresses.addressList.map(address => {
                <div className=''>
                  <div>
                    <input type="radio"/>
                  </div>
                  <div className='shadow border border-gray-300 px-4 py-2'>
                      <h4 className='font-medium pb-1'>{address.fname} {address.lname}</h4>
                      <p>{address.area1}<br/>{address.area2}<br/>{address.city} {address.state} - {address.pincode}</p>
                      <p className='text-xs text-gray-600 pt-1 mb-4'>Mobile No: {address.pnone}</p>
                  </div>
                </div>
              })}
                <div className='w-full border-r py-4 px-6'>
                <p class="text-xl font-medium mb-4 border-b py-2">Shipping Address</p>
                <div className=''>
                  <div className='flex flex-row'>
                      <div className='flex flex-col w-full mr-2'>
                          <label for="fname" class="mt-2 mb-2 block">First Name</label>
                          <input type="text" name="fname" value={currentAddress.fname} onChange={handleCurrentAddressChange} class="w-full border border-gray-200 px-4 py-3 text-sm  rounded outline-none focus:z-10 focus:border-gray-400"/>
                      </div>
                      <div className='w-full flex flex-col ml-2'>
                          <label for="lname" class="mt-2 mb-2 block">Last Name</label>
                          <input type="text" name="lname" value={currentAddress.lname} onChange={handleCurrentAddressChange} class="w-full border border-gray-200 px-4 py-3 text-sm  rounded outline-none focus:z-10 focus:border-gray-400"/>
                  </div>
                  </div>
                  <div className='flex flex-col w-full'>
                  <label for="phone" class="mt-4 mb-2 block">Phone No</label>
                  <input type="tel" name="phone" max="10" value={currentAddress.phone} onChange={handleCurrentAddressChange} class="w-full border rounded phone-input border-gray-200 px-4 py-3 text-sm  outline-none focus:z-10 focus:border-gray-400"/>
                </div>
                <div className='flex flex-col w-full'>
                  <label for="area1" class="mt-4 mb-2 block">Address Line 1</label>
                  <input type="text" name="area1" value={currentAddress.area1} onChange={handleCurrentAddressChange} class="w-full border rounded border-gray-200 px-4 py-3 text-sm  outline-none focus:z-10 focus:border-gray-400"/>
                </div>
                <div className='w-full flex flex-col'>
                  <label for="area2" class="mt-4 mb-2 block">Address Line 2</label>
                  <input type="text" name="area2" value={currentAddress.area2} onChange={handleCurrentAddressChange} class="w-full border border-gray-200 px-4 py-3 text-sm rounded  outline-none focus:z-10 focus:border-gray-400"/>
                </div>
                <div className='w-full flex flex-col'>
                  <label for="city" class="mt-4 mb-2 block">City</label>
                  <input type="text" name="city" value={currentAddress.city} onChange={handleCurrentAddressChange} class="w-full border border-gray-200 px-4 py-3 text-sm rounded  outline-none focus:z-10 focus:border-gray-400"/>
                </div>
                <div className='flex flex-row'>
                      <div className='flex flex-col w-full mr-2'>
                          <label for="state" class="mt-2 mb-2 block">State</label>
                          <input type="text" name="state" value={currentAddress.state} onChange={handleCurrentAddressChange} class="w-full border border-gray-200 px-4 py-3 text-sm rounded outline-none focus:z-10 focus:border-gray-400"/>
                      </div>
                      <div className='w-full flex flex-col ml-2'>
                          <label for="pincode" class="mt-2 mb-2 block">Zip Code</label>
                          <input type="tel" max="5" name="pincode" value={currentAddress.pincode} onChange={handleCurrentAddressChange} class="w-full border border-gray-200 px-4 py-3 text-sm rounded outline-none focus:z-10 focus:border-gray-400"/>
                      </div>
                  </div>
              </div>
                </div>
                <div class="w-full flex flex-col items-center md:items-start justify-center py-2">
          <div className='w-full flex flex-col px-6 py-4'>
            <p class="text-xl font-medium">Order Summary</p>
            <div className='flex flex-col w-full pt-2 items-center justify-center'>
                <div class="flex w-full flex-col justify-center border md:border-y md:border-x-0 sm:px-4">
                  {checkout && checkout.cartItems && checkout.cartItems.map((cartItem, ci)=>(
                      <div key={ci}>
                        <CheckoutCard ci={ci} cartItem={cartItem} productItem={products[ci]} handleAlert={handleAlert}/>
                      </div>
                    ))
                  }
                </div>
            </div>
          </div>
          <div className='w-full mt-4 md:mt-0 px-6 border md:border-none'>
            <table className='w-full ml-4'>
                <tr>
                    <td className='w-9/12'>SubTotal:</td>
                    <td className='w-3/12'>${checkout && checkout.totalAmount && checkout.totalAmount}</td>
                </tr>
                <tr>
                    <td className='w-9/12'>Delivery Charge:</td>
                    <td className='w-3/12'>$30</td>
                </tr>
                <tr className=''>
                    <td className='w-9/12 font-medium pt-3'>Total:</td>
                    <td className='w-3/12 font-medium pt-3'>${checkout && checkout.totalAmount && checkout.totalAmount+30}</td>
                </tr>
            </table>
              <span className='px-5 text-sm italic text-gray-400'>(Inclusive of tax $0.00)</span>
              <div className='flex items-center justify-center w-full py-2 mt-6 bg-black font-medium text-white'>
                <button onClick={continueToPayment}>Continue to Payment</button>
              </div>
          </div>
          </div>
            </div>
            <Footer/>
        </div>
    )
}

export default Checkout
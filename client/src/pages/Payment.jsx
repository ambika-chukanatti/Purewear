import React, { useState, useEffect} from 'react';
import { Header, Footer,CheckoutCard, CheckoutForm, Alerts, Loading } from '../components';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const Payment = () => {
    const [loading, setLoading] = useState(false)
    const [user, setuser] = useState({})
    const [products, setProducts] = useState([])
    const [total, setTotal] = useState(0)
    const [clientSecret, setClientSecret] = useState('')
    const [checkout, setCheckout] = useState({})
    const [alerts, setAlerts] = useState([])

    const navigate = useNavigate()

    const stripePromise = loadStripe("pk_test_51Q6TTCAOg9YpRsPQyX84dXHKVPrhmUTLpo2Zq39PrrzgIAbGF557FUKfzWSmpct5OuNRxBv0ZaCzuqvWD6AGkFnR00QAeYNpxB")

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

    const setup = async() => {
        const data = {
        }
        setLoading(true)
        try{
            const res1 = await axios.post('https://purewear-server.onrender.com/api/user/profile/get',data,{withCredentials:true})
            if(res1.data.success){
              setuser(res1.data.data)
            }
            const res2 = await axios.post('https://purewear-server.onrender.com/api/user/checkout/get', data,{withCredentials:true})
            if(res2.data.success){
              setCheckout(res2.data.data)
              console.log(res2)
              const cartItems = res2.data.data.cartItems

                const productPromises = cartItems.map(async (item) => {
                    const res3 = await axios.get(`https://purewear-server.onrender.com/api/product/get/${item.pid}`);
                    return res3.data.data;
                });

                const productsData = await Promise.all(productPromises)
                setProducts(productsData)

                let updatedTotal = 0
                productsData.forEach((product,pi) => {
                    updatedTotal += product.price*cartItems[pi].quantity
                })
                setTotal(updatedTotal)

                const paymentData = {
                  amount: (updatedTotal+30)*100
                }

                const res4 = await axios.post('https://purewear-server.onrender.com/api/user/cart/checkout/payment',paymentData,{withCredentials:true})
                if(res4.data.success){
                  setClientSecret(res4.data.clientSecret)
                }
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

      const updatePaymentMethod = async(paymentMethod) => {
        const data = {
          paymentMethod: paymentMethod
        }
        setLoading(true)
        try{
          const response = await axios.post('https://purewear-server.onrender.com/api/user/checkout/update',data,{withCredentials:true})
          setCheckout(response.data.data)
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

      console.log(checkout)

    return (
        <div className='relative w-full flex flex-col items-center justify-center'>
            <Header user={user} handleLogout={handleLogout}/>
            <Link to={`/cart/checkout`} className='w-11/12 flex justify-start py-3'>
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
            <div className='w-11/12 flex flex-col md:flex-row items-start justify-center'>
            { clientSecret && 
              <Elements options={{clientSecret, appearance, loader}} stripe={stripePromise}>
                  <CheckoutForm user={user} checkout={checkout} updatePaymentMethod={updatePaymentMethod} handleAlert={handleAlert}/>
              </Elements>
            }
                <div class="w-full flex flex-col items-center md:items-start justify-center py-8 md:py-2">
          <div className='w-full flex flex-col px-6 py-3'>
            <p class="text-xl font-medium">Order Summary</p>
            <div className='flex flex-col w-full pt-2 items-center justify-center'>
                <div class="flex w-full flex-col justify-center border md:border-y md:border-x-0 sm:px-4">
                  {checkout && checkout.cartItems && checkout.cartItems.map((cartItem, ci)=>(
                      <div key={ci}>
                        <CheckoutCard ci={ci} cartItem={cartItem} productItem={products[ci]}/>
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
                    <td className='w-3/12'>${total}</td>
                </tr>
                <tr>
                    <td className='w-9/12'>Delivery Charge:</td>
                    <td className='w-3/12'>$30</td>
                </tr>
                <tr className=''>
                    <td className='w-9/12 font-medium pt-3'>Total:</td>
                    <td className='w-3/12 font-medium pt-3'>${total+30}</td>
                </tr>
            </table>
              <span className='px-5 text-sm italic text-gray-400'>(Inclusive of tax $0.00)</span>
          </div>
          </div>
            </div>
            <Footer/>
        </div>
    )
}

export default Payment
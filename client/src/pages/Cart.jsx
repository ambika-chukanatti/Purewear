import React, { useState, useEffect} from 'react';
import axios from "axios";
import { Header, Footer, CartItem, Alerts, Loading } from '../components'
import { useNavigate, Link, useLocation } from 'react-router-dom';

const Cart = () => {
  const [loading, setLoading] = useState(false)
  const [token, setToken] = useState('')
  const [user, setUser] = useState({})
  const [total, setTotal] = useState(0)
  const [cart, setCart] = useState([])
  const [products, setProducts] = useState([])
  const [alerts, setAlerts] = useState([])
  const navigate = useNavigate()

  const setup = async() => {
    setLoading(true)
    try{
      const res2 = await axios.post('https://purewear-server.onrender.com/api/user/cart/get', {},{withCredentials:true}) 
      const cartItems = res2.data.data
      if(res2.data.success){
        setCart(cartItems)
      }
      
      const res1 = await axios.post('https://purewear-server.onrender.com/api/user/profile/get',{},{withCredentials: true})
      if(res1.data.success){
        setUser(res1.data.data)
      }
      const productPromises = cartItems.map(async (item) => {
        const res = await axios.get(`https://purewear-server.onrender.com/api/product/get/${item.pid}`);
        return res.data.data;
      });

      const productsData = await Promise.all(productPromises)
      setProducts(productsData)

      let updatedTotal = 0
      productsData.forEach((product,pi) => {
        updatedTotal += product.price*cartItems[pi].quantity
      })
      setTotal(updatedTotal)
    } catch (err) {
      if(err.status==401){
        navigate('/')
      }
      setAlerts([...alerts,{alertOn:true, type:'error',message:err.message}])
    } finally {
      setLoading(false)
    }
  }

  useEffect(()=>{
    setup()
  },[])

  const handleQuantity = async(name, cartItem, price) => {
    if(name=="plus"){
      setLoading(true)
      try{
        const data = {
          cid: cartItem._id,
          quantity: (cartItem.quantity)+1
        }
        const res = await axios.post("https://purewear-server.onrender.com/api/user/cart/update",data,{withCredentials:true})
        console.log(res)

        if(res.data.success){
          setCart(res.data.data)
          setTotal(prev => prev+price)
        }
      }catch(err){
        if(err.status==401){
          navigate('/')
        }
        setAlerts([...alerts,{alertOn:true, type:'error',message:err.message}])
      }finally{
        setLoading(false)
      }
    }else if(name=="minus"){
      setLoading(true)
      try{
        const data = {
          cid: cartItem._id,
          quantity: (cartItem.quantity)-1
        }

        const res = await axios.post("https://purewear-server.onrender.com/api/user/cart/update",data,{withCredentials:true})
        console.log(res)

        if(res.data.success){
          setCart(res.data.data)
          setTotal(prev => prev-price)
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
  }

  const handleDeleteItem = async(cartItem, price) => {
    setLoading(true)
    try{
      const data = {
        cid: cartItem._id
      }

      const res = await axios.post("https://purewear-server.onrender.com/api/user/cart/remove",data,{withCredentials:true})
      console.log(res)

      if(res.statusText=='OK'){
        setCart(res.data.data)
        setTotal(prev => prev-(cartItem.quantity*price))
        setAlerts([...alerts,{alertOn:true, type:'success',message:"Item removed from the cart"}])
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

  const handleCheckout = async() => {
    if(cart.length>0){
      const data = {
        cartItems: cart,
        totalAmount: total
      }
      setLoading(true)
      try{
        const res1 = await axios.post('https://purewear-server.onrender.com/api/user/checkout/create', data,{withCredentials:true})
        const res2 = await axios.post('https://purewear-server.onrender.com/api/user/cart/clear',{},{withCredentials:true})      
        if(res2.data.success){
          navigate('/cart/checkout')
        }
      }catch(err){
        if(err.status==401){
          navigate('/')
        }
        setAlerts([...alerts,{alertOn:true, type:'error',message:err.message}])
      }finally{
        setLoading(false)
      }
    }else{
      setAlerts([...alerts,{alertOn:true, type:'error',message:"There are no items in the cart"}])
    }
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

  const handleAlertCancel = (i) => {
    const updatedAlert = [...alerts]
    updatedAlert.splice(i,1)
    setAlerts(updatedAlert)
  }

  return (
    <div className='w-full flex flex-col items-center'>
        <Header user={user} handleLogout={handleLogout}/>
        { loading && 
          <div className='fixed z-50 top-1/2 left-1/2 flex justify-center items-center'>
              <Loading/>
          </div>
        }
        <Link to={`/dashboard`} className='w-11/12 flex justify-start py-3'>
          <svg xmlns="http://www.w3.org/2000/svg" className='w-6 h-6 cursor-pointer' viewBox="0 0 32 32"><path d="M32 15H3.41l8.29-8.29-1.41-1.42-10 10a1 1 0 0 0 0 1.41l10 10 1.41-1.41L3.41 17H32z" data-name="4-Arrow Left"/></svg>
        </Link>
        <div className='w-full z-40 flex flex-col items-end fixed px-3 right-1 md:right-4 top-14'>
          { alerts.map((alert,i) => (
            <Alerts i={i} alertOn={alert.alertOn} type={alert.type} message={alert.message} handleAlertCancel={handleAlertCancel}/>
          ))}
        </div>
        <div className='w-full flex items-center justify-center'> 
        <div class="w-10/12 flex flex-col md:flex-row items-center md:items-start justify-center py-2">
          <div className='w-full md:w-2/3 flex flex-col px-6 py-3 border-r'>
            <p class="text-xl font-medium pb-2 border-b">Products</p>
            <div className='flex flex-col w-full items-center justify-center'>
              { cart.length>0 ? 
                  <div class="flex w-full flex-col justify-center border md:border-y-0 md:border-x-0 sm:px-4">
                    {cart.map((cartItem, ci)=>(
                        <div key={ci}>
                          <CartItem ci={ci} cartItem={cartItem} productItem={products[ci]} handleQuantity={handleQuantity} handleDeleteItem={handleDeleteItem}/>
                        </div>
                      ))
                    }
                  </div>
                  : 
                  <div className='py-36 text-gray-600'>Your cart is empty</div>
                }
            </div>
          </div>
          <div className='w-11/12 md:w-1/3 mt-4 md:mt-0 py-2 px-6 border md:border-none'>
              <p class="text-xl font-medium border-b pb-3">Order Summary</p>
              <table className='w-full mt-4'>
                <tr>
                    <td className='w-9/12'>SubTotal:</td>
                    <td className='w-3/12'>${total}</td>
                </tr>
                <tr className='font-medium'>
                    <td className='w-9/12'>Total:</td>
                    <td className='w-3/12'>${total}</td>
                </tr>
            </table>
              <p className='text-sm italic text-gray-400'>(Inclusive of tax $0.00)</p>
              <div className='flex items-center justify-center w-full py-2 mt-6 bg-black font-medium text-white'>
                <button onClick={handleCheckout}>Checkout</button>
              </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Cart
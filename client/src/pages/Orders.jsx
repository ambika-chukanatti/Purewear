import React, { useEffect, useState } from 'react'
import { Header, Footer, OrderCard, Alerts, Loading } from '../components'
import axios from 'axios'
import { Link, useNavigate, useLocation } from 'react-router-dom'

const Orders = () => {
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState({})
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [alerts, setAlerts] = useState([])

  const navigate = useNavigate()

  const setup = async() => {
    setLoading(true)
    try{
      const res1 = await axios.post('https://purewear-server.onrender.com/api/user/orders/get', {},{withCredentials:true})
      const res2 = await axios.post('https://purewear-server.onrender.com/api/user/profile/get',{},{withCredentials: true})
      const orderItems = res1.data.orders
      orderItems.reverse()
      setOrders(orderItems)
      console.log(orderItems)

      const productPromises = orderItems.map(async (item) => {
        const subItemPromises = item.cartItems.map(async(subItem)=>{
          const res = await axios.get(`https://purewear-server.onrender.com/api/product/get/${subItem.pid}`)
          return res.data.data
        })
        return await Promise.all(subItemPromises)
      });

      const productsData = await Promise.all(productPromises)
      setProducts(productsData)
      console.log(productsData)

      if(res2.data.success){
        setUser(res2.data.data)
      }
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

  return (
    <div className='relative w-full flex flex-col items-center'>
      <Header user={user} handleLogout={handleLogout}/>
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
        <div className='w-11/12 mt-2 flex flex-col justify-center items-center'> 
          <Link to={`/dashboard`} className='w-full'>
              <svg xmlns="http://www.w3.org/2000/svg" className='flex w-6 h-6 cursor-pointer justify-start' viewBox="0 0 32 32"><path d="M32 15H3.41l8.29-8.29-1.41-1.42-10 10a1 1 0 0 0 0 1.41l10 10 1.41-1.41L3.41 17H32z" data-name="4-Arrow Left"/></svg>
          </Link>
          <p class="flex mt-2 w-full justify-start pl-8 text-xl font-bold">All Orders</p>
          <div className='flex flex-col w-full items-center justify-center mt-8'>
          {
            orders && orders.length>0 ? (
              <div className='flex flex-col w-full items-center justify-center'>
                { orders.map((order, oi) =>(
                  <div className='w-full flex justify-center gap-y-2 items-center px-8'>
                      <OrderCard order={order} product={products[oi]}/>
                  </div>
                  ))
                }
              </div>
              ) : (
                <div className='py-36 text-l'>No Orders Placed</div>
              )
            }
          </div>
        </div>
      <Footer/>
    </div>
  )
}

export default Orders
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Header, Footer, LikedCard, Alerts, Loading } from '../components'
import { Link, useNavigate, useLocation } from 'react-router-dom'

const Wishlist = () => {
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState({})
  const [wishlist, setWishlist] = useState([])
  const [alerts, setAlerts] = useState([])

  const navigate = useNavigate()

  const setup = async() => {
    setLoading(true)
    try{
      const res1 = await axios.post('https://purewear-server.onrender.com/api/user/wishlist/get',{},{withCredentials: true}) 
      const res2 = await axios.post('https://purewear-server.onrender.com/api/user/profile/get',{},{withCredentials: true})
      if(res2.data.success){
        setUser(res2.data.data)
      }
      const wishlist = res1.data.data
      console.log(wishlist)
      
      const productPromises = wishlist.map(async (item) => {
        const res = await axios.get(`https://purewear-server.onrender.com/api/product/get/${item}`);
        return res.data.data;
      });

      const productsData = await Promise.all(productPromises);
      productsData.reverse()
      setWishlist(productsData)
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

  const removeFromWishlist = async(pid) => {
    const data = {
      pid: pid
    }
    setLoading(true)
    try{
      const response = await axios.post(`https://purewear-server.onrender.com/api/user/wishlist/remove`, data, {withCredentials:true})
      if(response.data.success){
        setWishlist(wishlist.filter(item => item!== pid))
        setAlerts([...alerts,{alertOn:true, type:'success',message:"Removed from wishlist"}])
        setup()
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
  
  return (
    <div className='w-full flex flex-col items-center justify-center'>
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
          <p class="flex mt-2 w-full justify-start pl-8 text-xl font-bold">My Wishlist</p>
            {
            wishlist.length>0 ? (
              <div className='w-full flex justify-start items-center px-8'>
                <div className='flex grid lg:grid-cols-3 lg:gap-y-8 lg:gap-x-24 md:grid-cols-2 md:gap-x-12 md:gap-y-8 grid-cols-1 gap-y-6'>
                  {wishlist.map((product)=>(
                    <div key={product._id}>
                      <LikedCard product={product} removeFromWishlist={removeFromWishlist}/>
                    </div>
                  ))}
                </div>
              </div>
              ) : (
                <div className='py-36 text-l'>Your wishlist has no items</div>
              )
            }
        </div>
        <Footer/>
    </div>
  )
}

export default Wishlist
import React, { useState, useEffect } from 'react'
import { Header, Footer, Alerts, Loading } from '../components'
import axios from 'axios'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const Product = () => {
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState({})
  const [product, setProduct] = useState({})
  const [wishlist, setWishlist] = useState([])
  const [liked, setLiked] = useState(false)
  const [i, setI] = useState(0)
  const [cart, setCart] = useState([])
  const [cartItem, setCartItem] = useState({})
  const [alerts, setAlerts] = useState([])

  const location = useLocation()
  const pathSegments = location.pathname.split('/')
  const pid = pathSegments[2].toString()

  const navigate = useNavigate()

  const fetchProduct = async() => {
    setLoading(true)
    try{
      const res = await axios.get(`https://purewear-server.onrender.com/api/product/get/${pid}`)
      if(res.statusText=='OK'){
        const resItem = res.data.data
        setProduct(resItem)
        setCartItem({...cartItem, color:resItem.colors[0], size:resItem.sizes[0]})
      }

    }catch(err){
      setAlerts([...alerts,{alertOn:true, type:'error',message:err.message}])
    }finally{
      setLoading(false)
    }
  }

  const setup = async() => {
    setLoading(true)
    try{
      const res2 = await axios.post('https://purewear-server.onrender.com/api/user/wishlist/get',{},{withCredentials:true})
      const res3 = await axios.post('https://purewear-server.onrender.com/api/user/cart/get',{},{withCredentials:true})
      const res1 = await axios.post('https://purewear-server.onrender.com/api/user/orders/get', {},{withCredentials:true})
      if(res2.data.success){
        setWishlist(res2.data.data)
      }
      if(res3.data.success){
        setCart(res3.data.data) 
      }
      if(res2.data.data.includes(pid)){
        setLiked(true)
      }
      if(res1.data.success){
        setUser(res1.data.data)
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
    fetchProduct()
  },[])

  const handleLeftClick = () => {
    if(Number(i)>=product.imageUrls.length-1){
      setI(0)
    }else{
      setI(Number(i)+1)
    }
  }

  const handleRightClick = () => {
    if(Number(i)<=0){
      setI(product.imageUrls.length-1)
    }else{
      setI(Number(i)-1)
    }
  }

  console.log(i)

  const addToWishlist = async(pid) => {
    const data = {
      pid: pid
    }
    setLoading(true)
    try{
      const response = await axios.post('https://purewear-server.onrender.com/api/user/wishlist/add', data,{withCredentials:true})
      if(response.data.success){
        setWishlist([...wishlist,pid])
        setLiked(true)
        console.log(wishlist)
        setAlerts([...alerts,{alertOn:true, type:'success',message:'Added to wishlist'}])
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

  const removeFromWishlist = async(pid) => {
    const data = {
      pid: pid
    }
    setLoading(true)
    try{
      const response = await axios.post(`https://purewear-server.onrender.com/api/user/wishlist/remove`, data,{withCredentials:true})
      if(response.statusText=='OK'){
        setWishlist(wishlist.filter(item => item!== pid))
        setLiked(false)
        console.log(wishlist)
        setAlerts([...alerts,{alertOn:true, type:'success',message:'Removed from wishlist'}])
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

  const handleWishlist = () => {
    if(liked){
      removeFromWishlist(pid)
    }else{
      addToWishlist(pid)
    }
  }

  const handleChange = (e) => {
    if(e.target.name=="size"){
      setCartItem({...cartItem,[e.target.name]:e.target.value})
    }else if(e.target.name=="color"){
      setCartItem({...cartItem, [e.target.name]:product.colors[e.target.value]})
      setI(e.target.value)
    }
  }

  const addToCart = async() => {
    const data = {
      pid: pid,
      color: cartItem.color.url,
      size: cartItem.size,
      quantity: 1
    }
    setLoading(true)
    try{
      const response = await axios.post('https://purewear-server.onrender.com/api/user/cart/add', data,{withCredentials:true})
      if(response.data.success){
        setAlerts([...alerts,{alertOn:true, type:'success',message:'Added to cart'}])
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
      <section class="mb-4 w-11/12">
          <Link to={'/dashboard'}>
            <svg xmlns="http://www.w3.org/2000/svg" className='w-6 h-6 cursor-pointer' viewBox="0 0 32 32"><path d="M32 15H3.41l8.29-8.29-1.41-1.42-10 10a1 1 0 0 0 0 1.41l10 10 1.41-1.41L3.41 17H32z" data-name="4-Arrow Left"/></svg>
          </Link> 
          <div>
            <div class="lg:mt-8 mt-4 lg:col-gap-12 xl:col-gap-16 grid grid-cols-1 gap-12 lg:grid-cols-5 lg:gap-16">
              <div class="flex sm:items-center items-start justify-center lg:col-span-3 lg:row-end-1 ">
                <div class="lg:flex lg:items-start">
                  <div class="lg:order-2 lg:ml-5 ">
                    <div class="relative max-w-xl overflow-hidden">
                      <div className='absolute top-1/2 left-2 cursor-pointer' onClick={handleRightClick}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ccc" stroke-width="2" stroke-linecap="round" stroke-linejoin="arcs"><path d="M15 18l-6-6 6-6"></path></svg>
                      </div>
                      <img class="h-full w-full max-w-full object-cover" src={product && product.imageUrls && product.imageUrls[i]} alt="" />
                      <div className='absolute top-1/2 right-2 cursor-pointer' onClick={handleLeftClick}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ccc" stroke-width="2" stroke-linecap="round" stroke-linejoin="arcs"><path d="M9 18l6-6-6-6"></path></svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="flex flex-col items-center lg:items-start lg:col-span-2 lg:row-span-2 lg:row-end-2 px-4">
                <h1 class="sm: text-2xl font-bold text-gray-900 sm:text-3xl">{product.name}</h1>
                <div className='flex flex-row py-4 items-center'>
                  <div class="flex items-end">
                      <h1 class="text-3xl font-bold">Rs. {product.price}</h1>
                  </div>
                </div>
                <p>Inclusive of all taxes</p>

                <h2 class="mt-8 text-base text-gray-900">Color</h2>
                <div class="mt-3 flex select-none flex-wrap items-center gap-1">
                  {product && product.colors && product.colors.map((color, index)=>(
                    <label key={color.url}>
                      <input type="radio" name="color" value={index} class="peer sr-only" defaultChecked={cartItem && cartItem.color && color.url==cartItem.color.url} onClick={handleChange}/>
                      <img class='peer-checked:border border-black mx-1 w-10 h-10 p-1 cursor-pointer' src={color.url}/>
                    </label>
                  ))}
                </div>

                <h2 class="mt-8 mb-2 text-base text-gray-900">Size</h2>
                  <div class="mt-3 flex select-none flex-wrap items-center gap-2">
                    { ["S","M","L","XL","2XL","3XL"].map((size,index)=>(
                      <label key={size}>
                        <input type="radio" name="size" value={size} class="peer sr-only" defaultChecked={cartItem && cartItem.size && size==cartItem.size} disabled={product && product.sizes && !product.sizes.includes(size)} onClick={handleChange}/>
                        <p class={`peer-checked:border border-black cursor-pointer flex w-12 h-10 p-1 justify-center items-center ${product && product.sizes && product.sizes.includes(size) ? 'text-black' : 'text-gray-300'}`}>{size}</p>
                      </label>
                    ))}
                  </div>

                <div class="mt-10 flex flex-row items-center justify-center border-t border-b py-4 sm:flex-row">
                  <div className='w-full flex flex-row items-center justify-start'>
                    <button type="button" class="inline-flex items-center justify-center rounded-md border-2 mr-8 border-transparent bg-gray-900 bg-none px-12 py-3 text-center text-base font-bold text-white transition-all duration-200 ease-in-out focus:shadow hover:bg-gray-800" onClick={addToCart}>
                      <svg xmlns="http://www.w3.org/2000/svg" class="shrink-0 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      Add to cart
                    </button>
                    <button className='inline-flex items-center justify-center border border-black p-2 rounded-md bg-black' onClick={handleWishlist}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" stroke="white" fill={liked?"white":"currentColor"}>
                        <path fillRule="nonzero" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipule="nonzero" />
                      </svg>
                    </button>
                  </div>
                </div>

                  <ul class="mt-8 space-y-2">
                    <li class="flex items-center text-left text-sm font-medium text-gray-600">
                      <svg class="mr-2 block h-5 w-5 align-middle text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" class=""></path>
                      </svg>
                      Free shipping worldwide
                    </li>

                    <li class="flex items-center text-left text-sm font-medium text-gray-600">
                      <svg class="mr-2 block h-5 w-5 align-middle text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" class=""></path>
                      </svg>
                      Cancel Anytime
                    </li>
                  </ul>
              </div>

            <div class="lg:col-span-3 pl-4">
                <div className='border-b border-gray-300 pb-2'>Description</div>

                <div class="mt-4 flow-root sm:mt-6 whitespace-pre-line">
                  <div>{product.description}</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      <Footer />
    </div>
  )
}

export default Product
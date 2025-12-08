import React, { useEffect, useState,useRef } from 'react'
import { Loading, Card, Banner, Header, Footer, Alerts } from '../components'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState({})
  const [products, setProducts] = useState([])
  const [wishlist, setWishlist] = useState([])
  const [searchOn, setSearchOn] = useState(false)
  const [searchData, setSearchData] = useState('')
  const [filterOn, setFilterOn] = useState(false)
  const [filteredProducts, setFilteredProducts] = useState([])
  const [filtered, setFiltered] = useState(false)
  const [alerts, setAlerts] = useState([])
  const [filters, setFilters] = useState([])

  const modalRef = useRef(null)
  const navigate = useNavigate()

  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      setSearchOn(false)
      setFilterOn(false)
    }
  }

  useEffect(()=>{
    if(searchOn||filterOn){
      document.addEventListener('mousedown', handleClickOutside)
    }else{
      document.removeEventListener('mousedown', handleClickOutside)
    }
  },[searchOn, filterOn])

  const fetchProducts = async() => {
    setLoading(true)
    try{
      const response = await axios.get('https://purewear-server.onrender.com/api/product/get/all')
      setProducts(response.data.data)
    }catch(err){
      setAlerts([...alerts,{alertOn:true, type:'error',message:err.message}])
    }finally{
      setLoading(false)
    }
  }
  console.log(document.cookie)

  const fetchUserData = async() => {
    setLoading(true)
    try{
      const res1 = await axios.post('https://purewear-server.onrender.com/api/user/profile/get',{},{withCredentials: true})
      const res2 = await axios.post('https://purewear-server.onrender.com/api/user/wishlist/get',{},{withCredentials: true})
      if(res1.data.success){
        setUser(res1.data.data)
      }
      if(res2.data.success){
        setWishlist(res2.data.data)  
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
    fetchProducts()
    fetchUserData()
  },[])

  const addToWishlist = async(pid) => {
    const data = {
      pid: pid
    }
    setLoading(true)
    try{
      const response = await axios.post('https://purewear-server.onrender.com/api/user/wishlist/add', data,{withCredentials:true})
      if(response.data.success){
        setWishlist([...wishlist,pid])
        console.log(wishlist)
        setAlerts([...alerts,{alertOn:true, type:'success',message:"Added to wishlist"}])
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
      if(response.data.success){
        setWishlist(wishlist.filter(item => item!== pid))
        console.log(wishlist)
        setAlerts([...alerts,{alertOn:true, type:'success',message:"Removed from wishlist"}])
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

  const handleSearchOn = () => {
    setSearchOn(!searchOn)
  } 

  const handleFilterOn = () => {
    setFilterOn(!filterOn)
  } 

  const handleFilterChange = (e) => {
    const v1 = e.target.value
    const v2 = v1.charAt(0).toUpperCase()+v1.slice(1)
    let updatedFilter = [...filters]
    if(!updatedFilter.includes(v2)){
      updatedFilter.push(v2)
    }else{
      updatedFilter = updatedFilter.filter(el=>(el!=v2))
    }
    setFilters(updatedFilter)
  }

  console.log(filters)

  const handleApplyFilters = () => {
    const filtProducts = products.filter(product => {
      const attrList = product.attributes
      return filters.some(e=>attrList.includes(e))
    })
    console.log(filtProducts)
    setFilteredProducts(filtProducts)
    setFiltered(true)
    setFilterOn(false)
  }

  const handleSearch = () => {
    const keywords = searchData.split(/[\s*,\s*]+/).filter(Boolean).map(keyword => keyword.toLowerCase())
  
    const filtProducts = products.filter(product => {
      return keywords.every(keyword => {
        return product.name.toLowerCase().includes(keyword)
        || product.description.toLowerCase().includes(keyword)
        || product.attributes.some(attr => attr.toLowerCase().includes(keyword))
      })
    })
    console.log(filtProducts)
    setFilteredProducts(filtProducts)
    setFiltered(true)
    setSearchData('')
    setSearchOn(false)
  }

  const handleSearchInput = (e) => {
    const data = e.target.value
    const modData = data.toLowerCase()
    setSearchData(modData)
  }

  const handleSearchEnter = (e) => {
    if(e.key==="Enter"){
      handleSearch()
    }
  }

  const handleAlertCancel = (i) => {
    const updatedAlert = [...alerts]
    updatedAlert.splice(i,1)
    setAlerts(updatedAlert)
  }

  useEffect(()=>{
    if(!filterOn){
      setFilters([])
    }
  },[filterOn])

  return (
    <div className='w-full flex flex-col items-center'>
      <Header user={user} handleLogout={handleLogout}/>
      { loading && 
        <div className='fixed z-50 top-1/2 left-1/2 flex justify-center items-center'>
            <Loading/>
        </div>
      }
      <Banner />
      <div className='w-full z-40 flex flex-col items-end fixed px-3 right-1 md:right-4 top-14'>
          { alerts.map((alert,i) => (
            <Alerts i={i} alertOn={alert.alertOn} type={alert.type} message={alert.message} handleAlertCancel={handleAlertCancel}/>
          ))}
      </div>
      <div className='w-11/12 flex flex-row px-4 relative'>
        <div className='w-full flex'>
          <a class="uppercase tracking-wide no-underline hover:no-underline font-bold text-gray-800 text-xl " href="#">
            Store
          </a>
        </div>
        <div className='w-full flex flex-row items-center justify-end'>
          {searchOn && <input ref={modalRef} type="text" value={searchData} onKeyDown={handleSearchEnter} onChange={handleSearchInput} className='w-72 border py-1 outline-none rounded-lg px-3 text-sm text-gray-600 mr-2 bf-white'/>}
          <svg className="flex fill-current hover:text-black mx-2 items-center cursor-pointer" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" onClick={handleSearchOn}>
            <path d="M10,18c1.846,0,3.543-0.635,4.897-1.688l4.396,4.396l1.414-1.414l-4.396-4.396C17.365,13.543,18,11.846,18,10 c0-4.411-3.589-8-8-8s-8,3.589-8,8S5.589,18,10,18z M10,4c3.309,0,6,2.691,6,6s-2.691,6-6,6s-6-2.691-6-6S6.691,4,10,4z"></path>
          </svg>
          <div className='flex flex-col'>
            <svg className="fill-current hover:text-black ml-2 cursor-pointer" xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24"  onClick={handleFilterOn}>
                <path d="M7 11H17V13H7zM4 7H20V9H4zM10 15H14V17H10z"></path>
            </svg>
            {filterOn && <div ref={modalRef} className='z-30 w-72 border shadow-lg bg-[#f9fafe] rounded-sm absolute top-10 right-0 text-sm p-4'>
              <ul>
                <li>
                  <h4 className='font-bold'>Gender</h4>
                  <div class="mt-1 flex select-none flex-wrap items-center gap-2">
                    { ["Men","Women","Kids"].map((gender,index)=>(
                      <label key={gender}>
                        <input type="checkbox" name="gender" value={gender} class="peer sr-only" onChange={handleFilterChange}/>
                        <p class="peer-checked:bg-black peer-checked:text-white cursor-pointer border border-black flex w-16 h-8 justify-center items-center">{gender}</p>
                      </label>
                    ))}
                  </div>
                </li>
                <li className='my-2'>
                  <h4 className='font-bold'>Category</h4>
                  <div class="mt-1 flex select-none flex-wrap items-center gap-2">
                    { ["Outerwears","T-shirts","Shirts","Bottoms","Sweaters","Dresses"].map((category,index)=>(
                      <label key={category}>
                        <input type="checkbox" name="category" value={category} class="peer sr-only" onChange={handleFilterChange}/>
                        <p class="peer-checked:bg-black peer-checked:text-white cursor-pointer border border-black flex w-[76px] h-8 justify-center items-center">{category}</p>
                      </label>
                    ))}
                  </div>
                </li>
                <li className='my-2'>
                  <h4 className='font-bold'>Size</h4>
                  <div class="mt-1 flex select-none flex-wrap items-center gap-2">
                    { ["S","M","L","XL","2XL"].map((size,index)=>(
                      <label key={size}>
                        <input type="checkbox" name="size" value={size} class="peer sr-only" onChange={handleFilterChange}/>
                        <p class="text-black peer-checked:bg-black cursor-pointer peer-checked:text-white border border-black flex w-8 h-8 p-1 justify-center items-center">{size}</p>
                      </label>
                    ))}
                  </div>
                </li>
                <li className='my-2'>
                  <h4 className='font-bold'>Color</h4>
                  <div class="mt-1 flex select-none flex-wrap items-center gap-2">
                    { ["blue","purple","red","white","yellow","green","orange","pink","black"].map((color,index)=>(
                      <label key={color}>
                        <input type="checkbox" name="color" value={color} class="peer sr-only" onChange={handleFilterChange}/>
                        <p class="text-black peer-checked:border cursor-pointer border-black w-8 h-8 flex justify-center items-center"><span className={`${color=='black' ? `bg-${color}` : `bg-${color}-500`} p-3`}></span></p>
                      </label>
                    ))}
                  </div>
                </li>
                <li className='my-2'>
                  <h4 className='font-bold'>Price</h4>
                  <div class="mt-1 flex select-none flex-wrap items-center gap-2">
                    { ["Rs. 1000 - Rs. 1999.99","Rs. 2000 - Rs. 2999.99","Rs. 3000 - Rs. 3999.99"].map((price,index)=>(
                      <label key={price}>
                        <input type="checkbox" name="priceRange" value={index+1} class="peer sr-only" onChange={handleFilterChange}/>
                        <p class="text-black peer-checked:bg-black cursor-pointer peer-checked:text-white flex w-42 h-8 border border-black flex flex-col p-1 justify-center items-center">{price}</p>
                      </label>
                    ))}
                  </div>
                </li>
              </ul>
              <button className='mt-4 border border-black p-1 font-medium w-full flex items-center justify-center hover:bg-black hover:text-white' onClick={handleApplyFilters}>Apply Filters</button>
            </div>}
          </div>
        </div>
      </div>
      <div className='w-11/12 flex justify-center items-center'>
        <div className='flex grid lg:grid-cols-3 lg:gap-y-8 lg:gap-x-24 md:grid-cols-2 md:gap-x-12 md:gap-y-8 grid-cols-1 gap-y-6 mt-4'>
          { !filtered && products && products.map((product, pi)=>(
            <div key={pi}>
              <Card product={product} wishlist={wishlist} addToWishlist={addToWishlist} removeFromWishlist={removeFromWishlist}/>
            </div>
          ))
          }
          { filtered && filteredProducts && filteredProducts.map((product, pi)=>(
            <div key={pi}>
              <Card product={product} wishlist={wishlist} addToWishlist={addToWishlist} removeFromWishlist={removeFromWishlist}/>
            </div>
          ))
          }
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Dashboard
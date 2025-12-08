import React, { useState, useEffect, useRef } from 'react'

const EditAddress = ({ userAddress, addAddress, editAddress, removeAddress }) => {
  const [modal, setModal] = useState(false)
  const [isNew, setIsNew] = useState(true)
  const [addressData, setAddressData] = useState([])
  const [dai, setDai] = useState(-1)
  const [cai,setCai] = useState(-1)
  const [isDefault, setIsDefault] = useState(false)
  const [currentAddress, setCurrentAddress] = useState({})

  const modalRef = useRef(null)
  const newAddress = {
    fname: '',
    lname: '', 
    phone: '',
    area1: '',
    area2: '',
    city: '',
    state: '',
    pincode: ''
  }

  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      setModal(false)
    }
  }

  useEffect(()=>{
    if(modal){
      document.addEventListener('mousedown', handleClickOutside)
    }else{
      document.removeEventListener('mousedown', handleClickOutside)
    }
  },[modal])

  useEffect(() => {
    if (userAddress) {
      setAddressData(userAddress.addressList)
      setDai(userAddress.defaultAddressIndex)
    }
  }, [userAddress])

  const handleNewModal = () => {
    setCurrentAddress(newAddress)
    setIsDefault(false)
    setIsNew(true)
    setModal(true)
  }

  const handleCurrentAddressChange = (e) => {
    if(e.target.name=='phone' || e.target.name=='pincode'){
      const data = Number(e.target.value)
      setCurrentAddress({...currentAddress, [e.target.name]:data})
    }else{
      setCurrentAddress({...currentAddress, [e.target.name]:e.target.value})
    }
  } 

  const handleIsDefaultChange = (e) => {
    setIsDefault(e.target.value)
  }

  const handleAddAddress = () => {
    addAddress(currentAddress,isDefault)
    setModal(false)
  }

  const handleEditModal = (ai) => {
    setCurrentAddress(addressData[ai])
    setIsDefault(ai==dai)
    setCai(ai)
    setIsNew(false)
    setModal(true)
  }

  const handleEditAddress = () => {
    editAddress(currentAddress,cai,isDefault)
    setModal(false)
  }

  return (
    <div className='w-full px-4 border border-gray-400'>
        <div className='w-full py-4 flex flex-row justify-between'>
            <div className='font-bold'>Saved Addresses</div>
            <button className='flex items-center justify-center px-2 text-xs font-medium border text-gray-600 border-gray-600 rounded' onClick={handleNewModal}>ADD NEW ADDRESS +</button>
        </div>
        <div className='text-sm'>
            <div className='py-4'>
                <h3 className='mb-2 text-xs font-bold'>DEFAULT ADDRESS</h3>
                {dai>=0 && (
                  <div className='shadow border border-gray-300 px-4 py-2'>
                      <h4 className='font-medium pb-1'>{addressData[dai].fname} {addressData[dai].lname}</h4>
                      <p>{addressData[dai].area1}<br/>{addressData[dai].area2}<br/>{addressData[dai].city} {addressData[dai].country} - {addressData[dai].pincode}</p>
                      <p className='text-xs text-gray-600 pt-1 mb-4'>Mobile No: {addressData[dai].phone}</p>
                      <div className='text-xs font-medium text-blue-800 w-full justify-center items-center flex flex-row'>
                          <div className='flex border cursor-pointer w-full justify-center items-center py-2' onClick={()=>handleEditModal(dai)}>EDIT</div>
                          <div className='flex border cursor-pointer w-full justify-center items-center py-2' onClick={()=>removeAddress(dai)}>REMOVE</div>
                      </div>
                  </div>
                )
                }
            </div>
            <div className='py-4'>
                <h3 className='mb-2 font-bold text-xs'>OTHER ADDRESSES</h3>
                {addressData && addressData.map((address, ai) => (
                  !(ai==dai) && (
                    <div className='shadow border border-gray-300 px-4 py-2'>
                        <h4 className='font-medium pb-1'>{address.fname} {address.lname}</h4>
                        <p>{address.area1}<br/>{address.area2}<br/>{address.city} {address.state} - {address.pincode}</p>
                        <p className='text-xs text-gray-600 pt-1 mb-4'>Mobile No: {address.pnone}</p>
                        <div className='text-xs font-medium text-blue-800 w-full justify-center items-center flex flex-row'>
                            <div className='flex border cursor-pointer w-full justify-center items-center py-2' onClick={()=>handleEditModal(ai)}>EDIT</div>
                            <div className='flex border cursor-pointer w-full justify-center items-center py-2' onClick={()=>removeAddress(ai)}>REMOVE</div>
                        </div>
                    </div>
                  )
                ))}
            </div>
        </div>
        {modal && (<div class="fixed inset-0 flex items-center justify-center z-50">
          <div class="absolute inset-0 bg-black opacity-50"></div>
                <div class="p-4 bg-white rounded shadow-lg z-10 w-4/5 sm:w-3/5 md:w-1/2 max-h-[80vh] overflow-auto" ref={modalRef}>
                <div className='border border-gray-400 rounded px-4'>
                  <div className='flex flex-row'>
                      <div className='flex flex-col w-full mr-2'>
                          <label for="fname" class="mt-2 mb-2 block">First Name</label>
                          <input type="text" name="fname" value={currentAddress.fname} onChange={handleCurrentAddressChange} class="w-full border border-gray-200 px-4 py-3 text-sm shadow-sm rounded outline-none focus:z-10 focus:border-gray-400"/>
                      </div>
                      <div className='w-full flex flex-col ml-2'>
                          <label for="lname" class="mt-2 mb-2 block">Last Name</label>
                          <input type="text" name="lname" value={currentAddress.lname} onChange={handleCurrentAddressChange} class="w-full border border-gray-200 px-4 py-3 text-sm shadow-sm rounded outline-none focus:z-10 focus:border-gray-400"/>
                  </div>
                  </div>
                  <div className='flex flex-col w-full'>
                  <label for="phone" class="mt-4 mb-2 block">Phone No</label>
                  <input type="tel" name="phone" min="1000000000" max="9999999999" value={currentAddress.phone} onChange={handleCurrentAddressChange} class="w-full border rounded phone-input border-gray-200 px-4 py-3 text-sm shadow-sm outline-none focus:z-10 focus:border-gray-400"/>
                </div>
                <div className='flex flex-col w-full'>
                  <label for="area1" class="mt-4 mb-2 block">Address Line 1</label>
                  <input type="text" name="area1" value={currentAddress.area1} onChange={handleCurrentAddressChange} class="w-full border rounded border-gray-200 px-4 py-3 text-sm shadow-sm outline-none focus:z-10 focus:border-gray-400"/>
                </div>
                <div className='w-full flex flex-col'>
                  <label for="area2" class="mt-4 mb-2 block">Address Line 2</label>
                  <input type="text" name="area2" value={currentAddress.area2} onChange={handleCurrentAddressChange} class="w-full border border-gray-200 px-4 py-3 text-sm rounded shadow-sm outline-none focus:z-10 focus:border-gray-400"/>
                </div>
                <div className='w-full flex flex-col'>
                  <label for="city" class="mt-4 mb-2 block">City</label>
                  <input type="text" name="city" value={currentAddress.city} onChange={handleCurrentAddressChange} class="w-full border border-gray-200 px-4 py-3 text-sm rounded shadow-sm outline-none focus:z-10 focus:border-gray-400"/>
                </div>
                <div className='flex flex-row'>
                      <div className='flex flex-col w-full mr-2'>
                          <label for="state" class="mt-2 mb-2 block">State</label>
                          <input type="text" name="state" value={currentAddress.state} onChange={handleCurrentAddressChange} class="w-full border border-gray-200 px-4 py-3 text-sm shadow-sm rounded outline-none focus:z-10 focus:border-gray-400"/>
                      </div>
                      <div className='w-full flex flex-col ml-2'>
                          <label for="pincode" class="mt-2 mb-2 block">Zip Code</label>
                          <input type="tel" min="10000" max="99999" name="pincode" value={currentAddress.pincode} onChange={handleCurrentAddressChange} class="w-full border border-gray-200 px-4 py-3 text-sm shadow-sm rounded outline-none focus:z-10 focus:border-gray-400"/>
                      </div>
                  </div>
                <div className='flex flex-row items-center py-1 mt-4'>
                  <input type="checkbox" name="isDefault" value={isDefault} onChange={handleIsDefaultChange} className='mr-2 w-4 h-4 accent-black' checked={isDefault}/>
                  <label>Make this a default address</label>
                </div>
                {isNew ? (
                  <button onClick={handleAddAddress} class="my-4 rounded w-full bg-gray-900 px-6 py-3 font-medium text-white">Save Details</button>
                ) : (
                  <button onClick={handleEditAddress} class="my-4 rounded w-full bg-gray-900 px-6 py-3 font-medium text-white">Save Details</button>
                )
                }
              </div>
          </div>
          
          </div>)}
    
    </div>
  )
}

export default EditAddress
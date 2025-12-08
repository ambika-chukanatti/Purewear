import React,{useState, useEffect} from 'react'
import { Link } from 'react-router-dom'

const OrderCard = ({order, product}) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [slideLength, setSlideLength] = useState(1)

  useEffect(()=>{
    setSlideLength(order.cartItems.length)
  },[order])

  const nextSlide = () => {
    if(currentIndex>=slideLength){
      setCurrentIndex(0)
    }else{
      setCurrentIndex(currentIndex+1)
    }
  }

  const prevSlide = () => {
    if(currentIndex<=0){
      setCurrentIndex(slideLength-1)
    }else{
      setCurrentIndex(currentIndex-1)
    }
  }

  return (
    <div className='border z-20 sm:w-3/5 md:w-11/12 p-1 mb-4 flex flex-col md:flex-row'>
        <div className='w-full flex text-sm flex-col justify-center items-center p-2 md:border-r'>
          <p className='flex flex-col md:flex-row items-center justify-center'><span className='font-sm text-sm'>Order Id: </span><span className='font-medium text-sm'>#{order._id}</span></p>
          <p className='my-2 font-medium text-gray-600'>ordered on {order && order.orderTime}</p>
          <h3>Total: <span className='font-medium'>${order && order.totalAmount}</span></h3>
          <h3 className='text-sm'>Payment Method: <span className='font-medium'>{order && order.paymentMethod}</span></h3>
        </div>
        <div className='relative group w-full rounded-sm md:border-l'>
          {order && order.cartItems.map((cartItem,cii)=>(
            <div class="text-sm w-full px-4">
              {currentIndex==cii && 
              <div className='w-full flex justify-center items-center'>
                <div className='flex item-center justify-center w-full p-2'>
                  <Link to={`/product/${cartItem.pid}`}><img src={product && product[cii] && product[cii].imageUrls[0]} className='w-32 h-34'/></Link> 
                </div>
                <div className='w-full flex flex-col items-center md:items-start justify-between p-2'>
                  <span class="font-semibold text-sm">{product && product[cii] && product[cii].name}</span>
                  <div className='flex flex-row items-center md:flex-col md:items-start '>
                    <h2 className='text-gray-400 mb-0 mr-4 md:mb-2 md:mr-0'>{cartItem.size}</h2>
                    <img src={cartItem.color} className='w-4 h-4'/>
                  </div>
                  <h3 className=''>{cartItem.quantity} x ${product && product[cii] && product[cii].price}</h3>
                </div>
              </div>}
              <button onClick={prevSlide} hidden={currentIndex<=0} className="absolute group left-2 top-1/2 transform -translate-y-1/2">
                &#10094;
              </button>
              <button onClick={nextSlide} hidden={currentIndex>=slideLength-1} className="absolute group right-2 top-1/2 transform -translate-y-1/2">
                  &#10095;
              </button>
            </div>
          ))
          }
        </div>
    </div>
  )
}

export default OrderCard
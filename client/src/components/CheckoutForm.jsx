import React, { useState } from "react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CheckoutForm = ({user, checkout, updatePaymentMethod, handleAlert}) => {
  const stripe = useStripe()
  const elements = useElements()
  const navigate = useNavigate()

  const [isProcessing, setIsprocessing] = useState(false)
  const [message, setMessage] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState('')

  const handlePayment = async() => {
    if(paymentMethod=='card'){
      if (!stripe || !elements) {
        return;
      }

      setIsprocessing(true)
      const { err, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: 'https://purewear.vercel.app/cart/checkout/payment/status',
        },
      })

      if(err){
        handleAlert('error',err.message)
      }else if(paymentIntent && paymentIntent.status == "succeeded"){
        handleAlert('success',"Payment done successfully")
      }else{
        handleAlert('error',"Unexpected state")
      }
      setIsprocessing(false)
    }else if(paymentMethod=='cod'){
      navigate('/cart/checkout/payment/status?redirect_status=succeeded')
    }else{
      handleAlert("error","Please select a payment method")
    }
  }

  const handlePaymentMethod = (e) => {
    if(e.target.value=='card'){
      setPaymentMethod('card')
      updatePaymentMethod('card')
    }else if(e.target.value=='cod'){
      setPaymentMethod('cod')
      updatePaymentMethod('cod')
    }else{
      handleAlert("error","Something went wrong")
    }
  }

  const handleSubmit = async() => {
    handlePayment()  
  }

  return (
    <div className='w-full border-r py-3 px-6'>
                <p class="text-xl font-medium mb-4 border-b py-2">Billing Details</p>
                  <table className='w-full border'>
                    <tr className='border-b'>
                      <td className='py-2 pl-4'>Contact:</td>
                      <td className='py-2 pl-4'>{user.email}</td>
                    </tr>
                    {checkout && checkout.address &&
                      <tr className=''>
                        <td className='py-2 pl-4'>Ship To:</td>
                        <td className='py-2 pl-4'>{checkout.address.fname} {checkout.address.lname}<br/>{checkout.address.area1} {checkout.address.area2}
                        <br/>{checkout.address.city} {checkout.address.state} {checkout.address.pincode}</td>
                      </tr>
                    }
                  </table>
                  <p class="font-medium mt-4 py-2">Payment Method</p>
                  <div className='border'>
                    <div className='border-b py-1 px-4 flex flex-row items-center'>
                      <div className='flex justify-center w-1/12'>
                        <input type="radio" name="paymentMethod" value='cod' onClick={handlePaymentMethod} className='w-4 h-4 accent-[#000000]'/>
                      </div>
                      <label className='w-11/12 px-4 flex items-center'>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -10 67 83.75" fill-rule="evenodd" clip-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2" className='w-16 h-16'>
                          <path d="M42.36,43.121c-0.235,-0.234 -0.488,-0.465 -0.759,-0.693c-2.033,-1.708 -5.163,-3.32 -9.301,-4.239c-3.954,-0.879 -7.913,-1.053 -11.697,-0.632c-3.88,0.431 -5.879,1.288 -8.194,2.481c-2.048,1.055 -4.374,2.411 -8.922,3.982c-0.84,0.29 -1.404,1.081 -1.404,1.969l0,16.148c0,0.896 0.574,1.692 1.425,1.976c-0,-0 4.372,1.512 8.735,-1.396c3.06,-2.04 7.335,-3.37 15.299,0.17c7.011,3.116 11.928,1.698 17.397,-1.714c3.249,-2.026 6.719,-4.817 11.111,-7.67c4.615,-2.997 6.9,-5.906 7.867,-8.139c0.868,-2.004 0.772,-3.654 0.338,-4.74c-0.394,-0.984 -1.269,-2.323 -3.163,-2.962c-1.423,-0.481 -3.62,-0.586 -6.947,0.744l-11.785,4.715Zm-2.288,3.688c-1.326,-1.809 -4.334,-3.588 -8.676,-4.553c-3.492,-0.776 -6.99,-0.93 -10.332,-0.558c-3.195,0.355 -4.841,1.061 -6.747,2.044c-1.952,1.005 -4.144,2.262 -8.067,3.715c-0,-0 -0,12.888 0,12.888c0.972,0.01 2.325,-0.191 3.681,-1.095c3.861,-2.574 9.255,-4.636 19.303,-0.171c5.445,2.42 9.252,1.209 13.5,-1.441c3.23,-2.015 6.679,-4.792 11.047,-7.629c3.079,-2 4.929,-3.884 5.898,-5.501c0.619,-1.033 0.913,-1.821 0.707,-2.336c-0.295,-0.739 -1.374,-1.225 -4.693,0.103l-11.083,4.433c0.38,1.429 0.14,2.735 -0.62,3.802c-0.679,0.954 -1.853,1.774 -3.66,2.136c-2.285,0.457 -4.529,0.17 -6.696,-0.655c-2.026,-0.771 -5.613,-1.581 -7.801,-1.844c-1.142,-0.137 -1.957,-1.175 -1.82,-2.316c0.137,-1.142 1.175,-1.958 2.316,-1.821c2.465,0.296 6.505,1.218 8.787,2.087c1.424,0.542 2.896,0.763 4.397,0.463c0.543,-0.109 0.972,-0.168 1.094,-0.487c0.123,-0.319 -0.128,-0.665 -0.4,-1.072l-0.135,-0.192Zm9.928,-42.642c-0,-1.151 -0.933,-2.084 -2.083,-2.084l-29.167,0c-1.151,0 -2.083,0.933 -2.083,2.084l-0,27.083c-0,1.151 0.932,2.083 2.083,2.083l29.167,0c1.15,0 2.083,-0.932 2.083,-2.083l-0,-27.083Zm-8.333,2.083l-0,2.074c-0,1.384 -0.55,2.711 -1.528,3.69c-0.979,0.978 -2.306,1.528 -3.69,1.528l-6.232,-0c-1.383,-0 -2.71,-0.55 -3.689,-1.528c-0.978,-0.979 -1.528,-2.306 -1.528,-3.69l-0,-2.074l-4.167,0c0,0 0,22.917 0,22.917c0,-0 25,-0 25,-0l0,-22.917l-4.166,-0Zm-4.167,-0l-0,2.074c0,0.279 -0.111,0.546 -0.308,0.743c-0.197,0.197 -0.464,0.308 -0.743,0.308c0,0 -6.232,0 -6.232,0c-0.278,-0 -0.546,-0.111 -0.743,-0.308c-0.197,-0.197 -0.307,-0.464 -0.307,-0.743l-0,-2.074l8.333,-0Z"/>
                        </svg>
                      </label>
                    </div>
                    <div className='w-full flex flex-col'>
                      <div className='w-full border-b py-3 px-4 flex flex-row items-center'>
                        <div className='flex justify-center w-1/12'>
                          <input type="radio" name="paymentMethod" value='card' onClick={handlePaymentMethod} className='w-4 h-4 accent-[#000000]'/>
                        </div>
                        <label className='w-11/12 px-6 flex items-center'>
                          <svg fill="#000000" width="45px" height="45px" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0 26.016q0 0.832 0.576 1.408t1.44 0.576h28q0.8 0 1.408-0.576t0.576-1.408v-20q0-0.832-0.576-1.408t-1.408-0.608h-28q-0.832 0-1.44 0.608t-0.576 1.408v20zM2.016 26.016v-14.016h28v14.016h-28zM2.016 8v-1.984h28v1.984h-28zM4 24h6.016v-1.984h-6.016v1.984zM4 20h2.016v-1.984h-2.016v1.984zM4 16h6.016v-1.984h-6.016v1.984zM14.016 19.008q0 2.080 1.44 3.552t3.552 1.44q1.024 0 1.984-0.416 0.992 0.416 2.016 0.416 2.080 0 3.52-1.44t1.472-3.552-1.472-3.52-3.52-1.472q-1.024 0-2.016 0.416-0.96-0.416-1.984-0.416-2.080 0-3.552 1.472t-1.44 3.52zM16 19.008q0-1.248 0.864-2.112t2.144-0.896v0q-0.992 1.376-0.992 3.008t0.992 3.008v0q-1.248 0-2.144-0.864t-0.864-2.144zM20 19.008q0-1.312 0.992-2.208 1.024 0.896 1.024 2.208t-1.024 2.208q-0.992-0.896-0.992-2.208zM22.976 22.016q1.024-1.376 1.024-3.008t-1.024-3.008h0.032q1.248 0 2.112 0.896t0.896 2.112-0.896 2.144-2.112 0.864h-0.032z"></path>
                          </svg>
                        </label>
                      </div>
                          {  paymentMethod=='card' &&  <div className="p-4">
                                <PaymentElement id="payment-element"/>
                              </div>
                          } 
                    </div>
                  </div>
                  <div className='flex items-center justify-center w-full py-2 mt-6 bg-black font-medium text-white'>
                    <button disabled={isProcessing} onClick={handleSubmit}>{isProcessing? "Processing.." : "Place Order"}</button>
                  </div>
                  <div>{message}</div>
                </div>
  )
}

export default CheckoutForm
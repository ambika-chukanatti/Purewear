import {React, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Loading, Alerts } from '../components'
import img3 from '../assets/img3.jpg'
import axios from 'axios'

const ForgotPassword = () => {
    const [loading, setLoading] = useState(false)
    const [alerts, setAlerts] = useState([])
    const [email, setEmail] = useState('')
    const [otp, setOTP] = useState('')
    const [stage, setStage] = useState('stage1')
    const [password, setPassword] = useState({
        password1:'',
        password2:''
    })

    const navigate = useNavigate()

    const handleEmail = (e) => {
        setEmail(e.target.value)
    }

    const handleOTP = (e) => {
        setOTP(e.target.value)
    }

    const handlePassword = (e) => {
        setPassword({...password, [e.target.name]:e.target.value})
    }

    const handleSendOTP = async() => {
        const data = {
            email: email
        }
        setLoading(true)
        try{
            const response = await axios.post('https://purewear-server.onrender.com/api/auth/password/forgot', data)
            if(response.data.success){
                console.log(response.data.data)
                localStorage.setItem('token', response.data.data)
                setStage('stage2')
            }
        }catch(err){
            setAlerts([...alerts,{alertOn:true, type:'error',message:err.message}])
        }finally{
            setLoading(false)
        }
    }

    const handleVerifyOTP = async() => {
        const data = {
            otp: otp
        }
        setLoading(true)
        try{
            const response = await axios.post('https://purewear-server.onrender.com/api/auth/password/verify', data, { withCredentials: true})
            if(response.data.success){
                console.log(response.data.data)
                localStorage.setItem('token', response.data.data)
                setStage('stage3')
            }
        }catch(err){
            setAlerts([...alerts,{alertOn:true, type:'error',message:err.message}])
        }finally{
            setLoading(false)
        }
    }

    const handleNewPassword = async() => {
        if(password.password1==password.password2){
            const data = {
                password: password.password1
            }
            console.log(data)
            setLoading(true)
            try{
                const response = await axios.post('https://purewear-server.onrender.com/api/auth/password/reset', data, {withCredentials: true})
                if(response.data.success){
                    console.log(response.data.data)
                    navigate('/dashboard')
                }
            }catch(err){
                setAlerts([...alerts,{alertOn:true, type:'error',message:err.message}])
            }finally{
                setLoading(false)
            }
        }else{
            setAlerts([...alerts,{alertOn:true, type:'error',message:"Passwords doesn't match"}])
        }
    }

    const handleAlertCancel = (i) => {
        const updatedAlert = [...alerts]
        updatedAlert.splice(i,1)
        setAlerts(updatedAlert)
      }

  return (
    <div className='relative w-full h-screen flex flex-col md:flex-row'>
    { loading && 
        <div className='fixed z-50 top-1/2 left-1/2 flex justify-center items-center'>
            <Loading/>
        </div>
      }
      <div className='w-full z-40 flex flex-col items-end fixed px-3 right-1 md:right-4 top-8'>
          { alerts.map((alert,i) => (
            <Alerts i={i} alertOn={alert.alertOn} type={alert.type} message={alert.message} handleAlertCancel={handleAlertCancel}/>
          ))}
      </div>
      <div class="absolute top-8 left-8 flex items-center font-bold text-gray-800 text-2xl mb-4">
            <svg class="fill-current text-gray-800 mr-2" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24">
                <path d="M5,22h14c1.103,0,2-0.897,2-2V9c0-0.553-0.447-1-1-1h-3V7c0-2.757-2.243-5-5-5S7,4.243,7,7v1H4C3.447,8,3,8.447,3,9v11 C3,21.103,3.897,22,5,22z M9,7c0-1.654,1.346-3,3-3s3,1.346,3,3v1H9V7z M5,10h2v2h2v-2h6v2h2v-2h2l0.002,10H5V10z"></path>
            </svg>
            PUREWEAR
          </div>
      <div className='w-full h-full'>
        <img src={img3} className='w-full h-full object-cover inset-0'/>
      </div>
      <div className='w-full flex flex-col items-center justify-center py-56 md:py-0'>
        <Link className='w-3/5 mb-4 font-medium flex flex-row' to={"/login"}>
            <span className=''>
                <svg fill="#000000" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" enable-background="new 0 0 24 24"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M11.3,12l3.5-3.5c0.4-0.4,0.4-1,0-1.4c-0.4-0.4-1-0.4-1.4,0l-4.2,4.2l0,0c-0.4,0.4-0.4,1,0,1.4l4.2,4.2c0.2,0.2,0.4,0.3,0.7,0.3l0,0c0.3,0,0.5-0.1,0.7-0.3c0.4-0.4,0.4-1,0-1.4L11.3,12z"></path></g></svg>
            </span>
            <span>Back</span>
        </Link>
        <div className='w-3/5 mb-4'>
            <h2 className='font-bold text-xl'>Forgot Password</h2>
            <p className='text-gray-400 text-xs mt-1'>Enter your registered email address. We'll send you a code to reset your password.</p>
        </div>

        { stage=='stage1'  && 
            <div className='w-3/5 flex flex-col justify-center'>
                <label>Email Address:</label>
                <input className='py-2 border border-gray-400 rounded-lg mt-2 mb-4 outline-gray-400 px-4' value={email} onChange={handleEmail}/>
                <button className='bg-black text-white py-2 rounded-lg my-2' onClick={handleSendOTP}>Send OTP</button>
            </div>
        }
        { stage=='stage2'  && 
            <div className='w-3/5 flex flex-col justify-center'>
                <label>Enter 5 digit OTP:</label>
                <input className='py-2 border border-gray-400 rounded-lg mt-2 mb-4 outline-gray-400 px-4' value={otp} onChange={handleOTP}/>
                <button className='bg-black text-white py-2 rounded-lg my-2' onClick={handleVerifyOTP}>Verify Email</button>
            </div>
        }
        { stage=='stage3'  && 
            <div className='w-3/5 flex flex-col justify-center'>
                <label>Enter new password:</label>
                <input className='py-2 border border-gray-400 rounded-lg mt-2 mb-4 outline-gray-400 px-4' name='password1' type="password" value={password.password1} onChange={handlePassword}/>
                <label>Confirm Password:</label>
                <input className='py-2 border border-gray-400 rounded-lg mt-2 mb-4 outline-gray-400 px-4' name='password2' type="password" value={password.password2} onChange={handlePassword}/>
                <button className='bg-black text-white py-2 rounded-lg my-2' onClick={handleNewPassword}>Reset Password</button>
            </div>
        }
      </div>
    </div>
  )
}

export default ForgotPassword
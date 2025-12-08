import React, { useState, useEffect } from 'react';
import { Footer } from '../components';


const Error = () => {

  return (
    <div className='w-full flex flex-col items-center'>
        <header className='w-full flex justify-center py-6'>
          <a class="flex items-center tracking-wide no-underline hover:no-underline font-bold text-gray-800 text-2xl " href="#">
            <svg class="fill-current text-gray-800 mr-2" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24">
                <path d="M5,22h14c1.103,0,2-0.897,2-2V9c0-0.553-0.447-1-1-1h-3V7c0-2.757-2.243-5-5-5S7,4.243,7,7v1H4C3.447,8,3,8.447,3,9v11 C3,21.103,3.897,22,5,22z M9,7c0-1.654,1.346-3,3-3s3,1.346,3,3v1H9V7z M5,10h2v2h2v-2h6v2h2v-2h2l0.002,10H5V10z"></path>
            </svg>
            PUREWEAR
          </a>
        </header>
        <body className='w-full py-20 flex items-center justify-center'>
            <div className='w-10/12 md:w-1/2 lg:w-1/3 font-bold text-xl px-12 py-24 border border-gray-500 rounded-lg text-gray-600 flex justify-center'>
                <span className='pr-4'>404</span>
                <span>Page Not Found</span>
            </div>
        </body>
      <Footer/>
    </div>
  )
}

export default Error
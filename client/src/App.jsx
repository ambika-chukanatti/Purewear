import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { Error, Login, Signup, ForgotPassword, Dashboard, Product, Wishlist, Cart, Profile, Orders, Checkout, Payment, PaymentStatus } from './pages';

const App = () => {

  return (
  <BrowserRouter>
    <main className="relative flex flex-col justify-center w-full bg-[#f9fafe] min-h-[calc(100vh-73px)]">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/password/forgot" element={<ForgotPassword />} />
          <Route path="/product/:pid" element={<Product />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/cart/checkout" element={<Checkout />} />
          <Route path="/cart/checkout/payment" element={<Payment />} />
          <Route path="/cart/checkout/payment/status" element={<PaymentStatus />} />

          <Route path="*" element={<Error/>}/>
        </Routes>
    </main>
  </BrowserRouter>
)};

export default App;
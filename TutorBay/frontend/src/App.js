import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import HomePage from './pages/HomePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" index element={<LoginPage />} />
        <Route path="/signup" index element={<SignUpPage />} />
        <Route path="/verifyemail" index element={<VerifyEmailPage />} />
        <Route path="/forgotpassword" index element={<ForgotPasswordPage />} />
        <Route path="/resetpassword" index element={<ResetPasswordPage />} />
        <Route path="/home" index element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
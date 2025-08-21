// src/components/auth/UserAuthPage.jsx 
import React, { useState } from 'react';
import RegisterForm from './RegisterForm';
import LoginForm from './LoginForm';
import ForgotForm from './ForgotForm';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const UserAuthPage = () => {
  const [step, setStep] = useState('login');
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const goTo = (target) => setStep(target);

  const handleLoginSuccess = (userData) => {
    login(userData);
    navigate('/');
  };

  const handleRegisterSuccess = (userData) => {
    register(userData);
    navigate('/');
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="card shadow-sm p-4 w-100" style={{ maxWidth: '400px' }}>
        {step === 'register' && (
          <RegisterForm 
            goTo={goTo} 
            onSuccess={handleRegisterSuccess} 
          />
        )}
        {step === 'login' && (
          <LoginForm 
            goTo={goTo} 
            onSuccess={handleLoginSuccess} 
          />
        )}
        {step === 'forgot' && <ForgotForm goTo={goTo} />}
      </div>
    </div>
  );
};

export default UserAuthPage;
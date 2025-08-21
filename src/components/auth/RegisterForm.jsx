// src/components/auth/RegisterForm.jsx
import React, { useState } from 'react';
import axios from 'axios';

const RegisterForm = ({ goTo, onSuccess }) => {
  const [form, setForm] = useState({
    businessName: '',
    ownerName: '',
    businessEmail: '',
    businessPhone: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setIsSubmitting(true);

  if (form.password !== form.confirmPassword) {
    setError('Passwords do not match');
    setIsSubmitting(false);
    return;
  }

  try {
    const res = await axios.post('https://dg-b.onrender.com/api/auth/register', form);
    
    if (res.status === 201) {
      const { token, user } = res.data;

      //  Save token to localStorage
      localStorage.setItem('token', token);

      //  Notify parent of successful login
     onSuccess({ ...user, token });

    }
  } catch (err) {
    if (err.response?.status === 409) {
      setError('User with this email already exists');
    } else {
      setError(err.response?.data?.error || 'Registration failed');
    }
  } finally {
    setIsSubmitting(false);
  }
};


  return (
    <>
      <h4 className="text-center mb-3">Create Account</h4>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <input 
          name="businessName" 
          placeholder="Business Name" 
          value={form.businessName}
          onChange={handleChange} 
          required 
          className="form-control mb-2" 
        />
        <input 
          name="ownerName" 
          placeholder="Owner Name" 
          value={form.ownerName}
          onChange={handleChange} 
          required 
          className="form-control mb-2" 
        />
        <input 
          name="businessEmail" 
          placeholder="Email" 
          type="email" 
          value={form.businessEmail}
          onChange={handleChange} 
          required 
          className="form-control mb-2" 
        />
        <input 
          name="businessPhone" 
          placeholder="Phone" 
          value={form.businessPhone}
          onChange={handleChange} 
          required 
          className="form-control mb-2" 
        />
        <input 
          name="password" 
          placeholder="Password" 
          type="password" 
          value={form.password}
          onChange={handleChange} 
          required 
          className="form-control mb-2" 
        />
        <input 
          name="confirmPassword" 
          placeholder="Confirm Password" 
          type="password" 
          value={form.confirmPassword}
          onChange={handleChange} 
          required 
          className="form-control mb-3" 
        />
        <button 
          type="submit" 
          className="btn btn-primary w-100"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>
      <p className="text-center mt-3">
        Already have an account?{' '}
        <button className="btn btn-link p-0" onClick={() => goTo('login')}>
          Login here
        </button>
      </p>
    </>
  );
};

export default RegisterForm;
// src/components/auth/LoginForm.jsx
import React, { useState } from 'react';
import axios from 'axios';

const LoginForm = ({ goTo, onSuccess }) => {
  const [form, setForm] = useState({ businessEmail: '', password: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', form);

      if (res.status === 200) {
        const { token, user } = res.data;

        //  Save token to localStorage
        localStorage.setItem('token', token);

        //  Notify parent of successful login
        console.log("Success response from API:", user, token);
        onSuccess({ ...user, token });

      }
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  }


  return (
    <>
      <h4 className="text-center mb-3">Login to Your Account</h4>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
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
          name="password" 
          placeholder="Password" 
          type="password" 
          value={form.password}
          onChange={handleChange} 
          required 
          className="form-control mb-3" 
        />
        <button 
          type="submit" 
          className="btn btn-primary w-100"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p className="text-center mt-3">
        Forgot password?{' '}
        <button className="btn btn-link p-0" onClick={() => goTo('forgot')}>
          Reset here
        </button>
      </p>
      <p className="text-center">
        Don't have an account?{' '}
        <button className="btn btn-link p-0" onClick={() => goTo('register')}>
          Create Account
        </button>
      </p>
    </>
  );
};

export default LoginForm;
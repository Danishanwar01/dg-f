

import React, { useState } from 'react';
import axios from 'axios';

const ForgotForm = ({ goTo }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);
    try {
      const res = await axios.post('https://dg-b.onrender.com/api/auth/forgot', {
        businessEmail: email.trim(),
      });
      setMessage(res.data?.message || 'Reset link sent to your email');
    } catch (err) {
      setError(err.response?.data?.error || 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h4 className="text-center mb-3">Reset Password</h4>
      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <input
          name="businessEmail"
          placeholder="Registered Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="form-control mb-3"
        />
        <button type="submit" className="btn btn-warning w-100" disabled={loading}>
          {loading ? 'Sending…' : 'Send Reset Link'}
        </button>
      </form>

      <p className="text-center mt-3">
        Back to{' '}
        <button className="btn btn-link p-0" onClick={() => goTo('login')}>
          Login
        </button>
      </p>
    </>
  );
};

export default ForgotForm;



// // src/components/auth/ForgotForm.jsx
// import React, { useState } from 'react';
// import axios from 'axios';

// const ForgotForm = ({ goTo }) => {
//   const [email, setEmail] = useState('');
//   const [message, setMessage] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post('https://dg-b.onrender.com/api/auth/forgot', { businessEmail: email });
//       setMessage('Reset link sent to your email');
//     } catch (err) {
//       setMessage(err.response?.data?.error || 'Request failed');
//     }
//   };

//   return (
//     <> 
//       <h4 className="text-center mb-3">Reset Password</h4>
//       {message && <div className="alert alert-info">{message}</div>} 
//       <form onSubmit={handleSubmit}>
//         <input name="businessEmail" placeholder="Registered Email" type="email" onChange={(e) => setEmail(e.target.value)} required className="form-control mb-3" />
//         <button type="submit" className="btn btn-warning w-100">Send Reset Link</button>
//       </form>
//       <p className="text-center mt-3">
//         Back to{' '}
//         <button className="btn btn-link p-0" onClick={() => goTo('login')}>Login</button>
//       </p>
//     </>
//   );
// };

// export default ForgotForm;
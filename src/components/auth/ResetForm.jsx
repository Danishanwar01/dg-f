

import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const ResetForm = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`https://dg-b.onrender.com/api/auth/reset/${token}`, {
        password,
      });
      setMessage(res.data?.message || 'Password reset successful');
      setTimeout(() => navigate('/auth'), 1500); // back to auth page
    } catch (err) {
      setError(err.response?.data?.error || 'Reset failed or token expired');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="card shadow-sm p-4 w-100" style={{ maxWidth: '400px' }}>
        <h4 className="text-center mb-3">Set New Password</h4>
        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="form-control mb-3"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            className="form-control mb-3"
          />
          <button type="submit" className="btn btn-success w-100" disabled={loading}>
            {loading ? 'Resetting…' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetForm;




// import React, { useState } from 'react';
// import axios from 'axios';
// import { useParams } from 'react-router-dom';

// export default function ResetForm({ goTo }) {
//   const { token } = useParams();
//   const [password, setPassword] = useState('');
//   const [msg, setMsg] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post(`https://dg-b.onrender.com/api/auth/reset/${token}`, { password });
//       setMsg('Password reset successful. You can now log in.');
//     } catch (err) {
//       setMsg(err.response?.data?.error || 'Reset failed');
//     }
//   };

//   return (
//     <>
//       <h4 className="text-center mb-3">Set New Password</h4>
//       {msg && <div className="alert alert-info">{msg}</div>}
//       <form onSubmit={handleSubmit}>
//         <input
//           type="password"
//           placeholder="New Password"
//           onChange={(e) => setPassword(e.target.value)}
//           required
//           className="form-control mb-3"
//         />
//         <button type="submit" className="btn btn-success w-100">Reset Password</button>
//       </form>
//       <p className="text-center mt-3">
//         Back to{' '}
//         <button className="btn btn-link p-0" onClick={() => goTo('login')}>Login</button>
//       </p>
//     </>
//   );
// }

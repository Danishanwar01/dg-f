import React, { useState } from 'react';
import axios from 'axios';

const SubscriptionPage = ({ userId }) => {
  const [plan, setPlan] = useState('monthly');
  const [message, setMessage] = useState('');

  const handleSubscribe = async () => {
    try {
      const res = await axios.post('https://dg-b-1.onrender.com/api/auth/subscribe', { userId, plan });
      setMessage(`Payment of ₹${res.data.amount} successful!`);
    } catch (err) {
      setMessage(err.response?.data?.error || 'Payment failed');
    }
  };

  return (
    <div>
      <h2>Select a Subscription Plan</h2>
      <select value={plan} onChange={(e) => setPlan(e.target.value)}>
        <option value="monthly">Monthly - ₹99</option>
        <option value="sixMonth">6 Months - ₹499</option>
        <option value="yearly">Yearly - ₹999</option>
      </select>
      <button onClick={handleSubscribe}>Subscribe</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default SubscriptionPage;

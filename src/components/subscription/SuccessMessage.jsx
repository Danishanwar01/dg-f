import React from 'react';

const SuccessMessage = ({ goTo }) => (
  <div className="text-center">
    <h5 className="mb-3">🎉 Subscription Activated</h5>
    <p className="text-muted">You can now login using your credentials.</p>
    <button className="btn btn-primary" onClick={() => goTo('login')}>Go to Login</button>
  </div>
);

export default SuccessMessage;
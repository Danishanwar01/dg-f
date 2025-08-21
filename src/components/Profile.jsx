

import React from 'react';
import { User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
// import axios from 'axios'; // Only needed if using subscription

const Profile = () => {
  const { currentUser, logout } = useAuth();

  return (
    <div className="container mt-4">
  <div className="card shadow border-0 rounded-4 overflow-hidden">
    {/* Card Header */}
    <div className="card-header bg-white border-bottom-0 py-4 px-4">
      <h3 className="mb-0 fw-semibold text-primary">Profile</h3>
      
    </div>

    {/* Card Body */}
    <div className="card-body px-4 py-4">
      {currentUser ? (
        <>
          {/* User Info */}
          <div className="d-flex flex-column flex-md-row align-items-center mb-4 text-center text-md-start">
             <div 
                  className="bg-light rounded-circle d-flex align-items-center justify-content-center mb-3 mb-md-0" 
                  style={{ width: '80px', height: '80px' }}
                >
                  <User size={40} />
                </div>
            <div className="ms-md-4">
              <h4 className="mb-1 fw-bold">{currentUser.businessName}</h4>
              <p className="text-muted mb-0">{currentUser.ownerName}</p>
            </div>
          </div>

          {/* Contact Info */}
          <div className="row mb-4">
            <div className="col-12 col-md-6 mb-3">
              <div className="bg-light rounded-3 p-3 h-100 shadow-sm">
                <p className="mb-1 text-muted fw-semibold">Email</p>
                <p className="mb-0">{currentUser.businessEmail}</p>
              </div>
            </div>
            <div className="col-12 col-md-6 mb-3">
              <div className="bg-light rounded-3 p-3 h-100 shadow-sm">
                <p className="mb-1 text-muted fw-semibold">Phone</p>
                <p className="mb-0">{currentUser.businessPhone}</p>
              </div>
            </div>
          </div>

          <hr className="my-4" />

          {/* Logout */}
          <div className="d-flex justify-content-end">
            <button
              onClick={logout}
              className="btn btn-outline-danger d-flex align-items-center px-4 py-2"
            >
              <LogOut size={18} className="me-2" />
              Logout
            </button>
          </div>
        </>
      ) : (
        <div className="text-center text-muted py-4">
          No user data available. Please log in.
        </div>
      )}
    </div>
  </div>
</div>

    
               
              
  );
};

export default Profile;



// import React, { useState } from 'react';
// import { User, LogOut } from 'lucide-react';
// import { useAuth } from '../context/AuthContext';
// import axios from 'axios';

// const Profile = () => {
//   const { currentUser, logout } = useAuth();
//   // const [plan, setPlan] = useState('monthly');
//   // const [message, setMessage] = useState('');
//   // const [isSubscribed, setIsSubscribed] = useState(currentUser?.isSubscribed || false);

//   // const handleSubscribe = async () => {
//   //   try {
//   //     const res = await axios.post('http://localhost:5000/api/auth/subscribe', { 
//   //       userId: currentUser._id, 
//   //       plan 
//   //     });
//   //     setMessage(`✅ Payment of ₹${res.data.amount} successful!`);
//   //     setIsSubscribed(true);
//   //   } catch (err) {
//   //     setMessage(err.response?.data?.error || '❌ Payment failed');
//   //   }
//   // };

//   return (
//     <div className="container mt-4">
//       <div className="card shadow-sm">
//         <div className="card-header bg-white">
//           <h3 className="mb-0">Profile</h3>
//         </div>
//         <div className="card-body">
//           {currentUser ? (
//             <>
//               {/* User Info */}
//               <div className="d-flex align-items-center mb-4">
//                 <div 
//                   className="bg-light rounded-circle d-flex align-items-center justify-content-center" 
//                   style={{ width: '80px', height: '80px' }}
//                 >
//                   <User size={40} />
//                 </div>
//                 <div className="ms-4">
//                   <h4 className="mb-1">{currentUser.businessName}</h4>
//                   <p className="text-muted mb-0">{currentUser.ownerName}</p>
//                 </div>
//               </div>

//               <div className="row mb-3">
//                 <div className="col-md-6">
//                   <p><strong>Email:</strong> {currentUser.businessEmail}</p>
//                 </div>
//                 <div className="col-md-6">
//                   <p><strong>Phone:</strong> {currentUser.businessPhone}</p>
//                 </div>
//               </div>

//               {/* Subscription Section */}
//               <hr />
//               {/* <h5>Subscription</h5>
//               {isSubscribed ? (
//                 <p className="text-success">✅ You have an active subscription.</p>
//               ) : (
//                 <>
//                   <p className="text-muted">
//                     You have a <strong>15-day free trial</strong>.  
//                     Please subscribe to continue using the service after the trial.
//                   </p>

//                   <div className="mb-2">
//                     <select value={plan} onChange={(e) => setPlan(e.target.value)} className="form-select">
//                       <option value="monthly">Monthly - ₹99</option>
//                       <option value="sixMonth">6 Months - ₹499</option>
//                       <option value="yearly">Yearly - ₹999</option>
//                     </select>
//                   </div> */}

//                   {/* Benefits Text */}
//                   {/* <div className="small text-muted mb-3">
//                     {plan === 'monthly' && (
//                       <ul>
//                         <li>Unlimited customer, purchase & sales entries</li>
//                         <li>Data backup & restore</li>
//                         <li>Basic email support</li>
//                       </ul>
//                     )}
//                     {plan === 'sixMonth' && (
//                       <ul>
//                         <li>Everything in Monthly plan</li>
//                         <li>Priority email support</li>
//                         <li>2 free months compared to monthly plan</li>
//                       </ul>
//                     )}
//                     {plan === 'yearly' && (
//                       <ul>
//                         <li>Everything in Six Months plan</li>
//                         <li>Dedicated account manager</li>
//                         <li>3 free months compared to monthly plan</li>
//                       </ul>
//                     )}
//                   </div>

//                   <button onClick={handleSubscribe} className="btn btn-primary">
//                     Subscribe
//                   </button>
//                   {message && <p className="mt-2">{message}</p>}
//                 </>
//               )} */}

//               {/* Logout */}
//               {/* <hr /> */}
//               <button 
//                 onClick={logout}
//                 className="btn btn-danger d-flex align-items-center"
//               >
//                 <LogOut size={18} className="me-2" /> Logout
//               </button>
//             </>
//           ) : (
//             <p>No user data available. Please login.</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Profile;

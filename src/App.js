// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Purchase from './components/Purchase/Purchase';
import SalePage from './components/Sale/SalePage';
import CustomerPage from './components/Customer/CustomerPage';
import AnalyticsPage from './components/Analytics/AnalyticsPage';
import SettingsPage from './components/Settings/Settingspage';
import UserAuthPage from './components/auth/UserAuthPage';
import Profile from './components/Profile';
import './App.css';

import ResetForm from './components/auth/ResetForm';

function AppContent() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="d-flex" style={{marginTop:'25px', marginBottom:'50px'}}>
      {isAuthenticated && <Navbar />}
      <div className={`flex-grow-1 p-4 ${isAuthenticated ? 'main-content' : ''}`}>

        <Routes>
          <Route path="/login" element={!isAuthenticated ? <UserAuthPage /> : <Navigate to="/" replace />} />
          
           <Route path="/reset/:token" element={<ResetForm/>} />

          {isAuthenticated ? (
            <>
              <Route path="/" element={<Home />} />
              <Route path='/purchase' element={<Purchase />} />
              <Route path='/sale' element={<SalePage/>}/>
              <Route path='/customer' element={<CustomerPage/>}/>
              <Route path='/analytics' element={<AnalyticsPage/>}/>
              {/* <Route path='/settings' element={<SettingsPage/>}/> */}
              <Route path='/profile' element={<Profile />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </>
          ) : (
            <Route path="*" element={<Navigate to="/login" replace />} />
          )}
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
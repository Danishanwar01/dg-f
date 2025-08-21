import React, { useState } from 'react';
import ProfileSettings from './Settings/ProfileSettings';
import UserPreferences from './Settings/UserPreferences';
import SecuritySettings from './Settings/SecuritySettings';
import DataSettings from './Settings/DataSettings';
import AppRulesSettings from './Settings/AppRulesSettings';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('profile');

  const renderTab = () => {
    switch (activeTab) {
      case 'profile': return <ProfileSettings />;
      case 'preferences': return <UserPreferences />;
      case 'security': return <SecuritySettings />;
      case 'data': return <DataSettings />;
      case 'rules': return <AppRulesSettings />;
      default: return <ProfileSettings />;
    }
  };

  return (
    <div className="container-fluid">
      <h4 className="my-3">Settings</h4>
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>Profile</button>
        </li>
        {/* <li className="nav-item">
          <button className={`nav-link ${activeTab === 'preferences' ? 'active' : ''}`} onClick={() => setActiveTab('preferences')}>Preferences</button>
        </li> */}
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'security' ? 'active' : ''}`} onClick={() => setActiveTab('security')}>Security</button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'data' ? 'active' : ''}`} onClick={() => setActiveTab('data')}>Data</button>
        </li>
      {/*   <li className="nav-item">
          <button className={`nav-link ${activeTab === 'rules' ? 'active' : ''}`} onClick={() => setActiveTab('rules')}>Business Rules</button>
        </li> */}
      </ul>

      {renderTab()}
    </div>
  );
};

export default SettingsPage;
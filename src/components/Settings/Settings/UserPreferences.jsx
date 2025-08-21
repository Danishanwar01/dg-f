import React from 'react';

const UserPreferences = () => (
  <div className="card p-4 shadow-sm">
    <h6>User Preferences</h6>
    <form className="row g-3 mt-3">
      <div className="col-md-6">
        <label className="form-label">Date Format</label>
        <select className="form-select">
          <option>DD-MM-YYYY</option>
          <option>MM-DD-YYYY</option>
        </select>
      </div>
      <div className="col-md-6">
        <label className="form-label">Currency</label>
        <select className="form-select">
          <option>₹ INR</option>
          <option>$ USD</option>
          <option>€ EUR</option>
        </select>
      </div>
      <div className="col-md-6">
        <label className="form-label">Theme</label>
        <select className="form-select">
          <option>Light</option>
          <option>Dark</option>
        </select>
      </div>
      <div className="col-12">
        <button type="submit" className="btn btn-primary">Save</button>
      </div>
    </form>
  </div>
);

export default UserPreferences;
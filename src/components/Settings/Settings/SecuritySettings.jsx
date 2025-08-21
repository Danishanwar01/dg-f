import React from 'react';

const SecuritySettings = () => (
  <div className="card p-4 shadow-sm">
    <h6>Security Settings</h6>
    <form className="row g-3 mt-3">
      <div className="col-md-6">
        <label className="form-label">New Password</label>
        <input type="password" className="form-control" />
      </div>
      <div className="col-md-6">
        <label className="form-label">Confirm Password</label>
        <input type="password" className="form-control" />
      </div>
      <div className="col-12">
        <button type="submit" className="btn btn-danger">Update Password</button>
      </div>
    </form>
  </div>
);

export default SecuritySettings;
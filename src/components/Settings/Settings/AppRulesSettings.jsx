import React from 'react';

const AppRulesSettings = () => (
  <div className="card p-4 shadow-sm">
    <h6>Business Rule Settings</h6>
    <form className="row g-3 mt-3">
      <div className="col-md-6">
        <label className="form-label">Auto Update Stock</label>
        <select className="form-select">
          <option>Yes</option>
          <option>No</option>
        </select>
      </div>
      <div className="col-md-6">
        <label className="form-label">Default Tax (%)</label>
        <input type="number" className="form-control" placeholder="Enter tax percent" />
      </div>
      <div className="col-md-6">
        <label className="form-label">Default Discount (%)</label>
        <input type="number" className="form-control" placeholder="Enter discount percent" />
      </div>
      <div className="col-md-12">
        <label className="form-label">Invoice Format</label>
        <input type="text" className="form-control" placeholder="e.g. INV-0001" />
      </div>
      <div className="col-12">
        <button type="submit" className="btn btn-primary">Save Settings</button>
      </div>
    </form>
  </div>
);

export default AppRulesSettings;

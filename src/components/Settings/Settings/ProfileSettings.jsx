//  components/settings/ProfileSettings.jsx
import React from 'react';

const ProfileSettings = () => (
  <div className="card p-4 shadow-sm">
    <div className="mb-1">
  <h6 className="text-2xl font-bold text-gray-900">Business Profile</h6>
  <p className="text-sm text-gray-600 mt-1">
    Generate polished, client-ready bills in minutes with these efficient steps.
  </p>
</div>
    <form className="row g-3 mt-0">
      <div className="col-md-6">
        <label className="form-label">Business Name</label>
        <input type="text" className="form-control" placeholder="Enter business name" />
      </div>
      <div className="col-md-6">
        <label className="form-label">Owner Name</label>
        <input type="text" className="form-control" placeholder="Enter owner name"  />
      </div>
      <div className="col-md-6">
        <label className="form-label">Email (Business)</label>
        <input type="email" className="form-control" placeholder="example@email.com"  />
      </div>
      <div className="col-md-6">
        <label className="form-label">Phone (Business)</label>
        <input type="text" className="form-control" placeholder="1234567890" />
      </div>
      <div className="col-md-6">
        <label className="form-label">GST Number</label>
        <input type="text" className="form-control" placeholder="Enter GST No"  />
      </div>
      <div className="col-md-6">
        <label className="form-label">PAN Number</label>
        <input type="text" className="form-control" placeholder="Enter PAN No (optional)"  />
      </div>
      <div className="col-md-12">
        <label className="form-label">Business Address</label>
        <input type="text" className="form-control" placeholder="Enter Business Address"  />
      </div>
      
      {/* <div className='col-md-12' style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div className="col-md-3.6">
        <label className="form-label">Upload Company Logo</label>
        <input type="file" className="form-control" />
      </div>
        <div className="col-md-3.6">
        <label className="form-label">Upload Digital signature</label>
        <input type="file" className="form-control" />
      </div>
        <div className="col-md-3.6">
        <label className="form-label">Upload Company Logo</label>
        <input type="file" className="form-control" />
      </div>
      </div> */}
      <div className="col-12">
        <button type="submit" className="btn btn-primary">Save Profile</button>
      </div>
    </form>
  </div>
);

export default ProfileSettings;

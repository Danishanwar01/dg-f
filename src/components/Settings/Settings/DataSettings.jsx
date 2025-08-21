import React from 'react';

const DataSettings = () => (
  <div className="card p-4 shadow-sm">
    <h6>Data Management</h6>
    <div className="mt-3">
      <button className="btn btn-outline-primary me-3">Backup Data</button>
      {/* <button className="btn btn-outline-success me-3">Import CSV</button>
      <button className="btn btn-outline-warning me-3">Export CSV</button> */}
      <button className="btn btn-outline-danger">Delete All Data</button>
    </div>
  </div>
);

export default DataSettings;
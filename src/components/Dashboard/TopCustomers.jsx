import React from 'react';

const TopCustomers = ({ customers=[] }) => (
  <div className="card p-3 shadow-sm" style={{ height:'310px'}}>
    <h6>Top Customers</h6>
    <ul className="list-group list-group-flush mt-3">
      {customers.map((c, i) => (
        <li key={i} className="list-group-item d-flex justify-content-between">
          {c.name}
          <span>Rs. {c.total.toFixed(2)}</span>
        </li>
      ))}
    </ul>
  </div>
);

export default TopCustomers;

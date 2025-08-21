import React from 'react';

const OrdersTable = ({ orders=[] }) => (
  <div className="card p-3 shadow-sm">
    <h6>Recent Orders</h6>
    <table className="table table-striped mt-3">
     <thead>
  <tr>
    <th>Customer</th>
    <th>Product</th>
    <th>Date</th>
    <th>Status</th>
  </tr>
</thead>
<tbody>
  {orders.length ? orders.map((o,i) => (
    <tr key={i}>
      <td>{o.customerName}</td>
      <td>{o.item}</td>
      <td>{o.date}</td>
      <td>
        <span className={`badge bg-${
            o.status === 'Paid' ? 'success' :
            o.status === 'Pending' ? 'warning' :
            'secondary'
          }`}>
          {o.status}
        </span>
      </td>
    </tr>
  )) : (
    <tr>
      <td colSpan="4" className="text-center">No recent orders</td>
    </tr>
  )}
</tbody>

    </table>
  </div>
);

export default OrdersTable;

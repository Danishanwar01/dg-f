import React from 'react';
import '../../styles/Table.css'

const getStatusBadge = (status) => {
  switch (status) {
    case 'Paid': return <span className="badge bg-success">{status}</span>;
    case 'Partial': return <span className="badge bg-warning text-dark">{status}</span>;
    case 'Unpaid': return <span className="badge bg-danger">{status}</span>;
    default: return <span className="badge bg-secondary">{status}</span>;
  }
};

const TransactionTable = ({ data = [], onGenerateBill, onEditPurchase, onDeletePurchase }) => {

  return (
     <div className="card shadow-sm p-3">
      <div className="table-responsive">
        <table className="table table-bordered align-middle responsive-table">
          <thead className="bg-primary text-white">
            <tr>
              <th>Customer</th>
              <th>Product</th>
              <th>Qty</th>
              <th>Rate</th>
              <th>Amount</th>
              <th>Tax</th>
              <th>Status</th>
              <th>Date</th>
              <th>Note</th>
              <th>Actions</th>
              
            </tr>
            
          </thead>
         <tbody>
  {data.length ? data.map((s, idx) => (
    <React.Fragment key={idx} className='hr'>
      {s.products.map((p, pIndex) => (
        <tr key={`${idx}-${pIndex}`}>
          {/* Customer name only once with rowSpan */}
          {pIndex === 0 && (
            <td rowSpan={s.products.length} data-label="Customer">
              {s.customer?.name || 'Unknown'}
            </td>
          )}

          {/* Product and related fields (always shown) */}
          <td data-label="Product">{p.name}</td>
          <td data-label="Qty">{p.quantity} {p.unit}</td>
          <td data-label="Rate">₹{p.rate}</td>
          <td data-label="Amount">₹{(p.quantity * p.rate).toFixed(2)}</td>
          <td data-label="Tax">{p.tax || 0}%</td>

          {/* Desktop-only merged columns */}
          {pIndex === 0 && (
            <>
              <td className="desktop-only" rowSpan={s.products.length}>
                {getStatusBadge(s.paymentStatus)}
              </td>
              <td className="desktop-only" rowSpan={s.products.length}>
                {new Date(s.created).toLocaleDateString()}
              </td>
              <td className="desktop-only" rowSpan={s.products.length}>
                {s.notes || '-'}
              </td>
              <td className="desktop-only" rowSpan={s.products.length}>
                <div className="d-flex flex-column gap-1">
                  <button className="btn btn-sm btn-outline-primary" onClick={() => onGenerateBill(s)}>Bill</button>
                  <button className="btn btn-sm btn-outline-secondary" onClick={() => onEditPurchase(s)}>Edit</button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => onDeletePurchase(s._id)}>Delete</button>
                </div>
              </td>
            </>
          )}       
        </tr>
        
      ))}

      {/* Mobile-only footer rows */}
      <tr className="mobile-footer-row">
        <td colSpan="6" data-label="Status">
          <strong></strong> {getStatusBadge(s.paymentStatus)}
        </td>
      </tr>
      <tr className="mobile-footer-row">
        <td colSpan="6" data-label="Date">
          <strong></strong> {new Date(s.created).toLocaleDateString()}
        </td>
      </tr>
      <tr className="mobile-footer-row">
        <td colSpan="6" data-label="Note">
          <strong></strong> {s.notes || '-'}
        </td>
      </tr>
      <tr className="mobile-footer-row">
        <td colSpan="6" data-label="Actions">
          <div className="d-flex flex-column gap-1">
            <button className="btn btn-sm btn-outline-primary" onClick={() => onGenerateBill(s)}>Bill</button>
            <button className="btn btn-sm btn-outline-secondary" onClick={() => onEditPurchase(s)}>Edit</button>
            <button className="btn btn-sm btn-outline-danger" onClick={() => onDeletePurchase(s._id)}>Delete</button>
          </div>
        </td>

      </tr>
        <hr style={{ margin: '1rem 0', borderColor: '#ddd' }} />
     
    </React.Fragment>
  )) : (
    <tr>
      <td colSpan="10" className="text-center">No Purchases found.</td>
    </tr>
  )}
</tbody>

        </table>
      </div>
    </div>

  );
};

export default TransactionTable;

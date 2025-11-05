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
  {data.length ? ([...data].reverse().map((s, idx) => (
      <React.Fragment key={idx}>
        {s.products.map((p, pIndex) => (
          <tr key={`${idx}-${pIndex}`}>
            {/* Customer name (rowSpan for first product only) */}
            {pIndex === 0 && (
              <td rowSpan={s.products.length} data-label="Customer">
                {s.customer?.name || 'Unknown'}
              </td>
            )}

            {/* Product details */}
            <td data-label="Product">{p.name}</td>
            <td data-label="Qty">{p.quantity} {p.unit}</td>
            <td data-label="Rate">₹{p.rate}</td>
            <td data-label="Amount">₹{(p.quantity * p.rate).toFixed(2)}</td>
            <td data-label="Tax">{p.tax || 0}%</td>

            {/* Desktop-only merged columns (rowSpan for first product) */}
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
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => onGenerateBill(s)}
                    >
                      Bill
                    </button>
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => onEditPurchase(s)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => onDeletePurchase(s._id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </>
            )}
          </tr>
        ))}

        {/* Mobile-only rows */}
        <tr className="mobile-footer-row">
          <td colSpan="10">
            <div className="mobile-info">
              <div><strong>Status:</strong> {getStatusBadge(s.paymentStatus)}</div>
              <div><strong>Date:</strong> {new Date(s.created).toLocaleDateString()}</div>
              <div><strong>Note:</strong> {s.notes || '-'}</div>
              <div className="d-flex flex-column gap-1 mt-2">
                <button className="btn btn-sm btn-outline-primary" onClick={() => onGenerateBill(s)}>Bill</button>
                <button className="btn btn-sm btn-outline-secondary" onClick={() => onEditPurchase(s)}>Edit</button>
                <button className="btn btn-sm btn-outline-danger" onClick={() => onDeletePurchase(s._id)}>Delete</button>
              </div>
            </div>
          </td>
        </tr>

        {/* Row separator (safe inside tbody) */}
        <tr>
          <td colSpan="10" style={{ padding: 0 }}>
            <hr style={{ margin: '1rem 0', borderColor: '#ddd' }} />
          </td>
        </tr>
      </React.Fragment>
    ))
  ) : (
    <tr>
      <td colSpan="10" className="text-center">No Purchase found.</td>
    </tr>
  )}
</tbody>

    
            </table>
          </div>
        </div>

  );
};

export default TransactionTable;
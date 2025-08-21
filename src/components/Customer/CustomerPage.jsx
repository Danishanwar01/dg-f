//digipocket/src/components/customer/customerpage.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CustomerFormModal from './CustomerFormmodal';
import { Spinner } from 'react-bootstrap';

export default function CustomerPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [customers, setCustomers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editCustomer, setEditCustomer] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const API_URL = `https://dg-b.onrender.com/api/customer/${user.id}`;

  useEffect(() => {
    fetchCustomers();
    // eslint-disable-next-line
  }, []);

  const fetchCustomers = async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await axios.get(API_URL);
      setCustomers(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch customers');
    }
    setIsLoading(false);
  };

  const handleAdd = () => {
    setEditCustomer(null);
    setShowModal(true);
  };

  const handleEdit = (customer) => {
    setEditCustomer(customer);
    setShowModal(true);
  };

  const handleDelete = async (cust) => {
    if (!window.confirm('Are you sure you want to delete this customer?')) return;
    setError('');
    try {
      await axios.delete(`${API_URL}/${cust._id}`);
      fetchCustomers();
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed');
    }
  };

  const handleSave = async (customerData) => {
    setError('');
    try {
      if (editCustomer) {
        await axios.put(`${API_URL}/${editCustomer._id}`, customerData);
      } else {
        await axios.post(API_URL, customerData);
      }
      fetchCustomers();
    } catch (err) {
      setError(err.response?.data?.message || 'Save failed');
    }
  };

  // Tab + Search filter
  const getFilteredCustomers = () => {
    let filtered = [...customers];
    if (activeTab !== 'all') {
      if (activeTab === 'buyers')
        filtered = filtered.filter(c => c.type === 'Buyer' || c.type === 'Both');
      else if (activeTab === 'sellers')
        filtered = filtered.filter(c => c.type === 'Seller' || c.type === 'Both');
      else if (activeTab === 'both')
        filtered = filtered.filter(c => c.type === 'Both');
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(c =>
        c.name?.toLowerCase().includes(q) ||
        c.contact_info?.phone?.toLowerCase().includes(q) ||
        c.status?.toLowerCase().includes(q) ||
        c.type?.toLowerCase().includes(q)
      );
    }
    return filtered;
  };

  const renderTable = (data) => (
   <>
  {/* Desktop Table */}
  <div className="d-none d-md-block">
    <table className="table table-hover align-middle">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Status</th>
          <th>Type</th>
          <th>Created</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.length > 0 ? (
          data.map((cust) => (
            <tr key={cust._id}>
              <td>{cust.name}</td>
              <td>{cust.contact_info?.email}</td>
              <td>{cust.contact_info?.phone}</td>
              <td>
                <span className={`badge bg-${cust.status === 'Active' ? 'success' : 'danger'}`}>
                  {cust.status}
                </span>
              </td>
              <td>{cust.type}</td>
              <td>{cust.created ? new Date(cust.created).toLocaleDateString() : '-'}</td>
              <td>
                <button
                  className="btn btn-sm btn-outline-primary me-2"
                  onClick={() => handleEdit(cust)}
                >
                  <i className="bi bi-pencil"></i>
                </button>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => handleDelete(cust)}
                >
                  <i className="bi bi-trash"></i>
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="7" className="text-center text-muted">
              No customers found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>

  {/* Mobile Cards */}
  <div className="d-block d-md-none">
    {data.length > 0 ? (
      data.map((cust) => (
        <div className="card mb-3" key={cust._id}>
          <div className="card-body">
            <h5 className="card-title">{cust.name}</h5>
            <p className="card-text mb-1"><strong>Email:</strong> {cust.contact_info?.email}</p>
            <p className="card-text mb-1"><strong>Phone:</strong> {cust.contact_info?.phone}</p>
            <p className="card-text mb-1">
              <strong>Status:</strong>{' '}
              <span className={`badge bg-${cust.status === 'Active' ? 'success' : 'danger'}`}>
                {cust.status}
              </span>
            </p>
            <p className="card-text mb-1"><strong>Type:</strong> {cust.type}</p>
            <p className="card-text mb-2"><strong>Created:</strong> {cust.created ? new Date(cust.created).toLocaleDateString() : '-'}</p>
            <div>
              <button
                className="btn btn-sm btn-outline-primary me-2"
                onClick={() => handleEdit(cust)}
              >
                <i className="bi bi-pencil"></i>
              </button>
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={() => handleDelete(cust)}
              >
                <i className="bi bi-trash"></i>
              </button>
            </div>
          </div>
        </div>
      ))
    ) : (
      <p className="text-center text-muted">No customers found.</p>
    )}
  </div>
</>

  );

  return (
   <div className="container-fluid px-0">
  {/* Header */}
  <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center my-3">
    <h4 className="mb-2 mb-md-0">Customer Management</h4>
    <button className="btn btn-success" onClick={handleAdd}>
      + Add Customer
    </button>
  </div>

  {/* Error */}
  {error && <div className="alert alert-danger py-2">{error}</div>}

  {/* Tabs + Search */}
  <div className="d-flex flex-column flex-md-row align-items-stretch mb-3">
    <ul className="nav nav-tabs flex-wrap flex-md-nowrap me-md-3 mb-2 mb-md-0">
      <li className="nav-item">
        <button
          className={`nav-link ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All
        </button>
      </li>
      <li className="nav-item">
        <button
          className={`nav-link ${activeTab === 'buyers' ? 'active' : ''}`}
          onClick={() => setActiveTab('buyers')}
        >
          Buyers
        </button>
      </li>
      <li className="nav-item">
        <button
          className={`nav-link ${activeTab === 'sellers' ? 'active' : ''}`}
          onClick={() => setActiveTab('sellers')}
        >
          Sellers
        </button>
      </li>
      <li className="nav-item">
        <button
          className={`nav-link ${activeTab === 'both' ? 'active' : ''}`}
          onClick={() => setActiveTab('both')}
        >
          Both
        </button>
      </li>
    </ul>

    {/* Search Input */}
    <div className="ms-md-auto w-100 w-md-25">
      <input
        type="text"
        className="form-control"
        placeholder="Search by name, phone, status, type"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  </div>

  {/* Table / Loader */}
  {/* <div className="card shadow-sm p-3">
    {isLoading ? (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
      </div>
    ) : (
      renderTable(getFilteredCustomers())
    )}
  </div> */}
  {/* Table / Loader - Desktop with Card Shadow */}
<div className="card shadow-sm p-3 d-none d-md-block">
  {isLoading ? (
    <div className="text-center py-5">
      <Spinner animation="border" variant="primary" />
    </div>
  ) : (
    renderTable(getFilteredCustomers())
  )}
</div>

{/* Table / Loader - Mobile without Card Shadow */}
<div className="d-block d-md-none">
  {isLoading ? (
    <div className="text-center py-5">
      <Spinner animation="border" variant="primary" />
    </div>
  ) : (
    renderTable(getFilteredCustomers())
  )}
</div>


  {/* Modal */}
  <CustomerFormModal
    show={showModal}
    onClose={() => setShowModal(false)}
    onSave={handleSave}
    editData={editCustomer}
  />
</div>

  );
}



// import React, { useState, useEffect } from 'react';
// import CustomerFormModal from './CustomerFormmodal';

// export default function CustomerPage() {
//   const [customers, setCustomers] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [editCustomer, setEditCustomer] = useState(null);
//   const [search, setSearch] = useState('');
//   const user = JSON.parse(localStorage.getItem('user') || '{}');

//   // Fetch all customers of current user on mount
//   useEffect(() => {
//     fetchCustomers();
//     // eslint-disable-next-line
//   }, []);

//   function fetchCustomers() {
//     fetch(`https://dg-b.onrender.com/api/customer/${user.id}`)
//       .then(res => res.json())
//       .then(setCustomers)
//       .catch(() => setCustomers([]));
//   }

//   function handleSave(customerObj) {
//     if (editCustomer) {
//       // Update
//       fetch(
//         `https://dg-b.onrender.com/api/customer/${user.id}/${editCustomer._id}`,
//         {
//           method: 'PUT',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify(customerObj)
//         }
//       )
//         .then(res => res.json())
//         .then(() => fetchCustomers());
//     } else {
//       // Create
//       fetch(`https://dg-b.onrender.com/api/customer/${user.id}`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(customerObj)
//       })
//         .then(res => res.json())
//         .then(() => fetchCustomers());
//     }
//   }

//   function handleDelete(cust) {
//     if (!window.confirm('Delete this customer?')) return;
//     fetch(
//       `https://dg-b.onrender.com/api/customer/${user.id}/${cust._id}`,
//       { method: 'DELETE' }
//     )
//       .then(res => res.json())
//       .then(() => fetchCustomers());
//   }

//   // Filter by search if needed
//   const data = search.trim()
//     ? customers.filter(
//         c => c.name?.toLowerCase().includes(search.toLowerCase()) ||
//              c.contact_info?.phone?.includes(search))
//     : customers;

//   return (
//     <div className="container">
//       <div className="d-flex justify-content-between align-items-center my-3">
//         <h4>Customer Management</h4>
//         <button onClick={() => { setEditCustomer(null); setShowModal(true); }} className="btn btn-success">
//           + Add Customer
//         </button>
//       </div>
//       <input
//         type="text"
//         className="form-control mb-2"
//         placeholder="Search by name/phone"
//         value={search}
//         onChange={e => setSearch(e.target.value)}
//         style={{ maxWidth: 400 }}
//       />
//       <table className="table table-hover align-middle">
//         <thead>
//           <tr>
//             <th>Name</th>
//             <th>Email</th><th>Phone</th>
//             <th>Status</th>
//             <th>Type</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {data.map(c => (
//             <tr key={c._id}>
//               <td>{c.name}</td>
//               <td>{c.contact_info?.email}</td>
//               <td>{c.contact_info?.phone}</td>
//               <td>{c.status}</td>
//               <td>{c.type}</td>
//               <td>
//                 <button onClick={() => { setEditCustomer(c); setShowModal(true); }}
//                         className="btn btn-sm btn-outline-primary me-2">Edit</button>
//                 <button className="btn btn-sm btn-outline-danger"
//                         onClick={() => handleDelete(c)}>Delete</button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//       <CustomerFormModal
//         show={showModal}
//         editData={editCustomer}
//         onClose={() => setShowModal(false)}
//         onSave={handleSave}
//       />
//     </div>
//   );
// }



import React, { useEffect, useState } from 'react';
import StatCards from './StatCards';
import TransactionTable from './TransactionTable';
import SaleFormModal from './SaleFormModal';
import BillModal from './BillModal';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function SalePage() {
  const [showModal, setShowModal] = useState(false);
  const [sales, setSales] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [filters, setFilters] = useState({ period: 'week', status: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [showBillModal, setShowBillModal] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);
  const [editingSale, setEditingSale] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const API_URL = `http://localhost:5000/api/sale/${user.id}`;
  const CUSTOMER_URL = `http://localhost:5000/api/customer/${user.id}`;

  useEffect(() => {
    fetchSales();
    // eslint-disable-next-line
  }, []);

  const fetchSales = async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await axios.get(API_URL);
      setSales(res.data);
      setFiltered(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch sales');
    }
    setIsLoading(false);
  };

  useEffect(() => {
    let data = [...sales];
    // Filter status & date range
    if (filters.status) data = data.filter(s => s.paymentStatus === filters.status);
    const now = new Date();
    data = data.filter(sale => {
      const saleDate = new Date(sale.created);
      switch (filters.period) {
        case 'day': return saleDate.toDateString() === now.toDateString();
        case 'week': {
          const weekStart = new Date(now); weekStart.setDate(now.getDate() - now.getDay());
          const weekEnd = new Date(weekStart); weekEnd.setDate(weekEnd.getDate() + 6);
          return saleDate >= weekStart && saleDate <= weekEnd;
        }
        case 'month':
          return saleDate.getMonth() === now.getMonth() && saleDate.getFullYear() === now.getFullYear();
        case 'year':
          return saleDate.getFullYear() === now.getFullYear();
        default: return true;
      }
    });
    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      data = data.filter(s =>
        s.products.some(p => p.name.toLowerCase().includes(q)) ||
        s.customer?.name?.toLowerCase().includes(q) ||
        s.paymentStatus?.toLowerCase().includes(q)
      );
    }
    setFiltered(data);
  }, [filters, sales, searchQuery]);

  const handleAddSale = async (data) => {
    try {
      if (editingSale) {
        await axios.put(`${API_URL}/${editingSale._id}`, data);
      } else {
        await axios.post(API_URL, data);
      }
      setEditingSale(null);
      fetchSales();
    } catch (err) {
      setError('Failed to save sale');
    }
    setShowModal(false);
  };

  const handleEditSale = (sale) => {
    setEditingSale(sale);
    setShowModal(true);
  };

  const handleDeleteSale = async (id) => {
    if (!window.confirm('Are you sure you want to delete this sale?')) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchSales();
    } catch (err) {
      setError('Failed to delete sale');
    }
  };

  const handleGenerateBill = (sale) => {
    setSelectedSale(sale);
    setShowBillModal(true);
  };

  // 📄 Export CSV
  const handleExportCSV = () => {
    if (!filtered.length) return alert("No data to export!");
    const csv = [
      ['Customer', 'Product', 'Qty', 'Rate', 'Amount', 'Tax', 'Status', 'Date'],
      ...filtered.flatMap(sale =>
        sale.products.map(p => [
          sale.customer?.name || 'Unknown',
          p.name,
          p.quantity,
          p.rate,
          (p.quantity * p.rate).toFixed(2),
          p.tax || 0,
          sale.paymentStatus,
          new Date(sale.created).toLocaleDateString()
        ])
      )
    ];
    const blob = new Blob([csv.map(r => r.join(',')).join('\n')], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'sales-report.csv';
    link.click();
  };

  // 📄 Export PDF
  const handleExportPDF = () => {
    if (!filtered.length) return alert("No data to export!");
    const doc = new jsPDF('landscape');
    doc.setFontSize(18);
    doc.setTextColor('#333');
    doc.text('Sales Report', 14, 15);
    autoTable(doc, {
      startY: 25,
      head: [['Customer', 'Product', 'Qty', 'Rate', 'Amount', 'Tax', 'Status', 'Date']],
      body: filtered.flatMap(sale =>
        sale.products.map(p => [
          sale.customer?.name || 'Unknown',
          p.name,
          p.quantity,
          p.rate,
          (p.quantity * p.rate).toFixed(2),
          p.tax || 0,
          sale.paymentStatus,
          new Date(sale.created).toLocaleDateString()
        ])
      ),
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: '#343a40', textColor: '#fff', halign: 'center' },
      alternateRowStyles: { fillColor: '#f9f9f9' },
    });
    doc.save('sales-report.pdf');
  };

  // 🖨 Print
  const handlePrint = () => {
    const content = document.getElementById('transaction-table');
    if (!content) return alert("Table not found!");
    const win = window.open('', '', 'width=800,height=600');
    win.document.write('<html><head><title>Print Sales</title></head><body>');
    win.document.write(content.innerHTML);
    win.document.write('</body></html>');
    win.document.close();
    win.print();
  };

  // Stats
  const statsData = { totalSales: 0, outstanding: 0, totalUnits: 0, totalTax: 0 };
  filtered.forEach(sale => {
    let saleTotal = 0, taxTotal = 0, unitCount = 0;
    sale.products.forEach(p => {
      const base = p.quantity * p.rate;
      const tax = (base * (p.tax || 0)) / 100;
      saleTotal += base + tax; taxTotal += tax; unitCount += p.quantity;
    });
    statsData.totalSales += saleTotal;
    statsData.totalTax += taxTotal;
    statsData.totalUnits += unitCount;
    if (sale.paymentStatus !== 'Paid') statsData.outstanding += saleTotal;
  });

  return (
    <div className="container-fluid px-0" >
     <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center my-3 gap-3">
  <h4>Sales</h4>
  
  <div className="d-grid gap-2 d-md-flex" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
    <button className="btn btn-outline-secondary" onClick={handlePrint}>Print</button>
    <button className="btn btn-primary" onClick={handleExportCSV}>Download CSV</button>
    <button className="btn btn-warning" onClick={handleExportPDF}>Download PDF</button>
    <button className="btn btn-success" onClick={() => setShowModal(true)}>+ Add Sales</button>
  </div>
</div>

      {/* Filters */}
     <div className="row mb-4 g-3">
  {/* Filters (Left side - 50% on md+, full on mobile) */}
  <div className="col-12 col-md-6 d-flex flex-wrap gap-2 align-items-center">
    <select
      className="form-select w-auto"
      value={filters.period}
      onChange={e => setFilters({ ...filters, period: e.target.value })}
    >
      <option value="day">Day</option>
      <option value="week">Week</option>
      <option value="month">Month</option>
      <option value="year">Year</option>
    </select>

    <select
      className="form-select w-auto"
      value={filters.status}
      onChange={e => setFilters({ ...filters, status: e.target.value })}
    >
      <option value="">All Status</option>
      <option value="Paid">Paid</option>
      <option value="Unpaid">Unpaid</option>
      <option value="Partial">Partial</option>
    </select>
  </div>

  {/* Search input (Right side - 50% on md+, full on mobile) */}
  <div className="col-12 col-md-6">
    <input
      type="text"
      className="form-control"
      placeholder="Search by product, customer or status"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
    />
  </div>
</div>

      <StatCards type="sale" statsData={statsData} />

      <div id="transaction-table">
        {isLoading ? (
          <div className="text-center py-5">
            <span className="spinner-border text-primary" />
          </div>
        ) : (
          <TransactionTable
            data={filtered}
            onGenerateBill={handleGenerateBill}
            onEditSale={handleEditSale}
            onDeleteSale={handleDeleteSale}
          />
        )}
      </div>

      <SaleFormModal
        show={showModal}
        handleClose={() => { setShowModal(false); setEditingSale(null); }}
        onSubmit={handleAddSale}
        editingSale={editingSale}
        customerApi={CUSTOMER_URL}
      />

      <BillModal
        show={showBillModal}
        handleClose={() => setShowBillModal(false)}
        sale={selectedSale}
      />
    </div>
  );
}




// import React, { useEffect, useState } from 'react';
// import StatCards from './StatCards';
// import TransactionTable from './TransactionTable';
// import SaleFormModal from './SaleFormModal';
// import axios from 'axios';
// import jsPDF from 'jspdf';
// import autoTable from 'jspdf-autotable';
// import BillModal from './BillModal';


// const SalePage = () => {
//   const [showModal, setShowModal] = useState(false);
//   const [sales, setSales] = useState([]);
//   const [filtered, setFiltered] = useState([]);
//   const [filters, setFilters] = useState({
//     period: 'week',
//     yearWeek: '2025-W30',
//     status: '',
//   });
//   const [searchQuery, setSearchQuery] = useState('');

//   const [showBillModal, setShowBillModal] = useState(false);
//   const [selectedSale, setSelectedSale] = useState(null);



//   useEffect(() => {
//     axios.get('http://localhost:5000/api/sales')
//       .then(res => {
//         setSales(res.data);
//         setFiltered(res.data);
//       });
//   }, []);

//   useEffect(() => {
//     let data = [...sales];

//     // Filter by status
//     if (filters.status) {
//       data = data.filter(s => s.paymentStatus === filters.status);
//     }

//     // Filter by date range (day/week/month/year)
//     const now = new Date();
//     data = data.filter(sale => {
//       const saleDate = new Date(sale.created);
//       switch (filters.period) {
//         case 'day':
//           return saleDate.toDateString() === now.toDateString();
//         case 'week': {
//           const weekStart = new Date(now);
//           weekStart.setDate(now.getDate() - now.getDay());
//           const weekEnd = new Date(weekStart);
//           weekEnd.setDate(weekEnd.getDate() + 6);
//           return saleDate >= weekStart && saleDate <= weekEnd;
//         }
//         case 'month':
//           return (
//             saleDate.getMonth() === now.getMonth() &&
//             saleDate.getFullYear() === now.getFullYear()
//           );
//         case 'year':
//           return saleDate.getFullYear() === now.getFullYear();
//         default:
//           return true;
//       }
//     });

//     // Search filter
//     if (searchQuery.trim()) {
//       const query = searchQuery.toLowerCase();
//       data = data.filter(s =>
//         s.products.some(p => p.name.toLowerCase().includes(query)) ||
//         s.customer?.name?.toLowerCase().includes(query) ||
//         s.paymentStatus?.toLowerCase().includes(query)
//       );

//     }


//     setFiltered(data);
//   }, [filters, sales, searchQuery]);


//   const handleAddSale = async (data) => {
//   try {
//     if (editingSale) {
//       await axios.put(`http://localhost:5000/api/sales/${editingSale._id}`, data);
//     } else {
//       await axios.post('http://localhost:5000/api/sales', data);
//     }

//     //  Clear editing state before refresh
//     setEditingSale(null);

//     const res = await axios.get('http://localhost:5000/api/sales');
//     setSales(res.data);
//   } catch (err) {
//     console.error(' Failed to save sale:', err);
//   }

//   setShowModal(false);
// };



//   const handleExportCSV = () => {
//     const csv = [
//       ['Customer', 'Product', 'Qty', 'Rate', 'Amount', 'Tax', 'Status', 'Date'],
//     ];

//     filtered.forEach(sale => {
//       sale.products.forEach(p => {
//         csv.push([
//           sale.customer?.name || 'Unknown',
//           p.name,
//           p.quantity,
//           p.rate,
//           (p.quantity * p.rate).toFixed(2),
//           p.tax || 0,
//           sale.paymentStatus,
//           new Date(sale.created).toLocaleDateString()
//         ]);
//       });
//     });

//     const blob = new Blob([csv.map(r => r.join(',')).join('\n')], { type: 'text/csv' });
//     const link = document.createElement('a');
//     link.href = URL.createObjectURL(blob);
//     link.download = 'sales-report.csv';
//     link.click();
//   };

//   const handleExportPDF = () => {
//     const doc = new jsPDF('landscape');
//     doc.setFontSize(18);
//     doc.setTextColor('#333');
//     doc.text('Sales Report', 14, 15);

//     autoTable(doc, {
//       startY: 25,
//       head: [['Customer', 'Product', 'Qty', 'Rate', 'Amount', 'Tax', 'Status', 'Date']],
//       body: filtered.flatMap(sale =>
//         sale.products.map(p => [
//           sale.customer?.name || 'Unknown',
//           p.name,
//           p.quantity,
//           p.rate,
//           (p.quantity * p.rate).toFixed(2),
//           p.tax || 0,
//           sale.paymentStatus,
//           new Date(sale.created).toLocaleDateString()
//         ])
//       ),

//       styles: { fontSize: 10, cellPadding: 3 },
//       headStyles: {
//         fillColor: '#343a40',
//         textColor: '#fff',
//         halign: 'center'
//       },
//       alternateRowStyles: { fillColor: '#f9f9f9' },
//       columnStyles: {
//         0: { halign: 'left' },
//         1: { halign: 'left' },
//         4: { halign: 'right' }
//       },
//       margin: { top: 25, left: 10, right: 10 },
//       didDrawPage: () => {
//         doc.setFontSize(10);
//         doc.text(`Generated on ${new Date().toLocaleDateString()}`, 10, doc.internal.pageSize.height - 5);
//       }
//     });

//     doc.save('sales-report.pdf');
//   };

//   const handlePrint = () => {
//     const content = document.getElementById('transaction-table').innerHTML;
//     const win = window.open('', '', 'width=800,height=600');
//     win.document.write('<html><head><title>Print Sales</title></head><body>');
//     win.document.write(content);
//     win.document.write('</body></html>');
//     win.document.close();
//     win.print();
//   };



//   const handleGenerateBill = (billData) => {
//     setSelectedSale(billData);
//     setShowBillModal(true);
//   };

//   //stats calculation
//   const statsData = {
//     totalSales: 0,
//     outstanding: 0,
//     totalUnits: 0,
//     totalTax: 0,
//   };

//   filtered.forEach(sale => {
//     let saleTotal = 0;
//     let taxTotal = 0;
//     let unitCount = 0;

//     sale.products.forEach(p => {
//       const base = p.quantity * p.rate;
//       const tax = (base * (p.tax || 0)) / 100;
//       saleTotal += base + tax;
//       taxTotal += tax;
//       unitCount += p.quantity;
//     });

//     statsData.totalSales += saleTotal;
//     statsData.totalTax += taxTotal;
//     statsData.totalUnits += unitCount;

//     //  Only count outstanding if NOT Paid
//     if (sale.paymentStatus !== 'Paid') {
//       statsData.outstanding += saleTotal;
//     }
//   });


//   //for edit and delete operations
//   const [editingSale, setEditingSale] = useState(null);

//   // Trigger SaleFormModal with existing data
//   const handleEditSale = (sale) => {
//     setEditingSale(sale);
//     setShowModal(true);
//   };

//   // Delete Sale from DB
//   const handleDeleteSale = async (id) => {
//     if (!window.confirm('Are you sure you want to delete this sale?')) return;
//     try {
//       await axios.delete(`http://localhost:5000/api/sales/${id}`);
//       const res = await axios.get('http://localhost:5000/api/sales');
//       setSales(res.data);
//     } catch (err) {
//       console.error(' Failed to delete sale:', err);
//     }
//   };


//   return (
//     <div className="container-fluid">
//       <div className="d-flex justify-content-between align-items-center my-3">
//         <h4>Sales</h4>
//         <div>
//           <button className="btn btn-outline-secondary me-2" onClick={handlePrint}>Print</button>
//           <button className="btn btn-primary me-2" onClick={handleExportCSV}>Download CSV</button>
//           <button className="btn btn-warning me-2" onClick={handleExportPDF}>Download PDF</button>
//           <button className="btn btn-success" onClick={() => setShowModal(true)}>+ Add Sale</button>
//         </div>
//       </div>

//       {/* Filters */}
//       <div className="d-flex flex-wrap gap-3 mb-4 align-items-center">
//         <select className="form-select w-auto" value={filters.period} onChange={e => setFilters({ ...filters, period: e.target.value })}>
//           <option value="day">Day</option>
//           <option value="week">Week</option>
//           <option value="month">Month</option>
//           <option value="year">Year</option>
//         </select>

//         <select className="form-select w-auto" value={filters.status} onChange={e => setFilters({ ...filters, status: e.target.value })}>
//           <option value="">All Status</option>
//           <option value="Paid">Paid</option>
//           <option value="Unpaid">Unpaid</option>
//           <option value="Partial">Partial</option>
//         </select>
//         <input
//           type="text"
//           className="form-control "
//           style={{ width: '300px' }}
//           placeholder="Search by product, customer or status"
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//         />

//       </div>


//       <StatCards type="sale" statsData={statsData} />

//       <div id="transaction-table">
//         {/* <TransactionTable data={filtered} onGenerateBill={handleGenerateBill} /> */}
//         <TransactionTable
//           data={filtered}
//           onGenerateBill={handleGenerateBill}
//           onEditSale={handleEditSale}
//           onDeleteSale={handleDeleteSale}
//         />

//       </div>

//       <SaleFormModal
//         show={showModal}
//         handleClose={() => setShowModal(false)}
//         onSubmit={handleAddSale}
//         editingSale={editingSale}
//       />

//       <BillModal
//         show={showBillModal}
//         handleClose={() => setShowBillModal(false)}
//         sale={selectedSale}
//       />
//     </div>
//   );
// };

// export default SalePage;   
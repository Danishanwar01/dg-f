import React from 'react';

const StatCards = ({ type, statsData = {} }) => {
  const stats = type === 'sale'
    ? [
        { title: 'Total Sales Amount', value: `Rs. ${statsData.totalSales || 0}`,  },
        { title: 'Outstanding Payments', value: `Rs. ${statsData.outstanding || 0}`, },
        //  change: '-5.4%', color: 'danger'
        { title: 'Products Sold', value: `${statsData.totalUnits || 0} Units`,  },
        { title: 'Tax Collected', value: `Rs. ${statsData.totalTax || 0}`, },
      ]
    : [
        { title: 'Total Purchase Amount', value: `Rs. ${statsData.totalPurchase || 0}`,  },
        { title: 'Pending Payments', value: `Rs. ${statsData.pending || 0}`,  },
        { title: 'Products Bought', value: `${statsData.totalBoughtUnits || 0} Units`,  },
        { title: 'Tax Paid', value: `Rs. ${statsData.taxPaid || 0}`, },
      ];

  return (
   <div className="row mb-4 g-3">
  {stats.map((s, i) => (
    <div className="col-6 col-md-3 mb-3" key={i}>
      <div className="card shadow-sm p-3 h-100">
        <h6>{s.title}</h6>
        <div className="d-flex justify-content-between align-items-center">
          <h4 className="fw-bold mb-0">{s.value}</h4>
          <span className={`badge bg-${s.color}`}>{s.change}</span>
        </div>
      </div>
    </div>
  ))}
</div>
  );
};


export default StatCards;

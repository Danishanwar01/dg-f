import React from 'react';

const SummaryCards = ({ summary }) => {
  const cards = [
    { title: 'Total Sales', value: summary.totalSalesCount || 0, unit: 'orders', color: 'primary' },
    { title: 'Total Revenue', value: summary.totalRevenue || 0, unit: 'Rs.', color: 'success' },
    { title: 'Total Volume', value: summary.totalVolume || 0, unit: 'units', color: 'info' },
  ];

  return cards.map((c,i) => (
    <div className="col-md-4 mb-3" key={i}>
      <div className={`card text-white bg-${c.color} shadow-sm p-3`}>
        <h6>{c.title}</h6>
        <h4 className="fw-bold">
          {c.unit === 'Rs.' 
            ? `Rs. ${c.value.toFixed(2)}` 
            : `${c.value} ${c.unit}`}
        </h4>
      </div>
    </div>
  ));
};

export default SummaryCards;


import React from 'react';

const StatCards = ({ stats }) => {
  const cards = [
    { title: 'Total Sales', value: stats.totalSales, color: 'success' },
    { title: 'Total Purchases', value: stats.totalPurchases, color: 'primary' },
    { title: 'Outstanding',   value: stats.outstandingPayments, color: 'warning' },
    { title: 'Net Profit',    value: stats.netProfit, color: 'danger' },
  ];
  return (
    <div className="row mb-4">
      {cards.map((c,i)=>(
        <div className="col-md-3 mt-2" key={i}>
          <div className={`card text-white bg-${c.color} shadow-sm p-3`}>
            <h6>{c.title}</h6>
            <h4 className="fw-bold">Rs. {c.value?.toFixed(2)||'0.00'}</h4>
          </div>
        </div>
      ))}
    </div>
  );
};
export default StatCards;

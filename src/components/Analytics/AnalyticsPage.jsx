import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StatCards from './StatCards';
import SalesVsPurchaseChart from './Charts/SalesVsPurchaseChart';
import PaymentModePie from './Charts/PaymentModePie';
import ProfitTrendLine from './Charts/ProfitTrendLine';
import InsightsList from './InsightsList';

const AnalyticsPage = () => {
  const [sales, setSales] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [stats, setStats] = useState({});
  const [chartsData, setChartsData] = useState({});
  const [insights, setInsights] = useState([]);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  useEffect(() => {
    async function fetchData() {
const [sRes, pRes] = await Promise.all([
  axios.get(`https://dg-b.onrender.com/api/sale/${user.id}`),
  axios.get(`https://dg-b.onrender.com/api/purchase/${user.id}`)
]);

      const s = sRes.data, p = pRes.data;
      setSales(s);
      setPurchases(p);

      // 1. Totals & Outstanding
      const totalSales = s.reduce((sum, sale) => {
        const saleTotal = sale.products.reduce((acc,p) =>
          acc + p.quantity*p.rate*(1 + (p.tax||0)/100), 0);
        return sum + saleTotal;
      }, 0);
      const totalPurchases = p.reduce((sum, pur) => {
        const purTotal = pur.products.reduce((acc,pd) =>
          acc + pd.quantity*pd.rate*(1 + (pd.tax||0)/100), 0);
        return sum + purTotal;
      }, 0);
      const outstandingPayments = s
        .filter(sale => sale.paymentStatus !== 'Paid')
        .reduce((sum, sale) => {
          const saleTotal = sale.products.reduce((acc,p) =>
            acc + p.quantity*p.rate*(1 + (p.tax||0)/100), 0);
          return sum + saleTotal;
        }, 0);

      // 2. Compute monthly series for charts
      const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      const monthly = monthNames.map((m, i) => {
        const salesMonth = s.filter(sale => new Date(sale.created).getMonth()===i)
          .reduce((sum, sale) => sum + sale.products.reduce((a,p) =>
            a + p.quantity*p.rate*(1+(p.tax||0)/100),0),0);
        const purchaseMonth = p.filter(pur => new Date(pur.created).getMonth()===i)
          .reduce((sum, pur) => sum + pur.products.reduce((a,pd) =>
            a + pd.quantity*pd.rate*(1+(pd.tax||0)/100),0),0);
        return { month: m, sales: salesMonth, purchases: purchaseMonth };
      });

      // 3. Payment mode breakdown
      const modes = s.reduce((acc, sale) => {
        acc[sale.paymentMode] = (acc[sale.paymentMode]||0) + sale.products.reduce((a,p)=>
          a + p.quantity*p.rate*(1+(p.tax||0)/100),0);
        return acc;
      }, {});

      // 4. Profit trend = monthly.sales – monthly.purchases
      const profitTrend = monthly.map(m => ({
        month: m.month,
        profit: m.sales - m.purchases
      }));

      // 5. Top insights
      const productTotals = {};
      s.forEach(sale => sale.products.forEach(p =>
        productTotals[p.name] = (productTotals[p.name]||0) + p.quantity*p.rate
      ));
      const topSelling = Object.entries(productTotals)
        .sort((a,b)=>b[1]-a[1])[0];

      const customerTotals = {};
      s.forEach(sale => {
        const cust = sale.customer.name;
        const total = sale.products.reduce((a,p)=>
          a + p.quantity*p.rate*(1+(p.tax||0)/100),0);
        customerTotals[cust] = (customerTotals[cust]||0) + total;
      });
      const topCustomer = Object.entries(customerTotals)
        .sort((a,b)=>b[1]-a[1])[0];

      setStats({
        totalSales, totalPurchases, outstandingPayments,
        netProfit: totalSales - totalPurchases
      });
      setChartsData({ monthly, modes, profitTrend });
      setInsights([
        `Top Selling Product: ${topSelling[0]} (${topSelling[1].toFixed(2)})`,
        `Top Customer: ${topCustomer[0]} (${topCustomer[1].toFixed(2)})`,
        `Outstanding Payments: ${outstandingPayments.toFixed(2)}`,
      ]);
    }
    fetchData();
  }, []);

  return (
    <div className="container-fluid px-0">
      <h4 className="my-3">Business Analytics</h4>

      {/* 1. Top Cards */}
      <StatCards stats={stats} />

      {/* 2. Charts */}
      <div className="row g-3 mb-4">
  <div className="col-md-6">
    <SalesVsPurchaseChart data={chartsData.monthly} />
  </div>
  <div className="col-md-6">
    <PaymentModePie data={chartsData.modes} />
  </div>
</div>


      {/* 3. Profit Trend */}
      <div className="row mb-4">
        <div className="col-12">
          <ProfitTrendLine data={chartsData.profitTrend} />
        </div>
      </div>

      {/* 4. Insights */}
      <InsightsList items={insights} />
    </div>
  );
};

export default AnalyticsPage;

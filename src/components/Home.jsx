import React, { useState, useEffect } from 'react';
import axios from 'axios';

import SummaryCards from '../components/Dashboard/SummaryCards';
import SalesChart from '../components/Dashboard/SalesChart';
import TopProducts from '../components/Dashboard/TopProducts';
import OrdersTable from '../components/Dashboard/OrdersTable';
import TopCustomers from '../components/Dashboard/TopCustomers';
import PaymentStatusPie from '../components/Dashboard/PaymentStatusPie';

const Home = () => {
  const [summary, setSummary] = useState({});
  const [monthlyData, setMonthlyData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [topCustomers, setTopCustomers] = useState([]);
  const [paymentStatusData, setPaymentStatusData] = useState([]);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userId = user.id || user._id;

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const res = await axios.get(`https://dg-b-1.onrender.com/api/sale/${userId}`);
        const data = res.data;

        // 1. Summary: total orders, revenue, volume
        let totalRevenue = 0, totalVolume = 0;
        data.forEach(sale => {
          sale.products.forEach(p => {
            totalRevenue += p.quantity * p.rate * (1 + (p.tax || 0) / 100);
            totalVolume += p.quantity;
          });
        });
        setSummary({
          totalSalesCount: data.length,
          totalRevenue,
          totalVolume
        });

        // 2. Monthly sales for last 12 months
        const now = new Date();
        const months = Array.from({ length: 12 }, (_, i) => {
          const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
          return {
            month: d.toLocaleString('default', { month: 'short', year: 'numeric' }),
            value: 0
          };
        }).reverse();

        data.forEach(sale => {
          const key = new Date(sale.created)
            .toLocaleString('default', { month: 'short', year: 'numeric' });
          const monthObj = months.find(m => m.month === key);
          if (monthObj) {
            const saleTotal = sale.products.reduce((sum, p) =>
              sum + p.quantity * p.rate * (1 + (p.tax || 0) / 100), 0);
            monthObj.value += saleTotal;
          }
        });
        setMonthlyData(months);

        // 3. Top 5 products by quantity
        const prodTotals = {};
        data.forEach(sale =>
          sale.products.forEach(p => {
            prodTotals[p.name] = (prodTotals[p.name] || 0) + p.quantity;
          })
        );
        const topProdArr = Object.entries(prodTotals)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([name, qty]) => ({ name, qty }));
        setTopProducts(topProdArr);

        // 4. 5 most recent orders
        const recent = [...data]
          .sort((a, b) => new Date(b.created) - new Date(a.created))
          .slice(0, 5)
          .map(sale => ({
            customerName: sale.customer?.name || 'Unknown',
            item: sale.products[0]?.name || '-',
            date: new Date(sale.created).toLocaleDateString(),
            status: sale.paymentStatus
          }));
        setRecentOrders(recent);

        // 5. Top 5 customers by spend
        const custTotals = {};
        data.forEach(sale => {
          const name = sale.customer?.name || 'Unknown';
          const saleTotal = sale.products.reduce((sum, p) =>
            sum + p.quantity * p.rate * (1 + (p.tax || 0) / 100), 0);
          custTotals[name] = (custTotals[name] || 0) + saleTotal;
        });
        const topCustArr = Object.entries(custTotals)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([name, total]) => ({ name, total }));
        setTopCustomers(topCustArr);

        // 6. Payment status breakdown
        const statusCounts = data.reduce((acc, sale) => {
          acc[sale.paymentStatus] = (acc[sale.paymentStatus] || 0) + 1;
          return acc;
        }, {});
        const statusData = ['Paid', 'Partial', 'Unpaid'].map(status => ({
          name: status,
          value: statusCounts[status] || 0
        }));
        setPaymentStatusData(statusData);

      } catch (err) {
        console.error('Failed to fetch sales data:', err);
      }
    };

    fetchSales();
  }, [userId]);

  return (
   <div className="container-fluid px-0">
  {/* Summary Cards */}
<div className="row mt-3 mt-md-0">
  <SummaryCards summary={summary} />
</div>


  {/* Sales Chart & Top Products */}
  <div className="row mt-4">
    <div className="col-12 col-md-6 mb-4 mb-md-0">
      <SalesChart data={monthlyData} />
    </div>
    <div className="col-12 col-md-6">
      <TopProducts products={topProducts} />
    </div>
  </div>

  {/* Top Customers & Payment Status */}
  <div className="row mt-4">
    <div className="col-12 col-md-6 mb-4 mb-md-0">
      <TopCustomers customers={topCustomers} />
    </div>
    <div className="col-12 col-md-6">
      <PaymentStatusPie data={paymentStatusData} />
    </div>
  </div>

  {/* Recent Orders */}
  <div className="row mt-4">
    <div className="col-12">
      <OrdersTable orders={recentOrders} />
    </div>
  </div>
</div>

  );
};

export default Home;

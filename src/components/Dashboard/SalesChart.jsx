import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const SalesChart = ({ data=[] }) => (
  <div className="card p-3 shadow-sm">
    <h6>Total Sales (Last 12 months)</h6>
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data}>
        <XAxis dataKey="month"/>
        <YAxis/>
        <Tooltip formatter={val => `Rs. ${val.toFixed(2)}`} />
        <Bar dataKey="value" fill="#0d6efd" />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export default SalesChart;

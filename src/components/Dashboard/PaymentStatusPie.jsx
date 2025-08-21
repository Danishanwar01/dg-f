import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#198754','#ffc107','#dc3545']; // green, yellow, red

const PaymentStatusPie = ({ data=[] }) => (
  <div className="card p-3 shadow-sm">
    <h6>Payment Status</h6>
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie dataKey="value" data={data} cx="50%" cy="50%" outerRadius={60} label>
          {data.map((_, idx) => <Cell key={idx} fill={COLORS[idx]} />)}
        </Pie>
        <Legend verticalAlign="bottom" height={36}/>
      </PieChart>
    </ResponsiveContainer>
  </div>
);

export default PaymentStatusPie;

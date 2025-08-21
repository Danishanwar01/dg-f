import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from 'recharts';
const COLORS = ['#0d6efd','#198754','#ffc107','#dc3545'];

const PaymentModePie = ({ data={} }) => {
  const pieData = Object.entries(data).map(([mode,value])=>({ name:mode, value }));
  return (
    <div className="card p-3 shadow-sm">
      <h6>Payment Modes</h6>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie dataKey="value" data={pieData} outerRadius={80} label>
            {pieData.map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]} />)}
          </Pie>
          <Legend verticalAlign="bottom" height={36}/>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
export default PaymentModePie;

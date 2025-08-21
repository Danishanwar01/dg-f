import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const SalesVsPurchaseChart = ({ data=[] }) => (
  <div className="card p-3 shadow-sm">
    <h6>Sales vs Purchase (Monthly)</h6>
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data}>
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="sales" fill="#0d6efd" />
        <Bar dataKey="purchases" fill="#6c757d" />
      </BarChart>
    </ResponsiveContainer>
  </div>
);
export default SalesVsPurchaseChart;

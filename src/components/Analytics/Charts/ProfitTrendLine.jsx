import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const ProfitTrendLine = ({ data=[] }) => (
  <div className="card p-3 shadow-sm">
    <h6>Profit Trend</h6>
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={data}>
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="profit" stroke="#dc3545" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  </div>
);
export default ProfitTrendLine;

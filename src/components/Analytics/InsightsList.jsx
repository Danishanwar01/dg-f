const InsightsList = ({ items=[] }) => (
  <div className="card p-3 shadow-sm mb-4">
    <h6>Insights</h6>
    <ul className="mt-3">
      {items.map((text,i)=><li key={i}>{text}</li>)}
    </ul>
  </div>
);
export default InsightsList;

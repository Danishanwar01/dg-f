import React from 'react';

const TopProducts = ({ products=[] }) => (
  <div className="card p-3 shadow-sm"style={{ height:'310px'}}>
    <h6>Top Selling Products</h6>
    <ul className="list-group list-group-flush mt-3">
      {products.map((p,i) => (
        <li className="list-group-item d-flex justify-content-between" key={i}>
          {p.name}
          <span>{p.qty} units</span>
        </li>
      ))}
    </ul>
  </div>
);

export default TopProducts;

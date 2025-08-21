//digipocket/src/components/purchase/purchaseformmodal

import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import CustomerFormModal from '../Customer/CustomerFormmodal';


export default function PurchaseFormModal({ show, handleClose, onSubmit, editingPurchase, customerApi }) {
  const [suppliers, setSuppliers] = useState([]);
  const [formData, setFormData] = useState({
    customer: '',
    products: [{ name: '', quantity: 1, unit: 'pcs', rate: 0, discount: 0, tax: 0 }],
    paymentMode: 'Cash',
    paymentStatus: 'Paid',
    notes: '',
  });
  const [showCustomerModal, setShowCustomerModal] = useState(false);


  // Fetch suppliers only (Vendor or Both)
  useEffect(() => {
    axios.get(customerApi)
      .then(res => {
        const onlySuppliers = res.data.filter(c => c.type === 'Seller' || c.type === 'Both');
        setSuppliers(onlySuppliers);
      });
  }, [customerApi]);

  // Prefill form for editing or reset for new
  useEffect(() => {
    if (editingPurchase) {
      setFormData({
        customer: editingPurchase.customer?._id || editingPurchase.customer || '',
        products: editingPurchase.products || [{ name: '', quantity: 1, unit: 'pcs', rate: 0, discount: 0, tax: 0 }],
        paymentMode: editingPurchase.paymentMode || 'Cash',
        paymentStatus: editingPurchase.paymentStatus || 'Paid',
        notes: editingPurchase.notes || '',
      });
    } else {
      setFormData({
        customer: '',
        products: [{ name: '', quantity: 1, unit: 'pcs', rate: 0, discount: 0, tax: 0 }],
        paymentMode: 'Cash',
        paymentStatus: 'Paid',
        notes: '',
      });
    }
  }, [editingPurchase, show]);

  // Product change handlers
  const handleProductChange = (idx, e) => {
    const { name, value } = e.target;
    const updated = [...formData.products];
    updated[idx][name] = value;
    setFormData({ ...formData, products: updated });
  };
  const handleAddProduct = () => setFormData({
    ...formData,
    products: [...formData.products, { name: '', quantity: 1, unit: 'pcs', rate: 0, discount: 0, tax: 0 }]
  });
  const handleRemoveProduct = (i) => setFormData({
    ...formData,
    products: formData.products.filter((_, idx) => idx !== i)
  });

  // Totals calculation
  const calculateTotals = () => formData.products.reduce((tot, p) => {
    const subtotal = p.quantity * p.rate;
    const discountAmt = (subtotal * p.discount) / 100;
    const taxable = subtotal - discountAmt;
    const taxAmt = (taxable * p.tax) / 100;
    const total = taxable + taxAmt;
    return {
      subtotal: tot.subtotal + subtotal,
      discountAmount: tot.discountAmount + discountAmt,
      taxAmount: tot.taxAmount + taxAmt,
      total: tot.total + total,
    };
  }, { subtotal: 0, discountAmount: 0, taxAmount: 0, total: 0 });
  const { subtotal, discountAmount, taxAmount, total } = calculateTotals();

  // Change handler for main form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    handleClose();
  };


  const handleCustomerSave = async (customerData) => {
  try {
    await axios.post(customerApi, customerData);
    const res = await axios.get(customerApi);
    const onlySuppliers = res.data.filter(c => c.type === 'Seller' || c.type === 'Both');
    setSuppliers(onlySuppliers);
    setShowCustomerModal(false);
  } catch (err) {
    alert("Failed to save customer.");
  }
};


  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>{editingPurchase ? 'Edit' : 'Add'} Purchase Entry</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
<Form.Group className="mb-2">
  <Form.Label className="mb-1">Supplier</Form.Label>
  <div className="d-flex gap-2 align-items-center">
    <Form.Select
      name="customer"
      value={formData.customer}
      onChange={handleChange}
      required
      className="form-select-sm flex-grow-1"
    >
      <option value="">Select Supplier</option>
      {suppliers.map(supplier => (
        <option key={supplier._id} value={supplier._id}>{supplier.name}</option>
      ))}
    </Form.Select>
    <Button 
      variant="outline-primary"
      size="sm"
      onClick={() => setShowCustomerModal(true)}
    >
     +Add
    </Button>
  </div>
</Form.Group>



          {/* Products */}
          {formData.products.map((product, idx) => (
            <div key={idx} className="border p-3 mb-2 rounded bg-light">
              <Row className="mb-2">
                <Col>
                  <Form.Label>Product</Form.Label>
                  <Form.Control name="name" value={product.name} onChange={e => handleProductChange(idx, e)} required />
                </Col>
                <Col>
                  <Form.Label>Qty</Form.Label>
                  <Form.Control type="number" name="quantity" value={product.quantity} onChange={e => handleProductChange(idx, e)} required />
                </Col>
                <Col>
                  <Form.Label>Unit</Form.Label>
                  <Form.Select name="unit" value={product.unit} onChange={e => handleProductChange(idx, e)}>
                    <option value="pcs">Pcs</option>
                    <option value="kg">Kg</option>
                  </Form.Select>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Label>Rate</Form.Label>
                  <Form.Control type="number" name="rate" value={product.rate} onChange={e => handleProductChange(idx, e)} required />
                </Col>
                <Col>
                  <Form.Label>Discount%</Form.Label>
                  <Form.Control type="number" name="discount" value={product.discount} onChange={e => handleProductChange(idx, e)} />
                </Col>
                <Col>
                  <Form.Label>Tax%</Form.Label>
                  <Form.Control type="number" name="tax" value={product.tax} onChange={e => handleProductChange(idx, e)} />
                </Col>
                <Col xs="auto" className="d-flex align-items-end">
                  {formData.products.length > 1 &&
                    <Button variant="danger" onClick={() => handleRemoveProduct(idx)}>Remove</Button>}
                </Col>
              </Row>
            </div>
          ))}
          <div className="text-end mb-3">
            <Button variant="success" onClick={handleAddProduct}>+ Add Product</Button>
          </div>

          {/* Payment & Notes */}
          <Row className="mb-3">
            <Col>
              <Form.Label>Payment Mode</Form.Label>
              <Form.Select name="paymentMode" value={formData.paymentMode} onChange={handleChange}>
                <option>Cash</option><option>UPI</option><option>Bank Transfer</option><option>Credit</option>
              </Form.Select>
            </Col>
            <Col>
              <Form.Label>Payment Status</Form.Label>
              <Form.Select name="paymentStatus" value={formData.paymentStatus} onChange={handleChange}>
                <option>Paid</option><option>Unpaid</option><option>Partial</option>
              </Form.Select>
            </Col>
          </Row>
          <Form.Group className="mb-3">
            <Form.Label>Notes</Form.Label>
            <Form.Control as="textarea" rows={2} name="notes" value={formData.notes} onChange={handleChange} />
          </Form.Group>

          {/* Totals */}
          <h6 className="text-end">
            Subtotal: ₹{subtotal.toFixed(2)} | Discount: ₹{discountAmount.toFixed(2)} | Tax: ₹{taxAmount.toFixed(2)} | <strong>Total: ₹{total.toFixed(2)}</strong>
          </h6>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="primary">{editingPurchase ? 'Update' : 'Save'}</Button>
        </Modal.Footer>
      </Form>
      <CustomerFormModal
  show={showCustomerModal}
  onClose={() => setShowCustomerModal(false)}
  onSave={handleCustomerSave}
  editData={null}
/>

    </Modal>
  );
}





// import React, { useState, useEffect } from 'react';
// import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
// import axios from 'axios';

// const PurchaseFormModal = ({ show, handleClose, onSubmit, editingPurchase }) => {

//   const [sellers, setSellers] = useState([]);

//   const [formData, setFormData] = useState({
//     customer: '',
//     products: [
//       { name: '', quantity: 1, unit: 'pcs', rate: 0, discount: 0, tax: 0 }
//     ],
//     paymentMode: 'Cash',
//     paymentStatus: 'Paid',
//     notes: '',
//   });

//   useEffect(() => {
//     axios.get('https://dg-b.onrender.com/api/customers')
//       .then(res => {
//         const onlySellers = res.data.filter(c => c.type === 'Seller' || c.type === 'Both');
//         setSellers(onlySellers);
//       });
//   }, []);

//   useEffect(() => {
//   if (editingPurchase) {
//     setFormData({
//       customer: editingPurchase.customer?._id || editingPurchase.customer || '',
//       products: editingPurchase.products || [{ name: '', quantity: 1, unit: 'pcs', rate: 0, discount: 0, tax: 0 }],
//       paymentMode: editingPurchase.paymentMode || 'Cash',
//       paymentStatus: editingPurchase.paymentStatus || 'Paid',
//       notes: editingPurchase.notes || '',
//     });
//   } else {
//     setFormData({
//       customer: '',
//       products: [
//         { name: '', quantity: 1, unit: 'pcs', rate: 0, discount: 0, tax: 0 }
//       ],
//       paymentMode: 'Cash',
//       paymentStatus: 'Paid',
//       notes: '',
//     });
//   }
// }, [editingPurchase, show]);


//   const handleProductChange = (index, e) => {
//     const { name, value } = e.target;
//     const updatedProducts = [...formData.products];
//     updatedProducts[index][name] = value;
//     setFormData({ ...formData, products: updatedProducts });
//   };

//   const handleAddProduct = () => {
//     setFormData({
//       ...formData,
//       products: [...formData.products, { name: '', quantity: 1, unit: 'pcs', rate: 0, discount: 0, tax: 0 }]
//     });
//   };

//   const handleRemoveProduct = (index) => {
//     const updatedProducts = formData.products.filter((_, i) => i !== index);
//     setFormData({ ...formData, products: updatedProducts });
//   };

//   const calculateTotals = () => {
//     return formData.products.reduce(
//       (totals, p) => {
//         const subtotal = p.quantity * p.rate;
//         const discountAmt = (subtotal * p.discount) / 100;
//         const taxable = subtotal - discountAmt;
//         const taxAmt = (taxable * p.tax) / 100;
//         const total = taxable + taxAmt;
//         return {
//           subtotal: totals.subtotal + subtotal,
//           discountAmount: totals.discountAmount + discountAmt,
//           taxAmount: totals.taxAmount + taxAmt,
//           total: totals.total + total,
//         };
//       },
//       { subtotal: 0, discountAmount: 0, taxAmount: 0, total: 0 }
//     );
//   };

//   const { subtotal, discountAmount, taxAmount, total } = calculateTotals();

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onSubmit(formData);
//     handleClose();
//   };





  
//   return (
//     <Modal show={show} onHide={handleClose} size="lg">
//       <Modal.Header closeButton>
//         <Modal.Title>Add Purchase Entry</Modal.Title>
//       </Modal.Header>
//       <Modal.Body>
//         <Form onSubmit={handleSubmit}>
//           <Row className="mb-3">
//             <Col>
//               <Form.Label>Customer</Form.Label>
//               <Form.Select name="customer" value={formData.customer} onChange={handleChange} required>
//                 <option value="">Select Seller</option>
//                 {sellers.map(seller => (
//                   <option key={seller._id} value={seller._id}>{seller.name}</option>
//                 ))}
//               </Form.Select>
//             </Col>
//           </Row>

//           {formData.products.map((product, index) => (
//             <div key={index} className="border p-3 mb-3 rounded bg-light">
//               <Row className="mb-2">
//                 <Col>
//                   <Form.Label>Product</Form.Label>
//                   <Form.Control
//                     name="name"
//                     value={product.name}
//                     onChange={(e) => handleProductChange(index, e)}
//                     required
//                   />
//                 </Col>
//                 <Col>
//                   <Form.Label>Quantity</Form.Label>
//                   <Form.Control
//                     type="number"
//                     name="quantity"
//                     value={product.quantity}
//                     onChange={(e) => handleProductChange(index, e)}
//                   />
//                 </Col>
//                 <Col>
//                   <Form.Label>Unit</Form.Label>
//                   <Form.Select
//                     name="unit"
//                     value={product.unit}
//                     onChange={(e) => handleProductChange(index, e)}
//                   >
//                     <option value="pcs">Pcs</option>
//                     <option value="kg">Kg</option>
//                   </Form.Select>
//                 </Col>
//               </Row>

//               <Row className="mb-2">
//                 <Col>
//                   <Form.Label>Rate</Form.Label>
//                   <Form.Control
//                     type="number"
//                     name="rate"
//                     value={product.rate}
//                     onChange={(e) => handleProductChange(index, e)}
//                   />
//                 </Col>
//                 <Col>
//                   <Form.Label>Discount (%)</Form.Label>
//                   <Form.Control
//                     type="number"
//                     name="discount"
//                     value={product.discount}
//                     onChange={(e) => handleProductChange(index, e)}
//                   />
//                 </Col>
//                 <Col>
//                   <Form.Label>Tax (%)</Form.Label>
//                   <Form.Control
//                     type="number"
//                     name="tax"
//                     value={product.tax}
//                     onChange={(e) => handleProductChange(index, e)}
//                   />
//                 </Col>
//                 <Col xs="auto" className="d-flex align-items-end">
//                   {formData.products.length > 1 && (
//                     <Button variant="danger" onClick={() => handleRemoveProduct(index)}>Remove</Button>
//                   )}
//                 </Col>
//               </Row>
//             </div>
//           ))}

//           <div className="text-end mb-3">
//             <Button variant="success" onClick={handleAddProduct}>+ Add Product</Button>
//           </div>

//           <Row className="mb-3">
//             <Col>
//               <Form.Label>Payment Mode</Form.Label>
//               <Form.Select name="paymentMode" value={formData.paymentMode} onChange={handleChange}>
//                 <option>Cash</option>
//                 <option>UPI</option>
//                 <option>Bank Transfer</option>
//                 <option>Credit</option>
//               </Form.Select>
//             </Col>
//             <Col>
//               <Form.Label>Payment Status</Form.Label>
//               <Form.Select name="paymentStatus" value={formData.paymentStatus} onChange={handleChange}>
//                 <option>Paid</option>
//                 <option>Unpaid</option>
//                 <option>Partial</option>
//               </Form.Select>
//             </Col>
//           </Row>

//           <Form.Group className="mb-3">
//             <Form.Label>Notes</Form.Label>
//             <Form.Control as="textarea" rows={2} name="notes" value={formData.notes} onChange={handleChange} />
//           </Form.Group>

//           <h6 className="text-end">
//             Subtotal: ₹{subtotal.toFixed(2)} | Discount: ₹{discountAmount.toFixed(2)} | Tax: ₹{taxAmount.toFixed(2)} | <strong>Total: ₹{total.toFixed(2)}</strong>
//           </h6>

//           <div className="text-end">
//             <Button variant="secondary" onClick={handleClose} className="me-2">Cancel</Button>
//             <Button type="submit" variant="primary">Save</Button>
//           </div>
//         </Form>
//       </Modal.Body>
//     </Modal>
//   );
// };

// export default PurchaseFormModal;

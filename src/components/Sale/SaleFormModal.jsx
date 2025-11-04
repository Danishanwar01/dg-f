

import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import CustomerFormModal from '../Customer/CustomerFormmodal';

export default function SaleFormModal({ show, handleClose, onSubmit, editingSale, customerApi }) {
  const [buyers, setBuyers] = useState([]);
  const [formData, setFormData] = useState({
    customer: '',
    products: [{ name: '', quantity: 1, unit: 'pcs', rate: 0, discount: 0, tax: 0 }],
    paymentMode: 'Cash',
    paymentStatus: 'Paid',
    notes: '',
  });
    const [showCustomerModal, setShowCustomerModal] = useState(false);

  useEffect(() => {
    axios.get(customerApi)
      .then(res => {
        const onlyBuyers = res.data.filter(c => c.type === 'Buyer' || c.type === 'Both');
        setBuyers(onlyBuyers);
      });
  }, [customerApi]);

  useEffect(() => {
    if (editingSale) {
      setFormData({
        customer: editingSale.customer?._id || editingSale.customer || '',
        products: editingSale.products || [{ name: '', quantity: 1, unit: 'pcs', rate: 0, discount: 0, tax: 0 }],
        paymentMode: editingSale.paymentMode || 'Cash',
        paymentStatus: editingSale.paymentStatus || 'Paid',
        notes: editingSale.notes || '',
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
  }, [editingSale, show]);

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

  // Change handler
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
    //  Save the new customer
    const res = await axios.post(customerApi, customerData);
    const newCustomer = res.data; // assuming API returns the created customer object

    // Fetch the latest buyers list
    const response = await axios.get(customerApi);
    const onlyBuyers = response.data.filter(c => c.type === 'Buyer' || c.type === 'Both');
    setBuyers(onlyBuyers);

    //  Auto-select the newly added buyer
    setFormData(prev => ({ ...prev, customer: newCustomer._id }));

    // Close the modal
    setShowCustomerModal(false);
  } catch (err) {
    console.error(err);
    alert("Failed to save customer.");
  }
};



  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>{editingSale ? 'Edit' : 'Add'} Sale Entry</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
         <Form.Group className="mb-2">
           <Form.Label className="mb-1">buyer</Form.Label>
           <div className="d-flex gap-2 align-items-center">
             <Form.Select
               name="customer"
               value={formData.customer}
               onChange={handleChange}
               required
               className="form-select-sm flex-grow-1"
             >
               <option value="">Select Buyer</option>
               {buyers.map(buyer => (
                 <option key={buyer._id} value={buyer._id}>{buyer.name}</option>
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
          {formData.products.map((product, idx) => (
            <div key={idx} className="border p-3 mb-2 rounded bg-light">
              <Row className="mb-2">
                <Col><Form.Label>Product</Form.Label>
                  <Form.Control name="name" value={product.name} onChange={e => handleProductChange(idx, e)} required /></Col>
                <Col><Form.Label>Qty</Form.Label>
                  <Form.Control type="number" name="quantity" value={product.quantity} onChange={e => handleProductChange(idx, e)} required /></Col>
                <Col><Form.Label>Unit</Form.Label>
                  <Form.Select name="unit" value={product.unit} onChange={e => handleProductChange(idx, e)}>
                    <option value="pcs">Pcs</option>
                    <option value="kg">Kg</option>
                  </Form.Select></Col>
              </Row>
              <Row>
                <Col><Form.Label>Rate</Form.Label>
                  <Form.Control type="number" name="rate" value={product.rate} onChange={e => handleProductChange(idx, e)} required /></Col>
                <Col><Form.Label>Discount%</Form.Label>
                  <Form.Control type="number" name="discount" value={product.discount} onChange={e => handleProductChange(idx, e)} /></Col>
                <Col><Form.Label>Tax%</Form.Label>
                  <Form.Control type="number" name="tax" value={product.tax} onChange={e => handleProductChange(idx, e)} /></Col>
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
          <Row className="mb-3">
            <Col><Form.Label>Payment Mode</Form.Label>
              <Form.Select name="paymentMode" value={formData.paymentMode} onChange={handleChange}>
                <option>Cash</option><option>UPI</option><option>Bank Transfer</option><option>Credit</option>
              </Form.Select></Col>
            <Col><Form.Label>Payment Status</Form.Label>
              <Form.Select name="paymentStatus" value={formData.paymentStatus} onChange={handleChange}>
                <option>Paid</option><option>Unpaid</option><option>Partial</option>
              </Form.Select></Col>
          </Row>
          <Form.Group className="mb-3">
            <Form.Label>Notes</Form.Label>
            <Form.Control as="textarea" rows={2} name="notes" value={formData.notes} onChange={handleChange} />
          </Form.Group>
          <h6 className="text-end">
            Subtotal: ₹{subtotal.toFixed(2)} | Discount: ₹{discountAmount.toFixed(2)} | Tax: ₹{taxAmount.toFixed(2)} | <strong>Total: ₹{total.toFixed(2)}</strong>
          </h6>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="primary">{editingSale ? 'Update' : 'Save'}</Button>
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



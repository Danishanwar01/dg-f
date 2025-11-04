//digipocket/src/components/customer/customerformmodal

import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';

export default function CustomerFormModal({ show, onClose, onSave, editData }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    status: 'Active',
    type: 'Buyer'
  });

  useEffect(() => {
    if (editData) {
      setFormData({
        name: editData.name,
        email: editData.contact_info?.email,
        phone: editData.contact_info?.phone,
        status: editData.status,
        type: editData.type
      });
    } else {
      setFormData({ name: '', email: '', phone: '', status: 'Active', type: 'Buyer' });
    }
  }, [editData, show]);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(f => ({ ...f, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSave({
      name: formData.name,
      contact_info: { email: formData.email, phone: formData.phone },
      status: formData.status,
      type: formData.type
    });
    onClose();
  }

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>{editData ? 'Edit Customer' : 'Add Customer'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Customer Name</Form.Label>
            <Form.Control name="name" value={formData.name} onChange={handleChange} required />
          </Form.Group>
          <Row className="mb-3">
            <Col>
              <Form.Label>Email</Form.Label>
              <Form.Control name="email" value={formData.email} onChange={handleChange}  type="email"/>
            </Col>
            <Col>
              <Form.Label>Phone</Form.Label>
              <Form.Control name="phone" value={formData.phone} onChange={handleChange} required />
            </Col>
          </Row>
          <Form.Group className="mb-3">
            <Form.Label>Status</Form.Label>
            <Form.Select name="status" value={formData.status} onChange={handleChange}>
              <option value="Active">Active</option>
              <option value="Blocked">Blocked</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Customer Type</Form.Label>
            <Form.Select name="type" value={formData.type} onChange={handleChange}>
              <option value="Buyer">Buyer</option>
              <option value="Seller">Seller</option>
              <option value="Both">Both</option>
            </Form.Select>
          </Form.Group>
          <div className="text-end">
            <Button variant="secondary" onClick={onClose} className="me-2">Cancel</Button>
            <Button type="submit" variant="primary">{editData ? 'Update' : 'Add'}</Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

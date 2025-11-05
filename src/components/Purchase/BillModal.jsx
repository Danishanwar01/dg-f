import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col, Image } from 'react-bootstrap';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const BillModal = ({ show, handleClose, purchase }) => {
  const [gstNumber, setGstNumber] = useState('');
  const [logo, setLogo] = useState(null);
  const [signature, setSignature] = useState(null);
  const [stamp, setStamp] = useState(null);
  const [companyName, setCompanyName] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [companyEmail, setCompanyEmail] = useState('');

  const handleFileInput = (e, setter) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setter(reader.result);
      reader.readAsDataURL(file);
    }
  };

  if (!show || !purchase) return null;

  const generatePDF = () => {
    const doc = new jsPDF();

    // ===== Company Header =====
    if (logo) doc.addImage(logo, 'PNG', 10, 10, 40, 20);
    doc.setFontSize(14);
    doc.text(companyName || 'Company Name', 60, 15);
    doc.setFontSize(10);
    doc.text(`Address: ${companyAddress || '-'}`, 60, 22);
    doc.text(`Email: ${companyEmail || '-'}`, 60, 27);

    // ===== Bill Header =====
    doc.setFontSize(12);
    doc.text(`GSTIN: ${gstNumber || 'N/A'}`, 10, 40);
    doc.text(`Date: ${new Date(purchase.created).toLocaleDateString()}`, 150, 40);
    doc.text(`Customer: ${purchase.customer?.name || 'N/A'}`, 10, 47);
    doc.text(`Payment Status: ${purchase.paymentStatus}`, 10, 54);
  

    // ===== Table =====
    const rows = purchase.products.map((p) => {
      const amount = p.quantity * p.rate;
      const taxAmount = (amount * (p.tax || 0)) / 100;
      return [
        p.name,
        `${p.quantity} ${p.unit || ''}`,
        `INR-${p.rate}`,
        `${p.tax || 0}%`,
        `INR-${(amount + taxAmount).toFixed(2)}`
      ];
    });

    autoTable(doc, {
      startY: 70,
      head: [['Product', 'Qty', 'Rate', 'Tax (%)', 'Amount']],
      body: rows,
      styles: { fontSize: 10, cellPadding: 3 },
    });

    const finalY = doc.lastAutoTable.finalY + 10;

    // ===== Totals =====
    const subtotal = purchase.products.reduce((acc, p) => acc + (p.quantity * p.rate), 0);
    const totalTax = purchase.products.reduce((acc, p) => {
      const amt = p.quantity * p.rate;
      return acc + ((amt * (p.tax || 0)) / 100);
    }, 0);
    const grandTotal = subtotal + totalTax;

    doc.setFontSize(11);
    doc.text(`Subtotal: INR-${subtotal.toFixed(2)}`, 140, finalY);
    doc.text(`Tax: INR-${totalTax.toFixed(2)}`, 140, finalY + 6);
    doc.text(`Grand Total: INR-${grandTotal.toFixed(2)}`, 140, finalY + 12);

    // ===== Footer (Stamp + Signature) =====
    if (stamp) doc.addImage(stamp, 'PNG', 105, finalY + 20, 30, 20);
    if (signature) doc.addImage(signature, 'PNG', 150, finalY + 20, 40, 20);
    doc.setFontSize(10);
    doc.text('Authorized Signature', 150, finalY + 45);

    doc.save(`Invoice_${purchase.customer?.name || 'Customer'}.pdf`);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>🧾 Bill Preview & Branding</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h6 className="text-primary mb-3 fw-bold">Company Details</h6>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Company Name</Form.Label>
              <Form.Control type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" value={companyEmail} onChange={(e) => setCompanyEmail(e.target.value)} />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3">
          <Form.Label>Address</Form.Label>
          <Form.Control type="text" value={companyAddress} onChange={(e) => setCompanyAddress(e.target.value)} />
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label>GST Number</Form.Label>
          <Form.Control type="text" value={gstNumber} onChange={(e) => setGstNumber(e.target.value)} />
        </Form.Group>

        <h6 className="text-success mb-3 fw-bold">Brand Assets</h6>
        <Row>
          <Col md={4}>
            <Form.Group className="mb-3 text-center">
              <Form.Label>Company Logo</Form.Label>
              <Form.Control type="file" accept="image/*" onChange={(e) => handleFileInput(e, setLogo)} />
              {logo && <Image src={logo} thumbnail className="mt-2" height="70" />}
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3 text-center">
              <Form.Label>Digital Signature</Form.Label>
              <Form.Control type="file" accept="image/*" onChange={(e) => handleFileInput(e, setSignature)} />
              {signature && <Image src={signature} thumbnail className="mt-2" height="70" />}
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3 text-center">
              <Form.Label>Company Stamp</Form.Label>
              <Form.Control type="file" accept="image/*" onChange={(e) => handleFileInput(e, setStamp)} />
              {stamp && <Image src={stamp} thumbnail className="mt-2" height="70" />}
            </Form.Group>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="success" onClick={generatePDF}>
          Download Bill PDF
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default BillModal;

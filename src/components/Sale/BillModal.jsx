import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form, Row, Col, Image } from 'react-bootstrap';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const API_URL = 'https://dg-b.onrender.com/api/company-profile'; 

const BillModal = ({ show, handleClose, sale, authToken }) => {
  const [company, setCompany] = useState({
    companyName: '',
    companyEmail: '',
    companyAddress: '',
    gstNumber: '',
    logoUrl: '',
    signatureUrl: '',
    stampUrl: '',
  });
  const [logoFile, setLogoFile] = useState(null);
  const [signatureFile, setSignatureFile] = useState(null);
  const [stampFile, setStampFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch company profile from backend on open
  useEffect(() => {
    if (show) {
      setLoading(true);
      axios
        .get(API_URL, { headers: { Authorization: `Bearer ${authToken}` } })
        .then((res) => {
          if (res.data) setCompany(res.data);
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [show, authToken]);

  // Handle asset input
  const handleFileInput = (e, setter) => {
    setter(e.target.files[0]);
  };

  // Form change
  const handleChange = (key, value) => {
    setCompany((prev) => ({ ...prev, [key]: value }));
  };

  // Submit to backend (save/update)
  const handleSave = async () => {
    const formData = new FormData();
    formData.append('companyName', company.companyName);
    formData.append('companyEmail', company.companyEmail);
    formData.append('companyAddress', company.companyAddress);
    formData.append('gstNumber', company.gstNumber);
    if (logoFile) formData.append('logo', logoFile);
    if (signatureFile) formData.append('signature', signatureFile);
    if (stampFile) formData.append('stamp', stampFile);

    await axios.post(API_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${authToken}`,
      }
    })
    .then((res) => {
      setCompany(res.data);
      setLogoFile(null); setSignatureFile(null); setStampFile(null);
    })
    .catch((err) => alert('Failed to save !'));
  };

  // Utility: fetch image as DataURL for PDF
  const getImageDataURL = async (url) => {
    if (!url) return null;
    return fetch(url)
      .then((res) => res.blob())
      .then(
        (blob) =>
          new Promise((resolve) => {
            const reader = new window.FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blob);
          })
      );
  };

  // PDF Generator (with online images)
  const generatePDF = async () => {
    const doc = new jsPDF();
    // Header: Logo
    let logoData = logoFile ? await toBase64(logoFile) : (company.logoUrl ? await getImageDataURL(company.logoUrl) : null);
    if (logoData) doc.addImage(logoData, 'PNG', 10, 10, 40, 20);
    doc.setFontSize(14);
    doc.text(company.companyName || 'Company Name', 60, 15);
    doc.setFontSize(10);
    doc.text(`Address: ${company.companyAddress || '-'}`, 60, 22);
    doc.text(`Email: ${company.companyEmail || '-'}`, 60, 27);

    // Sale Details
    doc.setFontSize(12);
    doc.text(`GSTIN: ${company.gstNumber || 'N/A'}`, 10, 40);
    doc.text(`Date: ${sale ? new Date(sale.created).toLocaleDateString() : ''}`, 150, 40);
    doc.text(`Customer: ${sale?.customer?.name || 'N/A'}`, 10, 47);
    doc.text(`Payment Status: ${sale?.paymentStatus || 'N/A'}`, 10, 54);

    // Table: Products
    const rows = sale?.products?.map((p) => {
      const amount = p.quantity * p.rate;
      const taxAmount = (amount * (p.tax || 0)) / 100;
      return [
        p.name,
        `${p.quantity} ${p.unit || ''}`,
        `INR-${p.rate}`,
        `${p.tax || 0}%`,
        `INR-${(amount + taxAmount).toFixed(2)}`
      ];
    }) || [];

    autoTable(doc, {
      startY: 70,
      head: [['Product', 'Qty', 'Rate', 'Tax (%)', 'Amount']],
      body: rows,
      styles: { fontSize: 10, cellPadding: 3 },
    });

    const finalY = doc.lastAutoTable.finalY + 10;

    // Totals
    const subtotal = sale.products.reduce((acc, p) => acc + (p.quantity * p.rate), 0);
    const totalTax = sale.products.reduce((acc, p) => {
      const amt = p.quantity * p.rate;
      return acc + ((amt * (p.tax || 0)) / 100);
    }, 0);
    const grandTotal = subtotal + totalTax;

    doc.setFontSize(11);
    doc.text(`Subtotal: INR-${subtotal.toFixed(2)}`, 140, finalY);
    doc.text(`Tax: INR-${totalTax.toFixed(2)}`, 140, finalY + 6);
    doc.text(`Grand Total: INR-${grandTotal.toFixed(2)}`, 140, finalY + 12);

    // Footer: Stamp, Signature
    let stampData = stampFile ? await toBase64(stampFile) : (company.stampUrl ? await getImageDataURL(company.stampUrl) : null);
    if (stampData) doc.addImage(stampData, 'PNG', 105, finalY + 20, 30, 20);

    let signatureData = signatureFile ? await toBase64(signatureFile) : (company.signatureUrl ? await getImageDataURL(company.signatureUrl) : null);
    if (signatureData) doc.addImage(signatureData, 'PNG', 150, finalY + 20, 40, 20);

    doc.setFontSize(10);
    doc.text('Authorized Signature', 150, finalY + 45);

    doc.save(`Invoice_${sale?.customer?.name || 'Customer'}.pdf`);
    handleClose();
  };

  // File to base64 for PDF
  async function toBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new window.FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });
  }

  if (!show || !sale) return null;

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>🧾 Bill Preview & Branding</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <div className="text-center py-3">Loading...</div>
        ) : (
          <>
            <h6 className="text-primary mb-3 fw-bold">Company Details</h6>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Company Name</Form.Label>
                  <Form.Control type="text" value={company.companyName || ''} onChange={(e) => handleChange("companyName", e.target.value)} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" value={company.companyEmail || ''} onChange={(e) => handleChange("companyEmail", e.target.value)} />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control type="text" value={company.companyAddress || ''} onChange={(e) => handleChange("companyAddress", e.target.value)} />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>GST Number</Form.Label>
              <Form.Control type="text" value={company.gstNumber || ''} onChange={(e) => handleChange("gstNumber", e.target.value)} />
            </Form.Group>

            <h6 className="text-success mb-3 fw-bold">Brand Assets</h6>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3 text-center">
                  <Form.Label>Company Logo</Form.Label>
                  <Form.Control type="file" accept="image/*" onChange={(e) => handleFileInput(e, setLogoFile)} />
                  {logoFile 
                    ? <Image src={URL.createObjectURL(logoFile)} thumbnail className="mt-2" height="70" />
                    : company.logoUrl && <Image src={company.logoUrl} thumbnail className="mt-2" height="70" />}
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3 text-center">
                  <Form.Label>Digital Signature</Form.Label>
                  <Form.Control type="file" accept="image/*" onChange={(e) => handleFileInput(e, setSignatureFile)} />
                  {signatureFile
                    ? <Image src={URL.createObjectURL(signatureFile)} thumbnail className="mt-2" height="70" />
                    : company.signatureUrl && <Image src={company.signatureUrl} thumbnail className="mt-2" height="70" />}
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3 text-center">
                  <Form.Label>Company Stamp</Form.Label>
                  <Form.Control type="file" accept="image/*" onChange={(e) => handleFileInput(e, setStampFile)} />
                  {stampFile
                    ? <Image src={URL.createObjectURL(stampFile)} thumbnail className="mt-2" height="70" />
                    : company.stampUrl && <Image src={company.stampUrl} thumbnail className="mt-2" height="70" />}
                </Form.Group>
              </Col>
            </Row>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="success" onClick={handleSave}>
          Save To Backend
        </Button>
        <Button variant="primary" onClick={generatePDF}>
          Generate Bill PDF
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default BillModal;

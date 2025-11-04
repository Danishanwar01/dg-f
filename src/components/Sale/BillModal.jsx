import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import axios from "axios";

const BillModal = ({ show, handleClose, sale, user }) => {
  const [loading, setLoading] = useState(false);
  const [company, setCompany] = useState({
    companyName: "",
    companyAddress: "",
    companyEmail: "",
    gstNumber: "",
    logoUrl: "",
    signatureUrl: "",
    stampUrl: "",
  });

  // ✅ Fetch company data from backend
  useEffect(() => {
    if (!show || !user?._id) return;
    const fetchCompany = async () => {
      try {
        setLoading(true);
        const res = await axios.get("https://dg-b.onrender.com/api/company-profile", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (res.data) setCompany(res.data);
      } catch (err) {
        console.error("Company fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCompany();
  }, [show, user]);

  // ✅ Handle file input (store preview + upload)
  const handleFileInput = (e, key) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () =>
        setCompany((prev) => ({ ...prev, [key]: reader.result }));
      reader.readAsDataURL(file);
      // Also update backend later when saving company profile
    }
  };

  // ✅ Save company profile to backend (including images)
  const handleSaveCompany = async () => {
    try {
      const formData = new FormData();
      formData.append("companyName", company.companyName);
      formData.append("companyAddress", company.companyAddress);
      formData.append("companyEmail", company.companyEmail);
      formData.append("gstNumber", company.gstNumber);

      if (company.logoUrl instanceof File)
        formData.append("logoUrl", company.logoUrl);
      if (company.signatureUrl instanceof File)
        formData.append("signatureUrl", company.signatureUrl);
      if (company.stampUrl instanceof File)
        formData.append("stampUrl", company.stampUrl);

      const res = await axios.post("https://dg-b.onrender.com/api/company-profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setCompany(res.data);
      alert("✅ Company profile updated successfully!");
    } catch (err) {
      console.error("Profile save error:", err);
      alert("❌ Error updating company profile");
    }
  };

  if (!show || !sale) return null;
  if (loading) {
    return (
      <Modal show={show} centered>
        <Modal.Body className="text-center p-5">
          <Spinner animation="border" />
          <p className="mt-3">Loading company profile...</p>
        </Modal.Body>
      </Modal>
    );
  }

  // ✅ Generate Bill PDF
  const generatePDF = () => {
    const doc = new jsPDF();

    // ----- Company Header -----
    if (company.logoUrl)
      doc.addImage(company.logoUrl, "PNG", 10, 10, 40, 20);
    doc.setFontSize(14);
    doc.text(company.companyName || "Company Name", 60, 15);
    doc.setFontSize(10);
    doc.text(`Address: ${company.companyAddress || "-"}`, 60, 22);
    doc.text(`Email: ${company.companyEmail || "-"}`, 60, 27);
    doc.text(`GSTIN: ${company.gstNumber || "-"}`, 60, 32);

    // ----- Sale Header -----
    doc.setFontSize(12);
    doc.text(`Customer: ${sale.customer?.name || "N/A"}`, 10, 45);
    doc.text(`Payment: ${sale.paymentStatus}`, 10, 52);
    doc.text(
      `Date: ${new Date(sale.createdAt).toLocaleDateString()}`,
      150,
      45
    );

    // ----- Product Table -----
    const rows = sale.products.map((p) => {
      const amount = p.quantity * p.rate;
      const taxAmount = (amount * (p.tax || 0)) / 100;
      return [
        p.name,
        `${p.quantity} ${p.unit || ""}`,
        `₹${p.rate}`,
        `${p.tax || 0}%`,
        `₹${(amount + taxAmount).toFixed(2)}`,
      ];
    });

    autoTable(doc, {
      startY: 65,
      head: [["Product", "Qty", "Rate", "Tax (%)", "Amount"]],
      body: rows,
      styles: { fontSize: 10, cellPadding: 3 },
    });

    const finalY = doc.lastAutoTable.finalY + 10;

    // ----- Totals -----
    const subtotal = sale.products.reduce(
      (acc, p) => acc + p.quantity * p.rate,
      0
    );
    const totalTax = sale.products.reduce((acc, p) => {
      const amt = p.quantity * p.rate;
      return acc + (amt * (p.tax || 0)) / 100;
    }, 0);
    const grandTotal = subtotal + totalTax;

    doc.setFontSize(11);
    doc.text(`Subtotal: ₹${subtotal.toFixed(2)}`, 140, finalY);
    doc.text(`Tax: ₹${totalTax.toFixed(2)}`, 140, finalY + 6);
    doc.text(`Grand Total: ₹${grandTotal.toFixed(2)}`, 140, finalY + 12);

    // ----- Footer -----
    if (company.stampUrl)
      doc.addImage(company.stampUrl, "PNG", 105, finalY + 25, 30, 20);
    if (company.signatureUrl)
      doc.addImage(company.signatureUrl, "PNG", 150, finalY + 25, 40, 20);
    doc.setFontSize(10);
    doc.text("Authorized Signature", 150, finalY + 50);

    doc.save(`Bill_${sale.customer?.name || "Customer"}.pdf`);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Bill Preview & Branding</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {/* Company Info */}
        <Form.Group className="mb-2">
          <Form.Label>Company Name</Form.Label>
          <Form.Control
            type="text"
            value={company.companyName}
            onChange={(e) =>
              setCompany({ ...company, companyName: e.target.value })
            }
          />
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label> Address</Form.Label>
          <Form.Control
            type="text"
            value={company.companyAddress}
            onChange={(e) =>
              setCompany({ ...company, companyAddress: e.target.value })
            }
          />
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={company.companyEmail}
            onChange={(e) =>
              setCompany({ ...company, companyEmail: e.target.value })
            }
          />
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>GST Number</Form.Label>
          <Form.Control
            type="text"
            value={company.gstNumber}
            onChange={(e) =>
              setCompany({ ...company, gstNumber: e.target.value })
            }
          />
        </Form.Group>

        {/* Uploads */}
        <Form.Group className="mb-2">
          <Form.Label> Logo</Form.Label>
          <Form.Control
            type="file"
            accept="image/*"
            onChange={(e) => handleFileInput(e, "logoUrl")}
          />
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>Digital Signature</Form.Label>
          <Form.Control
            type="file"
            accept="image/*"
            onChange={(e) => handleFileInput(e, "signatureUrl")}
          />
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label> Stamp</Form.Label>
          <Form.Control
            type="file"
            accept="image/*"
            onChange={(e) => handleFileInput(e, "stampUrl")}
          />
        </Form.Group>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSaveCompany}>
          Save  Data
        </Button>
        <Button variant="success" onClick={generatePDF}>
          Generate Bill PDF
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default BillModal;

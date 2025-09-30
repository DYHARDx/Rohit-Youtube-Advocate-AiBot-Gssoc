import React, { useState } from "react";
import { postData } from "../utils/postData";
import { jsPDF } from "jspdf";
import "../styles/CommonStyles.css";

const InvoiceGenerator = () => {
  const [inputs, setInputs] = useState({
    brand: "",
    service: "",
    amount: "",
    include_gst: true,
  });
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { id, value, type, checked } = e.target;
    setInputs((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const validateInputs = () => {
    if (!inputs.brand.trim() || !inputs.service.trim() || !inputs.amount) {
      setResult("⚠️ Please fill in all required fields.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateInputs()) {
      return;
    }
    
    setLoading(true);
    setResult(""); // Clear previous results
    
    try {
      const response = await postData("/api/invoice/generate", inputs);
      
      if (response.error) {
        setResult(`❌ Error: ${response.error}`);
      } else {
        setResult(response.invoice_text || "No invoice returned.");
      }
    } catch (error) {
      setResult(`❌ Unexpected error: ${error.message || "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text(result, 10, 20);
    doc.save(`invoice_${inputs.brand.replace(/\s+/g, "_")}.pdf`);
  };

  const renderResult = () => {
    if (loading) {
      return "⏳ Generating invoice...";
    }
    
    if (result) {
      return (
        <>
          <div style={{ whiteSpace: "pre-wrap" }}>{result}</div>
          {!result.startsWith("❌") && (
            <button
              onClick={downloadPDF}
              className="btn-primary"
              style={{ marginTop: "1rem" }}
              disabled={loading}
            >
              {loading ? "Processing..." : "Download PDF"}
            </button>
          )}
        </>
      );
    }
    
    return "Generated invoice will appear here...";
  };

  return (
    <section className="section-container">
      <h3>
        <svg className="h3-icon" width="32" height="32" viewBox="0 0 38 38" fill="none" style={{ marginRight: "10px" }}>
          <rect width="38" height="38" rx="10" />
          <polygon points="15,12 28,19 15,26" />
        </svg>
        YouTube Invoice Generator
      </h3>

      <form onSubmit={handleSubmit}>
        <input
          id="brand"
          type="text"
          value={inputs.brand}
          onChange={handleInputChange}
          placeholder="Brand or Sponsor"
          className="input-field"
          disabled={loading}
        />
        <input
          id="service"
          type="text"
          value={inputs.service}
          onChange={handleInputChange}
          placeholder="Service Description"
          className="input-field"
          disabled={loading}
        />
        <input
          id="amount"
          type="number"
          value={inputs.amount}
          onChange={handleInputChange}
          placeholder="Amount"
          className="input-field"
          disabled={loading}
        />

        <label className="checkbox-label">
          <input
            id="include_gst"
            type="checkbox"
            checked={inputs.include_gst}
            onChange={handleInputChange}
            disabled={loading}
          />
          <span>Include GST (18%)</span>
        </label>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Generating..." : "Generate Invoice"}
        </button>
      </form>

      <div className="result-card">
        {renderResult()}
      </div>
    </section>
  );
};

export default InvoiceGenerator;
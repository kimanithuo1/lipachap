"use client"

import React from "react"

import { useState, useRef } from "react"
import {
  ArrowLeft,
  Download,
  Eye,
  FileText,
  Building2,
  Calendar,
  DollarSign,
  Plus,
  Trash2,
  CheckCircle,
  ArrowRight,
} from "lucide-react"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"

const InvoiceGenerator = ({ onBack }) => {
  const [step, setStep] = useState(1) // 1: Details, 2: Items, 3: Preview
  const [invoiceData, setInvoiceData] = useState({
    // Business Details
    businessName: "",
    businessAddress: "",
    businessPhone: "",
    businessEmail: "",
    businessLogo: null,

    // Client Details
    clientName: "",
    clientAddress: "",
    clientPhone: "",
    clientEmail: "",

    // Invoice Details
    invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
    invoiceDate: new Date().toISOString().split("T")[0],
    dueDate: "",

    // Items
    items: [
      {
        id: 1,
        description: "",
        quantity: 1,
        rate: "",
        amount: 0,
      },
    ],

    // Totals
    subtotal: 0,
    tax: 0,
    total: 0,

    // Additional
    notes: "",
    terms: "Payment is due within 30 days of invoice date.",
  })

  const invoiceRef = useRef(null)

  const addItem = () => {
    const newItem = {
      id: Date.now(),
      description: "",
      quantity: 1,
      rate: "",
      amount: 0,
    }
    setInvoiceData((prev) => ({
      ...prev,
      items: [...prev.items, newItem],
    }))
  }

  const removeItem = (itemId) => {
    setInvoiceData((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== itemId),
    }))
  }

  const updateItem = (itemId, field, value) => {
    setInvoiceData((prev) => ({
      ...prev,
      items: prev.items.map((item) => {
        if (item.id === itemId) {
          const updatedItem = { ...item, [field]: value }
          if (field === "quantity" || field === "rate") {
            updatedItem.amount = Number(updatedItem.quantity) * Number(updatedItem.rate)
          }
          return updatedItem
        }
        return item
      }),
    }))
  }

  const calculateTotals = () => {
    const subtotal = invoiceData.items.reduce((sum, item) => sum + item.amount, 0)
    const tax = subtotal * (invoiceData.tax / 100)
    const total = subtotal + tax

    setInvoiceData((prev) => ({
      ...prev,
      subtotal,
      total: subtotal + tax,
    }))
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setInvoiceData((prev) => ({ ...prev, businessLogo: event.target.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const generatePDF = async () => {
    if (!invoiceRef.current) return

    try {
      const canvas = await html2canvas(invoiceRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        backgroundColor: "#ffffff",
      })

      const imgData = canvas.toDataURL("image/png", 1.0)
      const pdf = new jsPDF("p", "mm", "a4")

      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()
      const imgWidth = pdfWidth
      const imgHeight = (canvas.height * pdfWidth) / canvas.width

      let heightLeft = imgHeight
      let position = 0

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
      heightLeft -= pdfHeight

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
        heightLeft -= pdfHeight
      }

      const filename = `${invoiceData.invoiceNumber}-${invoiceData.businessName.replace(/\s+/g, "-")}.pdf`
      pdf.save(filename)
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("Failed to generate PDF. Please try again.")
    }
  }

  // Calculate totals whenever items change
  React.useEffect(() => {
    calculateTotals()
  }, [invoiceData.items, invoiceData.tax])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Home
        </button>

        <div className="flex items-center space-x-2">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              step >= 1 ? "bg-purple-500 text-white" : "bg-gray-200 text-gray-500"
            }`}
          >
            1
          </div>
          <div className={`w-16 h-1 ${step >= 2 ? "bg-purple-500" : "bg-gray-200"}`}></div>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              step >= 2 ? "bg-purple-500 text-white" : "bg-gray-200 text-gray-500"
            }`}
          >
            2
          </div>
          <div className={`w-16 h-1 ${step >= 3 ? "bg-purple-500" : "bg-gray-200"}`}></div>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              step >= 3 ? "bg-purple-500 text-white" : "bg-gray-200 text-gray-500"
            }`}
          >
            3
          </div>
        </div>
      </div>

      {/* Step 1: Business & Client Details */}
      {step === 1 && (
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Building2 className="w-6 h-6 mr-2 text-purple-600" />
              Business & Client Information
            </h2>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Business Details */}
              <div className="bg-purple-50 rounded-2xl p-6 border border-purple-200">
                <h3 className="text-lg font-bold text-purple-900 mb-4">Your Business Details</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Business Name *</label>
                    <input
                      type="text"
                      required
                      value={invoiceData.businessName}
                      onChange={(e) => setInvoiceData((prev) => ({ ...prev, businessName: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-400 transition-all duration-300"
                      placeholder="e.g. Sarah's Beauty Salon"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Business Address</label>
                    <textarea
                      value={invoiceData.businessAddress}
                      onChange={(e) => setInvoiceData((prev) => ({ ...prev, businessAddress: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-400 transition-all duration-300"
                      rows="3"
                      placeholder="Your business address"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Phone *</label>
                      <input
                        type="tel"
                        required
                        value={invoiceData.businessPhone}
                        onChange={(e) => setInvoiceData((prev) => ({ ...prev, businessPhone: e.target.value }))}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-400 transition-all duration-300"
                        placeholder="+254 700 000 000"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        value={invoiceData.businessEmail}
                        onChange={(e) => setInvoiceData((prev) => ({ ...prev, businessEmail: e.target.value }))}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-400 transition-all duration-300"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Business Logo</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-400 transition-all duration-300"
                    />
                    {invoiceData.businessLogo && (
                      <div className="mt-3 flex justify-center">
                        <img
                          src={invoiceData.businessLogo || "/placeholder.svg"}
                          alt="Business logo"
                          className="w-20 h-20 object-cover rounded-xl border-2 border-purple-200"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Client Details */}
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
                <h3 className="text-lg font-bold text-blue-900 mb-4">Client Details</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Client Name *</label>
                    <input
                      type="text"
                      required
                      value={invoiceData.clientName}
                      onChange={(e) => setInvoiceData((prev) => ({ ...prev, clientName: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-400 transition-all duration-300"
                      placeholder="e.g. John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Client Address</label>
                    <textarea
                      value={invoiceData.clientAddress}
                      onChange={(e) => setInvoiceData((prev) => ({ ...prev, clientAddress: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-400 transition-all duration-300"
                      rows="3"
                      placeholder="Client address"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                      <input
                        type="tel"
                        value={invoiceData.clientPhone}
                        onChange={(e) => setInvoiceData((prev) => ({ ...prev, clientPhone: e.target.value }))}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-400 transition-all duration-300"
                        placeholder="+254 700 000 000"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        value={invoiceData.clientEmail}
                        onChange={(e) => setInvoiceData((prev) => ({ ...prev, clientEmail: e.target.value }))}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-400 transition-all duration-300"
                        placeholder="client@email.com"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Invoice Details */}
            <div className="bg-green-50 rounded-2xl p-6 border border-green-200 mt-8">
              <h3 className="text-lg font-bold text-green-900 mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Invoice Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Invoice Number</label>
                  <input
                    type="text"
                    value={invoiceData.invoiceNumber}
                    onChange={(e) => setInvoiceData((prev) => ({ ...prev, invoiceNumber: e.target.value }))}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-200 focus:border-green-400 transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Invoice Date *</label>
                  <input
                    type="date"
                    required
                    value={invoiceData.invoiceDate}
                    onChange={(e) => setInvoiceData((prev) => ({ ...prev, invoiceDate: e.target.value }))}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-200 focus:border-green-400 transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Due Date</label>
                  <input
                    type="date"
                    value={invoiceData.dueDate}
                    onChange={(e) => setInvoiceData((prev) => ({ ...prev, dueDate: e.target.value }))}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-200 focus:border-green-400 transition-all duration-300"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setStep(2)}
                disabled={!invoiceData.businessName || !invoiceData.clientName || !invoiceData.businessPhone}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-xl font-bold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center"
              >
                Continue to Items
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Items */}
      {step === 2 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <FileText className="w-6 h-6 mr-2 text-purple-600" />
              Invoice Items
            </h2>
            <button
              onClick={addItem}
              className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:from-green-500 hover:to-blue-600 transition-all duration-300 flex items-center shadow-lg transform hover:scale-105"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </button>
          </div>

          <div className="space-y-4">
            {invoiceData.items.map((item, index) => (
              <div key={item.id} className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-gray-800">Item {index + 1}</h4>
                  {invoiceData.items.length > 1 && (
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-all duration-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Description *</label>
                    <input
                      type="text"
                      required
                      value={item.description}
                      onChange={(e) => updateItem(item.id, "description", e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-400 transition-all duration-300"
                      placeholder="e.g. Hair styling service"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Quantity *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, "quantity", Number(e.target.value))}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-400 transition-all duration-300"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Rate (KES) *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={item.rate}
                      onChange={(e) => updateItem(item.id, "rate", Number(e.target.value))}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-400 transition-all duration-300"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                {item.amount > 0 && (
                  <div className="mt-4 text-right">
                    <span className="text-lg font-bold text-green-600">Amount: KES {item.amount.toLocaleString()}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 border border-green-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-green-600" />
              Invoice Totals
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Tax Rate (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={invoiceData.tax}
                  onChange={(e) => setInvoiceData((prev) => ({ ...prev, tax: Number(e.target.value) }))}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-200 focus:border-green-400 transition-all duration-300"
                  placeholder="0"
                />
              </div>
            </div>

            <div className="space-y-2 text-right">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-semibold">KES {invoiceData.subtotal.toLocaleString()}</span>
              </div>
              {invoiceData.tax > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax ({invoiceData.tax}%):</span>
                  <span className="font-semibold">
                    KES {(invoiceData.subtotal * (invoiceData.tax / 100)).toLocaleString()}
                  </span>
                </div>
              )}
              <div className="border-t border-gray-300 pt-2">
                <div className="flex justify-between">
                  <span className="text-xl font-bold text-gray-900">Total:</span>
                  <span className="text-xl font-bold text-green-600">KES {invoiceData.total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Notes and Terms */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Notes</label>
              <textarea
                value={invoiceData.notes}
                onChange={(e) => setInvoiceData((prev) => ({ ...prev, notes: e.target.value }))}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-400 transition-all duration-300"
                rows="3"
                placeholder="Additional notes for the client"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Terms & Conditions</label>
              <textarea
                value={invoiceData.terms}
                onChange={(e) => setInvoiceData((prev) => ({ ...prev, terms: e.target.value }))}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-400 transition-all duration-300"
                rows="3"
                placeholder="Payment terms and conditions"
              />
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setStep(1)}
              className="bg-gray-200 text-gray-700 px-8 py-3 rounded-xl font-bold hover:bg-gray-300 transition-all duration-300 transform hover:scale-105"
            >
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              disabled={invoiceData.items.some((item) => !item.description || !item.rate)}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-xl font-bold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center"
            >
              Preview Invoice
              <Eye className="w-5 h-5 ml-2" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Preview */}
      {step === 3 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <Eye className="w-6 h-6 mr-2 text-purple-600" />
              Invoice Preview
            </h2>
            <div className="flex space-x-3">
              <button
                onClick={() => setStep(2)}
                className="bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-bold hover:bg-gray-300 transition-all duration-300 transform hover:scale-105"
              >
                Edit
              </button>
              <button
                onClick={generatePDF}
                className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-xl font-bold hover:from-green-600 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center"
              >
                <Download className="w-5 h-5 mr-2" />
                Download PDF
              </button>
            </div>
          </div>

          {/* Invoice Preview */}
          <div
            ref={invoiceRef}
            className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden"
            style={{ minHeight: "800px" }}
          >
            {/* Invoice Header */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-8">
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  {invoiceData.businessLogo && (
                    <img
                      src={invoiceData.businessLogo || "/placeholder.svg"}
                      alt="Business logo"
                      className="w-20 h-20 rounded-lg object-cover mr-6 border-4 border-white shadow-lg"
                    />
                  )}
                  <div>
                    <h1 className="text-3xl font-bold mb-2">{invoiceData.businessName}</h1>
                    {invoiceData.businessAddress && (
                      <p className="text-purple-100 mb-2">{invoiceData.businessAddress}</p>
                    )}
                    <div className="space-y-1">
                      <p className="text-purple-100">📞 {invoiceData.businessPhone}</p>
                      {invoiceData.businessEmail && <p className="text-purple-100">📧 {invoiceData.businessEmail}</p>}
                    </div>
                  </div>
                </div>

                <div className="text-right bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  <h2 className="text-2xl font-bold mb-2">INVOICE</h2>
                  <p className="text-xl font-semibold">{invoiceData.invoiceNumber}</p>
                  <div className="mt-3 space-y-1 text-sm text-purple-100">
                    <p>Date: {new Date(invoiceData.invoiceDate).toLocaleDateString()}</p>
                    {invoiceData.dueDate && <p>Due: {new Date(invoiceData.dueDate).toLocaleDateString()}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Invoice Content */}
            <div className="p-8">
              {/* Bill To Section */}
              <div className="mb-8">
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">👤 BILL TO</h3>
                  <div className="space-y-2">
                    <p className="font-semibold text-gray-900 text-lg">{invoiceData.clientName}</p>
                    {invoiceData.clientAddress && <p className="text-gray-600">{invoiceData.clientAddress}</p>}
                    {invoiceData.clientPhone && <p className="text-gray-600">📞 {invoiceData.clientPhone}</p>}
                    {invoiceData.clientEmail && <p className="text-gray-600">📧 {invoiceData.clientEmail}</p>}
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <FileText className="w-6 h-6 mr-2 text-purple-600" />
                  ITEMS
                </h3>

                <div className="overflow-x-auto bg-gray-50 rounded-xl">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gradient-to-r from-purple-100 to-pink-100">
                        <th className="border border-gray-200 px-6 py-4 text-left font-bold text-gray-900">
                          Description
                        </th>
                        <th className="border border-gray-200 px-6 py-4 text-center font-bold text-gray-900">
                          Quantity
                        </th>
                        <th className="border border-gray-200 px-6 py-4 text-right font-bold text-gray-900">Rate</th>
                        <th className="border border-gray-200 px-6 py-4 text-right font-bold text-gray-900">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoiceData.items.map((item, index) => (
                        <tr key={index} className="hover:bg-white transition-colors duration-200">
                          <td className="border border-gray-200 px-6 py-4">
                            <p className="font-semibold text-gray-900">{item.description}</p>
                          </td>
                          <td className="border border-gray-200 px-6 py-4 text-center">
                            <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full font-bold">
                              {item.quantity}
                            </span>
                          </td>
                          <td className="border border-gray-200 px-6 py-4 text-right font-semibold text-gray-900">
                            KES {Number(item.rate).toLocaleString()}
                          </td>
                          <td className="border border-gray-200 px-6 py-4 text-right font-bold text-purple-600">
                            KES {item.amount.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Totals Section */}
              <div className="flex justify-end mb-8">
                <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl p-6 border-2 border-green-200 min-w-[300px]">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-700">Subtotal:</span>
                      <span className="font-semibold text-gray-900">KES {invoiceData.subtotal.toLocaleString()}</span>
                    </div>
                    {invoiceData.tax > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-700">Tax ({invoiceData.tax}%):</span>
                        <span className="font-semibold text-gray-900">
                          KES {(invoiceData.subtotal * (invoiceData.tax / 100)).toLocaleString()}
                        </span>
                      </div>
                    )}
                    <div className="border-t border-green-300 pt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-bold text-green-900">TOTAL:</span>
                        <span className="text-3xl font-bold text-green-900">
                          KES {invoiceData.total.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes and Terms */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {invoiceData.notes && (
                  <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                    <h4 className="font-bold text-blue-900 mb-3">📝 Notes</h4>
                    <p className="text-blue-800">{invoiceData.notes}</p>
                  </div>
                )}

                {invoiceData.terms && (
                  <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
                    <h4 className="font-bold text-yellow-900 mb-3">📋 Terms & Conditions</h4>
                    <p className="text-yellow-800 text-sm">{invoiceData.terms}</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="mt-8 pt-8 border-t border-gray-200 text-center">
                <p className="text-sm text-gray-500 font-semibold">
                  🚀 Generated with LipaChap - Professional Invoice Solutions for Kenyan Businesses
                </p>
              </div>
            </div>
          </div>

          {/* Success Message */}
          <div className="bg-green-50 rounded-xl p-6 border border-green-200 text-center">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-green-900 mb-2">Invoice Ready!</h3>
            <p className="text-green-700">
              Your professional invoice has been generated. Click "Download PDF" to save it to your device.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default InvoiceGenerator

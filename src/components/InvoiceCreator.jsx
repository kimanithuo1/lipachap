"use client"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Plus, Trash2, Eye, Save, FileText, User, Calculator, AlertCircle, Check, ArrowLeft } from "lucide-react"
import InvoicePreview from "./InvoicePreview"

const InvoiceCreator = ({ vendor, onCreateInvoice }) => {
  const navigate = useNavigate()
  const [showPreview, setShowPreview] = useState(false)
  const [errors, setErrors] = useState({})
  const [invoiceData, setInvoiceData] = useState({
    invoiceNumber: `INV-${Date.now()}`,
    date: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    clientAddress: "",
    items: [
      {
        id: 1,
        description: "",
        quantity: 1,
        rate: 0,
        total: 0,
      },
    ],
    notes: "",
    taxRate: 16, // VAT in Kenya
    subtotal: 0,
    taxAmount: 0,
    total: 0,
  })

  // Auto-calculate totals whenever items change
  useEffect(() => {
    calculateTotals()
  }, [invoiceData.items, invoiceData.taxRate])

  // Save draft to localStorage
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem("invoice-draft", JSON.stringify(invoiceData))
    }, 1000)
    return () => clearTimeout(timer)
  }, [invoiceData])

  // Load draft on component mount
  useEffect(() => {
    const draft = localStorage.getItem("invoice-draft")
    if (draft) {
      try {
        const parsedDraft = JSON.parse(draft)
        setInvoiceData(parsedDraft)
      } catch (error) {
        console.error("Error loading draft:", error)
      }
    }
  }, [])

  const calculateTotals = () => {
    const subtotal = invoiceData.items.reduce((sum, item) => {
      const itemTotal = (item.quantity || 0) * (item.rate || 0)
      return sum + itemTotal
    }, 0)

    const taxAmount = (subtotal * (invoiceData.taxRate || 0)) / 100
    const total = subtotal + taxAmount

    setInvoiceData((prev) => ({
      ...prev,
      subtotal,
      taxAmount,
      total,
    }))
  }

  const updateItem = (itemId, field, value) => {
    setInvoiceData((prev) => ({
      ...prev,
      items: prev.items.map((item) => {
        if (item.id === itemId) {
          const updatedItem = { ...item, [field]: value }
          if (field === "quantity" || field === "rate") {
            updatedItem.total = (updatedItem.quantity || 0) * (updatedItem.rate || 0)
          }
          return updatedItem
        }
        return item
      }),
    }))

    // Clear field-specific errors
    if (errors[`item-${itemId}-${field}`]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[`item-${itemId}-${field}`]
        return newErrors
      })
    }
  }

  const addItem = () => {
    const newItem = {
      id: Date.now(),
      description: "",
      quantity: 1,
      rate: 0,
      total: 0,
    }
    setInvoiceData((prev) => ({
      ...prev,
      items: [...prev.items, newItem],
    }))
  }

  const removeItem = (itemId) => {
    if (invoiceData.items.length > 1) {
      setInvoiceData((prev) => ({
        ...prev,
        items: prev.items.filter((item) => item.id !== itemId),
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    // Client validation
    if (!invoiceData.clientName.trim()) {
      newErrors.clientName = "Client name is required"
    }
    if (!invoiceData.clientPhone.trim()) {
      newErrors.clientPhone = "Client phone is required"
    }

    // Items validation
    invoiceData.items.forEach((item) => {
      if (!item.description.trim()) {
        newErrors[`item-${item.id}-description`] = "Description required"
      }
      if (!item.rate || item.rate <= 0) {
        newErrors[`item-${item.id}-rate`] = "Rate must be greater than 0"
      }
      if (!item.quantity || item.quantity <= 0) {
        newErrors[`item-${item.id}-quantity`] = "Quantity must be greater than 0"
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      const invoice = {
        ...invoiceData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        status: "draft",
      }
      onCreateInvoice(invoice)
      localStorage.removeItem("invoice-draft")
      navigate(`/invoice/${invoice.id}`)
    }
  }

  const clearDraft = () => {
    localStorage.removeItem("invoice-draft")
    setInvoiceData({
      invoiceNumber: `INV-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      clientName: "",
      clientEmail: "",
      clientPhone: "",
      clientAddress: "",
      items: [{ id: 1, description: "", quantity: 1, rate: 0, total: 0 }],
      notes: "",
      taxRate: 16,
      subtotal: 0,
      taxAmount: 0,
      total: 0,
    })
    setErrors({})
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <button
                onClick={() => navigate(-1)}
                className="mr-4 p-2 text-gray-600 hover:text-gray-900 bg-white rounded-lg hover:bg-gray-50 transition-all duration-200 shadow-sm"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Create Invoice</h1>
                <p className="text-gray-600 mt-1">Generate professional invoices for your clients</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-sm"
              >
                <Eye className="w-4 h-4 mr-2" />
                {showPreview ? "Hide Preview" : "Preview"}
              </button>
              <button
                onClick={clearDraft}
                className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-200 shadow-sm"
              >
                <FileText className="w-4 h-4 mr-2" />
                New Invoice
              </button>
            </div>
          </div>

          {/* Draft indicator */}
          <div className="flex items-center text-sm text-amber-600 bg-amber-50 px-3 py-2 rounded-lg border border-amber-200">
            <Save className="w-4 h-4 mr-2" />
            Draft auto-saved
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Invoice Details */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-blue-600" />
                  Invoice Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Invoice Number</label>
                    <input
                      type="text"
                      value={invoiceData.invoiceNumber}
                      onChange={(e) => setInvoiceData((prev) => ({ ...prev, invoiceNumber: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Invoice Date</label>
                    <input
                      type="date"
                      value={invoiceData.date}
                      onChange={(e) => setInvoiceData((prev) => ({ ...prev, date: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                    <input
                      type="date"
                      value={invoiceData.dueDate}
                      onChange={(e) => setInvoiceData((prev) => ({ ...prev, dueDate: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Client Details */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2 text-green-600" />
                  Client Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Client Name *</label>
                    <input
                      type="text"
                      value={invoiceData.clientName}
                      onChange={(e) => setInvoiceData((prev) => ({ ...prev, clientName: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors ${
                        errors.clientName
                          ? "border-red-300 focus:border-red-500"
                          : "border-gray-300 focus:border-blue-500"
                      }`}
                      placeholder="Enter client name"
                    />
                    {errors.clientName && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.clientName}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      value={invoiceData.clientPhone}
                      onChange={(e) => setInvoiceData((prev) => ({ ...prev, clientPhone: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors ${
                        errors.clientPhone
                          ? "border-red-300 focus:border-red-500"
                          : "border-gray-300 focus:border-blue-500"
                      }`}
                      placeholder="+254 700 000 000"
                    />
                    {errors.clientPhone && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.clientPhone}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <input
                      type="email"
                      value={invoiceData.clientEmail}
                      onChange={(e) => setInvoiceData((prev) => ({ ...prev, clientEmail: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="client@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <textarea
                      value={invoiceData.clientAddress}
                      onChange={(e) => setInvoiceData((prev) => ({ ...prev, clientAddress: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      rows="2"
                      placeholder="Client address"
                    />
                  </div>
                </div>
              </div>

              {/* Line Items */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Calculator className="w-5 h-5 mr-2 text-purple-600" />
                    Line Items
                  </h2>
                  <button
                    type="button"
                    onClick={addItem}
                    className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 text-sm"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Item
                  </button>
                </div>

                <div className="space-y-4">
                  {invoiceData.items.map((item, index) => (
                    <div key={item.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-700">Item {index + 1}</span>
                        {invoiceData.items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                        <div className="md:col-span-6">
                          <label className="block text-xs font-medium text-gray-600 mb-1">Description *</label>
                          <input
                            type="text"
                            value={item.description}
                            onChange={(e) => updateItem(item.id, "description", e.target.value)}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors text-sm ${
                              errors[`item-${item.id}-description`] ? "border-red-300" : "border-gray-300"
                            }`}
                            placeholder="Item description"
                          />
                          {errors[`item-${item.id}-description`] && (
                            <p className="mt-1 text-xs text-red-600">{errors[`item-${item.id}-description`]}</p>
                          )}
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs font-medium text-gray-600 mb-1">Quantity *</label>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateItem(item.id, "quantity", Number.parseInt(e.target.value) || 0)}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors text-sm ${
                              errors[`item-${item.id}-quantity`] ? "border-red-300" : "border-gray-300"
                            }`}
                          />
                          {errors[`item-${item.id}-quantity`] && (
                            <p className="mt-1 text-xs text-red-600">{errors[`item-${item.id}-quantity`]}</p>
                          )}
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs font-medium text-gray-600 mb-1">Rate (KES) *</label>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.rate}
                            onChange={(e) => updateItem(item.id, "rate", Number.parseFloat(e.target.value) || 0)}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors text-sm ${
                              errors[`item-${item.id}-rate`] ? "border-red-300" : "border-gray-300"
                            }`}
                          />
                          {errors[`item-${item.id}-rate`] && (
                            <p className="mt-1 text-xs text-red-600">{errors[`item-${item.id}-rate`]}</p>
                          )}
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs font-medium text-gray-600 mb-1">Total (KES)</label>
                          <div className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-sm font-medium text-gray-900">
                            {(item.quantity * item.rate).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex justify-end">
                    <div className="w-full max-w-sm space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Subtotal:</span>
                        <span className="font-medium">KES {invoiceData.subtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <div className="flex items-center">
                          <span className="text-gray-600 mr-2">VAT ({invoiceData.taxRate}%):</span>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            step="0.1"
                            value={invoiceData.taxRate}
                            onChange={(e) =>
                              setInvoiceData((prev) => ({ ...prev, taxRate: Number.parseFloat(e.target.value) || 0 }))
                            }
                            className="w-16 px-2 py-1 border border-gray-300 rounded text-xs"
                          />
                          <span className="text-gray-600 ml-1">%</span>
                        </div>
                        <span className="font-medium">KES {invoiceData.taxAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold text-gray-900 pt-3 border-t border-gray-200">
                        <span>Total:</span>
                        <span>KES {invoiceData.total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Additional Notes</h2>
                <textarea
                  value={invoiceData.notes}
                  onChange={(e) => setInvoiceData((prev) => ({ ...prev, notes: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  rows="4"
                  placeholder="Payment terms, thank you message, or other notes..."
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium shadow-sm"
                >
                  <Check className="w-5 h-5 mr-2" />
                  Generate Invoice
                </button>
              </div>
            </form>
          </div>

          {/* Preview Section */}
          {showPreview && (
            <div className="lg:sticky lg:top-6">
              <InvoicePreview invoiceData={invoiceData} vendor={vendor} className="h-fit" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default InvoiceCreator

"use client"
import { useState, useRef, useEffect } from "react"
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
  Printer,
  Share2,
  AlertCircle,
} from "lucide-react"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"
import Toast from "./Toast"
import LoadingSpinner from "./LoadingSpinner"

const InvoiceGenerator = ({ onBack }) => {
  const [step, setStep] = useState(1) // 1: Details, 2: Items, 3: Preview
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSharing, setIsSharing] = useState(false)
  const [toast, setToast] = useState({ show: false, message: "", type: "success" })
  const [validationErrors, setValidationErrors] = useState({})

  const [invoiceData, setInvoiceData] = useState(() => {
    // Load from localStorage if available
    const saved = localStorage.getItem("lipachap-invoice-draft")
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        console.error("Failed to parse saved invoice data")
      }
    }

    return {
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
    }
  })

  const invoiceRef = useRef(null)

  // Save to localStorage whenever invoiceData changes
  useEffect(() => {
    localStorage.setItem("lipachap-invoice-draft", JSON.stringify(invoiceData))
  }, [invoiceData])

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type })
  }

  const hideToast = () => {
    setToast({ show: false, message: "", type: "success" })
  }

  const validateStep1 = () => {
    const errors = {}
    if (!invoiceData.businessName.trim()) errors.businessName = "Business name is required"
    if (!invoiceData.businessPhone.trim()) errors.businessPhone = "Business phone is required"
    if (!invoiceData.clientName.trim()) errors.clientName = "Client name is required"
    if (!invoiceData.invoiceDate) errors.invoiceDate = "Invoice date is required"

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const validateStep2 = () => {
    const errors = {}
    const hasValidItems = invoiceData.items.some((item) => item.description.trim() && item.rate > 0)

    if (!hasValidItems) {
      errors.items = "At least one item with description and rate is required"
    }

    invoiceData.items.forEach((item, index) => {
      if (item.description.trim() && !item.rate) {
        errors[`item_${index}_rate`] = "Rate is required"
      }
      if (item.rate && !item.description.trim()) {
        errors[`item_${index}_description`] = "Description is required"
      }
    })

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

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
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        showToast("Image size should be less than 5MB", "error")
        return
      }

      const reader = new FileReader()
      reader.onload = (event) => {
        setInvoiceData((prev) => ({ ...prev, businessLogo: event.target.result }))
        showToast("Logo uploaded successfully!", "success")
      }
      reader.onerror = () => {
        showToast("Failed to upload image", "error")
      }
      reader.readAsDataURL(file)
    }
  }

  const generatePDF = async () => {
    if (!invoiceRef.current) {
      showToast("Invoice preview not available", "error")
      return
    }

    setIsGenerating(true)

    try {
      // Wait for all images to load
      const images = invoiceRef.current.querySelectorAll("img")
      await Promise.all(
        Array.from(images).map((img) => {
          if (img.complete) return Promise.resolve()
          return new Promise((resolve, reject) => {
            img.onload = resolve
            img.onerror = reject
            setTimeout(reject, 5000) // 5 second timeout
          })
        }),
      )

      // Create canvas with high quality
      const canvas = await html2canvas(invoiceRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        backgroundColor: "#ffffff",
        logging: false,
        imageTimeout: 10000,
        removeContainer: true,
        onclone: (clonedDoc) => {
          // Ensure proper styling in cloned document
          const clonedElement = clonedDoc.querySelector("[data-invoice-content]")
          if (clonedElement) {
            clonedElement.style.fontFamily = "Arial, sans-serif"
            clonedElement.style.color = "#000000"
          }
        },
      })

      // Create PDF
      const imgData = canvas.toDataURL("image/png", 1.0)
      const pdf = new jsPDF("p", "mm", "a4")

      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()
      const imgWidth = pdfWidth
      const imgHeight = (canvas.height * pdfWidth) / canvas.width

      let heightLeft = imgHeight
      let position = 0

      // Add first page
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
      heightLeft -= pdfHeight

      // Add additional pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
        heightLeft -= pdfHeight
      }

      // Generate filename
      const filename = `${invoiceData.invoiceNumber}-${invoiceData.businessName.replace(/[^a-zA-Z0-9]/g, "-")}-${new Date().toISOString().split("T")[0]}.pdf`

      // Download PDF
      pdf.save(filename)

      showToast("Invoice PDF downloaded successfully! 📄", "success")

      // Track download event
      if (typeof window !== "undefined" && typeof window.gtag !== "undefined") {
        window.gtag("event", "download", {
          event_category: "invoice",
          event_label: "pdf_download",
        })
      }
    } catch (error) {
      console.error("Error generating PDF:", error)
      showToast("Failed to generate PDF. Please try again.", "error")
    } finally {
      setIsGenerating(false)
    }
  }

  const printInvoice = () => {
    if (!invoiceRef.current) {
      showToast("Invoice preview not available", "error")
      return
    }

    try {
      // Create a new window for printing
      const printWindow = window.open("", "_blank")

      if (!printWindow) {
        showToast("Please allow popups to enable printing", "error")
        return
      }

      // Get the invoice HTML content
      const invoiceHTML = invoiceRef.current.innerHTML

      // Create print-optimized HTML
      const printHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice ${invoiceData.invoiceNumber}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: Arial, sans-serif; 
              line-height: 1.4; 
              color: #000; 
              background: white;
            }
            .invoice-container { 
              max-width: 800px; 
              margin: 0 auto; 
              padding: 20px; 
            }
            table { 
              width: 100%; 
              border-collapse: collapse; 
              margin: 20px 0; 
            }
            th, td { 
              border: 1px solid #ddd; 
              padding: 8px; 
              text-align: left; 
            }
            th { 
              background-color: #f5f5f5; 
              font-weight: bold; 
            }
            .text-right { text-align: right; }
            .text-center { text-align: center; }
            .font-bold { font-weight: bold; }
            .text-lg { font-size: 1.125rem; }
            .text-xl { font-size: 1.25rem; }
            .text-2xl { font-size: 1.5rem; }
            .text-3xl { font-size: 1.875rem; }
            .mb-2 { margin-bottom: 0.5rem; }
            .mb-4 { margin-bottom: 1rem; }
            .mb-6 { margin-bottom: 1.5rem; }
            .mt-4 { margin-top: 1rem; }
            .p-4 { padding: 1rem; }
            .p-6 { padding: 1.5rem; }
            .bg-gray-50 { background-color: #f9fafb; }
            .border { border: 1px solid #e5e7eb; }
            .rounded { border-radius: 0.375rem; }
            @media print {
              body { print-color-adjust: exact; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="invoice-container">
            ${invoiceHTML}
          </div>
        </body>
      </html>
    `

      printWindow.document.write(printHTML)
      printWindow.document.close()

      // Wait for content to load then print
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print()
          printWindow.close()
        }, 250)
      }

      showToast("Print dialog opened! 🖨️", "success")
    } catch (error) {
      console.error("Error printing invoice:", error)
      showToast("Failed to open print dialog", "error")
    }
  }

  const shareViaWhatsApp = async () => {
    setIsSharing(true)

    try {
      const invoiceText = `🧾 *INVOICE FROM ${invoiceData.businessName.toUpperCase()}*

📋 Invoice: ${invoiceData.invoiceNumber}
📅 Date: ${new Date(invoiceData.invoiceDate).toLocaleDateString()}
👤 Client: ${invoiceData.clientName}

📦 *ITEMS:*
${invoiceData.items
  .filter((item) => item.description && item.rate)
  .map((item) => `• ${item.description} (Qty: ${item.quantity}) - KES ${item.amount.toLocaleString()}`)
  .join("\n")}

💰 *TOTAL: KES ${invoiceData.total.toLocaleString()}*

📞 Contact: ${invoiceData.businessPhone}
${invoiceData.businessEmail ? `📧 Email: ${invoiceData.businessEmail}` : ""}

🚀 Generated with LipaChap - Free Invoice Generator for Kenyan Businesses
Visit: https://lipachap.vercel.app`

      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(invoiceText)}`

      // Try to use Web Share API first
      if (navigator.share && navigator.canShare) {
        try {
          await navigator.share({
            title: `Invoice ${invoiceData.invoiceNumber}`,
            text: invoiceText,
            url: "https://lipachap.vercel.app",
          })
          showToast("Invoice shared successfully! 📤", "success")
        } catch (shareError) {
          if (shareError.name !== "AbortError") {
            // Fallback to WhatsApp
            window.open(whatsappUrl, "_blank")
            showToast("Opening WhatsApp to share invoice! 💬", "success")
          }
        }
      } else {
        // Direct WhatsApp sharing
        window.open(whatsappUrl, "_blank")
        showToast("Opening WhatsApp to share invoice! 💬", "success")
      }

      // Track share event
      if (typeof window !== "undefined" && typeof window.gtag !== "undefined") {
        window.gtag("event", "share", {
          event_category: "invoice",
          event_label: "whatsapp_share",
        })
      }
    } catch (error) {
      console.error("Error sharing invoice:", error)
      showToast("Failed to share invoice", "error")
    } finally {
      setIsSharing(false)
    }
  }

  // Calculate totals whenever items change
  useEffect(() => {
    calculateTotals()
  }, [invoiceData.items, invoiceData.tax])

  const handleStep1Continue = () => {
    if (validateStep1()) {
      setStep(2)
      setValidationErrors({})
    } else {
      showToast("Please fill in all required fields", "error")
    }
  }

  const handleStep2Continue = () => {
    if (validateStep2()) {
      setStep(3)
      setValidationErrors({})
    } else {
      showToast("Please add at least one item with description and rate", "error")
    }
  }

  const clearDraft = () => {
    localStorage.removeItem("lipachap-invoice-draft")
    showToast("Draft cleared successfully", "success")
  }

  return (
    <div className="space-y-6">
      {/* Toast Notifications */}
      <Toast message={toast.message} type={toast.type} isVisible={toast.show} onClose={hideToast} />

      {/* Header */}
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Home
        </button>

        <div className="flex items-center space-x-2">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
              step >= 1 ? "bg-purple-500 text-white shadow-lg" : "bg-gray-200 text-gray-500"
            }`}
          >
            1
          </div>
          <div className={`w-16 h-1 transition-all duration-300 ${step >= 2 ? "bg-purple-500" : "bg-gray-200"}`}></div>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
              step >= 2 ? "bg-purple-500 text-white shadow-lg" : "bg-gray-200 text-gray-500"
            }`}
          >
            2
          </div>
          <div className={`w-16 h-1 transition-all duration-300 ${step >= 3 ? "bg-purple-500" : "bg-gray-200"}`}></div>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
              step >= 3 ? "bg-purple-500 text-white shadow-lg" : "bg-gray-200 text-gray-500"
            }`}
          >
            3
          </div>
        </div>

        <button onClick={clearDraft} className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
          Clear Draft
        </button>
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
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-400 transition-all duration-300 ${
                        validationErrors.businessName ? "border-red-400 bg-red-50" : "border-gray-200"
                      }`}
                      placeholder="e.g. Sarah's Beauty Salon"
                    />
                    {validationErrors.businessName && (
                      <p className="text-red-600 text-sm mt-1 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {validationErrors.businessName}
                      </p>
                    )}
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
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-400 transition-all duration-300 ${
                          validationErrors.businessPhone ? "border-red-400 bg-red-50" : "border-gray-200"
                        }`}
                        placeholder="+254 700 000 000"
                      />
                      {validationErrors.businessPhone && (
                        <p className="text-red-600 text-sm mt-1 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {validationErrors.businessPhone}
                        </p>
                      )}
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
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-400 transition-all duration-300 ${
                        validationErrors.clientName ? "border-red-400 bg-red-50" : "border-gray-200"
                      }`}
                      placeholder="e.g. John Doe"
                    />
                    {validationErrors.clientName && (
                      <p className="text-red-600 text-sm mt-1 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {validationErrors.clientName}
                      </p>
                    )}
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
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-green-200 focus:border-green-400 transition-all duration-300 ${
                      validationErrors.invoiceDate ? "border-red-400 bg-red-50" : "border-gray-200"
                    }`}
                  />
                  {validationErrors.invoiceDate && (
                    <p className="text-red-600 text-sm mt-1 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {validationErrors.invoiceDate}
                    </p>
                  )}
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
                onClick={handleStep1Continue}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-xl font-bold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center"
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

          {validationErrors.items && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-red-600 flex items-center">
                <AlertCircle className="w-5 h-5 mr-2" />
                {validationErrors.items}
              </p>
            </div>
          )}

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
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-400 transition-all duration-300 ${
                        validationErrors[`item_${index}_description`] ? "border-red-400 bg-red-50" : "border-gray-200"
                      }`}
                      placeholder="e.g. Hair styling service"
                    />
                    {validationErrors[`item_${index}_description`] && (
                      <p className="text-red-600 text-sm mt-1 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {validationErrors[`item_${index}_description`]}
                      </p>
                    )}
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
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-400 transition-all duration-300 ${
                        validationErrors[`item_${index}_rate`] ? "border-red-400 bg-red-50" : "border-gray-200"
                      }`}
                      placeholder="0.00"
                    />
                    {validationErrors[`item_${index}_rate`] && (
                      <p className="text-red-600 text-sm mt-1 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {validationErrors[`item_${index}_rate`]}
                      </p>
                    )}
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
              onClick={handleStep2Continue}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-xl font-bold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center"
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
                onClick={printInvoice}
                className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-3 rounded-xl font-bold hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center"
              >
                <Printer className="w-5 h-5 mr-2" />
                Print
              </button>
              <button
                onClick={shareViaWhatsApp}
                disabled={isSharing}
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl font-bold hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSharing ? <LoadingSpinner size="sm" text="" /> : <Share2 className="w-5 h-5 mr-2" />}
                {isSharing ? "Sharing..." : "Share"}
              </button>
              <button
                onClick={generatePDF}
                disabled={isGenerating}
                className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-xl font-bold hover:from-red-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isGenerating ? <LoadingSpinner size="sm" text="" /> : <Download className="w-5 h-5 mr-2" />}
                {isGenerating ? "Generating..." : "Download PDF"}
              </button>
            </div>
          </div>

          {/* Invoice Preview */}
          <div
            ref={invoiceRef}
            data-invoice-content
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
                      crossOrigin="anonymous"
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
                      {invoiceData.items
                        .filter((item) => item.description && item.rate)
                        .map((item, index) => (
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
              Your professional invoice has been generated. Download PDF, print, or share via WhatsApp.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default InvoiceGenerator

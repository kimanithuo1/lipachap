"use client"
import { useState, useRef } from "react"
import { Download, Printer, PhoneIcon as WhatsApp, Copy, Share2, CheckCircle, AlertCircle, Receipt } from "lucide-react"
import { QRCodeSVG } from "qrcode.react"
import jsPDF from "jspdf"

const Invoice = ({ orderData, vendor, checkout }) => {
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSharing, setIsSharing] = useState(false)
  const [notification, setNotification] = useState(null)
  const invoiceRef = useRef(null)

  const invoiceNumber = `INV-${orderData.id}`
  const invoiceDate = new Date(orderData.timestamp).toLocaleDateString("en-KE", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
  const invoiceTime = new Date(orderData.timestamp).toLocaleTimeString("en-KE", {
    hour: "2-digit",
    minute: "2-digit",
  })

  // Calculate totals
  const totalProducts = orderData.items.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = orderData.totalAmount
  const taxAmount = 0 // Can be calculated if needed
  const finalTotal = subtotal + taxAmount

  // Show notification
  const showNotification = (message, type = "success") => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }

  // Optimized PDF generation for receipt-style invoice
  const generatePDF = async () => {
    setIsGenerating(true)
    try {
      // Create PDF with receipt dimensions (80mm width)
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [80, 200], // 80mm width, 200mm height (thermal receipt size)
      })

      // Set font
      pdf.setFont("helvetica")

      let yPos = 10
      const pageWidth = 80
      const margin = 5
      const contentWidth = pageWidth - margin * 2

      // Header - Business Info
      pdf.setFontSize(14)
      pdf.setFont("helvetica", "bold")
      const businessName = vendor.businessName.toUpperCase()
      const businessNameWidth = pdf.getTextWidth(businessName)
      pdf.text(businessName, (pageWidth - businessNameWidth) / 2, yPos)
      yPos += 6

      pdf.setFontSize(8)
      pdf.setFont("helvetica", "normal")

      // Contact info
      if (vendor.phone) {
        const phoneText = `Tel: ${vendor.phone}`
        const phoneWidth = pdf.getTextWidth(phoneText)
        pdf.text(phoneText, (pageWidth - phoneWidth) / 2, yPos)
        yPos += 4
      }

      if (vendor.email) {
        const emailText = vendor.email
        const emailWidth = pdf.getTextWidth(emailText)
        pdf.text(emailText, (pageWidth - emailWidth) / 2, yPos)
        yPos += 4
      }

      // Separator line
      yPos += 2
      pdf.line(margin, yPos, pageWidth - margin, yPos)
      yPos += 4

      // Invoice details
      pdf.setFontSize(10)
      pdf.setFont("helvetica", "bold")
      pdf.text("INVOICE", margin, yPos)
      pdf.setFont("helvetica", "normal")
      pdf.text(invoiceNumber, pageWidth - margin - pdf.getTextWidth(invoiceNumber), yPos)
      yPos += 5

      pdf.setFontSize(8)
      pdf.text(`Date: ${invoiceDate} ${invoiceTime}`, margin, yPos)
      yPos += 4

      // Customer info
      pdf.text(`Customer: ${orderData.name}`, margin, yPos)
      yPos += 4
      pdf.text(`Phone: ${orderData.phone}`, margin, yPos)
      yPos += 6

      // Separator line
      pdf.line(margin, yPos, pageWidth - margin, yPos)
      yPos += 4

      // Items header
      pdf.setFontSize(8)
      pdf.setFont("helvetica", "bold")
      pdf.text("ITEM", margin, yPos)
      pdf.text("QTY", 45, yPos)
      pdf.text("PRICE", 55, yPos)
      pdf.text("TOTAL", 65, yPos)
      yPos += 3

      pdf.line(margin, yPos, pageWidth - margin, yPos)
      yPos += 3

      // Items
      pdf.setFont("helvetica", "normal")
      orderData.items.forEach((item) => {
        // Item name (truncate if too long)
        let itemName = item.name
        if (pdf.getTextWidth(itemName) > 35) {
          while (pdf.getTextWidth(itemName + "...") > 35 && itemName.length > 10) {
            itemName = itemName.slice(0, -1)
          }
          itemName += "..."
        }

        pdf.text(itemName, margin, yPos)
        pdf.text(item.quantity.toString(), 47, yPos)
        pdf.text(item.price.toLocaleString(), 55, yPos)
        pdf.text(item.total.toLocaleString(), 65, yPos)
        yPos += 4
      })

      // Separator line
      yPos += 2
      pdf.line(margin, yPos, pageWidth - margin, yPos)
      yPos += 4

      // Totals
      pdf.setFont("helvetica", "normal")
      pdf.text(`Subtotal:`, margin, yPos)
      pdf.text(
        `KES ${subtotal.toLocaleString()}`,
        pageWidth - margin - pdf.getTextWidth(`KES ${subtotal.toLocaleString()}`),
        yPos,
      )
      yPos += 4

      if (taxAmount > 0) {
        pdf.text(`Tax:`, margin, yPos)
        pdf.text(
          `KES ${taxAmount.toLocaleString()}`,
          pageWidth - margin - pdf.getTextWidth(`KES ${taxAmount.toLocaleString()}`),
          yPos,
        )
        yPos += 4
      }

      // Total (bold and larger)
      pdf.setFontSize(10)
      pdf.setFont("helvetica", "bold")
      pdf.text(`TOTAL:`, margin, yPos)
      const totalText = `KES ${finalTotal.toLocaleString()}`
      pdf.text(totalText, pageWidth - margin - pdf.getTextWidth(totalText), yPos)
      yPos += 6

      // Payment status
      pdf.setFontSize(8)
      pdf.setFont("helvetica", "bold")
      const statusText = `PAYMENT: ${orderData.method.toUpperCase()} - PAID`
      const statusWidth = pdf.getTextWidth(statusText)
      pdf.text(statusText, (pageWidth - statusWidth) / 2, yPos)
      yPos += 6

      // Transaction ID
      pdf.setFont("helvetica", "normal")
      const txnText = `TXN: ${orderData.transactionId}`
      const txnWidth = pdf.getTextWidth(txnText)
      pdf.text(txnText, (pageWidth - txnWidth) / 2, yPos)
      yPos += 8

      // Thank you message
      pdf.setFontSize(8)
      pdf.setFont("helvetica", "italic")
      const thankYouText = "Thank you for your business!"
      const thankYouWidth = pdf.getTextWidth(thankYouText)
      pdf.text(thankYouText, (pageWidth - thankYouWidth) / 2, yPos)
      yPos += 6

      // Footer
      pdf.setFontSize(6)
      pdf.setFont("helvetica", "normal")
      const footerText = "Powered by LipaChap"
      const footerWidth = pdf.getTextWidth(footerText)
      pdf.text(footerText, (pageWidth - footerWidth) / 2, yPos)

      // Download with descriptive filename
      const filename = `${invoiceNumber}-${vendor.businessName.replace(/\s+/g, "-")}-${new Date().toISOString().split("T")[0]}.pdf`
      pdf.save(filename)

      showNotification("PDF downloaded successfully! 📄")
    } catch (error) {
      console.error("Error generating PDF:", error)
      showNotification("Failed to generate PDF. Please try again.", "error")
    } finally {
      setIsGenerating(false)
    }
  }

  // Enhanced share functionality
  const shareInvoice = async () => {
    setIsSharing(true)

    const shareData = {
      title: `Invoice ${invoiceNumber} - ${vendor.businessName}`,
      text: `Invoice from ${vendor.businessName}\nTotal: KES ${finalTotal.toLocaleString()}\nDate: ${invoiceDate}`,
      url: window.location.href,
    }

    try {
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData)
        showNotification("Invoice shared successfully! 📤")
      } else {
        shareViaWhatsApp()
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Error sharing:", error)
        shareViaWhatsApp()
      }
    } finally {
      setIsSharing(false)
    }
  }

  const shareViaWhatsApp = () => {
    const message = `🧾 *INVOICE FROM ${vendor.businessName.toUpperCase()}*

📋 Invoice: ${invoiceNumber}
📅 Date: ${invoiceDate}
👤 Customer: ${orderData.name}

📦 *ITEMS PURCHASED:*
${orderData.items
  .map((item) => `• ${item.name} (Qty: ${item.quantity}) - KES ${item.total.toLocaleString()}`)
  .join("\n")}

💰 *TOTAL: KES ${finalTotal.toLocaleString()}*
✅ Payment Status: PAID via ${orderData.method.toUpperCase()}

📞 Contact: ${vendor.phone}
${vendor.email ? `📧 Email: ${vendor.email}` : ""}

🚀 Powered by LipaChap`

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
    showNotification("Opening WhatsApp to share invoice! 💬")
  }

  const copyInvoiceLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      showNotification("Invoice link copied to clipboard! 📋")
    } catch (error) {
      const textArea = document.createElement("textarea")
      textArea.value = window.location.href
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand("copy")
      document.body.removeChild(textArea)
      showNotification("Invoice link copied to clipboard! 📋")
    }
  }

  const printInvoice = () => {
    window.print()
    showNotification("Print dialog opened! 🖨️")
  }

  return (
    <div className="space-y-6">
      {/* Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-lg border-l-4 ${
            notification.type === "error"
              ? "bg-red-50 border-red-500 text-red-800"
              : "bg-green-50 border-green-500 text-green-800"
          } animate-fadeInUp`}
        >
          <div className="flex items-center">
            {notification.type === "error" ? (
              <AlertCircle className="w-5 h-5 mr-2" />
            ) : (
              <CheckCircle className="w-5 h-5 mr-2" />
            )}
            <span className="font-medium">{notification.message}</span>
          </div>
        </div>
      )}

      {/* Receipt-Style Invoice Display */}
      <div
        ref={invoiceRef}
        className="bg-white rounded-lg shadow-lg border border-gray-200 max-w-sm mx-auto p-6 font-mono text-sm"
        style={{ width: "320px" }} // Approximate 80mm width
      >
        {/* Header */}
        <div className="text-center border-b border-gray-300 pb-4 mb-4">
          <h1 className="text-lg font-bold uppercase">{vendor.businessName}</h1>
          <p className="text-xs text-gray-600">{vendor.phone}</p>
          {vendor.email && <p className="text-xs text-gray-600">{vendor.email}</p>}
        </div>

        {/* Invoice Details */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="font-bold">INVOICE</p>
            <p className="text-xs text-gray-600">{invoiceNumber}</p>
          </div>
          <div className="text-right">
            <p className="text-xs">{invoiceDate}</p>
            <p className="text-xs">{invoiceTime}</p>
          </div>
        </div>

        {/* Customer Info */}
        <div className="mb-4 pb-2 border-b border-gray-200">
          <p className="text-xs">
            <strong>Customer:</strong> {orderData.name}
          </p>
          <p className="text-xs">
            <strong>Phone:</strong> {orderData.phone}
          </p>
        </div>

        {/* Items Table */}
        <div className="mb-4">
          <div className="flex justify-between text-xs font-bold border-b border-gray-300 pb-1 mb-2">
            <span>ITEM</span>
            <span>QTY</span>
            <span>PRICE</span>
            <span>TOTAL</span>
          </div>

          {orderData.items.map((item, index) => (
            <div key={index} className="flex justify-between text-xs mb-1">
              <span className="flex-1 truncate pr-2">{item.name}</span>
              <span className="w-8 text-center">{item.quantity}</span>
              <span className="w-12 text-right">{item.price.toLocaleString()}</span>
              <span className="w-12 text-right">{item.total.toLocaleString()}</span>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="border-t border-gray-300 pt-2 mb-4">
          <div className="flex justify-between text-xs mb-1">
            <span>Subtotal:</span>
            <span>KES {subtotal.toLocaleString()}</span>
          </div>
          {taxAmount > 0 && (
            <div className="flex justify-between text-xs mb-1">
              <span>Tax:</span>
              <span>KES {taxAmount.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-sm border-t border-gray-300 pt-1">
            <span>TOTAL:</span>
            <span>KES {finalTotal.toLocaleString()}</span>
          </div>
        </div>

        {/* Payment Status */}
        <div className="text-center mb-4 p-2 bg-green-50 rounded border border-green-200">
          <p className="text-xs font-bold text-green-800">PAYMENT: {orderData.method.toUpperCase()} - PAID ✓</p>
          <p className="text-xs text-green-600">TXN: {orderData.transactionId}</p>
        </div>

        {/* QR Code */}
        <div className="text-center mb-4">
          <QRCodeSVG value={window.location.href} size={60} level="M" className="mx-auto" />
          <p className="text-xs text-gray-500 mt-1">Scan for digital copy</p>
        </div>

        {/* Footer */}
        <div className="text-center border-t border-gray-300 pt-2">
          <p className="text-xs italic text-gray-600">Thank you for your business!</p>
          <p className="text-xs text-gray-500 mt-1">Powered by LipaChap</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 max-w-2xl mx-auto">
        <button
          onClick={generatePDF}
          disabled={isGenerating}
          className="bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="w-4 h-4 mr-2" />
          {isGenerating ? "Generating..." : "Download PDF"}
        </button>

        <button
          onClick={printInvoice}
          className="bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center shadow-sm"
        >
          <Printer className="w-4 h-4 mr-2" />
          Print
        </button>

        <button
          onClick={shareInvoice}
          disabled={isSharing}
          className="bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center shadow-sm disabled:opacity-50"
        >
          <Share2 className="w-4 h-4 mr-2" />
          {isSharing ? "Sharing..." : "Share"}
        </button>

        <button
          onClick={copyInvoiceLink}
          className="bg-gray-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-700 transition-colors flex items-center justify-center shadow-sm"
        >
          <Copy className="w-4 h-4 mr-2" />
          Copy Link
        </button>
      </div>

      {/* WhatsApp Share Button */}
      <div className="text-center">
        <button
          onClick={shareViaWhatsApp}
          className="bg-green-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center justify-center mx-auto shadow-sm"
        >
          <WhatsApp className="w-5 h-5 mr-2" />
          Share via WhatsApp
        </button>
      </div>

      {/* Invoice Details Summary */}
      <div className="bg-gray-50 rounded-lg p-4 max-w-md mx-auto">
        <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
          <Receipt className="w-4 h-4 mr-2" />
          Invoice Summary
        </h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Invoice ID:</p>
            <p className="font-medium">{invoiceNumber}</p>
          </div>
          <div>
            <p className="text-gray-600">Date:</p>
            <p className="font-medium">{invoiceDate}</p>
          </div>
          <div>
            <p className="text-gray-600">Items:</p>
            <p className="font-medium">{totalProducts} product(s)</p>
          </div>
          <div>
            <p className="text-gray-600">Total:</p>
            <p className="font-medium text-green-600">KES {finalTotal.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Invoice

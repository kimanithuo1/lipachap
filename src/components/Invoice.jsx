"use client"
import { useState, useRef } from "react"
import {
  Download,
  Printer,
  PhoneIcon as WhatsApp,
  Copy,
  Calendar,
  Hash,
  Share2,
  Package,
  Calculator,
  CheckCircle,
  AlertCircle,
} from "lucide-react"
import { QRCodeSVG } from "qrcode.react"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"

const Invoice = ({ orderData, vendor, checkout }) => {
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSharing, setIsSharing] = useState(false)
  const [notification, setNotification] = useState(null)
  const invoiceRef = useRef(null)

  const invoiceNumber = `INV-${orderData.id}`
  const invoiceDate = new Date(orderData.timestamp).toLocaleDateString("en-KE", {
    year: "numeric",
    month: "long",
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

  // Enhanced PDF generation with better error handling
  const generatePDF = async () => {
    if (!invoiceRef.current) {
      showNotification("Invoice element not found", "error")
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
            // Set a timeout to prevent hanging
            setTimeout(reject, 5000)
          })
        }),
      )

      // Create canvas with higher quality settings
      const canvas = await html2canvas(invoiceRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        backgroundColor: "#ffffff",
        logging: false,
        imageTimeout: 10000,
        removeContainer: true,
      })

      // Create PDF with proper sizing
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

  // Enhanced share functionality with Web Share API
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
        // Fallback to WhatsApp
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

🚀 Powered by LipaChap - Professional Invoice Solutions`

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
    showNotification("Opening WhatsApp to share invoice! 💬")
  }

  const copyInvoiceLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      showNotification("Invoice link copied to clipboard! 📋")
    } catch (error) {
      // Fallback for older browsers
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
    // Add print-specific class to body
    document.body.classList.add("printing")

    // Trigger print
    window.print()

    // Remove print class after print dialog
    setTimeout(() => {
      document.body.classList.remove("printing")
    }, 1000)

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

      {/* Enhanced Invoice Display */}
      <div
        ref={invoiceRef}
        className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden invoice-container"
        style={{ minHeight: "800px" }}
      >
        {/* Professional Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center">
              {vendor.logo && (
                <img
                  src={vendor.logo || "/placeholder.svg"}
                  alt={`${vendor.businessName} logo`}
                  className="w-20 h-20 rounded-full object-cover mr-6 border-4 border-white shadow-lg"
                />
              )}
              <div>
                <h1 className="text-3xl font-bold mb-2">{vendor.businessName}</h1>
                <p className="text-purple-100 text-lg">{vendor.ownerName}</p>
                <div className="mt-2 space-y-1">
                  <p className="text-purple-100 flex items-center">📞 {vendor.phone}</p>
                  {vendor.email && <p className="text-purple-100 flex items-center">📧 {vendor.email}</p>}
                </div>
              </div>
            </div>

            <div className="text-right bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="flex items-center mb-3">
                <Hash className="w-6 h-6 mr-2" />
                <span className="text-lg font-semibold">INVOICE</span>
              </div>
              <p className="text-2xl font-bold">{invoiceNumber}</p>
              <div className="mt-3 space-y-1 text-sm text-purple-100">
                <p className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  {invoiceDate}
                </p>
                <p>{invoiceTime}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Invoice Content */}
        <div className="p-8">
          {/* Customer & Payment Info */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center border-b border-gray-200 pb-2">
                👤 BILL TO
              </h3>
              <div className="space-y-2">
                <p className="font-semibold text-gray-900 text-lg">{orderData.name}</p>
                <p className="text-gray-600 flex items-center">📞 {orderData.phone}</p>
                {orderData.email && <p className="text-gray-600 flex items-center">📧 {orderData.email}</p>}
              </div>
            </div>

            <div className="bg-blue-50 rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center border-b border-blue-200 pb-2">
                💳 PAYMENT DETAILS
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Method:</span>
                  <span className="font-semibold text-gray-900 uppercase">{orderData.method}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Transaction ID:</span>
                  <span className="font-mono text-sm text-gray-900">{orderData.transactionId}</span>
                </div>
                {orderData.mpesaPhone && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">M-Pesa Number:</span>
                    <span className="font-semibold text-gray-900">{orderData.mpesaPhone}</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-2 border-t border-blue-200">
                  <span className="text-gray-600">Status:</span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-semibold rounded-full flex items-center">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    PAID
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Items Table */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Package className="w-6 h-6 mr-2 text-purple-600" />
              ITEMS PURCHASED
            </h3>

            <div className="overflow-x-auto bg-gray-50 rounded-xl">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-purple-100 to-pink-100">
                    <th className="border border-gray-200 px-6 py-4 text-left font-bold text-gray-900">
                      Product Details
                    </th>
                    <th className="border border-gray-200 px-6 py-4 text-center font-bold text-gray-900">Quantity</th>
                    <th className="border border-gray-200 px-6 py-4 text-right font-bold text-gray-900">Unit Price</th>
                    <th className="border border-gray-200 px-6 py-4 text-right font-bold text-gray-900">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {orderData.items.map((item, index) => (
                    <tr key={index} className="hover:bg-white transition-colors duration-200">
                      <td className="border border-gray-200 px-6 py-4">
                        <div>
                          <p className="font-semibold text-gray-900 text-lg">{item.name}</p>
                          {item.description && <p className="text-sm text-gray-600 mt-1">{item.description}</p>}
                        </div>
                      </td>
                      <td className="border border-gray-200 px-6 py-4 text-center">
                        <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full font-bold">
                          {item.quantity}
                        </span>
                      </td>
                      <td className="border border-gray-200 px-6 py-4 text-right font-semibold text-gray-900">
                        KES {Number(item.price).toLocaleString()}
                      </td>
                      <td className="border border-gray-200 px-6 py-4 text-right font-bold text-purple-600 text-lg">
                        KES {item.total.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Enhanced Total Section */}
          <div className="flex flex-col lg:flex-row justify-between items-end gap-8 mb-8">
            {/* Summary Stats */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                <div className="flex items-center">
                  <Package className="w-8 h-8 text-blue-600 mr-3" />
                  <div>
                    <p className="text-sm text-blue-600 font-semibold">Total Products</p>
                    <p className="text-2xl font-bold text-blue-900">{totalProducts}</p>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
                <div className="flex items-center">
                  <Calculator className="w-8 h-8 text-purple-600 mr-3" />
                  <div>
                    <p className="text-sm text-purple-600 font-semibold">Product Types</p>
                    <p className="text-2xl font-bold text-purple-900">{orderData.items.length}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Total Amount */}
            <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl p-8 border-2 border-green-200 min-w-[300px]">
              <div className="text-center">
                <p className="text-lg text-green-800 mb-2 font-semibold">TOTAL AMOUNT</p>
                <p className="text-5xl font-bold text-green-900 mb-2">KES {finalTotal.toLocaleString()}</p>
                <div className="space-y-1 text-sm text-green-700">
                  <p>Subtotal: KES {subtotal.toLocaleString()}</p>
                  {taxAmount > 0 && <p>Tax: KES {taxAmount.toLocaleString()}</p>}
                  <p className="font-bold border-t border-green-300 pt-2">✅ Amount Paid in Full</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer with QR Code and Thank You */}
          <div className="flex flex-col lg:flex-row justify-between items-end pt-8 border-t-2 border-gray-200 gap-8">
            <div className="flex-1">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
                <h4 className="font-bold text-purple-900 mb-3 text-lg">🙏 Thank You!</h4>
                <div className="space-y-2 text-purple-800">
                  <p className="font-semibold">Thank you for shopping with {vendor.businessName}</p>
                  <p className="text-sm">We appreciate your business and look forward to serving you again.</p>
                  <div className="mt-4 pt-4 border-t border-purple-200">
                    <p className="text-sm font-semibold">📞 For any queries, contact us:</p>
                    <p className="text-sm">Phone: {vendor.phone}</p>
                    {vendor.email && <p className="text-sm">Email: {vendor.email}</p>}
                  </div>
                </div>
                <p className="text-xs text-purple-600 mt-4 font-semibold">
                  🚀 Powered by LipaChap - Professional Invoice Solutions
                </p>
              </div>
            </div>

            <div className="text-center">
              <div className="bg-white p-4 rounded-xl border-2 border-gray-200 shadow-lg">
                <QRCodeSVG value={window.location.href} size={100} level="M" includeMargin={true} className="mx-auto" />
                <p className="text-xs text-gray-600 mt-3 font-semibold">📱 Scan for Digital Copy</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Action Buttons */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          onClick={generatePDF}
          disabled={isGenerating}
          className="bg-gradient-to-r from-red-500 to-red-600 text-white py-4 px-6 rounded-xl font-bold hover:from-red-600 hover:to-red-700 transition-all duration-300 flex items-center justify-center shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          <Download className="w-5 h-5 mr-2" />
          {isGenerating ? "Generating..." : "Download PDF"}
        </button>

        <button
          onClick={shareInvoice}
          disabled={isSharing}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 px-6 rounded-xl font-bold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center justify-center shadow-lg transform hover:scale-105 disabled:opacity-50"
        >
          <Share2 className="w-5 h-5 mr-2" />
          {isSharing ? "Sharing..." : "Share"}
        </button>

        <button
          onClick={shareViaWhatsApp}
          className="bg-gradient-to-r from-green-500 to-green-600 text-white py-4 px-6 rounded-xl font-bold hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center justify-center shadow-lg transform hover:scale-105"
        >
          <WhatsApp className="w-5 h-5 mr-2" />
          WhatsApp
        </button>

        <button
          onClick={copyInvoiceLink}
          className="bg-gradient-to-r from-gray-500 to-gray-600 text-white py-4 px-6 rounded-xl font-bold hover:from-gray-600 hover:to-gray-700 transition-all duration-300 flex items-center justify-center shadow-lg transform hover:scale-105"
        >
          <Copy className="w-5 h-5 mr-2" />
          Copy Link
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        <button
          onClick={printInvoice}
          className="bg-gradient-to-r from-purple-500 to-purple-600 text-white py-4 px-6 rounded-xl font-bold hover:from-purple-600 hover:to-purple-700 transition-all duration-300 flex items-center justify-center shadow-lg transform hover:scale-105"
        >
          <Printer className="w-5 h-5 mr-2" />
          Print Invoice
        </button>

        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 border border-yellow-200 flex items-center justify-center">
          <div className="text-center">
            <p className="text-sm font-semibold text-yellow-800">Invoice #{invoiceNumber}</p>
            <p className="text-xs text-yellow-600">
              Generated on {invoiceDate} at {invoiceTime}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Invoice

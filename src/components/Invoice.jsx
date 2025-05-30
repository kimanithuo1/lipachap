"use client"
import { useState, useRef } from "react"
import { Download, Printer, PhoneIcon as WhatsApp, Copy, Calendar, Hash } from "lucide-react"
import { QRCodeSVG } from "qrcode.react" // Changed to use named export QRCodeSVG
import html2canvas from "html2canvas"
import jsPDF from "jspdf"

const Invoice = ({ orderData, vendor, checkout }) => {
  const [isGenerating, setIsGenerating] = useState(false)
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

  const generatePDF = async () => {
    if (!invoiceRef.current) return

    setIsGenerating(true)
    try {
      // Create canvas from the invoice element
      const canvas = await html2canvas(invoiceRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
      })

      // Create PDF
      const imgData = canvas.toDataURL("image/png")
      const pdf = new jsPDF("p", "mm", "a4")

      const imgWidth = 210
      const pageHeight = 295
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight

      let position = 0

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      // Download the PDF
      pdf.save(`${invoiceNumber}-${vendor.businessName}.pdf`)
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("Error generating PDF. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const shareViaWhatsApp = () => {
    const message = `Hello! Here's your invoice from ${vendor.businessName}. 

Invoice: ${invoiceNumber}
Total: KES ${orderData.totalAmount.toLocaleString()}
Date: ${invoiceDate}

View invoice: ${window.location.origin}/invoice/${invoiceNumber}

Thank you for your business! 🙏`

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  const copyInvoiceLink = () => {
    const invoiceLink = `${window.location.origin}/invoice/${invoiceNumber}`
    navigator.clipboard.writeText(invoiceLink).then(() => {
      alert("Invoice link copied to clipboard! 📋")
    })
  }

  const printInvoice = () => {
    window.print()
  }

  return (
    <div className="space-y-4">
      {/* Invoice Display */}
      <div
        ref={invoiceRef}
        className="bg-white rounded-2xl p-8 border-2 border-gray-200 shadow-lg print:shadow-none print:border-none invoice-container"
        style={{ minHeight: "600px" }}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-8 pb-6 border-b-2 border-gray-200">
          <div className="flex items-center">
            {vendor.logo && (
              <img
                src={vendor.logo || "/placeholder.svg"}
                alt={vendor.businessName}
                className="w-16 h-16 rounded-full object-cover mr-4 border-2 border-purple-200"
              />
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{vendor.businessName}</h1>
              <p className="text-gray-600">{vendor.ownerName}</p>
              <p className="text-sm text-gray-500">{vendor.phone}</p>
              {vendor.email && <p className="text-sm text-gray-500">{vendor.email}</p>}
            </div>
          </div>

          <div className="text-right">
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-4 border border-purple-200">
              <div className="flex items-center mb-2">
                <Hash className="w-4 h-4 text-purple-600 mr-1" />
                <span className="text-sm font-semibold text-purple-800">INVOICE</span>
              </div>
              <p className="text-lg font-bold text-purple-900">{invoiceNumber}</p>
            </div>
          </div>
        </div>

        {/* Customer & Date Info */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-200 pb-1">BILL TO:</h3>
            <div className="space-y-1">
              <p className="font-semibold text-gray-900">{orderData.name}</p>
              <p className="text-gray-600">{orderData.phone}</p>
              {orderData.email && <p className="text-gray-600">{orderData.email}</p>}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-200 pb-1">INVOICE DETAILS:</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 text-gray-500 mr-2" />
                <span className="text-gray-600">Date: {invoiceDate}</span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-600">Time: {invoiceTime}</span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-600">Payment: {orderData.method.toUpperCase()}</span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-600">Status: </span>
                <span className="ml-1 px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                  PAID
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">ITEMS PURCHASED:</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-900">Item</th>
                  <th className="border border-gray-200 px-4 py-3 text-center font-semibold text-gray-900">Qty</th>
                  <th className="border border-gray-200 px-4 py-3 text-right font-semibold text-gray-900">
                    Unit Price
                  </th>
                  <th className="border border-gray-200 px-4 py-3 text-right font-semibold text-gray-900">Total</th>
                </tr>
              </thead>
              <tbody>
                {orderData.items.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="border border-gray-200 px-4 py-3">
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        {item.description && <p className="text-sm text-gray-500">{item.description}</p>}
                      </div>
                    </td>
                    <td className="border border-gray-200 px-4 py-3 text-center font-medium">{item.quantity}</td>
                    <td className="border border-gray-200 px-4 py-3 text-right font-medium">
                      KES {Number(item.price).toLocaleString()}
                    </td>
                    <td className="border border-gray-200 px-4 py-3 text-right font-bold">
                      KES {item.total.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Total Section */}
        <div className="flex justify-between items-end mb-8">
          <div className="flex-1">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 max-w-xs">
              <h4 className="font-bold text-blue-900 mb-2">Payment Details:</h4>
              <p className="text-sm text-blue-800">Method: {orderData.method.toUpperCase()}</p>
              <p className="text-sm text-blue-800">Transaction ID: {orderData.transactionId}</p>
              {orderData.mpesaPhone && <p className="text-sm text-blue-800">M-Pesa: {orderData.mpesaPhone}</p>}
            </div>
          </div>

          <div className="text-right">
            <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl p-6 border-2 border-green-200 min-w-[250px]">
              <p className="text-lg text-green-800 mb-2">TOTAL AMOUNT</p>
              <p className="text-4xl font-bold text-green-900">KES {orderData.totalAmount.toLocaleString()}</p>
              <p className="text-sm text-green-700 mt-2">Amount Paid in Full</p>
            </div>
          </div>
        </div>

        {/* Footer with QR Code */}
        <div className="flex justify-between items-end pt-6 border-t-2 border-gray-200">
          <div className="flex-1">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h4 className="font-bold text-gray-900 mb-2">Thank You!</h4>
              <p className="text-sm text-gray-600 mb-1">Thank you for shopping with {vendor.businessName}</p>
              <p className="text-xs text-gray-500">For any queries, contact us at {vendor.phone}</p>
              <p className="text-xs text-gray-400 mt-2">Powered by LipaChap - Instant Checkout Solutions</p>
            </div>
          </div>

          <div className="ml-6 text-center">
            <div className="bg-white p-3 rounded-lg border-2 border-gray-200 shadow-sm">
              <QRCodeSVG
                value={`${window.location.origin}/invoice/${invoiceNumber}`}
                size={80}
                level="M"
                includeMargin={false}
              />
              <p className="text-xs text-gray-500 mt-2">Scan for Invoice</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <button
          onClick={generatePDF}
          disabled={isGenerating}
          className="bg-gradient-to-r from-red-500 to-red-600 text-white py-3 px-4 rounded-xl font-bold hover:from-red-600 hover:to-red-700 transition-all duration-300 flex items-center justify-center shadow-lg transform hover:scale-105 disabled:opacity-50"
        >
          <Download className="w-4 h-4 mr-2" />
          {isGenerating ? "Generating..." : "Download PDF"}
        </button>

        <button
          onClick={shareViaWhatsApp}
          className="bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-4 rounded-xl font-bold hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center justify-center shadow-lg transform hover:scale-105"
        >
          <WhatsApp className="w-4 h-4 mr-2" />
          WhatsApp
        </button>

        <button
          onClick={copyInvoiceLink}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-xl font-bold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center justify-center shadow-lg transform hover:scale-105"
        >
          <Copy className="w-4 h-4 mr-2" />
          Copy Link
        </button>

        <button
          onClick={printInvoice}
          className="bg-gradient-to-r from-gray-500 to-gray-600 text-white py-3 px-4 rounded-xl font-bold hover:from-gray-600 hover:to-gray-700 transition-all duration-300 flex items-center justify-center shadow-lg transform hover:scale-105"
        >
          <Printer className="w-4 h-4 mr-2" />
          Print
        </button>
      </div>
    </div>
  )
}

export default Invoice

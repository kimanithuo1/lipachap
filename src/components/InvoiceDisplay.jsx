"use client"
import { useState, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
  Download,
  Printer,
  Edit,
  Share2,
  Calendar,
  Hash,
  User,
  ArrowLeft,
  Check,
  Clock,
  AlertCircle,
} from "lucide-react"
import { QRCodeSVG } from "qrcode.react"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"

const InvoiceDisplay = ({ invoices, vendor }) => {
  const { invoiceId } = useParams()
  const navigate = useNavigate()
  const [isGenerating, setIsGenerating] = useState(false)
  const invoiceRef = useRef(null)

  const invoice = invoices[invoiceId]

  if (!invoice) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md w-full">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Invoice Not Found</h2>
          <p className="text-gray-600 mb-6">The invoice you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  const generatePDF = async () => {
    if (!invoiceRef.current) return

    setIsGenerating(true)
    try {
      const canvas = await html2canvas(invoiceRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        width: invoiceRef.current.scrollWidth,
        height: invoiceRef.current.scrollHeight,
      })

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

      pdf.save(`${invoice.invoiceNumber}-${vendor?.businessName || "Invoice"}.pdf`)
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("Error generating PDF. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const printInvoice = () => {
    window.print()
  }

  const shareInvoice = async () => {
    const shareData = {
      title: `Invoice ${invoice.invoiceNumber}`,
      text: `Invoice from ${vendor?.businessName || "Business"} - Total: KES ${invoice.total.toLocaleString()}`,
      url: window.location.href,
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (error) {
        console.log("Error sharing:", error)
        // Fallback to copying URL
        navigator.clipboard.writeText(window.location.href)
        alert("Invoice link copied to clipboard!")
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert("Invoice link copied to clipboard!")
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800 border-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "overdue":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "paid":
        return <Check className="w-4 h-4" />
      case "pending":
        return <Clock className="w-4 h-4" />
      case "overdue":
        return <AlertCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - No Print */}
      <div className="bg-white border-b border-gray-200 print:hidden">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => navigate(-1)}
                className="mr-4 p-2 text-gray-600 hover:text-gray-900 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all duration-200"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Invoice {invoice.invoiceNumber}</h1>
                <div className="flex items-center mt-1">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(invoice.status)}`}
                  >
                    {getStatusIcon(invoice.status)}
                    <span className="ml-1 capitalize">{invoice.status || "draft"}</span>
                  </span>
                  <span className="ml-3 text-sm text-gray-500">
                    Created {new Date(invoice.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate(`/invoice/${invoiceId}/edit`)}
                className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-200"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </button>
              <button
                onClick={shareInvoice}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </button>
              <button
                onClick={printInvoice}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200"
              >
                <Printer className="w-4 h-4 mr-2" />
                Print
              </button>
              <button
                onClick={generatePDF}
                disabled={isGenerating}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 disabled:opacity-50"
              >
                <Download className="w-4 h-4 mr-2" />
                {isGenerating ? "Generating..." : "Download PDF"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Content */}
      <div className="max-w-4xl mx-auto p-6 print:p-0 print:max-w-none">
        <div
          ref={invoiceRef}
          className="bg-white rounded-xl shadow-lg border border-gray-200 p-12 print:shadow-none print:border-none print:rounded-none"
          style={{ minHeight: "297mm" }} // A4 height
        >
          {/* Invoice Header */}
          <div className="flex items-start justify-between mb-12 pb-8 border-b-2 border-gray-200">
            <div className="flex items-center">
              {vendor?.logo && (
                <img
                  src={vendor.logo || "/placeholder.svg"}
                  alt={vendor.businessName}
                  className="w-20 h-20 rounded-lg object-cover mr-6 border-2 border-gray-200"
                />
              )}
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{vendor?.businessName || "Your Business"}</h1>
                <p className="text-lg text-gray-600 mt-1">{vendor?.ownerName || "Owner Name"}</p>
                <p className="text-gray-500 mt-1">{vendor?.phone || "Phone Number"}</p>
                {vendor?.email && <p className="text-gray-500">{vendor.email}</p>}
              </div>
            </div>

            <div className="text-right">
              <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
                <div className="flex items-center justify-center mb-3">
                  <Hash className="w-6 h-6 text-blue-600 mr-2" />
                  <span className="text-lg font-bold text-blue-800">INVOICE</span>
                </div>
                <p className="text-2xl font-bold text-blue-900">{invoice.invoiceNumber}</p>
              </div>
            </div>
          </div>

          {/* Client & Date Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2 flex items-center">
                <User className="w-5 h-5 mr-2" />
                BILL TO:
              </h3>
              <div className="space-y-2">
                <p className="text-lg font-semibold text-gray-900">{invoice.clientName}</p>
                <p className="text-gray-600">{invoice.clientPhone}</p>
                {invoice.clientEmail && <p className="text-gray-600">{invoice.clientEmail}</p>}
                {invoice.clientAddress && <p className="text-gray-600">{invoice.clientAddress}</p>}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2 flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                INVOICE DETAILS:
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 font-medium">Invoice Date:</span>
                  <span className="font-semibold">{new Date(invoice.date).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 font-medium">Due Date:</span>
                  <span className="font-semibold">{new Date(invoice.dueDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 font-medium">Status:</span>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(invoice.status)}`}
                  >
                    {getStatusIcon(invoice.status)}
                    <span className="ml-1 capitalize">{invoice.status || "draft"}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-12">
            <h3 className="text-lg font-bold text-gray-900 mb-6 border-b-2 border-gray-200 pb-2">ITEMS:</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border-2 border-gray-200 px-6 py-4 text-left font-bold text-gray-900">
                      Description
                    </th>
                    <th className="border-2 border-gray-200 px-6 py-4 text-center font-bold text-gray-900">Quantity</th>
                    <th className="border-2 border-gray-200 px-6 py-4 text-right font-bold text-gray-900">
                      Rate (KES)
                    </th>
                    <th className="border-2 border-gray-200 px-6 py-4 text-right font-bold text-gray-900">
                      Total (KES)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="border border-gray-200 px-6 py-4">
                        <p className="font-medium text-gray-900">{item.description}</p>
                      </td>
                      <td className="border border-gray-200 px-6 py-4 text-center font-medium">{item.quantity}</td>
                      <td className="border border-gray-200 px-6 py-4 text-right font-medium">
                        {item.rate.toLocaleString()}
                      </td>
                      <td className="border border-gray-200 px-6 py-4 text-right font-bold">
                        {(item.quantity * item.rate).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals */}
          <div className="flex justify-end mb-12">
            <div className="w-full max-w-md">
              <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
                <div className="space-y-3">
                  <div className="flex justify-between text-lg">
                    <span className="text-gray-600 font-medium">Subtotal:</span>
                    <span className="font-semibold">KES {invoice.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-lg">
                    <span className="text-gray-600 font-medium">VAT ({invoice.taxRate}%):</span>
                    <span className="font-semibold">KES {invoice.taxAmount.toLocaleString()}</span>
                  </div>
                  <div className="border-t-2 border-gray-300 pt-3">
                    <div className="flex justify-between text-2xl font-bold text-gray-900">
                      <span>TOTAL:</span>
                      <span>KES {invoice.total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          {invoice.notes && (
            <div className="mb-12 p-6 bg-gray-50 rounded-xl border-2 border-gray-200">
              <h4 className="font-bold text-gray-900 mb-3 text-lg">Notes:</h4>
              <p className="text-gray-700 leading-relaxed">{invoice.notes}</p>
            </div>
          )}

          {/* Footer */}
          <div className="flex justify-between items-end pt-8 border-t-2 border-gray-200">
            <div className="flex-1">
              <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200 max-w-md">
                <h4 className="font-bold text-blue-900 mb-3 text-lg">Thank You!</h4>
                <p className="text-blue-800 mb-2">Thank you for your business with {vendor?.businessName || "us"}.</p>
                <p className="text-sm text-blue-700">
                  For any queries, please contact us at {vendor?.phone || "our phone number"}.
                </p>
                <p className="text-xs text-blue-600 mt-3">Powered by LipaChap - Professional Invoice Solutions</p>
              </div>
            </div>

            <div className="ml-8 text-center print:hidden">
              <div className="bg-white p-4 rounded-xl border-2 border-gray-200 shadow-sm">
                <QRCodeSVG value={window.location.href} size={100} level="M" includeMargin={false} />
                <p className="text-xs text-gray-500 mt-2 font-medium">Scan for Invoice</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InvoiceDisplay

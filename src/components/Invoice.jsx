"use client"
import { Download, FileText } from "lucide-react"

const Invoice = ({ orderData, vendor, checkout }) => {
  const generateInvoiceText = () => {
    const invoiceDate = new Date(orderData.timestamp).toLocaleDateString()
    const invoiceNumber = `INV-${orderData.id}`

    return `
INVOICE

Invoice #: ${invoiceNumber}
Date: ${invoiceDate}

FROM:
${vendor.businessName}
${vendor.ownerName}
Phone: ${vendor.phone}
${vendor.email ? `Email: ${vendor.email}` : ""}

TO:
${orderData.name}
Phone: ${orderData.phone}
${orderData.email ? `Email: ${orderData.email}` : ""}

ITEMS:
${checkout.productName} x ${orderData.quantity}
Unit Price: KSH ${checkout.price.toLocaleString()}
Total: KSH ${orderData.totalAmount.toLocaleString()}

PAYMENT:
Method: ${orderData.method.toUpperCase()}
Transaction ID: ${orderData.transactionId}
Status: PAID

Thank you for your business!
    `.trim()
  }

  const downloadInvoice = () => {
    const invoiceText = generateInvoiceText()
    const blob = new Blob([invoiceText], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `invoice-${orderData.id}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const shareInvoice = () => {
    const invoiceText = generateInvoiceText()

    if (navigator.share) {
      navigator.share({
        title: `Invoice - ${checkout.productName}`,
        text: invoiceText,
      })
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(invoiceText).then(() => {
        alert("Invoice copied to clipboard!")
      })
    }
  }

  return (
    <div className="space-y-3">
      <button
        onClick={downloadInvoice}
        className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center"
      >
        <Download className="w-4 h-4 mr-2" />
        Download Invoice
      </button>

      <button
        onClick={shareInvoice}
        className="w-full bg-blue-100 text-blue-700 py-2 px-4 rounded-lg font-medium hover:bg-blue-200 transition-colors flex items-center justify-center"
      >
        <FileText className="w-4 h-4 mr-2" />
        Share Invoice
      </button>
    </div>
  )
}

export default Invoice

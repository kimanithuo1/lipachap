"use client"
import { Download, Share2 } from "lucide-react"

const Invoice = ({ orderData, vendor, checkout }) => {
  const generateInvoiceText = () => {
    const invoiceDate = new Date(orderData.timestamp).toLocaleDateString()
    const invoiceNumber = `INV-${orderData.id}`

    let itemsText = ""
    orderData.items.forEach((item) => {
      itemsText += `${item.name} x ${item.quantity} @ KSH ${item.price.toLocaleString()} = KSH ${item.total.toLocaleString()}\n`
    })

    return `
🧾 INVOICE

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
${itemsText}
TOTAL: KSH ${orderData.totalAmount.toLocaleString()}

PAYMENT:
Method: ${orderData.method.toUpperCase()}
Transaction ID: ${orderData.transactionId}
Status: ✅ PAID

Thank you for your business! 🙏
Powered by LipaChap ⚡
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
        title: `Invoice - ${checkout.title}`,
        text: invoiceText,
      })
    } else {
      navigator.clipboard.writeText(invoiceText).then(() => {
        alert("Invoice copied to clipboard! 📋")
      })
    }
  }

  return (
    <div className="space-y-3">
      <button
        onClick={downloadInvoice}
        className="w-full bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 py-3 px-4 rounded-xl font-bold hover:from-gray-200 hover:to-gray-300 transition-all duration-300 flex items-center justify-center shadow-lg transform hover:scale-105"
      >
        <Download className="w-5 h-5 mr-2" />
        Download Invoice
      </button>

      <button
        onClick={shareInvoice}
        className="w-full bg-gradient-to-r from-blue-100 to-purple-200 text-blue-700 py-3 px-4 rounded-xl font-bold hover:from-blue-200 hover:to-purple-300 transition-all duration-300 flex items-center justify-center shadow-lg transform hover:scale-105"
      >
        <Share2 className="w-5 h-5 mr-2" />
        Share Invoice
      </button>
    </div>
  )
}

export default Invoice

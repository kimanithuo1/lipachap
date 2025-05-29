"use client"
import { X, Download, Share } from "lucide-react"

const QRGenerator = ({ checkout, onClose }) => {
  // Simple QR code generation using a service (in production, use a proper QR library)
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(checkout.url)}`

  const downloadQR = () => {
    const link = document.createElement("a")
    link.href = qrCodeUrl
    link.download = `qr-${checkout.productName.replace(/\s+/g, "-").toLowerCase()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const shareQR = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${checkout.productName} - Checkout`,
          text: `Check out ${checkout.productName} for KSH ${checkout.price}`,
          url: checkout.url,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      // Fallback: copy URL to clipboard
      navigator.clipboard.writeText(checkout.url)
      alert("Checkout URL copied to clipboard!")
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">QR Code</h3>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="text-center mb-6">
          <img
            src={qrCodeUrl || "/placeholder.svg"}
            alt="QR Code"
            className="w-64 h-64 mx-auto border border-gray-200 rounded-lg"
          />
          <p className="text-sm text-gray-600 mt-3">Scan to open checkout for {checkout.productName}</p>
        </div>

        <div className="space-y-3">
          <button
            onClick={downloadQR}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
          >
            <Download className="w-4 h-4 mr-2" />
            Download QR Code
          </button>

          <button
            onClick={shareQR}
            className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center"
          >
            <Share className="w-4 h-4 mr-2" />
            Share Checkout
          </button>
        </div>
      </div>
    </div>
  )
}

export default QRGenerator

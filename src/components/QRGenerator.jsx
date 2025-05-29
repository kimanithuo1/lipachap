"use client"
import { X, Download, Share, Sparkles } from "lucide-react"

const QRGenerator = ({ checkout, onClose }) => {
  // Simple QR code generation using a service (in production, use a proper QR library)
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(checkout.url)}`

  const downloadQR = () => {
    const link = document.createElement("a")
    link.href = qrCodeUrl
    link.download = `qr-${checkout.title.replace(/\s+/g, "-").toLowerCase()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const shareQR = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${checkout.title} - Checkout`,
          text: `Check out ${checkout.title} - Multiple products available!`,
          url: checkout.url,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      // Fallback: copy URL to clipboard
      navigator.clipboard.writeText(checkout.url)
      alert("Checkout URL copied to clipboard! 📋")
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 max-w-sm w-full border border-white/20">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            QR Code
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 transition-all duration-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="text-center mb-6">
          <div className="bg-white rounded-2xl p-4 shadow-lg border-2 border-purple-100 mb-4">
            <img src={qrCodeUrl || "/placeholder.svg"} alt="QR Code" className="w-64 h-64 mx-auto" />
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
            <Sparkles className="w-4 h-4 text-yellow-500" />
            <span>Scan to open {checkout.title}</span>
            <Sparkles className="w-4 h-4 text-yellow-500" />
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={downloadQR}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-xl font-bold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 flex items-center justify-center shadow-lg transform hover:scale-105"
          >
            <Download className="w-5 h-5 mr-2" />
            Download QR Code
          </button>

          <button
            onClick={shareQR}
            className="w-full bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 py-3 px-4 rounded-xl font-bold hover:from-gray-200 hover:to-gray-300 transition-all duration-300 flex items-center justify-center shadow-lg transform hover:scale-105"
          >
            <Share className="w-5 h-5 mr-2" />
            Share Checkout
          </button>
        </div>
      </div>
    </div>
  )
}

export default QRGenerator

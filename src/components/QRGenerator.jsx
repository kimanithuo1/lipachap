"use client"
import { X, Download, Sparkles, Copy, PhoneIcon as WhatsApp } from "lucide-react"
import { QRCodeSVG } from "qrcode.react" // Changed to use named export QRCodeSVG

const QRGenerator = ({ checkout, onClose }) => {
  const downloadQR = async () => {
    try {
      // Create a canvas element to draw the QR code
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")

      // Set canvas size
      canvas.width = 400
      canvas.height = 500

      // Fill white background
      ctx.fillStyle = "#ffffff"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Use QR server API for simplicity
      const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(checkout.url)}`

      // Load QR code image
      const qrImage = new Image()
      qrImage.crossOrigin = "anonymous"
      qrImage.onload = () => {
        // Draw QR code on canvas
        ctx.drawImage(qrImage, 50, 50, 300, 300)

        // Add title
        ctx.fillStyle = "#1f2937"
        ctx.font = "bold 24px Arial"
        ctx.textAlign = "center"
        ctx.fillText(checkout.title, canvas.width / 2, 30)

        // Add instructions
        ctx.font = "16px Arial"
        ctx.fillStyle = "#6b7280"
        ctx.fillText("Scan to view products and make payment", canvas.width / 2, 380)

        // Add URL
        ctx.font = "12px Arial"
        ctx.fillStyle = "#9ca3af"
        const shortUrl = checkout.url.length > 50 ? checkout.url.substring(0, 47) + "..." : checkout.url
        ctx.fillText(shortUrl, canvas.width / 2, 420)

        // Add branding
        ctx.font = "bold 14px Arial"
        ctx.fillStyle = "#8b5cf6"
        ctx.fillText("Powered by LipaChap", canvas.width / 2, 460)

        // Download the image
        const link = document.createElement("a")
        link.download = `${checkout.title.replace(/\s+/g, "-").toLowerCase()}-qr-code.png`
        link.href = canvas.toDataURL()
        link.click()
      }

      qrImage.src = qrImageUrl
    } catch (error) {
      console.error("Error generating QR code:", error)
      // Fallback to simple download
      const link = document.createElement("a")
      link.href = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(checkout.url)}`
      link.download = `${checkout.title.replace(/\s+/g, "-").toLowerCase()}-qr-code.png`
      link.click()
    }
  }

  const shareQR = async () => {
    const message = `🛍️ Check out my products at ${checkout.title}!

📱 Scan the QR code or visit: ${checkout.url}

💳 Multiple payment options available:
${checkout.paymentMethods.mpesa ? "✅ M-Pesa" : ""}
${checkout.paymentMethods.stripe ? "✅ Credit/Debit Cards" : ""}
${checkout.paymentMethods.paypal ? "✅ PayPal" : ""}

🚀 Powered by LipaChap - Instant Checkout Solutions`

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${checkout.title} - Product Catalog`,
          text: message,
          url: checkout.url,
        })
      } catch (error) {
        console.log("Error sharing:", error)
        shareViaWhatsApp(message)
      }
    } else {
      shareViaWhatsApp(message)
    }
  }

  const shareViaWhatsApp = (message) => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  const copyUrl = () => {
    navigator.clipboard.writeText(checkout.url).then(() => {
      alert("Checkout URL copied to clipboard! 📋")
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 max-w-md w-full border border-white/20">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            QR Code Generator
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 transition-all duration-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Checkout Info */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4 mb-6 border border-purple-200">
          <h4 className="font-bold text-gray-900 mb-2">{checkout.title}</h4>
          {checkout.description && <p className="text-sm text-gray-600 mb-2">{checkout.description}</p>}
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Products: {checkout.items?.length || 0}</span>
            <span className="text-purple-600 font-semibold">
              From KES {Math.min(...checkout.items.map((item) => Number(item.price))).toLocaleString()}
            </span>
          </div>
        </div>

        <div className="text-center mb-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-purple-100 mb-4">
            <QRCodeSVG value={checkout.url} size={200} level="M" includeMargin={true} className="mx-auto" />
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
            <Sparkles className="w-4 h-4 text-yellow-500" />
            <span>Scan to view {checkout.title}</span>
            <Sparkles className="w-4 h-4 text-yellow-500" />
          </div>
          <p className="text-xs text-gray-500 mt-2">Customers can scan this code to access your products</p>
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
            className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-4 rounded-xl font-bold hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center justify-center shadow-lg transform hover:scale-105"
          >
            <WhatsApp className="w-5 h-5 mr-2" />
            Share via WhatsApp
          </button>

          <button
            onClick={copyUrl}
            className="w-full bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 py-3 px-4 rounded-xl font-bold hover:from-gray-200 hover:to-gray-300 transition-all duration-300 flex items-center justify-center shadow-lg transform hover:scale-105"
          >
            <Copy className="w-5 h-5 mr-2" />
            Copy Checkout URL
          </button>
        </div>

        {/* Quick Stats */}
        <div className="mt-6 bg-gray-50 rounded-xl p-4">
          <h5 className="font-bold text-gray-800 mb-2">Quick Stats:</h5>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Total Products:</p>
              <p className="font-bold text-gray-900">{checkout.items?.length || 0}</p>
            </div>
            <div>
              <p className="text-gray-600">Price Range:</p>
              <p className="font-bold text-gray-900">
                KES {Math.min(...checkout.items.map((item) => Number(item.price))).toLocaleString()} - KES{" "}
                {Math.max(...checkout.items.map((item) => Number(item.price))).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QRGenerator

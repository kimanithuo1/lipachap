"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
  Shield,
  CheckCircle,
  AlertCircle,
  Plus,
  Minus,
  Calculator,
  ArrowLeft,
  Download,
  Printer,
  Share2,
  Package,
  Calendar,
  Hash,
} from "lucide-react"
import { QRCodeSVG } from "qrcode.react"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"
import PaymentOptions from "./PaymentOptions"
import Invoice from "./Invoice"

const CheckoutPage = ({ vendors, checkouts, onAddOrder }) => {
  const { vendorId, checkoutId } = useParams()
  const navigate = useNavigate()
  const invoiceRef = useRef(null)
  const [customerData, setCustomerData] = useState({
    name: "",
    phone: "",
    email: "",
  })
  const [cart, setCart] = useState({})
  const [paymentStep, setPaymentStep] = useState("details") // details, payment, success
  const [orderData, setOrderData] = useState(null)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)

  const vendor = vendors[vendorId]
  const checkout = checkouts[checkoutId]

  useEffect(() => {
    if (!vendor || !checkout) {
      console.error("Invalid checkout URL")
    }
  }, [vendor, checkout])

  if (!vendor || !checkout) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md w-full border border-gray-200">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Checkout Not Found</h2>
          <p className="text-gray-600 mb-6">This checkout link is invalid or has expired.</p>
          <button
            onClick={() => navigate("/")}
            className="bg-red-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    )
  }

  const updateCartQuantity = (itemId, quantity) => {
    setCart((prev) => ({
      ...prev,
      [itemId]: Math.max(0, quantity),
    }))
  }

  const getTotalAmount = () => {
    return checkout.items.reduce((total, item) => {
      const quantity = cart[item.id] || 0
      return total + Number(item.price) * quantity
    }, 0)
  }

  const getCartItems = () => {
    return checkout.items
      .filter((item) => cart[item.id] > 0)
      .map((item) => ({
        ...item,
        quantity: cart[item.id],
        total: Number(item.price) * cart[item.id],
      }))
  }

  const getTotalItems = () => {
    return Object.values(cart).reduce((sum, quantity) => sum + quantity, 0)
  }

  const handleCustomerSubmit = (e) => {
    e.preventDefault()
    if (getTotalAmount() === 0) {
      alert("Please select at least one item!")
      return
    }
    setPaymentStep("payment")
  }

  const handlePaymentSuccess = (paymentData) => {
    const order = {
      ...customerData,
      ...paymentData,
      checkoutId,
      vendorId,
      items: getCartItems(),
      totalAmount: getTotalAmount(),
      status: "completed",
      orderNumber: `ORD-${Date.now()}`,
      orderDate: new Date().toISOString(),
    }

    setOrderData(order)
    onAddOrder(checkoutId, order)
    setPaymentStep("success")
  }

  const generatePDF = async () => {
    if (!invoiceRef.current) return

    setIsGeneratingPDF(true)
    try {
      const canvas = await html2canvas(invoiceRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
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

      pdf.save(`${checkout.title.replace(/\s+/g, "-").toLowerCase()}-invoice.pdf`)
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("Error generating PDF. Please try again.")
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  const printInvoice = () => {
    window.print()
  }

  const shareInvoice = async () => {
    const shareData = {
      title: `${checkout.title} - ${vendor.businessName}`,
      text: `Invoice from ${vendor.businessName} - Total: KES ${getTotalAmount().toLocaleString()}`,
      url: window.location.href,
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (error) {
        console.log("Error sharing:", error)
        navigator.clipboard.writeText(window.location.href)
        alert("Link copied to clipboard!")
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert("Link copied to clipboard!")
    }
  }

  if (paymentStep === "success") {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8">
            <div className="text-center mb-8">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
              <p className="text-gray-600">Thank you for your purchase. Your order has been confirmed.</p>
            </div>

            <Invoice orderData={orderData} vendor={vendor} checkout={checkout} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto p-4">
        {/* Invoice Header */}
        <div
          ref={invoiceRef}
          className="bg-white rounded-lg shadow-lg border border-gray-200 p-8 mb-6 print:shadow-none print:border-none"
        >
          {/* Header Section */}
          <div className="flex items-start justify-between mb-8 pb-6 border-b-2 border-gray-200">
            <div className="flex items-center">
              {vendor.logo ? (
                <img
                  src={vendor.logo || "/placeholder.svg"}
                  alt={vendor.businessName}
                  className="w-16 h-16 rounded-lg object-cover border-2 border-gray-200 mr-4"
                />
              ) : (
                <div className="w-16 h-16 rounded-lg bg-blue-600 flex items-center justify-center mr-4">
                  <span className="text-white font-bold text-xl">{vendor.businessName.charAt(0)}</span>
                </div>
              )}
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{vendor.businessName}</h1>
                <p className="text-gray-600 font-medium">{vendor.ownerName}</p>
                <p className="text-sm text-gray-500">{vendor.phone}</p>
                {vendor.email && <p className="text-sm text-gray-500">{vendor.email}</p>}
              </div>
            </div>

            <div className="text-right">
              <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
                <div className="flex items-center mb-2">
                  <Hash className="w-4 h-4 text-blue-600 mr-1" />
                  <span className="text-sm font-bold text-blue-800">INVOICE</span>
                </div>
                <p className="text-lg font-bold text-blue-900">{checkout.title}</p>
                <div className="flex items-center mt-2 text-xs text-gray-500">
                  <Calendar className="w-3 h-3 mr-1" />
                  {new Date().toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>

          {/* Product Summary */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <Package className="w-5 h-5 mr-2 text-blue-600" />
              Products ({checkout.items?.length || 0} items)
            </h3>

            <div className="space-y-4">
              {checkout.items.map((item) => (
                <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start space-x-4">
                    {item.image ? (
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                        <Package className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900">{item.name}</h4>
                      <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                      <p className="text-lg font-bold text-blue-600">KES {Number(item.price).toLocaleString()}</p>
                    </div>
                  </div>

                  {paymentStep === "details" && (
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                      <span className="text-sm font-medium text-gray-700">Quantity:</span>
                      <div className="flex items-center space-x-3">
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.id, (cart[item.id] || 0) - 1)}
                          className="w-8 h-8 bg-red-50 text-red-600 rounded-full flex items-center justify-center hover:bg-red-100 transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-bold text-gray-800">{cart[item.id] || 0}</span>
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.id, (cart[item.id] || 0) + 1)}
                          className="w-8 h-8 bg-green-50 text-green-600 rounded-full flex items-center justify-center hover:bg-green-100 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {cart[item.id] > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          {cart[item.id]} × KES {Number(item.price).toLocaleString()}
                        </span>
                        <span className="font-bold text-blue-600">
                          KES {(Number(item.price) * cart[item.id]).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Total Section */}
          {getTotalAmount() > 0 && (
            <div className="mb-8">
              <div className="bg-gray-50 rounded-lg p-6 border-2 border-gray-200">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Calculator className="w-6 h-6 text-gray-600 mr-3" />
                    <div>
                      <p className="text-lg font-bold text-gray-900">Total Amount</p>
                      <p className="text-sm text-gray-600">{getTotalItems()} item(s) selected</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-blue-600">KES {getTotalAmount().toLocaleString()}</p>
                    <p className="text-sm text-gray-500">Inclusive of all charges</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* QR Code Section */}
          <div className="flex justify-between items-end pt-6 border-t-2 border-gray-200">
            <div className="flex-1">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 max-w-md">
                <h4 className="font-bold text-blue-900 mb-2">Thank You!</h4>
                <p className="text-blue-800 text-sm mb-1">
                  Thank you for choosing {vendor.businessName}. We appreciate your business.
                </p>
                <p className="text-xs text-blue-600">For inquiries, contact us at {vendor.phone}</p>
                <p className="text-xs text-blue-500 mt-2">Powered by LipaChap - Instant Checkout Solutions</p>
              </div>
            </div>

            <div className="ml-6 text-center print:hidden">
              <div className="bg-white p-3 rounded-lg border-2 border-gray-200">
                <QRCodeSVG value={window.location.href} size={80} level="M" includeMargin={false} />
                <p className="text-xs text-gray-500 mt-2 font-medium">Scan to Share</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 mb-6 print:hidden">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button
              onClick={generatePDF}
              disabled={isGeneratingPDF}
              className="flex items-center justify-center px-4 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              <Download className="w-4 h-4 mr-2" />
              {isGeneratingPDF ? "Generating..." : "Download PDF"}
            </button>

            <button
              onClick={printInvoice}
              className="flex items-center justify-center px-4 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors"
            >
              <Printer className="w-4 h-4 mr-2" />
              Print
            </button>

            <button
              onClick={shareInvoice}
              className="flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </button>

            <button
              onClick={() => navigate(`/dashboard/${vendorId}`)}
              className="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Dashboard
            </button>
          </div>
        </div>

        {/* Customer Details Form */}
        {paymentStep === "details" && (
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 print:hidden">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Customer Information</h3>

            <form onSubmit={handleCustomerSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  required
                  value={customerData.name}
                  onChange={(e) => setCustomerData((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={customerData.phone}
                  onChange={(e) => setCustomerData((prev) => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="+254 700 000 000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email (Optional)</label>
                <input
                  type="email"
                  value={customerData.email}
                  onChange={(e) => setCustomerData((prev) => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="your@email.com"
                />
              </div>

              <div className="flex items-center text-sm text-gray-500 mb-4">
                <Shield className="w-4 h-4 mr-1 text-green-500" />
                Your information is secure and protected
              </div>

              <button
                type="submit"
                disabled={getTotalAmount() === 0}
                className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-lg"
              >
                {getTotalAmount() > 0
                  ? `Proceed to Pay KES ${getTotalAmount().toLocaleString()}`
                  : "Select items to continue"}
              </button>
            </form>
          </div>
        )}

        {paymentStep === "payment" && (
          <PaymentOptions
            checkout={checkout}
            customerData={customerData}
            cartItems={getCartItems()}
            totalAmount={getTotalAmount()}
            onPaymentSuccess={handlePaymentSuccess}
            onBack={() => setPaymentStep("details")}
          />
        )}
      </div>
    </div>
  )
}

export default CheckoutPage

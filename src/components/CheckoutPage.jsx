"use client"

import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { Shield, Phone, Mail, CheckCircle, AlertCircle } from "lucide-react"
import PaymentOptions from "./PaymentOptions"
import Invoice from "./Invoice"

const CheckoutPage = ({ vendors, checkouts, onAddOrder }) => {
  const { vendorId, checkoutId } = useParams()
  const [customerData, setCustomerData] = useState({
    name: "",
    phone: "",
    email: "",
    quantity: 1,
  })
  const [paymentStep, setPaymentStep] = useState("details") // details, payment, success
  const [selectedPayment, setSelectedPayment] = useState("")
  const [orderData, setOrderData] = useState(null)

  const vendor = vendors[vendorId]
  const checkout = checkouts[checkoutId]

  useEffect(() => {
    if (!vendor || !checkout) {
      // Handle invalid checkout URL
      console.error("Invalid checkout URL")
    }
  }, [vendor, checkout])

  if (!vendor || !checkout) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md w-full">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Checkout Not Found</h2>
          <p className="text-gray-600">This checkout link is invalid or has expired.</p>
        </div>
      </div>
    )
  }

  const totalAmount = checkout.price * customerData.quantity

  const handleCustomerSubmit = (e) => {
    e.preventDefault()
    setPaymentStep("payment")
  }

  const handlePaymentSuccess = (paymentData) => {
    const order = {
      ...customerData,
      ...paymentData,
      checkoutId,
      vendorId,
      productName: checkout.productName,
      unitPrice: checkout.price,
      quantity: customerData.quantity,
      totalAmount,
      status: "completed",
    }

    setOrderData(order)
    onAddOrder(checkoutId, order)
    setPaymentStep("success")
  }

  if (paymentStep === "success") {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-md mx-auto pt-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Payment Successful!</h2>
            <p className="text-gray-600 mb-6">Thank you for your purchase. Your order has been confirmed.</p>

            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-medium text-gray-900 mb-2">Order Summary</h3>
              <p className="text-sm text-gray-600">Product: {checkout.productName}</p>
              <p className="text-sm text-gray-600">Quantity: {customerData.quantity}</p>
              <p className="text-sm text-gray-600">Total: KSH {totalAmount.toLocaleString()}</p>
            </div>

            <Invoice orderData={orderData} vendor={vendor} checkout={checkout} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto">
        {/* Vendor Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-4">
          <div className="flex items-center mb-4">
            {vendor.logo && (
              <img
                src={vendor.logo || "/placeholder.svg"}
                alt={vendor.businessName}
                className="w-12 h-12 rounded-full object-cover mr-3"
              />
            )}
            <div>
              <h1 className="text-lg font-semibold text-gray-900">{vendor.businessName}</h1>
              <p className="text-sm text-gray-600">{vendor.ownerName}</p>
            </div>
          </div>

          <div className="flex items-center text-sm text-gray-600 space-x-4">
            <div className="flex items-center">
              <Phone className="w-4 h-4 mr-1" />
              {vendor.phone}
            </div>
            {vendor.email && (
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-1" />
                {vendor.email}
              </div>
            )}
          </div>
        </div>

        {/* Product Details */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-4">
          {checkout.image && (
            <img
              src={checkout.image || "/placeholder.svg"}
              alt={checkout.productName}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
          )}

          <h2 className="text-xl font-semibold text-gray-900 mb-2">{checkout.productName}</h2>
          {checkout.description && <p className="text-gray-600 mb-4">{checkout.description}</p>}

          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-blue-600">KSH {checkout.price.toLocaleString()}</span>
            <div className="flex items-center text-sm text-gray-500">
              <Shield className="w-4 h-4 mr-1" />
              Secure Checkout
            </div>
          </div>
        </div>

        {paymentStep === "details" && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Details</h3>

            <form onSubmit={handleCustomerSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  required
                  value={customerData.name}
                  onChange={(e) => setCustomerData((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+254 700 000 000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email (Optional)</label>
                <input
                  type="email"
                  value={customerData.email}
                  onChange={(e) => setCustomerData((prev) => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                <select
                  value={customerData.quantity}
                  onChange={(e) => setCustomerData((prev) => ({ ...prev, quantity: Number.parseInt(e.target.value) }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-900">Total Amount:</span>
                  <span className="text-xl font-bold text-blue-600">KSH {totalAmount.toLocaleString()}</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Continue to Payment
              </button>
            </form>
          </div>
        )}

        {paymentStep === "payment" && (
          <PaymentOptions
            checkout={checkout}
            customerData={customerData}
            totalAmount={totalAmount}
            onPaymentSuccess={handlePaymentSuccess}
            onBack={() => setPaymentStep("details")}
          />
        )}
      </div>
    </div>
  )
}

export default CheckoutPage

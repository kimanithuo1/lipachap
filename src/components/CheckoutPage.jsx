"use client"

import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { Shield, Phone, Mail, CheckCircle, AlertCircle, ShoppingCart, Plus, Minus, Calculator } from "lucide-react"
import PaymentOptions from "./PaymentOptions"
import Invoice from "./Invoice"

const CheckoutPage = ({ vendors, checkouts, onAddOrder }) => {
  const { vendorId, checkoutId } = useParams()
  const [customerData, setCustomerData] = useState({
    name: "",
    phone: "",
    email: "",
  })
  const [cart, setCart] = useState({})
  const [paymentStep, setPaymentStep] = useState("details") // details, payment, success
  const [orderData, setOrderData] = useState(null)

  const vendor = vendors[vendorId]
  const checkout = checkouts[checkoutId]

  useEffect(() => {
    if (!vendor || !checkout) {
      console.error("Invalid checkout URL")
    }
  }, [vendor, checkout])

  if (!vendor || !checkout) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-100 to-pink-100 flex items-center justify-center p-4">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 text-center max-w-md w-full border border-white/20">
          <AlertCircle className="w-20 h-20 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Checkout Not Found</h2>
          <p className="text-gray-600">This checkout link is invalid or has expired.</p>
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
    }

    setOrderData(order)
    onAddOrder(checkoutId, order)
    setPaymentStep("success")
  }

  if (paymentStep === "success") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-100 via-emerald-50 to-teal-100 p-4">
        <div className="max-w-4xl mx-auto pt-8">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20">
            <div className="text-center mb-8">
              <div className="bg-gradient-to-r from-green-400 to-emerald-500 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-lg">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                Payment Successful!
              </h2>
              <p className="text-gray-600 mb-2">Thank you for your purchase. Your order has been confirmed.</p>
              <p className="text-sm text-gray-500">Invoice generated and ready for download</p>
            </div>

            <Invoice orderData={orderData} vendor={vendor} checkout={checkout} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-100 via-purple-50 to-pink-100 p-4">
      <div className="max-w-md mx-auto">
        {/* Vendor Header */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-6 mb-6 border border-white/20">
          <div className="flex items-center mb-4">
            {vendor.logo && (
              <div className="relative">
                <img
                  src={vendor.logo || "/placeholder.svg"}
                  alt={vendor.businessName}
                  className="w-16 h-16 rounded-full object-cover mr-4 border-4 border-purple-200 shadow-lg"
                />
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
              </div>
            )}
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {vendor.businessName}
              </h1>
              <p className="text-sm text-gray-600">{vendor.ownerName}</p>
            </div>
          </div>

          <div className="flex items-center text-sm text-gray-600 space-x-4">
            <div className="flex items-center bg-purple-50 px-3 py-1 rounded-full">
              <Phone className="w-4 h-4 mr-1 text-purple-500" />
              {vendor.phone}
            </div>
            {vendor.email && (
              <div className="flex items-center bg-pink-50 px-3 py-1 rounded-full">
                <Mail className="w-4 h-4 mr-1 text-pink-500" />
                {vendor.email}
              </div>
            )}
          </div>
        </div>

        {/* Checkout Title */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-6 mb-6 border border-white/20">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            {checkout.title}
          </h2>
          {checkout.description && <p className="text-gray-600">{checkout.description}</p>}
          <div className="flex items-center mt-4 text-sm text-gray-500">
            <Shield className="w-4 h-4 mr-1 text-green-500" />
            Secure Checkout
          </div>
        </div>

        {paymentStep === "details" && (
          <>
            {/* Products Section */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-6 mb-6 border border-white/20">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <ShoppingCart className="w-5 h-5 mr-2 text-purple-500" />
                Select Products
                {getTotalItems() > 0 && (
                  <span className="ml-2 bg-purple-100 text-purple-800 text-xs font-bold px-2 py-1 rounded-full">
                    {getTotalItems()} items
                  </span>
                )}
              </h3>

              <div className="space-y-4">
                {checkout.items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 border-2 border-blue-100"
                  >
                    <div className="flex items-start space-x-4">
                      {item.image && (
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-xl border-2 border-blue-200 shadow-md"
                        />
                      )}
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900">{item.name}</h4>
                        <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                        <p className="text-lg font-bold text-purple-600">KES {Number(item.price).toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <span className="text-sm font-semibold text-gray-700">Quantity:</span>
                      <div className="flex items-center space-x-3">
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.id, (cart[item.id] || 0) - 1)}
                          className="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center hover:bg-red-200 transition-all duration-300 font-bold text-lg"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-12 text-center font-bold text-gray-800 text-lg">{cart[item.id] || 0}</span>
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.id, (cart[item.id] || 0) + 1)}
                          className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center hover:bg-green-200 transition-all duration-300 font-bold text-lg"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {cart[item.id] > 0 && (
                      <div className="mt-3 pt-3 border-t border-blue-200">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Subtotal:</span>
                          <span className="font-bold text-purple-600 text-lg">
                            KES {(Number(item.price) * cart[item.id]).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Total Amount Display - Prominent */}
            {getTotalAmount() > 0 && (
              <div className="bg-gradient-to-r from-green-400 to-emerald-500 rounded-3xl shadow-2xl p-6 mb-6 border border-white/20 sticky bottom-4 z-10">
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center">
                    <Calculator className="w-6 h-6 mr-3" />
                    <div>
                      <p className="text-sm opacity-90">Total Amount</p>
                      <p className="text-xs opacity-75">{getTotalItems()} item(s)</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold">KES {getTotalAmount().toLocaleString()}</p>
                    <p className="text-sm opacity-90">Inclusive of all charges</p>
                  </div>
                </div>
              </div>
            )}

            {/* Customer Details */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Your Details</h3>

              <form onSubmit={handleCustomerSubmit} className="space-y-4">
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={customerData.name}
                    onChange={(e) => setCustomerData((prev) => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-400 transition-all duration-300 group-hover:border-purple-300 text-lg"
                    placeholder="Your full name"
                  />
                </div>

                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={customerData.phone}
                    onChange={(e) => setCustomerData((prev) => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-400 transition-all duration-300 group-hover:border-purple-300 text-lg"
                    placeholder="+254 700 000 000"
                  />
                </div>

                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email (Optional)</label>
                  <input
                    type="email"
                    value={customerData.email}
                    onChange={(e) => setCustomerData((prev) => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-400 transition-all duration-300 group-hover:border-purple-300 text-lg"
                    placeholder="your@email.com"
                  />
                </div>

                <button
                  type="submit"
                  disabled={getTotalAmount() === 0}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 px-6 rounded-xl font-bold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-lg"
                >
                  {getTotalAmount() > 0
                    ? `Proceed to Pay KES ${getTotalAmount().toLocaleString()}`
                    : "Select items to continue"}
                </button>
              </form>
            </div>
          </>
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

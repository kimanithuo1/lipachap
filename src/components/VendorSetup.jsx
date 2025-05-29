"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Store, ArrowRight } from "lucide-react"

const VendorSetup = ({ onCreateVendor, onCreateCheckout }) => {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [vendorData, setVendorData] = useState({
    businessName: "",
    ownerName: "",
    phone: "",
    email: "",
    description: "",
    logo: null,
  })

  const [checkoutData, setCheckoutData] = useState({
    productName: "",
    price: "",
    description: "",
    image: null,
    paymentMethods: {
      mpesa: true,
      stripe: false,
      paypal: false,
    },
  })

  const handleVendorSubmit = (e) => {
    e.preventDefault()
    setStep(2)
  }

  const handleCheckoutSubmit = (e) => {
    e.preventDefault()
    const vendorId = onCreateVendor(vendorData)
    const { checkoutId } = onCreateCheckout(vendorId, checkoutData)
    navigate(`/dashboard/${vendorId}`)
  }

  const handleImageUpload = (e, type) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (type === "logo") {
          setVendorData((prev) => ({ ...prev, logo: event.target.result }))
        } else {
          setCheckoutData((prev) => ({ ...prev, image: event.target.result }))
        }
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Store className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">LipaChap</h1>
          <p className="text-gray-600">Create your instant checkout page</p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-8">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= 1 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"
            }`}
          >
            1
          </div>
          <div className={`w-16 h-1 mx-2 ${step >= 2 ? "bg-blue-600" : "bg-gray-200"}`}></div>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= 2 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"
            }`}
          >
            2
          </div>
        </div>

        {step === 1 && (
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Business Information</h2>

            <form onSubmit={handleVendorSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Business Name *</label>
                <input
                  type="text"
                  required
                  value={vendorData.businessName}
                  onChange={(e) => setVendorData((prev) => ({ ...prev, businessName: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g. Sarah's Boutique"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Name *</label>
                <input
                  type="text"
                  required
                  value={vendorData.ownerName}
                  onChange={(e) => setVendorData((prev) => ({ ...prev, ownerName: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={vendorData.phone}
                  onChange={(e) => setVendorData((prev) => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+254 700 000 000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={vendorData.email}
                  onChange={(e) => setVendorData((prev) => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Business Logo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, "logo")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {vendorData.logo && (
                  <img
                    src={vendorData.logo || "/placeholder.svg"}
                    alt="Logo preview"
                    className="mt-2 w-16 h-16 object-cover rounded-lg"
                  />
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </form>
          </div>
        )}

        {step === 2 && (
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Create Your First Product</h2>

            <form onSubmit={handleCheckoutSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
                <input
                  type="text"
                  required
                  value={checkoutData.productName}
                  onChange={(e) => setCheckoutData((prev) => ({ ...prev, productName: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g. Handmade Earrings"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price (KSH) *</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={checkoutData.price}
                  onChange={(e) => setCheckoutData((prev) => ({ ...prev, price: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Description</label>
                <textarea
                  value={checkoutData.description}
                  onChange={(e) => setCheckoutData((prev) => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="3"
                  placeholder="Brief description of your product"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, "product")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {checkoutData.image && (
                  <img
                    src={checkoutData.image || "/placeholder.svg"}
                    alt="Product preview"
                    className="mt-2 w-full h-32 object-cover rounded-lg"
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Payment Methods</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={checkoutData.paymentMethods.mpesa}
                      onChange={(e) =>
                        setCheckoutData((prev) => ({
                          ...prev,
                          paymentMethods: { ...prev.paymentMethods, mpesa: e.target.checked },
                        }))
                      }
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">M-Pesa</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={checkoutData.paymentMethods.stripe}
                      onChange={(e) =>
                        setCheckoutData((prev) => ({
                          ...prev,
                          paymentMethods: { ...prev.paymentMethods, stripe: e.target.checked },
                        }))
                      }
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Stripe (Cards)</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={checkoutData.paymentMethods.paypal}
                      onChange={(e) =>
                        setCheckoutData((prev) => ({
                          ...prev,
                          paymentMethods: { ...prev.paymentMethods, paypal: e.target.checked },
                        }))
                      }
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">PayPal</span>
                  </label>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Create Checkout
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}

export default VendorSetup

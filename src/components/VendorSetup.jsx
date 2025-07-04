"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Store, ArrowRight, Plus, Trash2, Sparkles, Building2, Calculator } from "lucide-react"

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
    businessType: "retail", // retail, salon, mitumba, kiosk, restaurant, other
  })

  const [checkoutData, setCheckoutData] = useState({
    title: "",
    description: "",
    items: [
      {
        id: 1,
        name: "",
        price: "",
        description: "",
        image: null,
      },
    ],
    paymentMethods: {
      mpesa: true,
      stripe: false,
      paypal: false,
    },
  })

  const businessTypes = [
    { value: "retail", label: "Retail Shop", icon: "🏪" },
    { value: "salon", label: "Salon/Beauty", icon: "💄" },
    { value: "mitumba", label: "Mitumba/Clothes", icon: "👕" },
    { value: "kiosk", label: "Kiosk/Duka", icon: "🏬" },
    { value: "restaurant", label: "Restaurant/Food", icon: "🍽️" },
    { value: "electronics", label: "Electronics", icon: "📱" },
    { value: "pharmacy", label: "Pharmacy/Chemist", icon: "💊" },
    { value: "other", label: "Other Business", icon: "🏢" },
  ]

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

  const handleImageUpload = (e, type, itemId = null) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (type === "logo") {
          setVendorData((prev) => ({ ...prev, logo: event.target.result }))
        } else if (type === "item") {
          setCheckoutData((prev) => ({
            ...prev,
            items: prev.items.map((item) => (item.id === itemId ? { ...item, image: event.target.result } : item)),
          }))
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const addItem = () => {
    const newItem = {
      id: Date.now(),
      name: "",
      price: "",
      description: "",
      image: null,
    }
    setCheckoutData((prev) => ({
      ...prev,
      items: [...prev.items, newItem],
    }))
  }

  const removeItem = (itemId) => {
    setCheckoutData((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== itemId),
    }))
  }

  const updateItem = (itemId, field, value) => {
    setCheckoutData((prev) => ({
      ...prev,
      items: prev.items.map((item) => (item.id === itemId ? { ...item, [field]: value } : item)),
    }))
  }

  // Calculate total value of all products
  const getTotalValue = () => {
    return checkoutData.items.reduce((total, item) => {
      const price = Number(item.price) || 0
      return total + price
    }, 0)
  }

  // Get valid products count
  const getValidProductsCount = () => {
    return checkoutData.items.filter((item) => item.name && item.price).length
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-100 via-fuchsia-50 to-orange-100 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Animated Header */}
        <div className="text-center mb-8 pt-8">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 shadow-2xl transform hover:scale-110 transition-all duration-300">
            <Store className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            LipaChap
          </h1>
          <div className="flex items-center justify-center gap-2 text-gray-600">
            <Sparkles className="w-4 h-4 text-yellow-500" />
            <p>Create your professional checkout experience</p>
            <Sparkles className="w-4 h-4 text-yellow-500" />
          </div>
          <p className="text-sm text-gray-500 mt-2">Perfect for Kenyan businesses - Kiosks, Salons, Mitumba & More!</p>
        </div>

        {/* Enhanced Progress Indicator */}
        <div className="flex items-center justify-center mb-8">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
              step >= 1
                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-110"
                : "bg-gray-200 text-gray-500"
            }`}
          >
            1
          </div>
          <div
            className={`w-20 h-2 mx-3 rounded-full transition-all duration-500 ${
              step >= 2 ? "bg-gradient-to-r from-purple-500 to-pink-500" : "bg-gray-200"
            }`}
          ></div>
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
              step >= 2
                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-110"
                : "bg-gray-200 text-gray-500"
            }`}
          >
            2
          </div>
        </div>

        {step === 1 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6 flex items-center">
              <Building2 className="w-6 h-6 mr-2 text-purple-600" />
              Business Information
            </h2>

            <form onSubmit={handleVendorSubmit} className="space-y-6">
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Business Type *</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {businessTypes.map((type) => (
                    <label
                      key={type.value}
                      className={`flex flex-col items-center p-3 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                        vendorData.businessType === type.value
                          ? "border-purple-400 bg-purple-50"
                          : "border-gray-200 hover:border-purple-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="businessType"
                        value={type.value}
                        checked={vendorData.businessType === type.value}
                        onChange={(e) => setVendorData((prev) => ({ ...prev, businessType: e.target.value }))}
                        className="sr-only"
                      />
                      <span className="text-2xl mb-1">{type.icon}</span>
                      <span className="text-xs font-medium text-center">{type.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Business Name *</label>
                <input
                  type="text"
                  required
                  value={vendorData.businessName}
                  onChange={(e) => setVendorData((prev) => ({ ...prev, businessName: e.target.value }))}
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-400 transition-all duration-300 group-hover:border-purple-300 text-lg"
                  placeholder="e.g. Sarah's Beauty Salon, Mama Njeri's Kiosk"
                />
              </div>

              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Your Name *</label>
                <input
                  type="text"
                  required
                  value={vendorData.ownerName}
                  onChange={(e) => setVendorData((prev) => ({ ...prev, ownerName: e.target.value }))}
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-400 transition-all duration-300 group-hover:border-purple-300 text-lg"
                  placeholder="Your full name"
                />
              </div>

              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={vendorData.phone}
                  onChange={(e) => setVendorData((prev) => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-400 transition-all duration-300 group-hover:border-purple-300 text-lg"
                  placeholder="+254 700 000 000"
                />
              </div>

              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email (Optional)</label>
                <input
                  type="email"
                  value={vendorData.email}
                  onChange={(e) => setVendorData((prev) => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-400 transition-all duration-300 group-hover:border-purple-300 text-lg"
                  placeholder="your@email.com"
                />
              </div>

              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Business Logo (Optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, "logo")}
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-400 transition-all duration-300 group-hover:border-purple-300"
                />
                {vendorData.logo && (
                  <div className="mt-4 flex justify-center">
                    <img
                      src={vendorData.logo || "/placeholder.svg"}
                      alt="Logo preview"
                      className="w-20 h-20 object-cover rounded-full border-4 border-purple-200 shadow-lg"
                    />
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 px-6 rounded-xl font-bold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105 text-lg"
              >
                Continue to Products
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </form>
          </div>
        )}

        {step === 2 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
              Create Your Product Catalog
            </h2>

            <form onSubmit={handleCheckoutSubmit} className="space-y-6">
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Checkout Title *</label>
                <input
                  type="text"
                  required
                  value={checkoutData.title}
                  onChange={(e) => setCheckoutData((prev) => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-400 transition-all duration-300 group-hover:border-purple-300 text-lg"
                  placeholder="e.g. Hair Products, Mitumba Collection, Electronics"
                />
              </div>

              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description (Optional)</label>
                <textarea
                  value={checkoutData.description}
                  onChange={(e) => setCheckoutData((prev) => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-400 transition-all duration-300 group-hover:border-purple-300"
                  rows="3"
                  placeholder="Brief description of your products"
                />
              </div>

              {/* Products Section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-800">Products</h3>
                  <button
                    type="button"
                    onClick={addItem}
                    className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:from-green-500 hover:to-blue-600 transition-all duration-300 flex items-center shadow-lg transform hover:scale-105"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Product
                  </button>
                </div>

                {/* Product Summary */}
                {getValidProductsCount() > 0 && (
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-4 mb-6 border-2 border-green-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Calculator className="w-5 h-5 text-green-600 mr-2" />
                        <div>
                          <p className="font-bold text-green-800">Catalog Summary</p>
                          <p className="text-sm text-green-600">{getValidProductsCount()} product(s) added</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-green-600">Total Catalog Value</p>
                        <p className="text-xl font-bold text-green-800">KES {getTotalValue().toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-6">
                  {checkoutData.items.map((item, index) => (
                    <div
                      key={item.id}
                      className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border-2 border-blue-100 relative"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-bold text-gray-800 flex items-center">
                          Product {index + 1}
                          {item.name && item.price && (
                            <span className="ml-2 bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-full">
                              ✓ Complete
                            </span>
                          )}
                        </h4>
                        {checkoutData.items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-all duration-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Product Name *</label>
                          <input
                            type="text"
                            required
                            value={item.name}
                            onChange={(e) => updateItem(item.id, "name", e.target.value)}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-400 transition-all duration-300"
                            placeholder="e.g. Hair Relaxer, Jeans, Phone Case"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Price (KES) *</label>
                          <input
                            type="number"
                            required
                            min="1"
                            value={item.price}
                            onChange={(e) => updateItem(item.id, "price", e.target.value)}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-400 transition-all duration-300"
                            placeholder="500"
                          />
                        </div>
                      </div>

                      {/* Show price preview */}
                      {item.price && (
                        <div className="mt-2 text-right">
                          <span className="text-lg font-bold text-blue-600">
                            KES {Number(item.price).toLocaleString()}
                          </span>
                        </div>
                      )}

                      <div className="mt-4">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Product Description</label>
                        <textarea
                          value={item.description}
                          onChange={(e) => updateItem(item.id, "description", e.target.value)}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-400 transition-all duration-300"
                          rows="2"
                          placeholder="Brief description of this product"
                        />
                      </div>

                      <div className="mt-4">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Product Image</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, "item", item.id)}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-400 transition-all duration-300"
                        />
                        {item.image && (
                          <div className="mt-3 flex justify-center">
                            <img
                              src={item.image || "/placeholder.svg"}
                              alt="Product preview"
                              className="w-24 h-24 object-cover rounded-xl border-4 border-blue-200 shadow-lg"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Methods */}
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 border-2 border-yellow-100">
                <label className="block text-lg font-bold text-gray-800 mb-4">Payment Methods</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <label className="flex items-center p-4 bg-white rounded-xl border-2 border-gray-200 hover:border-green-400 transition-all duration-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checkoutData.paymentMethods.mpesa}
                      onChange={(e) =>
                        setCheckoutData((prev) => ({
                          ...prev,
                          paymentMethods: { ...prev.paymentMethods, mpesa: e.target.checked },
                        }))
                      }
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500 w-5 h-5"
                    />
                    <span className="ml-3 font-semibold text-gray-700">M-Pesa</span>
                  </label>
                  <label className="flex items-center p-4 bg-white rounded-xl border-2 border-gray-200 hover:border-blue-400 transition-all duration-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checkoutData.paymentMethods.stripe}
                      onChange={(e) =>
                        setCheckoutData((prev) => ({
                          ...prev,
                          paymentMethods: { ...prev.paymentMethods, stripe: e.target.checked },
                        }))
                      }
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-5 h-5"
                    />
                    <span className="ml-3 font-semibold text-gray-700">Cards</span>
                  </label>
                  <label className="flex items-center p-4 bg-white rounded-xl border-2 border-gray-200 hover:border-yellow-400 transition-all duration-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checkoutData.paymentMethods.paypal}
                      onChange={(e) =>
                        setCheckoutData((prev) => ({
                          ...prev,
                          paymentMethods: { ...prev.paymentMethods, paypal: e.target.checked },
                        }))
                      }
                      className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500 w-5 h-5"
                    />
                    <span className="ml-3 font-semibold text-gray-700">PayPal</span>
                  </label>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 bg-gray-200 text-gray-700 py-4 px-6 rounded-xl font-bold hover:bg-gray-300 transition-all duration-300 transform hover:scale-105"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 px-6 rounded-xl font-bold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
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

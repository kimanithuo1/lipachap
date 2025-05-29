"use client"

import { useState } from "react"
import { useParams, Link } from "react-router-dom"
import { Plus, QrCode, Copy, Eye, Calendar, Package, TrendingUp, Star, Zap, Trash2 } from "lucide-react"
import QRGenerator from "./QRGenerator"

const Dashboard = ({ vendors, checkouts, onCreateCheckout }) => {
  const { vendorId } = useParams()
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showQR, setShowQR] = useState(null)
  const [newCheckout, setNewCheckout] = useState({
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

  const vendor = vendors[vendorId]
  const vendorCheckouts = Object.values(checkouts).filter((c) => c.vendorId === vendorId)

  if (!vendor) {
    return <div>Vendor not found</div>
  }

  const totalOrders = vendorCheckouts.reduce((sum, checkout) => sum + (checkout.orders?.length || 0), 0)
  const totalRevenue = vendorCheckouts.reduce(
    (sum, checkout) => sum + (checkout.orders?.reduce((orderSum, order) => orderSum + order.totalAmount, 0) || 0),
    0,
  )

  const handleCreateCheckout = (e) => {
    e.preventDefault()
    onCreateCheckout(vendorId, newCheckout)
    setNewCheckout({
      title: "",
      description: "",
      items: [{ id: 1, name: "", price: "", description: "", image: null }],
      paymentMethods: { mpesa: true, stripe: false, paypal: false },
    })
    setShowCreateForm(false)
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    alert("Link copied to clipboard! 📋")
  }

  const addItem = () => {
    const newItem = {
      id: Date.now(),
      name: "",
      price: "",
      description: "",
      image: null,
    }
    setNewCheckout((prev) => ({
      ...prev,
      items: [...prev.items, newItem],
    }))
  }

  const removeItem = (itemId) => {
    setNewCheckout((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== itemId),
    }))
  }

  const updateItem = (itemId, field, value) => {
    setNewCheckout((prev) => ({
      ...prev,
      items: prev.items.map((item) => (item.id === itemId ? { ...item, [field]: value } : item)),
    }))
  }

  const handleImageUpload = (e, itemId) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        updateItem(itemId, "image", event.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-100 via-purple-50 to-pink-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 mb-8 border border-white/20">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              {vendor.logo && (
                <div className="relative">
                  <img
                    src={vendor.logo || "/placeholder.svg"}
                    alt={vendor.businessName}
                    className="w-20 h-20 rounded-full object-cover mr-6 border-4 border-purple-200 shadow-lg"
                  />
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                    <Star className="w-4 h-4 text-white" />
                  </div>
                </div>
              )}
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {vendor.businessName}
                </h1>
                <p className="text-gray-600 text-lg">{vendor.ownerName}</p>
                <div className="flex items-center mt-2 text-sm text-gray-500">
                  <Zap className="w-4 h-4 mr-1 text-yellow-500" />
                  <span>Powered by LipaChap</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-bold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 flex items-center shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Plus className="w-5 h-5 mr-2" />
              New Checkout
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-r from-blue-100 to-blue-200 rounded-2xl p-6 border-2 border-blue-200">
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-blue-400 to-blue-600 rounded-full p-3 mr-4 shadow-lg">
                  <Package className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-semibold">Checkouts</p>
                  <p className="text-2xl font-bold text-gray-900">{vendorCheckouts.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-100 to-emerald-200 rounded-2xl p-6 border-2 border-green-200">
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-green-400 to-emerald-600 rounded-full p-3 mr-4 shadow-lg">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-semibold">Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-yellow-100 to-orange-200 rounded-2xl p-6 border-2 border-yellow-200 col-span-1 md:col-span-2">
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-yellow-400 to-orange-600 rounded-full p-3 mr-4 shadow-lg">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-semibold">Total Revenue</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                    KSH {totalRevenue.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Create New Checkout Form */}
        {showCreateForm && (
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 mb-8 border border-white/20">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
              Create New Multi-Item Checkout
            </h2>

            <form onSubmit={handleCreateCheckout} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Checkout Title *</label>
                  <input
                    type="text"
                    required
                    value={newCheckout.title}
                    onChange={(e) => setNewCheckout((prev) => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-400 transition-all duration-300 group-hover:border-purple-300"
                    placeholder="e.g. Summer Collection 2024"
                  />
                </div>

                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                  <textarea
                    value={newCheckout.description}
                    onChange={(e) => setNewCheckout((prev) => ({ ...prev, description: e.target.value }))}
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-400 transition-all duration-300 group-hover:border-purple-300"
                    rows="3"
                    placeholder="Brief description of your product collection"
                  />
                </div>
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

                <div className="space-y-6">
                  {newCheckout.items.map((item, index) => (
                    <div
                      key={item.id}
                      className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border-2 border-blue-100 relative"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-bold text-gray-800">Product {index + 1}</h4>
                        {newCheckout.items.length > 1 && (
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
                            placeholder="e.g. Handmade Earrings"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Price (KSH) *</label>
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
                          onChange={(e) => handleImageUpload(e, item.id)}
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
                      checked={newCheckout.paymentMethods.mpesa}
                      onChange={(e) =>
                        setNewCheckout((prev) => ({
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
                      checked={newCheckout.paymentMethods.stripe}
                      onChange={(e) =>
                        setNewCheckout((prev) => ({
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
                      checked={newCheckout.paymentMethods.paypal}
                      onChange={(e) =>
                        setNewCheckout((prev) => ({
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
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-4 px-6 rounded-xl font-bold hover:bg-gray-300 transition-all duration-300 transform hover:scale-105"
                >
                  Cancel
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

        {/* Checkout Links */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
            Your Checkout Pages
          </h2>

          {vendorCheckouts.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                <Package className="w-12 h-12 text-purple-500" />
              </div>
              <p className="text-gray-500 text-lg">No checkout pages created yet.</p>
              <p className="text-gray-400">Create your first multi-item checkout to get started!</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {vendorCheckouts.map((checkout) => (
                <div
                  key={checkout.id}
                  className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border-2 border-blue-100 hover:border-purple-300 transition-all duration-300 transform hover:scale-105"
                >
                  <div className="mb-4">
                    <h3 className="font-bold text-gray-900 text-lg">{checkout.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{checkout.description}</p>
                    <p className="text-xs text-gray-500">Created {new Date(checkout.createdAt).toLocaleDateString()}</p>
                    <p className="text-sm font-semibold text-purple-600 mt-2">
                      {checkout.items?.length || 0} product(s)
                    </p>
                  </div>

                  <div className="bg-white rounded-lg p-3 mb-4">
                    <p className="text-xs text-gray-600 mb-1">Checkout URL:</p>
                    <p className="text-xs font-mono text-gray-800 break-all">{checkout.url}</p>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <Link
                      to={`/checkout/${checkout.vendorId}/${checkout.id}`}
                      className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-sm font-medium hover:bg-blue-200 transition-all duration-300 flex items-center"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Preview
                    </Link>

                    <button
                      onClick={() => copyToClipboard(checkout.url)}
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded-lg text-sm font-medium hover:bg-gray-200 transition-all duration-300 flex items-center"
                    >
                      <Copy className="w-4 h-4 mr-1" />
                      Copy
                    </button>

                    <button
                      onClick={() => setShowQR(checkout.id)}
                      className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-sm font-medium hover:bg-green-200 transition-all duration-300 flex items-center"
                    >
                      <QrCode className="w-4 h-4 mr-1" />
                      QR
                    </button>
                  </div>

                  {checkout.orders && checkout.orders.length > 0 && (
                    <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg p-3 border border-green-200">
                      <p className="text-sm font-semibold text-green-800">{checkout.orders.length} order(s)</p>
                      <p className="text-sm text-green-700">
                        KSH {checkout.orders.reduce((sum, order) => sum + order.totalAmount, 0).toLocaleString()} total
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* QR Code Modal */}
        {showQR && (
          <QRGenerator checkout={vendorCheckouts.find((c) => c.id === showQR)} onClose={() => setShowQR(null)} />
        )}
      </div>
    </div>
  )
}

export default Dashboard

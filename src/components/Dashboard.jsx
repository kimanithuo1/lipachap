"use client"

import { useState } from "react"
import { useParams, Link } from "react-router-dom"
import { Plus, QrCode, Copy, Eye, Calendar, Package, TrendingUp } from "lucide-react"
import QRGenerator from "./QRGenerator"

const Dashboard = ({ vendors, checkouts, onCreateCheckout }) => {
  const { vendorId } = useParams()
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showQR, setShowQR] = useState(null)
  const [newCheckout, setNewCheckout] = useState({
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
      productName: "",
      price: "",
      description: "",
      image: null,
      paymentMethods: { mpesa: true, stripe: false, paypal: false },
    })
    setShowCreateForm(false)
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    alert("Link copied to clipboard!")
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setNewCheckout((prev) => ({ ...prev, image: event.target.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              {vendor.logo && (
                <img
                  src={vendor.logo || "/placeholder.svg"}
                  alt={vendor.businessName}
                  className="w-16 h-16 rounded-full object-cover mr-4"
                />
              )}
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{vendor.businessName}</h1>
                <p className="text-gray-600">{vendor.ownerName}</p>
              </div>
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Product
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center">
                <Package className="w-8 h-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Products</p>
                  <p className="text-xl font-bold text-gray-900">{vendorCheckouts.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center">
                <TrendingUp className="w-8 h-8 text-green-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Orders</p>
                  <p className="text-xl font-bold text-gray-900">{totalOrders}</p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 rounded-lg p-4 col-span-2">
              <div className="flex items-center">
                <Calendar className="w-8 h-8 text-yellow-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <p className="text-xl font-bold text-gray-900">KSH {totalRevenue.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Create New Checkout Form */}
        {showCreateForm && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Create New Product Checkout</h2>

            <form onSubmit={handleCreateCheckout} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={newCheckout.productName}
                    onChange={(e) => setNewCheckout((prev) => ({ ...prev, productName: e.target.value }))}
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
                    value={newCheckout.price}
                    onChange={(e) => setNewCheckout((prev) => ({ ...prev, price: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Description</label>
                <textarea
                  value={newCheckout.description}
                  onChange={(e) => setNewCheckout((prev) => ({ ...prev, description: e.target.value }))}
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
                  onChange={handleImageUpload}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {newCheckout.image && (
                  <img
                    src={newCheckout.image || "/placeholder.svg"}
                    alt="Product preview"
                    className="mt-2 w-full h-32 object-cover rounded-lg"
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Payment Methods</label>
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newCheckout.paymentMethods.mpesa}
                      onChange={(e) =>
                        setNewCheckout((prev) => ({
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
                      checked={newCheckout.paymentMethods.stripe}
                      onChange={(e) =>
                        setNewCheckout((prev) => ({
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
                      checked={newCheckout.paymentMethods.paypal}
                      onChange={(e) =>
                        setNewCheckout((prev) => ({
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
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  Cancel
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

        {/* Checkout Links */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Product Checkouts</h2>

          {vendorCheckouts.length === 0 ? (
            <div className="text-center py-8">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No products created yet. Create your first product checkout!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {vendorCheckouts.map((checkout) => (
                <div key={checkout.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{checkout.productName}</h3>
                      <p className="text-sm text-gray-600">KSH {checkout.price.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">
                        Created {new Date(checkout.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    {checkout.image && (
                      <img
                        src={checkout.image || "/placeholder.svg"}
                        alt={checkout.productName}
                        className="w-16 h-16 object-cover rounded-lg ml-4"
                      />
                    )}
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3 mb-3">
                    <p className="text-xs text-gray-600 mb-1">Checkout URL:</p>
                    <p className="text-sm font-mono text-gray-800 break-all">{checkout.url}</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Link
                      to={`/checkout/${checkout.vendorId}/${checkout.id}`}
                      className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors flex items-center"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Preview
                    </Link>

                    <button
                      onClick={() => copyToClipboard(checkout.url)}
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center"
                    >
                      <Copy className="w-4 h-4 mr-1" />
                      Copy Link
                    </button>

                    <button
                      onClick={() => setShowQR(checkout.id)}
                      className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors flex items-center"
                    >
                      <QrCode className="w-4 h-4 mr-1" />
                      QR Code
                    </button>
                  </div>

                  {checkout.orders && checkout.orders.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-sm text-gray-600">
                        {checkout.orders.length} order(s) • KSH{" "}
                        {checkout.orders.reduce((sum, order) => sum + order.totalAmount, 0).toLocaleString()} total
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

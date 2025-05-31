"use client"

import { useState } from "react"
import { useParams, Link } from "react-router-dom"
import {
  Plus,
  QrCode,
  Copy,
  Eye,
  Package,
  TrendingUp,
  DollarSign,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Settings,
  Bell,
  Filter,
  Trash2,
  CheckCircle,
  Calendar,
  Clock,
} from "lucide-react"
import QRGenerator from "./QRGenerator"

const Dashboard = ({ vendors, checkouts, onCreateCheckout }) => {
  const { vendorId } = useParams()
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showQR, setShowQR] = useState(null)
  const [copiedId, setCopiedId] = useState(null)
  const [dateFilter, setDateFilter] = useState("7days") // today, 7days, 30days, all
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

  // Calculate metrics based on date filter
  const getFilteredData = () => {
    const now = new Date()
    let startDate = new Date()

    switch (dateFilter) {
      case "today":
        startDate.setHours(0, 0, 0, 0)
        break
      case "7days":
        startDate.setDate(now.getDate() - 7)
        break
      case "30days":
        startDate.setDate(now.getDate() - 30)
        break
      default:
        startDate = new Date(0) // All time
    }

    const filteredCheckouts = vendorCheckouts.filter((checkout) => {
      const checkoutDate = new Date(checkout.createdAt)
      return checkoutDate >= startDate
    })

    const filteredOrders = vendorCheckouts.flatMap((checkout) =>
      (checkout.orders || []).filter((order) => {
        const orderDate = new Date(order.timestamp)
        return orderDate >= startDate
      }),
    )

    return { filteredCheckouts, filteredOrders }
  }

  const { filteredCheckouts, filteredOrders } = getFilteredData()

  const totalOrders = filteredOrders.length
  const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.totalAmount, 0)
  const totalProductsSold = filteredOrders.reduce(
    (sum, order) => sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0),
    0,
  )
  const uniqueCustomers = new Set(filteredOrders.map((order) => order.phone)).size
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

  // Get today's orders specifically
  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)
  const todaysOrders = vendorCheckouts.flatMap((checkout) =>
    (checkout.orders || []).filter((order) => {
      const orderDate = new Date(order.timestamp)
      return orderDate >= todayStart
    }),
  )

  // Get pending orders (if any have pending status)
  const pendingOrders = vendorCheckouts.flatMap((checkout) =>
    (checkout.orders || []).filter((order) => order.status === "pending"),
  )

  // Mock growth data (in real app, compare with previous period)
  const metrics = {
    checkouts: {
      value: filteredCheckouts.length,
      growth: 12.5,
      isPositive: true,
    },
    orders: {
      value: totalOrders,
      growth: 8.3,
      isPositive: true,
    },
    revenue: {
      value: totalRevenue,
      growth: 15.2,
      isPositive: true,
    },
    productsSold: {
      value: totalProductsSold,
      growth: 10.1,
      isPositive: true,
    },
    todaysOrders: {
      value: todaysOrders.length,
      growth: 5.0,
      isPositive: true,
    },
    pendingOrders: {
      value: pendingOrders.length,
      growth: -20.0,
      isPositive: false,
    },
    averageOrder: {
      value: averageOrderValue,
      growth: -2.1,
      isPositive: false,
    },
  }

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

  const copyToClipboard = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      console.error("Failed to copy: ", err)
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

  const getDateFilterLabel = () => {
    switch (dateFilter) {
      case "today":
        return "Today"
      case "7days":
        return "Last 7 Days"
      case "30days":
        return "Last 30 Days"
      default:
        return "All Time"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center mb-6 lg:mb-0">
              <div className="relative">
                {vendor.logo ? (
                  <img
                    src={vendor.logo || "/placeholder.svg"}
                    alt={vendor.businessName}
                    className="w-16 h-16 rounded-lg object-cover border-2 border-gray-200"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-blue-600 flex items-center justify-center">
                    <span className="text-white font-bold text-xl">{vendor.businessName.charAt(0)}</span>
                  </div>
                )}
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              </div>

              <div className="ml-4">
                <h1 className="text-2xl font-bold text-gray-900">{vendor.businessName}</h1>
                <p className="text-gray-600">{vendor.ownerName}</p>
                <p className="text-sm text-gray-500">{vendor.phone}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                <Settings className="w-5 h-5" />
              </button>
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center"
              >
                <Plus className="w-5 h-5 mr-2" />
                New Checkout
              </button>
            </div>
          </div>
        </div>

        {/* Date Filter */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Sales Performance</h2>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="today">Today</option>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="all">All Time</option>
            </select>
          </div>
        </div>

        {/* Enhanced Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Checkouts */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Checkouts</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{metrics.checkouts.value}</p>
              </div>
              <div className="bg-blue-50 rounded-full p-3">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="flex items-center mt-4">
              {metrics.checkouts.isPositive ? (
                <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
              ) : (
                <ArrowDownRight className="w-4 h-4 text-red-500 mr-1" />
              )}
              <span
                className={`text-sm font-medium ${metrics.checkouts.isPositive ? "text-green-600" : "text-red-600"}`}
              >
                {metrics.checkouts.growth > 0 ? "+" : ""}
                {metrics.checkouts.growth}%
              </span>
              <span className="text-sm text-gray-500 ml-1">vs previous period</span>
            </div>
          </div>

          {/* Total Orders */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{metrics.orders.value}</p>
              </div>
              <div className="bg-green-50 rounded-full p-3">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="flex items-center mt-4">
              {metrics.orders.isPositive ? (
                <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
              ) : (
                <ArrowDownRight className="w-4 h-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm font-medium ${metrics.orders.isPositive ? "text-green-600" : "text-red-600"}`}>
                {metrics.orders.growth > 0 ? "+" : ""}
                {metrics.orders.growth}%
              </span>
              <span className="text-sm text-gray-500 ml-1">vs previous period</span>
            </div>
          </div>

          {/* Total Revenue */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">KES {metrics.revenue.value.toLocaleString()}</p>
              </div>
              <div className="bg-yellow-50 rounded-full p-3">
                <DollarSign className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <div className="flex items-center mt-4">
              {metrics.revenue.isPositive ? (
                <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
              ) : (
                <ArrowDownRight className="w-4 h-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm font-medium ${metrics.revenue.isPositive ? "text-green-600" : "text-red-600"}`}>
                {metrics.revenue.growth > 0 ? "+" : ""}
                {metrics.revenue.growth}%
              </span>
              <span className="text-sm text-gray-500 ml-1">vs previous period</span>
            </div>
          </div>

          {/* Products Sold */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Products Sold</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{metrics.productsSold.value}</p>
              </div>
              <div className="bg-purple-50 rounded-full p-3">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="flex items-center mt-4">
              {metrics.productsSold.isPositive ? (
                <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
              ) : (
                <ArrowDownRight className="w-4 h-4 text-red-500 mr-1" />
              )}
              <span
                className={`text-sm font-medium ${metrics.productsSold.isPositive ? "text-green-600" : "text-red-600"}`}
              >
                {metrics.productsSold.growth > 0 ? "+" : ""}
                {metrics.productsSold.growth}%
              </span>
              <span className="text-sm text-gray-500 ml-1">vs previous period</span>
            </div>
          </div>

          {/* Today's Orders */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today's Orders</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{metrics.todaysOrders.value}</p>
              </div>
              <div className="bg-orange-50 rounded-full p-3">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <div className="flex items-center mt-4">
              {metrics.todaysOrders.isPositive ? (
                <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
              ) : (
                <ArrowDownRight className="w-4 h-4 text-red-500 mr-1" />
              )}
              <span
                className={`text-sm font-medium ${metrics.todaysOrders.isPositive ? "text-green-600" : "text-red-600"}`}
              >
                {metrics.todaysOrders.growth > 0 ? "+" : ""}
                {metrics.todaysOrders.growth}%
              </span>
              <span className="text-sm text-gray-500 ml-1">vs yesterday</span>
            </div>
          </div>

          {/* Unique Customers */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Unique Customers</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{uniqueCustomers}</p>
              </div>
              <div className="bg-indigo-50 rounded-full p-3">
                <Users className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
            <div className="flex items-center mt-4">
              <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm font-medium text-green-600">+15.3%</span>
              <span className="text-sm text-gray-500 ml-1">new customers</span>
            </div>
          </div>

          {/* Average Order Value */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Order Value</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  KES {Math.round(metrics.averageOrder.value).toLocaleString()}
                </p>
              </div>
              <div className="bg-pink-50 rounded-full p-3">
                <TrendingUp className="w-6 h-6 text-pink-600" />
              </div>
            </div>
            <div className="flex items-center mt-4">
              {metrics.averageOrder.isPositive ? (
                <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
              ) : (
                <ArrowDownRight className="w-4 h-4 text-red-500 mr-1" />
              )}
              <span
                className={`text-sm font-medium ${metrics.averageOrder.isPositive ? "text-green-600" : "text-red-600"}`}
              >
                {metrics.averageOrder.growth > 0 ? "+" : ""}
                {metrics.averageOrder.growth}%
              </span>
              <span className="text-sm text-gray-500 ml-1">vs previous period</span>
            </div>
          </div>

          {/* Pending Orders */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Orders</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{metrics.pendingOrders.value}</p>
              </div>
              <div className="bg-red-50 rounded-full p-3">
                <Clock className="w-6 h-6 text-red-600" />
              </div>
            </div>
            <div className="flex items-center mt-4">
              {metrics.pendingOrders.isPositive ? (
                <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
              ) : (
                <ArrowDownRight className="w-4 h-4 text-red-500 mr-1" />
              )}
              <span
                className={`text-sm font-medium ${metrics.pendingOrders.isPositive ? "text-green-600" : "text-red-600"}`}
              >
                {metrics.pendingOrders.growth > 0 ? "+" : ""}
                {metrics.pendingOrders.growth}%
              </span>
              <span className="text-sm text-gray-500 ml-1">needs attention</span>
            </div>
          </div>
        </div>

        {/* Latest Orders Section */}
        {filteredOrders.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Latest Orders</h3>
              <span className="text-sm text-gray-500">{filteredOrders.length} total orders</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-2 font-medium text-gray-600">Date</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-600">Customer</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-600">Checkout</th>
                    <th className="text-right py-3 px-2 font-medium text-gray-600">Amount</th>
                    <th className="text-center py-3 px-2 font-medium text-gray-600">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders
                    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                    .slice(0, 10)
                    .map((order, index) => {
                      const checkout = vendorCheckouts.find((c) => c.id === order.checkoutId)
                      return (
                        <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-2">
                            <div>
                              <p className="font-medium">{new Date(order.timestamp).toLocaleDateString("en-KE")}</p>
                              <p className="text-xs text-gray-500">
                                {new Date(order.timestamp).toLocaleTimeString("en-KE", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </p>
                            </div>
                          </td>
                          <td className="py-3 px-2">
                            <div>
                              <p className="font-medium">{order.name}</p>
                              <p className="text-xs text-gray-500">{order.phone}</p>
                            </div>
                          </td>
                          <td className="py-3 px-2">
                            <p className="font-medium">{checkout?.title || "Unknown"}</p>
                            <p className="text-xs text-gray-500">{order.items.length} item(s)</p>
                          </td>
                          <td className="py-3 px-2 text-right">
                            <p className="font-bold text-green-600">KES {order.totalAmount.toLocaleString()}</p>
                            <p className="text-xs text-gray-500">via {order.method}</p>
                          </td>
                          <td className="py-3 px-2 text-center">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Paid
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                </tbody>
              </table>
            </div>

            {filteredOrders.length > 10 && (
              <div className="mt-4 text-center">
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  View all {filteredOrders.length} orders
                </button>
              </div>
            )}
          </div>
        )}

        {/* Create New Checkout Form */}
        {showCreateForm && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Create New Checkout</h3>
              <button onClick={() => setShowCreateForm(false)} className="text-gray-400 hover:text-gray-600 p-1">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCheckout} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Checkout Title *</label>
                  <input
                    type="text"
                    required
                    value={newCheckout.title}
                    onChange={(e) => setNewCheckout((prev) => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g. Summer Collection 2024"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={newCheckout.description}
                    onChange={(e) => setNewCheckout((prev) => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows="3"
                    placeholder="Brief description"
                  />
                </div>
              </div>

              {/* Products Section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-md font-medium text-gray-900">Products</h4>
                  <button
                    type="button"
                    onClick={addItem}
                    className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors flex items-center"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Product
                  </button>
                </div>

                <div className="space-y-4">
                  {newCheckout.items.map((item, index) => (
                    <div key={item.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-700">Product {index + 1}</span>
                        {newCheckout.items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      <div className="grid md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Product Name *</label>
                          <input
                            type="text"
                            required
                            value={item.name}
                            onChange={(e) => updateItem(item.id, "name", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                            placeholder="Product name"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Price (KES) *</label>
                          <input
                            type="number"
                            required
                            min="1"
                            value={item.price}
                            onChange={(e) => updateItem(item.id, "price", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                            placeholder="500"
                          />
                        </div>
                      </div>

                      <div className="mt-3">
                        <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                        <textarea
                          value={item.description}
                          onChange={(e) => updateItem(item.id, "description", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                          rows="2"
                          placeholder="Product description"
                        />
                      </div>

                      <div className="mt-3">
                        <label className="block text-xs font-medium text-gray-600 mb-1">Image</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, item.id)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        />
                        {item.image && (
                          <div className="mt-2 flex justify-center">
                            <img
                              src={item.image || "/placeholder.svg"}
                              alt="Product preview"
                              className="w-16 h-16 object-cover rounded border"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Methods */}
              <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                <label className="block text-sm font-medium text-gray-700 mb-3">Payment Methods</label>
                <div className="grid grid-cols-3 gap-3">
                  <label className="flex items-center p-3 bg-white rounded border hover:border-green-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newCheckout.paymentMethods.mpesa}
                      onChange={(e) =>
                        setNewCheckout((prev) => ({
                          ...prev,
                          paymentMethods: { ...prev.paymentMethods, mpesa: e.target.checked },
                        }))
                      }
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700">M-Pesa</span>
                  </label>
                  <label className="flex items-center p-3 bg-white rounded border hover:border-blue-400 cursor-pointer">
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
                    <span className="ml-2 text-sm font-medium text-gray-700">Cards</span>
                  </label>
                  <label className="flex items-center p-3 bg-white rounded border hover:border-yellow-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newCheckout.paymentMethods.paypal}
                      onChange={(e) =>
                        setNewCheckout((prev) => ({
                          ...prev,
                          paymentMethods: { ...prev.paymentMethods, paypal: e.target.checked },
                        }))
                      }
                      className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700">PayPal</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Create Checkout
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Checkout Pages List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Checkout Pages</h3>
            <span className="text-sm text-gray-500">{vendorCheckouts.length} total</span>
          </div>

          {vendorCheckouts.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-gray-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-gray-400" />
              </div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">No checkout pages yet</h4>
              <p className="text-gray-500 mb-4">Create your first checkout page to start selling online.</p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center mx-auto"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create First Checkout
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {vendorCheckouts.map((checkout) => (
                <div
                  key={checkout.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-medium text-gray-900">{checkout.title}</h4>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                          {checkout.items?.length || 0} items
                        </span>
                        {checkout.orders?.length === 0 && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                            New
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Orders:</span>
                          <span className="ml-1 font-medium">{checkout.orders?.length || 0}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Revenue:</span>
                          <span className="ml-1 font-medium text-green-600">
                            KES{" "}
                            {(
                              checkout.orders?.reduce((sum, order) => sum + order.totalAmount, 0) || 0
                            ).toLocaleString()}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Created:</span>
                          <span className="ml-1 font-medium">{new Date(checkout.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Link
                            to={`/checkout/${checkout.vendorId}/${checkout.id}`}
                            className="inline-flex items-center px-2 py-1 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700 transition-colors"
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            Preview
                          </Link>
                          <button
                            onClick={() => copyToClipboard(checkout.url, checkout.id)}
                            className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium transition-colors ${
                              copiedId === checkout.id
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                          >
                            <Copy className="w-3 h-3 mr-1" />
                            {copiedId === checkout.id ? "Copied!" : "Copy"}
                          </button>
                          <button
                            onClick={() => setShowQR(checkout.id)}
                            className="inline-flex items-center px-2 py-1 bg-green-600 text-white rounded text-xs font-medium hover:bg-green-700 transition-colors"
                          >
                            <QrCode className="w-3 h-3 mr-1" />
                            QR
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
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

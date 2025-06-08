"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  FileText,
  ShoppingCart,
  ArrowRight,
  CheckCircle,
  Star,
  Users,
  Zap,
  Shield,
  Smartphone,
  Clock,
  TrendingUp,
  AlertCircle,
} from "lucide-react"
import InvoiceGenerator from "./InvoiceGenerator"
import Toast from "./Toast"

const LandingPage = ({ onCreateVendor }) => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("invoice") // invoice or checkout
  const [showInvoiceForm, setShowInvoiceForm] = useState(false)
  const [quickInvoiceData, setQuickInvoiceData] = useState({
    businessName: "",
    clientName: "",
    invoiceDate: new Date().toISOString().split("T")[0],
    amount: "",
  })
  const [validationErrors, setValidationErrors] = useState({})
  const [toast, setToast] = useState({ show: false, message: "", type: "success" })

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type })
  }

  const hideToast = () => {
    setToast({ show: false, message: "", type: "success" })
  }

  const validateQuickForm = () => {
    const errors = {}
    if (!quickInvoiceData.businessName.trim()) errors.businessName = "Business name is required"
    if (!quickInvoiceData.clientName.trim()) errors.clientName = "Client name is required"
    if (!quickInvoiceData.amount || quickInvoiceData.amount <= 0) errors.amount = "Valid amount is required"
    if (!quickInvoiceData.invoiceDate) errors.invoiceDate = "Invoice date is required"

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleQuickGenerate = () => {
    if (validateQuickForm()) {
      // Pre-populate the full invoice generator with quick form data
      const invoiceData = {
        businessName: quickInvoiceData.businessName,
        businessAddress: "",
        businessPhone: "",
        businessEmail: "",
        businessLogo: null,
        clientName: quickInvoiceData.clientName,
        clientAddress: "",
        clientPhone: "",
        clientEmail: "",
        invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
        invoiceDate: quickInvoiceData.invoiceDate,
        dueDate: "",
        items: [
          {
            id: 1,
            description: "Service/Product",
            quantity: 1,
            rate: Number(quickInvoiceData.amount),
            amount: Number(quickInvoiceData.amount),
          },
        ],
        subtotal: Number(quickInvoiceData.amount),
        tax: 0,
        total: Number(quickInvoiceData.amount),
        notes: "",
        terms: "Payment is due within 30 days of invoice date.",
      }

      // Save to localStorage for the invoice generator
      localStorage.setItem("lipachap-invoice-draft", JSON.stringify(invoiceData))

      setShowInvoiceForm(true)
      setValidationErrors({})
      showToast("Invoice data loaded! Complete the details to generate your professional invoice.", "success")

      // Track quick start event
      if (typeof window !== "undefined" && typeof window.gtag !== "undefined") {
        window.gtag("event", "quick_start", {
          event_category: "invoice",
          event_label: "landing_page",
        })
      }
    } else {
      showToast("Please fill in all required fields", "error")
    }
  }

  const handleCreateCheckout = () => {
    navigate("/vendor-setup")
  }

  // Load saved quick form data
  useEffect(() => {
    const saved = localStorage.getItem("lipachap-quick-invoice")
    if (saved) {
      try {
        const data = JSON.parse(saved)
        setQuickInvoiceData((prev) => ({ ...prev, ...data }))
      } catch (e) {
        console.error("Failed to load saved quick invoice data")
      }
    }
  }, [])

  // Save quick form data
  useEffect(() => {
    localStorage.setItem("lipachap-quick-invoice", JSON.stringify(quickInvoiceData))
  }, [quickInvoiceData])

  const features = [
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Professional Invoices",
      description: "Create beautiful, professional invoices in seconds with automatic KES formatting",
    },
    {
      icon: <ShoppingCart className="w-6 h-6" />,
      title: "Instant Checkout Pages",
      description: "Build product catalogs and checkout pages for your business in minutes",
    },
    {
      icon: <Smartphone className="w-6 h-6" />,
      title: "M-Pesa Integration",
      description: "Accept payments via M-Pesa, cards, and other popular payment methods",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "100% Secure",
      description: "Your data is protected with enterprise-grade security and encryption",
    },
  ]

  const steps = [
    {
      number: "1",
      title: "Fill Details",
      description: "Enter your business and client information",
    },
    {
      number: "2",
      title: "Preview & Customize",
      description: "Review and customize your invoice or checkout page",
    },
    {
      number: "3",
      title: "Download & Share",
      description: "Download PDF or share your professional checkout link",
    },
  ]

  const testimonials = [
    {
      name: "Sarah Wanjiku",
      business: "Beauty Salon Owner",
      text: "LipaChap helped me create professional invoices for my salon. My clients love the clean design!",
      rating: 5,
    },
    {
      name: "John Kamau",
      business: "Electronics Shop",
      text: "The checkout pages are perfect for my electronics business. M-Pesa integration works flawlessly.",
      rating: 5,
    },
    {
      name: "Grace Akinyi",
      business: "Freelance Designer",
      text: "As a freelancer, the free invoice generator saves me so much time. Highly recommended!",
      rating: 5,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50">
      {/* Toast Notifications */}
      <Toast message={toast.message} type={toast.type} isVisible={toast.show} onClose={hideToast} />

      {/* Hero Section */}
      <section className="pt-16 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
              Create Professional Invoices & Checkout Pages
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Free invoice generator and checkout page creator for Kenyan freelancers and businesses. No login required.
              M-Pesa integration included.
            </p>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6 mb-12 text-sm text-gray-500">
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-2 text-green-500" />
                <span>Used by 500+ Kenyan entrepreneurs</span>
              </div>
              <div className="flex items-center">
                <Shield className="w-4 h-4 mr-2 text-blue-500" />
                <span>100% Free & Secure</span>
              </div>
              <div className="flex items-center">
                <Zap className="w-4 h-4 mr-2 text-yellow-500" />
                <span>Ready in 30 seconds</span>
              </div>
            </div>

            {/* Tab Selection */}
            <div className="flex justify-center mb-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 border border-purple-100 shadow-lg">
                <button
                  onClick={() => setActiveTab("invoice")}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    activeTab === "invoice"
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                      : "text-gray-600 hover:text-purple-600"
                  }`}
                >
                  <FileText className="w-5 h-5 inline mr-2" />
                  Invoice Generator
                </button>
                <button
                  onClick={() => setActiveTab("checkout")}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    activeTab === "checkout"
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                      : "text-gray-600 hover:text-purple-600"
                  }`}
                >
                  <ShoppingCart className="w-5 h-5 inline mr-2" />
                  Checkout Pages
                </button>
              </div>
            </div>
          </div>

          {/* Main Action Section */}
          <div className="max-w-2xl mx-auto">
            {activeTab === "invoice" ? (
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Start Generating Your Invoice</h2>
                  <p className="text-gray-600">Create professional invoices in seconds. No registration required.</p>
                </div>

                {!showInvoiceForm ? (
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="group">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Business Name *</label>
                        <input
                          type="text"
                          value={quickInvoiceData.businessName}
                          onChange={(e) => setQuickInvoiceData((prev) => ({ ...prev, businessName: e.target.value }))}
                          className={`w-full px-4 py-4 border-2 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-400 transition-all duration-300 group-hover:border-purple-300 text-lg ${
                            validationErrors.businessName ? "border-red-400 bg-red-50" : "border-gray-200"
                          }`}
                          placeholder="e.g. Sarah's Beauty Salon"
                        />
                        {validationErrors.businessName && (
                          <p className="text-red-600 text-sm mt-1 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {validationErrors.businessName}
                          </p>
                        )}
                      </div>

                      <div className="group">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Client Name *</label>
                        <input
                          type="text"
                          value={quickInvoiceData.clientName}
                          onChange={(e) => setQuickInvoiceData((prev) => ({ ...prev, clientName: e.target.value }))}
                          className={`w-full px-4 py-4 border-2 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-400 transition-all duration-300 group-hover:border-purple-300 text-lg ${
                            validationErrors.clientName ? "border-red-400 bg-red-50" : "border-gray-200"
                          }`}
                          placeholder="e.g. John Doe"
                        />
                        {validationErrors.clientName && (
                          <p className="text-red-600 text-sm mt-1 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {validationErrors.clientName}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="group">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Invoice Date *</label>
                        <input
                          type="date"
                          value={quickInvoiceData.invoiceDate}
                          onChange={(e) => setQuickInvoiceData((prev) => ({ ...prev, invoiceDate: e.target.value }))}
                          className={`w-full px-4 py-4 border-2 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-400 transition-all duration-300 group-hover:border-purple-300 text-lg ${
                            validationErrors.invoiceDate ? "border-red-400 bg-red-50" : "border-gray-200"
                          }`}
                        />
                        {validationErrors.invoiceDate && (
                          <p className="text-red-600 text-sm mt-1 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {validationErrors.invoiceDate}
                          </p>
                        )}
                      </div>

                      <div className="group">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Amount (KES) *</label>
                        <input
                          type="number"
                          value={quickInvoiceData.amount}
                          onChange={(e) => setQuickInvoiceData((prev) => ({ ...prev, amount: e.target.value }))}
                          placeholder="5000"
                          min="1"
                          className={`w-full px-4 py-4 border-2 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-400 transition-all duration-300 group-hover:border-purple-300 text-lg ${
                            validationErrors.amount ? "border-red-400 bg-red-50" : "border-gray-200"
                          }`}
                        />
                        {validationErrors.amount && (
                          <p className="text-red-600 text-sm mt-1 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {validationErrors.amount}
                          </p>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={handleQuickGenerate}
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 px-6 rounded-xl font-bold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-lg flex items-center justify-center"
                    >
                      Generate Invoice
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </button>

                    <div className="text-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 inline mr-1" />
                      Takes less than 30 seconds
                    </div>
                  </div>
                ) : (
                  <InvoiceGenerator onBack={() => setShowInvoiceForm(false)} />
                )}
              </div>
            ) : (
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Your Checkout Page</h2>
                  <p className="text-gray-600">Build professional product catalogs with M-Pesa integration.</p>
                </div>

                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200">
                    <h3 className="font-bold text-gray-900 mb-4">Perfect for:</h3>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        <span>Retail Shops</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        <span>Beauty Salons</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        <span>Mitumba Vendors</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        <span>Electronics</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleCreateCheckout}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-4 px-6 rounded-xl font-bold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-lg flex items-center justify-center"
                  >
                    Create Checkout Page
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </button>

                  <div className="text-center text-sm text-gray-500">
                    <TrendingUp className="w-4 h-4 inline mr-1" />
                    Increase sales by 40% with professional checkout pages
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Everything You Need for Your Business</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Professional tools designed specifically for Kenyan entrepreneurs and small businesses
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-purple-100 hover:border-purple-300 transition-all duration-300 hover:shadow-lg group"
              >
                <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-full w-12 h-12 flex items-center justify-center mb-4 group-hover:from-purple-200 group-hover:to-pink-200 transition-all duration-300">
                  <div className="text-purple-600">{feature.icon}</div>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Get started in just 3 simple steps</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {steps.map((step, index) => (
              <div key={index} className="text-center relative">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold shadow-lg">
                  {step.number}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-1/2 transform translate-x-8 w-24 h-0.5 bg-gradient-to-r from-purple-300 to-pink-300"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Trusted by Kenyan Entrepreneurs</h2>
            <p className="text-xl text-gray-600">See what our users say about LipaChap</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-purple-100 shadow-lg"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                <div>
                  <p className="font-bold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.business}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Grow Your Business?</h2>
          <p className="text-xl text-purple-100 mb-8">
            Join hundreds of Kenyan entrepreneurs using LipaChap to create professional invoices and checkout pages
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => {
                setActiveTab("invoice")
                setShowInvoiceForm(false)
                window.scrollTo({ top: 0, behavior: "smooth" })
              }}
              className="bg-white text-purple-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center"
            >
              <FileText className="w-5 h-5 mr-2" />
              Create Invoice Now
            </button>
            <button
              onClick={() => {
                setActiveTab("checkout")
                window.scrollTo({ top: 0, behavior: "smooth" })
              }}
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-bold hover:bg-white hover:text-purple-600 transition-all duration-300 flex items-center justify-center"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Build Checkout Page
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
     
    </div>
  )
}

export default LandingPage

"use client"

import { useState } from "react"
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
} from "lucide-react"
import InvoiceGenerator from "./InvoiceGenerator"

const LandingPage = ({ onCreateVendor }) => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("invoice") // invoice or checkout
  const [showInvoiceForm, setShowInvoiceForm] = useState(false)

  const handleCreateCheckout = () => {
    navigate("/vendor-setup")
  }

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
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-full w-10 h-10 flex items-center justify-center mr-3">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                LipaChap
              </h1>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-purple-600 transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-gray-600 hover:text-purple-600 transition-colors">
                How it Works
              </a>
              <a href="#testimonials" className="text-gray-600 hover:text-purple-600 transition-colors">
                Reviews
              </a>
            </nav>
          </div>
        </div>
      </header>

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
                          placeholder="e.g. Sarah's Beauty Salon"
                          className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-400 transition-all duration-300 group-hover:border-purple-300 text-lg"
                        />
                      </div>

                      <div className="group">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Client Name *</label>
                        <input
                          type="text"
                          placeholder="e.g. John Doe"
                          className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-400 transition-all duration-300 group-hover:border-purple-300 text-lg"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="group">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Invoice Date *</label>
                        <input
                          type="date"
                          defaultValue={new Date().toISOString().split("T")[0]}
                          className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-400 transition-all duration-300 group-hover:border-purple-300 text-lg"
                        />
                      </div>

                      <div className="group">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Amount (KES) *</label>
                        <input
                          type="number"
                          placeholder="5000"
                          min="1"
                          className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-400 transition-all duration-300 group-hover:border-purple-300 text-lg"
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => setShowInvoiceForm(true)}
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

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
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
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center mb-4">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-full w-10 h-10 flex items-center justify-center mr-3">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold">LipaChap</h3>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                Empowering Kenyan entrepreneurs with professional invoice generation and checkout page creation tools.
                100% free, secure, and designed for local businesses.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">Instagram</span>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.014 5.367 18.647.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.418-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.928.875 1.418 2.026 1.418 3.323s-.49 2.448-1.418 3.244c-.875.807-2.026 1.297-3.323 1.297zm7.83-9.781c-.315 0-.612-.123-.833-.344-.221-.221-.344-.518-.344-.833 0-.315.123-.612.344-.833.221-.221.518-.344.833-.344s.612.123.833.344c.221.221.344.518.344.833 0 .315-.123.612-.344.833-.221.221-.518.344-.833.344zm0 0" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">TikTok</span>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-.88-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#features" className="text-gray-400 hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className="text-gray-400 hover:text-white transition-colors">
                    How it Works
                  </a>
                </li>
                <li>
                  <a href="#testimonials" className="text-gray-400 hover:text-white transition-colors">
                    Reviews
                  </a>
                </li>
                <li>
                  <a href="/about" className="text-gray-400 hover:text-white transition-colors">
                    About
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li>
                  <a href="/contact" className="text-gray-400 hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="/terms" className="text-gray-400 hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="/help" className="text-gray-400 hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">© 2024 LipaChap. All rights reserved. Made with ❤️ for Kenyan entrepreneurs.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage

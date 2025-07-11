"use client"

import { useState, useEffect } from "react"
import VendorSetup from "./components/VendorSetup"
import CheckoutPage from "./components/CheckoutPage"
import Dashboard from "./components/Dashboard"
import LandingPage from "./components/LandingPage"
import Header from "./components/Header"
import Footer from "./components/Footer"
import About from "./pages/About"
import Contact from "./pages/Contact"
import Help from "./pages/Help"
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom"

// Create a layout wrapper component
function Layout({ children }) {
  const location = useLocation()
  const isCheckoutPage = location.pathname.includes("/checkout/")

  return (
    <div className="min-h-screen flex flex-col">
      {!isCheckoutPage && <Header />}
      <main className="flex-1">{children}</main>
      {!isCheckoutPage && <Footer />}
    </div>
  )
}

function App() {
  const [vendors, setVendors] = useState({})
  const [checkouts, setCheckouts] = useState({})

  // Load data from localStorage on app start
  useEffect(() => {
    const savedVendors = localStorage.getItem("lipachap-vendors")
    const savedCheckouts = localStorage.getItem("lipachap-checkouts")

    if (savedVendors) {
      setVendors(JSON.parse(savedVendors))
    }
    if (savedCheckouts) {
      setCheckouts(JSON.parse(savedCheckouts))
    }
  }, [])

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem("lipachap-vendors", JSON.stringify(vendors))
  }, [vendors])

  useEffect(() => {
    localStorage.setItem("lipachap-checkouts", JSON.stringify(checkouts))
  }, [checkouts])

  const createVendor = (vendorData) => {
    const vendorId = Date.now().toString()
    const newVendor = {
      ...vendorData,
      id: vendorId,
      createdAt: new Date().toISOString(),
    }
    setVendors((prev) => ({
      ...prev,
      [vendorId]: newVendor,
    }))
    return vendorId
  }

  const createCheckout = (vendorId, checkoutData) => {
    const checkoutId = Date.now().toString()
    const checkoutUrl = `${window.location.origin}/checkout/${vendorId}/${checkoutId}`

    const newCheckout = {
      ...checkoutData,
      id: checkoutId,
      vendorId,
      url: checkoutUrl,
      createdAt: new Date().toISOString(),
      orders: [],
    }

    setCheckouts((prev) => ({
      ...prev,
      [checkoutId]: newCheckout,
    }))

    return { checkoutId, url: checkoutUrl }
  }

  const addOrder = (checkoutId, orderData) => {
    setCheckouts((prev) => ({
      ...prev,
      [checkoutId]: {
        ...prev[checkoutId],
        orders: [
          ...(prev[checkoutId]?.orders || []),
          {
            ...orderData,
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
          },
        ],
      },
    }))
  }

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<LandingPage onCreateVendor={createVendor} />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/help" element={<Help />} />
          <Route
            path="/vendor-setup"
            element={<VendorSetup onCreateVendor={createVendor} onCreateCheckout={createCheckout} />}
          />
          <Route
            path="/dashboard/:vendorId"
            element={<Dashboard vendors={vendors} checkouts={checkouts} onCreateCheckout={createCheckout} />}
          />
          <Route
            path="/checkout/:vendorId/:checkoutId"
            element={<CheckoutPage vendors={vendors} checkouts={checkouts} onAddOrder={addOrder} />}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App

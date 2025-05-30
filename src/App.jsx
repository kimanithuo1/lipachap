"use client"

import { useState, useEffect } from "react"
import VendorSetup from "./components/VendorSetup"
import CheckoutPage from "./components/CheckoutPage"
import Dashboard from "./components/Dashboard"
import InvoiceCreator from "./components/InvoiceCreator"
import InvoiceDisplay from "./components/InvoiceDisplay"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"

function App() {
  const [vendors, setVendors] = useState({})
  const [checkouts, setCheckouts] = useState({})
  const [invoices, setInvoices] = useState({})

  // Load data from localStorage on app start
  useEffect(() => {
    const savedVendors = localStorage.getItem("lipachap-vendors")
    const savedCheckouts = localStorage.getItem("lipachap-checkouts")
    const savedInvoices = localStorage.getItem("lipachap-invoices")

    if (savedVendors) {
      setVendors(JSON.parse(savedVendors))
    }
    if (savedCheckouts) {
      setCheckouts(JSON.parse(savedCheckouts))
    }
    if (savedInvoices) {
      setInvoices(JSON.parse(savedInvoices))
    }
  }, [])

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem("lipachap-vendors", JSON.stringify(vendors))
  }, [vendors])

  useEffect(() => {
    localStorage.setItem("lipachap-checkouts", JSON.stringify(checkouts))
  }, [checkouts])

  useEffect(() => {
    localStorage.setItem("lipachap-invoices", JSON.stringify(invoices))
  }, [invoices])

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

  const createInvoice = (invoiceData) => {
    const invoiceId = invoiceData.id
    setInvoices((prev) => ({
      ...prev,
      [invoiceId]: invoiceData,
    }))
    return invoiceId
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
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
        <Routes>
          <Route path="/" element={<VendorSetup onCreateVendor={createVendor} onCreateCheckout={createCheckout} />} />
          <Route
            path="/dashboard/:vendorId"
            element={<Dashboard vendors={vendors} checkouts={checkouts} onCreateCheckout={createCheckout} />}
          />
          <Route
            path="/checkout/:vendorId/:checkoutId"
            element={<CheckoutPage vendors={vendors} checkouts={checkouts} onAddOrder={addOrder} />}
          />
          <Route
            path="/invoice/create/:vendorId"
            element={
              <InvoiceCreator
                vendor={vendors[window.location.pathname.split("/")[3]]}
                onCreateInvoice={createInvoice}
              />
            }
          />
          <Route
            path="/invoice/:invoiceId"
            element={<InvoiceDisplay invoices={invoices} vendor={Object.values(vendors)[0]} />}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App

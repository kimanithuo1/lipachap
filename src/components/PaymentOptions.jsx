"use client"

import { useState } from "react"
import { CreditCard, Smartphone, DollarSign, ArrowLeft, Loader } from "lucide-react"

const PaymentOptions = ({ checkout, customerData, totalAmount, onPaymentSuccess, onBack }) => {
  const [selectedMethod, setSelectedMethod] = useState("")
  const [processing, setProcessing] = useState(false)
  const [mpesaPhone, setMpesaPhone] = useState(customerData.phone)

  const handlePayment = async (method) => {
    setProcessing(true)

    // Simulate payment processing
    setTimeout(() => {
      const paymentData = {
        method,
        transactionId: `TXN${Date.now()}`,
        timestamp: new Date().toISOString(),
        ...(method === "mpesa" && { mpesaPhone }),
      }

      setProcessing(false)
      onPaymentSuccess(paymentData)
    }, 3000)
  }

  if (processing) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        <Loader className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-spin" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Processing Payment...</h3>
        <p className="text-gray-600">Please wait while we process your payment.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center mb-6">
        <button onClick={onBack} className="mr-3 p-2 text-gray-600 hover:text-gray-900">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h3 className="text-lg font-semibold text-gray-900">Choose Payment Method</h3>
      </div>

      <div className="mb-6 bg-gray-50 rounded-lg p-4">
        <div className="flex justify-between items-center">
          <span className="font-medium text-gray-900">Total to Pay:</span>
          <span className="text-xl font-bold text-blue-600">KSH {totalAmount.toLocaleString()}</span>
        </div>
      </div>

      <div className="space-y-3">
        {checkout.paymentMethods.mpesa && (
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <Smartphone className="w-6 h-6 text-green-600 mr-3" />
              <div>
                <h4 className="font-medium text-gray-900">M-Pesa</h4>
                <p className="text-sm text-gray-600">Pay with your mobile money</p>
              </div>
            </div>

            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">M-Pesa Phone Number</label>
              <input
                type="tel"
                value={mpesaPhone}
                onChange={(e) => setMpesaPhone(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="+254 700 000 000"
              />
            </div>

            <button
              onClick={() => handlePayment("mpesa")}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              Pay with M-Pesa
            </button>
          </div>
        )}

        {checkout.paymentMethods.stripe && (
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <CreditCard className="w-6 h-6 text-blue-600 mr-3" />
              <div>
                <h4 className="font-medium text-gray-900">Credit/Debit Card</h4>
                <p className="text-sm text-gray-600">Visa, Mastercard, American Express</p>
              </div>
            </div>

            <button
              onClick={() => handlePayment("stripe")}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Pay with Card
            </button>
          </div>
        )}

        {checkout.paymentMethods.paypal && (
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <DollarSign className="w-6 h-6 text-yellow-600 mr-3" />
              <div>
                <h4 className="font-medium text-gray-900">PayPal</h4>
                <p className="text-sm text-gray-600">Pay with your PayPal account</p>
              </div>
            </div>

            <button
              onClick={() => handlePayment("paypal")}
              className="w-full bg-yellow-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-yellow-600 transition-colors"
            >
              Pay with PayPal
            </button>
          </div>
        )}
      </div>

      <div className="mt-6 text-center">
        <p className="text-xs text-gray-500">Your payment is secured with 256-bit SSL encryption</p>
      </div>
    </div>
  )
}

export default PaymentOptions

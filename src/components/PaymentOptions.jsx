"use client"

import { useState } from "react"
import { CreditCard, Smartphone, DollarSign, ArrowLeft, Loader, Sparkles, Shield } from "lucide-react"

const PaymentOptions = ({ checkout, customerData, cartItems, totalAmount, onPaymentSuccess, onBack }) => {
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
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 text-center border border-white/20">
        <div className="bg-gradient-to-r from-blue-400 to-purple-500 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-lg">
          <Loader className="w-10 h-10 text-white animate-spin" />
        </div>
        <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Processing Payment...
        </h3>
        <p className="text-gray-600">Please wait while we securely process your payment.</p>
        <div className="flex items-center justify-center mt-4 text-sm text-gray-500">
          <Sparkles className="w-4 h-4 mr-1 text-yellow-500" />
          <span>Secured with 256-bit encryption</span>
          <Sparkles className="w-4 h-4 ml-1 text-yellow-500" />
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20">
      <div className="flex items-center mb-6">
        <button
          onClick={onBack}
          className="mr-3 p-3 text-gray-600 hover:text-gray-900 bg-gray-100 rounded-full hover:bg-gray-200 transition-all duration-300"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Choose Payment Method
        </h3>
      </div>

      {/* Order Summary */}
      <div className="mb-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4 border-2 border-purple-100">
        <h4 className="font-bold text-gray-800 mb-3">Order Summary</h4>
        {cartItems.map((item) => (
          <div key={item.id} className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">
              {item.name} x {item.quantity}
            </span>
            <span className="text-sm font-semibold text-gray-800">KSH {item.total.toLocaleString()}</span>
          </div>
        ))}
        <div className="border-t border-purple-200 pt-3 mt-3">
          <div className="flex justify-between items-center">
            <span className="font-bold text-gray-900">Total to Pay:</span>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              KSH {totalAmount.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {checkout.paymentMethods.mpesa && (
          <div className="border-2 border-green-200 rounded-2xl p-6 bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 transition-all duration-300">
            <div className="flex items-center mb-4">
              <div className="bg-gradient-to-r from-green-400 to-emerald-500 rounded-full p-3 mr-4 shadow-lg">
                <Smartphone className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">M-Pesa</h4>
                <p className="text-sm text-gray-600">Pay with your mobile money</p>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">M-Pesa Phone Number</label>
              <input
                type="tel"
                value={mpesaPhone}
                onChange={(e) => setMpesaPhone(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-200 focus:border-green-400 transition-all duration-300"
                placeholder="+254 700 000 000"
              />
            </div>

            <button
              onClick={() => handlePayment("mpesa")}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-4 rounded-xl font-bold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Pay KSH {totalAmount.toLocaleString()} with M-Pesa
            </button>
          </div>
        )}

        {checkout.paymentMethods.stripe && (
          <div className="border-2 border-blue-200 rounded-2xl p-6 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition-all duration-300">
            <div className="flex items-center mb-4">
              <div className="bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full p-3 mr-4 shadow-lg">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">Credit/Debit Card</h4>
                <p className="text-sm text-gray-600">Visa, Mastercard, American Express</p>
              </div>
            </div>

            <button
              onClick={() => handlePayment("stripe")}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-4 rounded-xl font-bold hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Pay KSH {totalAmount.toLocaleString()} with Card
            </button>
          </div>
        )}

        {checkout.paymentMethods.paypal && (
          <div className="border-2 border-yellow-200 rounded-2xl p-6 bg-gradient-to-r from-yellow-50 to-orange-50 hover:from-yellow-100 hover:to-orange-100 transition-all duration-300">
            <div className="flex items-center mb-4">
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full p-3 mr-4 shadow-lg">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">PayPal</h4>
                <p className="text-sm text-gray-600">Pay with your PayPal account</p>
              </div>
            </div>

            <button
              onClick={() => handlePayment("paypal")}
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 text-white py-3 px-4 rounded-xl font-bold hover:from-yellow-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Pay KSH {totalAmount.toLocaleString()} with PayPal
            </button>
          </div>
        )}
      </div>

      <div className="mt-6 text-center">
        <div className="flex items-center justify-center text-xs text-gray-500">
          <Shield className="w-4 h-4 mr-1 text-green-500" />
          <span>Your payment is secured with 256-bit SSL encryption</span>
        </div>
      </div>
    </div>
  )
}

export default PaymentOptions

"use client"

import { useEffect } from "react"
import { CheckCircle, AlertCircle, X, Info } from "lucide-react"

const Toast = ({ message, type = "success", isVisible, onClose, duration = 4000 }) => {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [isVisible, duration, onClose])

  if (!isVisible) return null

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case "error":
        return <AlertCircle className="w-5 h-5 text-red-600" />
      case "info":
        return <Info className="w-5 h-5 text-blue-600" />
      default:
        return <CheckCircle className="w-5 h-5 text-green-600" />
    }
  }

  const getStyles = () => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200 text-green-800"
      case "error":
        return "bg-red-50 border-red-200 text-red-800"
      case "info":
        return "bg-blue-50 border-blue-200 text-blue-800"
      default:
        return "bg-green-50 border-green-200 text-green-800"
    }
  }

  return (
    <div className="fixed top-4 right-4 z-50 animate-fadeInUp">
      <div className={`flex items-center p-4 rounded-xl border-2 shadow-lg backdrop-blur-sm ${getStyles()}`}>
        <div className="flex items-center">
          {getIcon()}
          <span className="ml-3 font-medium">{message}</span>
        </div>
        <button onClick={onClose} className="ml-4 p-1 hover:bg-black/10 rounded-full transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

export default Toast

"use client"
import { Calendar, Hash, User } from "lucide-react"

const InvoicePreview = ({ invoiceData, vendor, className = "" }) => {
  return (
    <div className={`bg-white rounded-xl shadow-lg border border-gray-200 p-8 ${className}`}>
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Invoice Preview</h3>
        <p className="text-sm text-gray-600">Live preview of your invoice</p>
      </div>

      {/* Invoice Header */}
      <div className="flex items-start justify-between mb-8 pb-6 border-b-2 border-gray-200">
        <div className="flex items-center">
          {vendor?.logo && (
            <img
              src={vendor.logo || "/placeholder.svg"}
              alt={vendor.businessName}
              className="w-16 h-16 rounded-lg object-cover mr-4 border-2 border-gray-200"
            />
          )}
          <div>
            <h1 className="text-xl font-bold text-gray-900">{vendor?.businessName || "Your Business"}</h1>
            <p className="text-gray-600">{vendor?.ownerName || "Owner Name"}</p>
            <p className="text-sm text-gray-500">{vendor?.phone || "Phone Number"}</p>
            {vendor?.email && <p className="text-sm text-gray-500">{vendor.email}</p>}
          </div>
        </div>

        <div className="text-right">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center mb-2">
              <Hash className="w-4 h-4 text-blue-600 mr-1" />
              <span className="text-sm font-semibold text-blue-800">INVOICE</span>
            </div>
            <p className="text-lg font-bold text-blue-900">{invoiceData.invoiceNumber}</p>
          </div>
        </div>
      </div>

      {/* Client & Date Info */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div>
          <h3 className="text-sm font-bold text-gray-900 mb-3 border-b border-gray-200 pb-1 flex items-center">
            <User className="w-4 h-4 mr-1" />
            BILL TO:
          </h3>
          <div className="space-y-1 text-sm">
            <p className="font-semibold text-gray-900">{invoiceData.clientName || "Client Name"}</p>
            <p className="text-gray-600">{invoiceData.clientPhone || "Phone Number"}</p>
            {invoiceData.clientEmail && <p className="text-gray-600">{invoiceData.clientEmail}</p>}
            {invoiceData.clientAddress && <p className="text-gray-600">{invoiceData.clientAddress}</p>}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold text-gray-900 mb-3 border-b border-gray-200 pb-1 flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            INVOICE DETAILS:
          </h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Date:</span>
              <span className="font-medium">{invoiceData.date || "Date"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Due Date:</span>
              <span className="font-medium">{invoiceData.dueDate || "Due Date"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-6">
        <h3 className="text-sm font-bold text-gray-900 mb-3 border-b border-gray-200 pb-2">ITEMS:</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 px-3 py-2 text-left font-semibold text-gray-900">Description</th>
                <th className="border border-gray-200 px-3 py-2 text-center font-semibold text-gray-900">Qty</th>
                <th className="border border-gray-200 px-3 py-2 text-right font-semibold text-gray-900">Rate</th>
                <th className="border border-gray-200 px-3 py-2 text-right font-semibold text-gray-900">Total</th>
              </tr>
            </thead>
            <tbody>
              {invoiceData.items.map((item, index) => (
                <tr key={index}>
                  <td className="border border-gray-200 px-3 py-2">{item.description || `Item ${index + 1}`}</td>
                  <td className="border border-gray-200 px-3 py-2 text-center font-medium">{item.quantity}</td>
                  <td className="border border-gray-200 px-3 py-2 text-right font-medium">
                    KES {(item.rate || 0).toLocaleString()}
                  </td>
                  <td className="border border-gray-200 px-3 py-2 text-right font-bold">
                    KES {((item.quantity || 0) * (item.rate || 0)).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Totals */}
      <div className="flex justify-end mb-6">
        <div className="w-64 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal:</span>
            <span className="font-medium">KES {invoiceData.subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">VAT ({invoiceData.taxRate}%):</span>
            <span className="font-medium">KES {invoiceData.taxAmount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-200">
            <span>Total:</span>
            <span>KES {invoiceData.total.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Notes */}
      {invoiceData.notes && (
        <div className="pt-6 border-t border-gray-200">
          <h4 className="font-bold text-gray-900 mb-2 text-sm">Notes:</h4>
          <p className="text-sm text-gray-600">{invoiceData.notes}</p>
        </div>
      )}
    </div>
  )
}

export default InvoicePreview

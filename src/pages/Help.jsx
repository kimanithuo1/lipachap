"use client"

import { useState } from "react"
import {
  Search,
  FileText,
  Download,
  Share2,
  Printer,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  Book,
  MessageCircle,
  Mail,
} from "lucide-react"

const Help = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedFaq, setExpandedFaq] = useState(null)

  const categories = [
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Creating Invoices",
      description: "Learn how to create professional invoices",
      articles: 12,
    },
    {
      icon: <Download className="w-6 h-6" />,
      title: "Downloading & Sharing",
      description: "Export and share your invoices",
      articles: 8,
    },
    {
      icon: <Printer className="w-6 h-6" />,
      title: "Printing",
      description: "Print your invoices professionally",
      articles: 5,
    },
    {
      icon: <Share2 className="w-6 h-6" />,
      title: "WhatsApp Integration",
      description: "Share invoices via WhatsApp",
      articles: 6,
    },
  ]

  const faqs = [
    {
      question: "How do I create my first invoice?",
      answer:
        "Creating your first invoice is easy! Simply go to the homepage, fill in your business name, client name, invoice date, and amount, then click 'Generate Invoice'. You'll be guided through a 3-step process to complete your professional invoice.",
    },
    {
      question: "Why isn't my PDF downloading?",
      answer:
        "If your PDF isn't downloading, try these steps: 1) Make sure your browser allows downloads from our site, 2) Check if you have a popup blocker enabled, 3) Try using a different browser, 4) Ensure you have enough storage space on your device.",
    },
    {
      question: "Can I edit an invoice after creating it?",
      answer:
        "Yes! You can edit your invoice at any step before the final download. Use the 'Back' and 'Edit' buttons to modify your invoice details, items, or totals. Your changes are automatically saved as you work.",
    },
    {
      question: "How do I add my business logo?",
      answer:
        "In Step 1 of the invoice creation process, you'll find a 'Business Logo' upload field. Click 'Choose File' and select your logo image (PNG, JPG, or GIF). The logo will appear on your invoice header.",
    },
    {
      question: "Is my data secure?",
      answer:
        "Your data is stored locally in your browser and never sent to our servers unless you explicitly share an invoice. We use industry-standard security practices to protect your information.",
    },
    {
      question: "Can I use LipaChap offline?",
      answer:
        "LipaChap works best with an internet connection, but once loaded, you can create invoices offline. However, sharing features and some advanced functions require an internet connection.",
    },
    {
      question: "How do I share an invoice via WhatsApp?",
      answer:
        "After creating your invoice, click the 'Share' button in the preview step. This will open WhatsApp with a pre-formatted message containing your invoice details that you can send to your client.",
    },
    {
      question: "What if I need help with something not covered here?",
      answer:
        "We're here to help! Contact us through our Contact page, send an email to hello@lipachap.com, or call +254 700 000 000. We typically respond within 24 hours.",
    },
  ]

  const quickGuides = [
    {
      title: "Creating Your First Invoice",
      description: "Step-by-step guide to creating professional invoices",
      duration: "3 min read",
      icon: <Book className="w-5 h-5" />,
    },
    {
      title: "Customizing Invoice Templates",
      description: "Learn how to personalize your invoices",
      duration: "5 min read",
      icon: <Book className="w-5 h-5" />,
    },
    {
      title: "Sharing Invoices Effectively",
      description: "Best practices for sharing invoices with clients",
      duration: "4 min read",
      icon: <Book className="w-5 h-5" />,
    },
  ]

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50">
      {/* Hero Section */}
      <section className="pt-16 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
            Help Center
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8">
            Find answers to your questions and learn how to make the most of LipaChap
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for help articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-400 transition-all duration-300 text-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Browse by Category</h2>
            <p className="text-xl text-gray-600">Find help articles organized by topic</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-purple-100 hover:border-purple-300 transition-all duration-300 hover:shadow-lg cursor-pointer group"
              >
                <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-full w-12 h-12 flex items-center justify-center mb-4 group-hover:from-purple-200 group-hover:to-pink-200 transition-all duration-300">
                  <div className="text-purple-600">{category.icon}</div>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{category.title}</h3>
                <p className="text-gray-600 text-sm mb-3">{category.description}</p>
                <p className="text-purple-600 text-sm font-semibold">{category.articles} articles</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Guides */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Quick Start Guides</h2>
            <p className="text-xl text-gray-600">Get up and running quickly with these essential guides</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {quickGuides.map((guide, index) => (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-purple-100 hover:border-purple-300 transition-all duration-300 hover:shadow-lg cursor-pointer"
              >
                <div className="flex items-center mb-4">
                  <div className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg w-10 h-10 flex items-center justify-center mr-3">
                    <div className="text-blue-600">{guide.icon}</div>
                  </div>
                  <span className="text-sm text-gray-500">{guide.duration}</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{guide.title}</h3>
                <p className="text-gray-600">{guide.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">Quick answers to the most common questions</p>
          </div>

          <div className="space-y-4">
            {filteredFaqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-sm rounded-2xl border border-purple-100 hover:border-purple-300 transition-all duration-300"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-purple-50 rounded-2xl transition-colors"
                >
                  <span className="font-semibold text-gray-900 flex items-center">
                    <HelpCircle className="w-5 h-5 mr-3 text-purple-600" />
                    {faq.question}
                  </span>
                  {expandedFaq === index ? (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-500" />
                  )}
                </button>
                {expandedFaq === index && (
                  <div className="px-6 pb-4">
                    <div className="pl-8 text-gray-700 leading-relaxed">{faq.answer}</div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredFaqs.length === 0 && searchQuery && (
            <div className="text-center py-12">
              <HelpCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-600">Try searching with different keywords or browse our categories above.</p>
            </div>
          )}
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-8 md:p-12 text-center text-white">
            <MessageCircle className="w-16 h-16 mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">Still Need Help?</h2>
            <p className="text-xl text-purple-100 mb-8">
              Can't find what you're looking for? Our support team is here to help you succeed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="bg-white text-purple-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 inline-flex items-center"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Contact Support
              </a>
              <a
                href="mailto:hello@lipachap.com"
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-bold hover:bg-white hover:text-purple-600 transition-all duration-300 inline-flex items-center"
              >
                <Mail className="w-5 h-5 mr-2" />
                Email Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Help

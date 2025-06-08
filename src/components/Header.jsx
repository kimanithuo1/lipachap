"use client"

import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { FileText, Menu, X, Home } from "lucide-react"

const Header = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const isHomePage = location.pathname === "/"

  const handleHomeClick = () => {
    navigate("/")
    setIsMobileMenuOpen(false)
  }

  const scrollToSection = (sectionId) => {
    if (isHomePage) {
      const element = document.getElementById(sectionId)
      if (element) {
        element.scrollIntoView({ behavior: "smooth" })
      }
    } else {
      navigate(`/#${sectionId}`)
    }
    setIsMobileMenuOpen(false)
  }

  const navigationItems = [
    { label: "Features", action: () => scrollToSection("features") },
    { label: "How it Works", action: () => scrollToSection("how-it-works") },
    { label: "Reviews", action: () => scrollToSection("testimonials") },
    { label: "About", action: () => navigate("/about") },
    { label: "Contact", action: () => navigate("/contact") },
    { label: "Help", action: () => navigate("/help") },
  ]

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button onClick={handleHomeClick} className="flex items-center group">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-full w-10 h-10 flex items-center justify-center mr-3 group-hover:shadow-lg transition-all duration-300">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              LipaChap
            </h1>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {!isHomePage && (
              <button
                onClick={handleHomeClick}
                className="flex items-center text-gray-600 hover:text-purple-600 transition-colors font-medium"
              >
                <Home className="w-4 h-4 mr-2" />
                Home
              </button>
            )}
            {navigationItems.map((item, index) => (
              <button
                key={index}
                onClick={item.action}
                className="text-gray-600 hover:text-purple-600 transition-colors font-medium"
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 bg-white/95 backdrop-blur-sm">
            <div className="space-y-2">
              {!isHomePage && (
                <button
                  onClick={handleHomeClick}
                  className="flex items-center w-full px-4 py-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 transition-colors font-medium rounded-lg"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Home
                </button>
              )}
              {navigationItems.map((item, index) => (
                <button
                  key={index}
                  onClick={item.action}
                  className="block w-full text-left px-4 py-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 transition-colors font-medium rounded-lg"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header

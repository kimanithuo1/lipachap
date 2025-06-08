"use client"

import { FileText, Users, Target, Award, Heart, Lightbulb } from "lucide-react"

const About = () => {
  const stats = [
    { label: "Active Users", value: "500+", icon: <Users className="w-6 h-6" /> },
    { label: "Invoices Generated", value: "10,000+", icon: <FileText className="w-6 h-6" /> },
    { label: "Businesses Served", value: "300+", icon: <Target className="w-6 h-6" /> },
    { label: "Customer Satisfaction", value: "98%", icon: <Award className="w-6 h-6" /> },
  ]

  const team = [
    {
      name: "David Kiprotich",
      role: "Founder & CEO",
      bio: "Passionate about empowering Kenyan entrepreneurs with digital tools.",
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      name: "Grace Wanjiku",
      role: "Product Designer",
      bio: "Creating beautiful, user-friendly experiences for small businesses.",
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      name: "John Mwangi",
      role: "Lead Developer",
      bio: "Building robust, scalable solutions for the Kenyan market.",
      image: "/placeholder.svg?height=200&width=200",
    },
  ]

  const values = [
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Empowerment",
      description: "We believe every Kenyan entrepreneur deserves access to professional business tools.",
    },
    {
      icon: <Lightbulb className="w-8 h-8" />,
      title: "Innovation",
      description: "We continuously innovate to solve real problems faced by local businesses.",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Community",
      description: "We're building a community of successful entrepreneurs across Kenya.",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50">
      {/* Hero Section */}
      <section className="pt-16 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
            About LipaChap
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
            We're on a mission to empower Kenyan entrepreneurs with professional, accessible business tools that help
            them grow and succeed.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <div className="text-purple-600">{stat.icon}</div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-xl border border-white/20">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Story</h2>
            <div className="prose prose-lg mx-auto text-gray-700 leading-relaxed">
              <p className="mb-6">
                LipaChap was born from a simple observation: too many talented Kenyan entrepreneurs were struggling with
                basic business administration tasks that took time away from what they do best – serving their
                customers.
              </p>
              <p className="mb-6">
                We saw small business owners spending hours creating invoices in Word documents, struggling with payment
                collection, and missing out on sales because they didn't have professional-looking checkout pages. We
                knew there had to be a better way.
              </p>
              <p className="mb-6">
                That's why we built LipaChap – a completely free, easy-to-use platform that gives every Kenyan
                entrepreneur access to the same professional tools that big businesses use. No monthly fees, no hidden
                costs, no complicated setup.
              </p>
              <p>
                Today, we're proud to serve hundreds of businesses across Kenya, from beauty salons in Nairobi to
                electronics shops in Mombasa, helping them save time, look professional, and grow their revenue.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600">The principles that guide everything we do</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 text-center border border-purple-100 hover:border-purple-300 transition-all duration-300 hover:shadow-lg"
              >
                <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                  <div className="text-purple-600">{value.icon}</div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-600">The people behind LipaChap</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 text-center border border-purple-100 hover:border-purple-300 transition-all duration-300 hover:shadow-lg"
              >
                <img
                  src={member.image || "/placeholder.svg"}
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto mb-6 object-cover border-4 border-purple-200"
                />
                <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-purple-600 font-semibold mb-4">{member.role}</p>
                <p className="text-gray-600 leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Join Our Community?</h2>
          <p className="text-xl text-purple-100 mb-8">
            Start creating professional invoices and checkout pages today – completely free!
          </p>
          <a
            href="/"
            className="bg-white text-purple-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 inline-flex items-center"
          >
            Get Started Now
            <FileText className="w-5 h-5 ml-2" />
          </a>
        </div>
      </section>
    </div>
  )
}

export default About

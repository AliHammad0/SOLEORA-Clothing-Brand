
import React, { useState } from 'react';
import {
  Camera,
  AtSign,
  PlayCircle,
  Send,
  Mail,
} from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: 'Saimon Fernandes',
    email: 'saimon@domain.com',
    message: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Submitted:', formData);
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans flex flex-col justify-between">
      {/* Navbar */}
      <header className="max-w-7xl w-full mx-auto px-6 py-4 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">
            M
          </div>
          <span className="font-bold text-xl tracking-tight">
            MemoTrade
          </span>
        </div>

        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-600">
          <a href="#features" className="hover:text-black transition-colors">
            Features
          </a>
          <a href="#pricing" className="hover:text-black transition-colors">
            Pricing
          </a>
          <a href="#contact" className="text-black font-semibold">
            Contact Us
          </a>
        </nav>

        <div className="flex items-center space-x-4">
          <button type="button" className="text-sm font-medium text-gray-700 hover:text-black px-3 py-2">
            Login
          </button>
          <button type="button" className="text-sm font-medium bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800 transition-colors shadow-sm">
            Sign Up
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main
        id="contact"
        className="max-w-7xl w-full mx-auto px-6 py-12 lg:py-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch flex-grow"
      >
        {/* Left Card */}
        <section className="lg:col-span-5 bg-gradient-to-br from-teal-50 via-teal-100/40 to-emerald-50 rounded-3xl p-8 lg:p-12 flex flex-col justify-between relative overflow-hidden border border-teal-100/60 shadow-sm">
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-200/30 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex items-center justify-center w-12 h-12 bg-white rounded-xl shadow-sm border border-teal-100 mb-8">
            <div className="w-6 h-6 bg-teal-500 rounded-md flex items-center justify-center text-white text-xs font-bold">
              ⚡
            </div>
          </div>

          <div className="relative z-10 my-auto">
            <p className="text-2xl lg:text-3xl font-medium text-gray-900 leading-tight mb-8">
              "Managing our association's funds has never been easier. The transparency and control are top-notch."
            </p>

            <div className="flex items-center space-x-4">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop"
                alt="Alex Jordan"
                className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
              />
              <div>
                <h4 className="font-semibold text-gray-900 text-base">
                  Alex Jordan
                </h4>
                <p className="text-xs text-gray-500">
                  Finance Lead @ Eco
                </p>
              </div>
            </div>
          </div>

          <div className="relative z-10 flex items-center space-x-3 pt-8 border-t border-teal-200/40">
            <div className="flex -space-x-2">
              <img
                className="w-8 h-8 rounded-full border-2 border-white object-cover"
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100"
                alt="User"
              />
              <img
                className="w-8 h-8 rounded-full border-2 border-white object-cover"
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100"
                alt="User"
              />
              <img
                className="w-8 h-8 rounded-full border-2 border-white object-cover"
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100"
                alt="User"
              />
            </div>
            <span className="text-xs text-gray-600 font-medium">
              +10k Trust MemoTrade
            </span>
          </div>
        </section>

        {/* Right Card: Contact Form */}
        <section className="lg:col-span-7 bg-gray-50/70 border border-gray-100 rounded-3xl p-8 lg:p-12 flex flex-col justify-center shadow-sm">
          <div className="text-center max-w-md mx-auto mb-8">
            <span className="text-xs font-semibold uppercase tracking-wider text-teal-600 mb-2 block">
              Support
            </span>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
              Contact Us
            </h1>
            <p className="text-sm text-gray-500">
              Reach out to us, and our team will get back to you promptly.
            </p>
          </div>

          <div className="flex justify-center mb-8">
            <a
              href="mailto:support@memotrade.com"
              className="inline-flex items-center space-x-2 bg-white px-4 py-2 rounded-full border border-gray-200 text-xs font-medium text-gray-700 hover:border-teal-500 hover:text-teal-600 transition-colors shadow-sm"
            >
              <Mail className="w-4 h-4 text-teal-500" />
              <span>support@memotrade.com</span>
            </a>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5 max-w-lg mx-auto w-full"
          >
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all shadow-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@domain.com"
                required
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all shadow-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
                How can we help?
              </label>
              <textarea
                name="message"
                rows="4"
                value={formData.message}
                onChange={handleChange}
                placeholder="Write your message here..."
                required
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all resize-none shadow-sm"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white font-medium py-3.5 px-6 rounded-xl hover:bg-gray-800 focus:ring-4 focus:ring-gray-200 transition-all flex items-center justify-center space-x-2 shadow-md group"
            >
              <span>Send Message</span>
              <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </section>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl w-full mx-auto px-6 py-8 border-t border-gray-100">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
            Connect With Us
          </span>

          <div className="flex items-center gap-4 sm:gap-8">
            <a
              href="#instagram"
              aria-label="Instagram"
              className="flex items-center space-x-2 text-gray-600 hover:text-pink-600 transition-colors py-2 px-3 rounded-lg hover:bg-gray-50"
            >
              <div className="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center text-pink-600">
                <Camera className="w-4 h-4" />
              </div>
              <span className="text-xs font-medium">Instagram</span>
            </a>

            <a
              href="#twitter"
              aria-label="Twitter"
              className="flex items-center space-x-2 text-gray-600 hover:text-black transition-colors py-2 px-3 rounded-lg hover:bg-gray-50"
            >
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-900">
                <AtSign className="w-4 h-4" />
              </div>
              <span className="text-xs font-medium">Twitter / X</span>
            </a>

            <a
              href="#youtube"
              aria-label="YouTube"
              className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors py-2 px-3 rounded-lg hover:bg-gray-50"
            >
              <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-600">
                <PlayCircle className="w-4 h-4" />
              </div>
              <span className="text-xs font-medium">YouTube</span>
            </a>
          </div>

          <span className="text-xs text-gray-400">
            © {new Date().getFullYear()} MemoTrade.
          </span>
        </div>
      </footer>
    </div>
  );
};

export default Contact;

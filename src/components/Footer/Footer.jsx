import React from 'react'
import { Link } from 'react-router-dom'
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa'

function Footer() {
  return (
    <footer className="w-full bg-gray-900 text-gray-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Logo & Socials */}
          <div className="flex flex-col justify-between">
            <img
              src="https://cdn.sanity.io/images/kts928pd/production/28563b4f836c667b30238865f796aeb03ae702db-358x357.png"
              alt="Logo"
              width="120"
              className="mb-6 invert"
            />
            <p className="text-gray-400 text-sm mb-4">
              Your go-to blog platform for dev articles & tutorials.
            </p>
            <div className="flex space-x-4 mt-auto">
              <Link to="/" className="text-gray-400 hover:text-white transition-colors"><FaFacebookF /></Link>
              <Link to="/" className="text-gray-400 hover:text-white transition-colors"><FaTwitter /></Link>
              <Link to="/" className="text-gray-400 hover:text-white transition-colors"><FaInstagram /></Link>
              <Link to="/" className="text-gray-400 hover:text-white transition-colors"><FaLinkedinIn /></Link>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-white font-semibold mb-6 text-lg">Company</h3>
            <ul className="space-y-3">
              <li><Link to="/about" className="hover:text-white transition-colors text-gray-400">About Us</Link></li>
              <li><Link to="/careers" className="hover:text-white transition-colors text-gray-400">Careers</Link></li>
              <li><Link to="/blog" className="hover:text-white transition-colors text-gray-400">Blog</Link></li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-white font-semibold mb-6 text-lg">Legal</h3>
            <ul className="space-y-3">
              <li><Link to="/privacy" className="hover:text-white transition-colors text-gray-400">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors text-gray-400">Terms of Service</Link></li>
              <li><Link to="/cookies" className="hover:text-white transition-colors text-gray-400">Cookie Policy</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-6 text-lg">Contact Us</h3>
            <p className="text-gray-400 mb-3">Email: <Link to="mailto:contact@devui.com" className="hover:text-white">contact@devui.com</Link></p>
            <p className="text-gray-400 mb-3">Phone: <Link to="tel:1234567890" className="hover:text-white">(123) 456-7890</Link></p>
            <p className="text-gray-400 text-sm mt-4">
              Follow us for updates and new articles.
            </p>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-16 border-t border-gray-800 pt-6 text-center text-gray-400 text-sm space-y-1">
          <p>&copy; 2025 AnkitUI. All rights reserved.</p>
          <p>Made with ❤️ by the AnkitUI Team</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

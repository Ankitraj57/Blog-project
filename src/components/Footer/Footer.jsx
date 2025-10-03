import React from 'react'
import { Link } from 'react-router-dom'
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa'
import Logo from '../Logo'

function Footer() {
  return (
    <footer className="w-full">
      <div className="w-full fixed bottom-0 right-0 px-4 py-5 bg-gray-900 text-gray-300">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-14">
            {/* Logo & Copyright */}
            <div className="flex flex-col justify-between">
              <div className="mb-6">
                <img src='https://cdn.sanity.io/images/kts928pd/production/28563b4f836c667b30238865f796aeb03ae702db-358x357.png' alt='logo' width="120px" className="invert" />
              </div>
              <div className="mt-2  flex space-x-4">
                <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                  <FaFacebookF />
                </Link>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                  <FaTwitter />
                </Link>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                  <FaInstagram />
                </Link>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                  <FaLinkedinIn />
                </Link>
              </div>
            </div>

            {/* Company Links */}
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link to="/about" className="text-gray-400 hover:text-white">About Us</Link></li>
                <li><Link to="/careers" className="text-gray-400 hover:text-white">Careers</Link></li>
                <li><Link to="/blog" className="text-gray-400 hover:text-white">Blog</Link></li>
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h3 className="text-white font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link to="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</Link></li>
                <li><Link to="/terms" className="text-gray-400 hover:text-white">Terms of Service</Link></li>
                <li><Link to="/cookies" className="text-gray-400 hover:text-white">Cookie Policy</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-white font-semibold mb-4  hover:text-white transition-colors cursor-pointer">Contact Us</h3>
              <p className="text-gray-400 mb-4  hover:text-white transition-colors cursor-pointer">Email: contact@devui.com</p>
              <p className="text-gray-400  hover:text-white transition-colors cursor-pointer">Phone: (123) 456-7890</p>
            </div>
          </div>

            <p className="text-md text-start mt-1 text-gray-400">
                &copy; 2025 AnkitUI. All rights reserved.
              </p>

          {/* Bottom border */}
          <div className="mt-4 pt-6 border-t border-gray-800 text-center text-gray-300 text-sm">
            Made with by ankitUI Team
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
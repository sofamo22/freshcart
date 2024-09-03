import React from 'react';
import { motion } from 'framer-motion'; // Import Framer Motion
import { FaTwitter, FaFacebook, FaLinkedin } from 'react-icons/fa'; // Import react-icons
import logo from '../../assets/freshcart-logo.svg';

export default function Footer() {
  return (
    <footer className="footer footer-center bg-green-700 text-primary-content p-10">
      <div className="container mx-auto px-4">
        <aside className="text-center">
          <img src={logo} alt="Fresh Cart Industries Ltd." className="w-full mb-4" />
          <p className="font-bold">
            Fresh Cart Industries Ltd.
            <br />
            Providing reliable tech since 2003
          </p>
          <p>Copyright © {new Date().getFullYear()} - All rights reserved</p>
        </aside>
        <nav className="mt-4">
          <div className="flex justify-center space-x-4">
            <motion.a
                whileHover={{ scale: 1.2, color: "#1DA1F2" }} // Scale and change color on hover
                transition={{ duration: 0.3 }}
                href="https://www.twitter.com"
            >
              <FaTwitter size={24} />
            </motion.a>
            <motion.a
                whileHover={{ scale: 1.2, color: "#1877F2" }} // Scale and change color on hover
                transition={{ duration: 0.3 }}
                href="https://www.facebook.com"
            >
              <FaFacebook size={24} />
            </motion.a>
            <motion.a
                whileHover={{ scale: 1.2, color: "#0072b1" }} // Scale and change color on hover
                transition={{ duration: 0.3 }}
                href="https://www.linkedin.com"
            >
              <FaLinkedin size={24} />
            </motion.a>
          </div>
        </nav>
      </div>
    </footer>
  );
}
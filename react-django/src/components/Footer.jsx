import React from "react";
import { Github, Linkedin } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-200 mt-auto shadow-inner">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Left Section: Copyright */}
          <div className="text-gray-700 text-sm mb-4 md:mb-0">
            © {currentYear} <strong>Task Management App</strong>. All rights reserved.
          </div>

          {/* Right Section: Social Icons */}
          <div className="flex items-center space-x-6">
            <a
              href="https://github.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 hover:text-black transition-colors duration-200"
              aria-label="GitHub"
            >
              <Github size={24} />
            </a>
            <a
              href="https://linkedin.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 hover:text-blue-700 transition-colors duration-200"
              aria-label="LinkedIn"
            >
              <Linkedin size={24} />
            </a>
          </div>
        </div>

        {/* Tagline Section */}
        <div className="mt-4 text-center text-gray-500 text-sm">
          "Effortless task management for a more productive day."
        </div>
      </div>
    </footer>
  );
};

export default Footer;

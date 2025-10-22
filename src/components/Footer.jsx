import React from 'react';
import { Heart, Github } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-12 bg-white dark:bg-[#1a1a1a] rounded-2xl p-8 border border-gray-100 dark:border-white/5 transition-all duration-300">
      <div className="max-w-6xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          {/* Brand Section */}
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-lg">
                <Heart className="w-5 h-5 text-white" />
              </div>
              MacroGenie
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Your smart nutrition assistant for achieving your health and fitness goals.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900 dark:text-white">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>
                <a href="#dashboard" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Dashboard
                </a>
              </li>
              <li>
                <a href="#tracker" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Food Tracker
                </a>
              </li>
              <li>
                <a href="#recipes" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Recipe Finder
                </a>
              </li>
              <li>
                <a href="#assistant" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Smart Assistant
                </a>
              </li>
            </ul>
          </div>

          {/* Connect Section */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900 dark:text-white">Connect</h4>
            <div className="flex gap-3">
              <a
                href="https://github.com/unsatisfieDg"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-100 dark:bg-[#262626] hover:bg-indigo-100 dark:hover:bg-indigo-900/30 rounded-lg transition-all duration-200 hover-lift group"
                aria-label="GitHub - @unsatisfieDg"
              >
                <Github className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400" />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 dark:border-white/8 my-6"></div>

        {/* Bottom Footer */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
          <p>
            © {currentYear} MacroGenie. Made with{' '}
            <Heart className="w-4 h-4 inline text-red-500 animate-pulse" /> for your health.
          </p>
          <div className="flex gap-4">
            <a href="#privacy" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Privacy Policy
            </a>
            <span>•</span>
            <a href="#terms" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


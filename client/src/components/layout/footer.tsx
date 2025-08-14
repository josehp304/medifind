import { Mail, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">MediFind</h3>
            <p className="text-gray-600 text-sm">
              Making medicine discovery simple and accessible for everyone.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-primary text-sm transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary text-sm transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary text-sm transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">
              Contact
            </h4>
            <p className="text-gray-600 text-sm mb-2 flex items-center">
              <Mail className="w-4 h-4 mr-2" />
              support@medifind.com
            </p>
            <p className="text-gray-600 text-sm flex items-center">
              <Phone className="w-4 h-4 mr-2" />
              +1 (555) 123-4567
            </p>
          </div>
        </div>
        <div className="border-t border-gray-200 mt-8 pt-8 text-center">
          <p className="text-gray-500 text-sm">&copy; 2024 MediFind. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

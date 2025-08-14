import { Link } from "wouter";
import { Pill, Menu } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/" data-testid="link-home">
                <h1 className="text-2xl font-bold text-primary cursor-pointer">
                  <Pill className="inline-block w-6 h-6 mr-2" />
                  MediFind
                </h1>
              </Link>
            </div>
          </div>
          <nav className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link href="/" data-testid="link-nav-home">
                <span className="text-gray-900 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer">
                  Home
                </span>
              </Link>
              <a href="#" className="text-gray-500 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">
                About
              </a>
              <a href="#" className="text-gray-500 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Contact
              </a>
            </div>
          </nav>
          <button 
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="button-mobile-menu"
          >
            <Menu className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-2" data-testid="mobile-menu">
            <div className="flex flex-col space-y-1">
              <Link href="/" data-testid="link-mobile-home">
                <span className="text-gray-900 hover:text-primary block px-3 py-2 rounded-md text-base font-medium cursor-pointer">
                  Home
                </span>
              </Link>
              <a href="#" className="text-gray-500 hover:text-primary block px-3 py-2 rounded-md text-base font-medium">
                About
              </a>
              <a href="#" className="text-gray-500 hover:text-primary block px-3 py-2 rounded-md text-base font-medium">
                Contact
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

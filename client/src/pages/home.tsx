import { Link } from "wouter";
import { Pill, Store } from "lucide-react";

export default function Home() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <section className="text-center mb-12">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Find Medicines Near You</h2>
          <p className="text-xl text-gray-600 mb-8">
            Quickly locate medicines in nearby pharmacies with real-time availability and pricing
          </p>
          
          {/* Search Mode Selector */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Your Search Method</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Medicine-first Search Card */}
              <Link 
                href="/medicine-search"
                data-testid="link-medicine-search"
              >
                <div className="border-2 border-gray-200 rounded-lg p-6 hover:border-primary transition-colors cursor-pointer">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Pill className="w-8 h-8 text-primary" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Search by Medicine</h4>
                    <p className="text-gray-600 text-sm">
                      Enter a medicine name to find nearby pharmacies that have it in stock
                    </p>
                  </div>
                </div>
              </Link>

              {/* Shop-first Search Card */}
              <Link 
                href="/shop-search"
                data-testid="link-shop-search"
              >
                <div className="border-2 border-gray-200 rounded-lg p-6 hover:border-primary transition-colors cursor-pointer">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-secondary bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Store className="w-8 h-8 text-secondary" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Search by Pharmacy</h4>
                    <p className="text-gray-600 text-sm">
                      Select a pharmacy to browse their medicine inventory and availability
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

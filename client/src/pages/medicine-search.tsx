import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/ui/loading-spinner";
import MedicineResultCard from "@/components/medicine-result-card";

interface SearchResult {
  shop: {
    id: number;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
  };
  medicine: {
    id: number;
    name: string;
    description: string;
  };
  price: string;
  stockQuantity: number;
  distance: number;
  inStock: boolean;
  isNearest?: boolean;
}

export default function MedicineSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [shouldSearch, setShouldSearch] = useState(false);

  const { data: results, isLoading, error } = useQuery<SearchResult[]>({
    queryKey: ["/api/medicines/search", { name: searchTerm }],
    enabled: shouldSearch && searchTerm.trim().length > 0,
  });

  const handleSearch = () => {
    if (searchTerm.trim()) {
      setShouldSearch(true);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link href="/" data-testid="link-back-home">
          <button className="flex items-center text-primary hover:text-blue-700 mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Search Options
          </button>
        </Link>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Search by Medicine</h2>
        <p className="text-gray-600">Find pharmacies that have your medicine in stock</p>
      </div>

      {/* Medicine Search Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex gap-4">
          <div className="flex-1">
            <label htmlFor="medicine-input" className="block text-sm font-medium text-gray-700 mb-2">
              Medicine Name
            </label>
            <Input
              id="medicine-input"
              data-testid="input-medicine-name"
              type="text"
              placeholder="Enter medicine name (e.g., Paracetamol, Aspirin)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>
          <div className="flex items-end">
            <Button
              onClick={handleSearch}
              data-testid="button-search-medicine"
              className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              disabled={!searchTerm.trim()}
            >
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-8" data-testid="loading-search">
          <LoadingSpinner />
          <p className="mt-2 text-primary">Searching pharmacies...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-8" data-testid="error-search">
          <p className="text-red-600">Failed to search medicines. Please try again.</p>
        </div>
      )}

      {/* No Results */}
      {shouldSearch && results && results.length === 0 && !isLoading && (
        <div className="text-center py-8" data-testid="no-results">
          <p className="text-gray-600">No pharmacies found with "{searchTerm}" in stock.</p>
        </div>
      )}

      {/* Medicine Search Results */}
      {results && results.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="search-results">
          {results.map((result: SearchResult, index: number) => (
            <MedicineResultCard 
              key={`${result.shop.id}-${result.medicine.id}`}
              result={result}
              data-testid={`card-result-${index}`}
            />
          ))}
        </div>
      )}
    </main>
  );
}

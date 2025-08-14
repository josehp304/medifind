import { useState, useEffect } from "react";
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
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Debounce search term to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Auto-search as user types (with debouncing)
  const { data: results, isLoading, error } = useQuery<SearchResult[]>({
    queryKey: ["/api/medicines/search", { name: debouncedSearchTerm }],
    enabled: debouncedSearchTerm.trim().length >= 2, // Search when at least 2 characters
  });

  // Get list of available medicines for suggestions
  const { data: medicines } = useQuery<{id: number, name: string}[]>({
    queryKey: ["/api/medicines"],
  });

  const handleSearch = () => {
    if (searchTerm.trim().length >= 2) {
      setDebouncedSearchTerm(searchTerm);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Filter medicines for suggestions
  const suggestions = medicines?.filter(medicine => 
    medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
    medicine.name.toLowerCase() !== searchTerm.toLowerCase()
  ).slice(0, 5) || [];

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
            <div className="relative">
              <Input
                id="medicine-input"
                data-testid="input-medicine-name"
                type="text"
                placeholder="Start typing medicine name (e.g., Paracetamol, Aspirin)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
              
              {/* Medicine Suggestions Dropdown */}
              {searchTerm.length > 0 && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 z-10">
                  <div className="p-2">
                    <div className="text-xs text-gray-500 mb-2">Available medicines:</div>
                    {suggestions.map((medicine) => (
                      <button
                        key={medicine.id}
                        onClick={() => {
                          setSearchTerm(medicine.name);
                          setDebouncedSearchTerm(medicine.name);
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded text-sm transition-colors"
                        data-testid={`suggestion-${medicine.id}`}
                      >
                        {medicine.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
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

      {/* Search Status Messages */}
      {searchTerm.length > 0 && searchTerm.length < 2 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-blue-700 text-sm">Type at least 2 characters to start searching...</p>
        </div>
      )}

      {/* Loading State */}
      {isLoading && debouncedSearchTerm.length >= 2 && (
        <div className="text-center py-8" data-testid="loading-search">
          <LoadingSpinner />
          <p className="mt-2 text-primary">Searching for "{debouncedSearchTerm}"...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6" data-testid="error-search">
          <p className="text-red-600">Failed to search medicines. Please try again.</p>
        </div>
      )}

      {/* No Results */}
      {debouncedSearchTerm.length >= 2 && results && results.length === 0 && !isLoading && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6" data-testid="no-results">
          <p className="text-yellow-700">
            No pharmacies found with "<strong>{debouncedSearchTerm}</strong>" in stock.
          </p>
          <p className="text-yellow-600 text-sm mt-1">
            Try searching for: Paracetamol, Aspirin, Ibuprofen, Cetirizine, or Omeprazole
          </p>
        </div>
      )}

      {/* Medicine Search Results */}
      {results && results.length > 0 && (
        <div>
          {/* Results Header */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              Found {results.length} pharmacy{results.length !== 1 ? 's' : ''} with "{debouncedSearchTerm}"
            </h3>
            <p className="text-gray-600 text-sm mt-1">
              Results sorted by distance from your location
              {results.some(r => r.isNearest) && ' • Nearest pharmacy marked'}
            </p>
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="search-results">
            {results.map((result: SearchResult, index: number) => (
              <MedicineResultCard 
                key={`${result.shop.id}-${result.medicine.id}`}
                result={result}
                data-testid={`card-result-${index}`}
              />
            ))}
          </div>
        </div>
      )}
    </main>
  );
}

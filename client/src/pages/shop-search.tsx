import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import LoadingSpinner from "@/components/ui/loading-spinner";

interface Shop {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}

interface InventoryItem {
  id: number;
  shopId: number;
  medicineId: number;
  price: string;
  stockQuantity: number;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
  medicine: {
    id: number;
    name: string;
    description: string;
  };
}

interface ShopInventoryResponse {
  shop: Shop;
  inventory: InventoryItem[];
}

export default function ShopSearch() {
  const [selectedShopId, setSelectedShopId] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");

  const { data: shops, isLoading: shopsLoading } = useQuery<Shop[]>({
    queryKey: ["/api/shops"],
  });

  const { data: shopInventory, isLoading: inventoryLoading } = useQuery<ShopInventoryResponse>({
    queryKey: ["/api/shops", selectedShopId, "medicines"],
    enabled: !!selectedShopId,
  });

  const filteredInventory = shopInventory?.inventory?.filter((item: InventoryItem) =>
    item.medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.medicine.description.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_stock':
        return 'bg-green-100 text-green-800';
      case 'low_stock':
        return 'bg-yellow-100 text-yellow-800';
      case 'out_of_stock':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'in_stock':
        return 'In Stock';
      case 'low_stock':
        return 'Low Stock';
      case 'out_of_stock':
        return 'Out of Stock';
      default:
        return 'Unknown';
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
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Search by Pharmacy</h2>
        <p className="text-gray-600">Browse medicine inventory at your selected pharmacy</p>
      </div>

      {/* Shop Selection Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="shop-select" className="block text-sm font-medium text-gray-700 mb-2">
              Select Pharmacy
            </label>
            <Select value={selectedShopId} onValueChange={setSelectedShopId}>
              <SelectTrigger data-testid="select-pharmacy">
                <SelectValue placeholder="Choose a pharmacy..." />
              </SelectTrigger>
              <SelectContent>
                {shopsLoading ? (
                  <SelectItem value="loading" disabled>Loading pharmacies...</SelectItem>
                ) : (
                  shops?.map((shop: Shop) => (
                    <SelectItem key={shop.id} value={shop.id.toString()}>
                      {shop.name} - {shop.address}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label htmlFor="shop-medicine-input" className="block text-sm font-medium text-gray-700 mb-2">
              Search Medicine in Shop
            </label>
            <Input
              id="shop-medicine-input"
              data-testid="input-search-medicine-shop"
              type="text"
              placeholder={selectedShopId ? "Search medicines in this pharmacy..." : "Search medicines in selected pharmacy..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={!selectedShopId}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>
        </div>
      </div>

      {/* Shop Inventory Results */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Medicine Inventory</h3>
          <p className="text-gray-600 text-sm mt-1">
            {selectedShopId 
              ? `Showing inventory for ${shopInventory?.shop?.name || 'selected pharmacy'}`
              : 'Select a pharmacy above to view available medicines'
            }
          </p>
        </div>
        
        {/* Loading State */}
        {inventoryLoading && (
          <div className="text-center py-8" data-testid="loading-inventory">
            <LoadingSpinner />
            <p className="mt-2 text-primary">Loading inventory...</p>
          </div>
        )}

        {/* Inventory Table */}
        {selectedShopId && !inventoryLoading && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Medicine Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredInventory.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500" data-testid="no-inventory">
                      {searchTerm 
                        ? `No medicines found matching "${searchTerm}"`
                        : 'No medicines available in this pharmacy'
                      }
                    </td>
                  </tr>
                ) : (
                  filteredInventory.map((item: InventoryItem, index: number) => (
                    <tr key={item.id} data-testid={`row-medicine-${index}`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900" data-testid={`text-medicine-name-${index}`}>
                          {item.medicine.name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500" data-testid={`text-medicine-description-${index}`}>
                          {item.medicine.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900" data-testid={`text-price-${index}`}>
                          ₹{item.price}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900" data-testid={`text-stock-${index}`}>
                          {item.stockQuantity} units
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge className={`${getStatusColor(item.status)} text-xs`} data-testid={`badge-status-${index}`}>
                          {getStatusText(item.status)}
                        </Badge>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}

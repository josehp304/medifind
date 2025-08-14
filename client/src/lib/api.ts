import { apiRequest } from "./queryClient";

export interface MedicineSearchResult {
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

export interface Shop {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}

export interface InventoryItem {
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

export interface ShopInventoryResponse {
  shop: Shop;
  inventory: InventoryItem[];
}

export const api = {
  searchMedicines: async (name: string): Promise<MedicineSearchResult[]> => {
    const response = await apiRequest("GET", `/api/medicines/search?name=${encodeURIComponent(name)}`);
    return response.json();
  },

  getShops: async (): Promise<Shop[]> => {
    const response = await apiRequest("GET", "/api/shops");
    return response.json();
  },

  getShopInventory: async (shopId: number): Promise<ShopInventoryResponse> => {
    const response = await apiRequest("GET", `/api/shops/${shopId}/medicines`);
    return response.json();
  },
};

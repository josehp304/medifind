import { MapPin, Navigation, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface MedicineResultCardProps {
  result: {
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
  };
  onReserve?: (reservationData: {
    shopId: number;
    medicineId: number;
    medicineName: string;
    shopName: string;
    price: string;
    availableStock: number;
  }) => void;
}

export default function MedicineResultCard({ result, onReserve }: MedicineResultCardProps) {
  const { shop, medicine, price, stockQuantity, distance, inStock, isNearest } = result;

  const handleReserve = () => {
    if (onReserve && inStock) {
      onReserve({
        shopId: shop.id,
        medicineId: medicine.id,
        medicineName: medicine.name,
        shopName: shop.name,
        price,
        availableStock: stockQuantity,
      });
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 relative ${!inStock ? 'opacity-75' : ''}`}>
      {isNearest && (
        <div className="absolute top-4 right-4">
          <Badge className="bg-secondary text-white">
            <MapPin className="w-3 h-3 mr-1" />
            Nearest
          </Badge>
        </div>
      )}
      
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900" data-testid="text-shop-name">
          {shop.name}
        </h3>
        <p className="text-gray-600 text-sm" data-testid="text-shop-address">
          {shop.address}
        </p>
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-700 font-medium">Price:</span>
          <span className="text-lg font-bold text-gray-900" data-testid="text-price">
            ₹{price}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-700 font-medium">Stock:</span>
          <span 
            className={`font-medium ${inStock ? 'text-secondary' : 'text-red-600'}`}
            data-testid="text-stock"
          >
            {inStock ? `${stockQuantity} units` : 'Out of Stock'}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-700 font-medium">Distance:</span>
          <span className="text-gray-900 font-medium" data-testid="text-distance">
            {distance} km
          </span>
        </div>
      </div>
      
      <div className="flex gap-2 mt-4">
        <Button 
          variant="outline"
          className="flex-1"
          disabled={!inStock}
          data-testid="button-directions"
        >
          <Navigation className="w-4 h-4 mr-2" />
          Directions
        </Button>
        <Button 
          className={`flex-1 ${
            inStock 
              ? 'bg-primary text-white hover:bg-blue-700' 
              : 'bg-gray-400 text-white cursor-not-allowed'
          }`}
          disabled={!inStock}
          onClick={handleReserve}
          data-testid="button-reserve"
        >
          <Calendar className="w-4 h-4 mr-2" />
          {inStock ? 'Reserve' : 'Out of Stock'}
        </Button>
      </div>
    </div>
  );
}

import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Medicine search endpoint
  app.get("/api/medicines/search", async (req, res) => {
    try {
      const { name } = req.query;
      
      if (!name || typeof name !== 'string') {
        return res.status(400).json({ 
          message: "Medicine name is required",
          error: "MISSING_MEDICINE_NAME"
        });
      }

      const results = await storage.searchMedicineInventory(name);
      
      // Calculate distance for each result (mock calculation)
      const resultsWithDistance = results.map(result => {
        // Mock user location: Mumbai coordinates
        const userLat = 19.0760;
        const userLon = 72.8777;
        
        const distance = calculateDistance(
          userLat, 
          userLon, 
          result.shop.latitude, 
          result.shop.longitude
        );

        return {
          shop: result.shop,
          medicine: result.medicine,
          price: result.price,
          stockQuantity: result.stockQuantity,
          distance: Math.round(distance * 100) / 100, // Round to 2 decimal places
          inStock: result.stockQuantity > 0
        };
      });

      // Sort by distance
      resultsWithDistance.sort((a, b) => a.distance - b.distance);

      // Mark the nearest shop
      if (resultsWithDistance.length > 0) {
        (resultsWithDistance[0] as any).isNearest = true;
      }

      res.json(resultsWithDistance);
    } catch (error) {
      console.error("Error searching medicines:", error);
      res.status(500).json({ 
        message: "Failed to search medicines",
        error: "SEARCH_FAILED"
      });
    }
  });

  // Get all shops endpoint
  app.get("/api/shops", async (req, res) => {
    try {
      const allShops = await storage.getAllShops();
      res.json(allShops);
    } catch (error) {
      console.error("Error fetching shops:", error);
      res.status(500).json({ 
        message: "Failed to fetch shops",
        error: "FETCH_SHOPS_FAILED"
      });
    }
  });

  // Get shop inventory endpoint
  app.get("/api/shops/:id/medicines", async (req, res) => {
    try {
      const shopId = parseInt(req.params.id);
      
      if (isNaN(shopId)) {
        return res.status(400).json({ 
          message: "Invalid shop ID",
          error: "INVALID_SHOP_ID"
        });
      }

      const shop = await storage.getShopById(shopId);
      if (!shop) {
        return res.status(404).json({ 
          message: "Shop not found",
          error: "SHOP_NOT_FOUND"
        });
      }

      const inventory = await storage.getInventoryByShopId(shopId);
      
      const inventoryWithStatus = inventory.map(item => ({
        ...item,
        status: item.stockQuantity === 0 ? 'out_of_stock' : 
                item.stockQuantity <= 10 ? 'low_stock' : 'in_stock'
      }));

      res.json({
        shop,
        inventory: inventoryWithStatus
      });
    } catch (error) {
      console.error("Error fetching shop inventory:", error);
      res.status(500).json({ 
        message: "Failed to fetch shop inventory",
        error: "FETCH_INVENTORY_FAILED"
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Haversine formula to calculate distance between two points
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distance in kilometers
  return distance;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI/180);
}

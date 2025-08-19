import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertReservationSchema, insertShopSchema, insertMedicineSchema, insertInventorySchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // =========================
  // PHARMACY OWNER ENDPOINTS
  // =========================
  
  // Create a new pharmacy
  app.post("/api/pharmacies", async (req, res) => {
    try {
      const pharmacyData = insertShopSchema.parse(req.body);
      const newPharmacy = await storage.createShop(pharmacyData);
      res.status(201).json(newPharmacy);
    } catch (error) {
      console.error("Error creating pharmacy:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid pharmacy data",
          error: "VALIDATION_ERROR",
          details: error.errors
        });
      }
      res.status(500).json({ 
        message: "Failed to create pharmacy",
        error: "PHARMACY_CREATION_FAILED"
      });
    }
  });

  // Get pharmacy details for owner
  app.get("/api/pharmacies/:id", async (req, res) => {
    try {
      const pharmacyId = parseInt(req.params.id);
      
      if (isNaN(pharmacyId)) {
        return res.status(400).json({ 
          message: "Invalid pharmacy ID",
          error: "INVALID_PHARMACY_ID"
        });
      }

      const pharmacy = await storage.getShopById(pharmacyId);
      if (!pharmacy) {
        return res.status(404).json({ 
          message: "Pharmacy not found",
          error: "PHARMACY_NOT_FOUND"
        });
      }

      res.json(pharmacy);
    } catch (error) {
      console.error("Error fetching pharmacy:", error);
      res.status(500).json({ 
        message: "Failed to fetch pharmacy",
        error: "FETCH_PHARMACY_FAILED"
      });
    }
  });

  // Update pharmacy details
  app.put("/api/pharmacies/:id", async (req, res) => {
    try {
      const pharmacyId = parseInt(req.params.id);
      
      if (isNaN(pharmacyId)) {
        return res.status(400).json({ 
          message: "Invalid pharmacy ID",
          error: "INVALID_PHARMACY_ID"
        });
      }

      const updateData = insertShopSchema.partial().parse(req.body);
      const updatedPharmacy = await storage.updateShop(pharmacyId, updateData);
      
      if (!updatedPharmacy) {
        return res.status(404).json({ 
          message: "Pharmacy not found",
          error: "PHARMACY_NOT_FOUND"
        });
      }

      res.json(updatedPharmacy);
    } catch (error) {
      console.error("Error updating pharmacy:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid pharmacy data",
          error: "VALIDATION_ERROR",
          details: error.errors
        });
      }
      res.status(500).json({ 
        message: "Failed to update pharmacy",
        error: "PHARMACY_UPDATE_FAILED"
      });
    }
  });

  // Create a new medicine (for the medicine catalog)
  app.post("/api/medicines", async (req, res) => {
    try {
      const medicineData = insertMedicineSchema.parse(req.body);
      const newMedicine = await storage.createMedicine(medicineData);
      res.status(201).json(newMedicine);
    } catch (error) {
      console.error("Error creating medicine:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid medicine data",
          error: "VALIDATION_ERROR",
          details: error.errors
        });
      }
      res.status(500).json({ 
        message: "Failed to create medicine",
        error: "MEDICINE_CREATION_FAILED"
      });
    }
  });

  // Add medicine to pharmacy inventory
  app.post("/api/pharmacies/:id/inventory", async (req, res) => {
    try {
      const pharmacyId = parseInt(req.params.id);
      
      if (isNaN(pharmacyId)) {
        return res.status(400).json({ 
          message: "Invalid pharmacy ID",
          error: "INVALID_PHARMACY_ID"
        });
      }

      // Process the request body and handle date conversion
      const requestBody = {
        ...req.body,
        shopId: pharmacyId,
        expiryDate: req.body.expiryDate ? new Date(req.body.expiryDate) : null
      };

      const inventoryData = insertInventorySchema.parse(requestBody);

      const newInventoryItem = await storage.createInventory(inventoryData);
      res.status(201).json(newInventoryItem);
    } catch (error) {
      console.error("Error adding medicine to inventory:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid inventory data",
          error: "VALIDATION_ERROR",
          details: error.errors
        });
      }
      res.status(500).json({ 
        message: "Failed to add medicine to inventory",
        error: "INVENTORY_CREATION_FAILED"
      });
    }
  });

  // Update inventory item (stock, price, etc.)
  app.put("/api/pharmacies/:pharmacyId/inventory/:inventoryId", async (req, res) => {
    try {
      const pharmacyId = parseInt(req.params.pharmacyId);
      const inventoryId = parseInt(req.params.inventoryId);
      
      if (isNaN(pharmacyId) || isNaN(inventoryId)) {
        return res.status(400).json({ 
          message: "Invalid pharmacy or inventory ID",
          error: "INVALID_IDS"
        });
      }

      // Process the request body and handle date conversion
      const requestBody = {
        ...req.body,
        expiryDate: req.body.expiryDate ? new Date(req.body.expiryDate) : undefined
      };

      const updateData = insertInventorySchema.partial().parse(requestBody);
      const updatedItem = await storage.updateInventoryItem(inventoryId, pharmacyId, updateData);
      
      if (!updatedItem) {
        return res.status(404).json({ 
          message: "Inventory item not found",
          error: "INVENTORY_NOT_FOUND"
        });
      }

      res.json(updatedItem);
    } catch (error) {
      console.error("Error updating inventory:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid inventory data",
          error: "VALIDATION_ERROR",
          details: error.errors
        });
      }
      res.status(500).json({ 
        message: "Failed to update inventory",
        error: "INVENTORY_UPDATE_FAILED"
      });
    }
  });

  // Delete inventory item
  app.delete("/api/pharmacies/:pharmacyId/inventory/:inventoryId", async (req, res) => {
    try {
      const pharmacyId = parseInt(req.params.pharmacyId);
      const inventoryId = parseInt(req.params.inventoryId);
      
      if (isNaN(pharmacyId) || isNaN(inventoryId)) {
        return res.status(400).json({ 
          message: "Invalid pharmacy or inventory ID",
          error: "INVALID_IDS"
        });
      }

      const deleted = await storage.deleteInventoryItem(inventoryId, pharmacyId);
      
      if (!deleted) {
        return res.status(404).json({ 
          message: "Inventory item not found",
          error: "INVENTORY_NOT_FOUND"
        });
      }

      res.status(200).json({ message: "Inventory item deleted successfully" });
    } catch (error) {
      console.error("Error deleting inventory item:", error);
      res.status(500).json({ 
        message: "Failed to delete inventory item",
        error: "INVENTORY_DELETE_FAILED"
      });
    }
  });

  // Get pharmacy's reservations
  app.get("/api/pharmacies/:id/reservations", async (req, res) => {
    try {
      const pharmacyId = parseInt(req.params.id);
      
      if (isNaN(pharmacyId)) {
        return res.status(400).json({ 
          message: "Invalid pharmacy ID",
          error: "INVALID_PHARMACY_ID"
        });
      }

      const reservations = await storage.getReservationsByShopId(pharmacyId);
      res.json(reservations);
    } catch (error) {
      console.error("Error fetching pharmacy reservations:", error);
      res.status(500).json({ 
        message: "Failed to fetch pharmacy reservations",
        error: "FETCH_RESERVATIONS_FAILED"
      });
    }
  });

  // Get low stock items for a pharmacy
  app.get("/api/pharmacies/:id/low-stock", async (req, res) => {
    try {
      const pharmacyId = parseInt(req.params.id);
      
      if (isNaN(pharmacyId)) {
        return res.status(400).json({ 
          message: "Invalid pharmacy ID",
          error: "INVALID_PHARMACY_ID"
        });
      }

      const lowStockItems = await storage.getLowStockItems(pharmacyId);
      res.json(lowStockItems);
    } catch (error) {
      console.error("Error fetching low stock items:", error);
      res.status(500).json({ 
        message: "Failed to fetch low stock items",
        error: "FETCH_LOW_STOCK_FAILED"
      });
    }
  });

  // =========================
  // CUSTOMER/PUBLIC ENDPOINTS (existing endpoints)
  // =========================

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

  // Get all medicines endpoint for suggestions
  app.get("/api/medicines", async (req, res) => {
    try {
      const allMedicines = await storage.getAllMedicines();
      res.json(allMedicines);
    } catch (error) {
      console.error("Error fetching medicines:", error);
      res.status(500).json({ 
        message: "Failed to fetch medicines",
        error: "FETCH_MEDICINES_FAILED"
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

  // Reservation endpoints
  
  // Create a new reservation
  app.post("/api/reservations", async (req, res) => {
    try {
      const reservationData = insertReservationSchema.parse(req.body);
      
      // Check if the medicine is available at the shop
      const inventory = await storage.getInventoryByShopId(reservationData.shopId);
      const medicineInventory = inventory.find(item => item.medicineId === reservationData.medicineId);
      
      if (!medicineInventory) {
        return res.status(404).json({ 
          message: "Medicine not available at this pharmacy",
          error: "MEDICINE_NOT_AVAILABLE"
        });
      }
      
      if (medicineInventory.stockQuantity < (reservationData.quantity || 1)) {
        return res.status(400).json({ 
          message: "Insufficient stock available",
          error: "INSUFFICIENT_STOCK",
          availableStock: medicineInventory.stockQuantity
        });
      }

      const reservation = await storage.createReservation(reservationData);
      res.status(201).json(reservation);
    } catch (error) {
      console.error("Error creating reservation:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid reservation data",
          error: "VALIDATION_ERROR",
          details: error.errors
        });
      }
      res.status(500).json({ 
        message: "Failed to create reservation",
        error: "RESERVATION_CREATION_FAILED"
      });
    }
  });

  // Get all reservations (for admin/pharmacy view)
  app.get("/api/reservations", async (req, res) => {
    try {
      const reservations = await storage.getAllReservations();
      res.json(reservations);
    } catch (error) {
      console.error("Error fetching reservations:", error);
      res.status(500).json({ 
        message: "Failed to fetch reservations",
        error: "FETCH_RESERVATIONS_FAILED"
      });
    }
  });

  // Get reservation by ID
  app.get("/api/reservations/:id", async (req, res) => {
    try {
      const reservationId = parseInt(req.params.id);
      
      if (isNaN(reservationId)) {
        return res.status(400).json({ 
          message: "Invalid reservation ID",
          error: "INVALID_RESERVATION_ID"
        });
      }

      const reservation = await storage.getReservationById(reservationId);
      
      if (!reservation) {
        return res.status(404).json({ 
          message: "Reservation not found",
          error: "RESERVATION_NOT_FOUND"
        });
      }

      res.json(reservation);
    } catch (error) {
      console.error("Error fetching reservation:", error);
      res.status(500).json({ 
        message: "Failed to fetch reservation",
        error: "FETCH_RESERVATION_FAILED"
      });
    }
  });

  // Update reservation status
  app.put("/api/reservations/:id/status", async (req, res) => {
    try {
      const reservationId = parseInt(req.params.id);
      const { status } = req.body;
      
      if (isNaN(reservationId)) {
        return res.status(400).json({ 
          message: "Invalid reservation ID",
          error: "INVALID_RESERVATION_ID"
        });
      }

      if (!status || typeof status !== 'string') {
        return res.status(400).json({ 
          message: "Status is required",
          error: "MISSING_STATUS"
        });
      }

      const validStatuses = ['pending', 'confirmed', 'ready_for_pickup', 'completed', 'cancelled'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ 
          message: "Invalid status",
          error: "INVALID_STATUS",
          validStatuses
        });
      }

      const updatedReservation = await storage.updateReservationStatus(reservationId, status);
      res.json(updatedReservation);
    } catch (error) {
      console.error("Error updating reservation status:", error);
      res.status(500).json({ 
        message: "Failed to update reservation status",
        error: "UPDATE_STATUS_FAILED"
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

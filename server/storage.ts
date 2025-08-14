import { 
  shops, 
  medicines, 
  inventory, 
  users,
  reservations,
  type Shop, 
  type Medicine, 
  type Inventory, 
  type User,
  type Reservation,
  type InsertShop, 
  type InsertMedicine, 
  type InsertInventory,
  type InsertUser,
  type InsertReservation
} from "@shared/schema";
import { db } from "./db";
import { eq, ilike, and, desc } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Shop methods
  getAllShops(): Promise<Shop[]>;
  getShopById(id: number): Promise<Shop | undefined>;
  createShop(shop: InsertShop): Promise<Shop>;
  
  // Medicine methods
  getAllMedicines(): Promise<Medicine[]>;
  getMedicineById(id: number): Promise<Medicine | undefined>;
  searchMedicinesByName(name: string): Promise<Medicine[]>;
  createMedicine(medicine: InsertMedicine): Promise<Medicine>;
  
  // Inventory methods
  getInventoryByShopId(shopId: number): Promise<(Inventory & { medicine: Medicine })[]>;
  searchMedicineInventory(medicineName: string): Promise<(Inventory & { shop: Shop; medicine: Medicine })[]>;
  createInventory(inventoryItem: InsertInventory): Promise<Inventory>;
  
  // Reservation methods
  createReservation(reservation: InsertReservation): Promise<Reservation>;
  getReservationById(id: number): Promise<(Reservation & { shop: Shop; medicine: Medicine }) | undefined>;
  getAllReservations(): Promise<(Reservation & { shop: Shop; medicine: Medicine })[]>;
  updateReservationStatus(id: number, status: string): Promise<Reservation>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getAllShops(): Promise<Shop[]> {
    return await db.select().from(shops);
  }

  async getShopById(id: number): Promise<Shop | undefined> {
    const [shop] = await db.select().from(shops).where(eq(shops.id, id));
    return shop || undefined;
  }

  async createShop(shop: InsertShop): Promise<Shop> {
    const [newShop] = await db
      .insert(shops)
      .values(shop)
      .returning();
    return newShop;
  }

  async getAllMedicines(): Promise<Medicine[]> {
    return await db.select().from(medicines);
  }

  async getMedicineById(id: number): Promise<Medicine | undefined> {
    const [medicine] = await db.select().from(medicines).where(eq(medicines.id, id));
    return medicine || undefined;
  }

  async searchMedicinesByName(name: string): Promise<Medicine[]> {
    return await db
      .select()
      .from(medicines)
      .where(ilike(medicines.name, `%${name}%`));
  }

  async createMedicine(medicine: InsertMedicine): Promise<Medicine> {
    const [newMedicine] = await db
      .insert(medicines)
      .values(medicine)
      .returning();
    return newMedicine;
  }

  async getInventoryByShopId(shopId: number): Promise<(Inventory & { medicine: Medicine })[]> {
    return await db
      .select({
        id: inventory.id,
        shopId: inventory.shopId,
        medicineId: inventory.medicineId,
        price: inventory.price,
        stockQuantity: inventory.stockQuantity,
        createdAt: inventory.createdAt,
        medicine: medicines,
      })
      .from(inventory)
      .innerJoin(medicines, eq(inventory.medicineId, medicines.id))
      .where(eq(inventory.shopId, shopId));
  }

  async searchMedicineInventory(medicineName: string): Promise<(Inventory & { shop: Shop; medicine: Medicine })[]> {
    return await db
      .select({
        id: inventory.id,
        shopId: inventory.shopId,
        medicineId: inventory.medicineId,
        price: inventory.price,
        stockQuantity: inventory.stockQuantity,
        createdAt: inventory.createdAt,
        shop: shops,
        medicine: medicines,
      })
      .from(inventory)
      .innerJoin(shops, eq(inventory.shopId, shops.id))
      .innerJoin(medicines, eq(inventory.medicineId, medicines.id))
      .where(ilike(medicines.name, `%${medicineName}%`))
      .orderBy(desc(inventory.stockQuantity));
  }

  async createInventory(inventoryItem: InsertInventory): Promise<Inventory> {
    const [newInventory] = await db
      .insert(inventory)
      .values(inventoryItem)
      .returning();
    return newInventory;
  }

  async createReservation(reservation: InsertReservation): Promise<Reservation> {
    const [newReservation] = await db
      .insert(reservations)
      .values(reservation)
      .returning();
    return newReservation;
  }

  async getReservationById(id: number): Promise<(Reservation & { shop: Shop; medicine: Medicine }) | undefined> {
    const [result] = await db
      .select({
        id: reservations.id,
        customerName: reservations.customerName,
        customerPhone: reservations.customerPhone,
        customerEmail: reservations.customerEmail,
        shopId: reservations.shopId,
        medicineId: reservations.medicineId,
        quantity: reservations.quantity,
        totalPrice: reservations.totalPrice,
        status: reservations.status,
        reservationDate: reservations.reservationDate,
        pickupDate: reservations.pickupDate,
        notes: reservations.notes,
        createdAt: reservations.createdAt,
        updatedAt: reservations.updatedAt,
        shop: shops,
        medicine: medicines,
      })
      .from(reservations)
      .innerJoin(shops, eq(reservations.shopId, shops.id))
      .innerJoin(medicines, eq(reservations.medicineId, medicines.id))
      .where(eq(reservations.id, id));
    return result;
  }

  async getAllReservations(): Promise<(Reservation & { shop: Shop; medicine: Medicine })[]> {
    return await db
      .select({
        id: reservations.id,
        customerName: reservations.customerName,
        customerPhone: reservations.customerPhone,
        customerEmail: reservations.customerEmail,
        shopId: reservations.shopId,
        medicineId: reservations.medicineId,
        quantity: reservations.quantity,
        totalPrice: reservations.totalPrice,
        status: reservations.status,
        reservationDate: reservations.reservationDate,
        pickupDate: reservations.pickupDate,
        notes: reservations.notes,
        createdAt: reservations.createdAt,
        updatedAt: reservations.updatedAt,
        shop: shops,
        medicine: medicines,
      })
      .from(reservations)
      .innerJoin(shops, eq(reservations.shopId, shops.id))
      .innerJoin(medicines, eq(reservations.medicineId, medicines.id))
      .orderBy(desc(reservations.createdAt));
  }

  async updateReservationStatus(id: number, status: string): Promise<Reservation> {
    const [updatedReservation] = await db
      .update(reservations)
      .set({ status: status as any, updatedAt: new Date() })
      .where(eq(reservations.id, id))
      .returning();
    return updatedReservation;
  }
}

export const storage = new DatabaseStorage();

import { sql } from "drizzle-orm";
import { pgTable, text, varchar, serial, numeric, integer, real, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const reservationStatusEnum = pgEnum("reservation_status", [
  "pending", 
  "confirmed", 
  "ready_for_pickup", 
  "completed", 
  "cancelled"
]);

export const shops = pgTable("shops", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const medicines = pgTable("medicines", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const inventory = pgTable("inventory", {
  id: serial("id").primaryKey(),
  shopId: integer("shop_id").notNull().references(() => shops.id),
  medicineId: integer("medicine_id").notNull().references(() => medicines.id),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  stockQuantity: integer("stock_quantity").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const reservations = pgTable("reservations", {
  id: serial("id").primaryKey(),
  customerName: text("customer_name").notNull(),
  customerPhone: text("customer_phone").notNull(),
  customerEmail: text("customer_email"),
  shopId: integer("shop_id").notNull().references(() => shops.id),
  medicineId: integer("medicine_id").notNull().references(() => medicines.id),
  quantity: integer("quantity").notNull().default(1),
  totalPrice: numeric("total_price", { precision: 10, scale: 2 }).notNull(),
  status: reservationStatusEnum("status").notNull().default("pending"),
  reservationDate: timestamp("reservation_date").defaultNow(),
  pickupDate: timestamp("pickup_date"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const shopsRelations = relations(shops, ({ many }) => ({
  inventory: many(inventory),
  reservations: many(reservations),
}));

export const medicinesRelations = relations(medicines, ({ many }) => ({
  inventory: many(inventory),
  reservations: many(reservations),
}));

export const inventoryRelations = relations(inventory, ({ one }) => ({
  shop: one(shops, {
    fields: [inventory.shopId],
    references: [shops.id],
  }),
  medicine: one(medicines, {
    fields: [inventory.medicineId],
    references: [medicines.id],
  }),
}));

export const reservationsRelations = relations(reservations, ({ one }) => ({
  shop: one(shops, {
    fields: [reservations.shopId],
    references: [shops.id],
  }),
  medicine: one(medicines, {
    fields: [reservations.medicineId],
    references: [medicines.id],
  }),
}));

export const insertShopSchema = createInsertSchema(shops).omit({
  id: true,
  createdAt: true,
});

export const insertMedicineSchema = createInsertSchema(medicines).omit({
  id: true,
  createdAt: true,
});

export const insertInventorySchema = createInsertSchema(inventory).omit({
  id: true,
  createdAt: true,
});

export const insertReservationSchema = createInsertSchema(reservations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type Shop = typeof shops.$inferSelect;
export type Medicine = typeof medicines.$inferSelect;
export type Inventory = typeof inventory.$inferSelect;
export type Reservation = typeof reservations.$inferSelect;
export type InsertShop = z.infer<typeof insertShopSchema>;
export type InsertMedicine = z.infer<typeof insertMedicineSchema>;
export type InsertInventory = z.infer<typeof insertInventorySchema>;
export type InsertReservation = z.infer<typeof insertReservationSchema>;

// Legacy user types for compatibility
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

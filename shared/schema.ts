import { pgTable, text, serial, integer, boolean, timestamp, real, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Product categories
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  image: text("image").notNull(),
});

export const insertCategorySchema = createInsertSchema(categories).pick({
  name: true,
  slug: true,
  image: true,
});

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

// Products
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  price: real("price").notNull(),
  salePrice: real("sale_price"),
  stock: integer("stock").notNull().default(0),
  image: text("image").notNull(),
  images: text("images").array(),
  categoryId: integer("category_id").references(() => categories.id),
  featured: boolean("featured").default(false),
  badge: text("badge"), // "new", "sale", "best seller", etc.
  isActive: boolean("is_active").default(true),
});

export const insertProductSchema = createInsertSchema(products).pick({
  name: true,
  slug: true,
  description: true,
  price: true,
  salePrice: true,
  stock: true,
  image: true,
  images: true,
  categoryId: true,
  featured: true,
  badge: true,
  isActive: true,
});

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

// Users (for admin panel)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  isAdmin: boolean("is_admin").default(false),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  isAdmin: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Orders
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  pincode: text("pincode").notNull(),
  total: real("total").notNull(),
  items: jsonb("items").notNull(),
  status: text("status").notNull().default("pending"),
  paymentMethod: text("payment_method").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const orderItemSchema = z.object({
  productId: z.number(),
  name: z.string(),
  price: z.number(),
  quantity: z.number(),
  image: z.string(),
});

export const insertOrderSchema = createInsertSchema(orders).pick({
  customerName: true,
  customerEmail: true,
  customerPhone: true,
  address: true,
  city: true,
  state: true,
  pincode: true,
  total: true,
  status: true,
  paymentMethod: true,
}).extend({
  items: z.array(orderItemSchema),
});

export type OrderItem = z.infer<typeof orderItemSchema>;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;

// Cart type (for frontend)
export const cartItemSchema = z.object({
  id: z.number(),
  name: z.string(),
  price: z.number(),
  salePrice: z.number().optional(),
  quantity: z.number(),
  image: z.string(),
});

export type CartItem = z.infer<typeof cartItemSchema>;

import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import express from "express";
import { insertOrderSchema, insertProductSchema, orderItemsSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

// Constants
const SALT_ROUNDS = 12;
const SESSION_EXPIRY_HOURS = 8;

// Types
interface AuthenticatedRequest extends express.Request {
  session?: {
    userId: number;
    isAdmin: boolean;
  };
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Session management middleware
  const sessionMiddleware = async (req: AuthenticatedRequest, res: express.Response, next: express.NextFunction) => {
    const sessionToken = req.headers.authorization?.split(' ')[1];
    
    if (sessionToken) {
      try {
        const session = await storage.getSession(sessionToken);
        if (session && new Date(session.expiresAt) > new Date()) {
          req.session = {
            userId: session.userId,
            isAdmin: session.isAdmin
          };
        }
      } catch (error) {
        console.error("Session validation error:", error);
      }
    }
    
    next();
  };

  // Admin authorization middleware
  const requireAdmin = async (req: AuthenticatedRequest, res: express.Response, next: express.NextFunction) => {
    if (!req.session?.isAdmin) {
      return res.status(401).json({ message: "Admin access required" });
    }
    next();
  };

  // API Routes
  const router = express.Router();

  // Authentication routes
  router.post("/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      
      const user = await storage.getUserByUsername(username);
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Create session
      const sessionToken = uuidv4();
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + SESSION_EXPIRY_HOURS);
      
      await storage.createSession({
        userId: user.id,
        token: sessionToken,
        expiresAt,
        isAdmin: user.isAdmin
      });
      
      res.json({ 
        token: sessionToken,
        expiresAt,
        isAdmin: user.isAdmin
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  // Product routes
  router.get("/products", async (req, res) => {
    try {
      const { category, featured } = req.query;
      const products = category 
        ? await storage.getProductsByCategory(category.toString())
        : featured === "true"
          ? await storage.getFeaturedProducts()
          : await storage.getProducts();
          
      res.json(products);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  router.get("/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }
      
      const product = await storage.getProductById(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json(product);
    } catch (error) {
      console.error("Failed to fetch product:", error);
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  // Admin product routes
  router.post("/admin/products", requireAdmin, async (req, res) => {
    try {
      const productData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(productData);
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          message: "Validation failed",
          errors: fromZodError(error).details 
        });
      }
      console.error("Failed to create product:", error);
      res.status(500).json({ message: "Failed to create product" });
    }
  });

  router.put("/admin/products/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }
      
      const productData = insertProductSchema.partial().parse(req.body);
      const updatedProduct = await storage.updateProduct(id, productData);
      
      if (!updatedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json(updatedProduct);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          message: "Validation failed",
          errors: fromZodError(error).details 
        });
      }
      console.error("Failed to update product:", error);
      res.status(500).json({ message: "Failed to update product" });
    }
  });

  router.delete("/admin/products/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }
      
      const deleted = await storage.deleteProduct(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error("Failed to delete product:", error);
      res.status(500).json({ message: "Failed to delete product" });
    }
  });

  // Order routes
  router.post("/orders", async (req, res) => {
    try {
      const { items, ...orderData } = req.body;
      
      // Validate items separately for better error messages
      const validatedItems = orderItemsSchema.parse(items);
      
      // Calculate total
      const totalAmount = validatedItems.reduce(
        (sum, item) => sum + (item.price * item.quantity), 
        0
      );
      
      // Create order
      const order = await storage.createOrder({
        ...insertOrderSchema.parse(orderData),
        items: validatedItems,
        totalAmount
      });
      
      res.status(201).json(order);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          message: "Validation failed",
          errors: fromZodError(error).details 
        });
      }
      console.error("Failed to create order:", error);
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  // Admin order routes
  router.get("/admin/orders", requireAdmin, async (req, res) => {
    try {
      const { status } = req.query;
      const orders = status 
        ? await storage.getOrdersByStatus(status.toString())
        : await storage.getOrders();
      res.json(orders);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  router.put("/admin/orders/:id/status", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid order ID" });
      }
      
      const { status } = req.body;
      if (!status) {
        return res.status(400).json({ message: "Status is required" });
      }
      
      const updatedOrder = await storage.updateOrderStatus(id, status);
      
      if (!updatedOrder) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      res.json(updatedOrder);
    } catch (error) {
      console.error("Failed to update order:", error);
      res.status(500).json({ message: "Failed to update order status" });
    }
  });

  // Apply middlewares and routes
  app.use("/api", sessionMiddleware, router);

  // Health check endpoint
  app.get("/health", (req, res) => {
    res.json({ status: "healthy" });
  });

  // Create HTTP server
  const httpServer = createServer(app);
  return httpServer;
}

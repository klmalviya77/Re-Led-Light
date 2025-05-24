import { 
  users, type User, type InsertUser,
  products, type Product, type InsertProduct,
  orders, type Order, type InsertOrder
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Product operations
  getProducts(): Promise<Product[]>;
  getProductById(id: number): Promise<Product | undefined>;
  getProductsByCategory(category: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;
  
  // Order operations
  getOrders(): Promise<Order[]>;
  getOrderById(id: number): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: number, status: string): Promise<Order | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private products: Map<number, Product>;
  private orders: Map<number, Order>;
  private userId: number;
  private productId: number;
  private orderId: number;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.orders = new Map();
    this.userId = 1;
    this.productId = 1;
    this.orderId = 1;
    
    // Initialize with an admin user
    this.createUser({
      username: "admin",
      password: "admin123",
      isAdmin: true
    });
    
    // Initialize with some products
    this.initializeProducts();
  }

  private initializeProducts() {
    const sampleProducts: InsertProduct[] = [
      {
        name: "Smart RGB LED Strip",
        description: "WiFi enabled RGB LED strip that can be controlled via smartphone app. Features 16 million colors and various lighting modes.",
        price: 129900, // 1,299.00
        image: "https://pixabay.com/get/gecc5eca51366554ceb06b2d2c99e54cd7cc1ae249e1d19d0876690b1693f2262536b009f1c4893f1c652d83253f1c583f669413e5a2ba5c389113203bea2b59a_1280.jpg",
        category: "LED Strip Lights",
        features: ["WiFi enabled", "16 million colors", "App control", "Music sync", "Voice compatible"],
        inStock: true,
        stockQuantity: 124
      },
      {
        name: "Ceiling LED Panel",
        description: "Ultra-thin LED panel with 36W power. Perfect for offices and modern homes with 6500K cool white light. Energy efficient and long lasting.",
        price: 249900, // 2,499.00
        image: "https://images.unsplash.com/photo-1551818255-e6e10975bc17?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300",
        category: "Panel Lights",
        features: ["36W power", "6500K cool white", "Ultra-thin design", "Energy efficient"],
        inStock: true,
        stockQuantity: 56
      },
      {
        name: "Pendant LED Light",
        description: "Modern design pendant light with warm white LED. Adjustable height and perfect for dining areas and living rooms. Creates a cozy atmosphere.",
        price: 389900, // 3,899.00
        image: "https://images.unsplash.com/photo-1540932239986-30128078f3c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300",
        category: "Decorative Lights",
        features: ["Modern design", "Warm white light", "Adjustable height", "Dimmable"],
        inStock: true,
        stockQuantity: 18
      },
      {
        name: "Garden Path Lights",
        description: "Solar powered garden path lights with automatic dusk to dawn operation. Waterproof and perfect for garden pathways and driveways.",
        price: 89900, // 899.00
        image: "https://pixabay.com/get/gf303c25d71c21221ccd32c6cf250fd002495f9939efe36cc70e161ddc63de1714072413bd93f92d19a1f2c1ad8afefe8_1280.jpg",
        category: "Outdoor Lights",
        features: ["Solar powered", "Waterproof", "Auto on/off", "Easy installation"],
        inStock: false,
        stockQuantity: 0
      },
      {
        name: "Recessed LED Spotlights",
        description: "Set of 4 recessed LED spotlights for modern ceilings. Dimmable with warm white light that creates a cozy atmosphere in any room.",
        price: 159900, // 1,599.00
        image: "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300",
        category: "Panel Lights",
        features: ["Set of 4", "Dimmable", "Warm white", "Energy efficient"],
        inStock: true,
        stockQuantity: 42
      },
      {
        name: "Motion Sensor Light",
        description: "Battery operated motion sensor light perfect for closets, hallways and staircases. Auto-on when motion is detected and auto-off after 30 seconds.",
        price: 129900, // 1,299.00
        image: "https://images.unsplash.com/photo-1558370781-d6196949e317?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300",
        category: "Smart Lighting",
        features: ["Motion detection", "Battery operated", "Auto on/off", "Easy installation"],
        inStock: true,
        stockQuantity: 35
      }
    ];
    
    sampleProducts.forEach(product => this.createProduct(product));
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Product operations
  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProductById(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.category === category
    );
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const id = this.productId++;
    const newProduct: Product = { ...product, id };
    this.products.set(id, newProduct);
    return newProduct;
  }

  async updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined> {
    const existingProduct = this.products.get(id);
    if (!existingProduct) return undefined;
    
    const updatedProduct = { ...existingProduct, ...product };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  async deleteProduct(id: number): Promise<boolean> {
    return this.products.delete(id);
  }

  // Order operations
  async getOrders(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }

  async getOrderById(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const id = this.orderId++;
    const now = new Date();
    const newOrder: Order = { ...order, id, createdAt: now };
    this.orders.set(id, newOrder);
    return newOrder;
  }

  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const existingOrder = this.orders.get(id);
    if (!existingOrder) return undefined;
    
    const updatedOrder = { ...existingOrder, status };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }
}

export const storage = new MemStorage();

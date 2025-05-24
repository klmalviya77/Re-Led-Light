import { 
  InsertCategory, Category, categories,
  InsertProduct, Product, products,
  InsertOrder, Order, orders,
  InsertUser, User, users,
} from "@shared/schema";

// Interface for storage operations
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Category methods
  getCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: number): Promise<boolean>;

  // Product methods
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  getProductBySlug(slug: string): Promise<Product | undefined>;
  getProductsByCategory(categoryId: number): Promise<Product[]>;
  getFeaturedProducts(): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;

  // Order methods
  getOrders(): Promise<Order[]>;
  getOrder(id: number): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: number, status: string): Promise<Order | undefined>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private _users: Map<number, User>;
  private _categories: Map<number, Category>;
  private _products: Map<number, Product>;
  private _orders: Map<number, Order>;
  private _userId: number;
  private _categoryId: number;
  private _productId: number;
  private _orderId: number;

  constructor() {
    this._users = new Map();
    this._categories = new Map();
    this._products = new Map();
    this._orders = new Map();
    this._userId = 1;
    this._categoryId = 1;
    this._productId = 1;
    this._orderId = 1;

    // Initialize with admin user
    this.createUser({
      username: "admin",
      password: "admin123", // In a real app, this would be hashed
      isAdmin: true,
    });

    // Initialize with sample categories
    this.initializeCategories();

    // Initialize with sample products
    this.initializeProducts();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this._users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this._users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this._userId++;
    const user: User = { ...insertUser, id };
    this._users.set(id, user);
    return user;
  }

  // Category methods
  async getCategories(): Promise<Category[]> {
    return Array.from(this._categories.values());
  }

  async getCategory(id: number): Promise<Category | undefined> {
    return this._categories.get(id);
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return Array.from(this._categories.values()).find(
      (category) => category.slug === slug
    );
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this._categoryId++;
    const category: Category = { ...insertCategory, id };
    this._categories.set(id, category);
    return category;
  }

  async updateCategory(id: number, categoryData: Partial<InsertCategory>): Promise<Category | undefined> {
    const category = this._categories.get(id);
    if (!category) return undefined;

    const updatedCategory = { ...category, ...categoryData };
    this._categories.set(id, updatedCategory);
    return updatedCategory;
  }

  async deleteCategory(id: number): Promise<boolean> {
    return this._categories.delete(id);
  }

  // Product methods
  async getProducts(): Promise<Product[]> {
    return Array.from(this._products.values());
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this._products.get(id);
  }

  async getProductBySlug(slug: string): Promise<Product | undefined> {
    return Array.from(this._products.values()).find(
      (product) => product.slug === slug
    );
  }

  async getProductsByCategory(categoryId: number): Promise<Product[]> {
    return Array.from(this._products.values()).filter(
      (product) => product.categoryId === categoryId
    );
  }

  async getFeaturedProducts(): Promise<Product[]> {
    return Array.from(this._products.values()).filter(
      (product) => product.featured
    );
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this._productId++;
    const product: Product = { ...insertProduct, id };
    this._products.set(id, product);
    return product;
  }

  async updateProduct(id: number, productData: Partial<InsertProduct>): Promise<Product | undefined> {
    const product = this._products.get(id);
    if (!product) return undefined;

    const updatedProduct = { ...product, ...productData };
    this._products.set(id, updatedProduct);
    return updatedProduct;
  }

  async deleteProduct(id: number): Promise<boolean> {
    return this._products.delete(id);
  }

  // Order methods
  async getOrders(): Promise<Order[]> {
    return Array.from(this._orders.values());
  }

  async getOrder(id: number): Promise<Order | undefined> {
    return this._orders.get(id);
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = this._orderId++;
    const createdAt = new Date();
    const order: Order = { ...insertOrder, id, createdAt };
    this._orders.set(id, order);
    return order;
  }

  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const order = this._orders.get(id);
    if (!order) return undefined;

    const updatedOrder = { ...order, status };
    this._orders.set(id, updatedOrder);
    return updatedOrder;
  }

  // Initialize with sample data
  private initializeCategories() {
    const categoriesData: InsertCategory[] = [
      {
        name: "Pendant Lights",
        slug: "pendant-lights",
        image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500"
      },
      {
        name: "LED Strips",
        slug: "led-strips",
        image: "https://pixabay.com/get/gfc7b34c2dfca1a3b9047a8008cb3217a5c1b669ce74473e9d97905f1754db4e289509c059b80334d72c39c1b85d666c6f4d658d8c7b4caf04d65f87b7f3e8ca1_1280.jpg"
      },
      {
        name: "Spotlights",
        slug: "spotlights",
        image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500"
      },
      {
        name: "Outdoor Lighting",
        slug: "outdoor-lighting",
        image: "https://pixabay.com/get/gd188a123edc0d3e1f15a6cf02a1015f9e506670eb5b28eadf7bd6a38dcf25ded3424ba081f7c7228beb778b7fa6c8e19a04ea7f562a45e9baa3982e55d3afd50_1280.jpg"
      }
    ];

    categoriesData.forEach(category => this.createCategory(category));
  }

  private initializeProducts() {
    const productsData: InsertProduct[] = [
      {
        name: "Smart LED Bulb",
        slug: "smart-led-bulb",
        description: "Color changing, compatible with Alexa & Google Home. Transform your space with our premium Smart LED Bulb. Features multiple vibrant colors, adjustable brightness, and smart home compatibility.",
        price: 799,
        stock: 45,
        image: "https://pixabay.com/get/g0415c72e5d4b3b392feac18790008dea86c95a74ade670d24c7894232656f786067e4e4902423e25cf38a7846346d09bf3ec67b856987b614e209ec726c6cf93_1280.jpg",
        images: [
          "https://pixabay.com/get/g0415c72e5d4b3b392feac18790008dea86c95a74ade670d24c7894232656f786067e4e4902423e25cf38a7846346d09bf3ec67b856987b614e209ec726c6cf93_1280.jpg",
          "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800"
        ],
        categoryId: 1,
        featured: true,
        badge: "new",
        isActive: true
      },
      {
        name: "LED Strip Light Kit",
        slug: "led-strip-light-kit",
        description: "16 colors, remote controlled, 5m length. Transform your space with our premium 5-meter LED strip light kit. Perfect for accent lighting in living rooms, bedrooms, or entertainment areas.",
        price: 1299,
        stock: 32,
        image: "https://pixabay.com/get/g40b308f2de9ddb1cac4673e50e7c4d17ba3b30b67b706202c0e0af452f3bb153bc2f7d607943151325aac508ebad34636b41bafd9065e413dcbc43470e69bcdf_1280.jpg",
        images: [
          "https://pixabay.com/get/g40b308f2de9ddb1cac4673e50e7c4d17ba3b30b67b706202c0e0af452f3bb153bc2f7d607943151325aac508ebad34636b41bafd9065e413dcbc43470e69bcdf_1280.jpg",
          "https://pixabay.com/get/gb3bf0824e8fc91a284f492adbce4cb6bb630dc67e01f73192210d62cbe91a324938b0ac2600c4a3ca712de85d354467860e962f3ee1fcbb4d78d0df252e734cf_1280.jpg",
          "https://pixabay.com/get/gad6c923909e2080b666aeb8910e55fe878602f9f3f17397acdc843f4da881ab434040cb439d2e73eac1c92e0fdb069d1f9f11d2dcc98dbc2b1c086653dc4d405_1280.jpg",
          "https://pixabay.com/get/g169a44dd88753cd4a3229c2d1354702c27407418473c3c8b5f7f2d2de6e2daf9d7cb2d1e291aeacf24c0121efac52f3aca1bf1074a17686ee7d2edca47311720_1280.jpg"
        ],
        categoryId: 2,
        featured: true,
        badge: "best seller",
        isActive: true
      },
      {
        name: "Designer Pendant Light",
        slug: "designer-pendant-light",
        description: "Modern geometric design, adjustable height. Add a touch of elegance to any room with our designer pendant light featuring a unique geometric pattern.",
        price: 2499,
        stock: 18,
        image: "https://pixabay.com/get/g5766e5541a4e699f1bab6c68e0ce150fcf168c628b085dd45a0500dc4b2d3c39b0339e1e63a44d42f92f0fc4e9a9c56c6a95a5de9cee8df4de5ab4376f5bab0e_1280.jpg",
        images: [
          "https://pixabay.com/get/g5766e5541a4e699f1bab6c68e0ce150fcf168c628b085dd45a0500dc4b2d3c39b0339e1e63a44d42f92f0fc4e9a9c56c6a95a5de9cee8df4de5ab4376f5bab0e_1280.jpg"
        ],
        categoryId: 1,
        featured: true,
        isActive: true
      },
      {
        name: "Solar Garden Lights",
        slug: "solar-garden-lights",
        description: "Set of 6, waterproof, auto on/off. These solar-powered garden lights automatically turn on at dusk and provide beautiful illumination for your outdoor spaces.",
        price: 999,
        salePrice: 1499,
        stock: 0,
        image: "https://images.unsplash.com/photo-1565538420870-da08ff96a207?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=400",
        images: [
          "https://images.unsplash.com/photo-1565538420870-da08ff96a207?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=400"
        ],
        categoryId: 4,
        featured: true,
        badge: "sale",
        isActive: true
      },
      {
        name: "Recessed Spotlight",
        slug: "recessed-spotlight",
        description: "Adjustable angle, warm white, 12W. These recessed spotlights are perfect for modern interiors, providing focused lighting with an adjustable beam angle.",
        price: 699,
        stock: 25,
        image: "https://pixabay.com/get/g59fd022bc8eb344603f165007380a18fdfd681b45738f8c4cc3a5e6fedb31c32b263d7be4f6b5109ddb56fb7579f46b1d03b8b1df8da7e5e359812d909928232_1280.jpg",
        images: [
          "https://pixabay.com/get/g59fd022bc8eb344603f165007380a18fdfd681b45738f8c4cc3a5e6fedb31c32b263d7be4f6b5109ddb56fb7579f46b1d03b8b1df8da7e5e359812d909928232_1280.jpg"
        ],
        categoryId: 3,
        isActive: true
      },
      {
        name: "LED Desk Lamp",
        slug: "led-desk-lamp",
        description: "Touch control, 5 brightness levels, USB charging port. This versatile desk lamp features touch controls, multiple brightness settings, and a convenient USB charging port.",
        price: 1499,
        stock: 12,
        image: "https://pixabay.com/get/gd59de481480048fb798f843d7e1d8bf2d3dcbaabe8cec798625f3db52e051c35fb9e0884b759826166b061e953231e93f400a276db6408c5d54b26896495b7f7_1280.jpg",
        images: [
          "https://pixabay.com/get/gd59de481480048fb798f843d7e1d8bf2d3dcbaabe8cec798625f3db52e051c35fb9e0884b759826166b061e953231e93f400a276db6408c5d54b26896495b7f7_1280.jpg"
        ],
        categoryId: 1,
        isActive: true
      },
      {
        name: "Wall Sconce Light",
        slug: "wall-sconce-light",
        description: "Indoor, geometric design, warm light. These stylish wall sconces provide warm, ambient lighting and add a decorative element to any wall.",
        price: 1899,
        stock: 15,
        image: "https://images.unsplash.com/photo-1517991104123-1d56a6e81ed9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=400",
        images: [
          "https://images.unsplash.com/photo-1517991104123-1d56a6e81ed9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=400"
        ],
        categoryId: 1,
        isActive: true
      },
      {
        name: "LED Fairy Lights",
        slug: "led-fairy-lights",
        description: "String lights, 10m, battery operated. Create magical ambiance with these delicate string lights, perfect for bedrooms, parties, or special occasions.",
        price: 599,
        stock: 40,
        image: "https://pixabay.com/get/gd36318ce37738c78af0f1cd2f31d48c02b90e4955909e45df09aa876c76bba4b6ed4daeefeb0daf2d612e26ee52924721869dd19687fae91a51e5b97885071c2_1280.jpg",
        images: [
          "https://pixabay.com/get/gd36318ce37738c78af0f1cd2f31d48c02b90e4955909e45df09aa876c76bba4b6ed4daeefeb0daf2d612e26ee52924721869dd19687fae91a51e5b97885071c2_1280.jpg"
        ],
        categoryId: 2,
        isActive: true
      }
    ];

    productsData.forEach(product => this.createProduct(product));
  }
}

export const storage = new MemStorage();

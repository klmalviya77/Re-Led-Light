import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { FileSliders, Product, Order } from "@shared/schema";
import AdminLayout from "@/components/admin/admin-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { Package, ShoppingCart, FileSliders as CategoryIcon, AlertCircle } from "lucide-react";

export default function AdminDashboard() {
  // Set page title
  useEffect(() => {
    document.title = "Admin Dashboard | RE LED LIGHT";
  }, []);

  // Fetch data for dashboard
  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: categories = [] } = useQuery<FileSliders[]>({
    queryKey: ["/api/categories"],
  });

  const { data: orders = [] } = useQuery<Order[]>({
    queryKey: ["/api/orders"],
  });

  // Calculate dashboard metrics
  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.isActive).length;
  const outOfStockProducts = products.filter(p => p.stock === 0).length;
  
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === "pending").length;
  
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

  // Recent orders
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  // Low stock alerts
  const lowStockItems = products
    .filter(p => p.stock > 0 && p.stock <= 10)
    .slice(0, 5);

  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Package className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Products</p>
                  <h3 className="text-2xl font-bold">{totalProducts}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-primary/10 rounded-full">
                  <ShoppingCart className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                  <h3 className="text-2xl font-bold">{totalOrders}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-primary/10 rounded-full">
                  <CategoryIcon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Categories</p>
                  <h3 className="text-2xl font-bold">{categories.length}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-primary/10 rounded-full">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-6 w-6 text-primary" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Revenue</p>
                  <h3 className="text-2xl font-bold">{formatPrice(totalRevenue)}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Product Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Active Products</span>
                  <span className="font-medium">{activeProducts}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Inactive Products</span>
                  <span className="font-medium">{totalProducts - activeProducts}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Out of Stock</span>
                  <span className="font-medium">{outOfStockProducts}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Order Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Pending Orders</span>
                  <span className="font-medium">{pendingOrders}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Completed Orders</span>
                  <span className="font-medium">{orders.filter(o => o.status === "completed").length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Cancelled Orders</span>
                  <span className="font-medium">{orders.filter(o => o.status === "cancelled").length}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Link href="/admin/products">
                  <Button className="w-full justify-start">Manage Products</Button>
                </Link>
                <Link href="/admin/orders">
                  <Button className="w-full justify-start" variant="outline">Manage Orders</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Recent Orders and Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Latest customer orders</CardDescription>
            </CardHeader>
            <CardContent>
              {recentOrders.length > 0 ? (
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex justify-between items-center p-3 border rounded-md">
                      <div>
                        <p className="font-medium">{order.customerName}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{formatPrice(order.total)}</p>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          order.status === "completed" 
                            ? "bg-green-100 text-green-800" 
                            : order.status === "cancelled" 
                              ? "bg-red-100 text-red-800" 
                              : "bg-yellow-100 text-yellow-800"
                        }`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-4 text-muted-foreground">No orders yet</p>
              )}
              
              {recentOrders.length > 0 && (
                <div className="mt-4 text-center">
                  <Link href="/admin/orders">
                    <Button variant="link">View All Orders</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Low Stock Alerts */}
          <Card>
            <CardHeader>
              <CardTitle>Inventory Alerts</CardTitle>
              <CardDescription>Products with low stock</CardDescription>
            </CardHeader>
            <CardContent>
              {lowStockItems.length > 0 ? (
                <div className="space-y-4">
                  {lowStockItems.map((product) => (
                    <div key={product.id} className="flex justify-between items-center p-3 border rounded-md">
                      <div className="flex items-center">
                        <AlertCircle className="h-5 w-5 text-amber-500 mr-2" />
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-muted-foreground">
                            FileSliders: {categories.find(c => c.id === product.categoryId)?.name || "Unknown"}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-amber-600 font-bold">{product.stock} left</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-4 text-muted-foreground">No low stock alerts</p>
              )}
              
              {lowStockItems.length > 0 && (
                <div className="mt-4 text-center">
                  <Link href="/admin/products">
                    <Button variant="link">Manage Inventory</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}

import { ReactNode, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Package, ShoppingBag, LogOut } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
}

export default function AdminLayout({ children, title }: AdminLayoutProps) {
  const [location, navigate] = useLocation();
  
  // Enhanced authentication check with error handling
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-auth-check"],
    queryFn: () => apiRequest("GET", "/api/admin/check", {}),
    retry: false
  });
  
  useEffect(() => {
    if (error || (!isLoading && !data?.isAdmin)) {
      navigate("/admin/login");
    }
  }, [data, isLoading, error, navigate]);
  
  const handleLogout = async () => {
    try {
      await apiRequest("POST", "/api/admin/logout", {});
      navigate("/admin/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-neutral-dark text-white p-6 hidden md:block">
        <div className="mb-8">
          <h2 className="text-xl font-bold">Admin Panel</h2>
        </div>
        
        <nav className="space-y-2">
          <Button
            variant={location === "/admin" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => navigate("/admin")}
          >
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
          
          <Button
            variant={location.includes("/admin/products") ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => navigate("/admin/products")}
          >
            <Package className="mr-2 h-4 w-4" />
            Products
          </Button>
          
          <Button
            variant={location.includes("/admin/orders") ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => navigate("/admin/orders")}
          >
            <ShoppingBag className="mr-2 h-4 w-4" />
            Orders
          </Button>
          
          <div className="absolute bottom-6 left-6 right-6">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-300 hover:text-red-200 hover:bg-red-900/20"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </nav>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile header */}
        <header className="bg-white shadow-sm p-4 flex justify-between items-center md:hidden">
          <h1 className="text-xl font-bold">{title}</h1>
          <Button variant="outline" size="icon" onClick={() => navigate("/admin")}>
            <LayoutDashboard className="h-5 w-5" />
          </Button>
        </header>
        
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <div className="mb-6 hidden md:block">
            <h1 className="text-2xl font-bold">{title}</h1>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

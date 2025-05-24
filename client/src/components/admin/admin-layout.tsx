import { useEffect } from "react";
import { Link, useLocation, useRoute } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { 
  LayoutDashboard, 
  Package, 
  ClipboardList, 
  LogOut,
  Users,
  Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
}

export default function AdminLayout({ children, title }: AdminLayoutProps) {
  const { isAdmin, isAuthenticated, logout } = useAuth();
  const [, setLocation] = useLocation();

  // Protect admin routes
  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/admin/login");
    } else if (!isAdmin) {
      setLocation("/");
    }
  }, [isAuthenticated, isAdmin, setLocation]);

  const [isDashboardActive] = useRoute("/admin/dashboard");
  const [isProductsActive] = useRoute("/admin/products");
  const [isOrdersActive] = useRoute("/admin/orders");

  const handleLogout = async () => {
    await logout();
    setLocation("/admin/login");
  };

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-light-gray">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-8">{title}</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <nav className="space-y-2">
              <Link href="/admin/dashboard">
                <a className={`flex items-center p-3 rounded-lg ${
                  isDashboardActive ? 'bg-primary text-white' : 'hover:bg-light-gray'
                }`}>
                  <LayoutDashboard size={20} className="mr-3" />
                  Dashboard
                </a>
              </Link>
              <Link href="/admin/products">
                <a className={`flex items-center p-3 rounded-lg ${
                  isProductsActive ? 'bg-primary text-white' : 'hover:bg-light-gray'
                }`}>
                  <Package size={20} className="mr-3" />
                  Products
                </a>
              </Link>
              <Link href="/admin/orders">
                <a className={`flex items-center p-3 rounded-lg ${
                  isOrdersActive ? 'bg-primary text-white' : 'hover:bg-light-gray'
                }`}>
                  <ClipboardList size={20} className="mr-3" />
                  Orders
                </a>
              </Link>
              <div className={`flex items-center p-3 rounded-lg hover:bg-light-gray cursor-not-allowed opacity-50`}>
                <Users size={20} className="mr-3" />
                Customers
              </div>
              <div className={`flex items-center p-3 rounded-lg hover:bg-light-gray cursor-not-allowed opacity-50`}>
                <Settings size={20} className="mr-3" />
                Settings
              </div>
              <Button 
                variant="ghost" 
                className="flex items-center w-full justify-start p-3 hover:bg-light-gray text-red-600 hover:text-red-700"
                onClick={handleLogout}
              >
                <LogOut size={20} className="mr-3" />
                Logout
              </Button>
            </nav>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-3">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

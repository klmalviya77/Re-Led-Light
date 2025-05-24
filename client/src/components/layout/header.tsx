import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useCart } from "@/contexts/cart-context";
import { useAuth } from "@/contexts/auth-context";
import { 
  Search, 
  ShoppingCart, 
  Menu, 
  X 
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [location, navigate] = useLocation();
  const { openCart, itemCount } = useCart();
  const { isAuthenticated, isAdmin } = useAuth();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    setIsSearchOpen(false);
  };

  const isActive = (path: string) => {
    return location === path ? "text-primary" : "hover:text-primary";
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-primary">
            RE LED LIGHT
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            <Link href="/" className={`font-medium ${isActive("/")}`}>
              Home
            </Link>
            <Link href="/products" className={`font-medium ${isActive("/products")}`}>
              Products
            </Link>
            <a href="#about" className="font-medium hover:text-primary">
              About
            </a>
            <a href="#contact" className="font-medium hover:text-primary">
              Contact
            </a>
            {isAdmin && (
              <Link href="/admin/dashboard" className={`font-medium ${isActive("/admin/dashboard")}`}>
                Admin
              </Link>
            )}
          </nav>
          
          {/* Search, Cart, User Actions */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={toggleSearch}
              className="text-dark hover:text-primary"
              aria-label="Search"
            >
              <Search size={20} />
            </button>
            <button 
              onClick={openCart}
              className="relative text-dark hover:text-primary"
              aria-label="Cart"
            >
              <ShoppingCart size={20} />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
            <button 
              onClick={toggleMobileMenu}
              className="md:hidden text-dark hover:text-primary"
              aria-label="Menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border-gray">
            <nav className="flex flex-col space-y-3">
              <Link 
                href="/" 
                className="font-medium hover:text-primary"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/products" 
                className="font-medium hover:text-primary"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Products
              </Link>
              <a 
                href="#about" 
                className="font-medium hover:text-primary"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </a>
              <a 
                href="#contact" 
                className="font-medium hover:text-primary"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </a>
              {isAdmin && (
                <Link 
                  href="/admin/dashboard" 
                  className="font-medium hover:text-primary"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Admin
                </Link>
              )}
              {!isAuthenticated && isAdmin && (
                <Link 
                  href="/admin/login" 
                  className="font-medium hover:text-primary"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
              )}
            </nav>
          </div>
        )}
        
        {/* Search Bar */}
        {isSearchOpen && (
          <div className="py-4 border-t border-border-gray">
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="text"
                placeholder="Search for products..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-border-gray focus:outline-none focus:ring-2 focus:ring-primary/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <Search className="absolute left-3 top-3 text-gray-400" size={18} />
              <Button 
                type="submit" 
                variant="ghost" 
                size="sm" 
                className="absolute right-2 top-1"
              >
                Search
              </Button>
            </form>
          </div>
        )}
      </div>
    </header>
  );
}

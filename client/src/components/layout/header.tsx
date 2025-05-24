import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/context/auth-context";
import { useCart } from "@/hooks/use-cart";
import { Search, ShoppingCart, User, Menu, X } from "lucide-react";

export function Header() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const { isAdmin, logout } = useAuth();
  const { toggleCart, cartQuantity } = useCart();

  const isActive = (path: string) => location === path;

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/">
            <a className="flex items-center flex-shrink-0">
              <span className="font-bold text-xl text-primary cursor-pointer">RE LED LIGHT</span>
            </a>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/">
              <a className={`${isActive('/') ? 'text-primary' : 'text-gray-700'} hover:text-primary font-medium`}>Home</a>
            </Link>
            <Link href="/products">
              <a className={`${isActive('/products') ? 'text-primary' : 'text-gray-700'} hover:text-primary font-medium`}>Products</a>
            </Link>
            <a href="#" className="text-gray-700 hover:text-primary font-medium">About</a>
            <a href="#" className="text-gray-700 hover:text-primary font-medium">Contact</a>
          </nav>
          
          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSearch(!showSearch)}
              aria-label="Search"
            >
              <Search className="h-5 w-5 text-gray-600 hover:text-primary" />
            </Button>
            
            {/* Cart */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleCart}
              className="relative"
              aria-label="Shopping cart"
            >
              <ShoppingCart className="h-5 w-5 text-gray-600 hover:text-primary" />
              {cartQuantity > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartQuantity}
                </span>
              )}
            </Button>
            
            {/* Admin */}
            {isAdmin ? (
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="Admin menu">
                    <User className="h-5 w-5 text-gray-600 hover:text-primary" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <div className="flex flex-col gap-4 mt-4">
                    <h3 className="text-lg font-semibold">Admin Menu</h3>
                    <Link href="/admin/dashboard">
                      <a className="text-gray-700 hover:text-primary py-2">Dashboard</a>
                    </Link>
                    <Link href="/admin/products">
                      <a className="text-gray-700 hover:text-primary py-2">Manage Products</a>
                    </Link>
                    <Link href="/admin/orders">
                      <a className="text-gray-700 hover:text-primary py-2">View Orders</a>
                    </Link>
                    <Button variant="outline" onClick={logout}>
                      Logout
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            ) : (
              <Link href="/admin/login">
                <Button variant="ghost" size="icon" aria-label="Admin login">
                  <User className="h-5 w-5 text-gray-600 hover:text-primary" />
                </Button>
              </Link>
            )}
            
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5 text-gray-600 hover:text-primary" />
              ) : (
                <Menu className="h-5 w-5 text-gray-600 hover:text-primary" />
              )}
            </Button>
          </div>
        </div>
        
        {/* Search Bar */}
        {showSearch && (
          <div className="py-3 border-t transition-all">
            <div className="relative">
              <Input 
                type="text"
                placeholder="Search for LED products..."
                className="w-full pr-10"
              />
              <Button 
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full"
                aria-label="Search"
              >
                <Search className="h-4 w-4 text-gray-500 hover:text-primary" />
              </Button>
            </div>
          </div>
        )}
        
        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t">
            <div className="flex flex-col space-y-3">
              <Link href="/">
                <a 
                  className={`${isActive('/') ? 'text-primary' : 'text-gray-700'} hover:text-primary font-medium py-2`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </a>
              </Link>
              <Link href="/products">
                <a 
                  className={`${isActive('/products') ? 'text-primary' : 'text-gray-700'} hover:text-primary font-medium py-2`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Products
                </a>
              </Link>
              <a href="#" className="text-gray-700 hover:text-primary font-medium py-2">
                About
              </a>
              <a href="#" className="text-gray-700 hover:text-primary font-medium py-2">
                Contact
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

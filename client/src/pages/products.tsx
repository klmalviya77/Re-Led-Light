import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ProductCard } from "@/components/ui/product-card";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, Grid, List, Loader2 } from "lucide-react";
import { Product } from "@shared/schema";

export default function Products() {
  const [location] = useLocation();
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<string[]>([]);
  const [features, setFeatures] = useState<string[]>([]);
  
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });
  
  // Extract category from URL if present
  useEffect(() => {
    const params = new URLSearchParams(location.split('?')[1]);
    const category = params.get('category');
    if (category && !selectedCategories.includes(category)) {
      setSelectedCategories([category]);
    }
  }, [location]);
  
  // Filter products based on selected filters
  const filteredProducts = products?.filter(product => {
    // Category filter
    if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) {
      return false;
    }
    
    // Price range filter
    if (priceRange.length > 0) {
      const price = product.price;
      
      if (priceRange.includes('under1000') && price >= 100000) {
        return false;
      }
      
      if (priceRange.includes('1000to2500') && (price < 100000 || price > 250000)) {
        return false;
      }
      
      if (priceRange.includes('2500to5000') && (price < 250000 || price > 500000)) {
        return false;
      }
      
      if (priceRange.includes('above5000') && price <= 500000) {
        return false;
      }
    }
    
    // Features filter
    if (features.length > 0) {
      const productFeatures = product.features || [];
      const hasMatchingFeature = features.some(feature => 
        productFeatures.some(f => f.toLowerCase().includes(feature.toLowerCase()))
      );
      
      if (!hasMatchingFeature) {
        return false;
      }
    }
    
    return true;
  });
  
  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };
  
  const togglePriceRange = (range: string) => {
    setPriceRange(prev => 
      prev.includes(range)
        ? prev.filter(r => r !== range)
        : [...prev, range]
    );
  };
  
  const toggleFeature = (feature: string) => {
    setFeatures(prev => 
      prev.includes(feature)
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
    );
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">All Products</h1>
      
      {/* Filters and Search Mobile Toggle */}
      <div className="md:hidden mb-4">
        <Button 
          variant="outline" 
          className="w-full flex justify-between items-center"
          onClick={() => setShowFilters(!showFilters)}
        >
          <span>Filters & Categories</span>
          <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Filters */}
        <div className={`md:w-1/4 ${showFilters ? 'block' : 'hidden md:block'}`}>
          {/* Categories */}
          <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
            <h3 className="font-semibold mb-3 text-lg">Categories</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="category-strip" 
                  checked={selectedCategories.includes('LED Strip Lights')}
                  onCheckedChange={() => toggleCategory('LED Strip Lights')}
                />
                <Label htmlFor="category-strip">LED Strip Lights</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="category-panel" 
                  checked={selectedCategories.includes('Panel Lights')}
                  onCheckedChange={() => toggleCategory('Panel Lights')}
                />
                <Label htmlFor="category-panel">Panel Lights</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="category-decorative" 
                  checked={selectedCategories.includes('Decorative Lights')}
                  onCheckedChange={() => toggleCategory('Decorative Lights')}
                />
                <Label htmlFor="category-decorative">Decorative Lights</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="category-outdoor" 
                  checked={selectedCategories.includes('Outdoor Lights')}
                  onCheckedChange={() => toggleCategory('Outdoor Lights')}
                />
                <Label htmlFor="category-outdoor">Outdoor Lights</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="category-smart" 
                  checked={selectedCategories.includes('Smart Lighting')}
                  onCheckedChange={() => toggleCategory('Smart Lighting')}
                />
                <Label htmlFor="category-smart">Smart Lighting</Label>
              </div>
            </div>
          </div>
          
          {/* Price Range */}
          <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
            <h3 className="font-semibold mb-3 text-lg">Price Range</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="price-under1000"
                  checked={priceRange.includes('under1000')}
                  onCheckedChange={() => togglePriceRange('under1000')}
                />
                <Label htmlFor="price-under1000">Under ₹1,000</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="price-1000to2500"
                  checked={priceRange.includes('1000to2500')}
                  onCheckedChange={() => togglePriceRange('1000to2500')}
                />
                <Label htmlFor="price-1000to2500">₹1,000 - ₹2,500</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="price-2500to5000"
                  checked={priceRange.includes('2500to5000')}
                  onCheckedChange={() => togglePriceRange('2500to5000')}
                />
                <Label htmlFor="price-2500to5000">₹2,500 - ₹5,000</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="price-above5000"
                  checked={priceRange.includes('above5000')}
                  onCheckedChange={() => togglePriceRange('above5000')}
                />
                <Label htmlFor="price-above5000">Above ₹5,000</Label>
              </div>
            </div>
          </div>
          
          {/* Features */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-semibold mb-3 text-lg">Features</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="feature-wifi"
                  checked={features.includes('wifi')}
                  onCheckedChange={() => toggleFeature('wifi')}
                />
                <Label htmlFor="feature-wifi">WiFi Enabled</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="feature-remote"
                  checked={features.includes('remote')}
                  onCheckedChange={() => toggleFeature('remote')}
                />
                <Label htmlFor="feature-remote">Remote Control</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="feature-rgb"
                  checked={features.includes('rgb')}
                  onCheckedChange={() => toggleFeature('rgb')}
                />
                <Label htmlFor="feature-rgb">RGB Colors</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="feature-waterproof"
                  checked={features.includes('waterproof')}
                  onCheckedChange={() => toggleFeature('waterproof')}
                />
                <Label htmlFor="feature-waterproof">Waterproof</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="feature-energy"
                  checked={features.includes('energy')}
                  onCheckedChange={() => toggleFeature('energy')}
                />
                <Label htmlFor="feature-energy">Energy Star Rated</Label>
              </div>
            </div>
          </div>
        </div>
        
        {/* Products Grid */}
        <div className="md:w-3/4">
          {/* Sort and View Options */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2">
              <span className="text-gray-600">Sort by:</span>
              <select className="border rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary/50">
                <option>Featured</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Newest First</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-gray-600 text-sm hidden md:inline">View:</span>
              <Button variant="ghost" size="icon" className="text-primary">
                <Grid className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-primary">
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Products */}
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredProducts && filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium">No products found</h3>
              <p className="text-gray-500 mt-2">Try adjusting your filters or search criteria.</p>
            </div>
          )}
          
          {/* Pagination */}
          {filteredProducts && filteredProducts.length > 0 && (
            <div className="flex justify-center mt-10">
              <nav className="flex items-center space-x-2">
                <Button variant="outline" disabled>Previous</Button>
                <Button variant="default">1</Button>
                <Button variant="outline">2</Button>
                <Button variant="outline">3</Button>
                <Button variant="outline">Next</Button>
              </nav>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

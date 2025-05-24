import { useEffect } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Category, Product } from "@shared/schema";
import { Button } from "@/components/ui/button";
import CategoryCard from "@/components/product/category-card";
import ProductCard from "@/components/product/product-card";
import { 
  Bolt, 
  Clock, 
  Leaf 
} from "lucide-react";

export default function Home() {
  // Set page title
  useEffect(() => {
    document.title = "RE LED LIGHT - Modern LED Lighting Solutions";
  }, []);

  // Fetch categories
  const { data: categories, isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  // Fetch featured products
  const { data: featuredProducts, isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/products/featured"],
  });

  return (
    <>
      {/* Hero Banner */}
      <div className="relative h-[60vh] bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1565538810643-b5bdb714032a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')" }}>
        <div className="absolute inset-0 bg-dark bg-opacity-40"></div>
        <div className="container mx-auto px-4 h-full flex items-center relative z-10">
          <div className="max-w-xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Transform Your Space with Premium LED Lighting</h1>
            <p className="text-lg text-white mb-8">Energy-efficient, stylish, and long-lasting lighting solutions for your home and business</p>
            <div className="flex flex-wrap gap-4">
              <Link href="/products">
                <Button className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-medium">
                  Shop Now
                </Button>
              </Link>
              <a href="#featured">
                <Button variant="outline" className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white border-white px-6 py-3 rounded-lg font-medium backdrop-blur-sm">
                  Featured Products
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Categories Preview */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Shop by Category</h2>
        
        {categoriesLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-200 rounded-lg aspect-square mb-3"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories?.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        )}
      </div>
      
      {/* Featured Products */}
      <div id="featured" className="bg-light-gray py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Featured Products</h2>
          
          {productsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="animate-pulse bg-white rounded-lg p-4">
                  <div className="bg-gray-200 h-56 rounded-md mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-4"></div>
                  <div className="flex justify-between">
                    <div className="h-6 w-16 bg-gray-200 rounded"></div>
                    <div className="h-8 w-24 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featuredProducts?.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
          
          <div className="text-center mt-10">
            <Link href="/products">
              <Button variant="outline" className="border border-primary text-primary hover:bg-primary hover:text-white px-6 py-2 rounded-lg font-medium transition duration-300">
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Why Choose Us */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Why Choose RE LED LIGHT</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bolt className="text-primary" size={24} />
            </div>
            <h3 className="font-semibold text-xl mb-3">Energy Efficient</h3>
            <p className="text-gray-600">Our LED lights consume up to 80% less energy than traditional lighting solutions.</p>
          </div>
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="text-primary" size={24} />
            </div>
            <h3 className="font-semibold text-xl mb-3">Long Lasting</h3>
            <p className="text-gray-600">With up to 50,000 hours of life, our LEDs outlast conventional bulbs by years.</p>
          </div>
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Leaf className="text-primary" size={24} />
            </div>
            <h3 className="font-semibold text-xl mb-3">Eco-Friendly</h3>
            <p className="text-gray-600">Reduce your carbon footprint with our mercury-free, recyclable lighting products.</p>
          </div>
        </div>
      </div>
    </>
  );
}

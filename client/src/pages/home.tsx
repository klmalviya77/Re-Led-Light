import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { CategoryCard } from "@/components/ui/category-card";
import { ProductCard } from "@/components/ui/product-card";
import { FeatureCard } from "@/components/ui/feature-card";
import { useQuery } from "@tanstack/react-query";
import { Lightbulb, Shield, Leaf } from "lucide-react";
import { Product } from "@shared/schema";

export default function Home() {
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });

  const featuredProducts = products?.slice(0, 4) || [];

  const categories = [
    {
      name: "LED Strip Lights",
      image: "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600"
    },
    {
      name: "Panel Lights",
      image: "https://pixabay.com/get/g9ba191850b0f46c33bb2427e183523d4b8cc09a92fe2dd6eef1af0ea528676b80f4e146a1bfb00e3f91a14ecfb03fd7e_1280.jpg"
    },
    {
      name: "Decorative Lights",
      image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600"
    },
    {
      name: "Outdoor Lights",
      image: "https://images.unsplash.com/photo-1558370781-d6196949e317?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600"
    }
  ];

  return (
    <>
      {/* Hero Banner */}
      <div className="relative">
        <div 
          className="h-[60vh] bg-cover bg-center relative" 
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1565538810643-b5bdb714032a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')" }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex items-center">
            <div className="container mx-auto px-6">
              <div className="max-w-lg">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Transform Your Space With LED Lighting</h1>
                <p className="text-gray-200 mb-6">Discover premium quality LED lighting solutions for your home and office.</p>
                <Link href="/products">
                  <Button size="lg">Shop Now</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Categories Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Shop By Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <CategoryCard key={index} name={category.name} image={category.image} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Featured Products */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Featured Products</h2>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm h-64 animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
          <div className="text-center mt-8">
            <Link href="/products">
              <Button variant="outline">View All Products</Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Why Choose Us */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose RE LED LIGHT</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Lightbulb className="h-8 w-8 text-primary" />}
              title="Energy Efficient"
              description="Our LED products save up to 80% more energy compared to traditional lighting."
            />
            <FeatureCard
              icon={<Shield className="h-8 w-8 text-primary" />}
              title="Long Lasting"
              description="Enjoy up to 50,000 hours of lighting with our premium quality LED products."
            />
            <FeatureCard
              icon={<Leaf className="h-8 w-8 text-primary" />}
              title="Eco-Friendly"
              description="Our products contain no harmful substances and are 100% recyclable."
            />
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Upgrade Your Lighting?</h2>
          <p className="mb-8 max-w-2xl mx-auto">Explore our wide range of LED lighting solutions for your home or business. Free shipping on orders above ₹2,000.</p>
          <Link href="/products">
            <Button variant="outline" className="bg-white text-primary hover:bg-gray-100 border-white">
              Shop Now
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}

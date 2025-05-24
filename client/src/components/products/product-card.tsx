import { useState } from "react";
import { Link } from "wouter";
import { Product } from "@shared/schema";
import { useCart } from "@/hooks/use-cart";
import { ShoppingCart, Star, StarHalf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  
  // Calculate discount percentage
  const discount = product.originalPrice 
    ? Math.round(((parseFloat(product.originalPrice.toString()) - parseFloat(product.price.toString())) / parseFloat(product.originalPrice.toString())) * 100) 
    : 0;
  
  // Render star ratings
  const renderRating = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    return (
      <div className="flex items-center">
        <div className="text-accent text-sm mr-1 flex">
          {[...Array(fullStars)].map((_, i) => (
            <Star key={i} className="h-4 w-4 fill-current" />
          ))}
          {hasHalfStar && <StarHalf className="h-4 w-4 fill-current" />}
        </div>
        <span className="text-gray-600 text-sm">({product.reviews})</span>
      </div>
    );
  };

  return (
    <div className="group relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition">
      <Link href={`/product/${product.id}`}>
        <a className="block relative overflow-hidden">
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="w-full h-64 object-cover group-hover:scale-105 transition duration-300"
          />
          {discount > 0 && (
            <Badge className="absolute top-4 right-4 bg-accent text-white font-bold px-2 py-1">
              {discount}% OFF
            </Badge>
          )}
        </a>
      </Link>
      <div className="p-6">
        <Link href={`/product/${product.id}`}>
          <a>
            <h3 className="font-medium text-lg mb-2 hover:text-primary transition">
              {product.name}
            </h3>
          </a>
        </Link>
        <div className="mb-3">
          {renderRating(parseFloat(product.rating.toString()))}
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold">{formatPrice(parseFloat(product.price.toString()))}</span>
            {product.originalPrice && parseFloat(product.originalPrice.toString()) > parseFloat(product.price.toString()) && (
              <span className="text-sm text-gray-500 line-through ml-2">
                {formatPrice(parseFloat(product.originalPrice.toString()))}
              </span>
            )}
          </div>
          <Button 
            variant="default" 
            size="icon" 
            className="bg-primary hover:bg-primary/90 text-white rounded-full"
            onClick={(e) => {
              e.preventDefault();
              addItem(product);
            }}
          >
            <ShoppingCart className="h-4 w-4" />
            <span className="sr-only">Add to cart</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/utils";
import { Link } from "wouter";
import { ShoppingCart } from "lucide-react";
import { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });
  };

  return (
    <Link href={`/products/${product.id}`}>
      <Card className="overflow-hidden hover:shadow-md transition cursor-pointer h-full">
        <div className="aspect-video bg-gray-100">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
        <CardContent className="p-4">
          <h3 className="font-medium mb-1">{product.name}</h3>
          <p className="text-gray-500 text-sm mb-2">
            {product.category}
          </p>
          <div className="flex justify-between items-center">
            <span className="font-bold text-lg">{formatPrice(product.price)}</span>
            <Button
              size="sm"
              variant="ghost"
              className="text-primary hover:text-primary/80"
              onClick={handleAddToCart}
              disabled={!product.inStock}
            >
              <ShoppingCart className="h-4 w-4 mr-1" />
              {product.inStock ? "Add" : "Sold Out"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

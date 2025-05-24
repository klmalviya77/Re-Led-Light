import { Link } from "wouter";
import { Product } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/cart-context";
import { formatPrice } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      salePrice: product.salePrice,
      quantity: 1,
      image: product.image,
    });
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:translate-y-[-5px] hover:shadow-lg">
      <div className="relative">
        <Link href={`/products/${product.slug}`}>
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-56 object-cover"
          />
        </Link>
        {product.badge && (
          <div className="absolute top-2 right-2">
            <span className={`text-white text-xs px-2 py-1 rounded ${
              product.badge === 'new' 
                ? 'bg-accent' 
                : product.badge === 'best seller' 
                  ? 'bg-secondary' 
                  : product.badge === 'sale' 
                    ? 'bg-accent'
                    : 'bg-primary'
            }`}>
              {product.badge === 'best seller' ? 'Best Seller' : product.badge.charAt(0).toUpperCase() + product.badge.slice(1)}
            </span>
          </div>
        )}
      </div>
      <div className="p-4">
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-semibold mb-2 hover:text-primary">{product.name}</h3>
        </Link>
        <p className="text-sm text-gray-600 mb-3">
          {product.description.length > 60 
            ? `${product.description.substring(0, 60)}...` 
            : product.description}
        </p>
        <div className="flex justify-between items-center">
          <div>
            <span className="font-bold text-lg">{formatPrice(product.salePrice || product.price)}</span>
            {product.salePrice && (
              <span className="text-sm text-gray-500 line-through ml-2">{formatPrice(product.price)}</span>
            )}
          </div>
          <Button 
            variant="default" 
            className="bg-primary hover:bg-primary/90 text-white px-3 py-1 rounded text-sm"
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
          >
            {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </Button>
        </div>
      </div>
    </div>
  );
}

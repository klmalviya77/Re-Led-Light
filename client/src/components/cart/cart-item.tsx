import { CartItem as CartItemType } from "@shared/schema";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import ProductQuantity from "@/components/ui/product-quantity";
import { formatPrice } from "@/lib/utils";
import Image from "next/image"; // If using Next.js

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem, isUpdating } = useCart();
  const { product, quantity } = item;
  
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= 100) {
      updateQuantity(product.id, newQuantity);
    }
  };
  
  const handleRemove = () => {
    removeItem(product.id);
  };
  
  const itemTotal = product.price * quantity;

  return (
    <div className="flex flex-col sm:flex-row gap-4 pb-6 border-b border-gray-200 last:border-b-0">
      <div className="sm:w-1/4 aspect-square">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="w-full h-full object-cover rounded-lg"
          loading="lazy"
          width={200}
          height={200}
        />
      </div>
      
      <div className="sm:w-3/4 flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex-1">
          <h4 className="font-medium text-base sm:text-lg">{product.name}</h4>
          <p className="text-gray-600 text-sm line-clamp-2 mb-3">
            {product.shortDescription}
          </p>
          
          <div className="flex items-center">
            <ProductQuantity 
              quantity={quantity}
              min={1}
              max={100}
              onIncrement={() => handleQuantityChange(quantity + 1)}
              onDecrement={() => handleQuantityChange(quantity - 1)}
              onChange={(value) => handleQuantityChange(value)}
              disabled={isUpdating}
            />
          </div>
        </div>
        
        <div className="flex flex-row sm:flex-col justify-between items-end gap-2 sm:gap-4">
          <span className="font-medium text-base sm:text-lg">
            {formatPrice(itemTotal)}
          </span>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-gray-500 hover:text-red-500 p-0 h-auto hover:bg-transparent"
            onClick={handleRemove}
            disabled={isUpdating}
            aria-label="Remove item"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

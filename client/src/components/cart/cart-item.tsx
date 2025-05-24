import { CartItem as CartItemType } from "@shared/schema";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import ProductQuantity from "@/components/ui/product-quantity";
import { formatPrice } from "@/lib/utils";

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart();
  const { product, quantity } = item;
  
  const handleQuantityChange = (newQuantity: number) => {
    updateQuantity(product.id, newQuantity);
  };
  
  const handleRemove = () => {
    removeItem(product.id);
  };
  
  const itemTotal = parseFloat(product.price.toString()) * quantity;

  return (
    <div className="flex flex-col sm:flex-row gap-4 pb-6 border-b border-gray-200">
      <div className="sm:w-1/4">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="w-full h-auto rounded-lg"
        />
      </div>
      <div className="sm:w-3/4 flex flex-col sm:flex-row justify-between">
        <div>
          <h4 className="font-medium">{product.name}</h4>
          <p className="text-gray-600 text-sm mb-2">
            {product.shortDescription.split('.')[0]}
          </p>
          <div className="flex items-center mb-4">
            <ProductQuantity 
              quantity={quantity}
              onIncrement={() => handleQuantityChange(quantity + 1)}
              onDecrement={() => quantity > 1 && handleQuantityChange(quantity - 1)}
            />
          </div>
        </div>
        <div className="flex flex-row sm:flex-col justify-between items-end">
          <span className="font-medium">{formatPrice(itemTotal)}</span>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-gray-500 hover:text-red-500 p-0 h-auto"
            onClick={handleRemove}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

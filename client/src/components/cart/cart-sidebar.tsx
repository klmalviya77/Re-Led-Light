import { useCart } from "@/contexts/cart-context";
import { X, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { formatPrice } from "@/lib/utils";
import Image from "next/image"; // If using Next.js

export default function CartSidebar() {
  const { 
    items, 
    isCartOpen, 
    closeCart, 
    subtotal, 
    removeItem, 
    updateQuantity,
    isUpdating
  } = useCart();

  const itemCount = items.length;
  const isEmpty = itemCount === 0;

  return (
    <div 
      className={`fixed inset-0 md:left-auto h-full w-full md:w-96 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}
      aria-modal="true"
      aria-hidden={!isCartOpen}
      aria-label="Shopping cart"
    >
      <div className="p-6 h-full flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Your Cart {!isEmpty && `(${itemCount})`}
          </h2>
          <button 
            onClick={closeCart}
            className="p-1 text-gray-500 hover:text-primary transition-colors"
            aria-label="Close cart"
          >
            <X size={24} />
          </button>
        </div>
        
        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto">
          {isEmpty ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-10">
              <ShoppingCart className="mx-auto text-gray-300 mb-4" size={48} />
              <p className="text-gray-500 mb-4">Your cart is empty</p>
              <Button
                variant="default"
                className="mt-2"
                onClick={closeCart}
              >
                Start shopping
              </Button>
            </div>
          ) : (
            <ul className="space-y-4 divide-y divide-gray-200">
              {items.map((item) => (
                <li key={item.id} className="py-4 first:pt-0">
                  <div className="flex gap-4">
                    <div className="relative w-20 h-20 flex-shrink-0">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover rounded"
                        loading="lazy"
                        width={80}
                        height={80}
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{item.name}</h4>
                      <p className="text-sm text-gray-500 mb-2">
                        {formatPrice(item.salePrice || item.price)}
                      </p>
                      
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border rounded-md">
                          <button 
                            className="px-2 py-1 text-gray-500 hover:bg-gray-100 disabled:opacity-50"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1 || isUpdating}
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>
                          <span className="px-2 text-sm w-8 text-center">
                            {item.quantity}
                          </span>
                          <button 
                            className="px-2 py-1 text-gray-500 hover:bg-gray-100 disabled:opacity-50"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={isUpdating}
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                        
                        <button 
                          className="text-sm text-red-500 hover:text-red-700 hover:underline"
                          onClick={() => removeItem(item.id)}
                          disabled={isUpdating}
                          aria-label="Remove item"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    
                    <div className="text-right font-medium">
                      {formatPrice((item.salePrice || item.price) * item.quantity)}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        
        {/* Footer */}
        {!isEmpty && (
          <div className="border-t border-gray-200 pt-4 mt-auto">
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
                <span>Total</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
            </div>
            
            <Link href="/checkout">
              <Button 
                className="w-full py-3 rounded-md font-medium"
                size="lg"
                onClick={closeCart}
                disabled={isEmpty || isUpdating}
              >
                Proceed to Checkout
              </Button>
            </Link>
            
            <Button
              variant="outline"
              className="w-full mt-3"
              onClick={closeCart}
              disabled={isUpdating}
            >
              Continue Shopping
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

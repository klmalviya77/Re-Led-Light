import { useCart } from "@/contexts/cart-context";
import { X, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { formatPrice } from "@/lib/utils";

export default function CartSidebar() {
  const { 
    items, 
    isCartOpen, 
    closeCart, 
    subtotal, 
    removeItem, 
    updateQuantity 
  } = useCart();

  return (
    <div className={`fixed top-0 right-0 h-full w-full md:w-96 bg-white shadow-xl z-50 transform transition-transform duration-300 ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="p-6 h-full flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Your Cart</h2>
          <button 
            onClick={closeCart}
            className="text-dark hover:text-primary"
            aria-label="Close cart"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="text-center py-10">
              <ShoppingCart className="mx-auto text-gray-300 mb-4" size={48} />
              <p className="text-gray-500">Your cart is empty</p>
              <Button
                variant="link"
                className="mt-4 text-primary hover:underline"
                onClick={() => {
                  closeCart();
                }}
              >
                Start shopping
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="border-b border-border-gray py-4 flex items-center space-x-4">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-sm text-gray-500">
                      {item.quantity} × {formatPrice(item.salePrice || item.price)}
                    </p>
                    <div className="flex items-center mt-2">
                      <button 
                        className="text-xs bg-light-gray px-2 py-1 rounded"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        -
                      </button>
                      <span className="mx-2 text-sm">{item.quantity}</span>
                      <button 
                        className="text-xs bg-light-gray px-2 py-1 rounded"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">
                      {formatPrice((item.salePrice || item.price) * item.quantity)}
                    </p>
                    <button 
                      className="text-xs text-danger mt-2 hover:underline"
                      onClick={() => removeItem(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="border-t border-border-gray pt-4 mt-4">
          <div className="flex justify-between mb-2">
            <span>Subtotal</span>
            <span className="font-bold">{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between mb-4">
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <div className="flex justify-between text-lg font-bold mb-6">
            <span>Total</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          
          <Link href="/checkout">
            <Button 
              className="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-lg font-medium"
              onClick={closeCart}
              disabled={items.length === 0}
            >
              Proceed to Checkout
            </Button>
          </Link>
          
          <Button
            variant="ghost"
            className="w-full text-center mt-4 text-dark hover:text-primary"
            onClick={closeCart}
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  );
}

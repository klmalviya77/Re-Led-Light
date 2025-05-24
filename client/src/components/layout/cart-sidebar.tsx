import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/utils";
import { Link } from "wouter";
import { Minus, Plus, X, ShoppingBag } from "lucide-react";

export function CartSidebar() {
  const {
    cart,
    isOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    cartTotal
  } = useCart();

  return (
    <div
      className={`fixed inset-0 z-50 ${isOpen ? "block" : "hidden"}`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/25"
        onClick={closeCart}
        aria-hidden="true"
      />
      
      {/* Cart panel */}
      <div className="absolute top-0 right-0 h-full w-full md:w-96 bg-white shadow-xl flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">
            Your Cart {cart.length > 0 && <span className="text-gray-500 text-sm">({cart.reduce((sum, item) => sum + item.quantity, 0)})</span>}
          </h2>
          <Button variant="ghost" size="icon" onClick={closeCart} aria-label="Close">
            <X className="h-5 w-5 text-gray-500 hover:text-gray-700" />
          </Button>
        </div>
        
        {/* Empty Cart State */}
        {cart.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <ShoppingBag className="h-12 w-12 text-gray-300 mb-4" />
            <p className="text-gray-500 mb-4">Your cart is empty</p>
            <Button variant="default" onClick={closeCart}>
              Start Shopping
            </Button>
          </div>
        )}
        
        {/* Cart Items */}
        {cart.length > 0 && (
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 py-4 border-b">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-gray-500 text-sm">Qty: {item.quantity}</p>
                    <div className="flex items-center mt-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-3 w-3 text-gray-500 hover:text-primary" />
                      </Button>
                      <span className="mx-2">{item.quantity}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-3 w-3 text-gray-500 hover:text-primary" />
                      </Button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{formatPrice(item.price * item.quantity)}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700 text-sm mt-1 h-auto p-0"
                      onClick={() => removeFromCart(item.id)}
                      aria-label="Remove item"
                    >
                      <X className="h-3 w-3 mr-1" /> Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Cart Footer */}
        {cart.length > 0 && (
          <div className="p-4 border-t">
            <div className="flex justify-between mb-4">
              <span className="font-medium">Subtotal:</span>
              <span className="font-bold">{formatPrice(cartTotal)}</span>
            </div>
            <Link href="/checkout">
              <Button
                className="w-full mb-2"
                onClick={closeCart}
              >
                Checkout
              </Button>
            </Link>
            <Button
              variant="outline"
              className="w-full"
              onClick={closeCart}
            >
              Continue Shopping
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

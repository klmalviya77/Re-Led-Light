import { useEffect } from "react";
import { Link } from "wouter";
import { useCart } from "@/hooks/use-cart";
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

export default function Cart() {
  // Set page title
  useEffect(() => {
    document.title = "Shopping Cart | RE LED LIGHT";
  }, []);

  const { items, removeItem, updateQuantity, subtotal } = useCart();

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-2xl md:text-3xl font-bold mb-8">Shopping Cart</h1>
      
      {items.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <ShoppingBag className="mx-auto text-gray-300 mb-4" size={64} />
          <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Looks like you haven't added any items to your cart yet.</p>
          <Link href="/products">
            <Button className="bg-primary hover:bg-primary/90 text-white">
              Continue Shopping
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="hidden md:grid grid-cols-12 bg-gray-50 p-4 font-medium text-sm">
                <div className="col-span-6">Product</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-right">Total</div>
              </div>
              
              <div className="divide-y divide-border-gray">
                {items.map((item) => (
                  <div key={item.id} className="p-4 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    <div className="md:col-span-6 flex items-center">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-20 h-20 object-cover rounded mr-4"
                      />
                      <div>
                        <h3 className="font-medium">{item.name}</h3>
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="text-sm text-red-600 hover:text-red-800 flex items-center mt-1"
                        >
                          <Trash2 size={14} className="mr-1" />
                          Remove
                        </button>
                      </div>
                    </div>
                    <div className="md:col-span-2 flex md:justify-center">
                      <span className="md:hidden mr-2 font-medium">Price:</span>
                      <span>{formatPrice(item.salePrice || item.price)}</span>
                    </div>
                    <div className="md:col-span-2 flex md:justify-center">
                      <div className="flex items-center">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus size={14} />
                        </Button>
                        <span className="mx-3">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus size={14} />
                        </Button>
                      </div>
                    </div>
                    <div className="md:col-span-2 text-right font-bold">
                      <span className="md:hidden mr-2 font-medium">Total:</span>
                      {formatPrice((item.salePrice || item.price) * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-6 flex justify-between">
              <Link href="/products">
                <Button variant="outline" className="flex items-center">
                  <ArrowLeft size={16} className="mr-2" />
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-lg font-bold mb-6">Order Summary</h2>
              
              <div className="space-y-3 py-6 border-t border-b border-border-gray mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">Free</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (18%)</span>
                  <span className="font-medium">{formatPrice(subtotal * 0.18)}</span>
                </div>
              </div>
              
              <div className="flex justify-between text-lg font-bold mb-6">
                <span>Total</span>
                <span>{formatPrice(subtotal * 1.18)}</span>
              </div>
              
              <Link href="/checkout">
                <Button className="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-lg font-medium">
                  Proceed to Checkout
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

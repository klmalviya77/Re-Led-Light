import { useEffect } from "react";
import { Link } from "wouter";
import { useCart } from "@/hooks/use-cart";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import CheckoutForm from "@/components/checkout/checkout-form";

export default function Checkout() {
  // Set page title
  useEffect(() => {
    document.title = "Checkout | RE LED LIGHT";
  }, []);

  const { items } = useCart();

  // Redirect if cart is empty
  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <ShoppingBag className="mx-auto text-gray-300 mb-4" size={64} />
          <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Add some items to your cart before proceeding to checkout.</p>
          <Link href="/products">
            <Button className="bg-primary hover:bg-primary/90 text-white">
              Browse Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <section className="py-16 bg-light">
      <div className="container mx-auto px-4">
        <div className="flex items-center mb-8">
          <Link href="/cart">
            <Button variant="ghost" className="mr-4">
              <ArrowLeft size={16} className="mr-2" />
              Back to Cart
            </Button>
          </Link>
          <h2 className="text-2xl md:text-3xl font-bold">Checkout</h2>
        </div>

        <CheckoutForm />
      </div>
    </section>
  );
}

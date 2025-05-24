import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { generateOrderNumber } from "@/lib/utils";
import { CheckCircle } from "lucide-react";

export default function OrderSuccess() {
  const orderNumber = generateOrderNumber();
  
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="bg-white rounded-lg shadow-sm p-8 max-w-2xl mx-auto">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Thank You For Your Order!</h1>
        <p className="text-gray-600 mb-6">
          Your order has been successfully placed. We will process it and deliver your items as soon as possible.
        </p>
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <p className="font-medium">Order #{orderNumber}</p>
          <p className="text-gray-600">A confirmation email has been sent to your email address.</p>
        </div>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/">
            <Button>Back to Homepage</Button>
          </Link>
          <Button variant="outline">Track Order</Button>
        </div>
      </div>
    </div>
  );
}

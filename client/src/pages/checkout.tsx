import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart } from "@/hooks/use-cart";
import { formatPrice, generateOrderNumber } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Loader2 } from "lucide-react";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Form validation schema
const checkoutFormSchema = z.object({
  customerName: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  pinCode: z.string().min(6, "PIN code must be at least 6 characters"),
  paymentMethod: z.enum(["cash", "razorpay"])
});

type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;

export default function Checkout() {
  const [step, setStep] = useState(1);
  const { cart, cartTotal, clearCart } = useCart();
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  
  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      customerName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      pinCode: "",
      paymentMethod: "cash"
    }
  });
  
  const createOrderMutation = useMutation({
    mutationFn: async (data: CheckoutFormValues) => {
      const response = await apiRequest("POST", "/api/orders", {
        ...data,
        items: cart,
        totalAmount: cartTotal
      });
      return response.json();
    },
    onSuccess: () => {
      clearCart();
      setLocation("/order-success");
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to place your order. Please try again.",
      });
    }
  });
  
  const onSubmit = (data: CheckoutFormValues) => {
    if (cart.length === 0) {
      toast({
        variant: "destructive",
        title: "Empty Cart",
        description: "Your cart is empty. Add some products before checking out.",
      });
      return;
    }
    
    createOrderMutation.mutate(data);
  };
  
  // Shipping costs logic
  const isShippingFree = cartTotal >= 200000; // Free shipping for orders above ₹2,000
  const shippingCost = isShippingFree ? 0 : 9900; // ₹99 shipping cost
  
  // Tax calculation (18% GST)
  const taxAmount = Math.round(cartTotal * 0.18);
  
  // Order total
  const orderTotal = cartTotal + taxAmount + shippingCost;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Checkout Form */}
        <div className="lg:w-2/3">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center">
              <div className="flex items-center relative">
                <div className="rounded-full w-8 h-8 bg-primary text-white flex items-center justify-center font-bold">1</div>
                <div className="absolute top-0 -ml-4 text-xs font-medium text-primary w-max mt-10">Shipping</div>
              </div>
              <div className={`flex-1 h-1 ${step >= 2 ? 'bg-primary' : 'bg-gray-200'} mx-2`}></div>
              <div className="flex items-center relative">
                <div className={`rounded-full w-8 h-8 flex items-center justify-center font-bold ${step >= 2 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'}`}>2</div>
                <div className={`absolute top-0 -ml-4 text-xs font-medium w-max mt-10 ${step >= 2 ? 'text-primary' : 'text-gray-500'}`}>Payment</div>
              </div>
              <div className={`flex-1 h-1 ${step >= 3 ? 'bg-primary' : 'bg-gray-200'} mx-2`}></div>
              <div className="flex items-center relative">
                <div className={`rounded-full w-8 h-8 flex items-center justify-center font-bold ${step >= 3 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'}`}>3</div>
                <div className={`absolute top-0 -ml-4 text-xs font-medium w-max mt-10 ${step >= 3 ? 'text-primary' : 'text-gray-500'}`}>Confirmation</div>
              </div>
            </div>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              {/* Step 1: Shipping Information */}
              {step === 1 && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <FormField
                      control={form.control}
                      name="customerName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="john@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem className="mb-4">
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="+91 98765 43210" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem className="mb-4">
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input placeholder="Street Address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input placeholder="Mumbai" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State</FormLabel>
                          <FormControl>
                            <select
                              className="w-full px-3 py-2 border rounded-md"
                              {...field}
                            >
                              <option value="">Select State</option>
                              <option value="Maharashtra">Maharashtra</option>
                              <option value="Delhi">Delhi</option>
                              <option value="Karnataka">Karnataka</option>
                              <option value="Tamil Nadu">Tamil Nadu</option>
                              <option value="Gujarat">Gujarat</option>
                              <option value="Uttar Pradesh">Uttar Pradesh</option>
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="pinCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>PIN Code</FormLabel>
                          <FormControl>
                            <Input placeholder="400001" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="mt-6">
                    <Button
                      type="button"
                      onClick={() => {
                        const isValid = form.trigger(['customerName', 'email', 'phone', 'address', 'city', 'state', 'pinCode']);
                        if (isValid) {
                          setStep(2);
                        }
                      }}
                      className="w-full"
                    >
                      Continue to Payment
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Step 2: Payment Method */}
              {step === 2 && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
                  
                  <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem>
                        <div className="space-y-4">
                          <div className="flex items-center space-x-2">
                            <input
                              type="radio"
                              id="cash"
                              value="cash"
                              checked={field.value === 'cash'}
                              onChange={() => field.onChange('cash')}
                              className="h-4 w-4 text-primary focus:ring-primary"
                            />
                            <Label htmlFor="cash" className="flex-1 p-4 border rounded-lg cursor-pointer">
                              Cash on Delivery
                            </Label>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <input
                              type="radio"
                              id="razorpay"
                              value="razorpay"
                              checked={field.value === 'razorpay'}
                              onChange={() => field.onChange('razorpay')}
                              className="h-4 w-4 text-primary focus:ring-primary"
                            />
                            <Label htmlFor="razorpay" className="flex-1 p-4 border rounded-lg cursor-pointer">
                              Razorpay (Credit/Debit Card, UPI, Netbanking)
                            </Label>
                          </div>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex justify-between mt-6">
                    <Button type="button" variant="outline" onClick={() => setStep(1)}>
                      Back
                    </Button>
                    <Button type="button" onClick={() => setStep(3)}>
                      Review Order
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Step 3: Order Review */}
              {step === 3 && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4">Review Your Order</h2>
                  
                  <div className="mb-6">
                    <h3 className="font-medium mb-2">Shipping Address</h3>
                    <p className="text-gray-600">
                      {form.getValues('customerName')}<br />
                      {form.getValues('address')}<br />
                      {form.getValues('city')}, {form.getValues('state')} {form.getValues('pinCode')}<br />
                      India<br />
                      Phone: {form.getValues('phone')}
                    </p>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="font-medium mb-2">Payment Method</h3>
                    <p className="text-gray-600">
                      {form.getValues('paymentMethod') === 'cash' ? 'Cash on Delivery' : 'Razorpay'}
                    </p>
                  </div>
                  
                  <div className="border-t border-b py-4 mb-4">
                    <h3 className="font-medium mb-2">Order Items</h3>
                    <div className="space-y-3">
                      {cart.map((item) => (
                        <div key={item.id} className="flex justify-between items-center">
                          <div className="flex items-center">
                            <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-md mr-3" />
                            <div>
                              <p className="font-medium">{item.name}</p>
                              <p className="text-gray-500 text-sm">Qty: {item.quantity}</p>
                            </div>
                          </div>
                          <p className="font-bold">{formatPrice(item.price * item.quantity)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-between mt-6">
                    <Button type="button" variant="outline" onClick={() => setStep(2)}>
                      Back
                    </Button>
                    <Button type="submit" disabled={createOrderMutation.isPending}>
                      {createOrderMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        "Place Order"
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </form>
          </Form>
        </div>
        
        {/* Order Summary */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-4">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between py-2 border-b">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-gray-500 text-sm">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-bold">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold">{formatPrice(cartTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{isShippingFree ? 'Free' : formatPrice(shippingCost)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (18% GST)</span>
                <span>{formatPrice(taxAmount)}</span>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>{formatPrice(orderTotal)}</span>
              </div>
            </div>
            
            <div className="mt-6">
              <div className="bg-gray-50 p-4 rounded-lg text-sm">
                <p className="flex items-center text-gray-600 mb-2">
                  <span className="mr-2">🚚</span>
                  <span>Free shipping on orders over ₹2,000</span>
                </p>
                <p className="flex items-center text-gray-600">
                  <span className="mr-2">🔒</span>
                  <span>Secure payment processing</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

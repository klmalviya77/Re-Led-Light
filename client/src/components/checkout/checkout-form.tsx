import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/hooks/use-cart";
import { insertOrderSchema } from "@shared/schema";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { formatPrice } from "@/lib/utils";

// Extended schema with validation
const formSchema = insertOrderSchema.pick({
  customerName: true,
  customerEmail: true,
  customerPhone: true,
  address: true,
  city: true,
  state: true,
  pincode: true,
  paymentMethod: true,
}).extend({
  customerName: z.string().min(3, {
    message: "Name must be at least 3 characters",
  }),
  customerEmail: z.string().email({
    message: "Please enter a valid email address",
  }),
  customerPhone: z.string().regex(/^[0-9]{10}$/, {
    message: "Please enter a valid 10-digit phone number",
  }),
  address: z.string().min(5, {
    message: "Address must be at least 5 characters",
  }),
  city: z.string().min(2, {
    message: "City must be at least 2 characters",
  }),
  state: z.string().min(2, {
    message: "Please select a state",
  }),
  pincode: z.string().regex(/^[0-9]{6}$/, {
    message: "Please enter a valid 6-digit PIN code",
  }),
  paymentMethod: z.enum(["cod", "razorpay"], {
    message: "Please select a payment method",
  }),
});

const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

export default function CheckoutForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const { items, subtotal, clearCart } = useCart();

  // Tax calculation (18% GST)
  const tax = subtotal * 0.18;
  const total = subtotal + tax;

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      paymentMethod: "cod",
    },
  });

  // Create order mutation
  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      // Prepare order items from cart
      const orderItems = items.map(item => ({
        productId: item.id,
        name: item.name,
        price: item.salePrice || item.price,
        quantity: item.quantity,
        image: item.image,
      }));

      // Create complete order data
      const orderData = {
        ...data,
        total,
        items: orderItems,
        status: "pending",
      };

      return apiRequest("POST", "/api/orders", orderData);
    },
    onSuccess: () => {
      toast({
        title: "Order placed successfully",
        description: "Thank you for your purchase!",
      });
      
      // Clear cart and redirect to success page
      clearCart();
      setLocation("/");
    },
    onError: (error) => {
      toast({
        title: "Failed to place order",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (items.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart before checking out",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await mutation.mutateAsync(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-xl font-semibold mb-6">Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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
              name="customerPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="9876543210" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="md:col-span-2">
              <FormField
                control={form.control}
                name="customerEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input placeholder="john.doe@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          
          <h3 className="text-xl font-semibold mb-6">Shipping Address</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Street Address</FormLabel>
                    <FormControl>
                      <Input placeholder="123 Main Street, Apartment 4B" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select State" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {INDIAN_STATES.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="pincode"
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
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-6">Payment Method</h3>
          <FormField
            control={form.control}
            name="paymentMethod"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="space-y-4"
                  >
                    <div className="flex items-center space-x-2 p-4 border border-border-gray rounded-lg">
                      <RadioGroupItem value="cod" id="cod" />
                      <Label htmlFor="cod" className="font-medium cursor-pointer flex-1">
                        Cash on Delivery
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-4 border border-border-gray rounded-lg">
                      <RadioGroupItem value="razorpay" id="razorpay" />
                      <Label htmlFor="razorpay" className="font-medium cursor-pointer flex-1">
                        Razorpay (Credit/Debit Card, UPI, Netbanking)
                      </Label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-6">Order Summary</h3>
          <div className="space-y-4 mb-6">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between pb-4 border-b border-border-gray">
                <div className="flex items-center">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="ml-3">
                    <h4 className="font-medium text-sm">{item.name}</h4>
                    <p className="text-xs text-gray-500">{item.quantity} × {formatPrice(item.salePrice || item.price)}</p>
                  </div>
                </div>
                <span className="font-medium">{formatPrice((item.salePrice || item.price) * item.quantity)}</span>
              </div>
            ))}
          </div>
          
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
              <span className="font-medium">{formatPrice(tax)}</span>
            </div>
          </div>
          
          <div className="flex justify-between text-lg font-bold mb-6">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-lg font-medium"
            disabled={isSubmitting || items.length === 0}
          >
            {isSubmitting ? "Processing..." : "Place Order"}
          </Button>
          
          <div className="mt-6 text-xs text-gray-500 text-center">
            By placing your order, you agree to our <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>.
          </div>
        </div>
      </form>
    </Form>
  );
}

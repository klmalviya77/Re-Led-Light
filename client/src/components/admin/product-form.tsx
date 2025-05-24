import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { generateSlug } from "@/lib/utils";
import { insertProductSchema, Product, Category } from "@shared/schema";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

interface ProductFormProps {
  product?: Product;
  categories: Category[];
  onSuccess: () => void;
}

// Extended schema with validation
const formSchema = insertProductSchema.extend({
  name: z.string().min(3, {
    message: "Product name must be at least 3 characters",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters",
  }),
  price: z.number().min(1, {
    message: "Price must be greater than 0",
  }),
  stock: z.number().min(0, {
    message: "Stock cannot be negative",
  }),
  image: z.string().url({
    message: "Please enter a valid image URL",
  }),
});

export default function ProductForm({ product, categories, onSuccess }: ProductFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Initialize form with default values
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: product
      ? {
          ...product,
          salePrice: product.salePrice || undefined,
          images: product.images || [],
        }
      : {
          name: "",
          slug: "",
          description: "",
          price: 0,
          stock: 0,
          image: "",
          images: [],
          categoryId: undefined,
          featured: false,
          badge: "",
          isActive: true,
        },
  });

  // Handle name change to auto-generate slug
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    if (name) {
      form.setValue("slug", generateSlug(name));
    }
  };

  // Create or update product mutation
  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      if (product) {
        // Update existing product
        return apiRequest("PUT", `/api/products/${product.id}`, data);
      } else {
        // Create new product
        return apiRequest("POST", "/api/products", data);
      }
    },
    onSuccess: () => {
      // Invalidate queries to refetch data
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/products/featured"] });
      
      toast({
        title: `Product ${product ? "updated" : "created"} successfully`,
        description: `The product has been ${product ? "updated" : "added"} to your inventory`,
      });
      
      onSuccess();
    },
    onError: (error) => {
      toast({
        title: `Failed to ${product ? "update" : "create"} product`,
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Name</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter product name" 
                    {...field} 
                    onChange={(e) => {
                      field.onChange(e);
                      handleNameChange(e);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <Input placeholder="product-url-slug" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter product description" 
                  className="min-h-[120px]" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="1000" 
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    value={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="salePrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sale Price (Optional)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="800" 
                    {...field}
                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="stock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stock</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="100" 
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    value={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(Number(value))}
                  defaultValue={field.value?.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
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
            name="badge"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Badge (Optional)</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a badge" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="best seller">Best Seller</SelectItem>
                    <SelectItem value="sale">Sale</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Main Image URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/image.jpg" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="featured"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Featured Product</FormLabel>
                  <div className="text-sm text-muted-foreground">
                    Show this product on the home page
                  </div>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Active Product</FormLabel>
                  <div className="text-sm text-muted-foreground">
                    Make this product visible to customers
                  </div>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={onSuccess}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : product ? "Update Product" : "Create Product"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Product, Category } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/admin-layout";
import ProductForm from "@/components/admin/product-form";
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/utils";
import { Pencil, Trash2, Plus, Search } from "lucide-react";

export default function AdminProducts() {
  // Set page title
  useEffect(() => {
    document.title = "Manage Products | RE LED LIGHT";
  }, []);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch products
  const { data: products = [], isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  // Fetch categories for product form
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  // Delete product mutation
  const deleteProductMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/products/${id}`, undefined);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "Product deleted",
        description: "The product has been deleted successfully",
      });
      setSelectedProductId(null);
    },
    onError: (error) => {
      toast({
        title: "Failed to delete product",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Handle product deletion
  const handleDeleteProduct = async () => {
    if (selectedProductId) {
      await deleteProductMutation.mutateAsync(selectedProductId);
    }
  };

  // Filter products based on search query
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get category name by ID
  const getCategoryName = (categoryId?: number) => {
    if (!categoryId) return "Uncategorized";
    const category = categories.find(c => c.id === categoryId);
    return category?.name || "Unknown";
  };

  return (
    <AdminLayout title="Products Management">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Products</CardTitle>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center">
                <Plus size={16} className="mr-2" />
                Add New Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
                <DialogDescription>
                  Fill in the product details below to create a new product.
                </DialogDescription>
              </DialogHeader>
              <ProductForm 
                categories={categories} 
                onSuccess={() => setIsAddDialogOpen(false)} 
              />
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {/* Search and filters */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={18} />
              <Input
                placeholder="Search products..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {productsLoading ? (
            <div className="py-8 text-center">Loading products...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-lg font-medium">No products found</p>
              <p className="text-gray-500 mt-2">Try adjusting your search or add a new product</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <img 
                            src={product.image} 
                            alt={product.name} 
                            className="h-10 w-10 rounded-md object-cover"
                          />
                          <div>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {product.featured && <span className="text-primary mr-2">Featured</span>}
                              {product.badge && (
                                <span className="text-accent">
                                  {product.badge.charAt(0).toUpperCase() + product.badge.slice(1)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getCategoryName(product.categoryId)}</TableCell>
                      <TableCell>
                        {product.salePrice ? (
                          <div>
                            <span className="font-medium">{formatPrice(product.salePrice)}</span>
                            <span className="text-sm text-muted-foreground line-through ml-2">
                              {formatPrice(product.price)}
                            </span>
                          </div>
                        ) : (
                          <span className="font-medium">{formatPrice(product.price)}</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className={product.stock === 0 ? "text-red-500" : product.stock < 10 ? "text-amber-500" : ""}>
                          {product.stock}
                        </span>
                      </TableCell>
                      <TableCell>
                        {product.isActive ? (
                          <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                            Active
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                            Inactive
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => {
                              setSelectedProduct(product);
                              setIsEditDialogOpen(true);
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="icon"
                                className="text-red-500 border-red-200 hover:text-red-600 hover:bg-red-50"
                                onClick={() => setSelectedProductId(product.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Product</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this product? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-red-500 hover:bg-red-600"
                                  onClick={handleDeleteProduct}
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Product Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Update the product details below.
            </DialogDescription>
          </DialogHeader>
          {selectedProduct && (
            <ProductForm 
              product={selectedProduct} 
              categories={categories} 
              onSuccess={() => {
                setIsEditDialogOpen(false);
                setSelectedProduct(null);
              }} 
            />
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}

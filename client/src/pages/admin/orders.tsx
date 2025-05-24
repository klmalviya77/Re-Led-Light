import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Order } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/admin-layout";
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { formatPrice } from "@/lib/utils";
import { Search, ChevronDown, ChevronUp, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function AdminOrders() {
  // Set page title
  useEffect(() => {
    document.title = "Manage Orders | RE LED LIGHT";
  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [openOrderDetails, setOpenOrderDetails] = useState<number | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch orders
  const { data: orders = [], isLoading } = useQuery<Order[]>({
    queryKey: ["/api/orders"],
  });

  // Update order status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      return apiRequest("PUT", `/api/orders/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      toast({
        title: "Order status updated",
        description: "The order status has been updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to update order status",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Handle status update
  const handleStatusChange = async (id: number, status: string) => {
    await updateStatusMutation.mutateAsync({ id, status });
  };

  // Filter orders based on search query
  const filteredOrders = orders.filter(order => 
    order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.customerPhone.includes(searchQuery)
  );

  // Get status badge color
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  return (
    <AdminLayout title="Orders Management">
      <Card>
        <CardHeader>
          <CardTitle>Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={18} />
              <Input
                placeholder="Search by customer name, email or phone..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {isLoading ? (
            <div className="py-8 text-center">Loading orders...</div>
          ) : filteredOrders.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-lg font-medium">No orders found</p>
              <p className="text-gray-500 mt-2">Try adjusting your search criteria</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>#{order.id}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{order.customerName}</div>
                          <div className="text-xs text-muted-foreground">{order.customerEmail}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatPrice(order.total)}
                      </TableCell>
                      <TableCell>
                        <Select
                          defaultValue={order.status}
                          onValueChange={(value) => handleStatusChange(order.id, value)}
                        >
                          <SelectTrigger className="w-32">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(order.status)}`}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="processing">Processing</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <span className="capitalize">{order.paymentMethod}</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setSelectedOrderId(order.id)}
                              >
                                <Eye className="h-4 w-4" />
                                <span className="sr-only">View</span>
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl">
                              <DialogHeader>
                                <DialogTitle>Order Details</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div>
                                    <h3 className="text-lg font-semibold mb-2">Customer Information</h3>
                                    <div className="space-y-1">
                                      <p><span className="font-medium">Name:</span> {order.customerName}</p>
                                      <p><span className="font-medium">Email:</span> {order.customerEmail}</p>
                                      <p><span className="font-medium">Phone:</span> {order.customerPhone}</p>
                                    </div>
                                  </div>
                                  <div>
                                    <h3 className="text-lg font-semibold mb-2">Shipping Address</h3>
                                    <div className="space-y-1">
                                      <p>{order.address}</p>
                                      <p>{order.city}, {order.state} {order.pincode}</p>
                                    </div>
                                  </div>
                                </div>
                                
                                <div>
                                  <h3 className="text-lg font-semibold mb-2">Order Items</h3>
                                  <div className="border rounded-md overflow-hidden">
                                    <Table>
                                      <TableHeader>
                                        <TableRow>
                                          <TableHead>Product</TableHead>
                                          <TableHead>Price</TableHead>
                                          <TableHead>Quantity</TableHead>
                                          <TableHead className="text-right">Total</TableHead>
                                        </TableRow>
                                      </TableHeader>
                                      <TableBody>
                                        {order.items.map((item, index) => (
                                          <TableRow key={index}>
                                            <TableCell>
                                              <div className="flex items-center space-x-3">
                                                <img 
                                                  src={item.image} 
                                                  alt={item.name} 
                                                  className="h-10 w-10 rounded-md object-cover" 
                                                />
                                                <span>{item.name}</span>
                                              </div>
                                            </TableCell>
                                            <TableCell>{formatPrice(item.price)}</TableCell>
                                            <TableCell>{item.quantity}</TableCell>
                                            <TableCell className="text-right font-medium">
                                              {formatPrice(item.price * item.quantity)}
                                            </TableCell>
                                          </TableRow>
                                        ))}
                                      </TableBody>
                                    </Table>
                                  </div>
                                </div>
                                
                                <div className="border-t pt-4">
                                  <div className="flex justify-between">
                                    <span className="font-medium">Order Total:</span>
                                    <span className="font-bold">{formatPrice(order.total)}</span>
                                  </div>
                                  <div className="flex justify-between mt-1">
                                    <span className="font-medium">Payment Method:</span>
                                    <span className="capitalize">{order.paymentMethod}</span>
                                  </div>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                          
                          <Collapsible
                            open={openOrderDetails === order.id}
                            onOpenChange={() => {
                              setOpenOrderDetails(
                                openOrderDetails === order.id ? null : order.id
                              );
                            }}
                          >
                            <CollapsibleTrigger asChild>
                              <Button variant="outline" size="icon">
                                {openOrderDetails === order.id ? (
                                  <ChevronUp className="h-4 w-4" />
                                ) : (
                                  <ChevronDown className="h-4 w-4" />
                                )}
                                <span className="sr-only">Toggle details</span>
                              </Button>
                            </CollapsibleTrigger>
                          </Collapsible>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
}

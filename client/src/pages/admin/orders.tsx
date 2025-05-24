import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/auth-context";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { formatPrice } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, Loader2, Calendar, Clock, ChevronDown, Eye } from "lucide-react";
import { Order, OrderItem } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AdminOrders() {
  const [_, setLocation] = useLocation();
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  
  // Get orders
  const { data: orders, isLoading } = useQuery<Order[]>({
    queryKey: ['/api/admin/orders'],
    enabled: isAdmin
  });
  
  // Update order status mutation
  const updateOrderStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const response = await apiRequest("PUT", `/api/admin/orders/${id}/status`, {
        status,
        username: "admin",
        password: "admin123"
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/orders'] });
      toast({
        title: "Success",
        description: "Order status updated successfully",
      });
      setIsStatusDialogOpen(false);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update order status. Please try again.",
      });
    }
  });
  
  // Redirect if not admin
  useEffect(() => {
    if (!isAdmin) {
      setLocation("/admin/login");
    }
  }, [isAdmin, setLocation]);
  
  if (!isAdmin) {
    return null;
  }
  
  // Filter orders based on search and status
  const filteredOrders = orders?.filter(order => {
    // Search term filter
    if (searchTerm && 
        !order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !order.id.toString().includes(searchTerm) &&
        !order.email.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Status filter
    if (statusFilter !== "all" && order.status !== statusFilter) {
      return false;
    }
    
    return true;
  });
  
  // Format date
  const formatDate = (dateString: Date) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch (error) {
      return "Invalid date";
    }
  };
  
  // Format time
  const formatTime = (dateString: Date) => {
    try {
      return format(new Date(dateString), "h:mm a");
    } catch (error) {
      return "";
    }
  };
  
  // View order details
  const handleViewOrder = (order: Order) => {
    setCurrentOrder(order);
    setIsDetailsDialogOpen(true);
  };
  
  // Update order status
  const handleUpdateStatus = (order: Order) => {
    setCurrentOrder(order);
    setSelectedStatus(order.status);
    setIsStatusDialogOpen(true);
  };
  
  // Submit status update
  const handleSubmitStatusUpdate = () => {
    if (currentOrder && selectedStatus) {
      updateOrderStatusMutation.mutate({ id: currentOrder.id, status: selectedStatus });
    }
  };
  
  // Status colors
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-indigo-100 text-indigo-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Order Management</h1>
      
      <Card className="mb-8">
        <CardContent className="p-6">
          {/* Order Search & Filter */}
          <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
            <div className="relative md:w-1/3">
              <Input
                type="text"
                placeholder="Search by name, email, or order ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
              <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-500" />
            </div>
            
            <div className="flex gap-2">
              <select 
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
          
          {/* Orders Table */}
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="py-8 flex justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredOrders && filteredOrders.length > 0 ? (
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 font-medium">Order ID</th>
                    <th className="px-4 py-3 font-medium">Customer</th>
                    <th className="px-4 py-3 font-medium">Date</th>
                    <th className="px-4 py-3 font-medium">Total</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="border-b">
                      <td className="px-4 py-3 font-medium">#{order.id}</td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium">{order.customerName}</p>
                          <p className="text-gray-500 text-sm">{order.email}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                          <span>{formatDate(order.createdAt)}</span>
                          <Clock className="h-4 w-4 ml-3 mr-1 text-gray-500" />
                          <span>{formatTime(order.createdAt)}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-medium">{formatPrice(order.totalAmount)}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="mr-2"
                          onClick={() => handleViewOrder(order)}
                        >
                          <Eye className="h-4 w-4 mr-1" /> View
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleUpdateStatus(order)}
                        >
                          Status <ChevronDown className="h-3 w-3 ml-1" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="py-8 text-center">
                <p className="text-gray-500">No orders found. Adjust your filters or wait for new orders.</p>
              </div>
            )}
          </div>
          
          {/* Pagination */}
          {filteredOrders && filteredOrders.length > 0 && (
            <div className="flex justify-between items-center mt-6">
              <div className="text-gray-600 text-sm">
                Showing {filteredOrders.length} of {orders?.length} orders
              </div>
              <nav className="flex items-center space-x-1">
                <Button variant="outline" size="sm" disabled>Previous</Button>
                <Button variant="default" size="sm">1</Button>
                <Button variant="outline" size="sm" disabled>Next</Button>
              </nav>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Order Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              Order #{currentOrder?.id} - {formatDate(currentOrder?.createdAt || new Date())}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div>
              <h3 className="font-semibold mb-2">Customer Information</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium">{currentOrder?.customerName}</p>
                <p className="text-gray-700">{currentOrder?.email}</p>
                <p className="text-gray-700">{currentOrder?.phone}</p>
              </div>
              
              <h3 className="font-semibold mt-4 mb-2">Shipping Address</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p>{currentOrder?.address}</p>
                <p>{currentOrder?.city}, {currentOrder?.state} {currentOrder?.pinCode}</p>
                <p>India</p>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Order Summary</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span>Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(currentOrder?.status || "pending")}`}>
                    {currentOrder?.status.charAt(0).toUpperCase() + currentOrder?.status.slice(1)}
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Order Date:</span>
                  <span>{formatDate(currentOrder?.createdAt || new Date())}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Total Amount:</span>
                  <span className="font-medium">{formatPrice(currentOrder?.totalAmount || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Items:</span>
                  <span>{(currentOrder?.items as OrderItem[])?.reduce((sum, item) => sum + item.quantity, 0) || 0}</span>
                </div>
              </div>
              
              <div className="mt-4">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    setIsDetailsDialogOpen(false);
                    handleUpdateStatus(currentOrder as Order);
                  }}
                >
                  Update Status
                </Button>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="font-semibold mb-2">Order Items</h3>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="px-4 py-2 font-medium">Item</th>
                    <th className="px-4 py-2 font-medium">Price</th>
                    <th className="px-4 py-2 font-medium">Qty</th>
                    <th className="px-4 py-2 font-medium text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {(currentOrder?.items as OrderItem[])?.map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-10 h-10 object-cover rounded mr-3"
                          />
                          <span>{item.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">{formatPrice(item.price)}</td>
                      <td className="px-4 py-3">{item.quantity}</td>
                      <td className="px-4 py-3 text-right font-medium">{formatPrice(item.price * item.quantity)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-50">
                    <td colSpan={3} className="px-4 py-2 font-medium text-right">Total:</td>
                    <td className="px-4 py-2 font-bold text-right">{formatPrice(currentOrder?.totalAmount || 0)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDetailsDialogOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Update Status Dialog */}
      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Order Status</DialogTitle>
            <DialogDescription>
              Change the status for order #{currentOrder?.id}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <label className="block text-sm font-medium mb-2">
              Current Status: 
              <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getStatusColor(currentOrder?.status || "pending")}`}>
                {currentOrder?.status.charAt(0).toUpperCase() + currentOrder?.status.slice(1)}
              </span>
            </label>
            
            <Select
              value={selectedStatus}
              onValueChange={setSelectedStatus}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select new status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsStatusDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitStatusUpdate}
              disabled={updateOrderStatusMutation.isPending || selectedStatus === currentOrder?.status}
            >
              {updateOrderStatusMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Status"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Custom Input component to avoid importing separately
function Input(props: React.InputHTMLAttributes<HTMLInputElement> & { className?: string }) {
  return (
    <input
      {...props}
      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 ${props.className || ''}`}
    />
  );
}

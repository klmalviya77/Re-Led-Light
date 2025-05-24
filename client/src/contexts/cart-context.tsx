import { createContext, useContext, useEffect, useState } from "react";
import { CartItem, cartItemSchema } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  subtotal: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { toast } = useToast();

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        if (Array.isArray(parsedCart)) {
          // Validate each item
          const validItems = parsedCart.filter(item => {
            try {
              cartItemSchema.parse(item);
              return true;
            } catch (e) {
              console.error("Invalid cart item", item, e);
              return false;
            }
          });
          setItems(validItems);
        }
      }
    } catch (error) {
      console.error("Error loading cart from localStorage", error);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  // Calculate subtotal
  const subtotal = items.reduce(
    (total, item) => total + (item.salePrice || item.price) * item.quantity,
    0
  );

  // Calculate total number of items
  const itemCount = items.reduce((count, item) => count + item.quantity, 0);

  const addItem = (newItem: CartItem) => {
    setItems(prevItems => {
      // Check if item already exists in cart
      const existingItemIndex = prevItems.findIndex(item => item.id === newItem.id);
      
      if (existingItemIndex >= 0) {
        // Update quantity if item exists
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + newItem.quantity
        };
        
        toast({
          title: "Item updated in cart",
          description: `${newItem.name} quantity increased to ${updatedItems[existingItemIndex].quantity}`,
        });
        
        return updatedItems;
      } else {
        // Add new item if it doesn't exist
        toast({
          title: "Item added to cart",
          description: `${newItem.name} added to your cart`,
        });
        
        return [...prevItems, newItem];
      }
    });
    
    // Open cart when item is added
    setIsCartOpen(true);
  };

  const removeItem = (id: number) => {
    setItems(prevItems => {
      const item = prevItems.find(item => item.id === id);
      if (item) {
        toast({
          title: "Item removed from cart",
          description: `${item.name} removed from your cart`,
        });
      }
      return prevItems.filter(item => item.id !== id);
    });
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }

    setItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart",
    });
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isCartOpen,
        openCart,
        closeCart,
        subtotal,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price / 100);
}

// Save cart to localStorage
export function saveCartToLocalStorage(cart: any[]): void {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Load cart from localStorage
export function loadCartFromLocalStorage(): any[] {
  const cartData = localStorage.getItem("cart");
  return cartData ? JSON.parse(cartData) : [];
}

// Save admin auth to localStorage
export function saveAdminAuth(username: string, isAdmin: boolean): void {
  localStorage.setItem("admin", JSON.stringify({ username, isAdmin }));
}

// Load admin auth from localStorage
export function loadAdminAuth(): { username: string; isAdmin: boolean } | null {
  const adminData = localStorage.getItem("admin");
  return adminData ? JSON.parse(adminData) : null;
}

// Clear admin auth from localStorage
export function clearAdminAuth(): void {
  localStorage.removeItem("admin");
}

// Generate a random order number
export function generateOrderNumber(): string {
  return Math.floor(10000 + Math.random() * 90000).toString();
}

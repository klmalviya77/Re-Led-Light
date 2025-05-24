import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";

interface ProductQuantityProps {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  className?: string;
}

export default function ProductQuantity({
  quantity,
  onIncrement,
  onDecrement,
  className = ""
}: ProductQuantityProps) {
  return (
    <div className={`flex items-center ${className}`}>
      <Button 
        variant="outline" 
        size="icon" 
        className="h-8 w-8 rounded-md"
        onClick={onDecrement}
        disabled={quantity <= 1}
      >
        <Minus className="h-3 w-3" />
      </Button>
      <span className="px-4 min-w-[40px] text-center">{quantity}</span>
      <Button 
        variant="outline" 
        size="icon" 
        className="h-8 w-8 rounded-md"
        onClick={onIncrement}
      >
        <Plus className="h-3 w-3" />
      </Button>
    </div>
  );
}

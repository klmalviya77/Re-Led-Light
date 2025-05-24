import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

interface ProductFiltersProps {
  onFilterChange: (filters: FilterState) => void;
  initialFilters?: Partial<FilterState>;
}

interface FilterState {
  categories: string[];
  priceRange: number;
  colorTemperatures: string[];
}

export default function ProductFilters({ onFilterChange, initialFilters }: ProductFiltersProps) {
  const [, setLocation] = useLocation();
  
  const [filters, setFilters] = useState<FilterState>({
    categories: initialFilters?.categories || [],
    priceRange: initialFilters?.priceRange || 5000,
    colorTemperatures: initialFilters?.colorTemperatures || [],
  });

  // Update URL when filters change
  useEffect(() => {
    const searchParams = new URLSearchParams();
    
    if (filters.categories.length > 0) {
      searchParams.set('category', filters.categories.join(','));
    }
    
    if (filters.priceRange !== 5000) {
      searchParams.set('maxPrice', filters.priceRange.toString());
    }
    
    if (filters.colorTemperatures.length > 0) {
      searchParams.set('colorTemp', filters.colorTemperatures.join(','));
    }
    
    const search = searchParams.toString();
    setLocation(`/products${search ? `?${search}` : ''}`, { replace: true });
  }, [filters, setLocation]);

  const handleCategoryChange = (category: string, checked: boolean) => {
    if (category === 'all') {
      setFilters(prev => ({
        ...prev,
        categories: checked ? [] : []
      }));
      return;
    }

    setFilters(prev => {
      const newCategories = checked
        ? [...prev.categories, category]
        : prev.categories.filter(c => c !== category);
      
      return {
        ...prev,
        categories: newCategories
      };
    });
  };

  const handleColorTempChange = (colorTemp: string, checked: boolean) => {
    setFilters(prev => {
      const newColorTemps = checked
        ? [...prev.colorTemperatures, colorTemp]
        : prev.colorTemperatures.filter(c => c !== colorTemp);
      
      return {
        ...prev,
        colorTemperatures: newColorTemps
      };
    });
  };

  const handlePriceChange = (value: number[]) => {
    setFilters(prev => ({
      ...prev,
      priceRange: value[0]
    }));
  };

  const applyFilters = () => {
    onFilterChange(filters);
  };

  return (
    <div className="bg-neutral-light p-6 rounded-lg sticky top-24">
      <h3 className="font-bold text-xl mb-4">Filters</h3>
      
      <div className="mb-6">
        <h4 className="font-medium mb-3">Categories</h4>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="all-categories"
              checked={filters.categories.length === 0}
              onCheckedChange={(checked) => handleCategoryChange('all', !!checked)}
            />
            <Label htmlFor="all-categories">All Products</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="strip-lights"
              checked={filters.categories.includes('strip-lights')}
              onCheckedChange={(checked) => handleCategoryChange('strip-lights', !!checked)}
            />
            <Label htmlFor="strip-lights">Strip Lights</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="panel-lights"
              checked={filters.categories.includes('panel-lights')}
              onCheckedChange={(checked) => handleCategoryChange('panel-lights', !!checked)}
            />
            <Label htmlFor="panel-lights">Panel Lights</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="spotlights"
              checked={filters.categories.includes('spotlights')}
              onCheckedChange={(checked) => handleCategoryChange('spotlights', !!checked)}
            />
            <Label htmlFor="spotlights">Spotlights</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="outdoor-lights"
              checked={filters.categories.includes('outdoor-lights')}
              onCheckedChange={(checked) => handleCategoryChange('outdoor-lights', !!checked)}
            />
            <Label htmlFor="outdoor-lights">Outdoor Lights</Label>
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <h4 className="font-medium mb-3">Price Range</h4>
        <div className="space-y-4">
          <Slider
            defaultValue={[filters.priceRange]}
            max={10000}
            step={100}
            onValueChange={handlePriceChange}
          />
          <div className="flex justify-between text-sm text-gray-500 mt-2">
            <span>₹0</span>
            <span>₹{filters.priceRange}</span>
            <span>₹10,000</span>
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <h4 className="font-medium mb-3">Color Temperature</h4>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="warm-white"
              checked={filters.colorTemperatures.includes('warm-white')}
              onCheckedChange={(checked) => handleColorTempChange('warm-white', !!checked)}
            />
            <Label htmlFor="warm-white">Warm White (2700K-3000K)</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="natural-white"
              checked={filters.colorTemperatures.includes('natural-white')}
              onCheckedChange={(checked) => handleColorTempChange('natural-white', !!checked)}
            />
            <Label htmlFor="natural-white">Natural White (3500K-4500K)</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="cool-white"
              checked={filters.colorTemperatures.includes('cool-white')}
              onCheckedChange={(checked) => handleColorTempChange('cool-white', !!checked)}
            />
            <Label htmlFor="cool-white">Cool White (5000K-6500K)</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="rgb"
              checked={filters.colorTemperatures.includes('rgb')}
              onCheckedChange={(checked) => handleColorTempChange('rgb', !!checked)}
            />
            <Label htmlFor="rgb">RGB (Multi-color)</Label>
          </div>
        </div>
      </div>
      
      <Button 
        className="w-full"
        onClick={applyFilters}
      >
        Apply Filters
      </Button>
    </div>
  );
}

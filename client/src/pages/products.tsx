import { useEffect, useState } from "react";
import { useLocation, useSearch } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Category, Product } from "@shared/schema";
import ProductCard from "@/components/product/product-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  ChevronLeft, 
  ChevronRight,
  Search 
} from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Products() {
  // Set page title
  useEffect(() => {
    document.title = "Products | RE LED LIGHT";
  }, []);

  const [searchParams] = useSearch();
  const [, setLocation] = useLocation();
  
  const searchQuery = searchParams?.get("search") || "";
  const categorySlug = searchParams?.get("category") || "";
  
  const [selectedCategory, setSelectedCategory] = useState<string>(categorySlug);
  const [searchTerm, setSearchTerm] = useState<string>(searchQuery);
  const [sortOption, setSortOption] = useState<string>("featured");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const productsPerPage = 8;

  // Fetch categories
  const { data: categories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  // Fetch products
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  // Apply filters and sorting
  const filteredProducts = products?.filter(product => {
    // Category filter
    if (selectedCategory && categories) {
      const category = categories.find(c => c.slug === selectedCategory);
      if (category && product.categoryId !== category.id) return false;
    }
    
    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  }) || [];

  // Apply sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortOption) {
      case "price-low":
        return (a.salePrice || a.price) - (b.salePrice || b.price);
      case "price-high":
        return (b.salePrice || b.price) - (a.salePrice || a.price);
      case "newest":
        return b.id - a.id;
      default:
        return a.featured ? -1 : b.featured ? 1 : 0;
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);
  const currentProducts = sortedProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const handleCategoryChange = (categorySlug: string) => {
    setSelectedCategory(categorySlug);
    setCurrentPage(1);
    updateQueryParams(categorySlug, searchTerm);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    updateQueryParams(selectedCategory, searchTerm);
  };

  const updateQueryParams = (category: string, search: string) => {
    let query = "";
    
    if (category) {
      query += `category=${encodeURIComponent(category)}`;
    }
    
    if (search) {
      query += query ? `&search=${encodeURIComponent(search)}` : `search=${encodeURIComponent(search)}`;
    }
    
    setLocation(query ? `/products?${query}` : "/products");
  };

  return (
    <section className="py-16 bg-light-gray">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">All Products</h2>
        
        {/* Filter and Sort */}
        <div className="flex flex-col md:flex-row justify-between mb-8">
          <div className="mb-4 md:mb-0">
            <label className="block text-sm font-medium mb-2">Filter by Category</label>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={!selectedCategory ? "default" : "outline"}
                className={!selectedCategory ? "bg-primary text-white" : "bg-white hover:bg-gray-100 text-dark"}
                onClick={() => handleCategoryChange("")}
                size="sm"
              >
                All
              </Button>
              
              {categories?.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.slug ? "default" : "outline"}
                  className={selectedCategory === category.slug ? "bg-primary text-white" : "bg-white hover:bg-gray-100 text-dark"}
                  onClick={() => handleCategoryChange(category.slug)}
                  size="sm"
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Sort by</label>
            <Select value={sortOption} onValueChange={setSortOption}>
              <SelectTrigger className="w-[180px] bg-white">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Search Bar (Mobile Only) */}
        <div className="mb-6 md:hidden">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3 top-3 text-gray-400" size={16} />
              <Button 
                type="submit" 
                variant="ghost" 
                size="sm" 
                className="absolute right-2 top-1"
              >
                Search
              </Button>
            </div>
          </form>
        </div>
        
        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="animate-pulse bg-white rounded-lg p-4">
                <div className="bg-gray-200 h-56 rounded-md mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-4"></div>
                <div className="flex justify-between">
                  <div className="h-6 w-16 bg-gray-200 rounded"></div>
                  <div className="h-8 w-24 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : currentProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {currentProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium mb-2">No products found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria</p>
            <Button 
              variant="outline"
              onClick={() => {
                setSelectedCategory("");
                setSearchTerm("");
                setCurrentPage(1);
                updateQueryParams("", "");
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-12">
            <nav className="inline-flex rounded-md shadow">
              <Button
                variant="outline"
                className="py-2 px-4 border border-r-0 border-border-gray rounded-l-md bg-white hover:bg-gray-50"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft size={16} className="mr-1" />
                Previous
              </Button>
              
              {[...Array(totalPages)].map((_, index) => {
                const pageNumber = index + 1;
                return (
                  <Button
                    key={pageNumber}
                    variant={pageNumber === currentPage ? "default" : "outline"}
                    className={`py-2 px-4 border border-r-0 border-border-gray ${
                      pageNumber === currentPage 
                        ? "bg-primary text-white" 
                        : "bg-white hover:bg-gray-50"
                    }`}
                    onClick={() => setCurrentPage(pageNumber)}
                  >
                    {pageNumber}
                  </Button>
                );
              })}
              
              <Button
                variant="outline"
                className="py-2 px-4 border border-border-gray rounded-r-md bg-white hover:bg-gray-50"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight size={16} className="ml-1" />
              </Button>
            </nav>
          </div>
        )}
      </div>
    </section>
  );
}

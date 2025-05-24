import { useEffect, useState } from "react";
import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Product } from "@shared/schema";
import { useCart } from "@/hooks/use-cart";
import ProductGallery from "@/components/product/product-gallery";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Truck, Shield, RefreshCw, CheckCircle, Star, StarHalf } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default function ProductDetail() {
  const { slug } = useParams();
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  // Fetch product details
  const { data: product, isLoading, error } = useQuery<Product>({
    queryKey: [`/api/products/${slug}`],
  });

  // Set page title
  useEffect(() => {
    if (product) {
      document.title = `${product.name} | RE LED LIGHT`;
    }
  }, [product]);

  // Fetch related products based on category
  const { data: relatedProducts } = useQuery<Product[]>({
    queryKey: ["/api/products"],
    enabled: !!product,
  });

  const filteredRelatedProducts = relatedProducts
    ?.filter(p => p.id !== product?.id && p.categoryId === product?.categoryId)
    .slice(0, 4);

  const handleAddToCart = () => {
    if (product) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        salePrice: product.salePrice,
        quantity,
        image: product.image,
      });
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-gray-200 rounded-lg aspect-square"></div>
            <div>
              <div className="h-10 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-6 w-1/2"></div>
              <div className="h-8 bg-gray-200 rounded mb-8"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <p className="mb-6">Sorry, the product you're looking for doesn't exist or has been removed.</p>
        <Link href="/products">
          <Button>Browse All Products</Button>
        </Link>
      </div>
    );
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        {/* Breadcrumbs */}
        <nav className="flex mb-6 text-sm">
          <Link href="/">
            <a className="text-gray-500 hover:text-primary">Home</a>
          </Link>
          <span className="mx-2 text-gray-500">/</span>
          <Link href="/products">
            <a className="text-gray-500 hover:text-primary">Products</a>
          </Link>
          <span className="mx-2 text-gray-500">/</span>
          <span className="text-dark">{product.name}</span>
        </nav>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Product Images */}
          <ProductGallery product={product} />
          
          {/* Product Info */}
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <div className="flex items-center mb-4">
              <div className="flex text-accent">
                <Star className="fill-current" size={18} />
                <Star className="fill-current" size={18} />
                <Star className="fill-current" size={18} />
                <Star className="fill-current" size={18} />
                <StarHalf className="fill-current" size={18} />
              </div>
              <span className="ml-2 text-gray-600">4.5 (128 reviews)</span>
            </div>
            <div className="mb-6">
              <span className="text-3xl font-bold">
                {formatPrice(product.salePrice || product.price)}
              </span>
              {product.salePrice && (
                <>
                  <span className="text-gray-500 line-through ml-3">
                    {formatPrice(product.price)}
                  </span>
                  <span className="bg-accent text-white text-xs px-2 py-1 rounded ml-3">
                    Save {formatPrice(product.price - product.salePrice)}
                  </span>
                </>
              )}
            </div>
            
            <p className="text-gray-700 mb-6">
              {product.description}
            </p>
            
            {/* Quantity */}
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Quantity</h3>
              <div className="flex items-center">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-l-md"
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                >
                  <Minus size={16} />
                </Button>
                <input
                  type="number"
                  value={quantity}
                  min="1"
                  onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                  className="w-16 text-center border-t border-b border-gray-200 py-1"
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-r-md"
                  onClick={() => handleQuantityChange(quantity + 1)}
                >
                  <Plus size={16} />
                </Button>
              </div>
            </div>
            
            {/* Add to Cart / Buy Now */}
            <div className="flex flex-wrap gap-4 mb-6">
              <Button
                className="flex-1 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-medium"
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
              >
                {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
              </Button>
              <Link href="/checkout">
                <Button
                  variant="secondary"
                  className="flex-1 bg-secondary hover:bg-secondary/90 text-secondary-foreground px-6 py-3 rounded-lg font-medium"
                  onClick={() => {
                    if (product.stock > 0) {
                      handleAddToCart();
                    }
                  }}
                  disabled={product.stock <= 0}
                >
                  Buy Now
                </Button>
              </Link>
            </div>
            
            {/* Features / Shipping */}
            <div className="border-t border-gray-200 pt-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start">
                  <Truck className="text-primary mt-1" size={18} />
                  <div className="ml-3">
                    <h4 className="font-medium">Free Shipping</h4>
                    <p className="text-sm text-gray-600">On orders above ₹999</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Shield className="text-primary mt-1" size={18} />
                  <div className="ml-3">
                    <h4 className="font-medium">2-Year Warranty</h4>
                    <p className="text-sm text-gray-600">Manufacturer warranty</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <RefreshCw className="text-primary mt-1" size={18} />
                  <div className="ml-3">
                    <h4 className="font-medium">7-Day Returns</h4>
                    <p className="text-sm text-gray-600">Hassle-free returns</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="text-primary mt-1" size={18} />
                  <div className="ml-3">
                    <h4 className="font-medium">Genuine Product</h4>
                    <p className="text-sm text-gray-600">100% authentic</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Product Description Tabs */}
        <div className="mt-16">
          <div className="border-b border-gray-200">
            <div className="flex flex-wrap -mb-px">
              <button className="inline-block py-4 px-6 border-b-2 border-primary text-primary font-medium">
                Description
              </button>
              <button className="inline-block py-4 px-6 border-b-2 border-transparent hover:text-primary hover:border-primary/30 font-medium">
                Specifications
              </button>
              <button className="inline-block py-4 px-6 border-b-2 border-transparent hover:text-primary hover:border-primary/30 font-medium">
                Reviews (128)
              </button>
              <button className="inline-block py-4 px-6 border-b-2 border-transparent hover:text-primary hover:border-primary/30 font-medium">
                FAQs
              </button>
            </div>
          </div>
          
          <div className="py-6">
            <h3 className="text-xl font-semibold mb-4">Product Description</h3>
            <div className="space-y-4 text-gray-700">
              <p>
                {product.description}
              </p>
              <h4 className="font-semibold text-lg">Key Features:</h4>
              <ul className="list-disc pl-5 space-y-2">
                <li>Energy-efficient LED technology that saves on electricity bills</li>
                <li>Easy installation with clear instructions included</li>
                <li>Adjustable brightness to create the perfect ambiance</li>
                <li>Long-lasting performance with up to 50,000 hours of use</li>
                <li>Low heat emission for safe continuous operation</li>
              </ul>
              <h4 className="font-semibold text-lg">Applications:</h4>
              <p>
                Perfect for homes, offices, retail spaces, and more. Create the perfect lighting environment for any space.
              </p>
              <h4 className="font-semibold text-lg">Package Includes:</h4>
              <ul className="list-disc pl-5 space-y-2">
                <li>1 × {product.name}</li>
                <li>1 × Power Adapter (where applicable)</li>
                <li>1 × User Manual</li>
                <li>Mounting hardware and accessories</li>
              </ul>
              <p>
                Transform your space today with our premium LED lighting solution that combines style, functionality, and energy efficiency.
              </p>
            </div>
          </div>
        </div>
        
        {/* Related Products */}
        {filteredRelatedProducts && filteredRelatedProducts.length > 0 && (
          <div className="mt-12">
            <h3 className="text-2xl font-bold mb-6">You May Also Like</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {filteredRelatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

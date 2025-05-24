import { useState } from "react";
import { useRoute, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { 
  Star, StarHalf, ChevronRight, Minus, Plus, 
  Heart, Truck, Shield, RotateCcw, Check, Loader2 
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductCard } from "@/components/ui/product-card";
import { Product } from "@shared/schema";

export default function ProductDetail() {
  const [_, params] = useRoute<{ id: string }>("/products/:id");
  const [quantity, setQuantity] = useState(1);
  const [activeColorIndex, setActiveColorIndex] = useState(0);
  const { addToCart } = useCart();
  
  const colors = ["red", "blue", "green", "yellow", "purple"];
  
  const productId = params?.id ? parseInt(params.id) : 0;
  
  const { data: product, isLoading, error } = useQuery<Product>({
    queryKey: [`/api/products/${productId}`],
    enabled: !!productId,
  });
  
  const { data: allProducts } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });
  
  // Get related products (from same category, excluding current product)
  const relatedProducts = allProducts
    ?.filter(p => p.category === product?.category && p.id !== product?.id)
    .slice(0, 4) || [];
  
  const handleAddToCart = () => {
    if (product) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
      });
    }
  };
  
  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
          <p className="text-gray-600 mb-6">Sorry, we couldn't find the product you're looking for.</p>
          <Link href="/products">
            <Button>Back to Products</Button>
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <div className="text-sm text-gray-500 mb-6">
        <Link href="/">
          <a className="hover:text-primary">Home</a>
        </Link> 
        <ChevronRight className="inline h-3 w-3 mx-1" />
        <Link href="/products">
          <a className="hover:text-primary">Products</a>
        </Link>
        <ChevronRight className="inline h-3 w-3 mx-1" />
        <span className="text-gray-700">{product.category}</span>
        <ChevronRight className="inline h-3 w-3 mx-1" />
        <span className="text-gray-700">{product.name}</span>
      </div>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Product Image */}
        <div className="md:w-1/2">
          <div className="bg-white rounded-lg overflow-hidden shadow-sm">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-auto"
            />
          </div>
          
          {/* Image Thumbnails */}
          <div className="grid grid-cols-4 gap-2 mt-4">
            <div className="aspect-square bg-white rounded-lg overflow-hidden shadow-sm border-2 border-primary">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
            </div>
            {[...Array(3)].map((_, index) => (
              <div key={index} className="aspect-square bg-white rounded-lg overflow-hidden shadow-sm">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover opacity-70"
                />
              </div>
            ))}
          </div>
        </div>
        
        {/* Product Info */}
        <div className="md:w-1/2">
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <div className="flex items-center mb-4">
            <div className="flex text-amber-400">
              <Star className="fill-current" />
              <Star className="fill-current" />
              <Star className="fill-current" />
              <Star className="fill-current" />
              <StarHalf className="fill-current" />
            </div>
            <span className="text-gray-600 ml-2">4.5 (28 reviews)</span>
          </div>
          
          <div className="mb-6">
            <span className="text-3xl font-bold text-gray-900">{formatPrice(product.price)}</span>
            <span className={`text-sm ml-2 ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
              {product.inStock ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>
          
          <div className="mb-6">
            <p className="text-gray-600 leading-relaxed">{product.description}</p>
          </div>
          
          {/* Product Options */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Color</h3>
            <div className="flex space-x-2">
              {colors.map((color, index) => (
                <button
                  key={color}
                  className={`w-8 h-8 rounded-full ${
                    activeColorIndex === index 
                      ? `ring-2 ring-offset-2 ring-${color}-500` 
                      : ''
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setActiveColorIndex(index)}
                  aria-label={`Select ${color} color`}
                />
              ))}
            </div>
          </div>
          
          {/* Quantity Selector */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Quantity</h3>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="icon"
                onClick={decrementQuantity}
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={incrementQuantity}
                aria-label="Increase quantity"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Add to Cart Button */}
          <div className="flex space-x-4 mb-6">
            <Button
              className="flex-1"
              onClick={handleAddToCart}
              disabled={!product.inStock}
            >
              <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
            </Button>
            <Button
              variant="outline"
              size="icon"
              aria-label="Add to wishlist"
            >
              <Heart className="h-4 w-4 text-gray-500" />
            </Button>
          </div>
          
          {/* Shipping & Returns */}
          <div className="border-t pt-6">
            <div className="flex items-center text-gray-600 mb-3">
              <Truck className="mr-2 h-4 w-4" />
              <span>Free shipping on orders over ₹2,000</span>
            </div>
            <div className="flex items-center text-gray-600 mb-3">
              <Shield className="mr-2 h-4 w-4" />
              <span>2 year warranty included</span>
            </div>
            <div className="flex items-center text-gray-600">
              <RotateCcw className="mr-2 h-4 w-4" />
              <span>30-day return policy</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Product Tabs */}
      <div className="mt-12">
        <Tabs defaultValue="description">
          <TabsList className="border-b w-full justify-start">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="reviews">Reviews (28)</TabsTrigger>
          </TabsList>
          
          <TabsContent value="description" className="py-6">
            <p className="text-gray-600 mb-4">Experience the future of lighting with our premium LED products. Our lights are designed to provide optimal illumination while saving energy and reducing your electricity bills.</p>
            <p className="text-gray-600 mb-4">The advanced technology behind our LEDs ensures long-lasting performance and consistent light output. With a lifespan of up to 50,000 hours, you won't need to worry about replacement for years to come.</p>
            <p className="text-gray-600">Our LED lights are environmentally friendly, containing no harmful substances like mercury, and are 100% recyclable. Make the switch today and contribute to a greener planet while enjoying superior lighting.</p>
          </TabsContent>
          
          <TabsContent value="specifications" className="py-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">Technical Details</h3>
                <table className="w-full text-left">
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2 font-medium text-gray-600">Power Consumption</td>
                      <td className="py-2">10W</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 font-medium text-gray-600">Color Temperature</td>
                      <td className="py-2">RGB / 3000K-6500K Adjustable</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 font-medium text-gray-600">Brightness</td>
                      <td className="py-2">800 lumens</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 font-medium text-gray-600">Voltage</td>
                      <td className="py-2">AC 100-240V</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-medium text-gray-600">Life Span</td>
                      <td className="py-2">50,000 hours</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div>
                <h3 className="font-semibold mb-3">Features</h3>
                <ul className="space-y-2 text-gray-600">
                  {product.features?.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="text-green-500 mt-1 mr-2 h-4 w-4" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="reviews" className="py-6">
            {/* Overall Rating */}
            <div className="flex items-center mb-6">
              <div className="mr-4">
                <div className="text-5xl font-bold">4.5</div>
                <div className="flex text-amber-400">
                  <Star className="fill-current" />
                  <Star className="fill-current" />
                  <Star className="fill-current" />
                  <Star className="fill-current" />
                  <StarHalf className="fill-current" />
                </div>
                <div className="text-gray-500 text-sm">Based on 28 reviews</div>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center mb-1">
                  <span className="text-sm w-10">5 ★</span>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="bg-amber-400 h-full" style={{ width: '70%' }}></div>
                  </div>
                  <span className="text-sm w-10 text-right">70%</span>
                </div>
                <div className="flex items-center mb-1">
                  <span className="text-sm w-10">4 ★</span>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="bg-amber-400 h-full" style={{ width: '20%' }}></div>
                  </div>
                  <span className="text-sm w-10 text-right">20%</span>
                </div>
                <div className="flex items-center mb-1">
                  <span className="text-sm w-10">3 ★</span>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="bg-amber-400 h-full" style={{ width: '5%' }}></div>
                  </div>
                  <span className="text-sm w-10 text-right">5%</span>
                </div>
                <div className="flex items-center mb-1">
                  <span className="text-sm w-10">2 ★</span>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="bg-amber-400 h-full" style={{ width: '3%' }}></div>
                  </div>
                  <span className="text-sm w-10 text-right">3%</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm w-10">1 ★</span>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="bg-amber-400 h-full" style={{ width: '2%' }}></div>
                  </div>
                  <span className="text-sm w-10 text-right">2%</span>
                </div>
              </div>
            </div>
            
            {/* Review List */}
            <div className="space-y-6">
              <div className="border-b pb-6">
                <div className="flex justify-between mb-2">
                  <div className="font-medium">Rajesh Kumar</div>
                  <div className="text-gray-500 text-sm">2 weeks ago</div>
                </div>
                <div className="flex text-amber-400 mb-2">
                  <Star className="fill-current" size={16} />
                  <Star className="fill-current" size={16} />
                  <Star className="fill-current" size={16} />
                  <Star className="fill-current" size={16} />
                  <Star className="fill-current" size={16} />
                </div>
                <p className="text-gray-600">These LED strips are amazing! The colors are vibrant and the app control works flawlessly. I've installed them in my living room and the ambiance they create is perfect for movie nights.</p>
              </div>
              
              <div className="border-b pb-6">
                <div className="flex justify-between mb-2">
                  <div className="font-medium">Priya Sharma</div>
                  <div className="text-gray-500 text-sm">1 month ago</div>
                </div>
                <div className="flex text-amber-400 mb-2">
                  <Star className="fill-current" size={16} />
                  <Star className="fill-current" size={16} />
                  <Star className="fill-current" size={16} />
                  <Star className="fill-current" size={16} />
                  <Star className="text-gray-300" size={16} />
                </div>
                <p className="text-gray-600">Great product but the setup was a bit tricky. Once installed, the lights work perfectly and the color options are endless. The music sync feature is super cool!</p>
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <div className="font-medium">Amit Patel</div>
                  <div className="text-gray-500 text-sm">2 months ago</div>
                </div>
                <div className="flex text-amber-400 mb-2">
                  <Star className="fill-current" size={16} />
                  <Star className="fill-current" size={16} />
                  <Star className="fill-current" size={16} />
                  <Star className="fill-current" size={16} />
                  <StarHalf className="fill-current" size={16} />
                </div>
                <p className="text-gray-600">I've tried several LED strip brands, and this one definitely stands out in terms of quality and brightness. The app is intuitive and the connectivity is stable. Highly recommend!</p>
              </div>
            </div>
            
            {/* More Reviews Button */}
            <div className="mt-6 text-center">
              <Button variant="outline">Load More Reviews</Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Related Products */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {relatedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}

// Import here to avoid circular dependency
import { ShoppingCart } from "lucide-react";

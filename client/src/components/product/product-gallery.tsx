import { useState } from "react";
import { Product } from "@shared/schema";

interface ProductGalleryProps {
  product: Product;
}

export default function ProductGallery({ product }: ProductGalleryProps) {
  const [mainImage, setMainImage] = useState(product.image);
  
  // Ensure we have an array of images, and include the main image
  const allImages = [product.image, ...(product.images || [])].filter(
    (img, index, self) => self.indexOf(img) === index // Remove duplicates
  );

  return (
    <div>
      <div className="mb-4 rounded-lg overflow-hidden">
        <img 
          src={mainImage} 
          alt={product.name} 
          className="w-full h-auto"
        />
      </div>
      {allImages.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {allImages.map((image, index) => (
            <div 
              key={index}
              className={`rounded-lg overflow-hidden cursor-pointer ${
                image === mainImage ? 'border-2 border-primary' : ''
              }`}
              onClick={() => setMainImage(image)}
            >
              <img 
                src={image} 
                alt={`${product.name} - Image ${index + 1}`} 
                className="w-full h-24 object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

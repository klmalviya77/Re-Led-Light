import { Link } from "wouter";
import { Category } from "@shared/schema";

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={`/products?category=${category.slug}`}>
      <div className="group cursor-pointer">
        <div className="rounded-lg overflow-hidden mb-3 relative aspect-square">
          <img 
            src={category.image} 
            alt={category.name} 
            className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark/60 to-transparent"></div>
          <h3 className="absolute bottom-3 left-3 text-white font-semibold text-lg">{category.name}</h3>
        </div>
      </div>
    </Link>
  );
}

import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";

interface CategoryCardProps {
  name: string;
  image: string;
}

export function CategoryCard({ name, image }: CategoryCardProps) {
  return (
    <Link href={`/products?category=${encodeURIComponent(name)}`}>
      <div className="group cursor-pointer">
        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-3">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
          />
        </div>
        <h3 className="font-medium text-center group-hover:text-primary transition">
          {name}
        </h3>
      </div>
    </Link>
  );
}

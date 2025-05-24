import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function HeroBanner() {
  return (
    <section className="relative">
      <div className="relative h-[500px] md:h-[600px] overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=1080" 
          alt="Modern living room with LED lighting" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-dark/80 to-neutral-dark/30 flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-xl">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Transform Your Space with Premium LED Lighting
              </h1>
              <p className="text-lg text-gray-100 mb-8">
                Energy-efficient, customizable lighting solutions for homes and businesses
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white">
                  <Link href="/products">Shop Now</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="bg-white hover:bg-gray-100 text-neutral-dark">
                  <a href="#categories">Explore Categories</a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

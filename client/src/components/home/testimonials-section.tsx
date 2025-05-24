import { Star, StarHalf } from "lucide-react";

interface Testimonial {
  rating: number;
  review: string;
  name: string;
  location: string;
}

const testimonials: Testimonial[] = [
  {
    rating: 5,
    review: "The LED strip lights transformed my living room completely. Easy to install and the colors are vibrant. Excellent customer service too!",
    name: "Priya Sharma",
    location: "New Delhi"
  },
  {
    rating: 5,
    review: "I installed these LED panels in my office, and the difference is night and day. Energy bills are down, and the lighting is perfect for productivity.",
    name: "Raj Patel",
    location: "Mumbai"
  },
  {
    rating: 4.5,
    review: "The outdoor LEDs have weathered two monsoon seasons without any issues. Bright, efficient, and durable - just what we needed for our garden.",
    name: "Ananya Singh",
    location: "Bangalore"
  }
];

export default function TestimonialsSection() {
  return (
    <section className="py-16 bg-neutral-light">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          What Our Customers Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="text-accent flex">
                  {[...Array(Math.floor(testimonial.rating))].map((_, i) => (
                    <Star key={i} className="fill-current" />
                  ))}
                  {testimonial.rating % 1 > 0 && <StarHalf className="fill-current" />}
                </div>
                <span className="ml-2 text-gray-600">{testimonial.rating.toFixed(1)}</span>
              </div>
              <p className="text-gray-600 mb-6">"{testimonial.review}"</p>
              <div className="font-medium">
                <p className="text-neutral-dark">{testimonial.name}</p>
                <p className="text-gray-500 text-sm">{testimonial.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

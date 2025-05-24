import { Bolt, Clock, Leaf } from "lucide-react";

interface Advantage {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

const advantages: Advantage[] = [
  {
    icon: <Bolt className="text-3xl" />,
    title: "Energy Efficient",
    description: "Save up to 80% on your electricity bills with our energy-efficient LED solutions.",
    color: "primary"
  },
  {
    icon: <Clock className="text-3xl" />,
    title: "Long Lasting",
    description: "Our LEDs have a lifespan of up to 50,000 hours - that's over 10 years of use!",
    color: "secondary"
  },
  {
    icon: <Leaf className="text-3xl" />,
    title: "Eco-Friendly",
    description: "LED lights contain no toxic materials and are 100% recyclable, reducing your carbon footprint.",
    color: "accent"
  }
];

export default function AdvantagesSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          Why Choose Our LED Lights?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {advantages.map((advantage, index) => (
            <div key={index} className="text-center p-6 rounded-lg bg-neutral-light">
              <div className={`inline-block p-4 rounded-full bg-${advantage.color}/10 text-${advantage.color} mb-4`}>
                {advantage.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{advantage.title}</h3>
              <p className="text-gray-600">{advantage.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

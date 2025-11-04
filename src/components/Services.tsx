import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Calculator, Receipt, BookOpen, Users, Factory } from "lucide-react";

const services = [
  {
    icon: FileText,
    title: "Accounting and Bookkeeping",
    description: "Automate bookkeeping, tax, and reporting — effortlessly."
  },
  {
    icon: Receipt,
    title: "Tax & Compliance",
    description: "Comprehensive tax services and regulatory compliance"
  },
  {
    icon: Users,
    title: "Fractional CFO",
    description: "Strategic financial leadership for your UAE & KSA business"
  },
  {
    icon: Factory,
    title: "Licensing & Setup", 
    description: "Global Business Licensing for UAE & KSA markets"
  },
  {
    icon: Calculator,
    title: "Consultancy Services",
    description: "Expert Financial Consultancy tailored to your needs"
  },
  {
    icon: BookOpen,
    title: "Financial Management",
    description: "Real-time insights and efficient financial management"
  }  
];

const Services = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">Our Services</h2>
          <p className="text-xl text-muted-foreground">
            Tailored Accounting Solutions for Modern Businesses
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow border-border bg-card">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <service.icon className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-xl text-card-foreground">{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
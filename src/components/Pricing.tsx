import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, User, Users, Building } from "lucide-react";

const plans = [
  {
    icon: User,
    name: "Sole Traders",
    originalPrice: "12.50",
    price: "10",
    period: "+VAT /monthly",
    features: [
      "Complete bookkeeping",
      "Bank and credit card reconciliation",
      "Invoicing, credit control tasks",
      "Custom bookkeeping tasks",
      "Preparation of year end self assessments",
      "Submission to HMRC"
    ]
  },
  {
    icon: Users,
    name: "Partnerships",
    originalPrice: "25",
    price: "20",
    period: "+VAT /monthly",
    features: [
      "Complete bookkeeping",
      "Bank and credit card reconciliation",
      "Invoicing, credit control tasks",
      "Custom bookkeeping tasks",
      "Preparation of partnership accounts",
      "Submission to HMRC"
    ]
  },
  {
    icon: Building,
    name: "Limited Companies",
    originalPrice: "180",
    price: "144",
    period: "+VAT /monthly",
    features: [
      "Complete bookkeeping",
      "Bank and credit card reconciliation",
      "Invoicing, credit control tasks",
      "Custom bookkeeping tasks",
      "Preparation of company accounts",
      "Submission to Companies House"
    ]
  }
];

const Pricing = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h3 className="text-primary font-semibold mb-2">Our Pricing Plans</h3>
          <p className="text-lg text-muted-foreground mb-8">
            Experience Top-notch Services Without Breaking The Bank.
          </p>
          <h2 className="text-4xl font-bold text-foreground">
            We Welcome Our New Clients With a{" "}
            <span className="text-primary">20% Discount</span>
            <br />
            On Our Services.
          </h2>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card key={index} className="relative hover:shadow-xl transition-all duration-300 border-border bg-card group hover:-translate-y-2">
              <CardHeader className="text-center pb-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <plan.icon className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-xl text-card-foreground mb-4">{plan.name}</CardTitle>
                
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">
                    <span className="line-through">£{plan.originalPrice}</span> Starting From
                  </div>
                  <div className="text-5xl font-bold text-foreground">
                    £<span className="text-primary">{plan.price}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">{plan.period}</div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <a href="/lets-connect">
                  <Button 
                    variant="outline" 
                    className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    Speak To An Expert
                  </Button>
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
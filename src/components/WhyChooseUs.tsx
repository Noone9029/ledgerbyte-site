import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Shield, Clock, TrendingUp, Users, CheckCircle } from "lucide-react";

const features = [
  {
    icon: Star,
    title: "Our Customised Plans",
    description: "We are committed to delivering unmatched financial strategies with the support of dedicated accountants. Whether you are a small business, start-up, or running a large corporate sector, our exceptional accountants precisely manage all your financial complexities."
  },
  {
    icon: Shield,
    title: "Effortless Accounts Management",
    description: "Our seamless financial solutions are perfectly tailored to your accounting requirements. Proficient accountants, with their strategic guidance, ensure seamless financial management. Our conscientious bookkeeping team will check entries regularly to ensure their accuracy."
  },
  {
    icon: Users,
    title: "Extensive Expert Guidance",
    description: "Our competent staff of accountants will always be readily available to answer any of your accounting queries. You can schedule a consultation meeting or reach us via phone, email, and calls. We always ensure that your financial goals are not just fulfilled but surpassed."
  },
  {
    icon: CheckCircle,
    title: "Transparent Fee Structure",
    description: "We know the value of every penny you spend, so the work structure is visible with no secret transactions. Our broad spectrum of accounting services completes your tax returns and corporate filings to ensure your business always complies with HMRC."
  },
  {
    icon: Clock,
    title: "Automated Deadlines Alerts",
    description: "Our timely services ensure you never miss any deadline, so we set proactive targets to ensure you stay on top of the advancing financial landscape. Your peace is at the heart of our services."
  },
  {
    icon: TrendingUp,
    title: "Efficient Tax Optimisation",
    description: "Our persistent accountants will meticulously research tax codes to optimise your financial tax efficiency. With us, you will get financial management beyond traditional accounting, which helps unlock success pathways."
  }
];

const WhyChooseUs = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Why Do Businesses Trust Our Online Accounting Services?
          </h2>
          <p className="text-xl text-primary font-semibold">
            We are the UK's biggest online accountancy firm
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-all duration-300 border-border bg-card group hover:-translate-y-1">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-xl text-card-foreground">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
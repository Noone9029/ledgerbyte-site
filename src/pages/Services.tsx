import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Calculator, Receipt, BookOpen, Users, Factory, DollarSign, Building2 } from "lucide-react";
import ZohoLogo from "@/assets/logos/techstack/zoho.svg";
import XeroLogo from "@/assets/logos/techstack/xero.svg";
import CasewareLogo from "@/assets/logos/techstack/caseware.png";
import BotkeeperLogo from "@/assets/logos/techstack/Botkeeper.svg";
import MicrosoftLogo from "@/assets/logos/techstack/microsoft.svg";
import QuickBooksLogo from "@/assets/logos/techstack/quickbooks.svg";

const services = [
  {
    icon: Calculator,
    title: "Accounting and Bookkeeping",
    description: "We automate your accounting by analyzing existing records, selecting and implementing the right software, testing for accuracy, and enabling digital payments—ensuring efficiency and accuracy at every step.",
    features: ["Software Implementation", "Process Automation", "Digital Payments", "Accuracy Testing"]
  },
  {
    icon: Receipt,
    title: "Tax & Compliance",
    description: "Comprehensive tax services and regulatory compliance for UAE & KSA markets, ensuring your business stays compliant while optimizing tax efficiency.",
    features: ["Tax Planning", "Regulatory Compliance", "VAT Services", "Corporate Tax Filing"]
  },
  {
    icon: FileText,
    title: "Fractional CFO",
    description: "Empowering businesses with expert financial consultancy and innovative fintech solutions — driving growth, enhancing efficiency, and enabling smarter financial decisions for a sustainable future.",
    features: ["Expert Financial Advisory", "Business Growth Strategies", "Risk Management", "Investment Planning"]
  },
  {
    icon: Building2,
    title: "US Company Incorporation",
    description: "We specialize in helping entrepreneurs and businesses establish a strong presence in the United States through seamless company incorporation services.",
    features: ["US Business Formation", "Legal Compliance", "Tax Structure Setup", "Ongoing Support"]
  },
  {
    icon: Factory,
    title: "Licensing & Setup", 
    description: "We offer complete business setup and licensing services—from trade name reservation to company registration certificate issuance—along with ongoing support for essential post-registration activities.",
    features: ["Trade Name Reservation", "Company Registration", "License Acquisition", "Post-Registration Support"]
  },
  {
    icon: DollarSign,
    title: "Cashflow Management",
    description: "Stay in control of your business finances with our expert cash flow strategies designed for the UAE & KSA markets. We help you forecast inflows and outflows, optimize working capital.",
    features: ["Cash Flow Forecasting", "Working Capital Optimization", "Liquidity Management", "Financial Planning"]
  }
];

const techStack = [
  { name: "Zoho", logo: ZohoLogo },
  { name: "Xero", logo: XeroLogo },
  { name: "Caseware", logo: CasewareLogo },
  { name: "Botkeeper", logo: BotkeeperLogo },
  { name: "Microsoft Office", logo: MicrosoftLogo },
  { name: "QuickBooks", logo: QuickBooksLogo },
];


const Services = () => {
  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-primary/5">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-foreground mb-6">
            Build Better, <span className="text-primary">Smarter</span> & Faster
            <br />With LedgerByte
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            End-to-End Business & Accounting Solutions. Everything You Need to Start, Run, and Grow Your Business.
          </p>
          <p className="text-lg text-muted-foreground mb-12 max-w-4xl mx-auto">
            From legal company formation to full-scale financial automation, we offer a comprehensive suite of services designed for modern entrepreneurs and enterprises. We specialize in cross-border licensing, accounting automation, tax compliance, and virtual CFO solutions.
          </p>
          <a href="/lets-connect">  
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg">
              Get Started Today
            </Button>
          </a>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Our Comprehensive Services</h2>
            <p className="text-xl text-muted-foreground">
              Tailored solutions for every aspect of your business journey
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 border-border bg-card group hover:border-primary/20">
                <CardHeader className="text-center">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                    <service.icon className="w-10 h-10 text-primary" />
                  </div>
                  <CardTitle className="text-2xl text-card-foreground mb-4">{service.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-muted-foreground text-center leading-relaxed">{service.description}</p>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-card-foreground text-sm">Key Features:</h4>
                    <ul className="space-y-1">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground flex items-center">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-20 bg-muted/20">
        <div className="max-w-6xl mx-auto text-center px-6">
          <h2 className="text-4xl font-bold text-foreground mb-4">Our Tech Stack</h2>
          <p className="text-lg text-muted-foreground mb-12">
            Powered by industry-leading tools and platforms
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-stretch">
            {techStack.map((tech, i) => (
              <div
                key={i}
                className="group flex flex-col items-center justify-between h-40 p-4 rounded-lg border border-border hover:shadow-md transition-shadow bg-white"
              >
                <div className="flex items-center justify-center h-20 w-full">
                  <img
                    src={tech.logo}
                    alt={tech.name}
                    className="max-h-14 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity"
                  />
                </div>
                <p className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors mt-2">
                  {tech.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>




      {/* CTA Section */}
      <section className="py-20 bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-foreground mb-6">
            <span className="text-primary">Kick Start</span> Your Project 🚀
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Whether you're building the next big fintech solution, need smart accounting automation, or are seeking expert financial consultancy, LedgerByte is here to turn your ideas into results. We blend innovation with precision to deliver custom-built solutions that move your business forward.
          </p>
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg">
            Get Quote
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Services;
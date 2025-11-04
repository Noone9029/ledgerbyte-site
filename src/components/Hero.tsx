import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import heroIllustration from "@/assets/hero-illustration.png";

const Hero = () => {
  return (
    <section className="bg-hero-bg text-hero-text py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <div className="bg-hero-accent/20 text-hero-accent px-4 py-2 rounded-full inline-block mb-8">
            Your Trusted Accounting Partner for Business and Financial Growth 🚀
          </div>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="text-hero-accent">Smarter Accounting,</span>
              <br />
              Seamless Growth
            </h1>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-6 h-6 text-hero-accent" />
                <span className="text-lg">Expert Remote Accountants</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-6 h-6 text-hero-accent" />
                <span className="text-lg">Automated bookkeeping and real-time reporting</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-6 h-6 text-hero-accent" />
                <span className="text-lg">Seamless VAT & corporate tax compliance</span>
              </div>
            </div>
            
            <a href="/lets-connect">
              <Button size="lg" className="bg-hero-accent hover:bg-hero-accent/90 text-black font-semibold px-8">
                Book Free Consultation
              </Button>
            </a>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-hero-accent/20 rounded-full blur-3xl"></div>
            <img 
              src={heroIllustration} 
              alt="Professional accounting services illustration"
              className="relative z-10 w-full max-w-md mx-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
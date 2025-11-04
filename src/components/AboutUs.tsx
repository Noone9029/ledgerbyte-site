import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Target, Cog, Award, ChartArea , Lightbulb, Handshake, Rocket } from "lucide-react";
import teamIllustration from "@/assets/team-illustration.png";

const AboutUs = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* About Us Introduction */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-4xl font-bold text-foreground mb-6">
              About <span className="text-primary">Ledger Byte</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              Ledger Byte helps startups and SMEs run their finances smarter.
            </p>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              We bring tech, automation, and expert accounting together — so you can stay compliant, save time, and focus on growing your business.
            </p>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              From bookkeeping and payroll to VAT, Corporate Tax, and financial reporting — we handle the numbers that keep your business moving.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Transparent. Accurate. Modern. That’s how Ledger Byte does finance.
            </p>
          </div>
          
          <div className="relative">
            <img 
              src={teamIllustration} 
              alt="Ledger Byte financial consultancy"
              className="w-full rounded-lg shadow-lg"
            />
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-12 mb-20">
          <Card className="p-8 border-primary/20 hover:shadow-lg transition-shadow">
            <CardHeader className="text-center pb-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl text-foreground">Mission</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground leading-relaxed">
                At Ledger Byte, our mission is to empower startups and SMEs across the GCC with modern, tech-driven accounting solutions. We combine automation, accuracy, and expertise to simplify bookkeeping, payroll, and compliance — giving businesses the clarity and confidence to grow.
              </p>
            </CardContent>
          </Card>

          <Card className="p-8 border-primary/20 hover:shadow-lg transition-shadow">
            <CardHeader className="text-center pb-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl text-foreground">Vision</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground leading-relaxed">
                Our vision is to be the leading remote accounting partner for emerging businesses in the GCC — transforming traditional finance through technology, transparency, and a commitment to smarter, simpler financial management.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Our Values */}
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-foreground mb-4">Our Values</h3>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            By blending deep regional insight with innovative fintech, we empower enterprises to operate with precision, scale with confidence, and achieve sustainable growth in an increasingly digital economy.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="text-center p-6 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lightbulb className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-lg">Accuracy First</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">We don’t guess numbers — we get them right. Precision is the core of everything we do.</p>
            </CardContent>
          </Card>

          <Card className="text-center p-6 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Cog className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-lg">Driven by Technology</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">Modern tools. Smarter workflows. Faster results. That’s how we redefine accounting.</p>
            </CardContent>
          </Card>

          <Card className="text-center p-6 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Handshake className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-lg">Transparency Always</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">Clear communication and honest reporting — no surprises, just trust.</p>
            </CardContent>
          </Card>

          <div className="md:col-span-2 lg:col-span-3 flex justify-center gap-8">
            <Card className="text-center p-6 hover:shadow-lg transition-shadow max-w-sm">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Rocket className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-lg">Client Success = Our Success</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">Your growth is our goal. We treat every client’s business like our own.</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow max-w-sm">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ChartArea className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-lg">Always Evolving</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">We keep learning, improving, and innovating to stay ahead of the curve.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
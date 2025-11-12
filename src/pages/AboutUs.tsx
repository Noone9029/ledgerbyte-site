import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Target, Award, ArrowRight } from "lucide-react";
import sayyam from "@/assets/sayyam.jpeg";
import alina from "@/assets/alina.jpeg";
import waleed from "@/assets/waleed.jpg";
import amir from "@/assets/amir.jpg";
import faisal from "@/assets/faisal.png";
import work from "@/assets/work.png";

// Optional: add qualification logos
import cgma from "@/assets/logos/cgma.jpeg";
import acca from "@/assets/logos/acca.jpeg";
import ca from "@/assets/logos/ca.jpeg";
import lsc from "@/assets/logos/lsc.jpg";

const mainCards = [
  {
    icon: Target,
    title: "Our Mission",
    description:
      "At Ledger Byte, our mission is to empower startups and SMEs across the GCC with modern, tech-driven accounting solutions. We combine automation, accuracy, and expertise to simplify bookkeeping, payroll, and compliance — giving businesses the clarity and confidence to grow.",
  },
  {
    icon: Award,
    title: "Our Vision",
    description:
      "Our vision is to be the leading remote accounting partner for emerging businesses in the GCC — transforming traditional finance through technology, transparency, and a commitment to smarter, simpler financial management.",
  },
  {
    icon: Users,
    title: "Our Values",
    description:
      "At Ledger Byte, we help startups and SMEs across the GCC manage their finances with clarity and confidence. Our team combines technology, expertise, and efficiency to simplify accounting, payroll, and TAX compliance — so business owners can focus on growth, not spreadsheets.",
  },
];

const team = [
  {
    name: "Haider Ali",
    position: "Managing Partner",
    credentials: "ACMA, CGMA",
    description:
      "The driving force behind Ledger Byte, Haider conceptualized and built the company from the ground up. With over 13 years of diversified experience in Pakistan and the GCC, he has successfully led financial management functions across multiple industries, delivering operational efficiency and strategic growth.",
    image: waleed,
    logos: [cgma],
  },
  {
    name: "Faisal Nawaz",
    position: "Head of Accounting",
    credentials: "FCA",
    description:
      "Bringing 25 years of distinguished experience, Faisal has an extensive track record with both national and multinational organizations in Pakistan, delivering exceptional financial leadership and governance.",
    image: faisal,
    logos: [ca],
  },
  {
    name: "Sayyam Nasir",
    position: "Reporting Manager",
    credentials: "ACCA",
    description:
      "A results-oriented finance professional with over 7 years of experience spanning leading firms such as KPMG and diverse industries across the GCC and Pakistan, Sayyam excels in accounting, financial reporting, and process optimization, consistently delivering precision and efficiency.",
    image: sayyam,
    logos: [acca],
  },
  {
    name: "Alina Khalid",
    position: "Communications Manager",
    credentials:
      "BS (Hons.) in Management Sciences (Marketing), MPhil in Development Studies",
    description:
      "Leveraging over 5 years of multidisciplinary experience spanning education research, university lecturing, operations, HR, and administration across diverse sectors, Alina delivers strategic communication acumen and operational excellence to drive organizational success.",
    image: alina,
    logos: [lsc],
  },
  {
    name: "Amir Ilyas",
    position: "Senior Tax Consultant",
    credentials: "FCCA | 12+ years of experience in KSA Accounting & Taxation",
    description:
      "Expert in regulatory requirements with a proven record of guiding businesses through complex tax landscapes, ensuring compliance and sustainable financial growth.",
    image: amir,
    logos: [acca],
  },
];

const AboutUs = () => {
  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-primary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold text-foreground mb-6">
              About <span className="text-primary">LedgerByte</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              We are a forward-thinking financial technology company dedicated
              to revolutionizing how businesses manage their accounting,
              compliance, and growth strategies in the UAE and KSA markets.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/lets-connect">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Get Started <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </a>
              <a href="/services">
                <Button variant="outline" size="lg">
                  Learn More
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="animate-fade-in">
                <h2 className="text-4xl font-bold text-foreground mb-6">
                  The <span className="text-primary">LedgerByte</span> Story
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    Founded in the transformative post-COVID era of 2020, Ledger
                    Byte began as a nimble freelance practice and has since
                    evolved into a premier accounting and financial management
                    firm serving clients across the GCC.
                  </p>
                  <p>
                    Guided by the Japanese Kaizen philosophy of continuous
                    improvement, we blend transparency, innovation, and
                    meticulous attention to detail to position our clients for
                    sustained success. Our team of more than 20 accomplished
                    professionals delivers a comprehensive suite of
                    services—full-cycle accounting, management and statutory
                    reporting, VAT and corporate tax advisory, budgeting,
                    payroll administration, systems implementation, and internal
                    control reviews—through scalable solutions that grow
                    seamlessly with each client's needs.
                  </p>
                  <p>
                    This commitment to excellence reflects the vision of our
                    founder, Haider Ali, a seasoned finance and technology expert
                    who recognized the urgent need to modernize traditional
                    accounting and business-setup practices. Determined to remove
                    barriers to growth, he created a firm where strategic insight
                    and advanced technology work in seamless harmony.
                  </p>
                  <p>
                    Today, with a strong presence across the GCC—particularly in
                    the UAE and KSA—Ledger Byte integrates cutting-edge fintech
                    with deep regional expertise to provide end-to-end financial
                    solutions. From rapid startup incorporation to enterprise-level
                    automation, we are the trusted partner that delivers clarity,
                    precision, and strategic insight for sustainable growth and
                    lasting success.
                  </p>
                </div>
              </div>
              <div className="animate-fade-in">
                <img
                  src={work}
                  alt="Ledger Byte team working together"
                  className="rounded-lg shadow-lg hover-scale"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              What Drives Us
            </h2>
            <p className="text-xl text-muted-foreground">
              Our core principles that guide every decision and interaction
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {mainCards.map((card, index) => (
              <Card
                key={index}
                className="text-center border-border bg-card hover:shadow-lg transition-all duration-300 animate-fade-in hover-scale"
              >
                <CardHeader>
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <card.icon className="w-10 h-10 text-primary" />
                  </div>
                  <CardTitle className="text-2xl text-card-foreground">
                    {card.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {card.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM SECTION */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-muted-foreground">
              Experienced professionals dedicated to your success
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 max-w-[1400px] mx-auto px-4">
            {team.map((member, i) => (
              <Card
                key={i}
                className="group relative flex h-full flex-col border-border bg-card hover:shadow-xl transition-all duration-300"
              >
                <CardContent className="flex h-full flex-col items-center text-center p-7">
                  {/* Avatar */}
                  <div className="relative mb-5 w-36 max-w-[9.5rem]">
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-primary/40 via-amber-500/40 to-primary/40 blur-[10px] opacity-40 group-hover:opacity-60 transition-opacity"></div>
                    <div className="relative rounded-2xl p-[3px] bg-gradient-to-tr from-primary/60 via-amber-500/60 to-primary/60">
                      <div className="rounded-xl bg-card shadow-sm overflow-hidden">
                        <div className="aspect-square">
                          <img
                            src={member.image}
                            alt={member.name}
                            className="h-full w-full object-cover object-center"
                            loading="lazy"
                            decoding="async"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-foreground">
                    {member.name}
                  </h3>
                  <p className="text-primary font-medium mt-0.5">
                    {member.position}
                  </p>
                  <p className="text-xs text-muted-foreground font-medium mt-2">
                    {member.credentials}
                  </p>

                  {/* Qualification Logos - bigger now */}
                  {member.logos?.length > 0 && (
                    <div className="mt-3 flex flex-wrap items-center justify-center gap-4">
                      {member.logos.map((logo, idx) => (
                        <img
                          key={idx}
                          src={logo}
                          alt="qualification logo"
                          className="h-9 lg:h-10 w-auto object-contain opacity-90 group-hover:opacity-100 transition-opacity"
                          loading="lazy"
                          decoding="async"
                        />
                      ))}
                    </div>
                  )}

                  {/* Bio (no clamp -> full text) */}
                  <p className="mt-4 text-sm leading-7 text-muted-foreground">
                    {member.description}
                  </p>

                  {/* Spacer so hover lift has room; keeps layout calm */}
                  <div className="mt-4" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-foreground mb-6">
            Ready to <span className="text-primary">Transform</span> Your
            Business?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Join hundreds of successful businesses that trust LedgerByte for
            their financial and operational needs. Let's build something amazing
            together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/lets-connect">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Start Your Journey <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </a>
            <a href="/lets-connect">
              <Button variant="outline" size="lg">
                Schedule a Consultation
              </Button>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutUs;

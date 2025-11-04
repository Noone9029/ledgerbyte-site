import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, MapPin, Clock, Send, MessageCircle } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { fbq } from "@/lib/fbq"; // Meta Pixel bridge

const contactSchema = z.object({
  name: z.string().trim().min(2, { message: "Name must be at least 2 characters" }).max(100, { message: "Name must be less than 100 characters" }),
  email: z.string().trim().email({ message: "Please enter a valid email address" }).max(255, { message: "Email must be less than 255 characters" }),
  phone: z.string().trim().min(8, { message: "Please enter a valid phone number" }).max(20, { message: "Phone number must be less than 20 characters" }),
  company: z.string().trim().max(100, { message: "Company name must be less than 100 characters" }).optional(),
  service: z.string().trim().min(1, { message: "Please select a service" }),
  message: z.string().trim().min(10, { message: "Message must be at least 10 characters" }).max(1000, { message: "Message must be less than 1000 characters" })
});

const services = [
  "Financial Consultancy",
  "Licensing & Setup",
  "Accounting Automation", 
  "US Company Incorporation",
  "Cashflow Management",
  "Tax & Compliance",
  "Virtual CFO Services",
  "Other"
];

const LetsConnect = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    service: "",
    message: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }));
  };

  const validateForm = () => {
    try {
      contactSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) newErrors[err.path[0] as string] = err.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form before submitting.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Create WhatsApp message
      const whatsappMessage = `New Contact Form Submission:
      Name: ${formData.name}
      Email: ${formData.email}
      Phone: ${formData.phone}
      Company: ${formData.company || 'Not provided'}
      Service: ${formData.service}
      Message: ${formData.message}`;

      const encodedMessage = encodeURIComponent(whatsappMessage);
      const whatsappUrl = `https://wa.me/971561371569?text=${encodedMessage}`;
      
      // Open WhatsApp in new tab
      window.open(whatsappUrl, '_blank');

      fbq("track", "Contact", {
        content_name: "Contact Form Submission",
        content_category: formData.service || "General Inquiry",
        status: "submitted",
        // advanced matching (Meta hashes client-side)
        em: formData.email,
        ph: formData.phone.replace(/\D/g, ""),
        fn: formData.name.split(" ")[0] || undefined,
        ln: formData.name.split(" ").slice(1).join(" ") || undefined,
      });

      toast({
        title: "Message Sent!",
        description: "Your message has been forwarded to WhatsApp. We'll get back to you soon!",
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        service: "",
        message: ""
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an issue sending your message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-primary/5">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-foreground mb-6">
            Let's <span className="text-primary">Connect</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Ready to transform your business? Get in touch with our experts today and discover how LedgerByte can help you achieve your financial goals in the UAE and KSA markets.
          </p>
        </div>
      </section>

      {/* Contact Form & Sidebar */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-[1.15fr_.85fr] gap-10 max-w-6xl mx-auto">
            {/* LEFT: Contact Form */}
            <Card className="border-border bg-card">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl text-card-foreground flex items-center">
                  <Send className="w-6 h-6 text-primary mr-2" />
                  Send us a Message
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        className={errors.name ? "border-red-500" : ""}
                        placeholder="Enter your full name"
                      />
                      {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className={errors.email ? "border-red-500" : ""}
                        placeholder="Enter your email"
                      />
                      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        className={errors.phone ? "border-red-500" : ""}
                        placeholder="+971-00-000-0000 "
                      />
                      {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                    </div>
                    <div>
                      <Label htmlFor="company">Company Name</Label>
                      <Input
                        id="company"
                        type="text"
                        value={formData.company}
                        onChange={(e) => handleInputChange("company", e.target.value)}
                        placeholder="Enter company name (optional)"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="service">Service of Interest *</Label>
                    <select
                      id="service"
                      value={formData.service}
                      onChange={(e) => handleInputChange("service", e.target.value)}
                      className={`w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2 ${errors.service ? "border-red-500" : ""}`}
                    >
                      <option value="">Select a service</option>
                      {services.map((service) => (
                        <option key={service} value={service}>{service}</option>
                      ))}
                    </select>
                    {errors.service && <p className="text-red-500 text-sm mt-1">{errors.service}</p>}
                  </div>

                  <div>
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      className={errors.message ? "border-red-500" : ""}
                      placeholder="Tell us about your project or requirements..."
                      rows={5}
                    />
                    {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                    <Send className="w-4 h-4 ml-2" />
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* RIGHT: Sticky Sidebar */}
            <div className="space-y-8 lg:sticky lg:top-24 self-start">
              {/* Combined Contact Card */}
              <Card className="border-border bg-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-2xl text-card-foreground flex items-center">
                    <MessageCircle className="w-6 h-6 text-primary mr-2" />
                    Quick Contact
                  </CardTitle>
                  <p className="text-muted-foreground text-sm">
                    Need instant help? Ping us on WhatsApp, or use email/phone below.
                  </p>
                </CardHeader>
                <CardContent className="space-y-5">
                  {/* WhatsApp CTA */}
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700 text-white h-11"
                    onClick={() => window.open('https://wa.me/971561371569', '_blank')}
                    aria-label="Chat on WhatsApp"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Chat on WhatsApp
                  </Button>

                  {/* Email + Phone pills */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <a
                      href="mailto:info@ledgerbyte.io"
                      className="group flex items-center gap-3 p-4 rounded-xl border bg-background hover:border-primary/50 hover:bg-primary/5 transition-colors"
                    >
                      <span className="inline-flex w-10 h-10 items-center justify-center rounded-full bg-primary/10">
                        <Mail className="w-5 h-5 text-primary" />
                      </span>
                      <div>
                        <div className="text-xs text-muted-foreground">Email Us</div>
                        <div className="font-medium text-primary group-hover:underline">
                          info@ledgerbyte.io
                        </div>
                        <div className="text-[11px] text-muted-foreground">We’ll respond within 24 hours</div>
                      </div>
                    </a>

                    <a
                      href="tel:+971561371569"
                      className="group flex items-center gap-3 p-4 rounded-xl border bg-background hover:border-primary/50 hover:bg-primary/5 transition-colors"
                    >
                      <span className="inline-flex w-10 h-10 items-center justify-center rounded-full bg-primary/10">
                        <Phone className="w-5 h-5 text-primary" />
                      </span>
                      <div>
                        <div className="text-xs text-muted-foreground">Call Us</div>
                        <div className="font-medium text-primary group-hover:underline">
                          +971 56 137 1569
                        </div>
                      </div>
                    </a>
                  </div>
                </CardContent>
              </Card>

              {/* Why Choose — lighter look */}
              <Card className="border-dashed border-border bg-card/70">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl text-card-foreground">
                    Why Choose LedgerByte?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-3">
                      <div className="mt-1 w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                      Decades of combined experience across UAE & KSA regulatory frameworks and financial standards
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="mt-1 w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                      Precision in bookkeeping, reporting, and taxation aligned with local & international compliance
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="mt-1 w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                      VAT filings, corporate tax, payroll, management reporting — under one roof
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="mt-1 w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                      Practical insights and proactive guidance for informed, profitable decisions
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default LetsConnect;
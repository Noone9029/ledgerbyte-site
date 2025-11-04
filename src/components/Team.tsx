import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Users, Award, GraduationCap } from "lucide-react";

const team = [
  {
    icon: Award,
    name: "Haider Ali",
    role: "CEO & Founder",
    credentials: "ACMA, CGMA | 15+ years of experience in UAE & Pakistan",
    description: "Visionary leader with a proven track record in accounting. Haider has successfully driven growth, built agile teams and delivered tech-enabled financial solutions that transform businesses and empower clients."
  },
  {
    icon: User,
    name: "Faisal Nawaz",
    role: "Head of Accounting",
    credentials: "FCA",
    description: "Bringing 25 years of distinguished experience, Faisal has an extensive track record with both national and multinational organizations in Pakistan, delivering exceptional financial leadership and governance."
  },
  {
    icon: GraduationCap,
    name: "Muhammad Sayyam Nasir",
    role: "Accounting and Reporting Manager",
    credentials: "ACCA Member | 5+ years in Accounting & Financial Management",
    description: "Results-driven professional with expertise in Risk Advisory and Internal Audit. Former KPMG Pakistan team member with extensive Dubai & KSA market experience."
  },
  {
    icon: Users,
    name: "Alina Khalid",
    role: "People & Comms Lead",
    credentials: "BS Management Sciences, MPhil Development Studies",
    description: "HR specialist with 4+ years in academia and HRM, focusing on organizational culture, talent development, and communication strategies across education and corporate sectors."
  },
  {
    icon: User,
    name: "Amir Ilyas",
    role: "Head of KSA Taxation",
    credentials: "Tax Specialist | KSA Market Expert",
    description: "Specialized taxation expert focusing on Saudi Arabian market regulations and compliance requirements for businesses operating in the Kingdom."
  }
];

const Team = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">Our Expert Team</h2>
          <p className="text-xl text-muted-foreground">
            Meet the professionals driving your business success
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {team.map((member, index) => (
            <Card key={index} className="hover:shadow-xl transition-all duration-300 border-border bg-card group hover:-translate-y-1">
              <CardHeader className="pb-4">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                    <member.icon className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-card-foreground mb-1">{member.name}</CardTitle>
                    <p className="text-primary font-semibold text-sm mb-2">{member.role}</p>
                    <p className="text-muted-foreground text-xs">{member.credentials}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm leading-relaxed">{member.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;
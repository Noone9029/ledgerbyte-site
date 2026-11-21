export interface ServiceEntry {
  division: "finance";
  slug: string;
  title: string;
  description: string;
  source: string;
}

export interface ContactRequest {
  fullName: string;
  email: string;
  phone?: string;
  companyName?: string;
  service: string;
  message: string;
}

export interface FinanceService extends ServiceEntry {
  sourceHtml: string;
  category: string;
  primaryFocus: string;
  outcomes: string[];
  reviewer: {
    name: string;
    role: string;
    credentials: string;
    summary: string;
  };
  idealFor: string[];
  overviewHeading: string;
  overview: string[];
  deliverables: string[];
  platforms: string[];
  processIntro: string;
  process: Array<{
    step: string;
    title: string;
    description: string;
  }>;
  trustPoints: string[];
  engagementExamples: Array<{
    profile: string;
    title: string;
    challenge: string;
    result: string;
  }>;
  relatedResources: Array<{
    pillar: string;
    title: string;
    description: string;
    href: string;
  }>;
  faqs: Array<{
    question: string;
    answer: string;
  }>;
  relatedServices: Array<{
    category: string;
    title: string;
    description: string;
  }>;
  cta: {
    title: string;
    description: string;
  };
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
}

export interface TeamMember {
  name: string;
  role: string;
  credentials: string;
  homepageCredentials?: string;
  description: string;
  image: string;
  source: string;
}

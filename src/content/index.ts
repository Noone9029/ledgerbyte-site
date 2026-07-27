import financeData from "@/content/generated/finance-services.json";
import technologyData from "@/content/generated/technology-services.json";
import technologyProcessData from "@/content/generated/technology-process.json";
import userProvidedCopy from "@/content/user-provided.json";
import type {
  FinanceService,
  ProcessStep,
  TeamMember,
  TechnologyService,
} from "@/content/types";

export const financeServices = financeData as FinanceService[];
export const technologyServices = technologyData as TechnologyService[];

export const technologyProcess = {
  ...technologyProcessData,
  steps: technologyProcessData.steps as ProcessStep[],
};

export const financeServiceGroups = [
  {
    title: "Finance Operations",
    description:
      "Day-to-day accounting support, payroll discipline, and systems that keep finance operations running cleanly.",
    services: [
      "Accounting & Bookkeeping",
      "Accounting Automation & Systems",
      "Payroll & WPS Management",
    ],
    source: "rendered-text/ledgerbyte.io/services.txt",
  },
  {
    title: "Compliance & Reporting",
    description:
      "Tax, VAT, and reporting support that gives leadership cleaner visibility and fewer compliance surprises.",
    services: ["Tax, VAT & Compliance", "Financial Reporting & MIS"],
    source: "rendered-text/ledgerbyte.io/services.txt",
  },
  {
    title: "Planning & Advisory",
    description:
      "Forward-looking finance support for forecasting, cash discipline, and leadership decision-making.",
    services: [
      "Cash Flow & Working Capital",
      "Budgeting & Forecasting",
      "Fractional CFO & Finance Advisory",
    ],
    source: "rendered-text/ledgerbyte.io/services.txt",
  },
] as const;

export const trustPoints = [
  {
    title: "Qualified Finance Oversight",
    description:
      "Senior reviewers with ACMA, CGMA, FCA, and ACCA credentials across core finance disciplines.",
    source: "rendered-text/ledgerbyte.io/index.txt",
  },
  {
    title: "Built for Growing Businesses",
    description:
      "Support spanning bookkeeping, payroll, reporting, planning, and fractional CFO advisory.",
    source: "rendered-text/ledgerbyte.io/index.txt",
  },
  {
    title: "Global Operating Support",
    description:
      "A remote-first delivery model designed for modern businesses operating across markets and teams.",
    source: "rendered-text/ledgerbyte.io/index.txt",
  },
  {
    title: "Process-Led Execution",
    description:
      "Structured workflows using cloud accounting tools, reporting packs, and documented finance routines.",
    source: "rendered-text/ledgerbyte.io/index.txt",
  },
] as const;

export const companyStory = {
  title: "The LedgerByte Story",
  paragraphs: [
    "Founded in the transformative post-COVID era of 2020, Ledger Byte began as a nimble freelance practice and has since evolved into a premier accounting and financial management firm serving clients across global markets.",
    "Guided by the Japanese Kaizen philosophy of continuous improvement, we blend transparency, innovation, and meticulous attention to detail to position our clients for sustained success. Our team of more than 20 accomplished professionals delivers a comprehensive suite of services—full-cycle accounting, management and statutory reporting, VAT and corporate tax advisory, budgeting, payroll administration, systems implementation, and internal control reviews—through scalable solutions that grow seamlessly with each client's needs.",
    "This commitment to excellence reflects the vision of our founder, Haider Ali, a seasoned finance and technology expert who recognized the urgent need to modernize traditional accounting and finance operations. Determined to remove barriers to growth, he created a firm where strategic insight and advanced technology work in seamless harmony.",
    "Today, with a growing global presence, Ledger Byte integrates cutting-edge fintech with deep financial expertise to provide end-to-end financial solutions. From disciplined accounting operations to enterprise-level automation, we are the trusted partner that delivers clarity, precision, and strategic insight for sustainable growth and lasting success.",
  ],
  source: "rendered-text/ledgerbyte.io/about-us.txt",
} as const;

export const companyPrinciples = [
  {
    title: "Our Mission",
    description:
      "At Ledger Byte, our mission is to empower startups and SMEs globally with modern, tech-driven accounting solutions. We combine automation, accuracy, and expertise to simplify bookkeeping, payroll, and compliance — giving businesses the clarity and confidence to grow.",
    source: "rendered-text/ledgerbyte.io/about-us.txt",
  },
  {
    title: "Our Vision",
    description:
      "Our vision is to be the leading remote accounting partner for emerging businesses globally — transforming traditional finance through technology, transparency, and a commitment to smarter, simpler financial management.",
    source: "rendered-text/ledgerbyte.io/about-us.txt",
  },
] as const;

export const companyValues = [
  {
    title: "Accuracy First",
    description:
      "We don’t guess numbers — we get them right. Precision is the core of everything we do.",
  },
  {
    title: "Driven by Technology",
    description:
      "Modern tools. Smarter workflows. Faster results. That’s how we redefine accounting.",
  },
  {
    title: "Transparency Always",
    description:
      "Clear communication and honest reporting — no surprises, just trust.",
  },
  {
    title: "Client Success = Our Success",
    description:
      "Your growth is our goal. We treat every client’s business like our own.",
  },
  {
    title: "Always Evolving",
    description:
      "We keep learning, improving, and innovating to stay ahead of the curve.",
  },
].map((value) => ({
  ...value,
  source: "rendered-text/ledgerbyte.io/index.txt",
}));

export const team: TeamMember[] = [
  {
    name: "Haider Ali",
    role: "Managing Partner",
    credentials: "ACMA, CGMA",
    image: "/team/haider-ali.jpg",
    description:
      "The driving force behind Ledger Byte, Haider conceptualized and built the company from the ground up. With over 13 years of diversified experience in Pakistan and the GCC, he has successfully led financial management functions across multiple industries, delivering operational efficiency and strategic growth.",
    source: "rendered-text/ledgerbyte.io/about-us.txt",
  },
  {
    name: "Faisal Nawaz",
    role: "Head of Accounting",
    credentials: "FCA",
    image: "/team/faisal-nawaz.png",
    description:
      "Bringing 25 years of distinguished experience, Faisal has an extensive track record with both national and multinational organizations in Pakistan, delivering exceptional financial leadership and governance.",
    source: "rendered-text/ledgerbyte.io/about-us.txt",
  },
  {
    name: "Sayyam Nasir",
    role: "Reporting Manager",
    credentials: "ACCA",
    image: "/team/sayyam-nasir.jpeg",
    description:
      "A results-oriented finance professional with over 7 years of experience spanning leading firms such as KPMG and diverse industries across the GCC and Pakistan, Sayyam excels in accounting, financial reporting, and process optimization, consistently delivering precision and efficiency.",
    source: "rendered-text/ledgerbyte.io/about-us.txt",
  },
  {
    name: "Alina Khalid",
    role: "Communications Manager",
    credentials:
      "BS (Hons.) in Management Sciences (Marketing), MPhil in Development Studies",
    image: "/team/alina-khalid.jpeg",
    description:
      "Leveraging over 5 years of multidisciplinary experience spanning education research, university lecturing, operations, HR, and administration across diverse sectors, Alina delivers strategic communication acumen and operational excellence to drive organizational success.",
    source: "rendered-text/ledgerbyte.io/about-us.txt",
  },
  {
    name: "Amir Ilyas",
    role: "Senior Tax Consultant",
    credentials: "FCCA | 12+ years of experience in KSA Accounting & Taxation",
    image: "/team/amir-ilyas.jpg",
    description:
      "Expert in regulatory requirements with a proven record of guiding businesses through complex tax landscapes, ensuring compliance and sustainable financial growth.",
    source: "rendered-text/ledgerbyte.io/about-us.txt",
  },
];

export const financeTools = [
  "Zoho",
  "Xero",
  "Caseware",
  "Botkeeper",
  "Microsoft Office",
  "QuickBooks",
] as const;

export const technologyStats = [
  ["50+", "PROJECTS DELIVERED"],
  ["10", "TEAM MEMBERS"],
  ["3+", "YEARS EXPERIENCE"],
  ["98%", "CLIENT SATISFACTION"],
] as const;

export const technologyAdvantages = [
  {
    title: "Security-First Mindset",
    description:
      "We prioritize security at every stage of development. From secure coding practices to regular security audits, we ensure your data and applications are protected against modern threats. Our solutions comply with industry standards and best practices.",
  },
  {
    title: "Scalable Architecture",
    description:
      "Build once, scale forever. Our solutions are designed with growth in mind, using cloud-native architectures and best practices that allow your applications to handle increasing loads seamlessly. Whether you have 100 users or 1 million, we've got you covered.",
  },
  {
    title: "Business-Driven Solutions",
    description:
      "Technology should serve your business goals, not the other way around. We take time to understand your objectives, challenges, and market position to deliver solutions that drive real ROI and competitive advantage.",
  },
  {
    title: "GCC & International Experience",
    description:
      "With extensive experience across GCC markets and international projects, we understand diverse regulatory requirements, cultural nuances, and business practices. We deliver solutions that work globally while respecting local contexts.",
  },
].map((value) => ({
  ...value,
  source: "rendered-text/tech.ledgerbyte.io/why-ledgerbyte-tech.txt",
}));

export const technologyValues = [
  {
    title: "Mission-Driven",
    description:
      "We focus on delivering solutions that drive real business outcomes and long-term success.",
  },
  {
    title: "Client-Centric",
    description:
      "Your success is our priority. We build lasting partnerships based on trust and results.",
  },
  {
    title: "Quality First",
    description:
      "We maintain the highest standards in every project, from code quality to user experience.",
  },
  {
    title: "Global Reach",
    description:
      "With experience across GCC and international markets, we understand diverse business needs.",
  },
].map((value) => ({
  ...value,
  source: "rendered-text/tech.ledgerbyte.io/about.txt",
}));

export const contactDetails = {
  email: "info@ledgerbyte.io",
  phone: "+971 56 137 1569",
  phoneHref: "+971561371569",
  whatsappHref: "https://wa.me/971561371569",
  location: userProvidedCopy.companyAddress.value,
  address: {
    streetAddress: userProvidedCopy.companyAddress.streetAddress,
    addressLocality: userProvidedCopy.companyAddress.addressLocality,
    addressRegion: userProvidedCopy.companyAddress.addressRegion,
    addressCountry: userProvidedCopy.companyAddress.addressCountry,
  },
  locationSource: userProvidedCopy.companyAddress.source,
  source: "rendered-text/ledgerbyte.io/lets-connect.txt",
} as const;

export const getFinanceService = (slug: string) =>
  financeServices.find((service) => service.slug === slug);

export const getTechnologyService = (slug: string) =>
  technologyServices.find((service) => service.slug === slug);

export const getFinanceServiceByTitle = (title: string) =>
  financeServices.find((service) => service.title === title);

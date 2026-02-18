import {
  people01,
  people02,
  people03,
  facebook,
  instagram,
  linkedin,
  twitter,
  airbnb,
  binance,
  coinbase,
  dropbox,
  send,
  shield,
  star,
} from "../components/assets";

/* =========================
   Type Definitions
========================= */

export interface NavLink {
  id: string;
  title: string;
}

export interface Feature {
  id: string;
  icon: string;
  title: string;
  content: string;
}

export interface Feedback {
  id: string;
  content: string;
  name: string;
  title: string;
  img: string;
}

export interface Stat {
  id: string;
  title: string;
  value: string;
}

export interface FooterLinkItem {
  name: string;
  link: string;
}

export interface FooterLink {
  title: string;
  links: FooterLinkItem[];
}

export interface SocialMedia {
  id: string;
  icon: string;
  link: string;
}

export interface Client {
  id: string;
  logo: string;
}

/* =========================
   Data Exports
========================= */

export const navLinks: NavLink[] = [
  { id: "home", title: "Home" },
  { id: "features", title: "Features" },
  { id: "product", title: "Product" },
  { id: "clients", title: "Clients" },
];

export const features: Feature[] = [
  {
    id: "feature-1",
    icon: star,
    title: "Intelligent Verification",
    content:
      "AI-driven identity checks with real-time PAN, Aadhaar, and OTP validation to ensure accurate and secure onboarding from the first step.",
  },
  {
    id: "feature-2",
    icon: shield,
    title: "Real-Time Risk Scoring",
    content:
      "Every applicant is evaluated instantly using dynamic risk logic. Transparent scoring. Clear categorization. Zero guesswork.",
  },
  {
    id: "feature-3",
    icon: send,
    title: "Compliance & Audit Ready",
    content:
      "Complete audit trail for every action - submission, risk calculation, escalation, approval. Built for regulators and internal review teams.",
  },
];

export const feedback: Feedback[] = [
  {
    id: "feedback-1",
    content:
      "The real-time risk engine reduced manual verification time by 60% while maintaining full compliance",
    name: "Herman Jensen",
    title: "Head of Compliance",
    img: people01,
  },
  {
    id: "feedback-2",
    content:
      "Our onboarding approval cycle dropped from days to minutes using the AI conversational flow.",
    name: "Steve Mark",
    title: "Operations Director",
    img: people02,
  },
  {
    id: "feedback-3",
    content:
      "The audit log transparency makes regulatory reviews seamless and stress-free",
    name: "Kenn Gallagher",
    title: "Senior Risk Officer",
    img: people03,
  },
];

export const stats: Stat[] = [
  { id: "stats-1", title: "User Active", value: "3800+" },
  { id: "stats-2", title: "Trusted by Company", value: "230+" },
  { id: "stats-3", title: "Transaction", value: "$230M+" },
];

export const footerLinks: FooterLink[] = [
  {
    title: "Useful Links",
    links: [
      { name: "Content", link: "https://www.hoobank.com/content/" },
      { name: "How it Works", link: "https://www.hoobank.com/how-it-works/" },
      { name: "Create", link: "https://www.hoobank.com/create/" },
      { name: "Explore", link: "https://www.hoobank.com/explore/" },
      {
        name: "Terms & Services",
        link: "https://www.hoobank.com/terms-and-services/",
      },
    ],
  },
  {
    title: "Community",
    links: [
      { name: "Help Center", link: "https://www.hoobank.com/help-center/" },
      { name: "Partners", link: "https://www.hoobank.com/partners/" },
      { name: "Suggestions", link: "https://www.hoobank.com/suggestions/" },
      { name: "Blog", link: "https://www.hoobank.com/blog/" },
      { name: "Newsletters", link: "https://www.hoobank.com/newsletters/" },
    ],
  },
  {
    title: "Partner",
    links: [
      {
        name: "Our Partner",
        link: "https://www.hoobank.com/our-partner/",
      },
      {
        name: "Become a Partner",
        link: "https://www.hoobank.com/become-a-partner/",
      },
    ],
  },
];

export const socialMedia: SocialMedia[] = [
  {
    id: "social-media-1",
    icon: instagram,
    link: "https://www.instagram.com/",
  },
  {
    id: "social-media-2",
    icon: facebook,
    link: "https://www.facebook.com/",
  },
  {
    id: "social-media-3",
    icon: twitter,
    link: "https://www.x.com/_sanidhyy",
  },
  {
    id: "social-media-4",
    icon: linkedin,
    link: "https://www.linkedin.com/in/sanidhyy/",
  },
];

export const clients: Client[] = [
  { id: "client-1", logo: airbnb },
  { id: "client-2", logo: binance },
  { id: "client-3", logo: coinbase },
  { id: "client-4", logo: dropbox },
];
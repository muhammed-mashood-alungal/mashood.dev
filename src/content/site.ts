/**
 * All text, links and skills on the site live here.
 * Edit this file to change content; components only read from it.
 */

export const BRAINSYNC_REPO_URL = "https://github.com/muhammed-mashood-alungal/BrainSync";
export const READAGAIN_REPO_URL =
  "https://github.com/muhammed-mashood-alungal/Read-Again";
export const LINKEDIN_URL =
  "https://www.linkedin.com/in/muhammed-mashood-alungal-a79716303/";

export type SocialKey = "github" | "leetcode" | "linkedin" | "whatsapp";

export type SocialLink = {
  key: SocialKey;
  label: string;
  href: string;
};

export type ExperienceItem = {
  role: string;
  company: string;
  period: string;
  points: string[];
  tags: string[];
};

export type ProjectLink = {
  label: string;
  href: string;
};

export type Project = {
  name: string;
  tagline: string;
  description: string;
  highlights?: string[];
  tags: string[];
  repoUrl: string;
  /** Renders a "Live" link only when set. */
  liveUrl?: string;
  featured?: boolean;
};

export type SkillCategory = {
  id: string;
  name: string;
  skills: string[];
  /** Render the skills as a vertical stack with the first item marked as top. */
  stack?: boolean;
};

export type EducationItem = {
  title: string;
  org: string;
  period: string;
  description?: string;
};

export type NavItem = {
  id: string;
  label: string;
};

export type Site = {
  name: string;
  shortName: string;
  headline: string;
  intro: string;
  location: {
    display: string;
    locality: string;
    region: string;
    country: string;
  };
  email: string;
  phone: string;
  resumePath: string;
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
  usernames: {
    github: string;
    leetcode: string;
  };
  socials: Record<SocialKey, SocialLink>;
  nav: NavItem[];
  experience: ExperienceItem[];
  projects: Project[];
  skills: SkillCategory[];
  education: EducationItem[];
  recognition: string;
  contact: {
    heading: string;
    text: string;
  };
};

const githubUsername = "muhammed-mashood-alungal";
const leetcodeUsername = "Muhammed-Mashood-A";
const phone = "+919562703606";

export const site: Site = {
  name: "Muhammed Mashood A",
  shortName: "Mashood",
  headline: "Software Engineer",
  intro:
    "I spent the past year building backend services for a governance, risk and compliance platform, and before that I built full-stack products from scratch. I like clear APIs, boring infrastructure, and code that the next developer can read easily.",
  location: {
    display: "Malappuram, Kerala, India",
    locality: "Malappuram",
    region: "Kerala",
    country: "IN",
  },
  email: "muhdmashoodalungal@gmail.com",
  phone,
  resumePath: "/resume.pdf",
  seo: {
    title: "Muhammed Mashood A — Backend Engineer (Go, Node.js)",
    description:
      "Muhammed Mashood A is a backend engineer in Kerala, India, building reliable APIs and services with Go and Node.js. Projects, experience and contact details.",
    keywords: [
      "Muhammed Mashood A",
      "backend engineer",
      "Go developer",
      "Golang",
      "Node.js developer",
      "software engineer Kerala",
      "backend developer India",
      "REST APIs",
      "PostgreSQL",
      "TypeScript",
    ],
  },
  usernames: {
    github: githubUsername,
    leetcode: leetcodeUsername,
  },
  socials: {
    github: {
      key: "github",
      label: "GitHub",
      href: `https://github.com/${githubUsername}`,
    },
    leetcode: {
      key: "leetcode",
      label: "LeetCode",
      href: `https://leetcode.com/u/${leetcodeUsername}/`,
    },
    linkedin: { key: "linkedin", label: "LinkedIn", href: LINKEDIN_URL },
    whatsapp: {
      key: "whatsapp",
      label: "WhatsApp",
      href: `https://wa.me/${phone.replace("+", "")}`,
    },
  },
  nav: [
    { id: "work", label: "Work" },
    { id: "projects", label: "Projects" },
    { id: "skills", label: "Skills" },
    { id: "contact", label: "Contact" },
  ],
  experience: [
    {
      role: "Software Engineer (Golang)",
      company: "Jethur",
      period: "Oct 2025 – Sep 2026",
      points: [
        "Built and maintained Go (Gin, GORM) backend services and REST APIs for a GRC SaaS platform.",
        "Built 3 core modules (risk tracking, vendor risk, data privacy) with multi-step review workflows.",
        "Independently designed and built a standalone vendor portal service for third-party contractors.",
      ],
      tags: ["Go", "Gin", "GORM", "PostgreSQL", "Swagger"],
    },
  ],
  projects: [
    {
      name: "BrainSync",
      tagline: "Collaborative study platform",
      description:
        "Studying together online usually means juggling a video call, a whiteboard app, a code editor and a notes doc. BrainSync puts all four in one room. You join a session, talk, draw, code and take notes together, and your notes save automatically.",
      highlights: [
        "Node.js + TypeScript + Redis backend",
        "Real-time video with WebRTC, collaboration with Socket.IO",
        "JWT + Google OAuth authentication",
        "Tiered subscriptions",
        "Dockerized and deployed on AWS EC2",
      ],
      tags: [
        "TypeScript",
        "Node.js",
        "Next.js",
        "WebRTC",
        "Socket.IO",
        "Redis",
        "Docker",
        "AWS",
      ],
      repoUrl: BRAINSYNC_REPO_URL,
      featured: true,
    },
    {
      name: "ReadAgain",
      tagline: "Book marketplace",
      description:
        "An online marketplace for buying and selling books, with secure login, Razorpay payments and real-time order tracking. Inventory updates and email alerts run automatically.",
      tags: [
        "React",
        "Node.js",
        "Express",
        "MongoDB",
        "Razorpay",
        "Docker",
        "AWS EC2",
        "Vercel",
      ],
      repoUrl: READAGAIN_REPO_URL,
    },
  ],
  skills: [
    {
      id: "backend",
      name: "Backend",
      stack: true,
      skills: [
        "Go",
        "Gin",
        "GORM",
        "Node.js",
        "Express.js",
        "NestJS",
        "REST APIs",
        "Swagger",
        "Repository Pattern",
        "MVC",
      ],
    },
    {
      id: "frontend",
      name: "Frontend",
      skills: [
        "React",
        "Next.js",
        "TypeScript",
        "JavaScript (ES6+)",
        "Redux",
        "Tailwind CSS",
        "HTML5",
        "CSS3",
      ],
    },
    {
      id: "databases",
      name: "Databases",
      skills: ["PostgreSQL", "MSSQL", "MySQL", "MongoDB", "Redis", "Firebase"],
    },
    {
      id: "devops",
      name: "DevOps & Cloud",
      skills: ["Docker", "AWS EC2", "Nginx", "Vercel"],
    },
    {
      id: "realtime",
      name: "Realtime & Messaging",
      skills: ["WebRTC", "Socket.IO", "RabbitMQ"],
    },
    {
      id: "tools",
      name: "Tools",
      skills: ["Git", "GitHub", "Postman", "Fabric.js", "Monaco Editor", "Tiptap"],
    },
  ],
  education: [
    {
      title: "Bachelor of Computer Applications",
      org: "IGNOU",
      period: "Pursuing",
    },
    {
      title: "Full-Stack Development (Certificate)",
      org: "Brocamp, Calicut",
      period: "Aug 2024 – Aug 2025",
      description: "10+ month intensive MERN stack program with mentorship.",
    },
  ],
  recognition:
    "Performer of the Month (Jan 2025), Brototype Calicut Hub, selected among 700+ candidates.",
  contact: {
    heading: "Let's talk",
    text: "I'm open to backend and full-stack roles, freelance or full-time. The quickest way to reach me is email or WhatsApp.",
  },
};

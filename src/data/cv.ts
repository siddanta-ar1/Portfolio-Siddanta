import { Project } from "@/types/project";

/**
 * Static CV entries, sourced from ~/Documents (CV_Siddanta_Sodari_ANAIS2026.pdf,
 * the certificates folder and event photos). They are merged into the Supabase
 * list in page.tsx; an entry is skipped when any DB title contains one of its
 * `matches` (case-insensitive), so adding the same item in /admin wins.
 *
 * Images live in public/cv/. Entries without an image fall back to the
 * category placeholder via getImageUrl().
 */
export interface CvEntry extends Project {
  matches: string[];
}

const IMG = "/cv";

export const CV_ENTRIES: CvEntry[] = [
  // ── ABOUT ────────────────────────────────────────────────────────────────
  {
    id: 9001,
    title: "Siddanta Sodari — Founder & CEO, O.M.X Lab · Full-Stack & Applied AI Engineer",
    category: "ABOUT",
    year: "2026",
    description:
      "Second-year BSc CSIT student at Tribhuvan University who builds applied AI systems that run in production. Led the team that won 1st place at LumbiniX 2026 with Sākṣī, founded O.M.X Lab Pvt. Ltd., Vice President of Birendra Open Source Club and PR Lead of Code for Change Chitwan.",
    image_url: `${IMG}/about-portrait.jpg`,
    links: [
      { label: "GitHub", url: "https://github.com/siddanta-ar1" },
      { label: "Email", url: "mailto:siddanta.sodari@proton.me" },
    ],
    matches: ["siddanta sodari —"],
  },
  {
    id: 9002,
    title: "BSc CSIT — IOST, Tribhuvan University (GPA 3.54)",
    category: "ABOUT",
    year: "2024–2028",
    description:
      "Bachelor of Computer Science & Information Technology, Birendra Multiple Campus. Coursework: DSA, Discrete Structures, Calculus & Linear Algebra, Statistics I & II, Numerical Methods, OOP (C++).",
    image_url: "",
    matches: ["bsc csit", "b.sc. csit"],
  },
  {
    id: 9003,
    title: "+2 Science (NEB) — Little Flower School, Chitwan (GPA 3.75)",
    category: "ABOUT",
    year: "2022–2023",
    description: "Higher Secondary Education, Science. Class Monitor; led peer study groups.",
    image_url: "",
    matches: ["little flower"],
  },

  // ── EXPERIENCE ───────────────────────────────────────────────────────────
  {
    id: 9101,
    title: "Founder & CEO — O.M.X Lab Pvt. Ltd.",
    category: "EXPERIENCE",
    year: "2026",
    description:
      "Founded and lead an AI product and services company; set technical direction, hiring and delivery. Product architect & lead developer of KKKhane, a restaurant-operations SaaS running in live cafés (QR menus, real-time KOT, POS with thermal printing, inventory, IRD-compliant VAT billing).",
    image_url: "",
    matches: ["o.m.x lab", "omx lab"],
  },
  {
    id: 9102,
    title: "Tech Lead — Codefest 2026, Chitwan Provincial Phase",
    category: "EXPERIENCE",
    year: "2026",
    description:
      "Led technology for the Chitwan phase of Nepal's largest hackathon (14–16 Aug 2026, Forbes College; NPR 3,00,000 prize pool). Built and ran chitwan.codefestnepal.com: invite-only PWA on Next.js 16 + Supabase RLS with QR identity cards, check-in scanner, live quizzes and team/room allocation.",
    image_url: "",
    links: [{ label: "Site", url: "https://chitwan.codefestnepal.com" }],
    matches: ["codefest 2026"],
  },
  {
    id: 9103,
    title: "Founding Member & Chief Innovation Lead — Inovex",
    category: "EXPERIENCE",
    year: "2026",
    description:
      "Founding member of a youth-focused technology organisation. Own the innovation agenda and built the official Inovex platform (Next.js, React, Framer Motion) with an internal admin console.",
    image_url: "",
    matches: ["inovex"],
  },
  {
    id: 9104,
    title: "Software Developer Intern — Great Bear Technologies",
    category: "EXPERIENCE",
    year: "2025–2026",
    description:
      "Built web applications across the full lifecycle with Next.js and PostgreSQL — frontend components, responsive UI, testing and QA — with cross-functional teams. Kathmandu (remote), May 2025 – Jul 2026.",
    image_url: "",
    matches: ["great bear"],
  },
  {
    id: 9105,
    title: "Full-Stack Developer (Freelance) — Tech Raj Shop",
    category: "EXPERIENCE",
    year: "2025–2026",
    description:
      "Built and maintained techrajshop.com, a marketplace for instant game top-ups, gift cards and virtual payments in Nepal. Nov 2025 – Jul 2026.",
    image_url: "",
    matches: ["tech raj shop"],
  },
  {
    id: 9106,
    title: "Web Developer (Part-time) — Remote Sensing & Georesearch Institute",
    category: "EXPERIENCE",
    year: "2024–Present",
    description:
      "Maintain and optimise rsgrt.com.np on Next.js and PostgreSQL at 99.9% uptime, including database operations and backend tuning.",
    image_url: "",
    matches: ["georesearch institute"],
  },
  {
    id: 9107,
    title: "Full-Stack Developer (Freelance) — Naari Sringaar",
    category: "EXPERIENCE",
    year: "2025–Present",
    description:
      "Built a Next.js e-commerce platform (naarisringaar.com.np) for ethnic fashion and saree retail serving customers internationally.",
    image_url: "",
    matches: ["developer (freelance) — naari"],
  },

  // ── STARTUPS / FULL-STACK ────────────────────────────────────────────────
  {
    id: 9201,
    title: "Sākṣī — AI Heritage Conservation Platform",
    category: "FULL-STACK",
    year: "2026",
    description:
      "Offline-first Expo/React Native app where visitors re-photograph fixed survey viewpoints at Lumbini and Kathmandu Valley UNESCO sites. On-device YOLOv8n crack detector (mAP50 0.82) via ONNX Runtime, and Dhamma — a hybrid BM25 + vector RAG assistant that refuses without citations (74/74 adversarial benchmark). 148 automated tests, 24 pgTAP assertions. LumbiniX 2026 winner; Digital Nepal Conclave 2026 showcase.",
    image_url: `${IMG}/digital-nepal-conclave-2026.jpg`,
    matches: ["sakshi", "sākṣī", "saksi"],
  },
  {
    id: 9202,
    title: "UNSAID — Privacy-Preserving AI Reflection Vault",
    category: "FULL-STACK",
    year: "2026",
    description:
      "Client-side-encrypted journaling vault where plaintext never reaches the backend. The AI reflection feature (Echo) runs only with per-memory, per-version consent, enforced in CI with schema gates, log scrubbing and canary searches. TypeScript, Fastify, PostgreSQL, Web Crypto, Solana (Anchor).",
    image_url: "",
    matches: ["unsaid"],
  },
  {
    id: 9203,
    title: "Other Ventures — Krixnova, Wristify, TrXWeb, Made In Nepal Stores",
    category: "STARTUPS",
    year: "2025–2026",
    description:
      "Founder of Krixnova (digital marketing, 7+ member founding team), Wristify and TrXWeb; Partner at Made In Nepal Stores (FastAPI backend with zero-touch courier fulfilment via the Nepal Can Move API); Co-Founder of EcoVera Artemisia™ BioSolution (Hult Prize Nepal Nationals 2026).",
    image_url: "",
    matches: ["other ventures"],
  },

  // ── AWARDS ───────────────────────────────────────────────────────────────
  {
    id: 9301,
    title: "Winner (1st Place) — LumbiniX 2026 National Hackathon · Sākṣī",
    category: "AWARDS",
    year: "2026",
    description:
      "Led a four-member team to 1st place at the national-level LumbiniX 2026 hackathon (Lumbini City College) on the theme “What if Buddha were born in 2026?”.",
    image_url: "",
    matches: ["lumbinix"],
  },
  {
    id: 9302,
    title: "Digital Innovation Showcase — 5th Digital Nepal Conclave 2026 · Sākṣī",
    category: "AWARDS",
    year: "2026",
    description:
      "Certificate of Appreciation from ICT Foundation Nepal for showcasing Sākṣī at the Digital Innovation Showcase, The Plaza, Pulchowk, Lalitpur — 20 Sep 2026.",
    image_url: `${IMG}/digital-nepal-conclave-2026.jpg`,
    matches: ["digital nepal conclave"],
  },
  {
    id: 9303,
    title: "3rd Position — CODEFEST Chitwan 2025 · HumanSign",
    category: "AWARDS",
    year: "2025",
    description:
      "Third position at CODEFEST 2025, Bagmati Province (Chitwan), organised by Code for Change Chitwan with Sungava College.",
    image_url: `${IMG}/award-codefest-2025-humansign.jpg`,
    matches: ["codefest chitwan 2025", "codefest 2025"],
  },
  {
    id: 9304,
    title: "Best Functional Prototype — Ideathon 2025 · Raksha-Net",
    category: "AWARDS",
    year: "2025",
    description:
      "The New Horizon Club, Ideathon 2025 — offline disaster mesh network (BLE discovery + Wi-Fi Direct transport, store-and-forward data muling).",
    image_url: `${IMG}/ideathon-2025-medals.jpg`,
    matches: ["ideathon", "raksha"],
  },
  {
    id: 9305,
    title: "Top 5 Team (Bagmati) — Code for Impact, U.S. Embassy Nepal · NOTEacher",
    category: "AWARDS",
    year: "2026",
    description: "Selected as a Top 5 Team from Bagmati Province at the U.S.–Nepal Code for Impact Tech Innovation Hackathon.",
    image_url: "",
    matches: ["top 5", "code for impact"],
  },
  {
    id: 9306,
    title: "Competitor — Hult Prize Nepal Nationals 2026 · EcoVera Artemisia™",
    category: "AWARDS",
    year: "2026",
    description:
      "Hult Prize Foundation, May 2026 — bio-solution social enterprise built on Artemisia (Titepati). Also a Hult Prize 2026 contender at Oxford College of Engineering & Management with HumanSign.",
    image_url: "",
    matches: ["hult prize nepal nationals", "ecovera"],
  },
  {
    id: 9307,
    title: "IT Scholarship (NPR 50,000) — Department of IT, Government of Nepal",
    category: "AWARDS",
    year: "2025",
    description: "Awarded by the Department of Information Technology, Ministry of Communication & IT, July 2025.",
    image_url: "",
    matches: ["it scholarship"],
  },

  // ── CERTIFICATIONS ───────────────────────────────────────────────────────
  {
    id: 9401,
    title: "Quantum Computing Diploma (QBronze169-473) — QWorld · Womanium & WISER",
    category: "CERTIFICATIONS",
    year: "2025",
    description: "QWorld's Bronze-Qiskit tutorial, Womanium & WISER 2025 Quantum Program.",
    image_url: `${IMG}/cert-qbronze.jpg`,
    matches: ["qbronze"],
  },
  {
    id: 9402,
    title: "Quantum Computing (Score 66.27%) — C-DAC Hyderabad & IIT Roorkee",
    category: "CERTIFICATIONS",
    year: "2025",
    description: "One-month course, 3–25 May 2025, MeitY, Government of India. Certificate CDACH/QML/1912.",
    image_url: `${IMG}/cert-cdac-quantum.jpg`,
    matches: ["c-dac", "cdac"],
  },
  {
    id: 9403,
    title: "Machine Learning Training — Pi Innovations",
    category: "CERTIFICATIONS",
    year: "2024",
    description: "7-day intensive: data preprocessing, supervised/unsupervised learning, model evaluation in Python.",
    image_url: `${IMG}/cert-machine-learning.jpg`,
    matches: ["pi innovations"],
  },
  {
    id: 9404,
    title: "Uncertainty Quantification in Deep Learning — Brainycube Research",
    category: "CERTIFICATIONS",
    year: "2025",
    description: "Organised by Brainycube Research Organization with DeepLearning.AI Pie & AI, 7 March 2025.",
    image_url: `${IMG}/cert-uncertainty-dl.jpg`,
    matches: ["uncertainty quantification"],
  },
  {
    id: 9405,
    title: "Introduction to Python — DataCamp",
    category: "CERTIFICATIONS",
    year: "2025",
    description: "Statement of Accomplishment #39,229,745 — 4 hours, completed 4 May 2025.",
    image_url: `${IMG}/cert-datacamp-python.jpg`,
    matches: ["introduction to python"],
  },
  {
    id: 9406,
    title: "Understanding ChatGPT — DataCamp",
    category: "CERTIFICATIONS",
    year: "2025",
    description: "Statement of Accomplishment #39,238,782 — completed 4 May 2025.",
    image_url: `${IMG}/cert-datacamp-chatgpt.jpg`,
    matches: ["understanding chatgpt"],
  },
  {
    id: 9407,
    title: "Python on Autopilot — CSIT Association of Nepal, Chitwan",
    category: "CERTIFICATIONS",
    year: "2025",
    description: "Hands-on Python automation event with Chitwan College of Technology.",
    image_url: `${IMG}/cert-python-autopilot.jpg`,
    matches: ["python on autopilot"],
  },
  {
    id: 9408,
    title: "Cybersecurity for Beginners — CSIT Association of Nepal, Chitwan",
    category: "CERTIFICATIONS",
    year: "2025",
    description: "One-day workshop, 26 December 2025.",
    image_url: `${IMG}/cert-cybersecurity-csitan.jpg`,
    matches: ["cybersecurity for beginners"],
  },
  {
    id: 9409,
    title: "111 Days of Learning Challenge — Code for Change Kathmandu",
    category: "CERTIFICATIONS",
    year: "2025",
    description: "Completed the 111-day learning challenge, recognised at Tech Carnival 2025.",
    image_url: `${IMG}/cert-111-days.jpg`,
    matches: ["111 days"],
  },

  // ── COMMUNITY ────────────────────────────────────────────────────────────
  {
    id: 9501,
    title: "Vice President — Birendra Open Source Club (BOSC)",
    category: "COMMUNITY",
    year: "2025–Present",
    description:
      "Set direction for one of Chitwan's most active open-source communities; run Software Freedom Day and Hacktoberfest, oversee the BOSC Mentorship Program, and partner with CSITAN and CFC-Chitwan on OpenStreetMap, Linux and Git workshops.",
    image_url: `${IMG}/codefest-2025-team.jpg`,
    matches: ["vice president — birendra", "bosc vice president"],
  },
  {
    id: 9502,
    title: "PR Lead — Code for Change, Chitwan Chapter",
    category: "COMMUNITY",
    year: "2026–Present",
    description:
      "Manage external communications and partnerships with colleges, tech companies and student clubs; member through the 2024/25 tenure.",
    image_url: `${IMG}/cert-cfc-member.jpg`,
    matches: ["code for change, chitwan", "pr lead"],
  },
  {
    id: 9503,
    title: "Executive — QNepal",
    category: "COMMUNITY",
    year: "2025–Present",
    description: "Host online quantum-computing events and contribute to planning and decision-making.",
    image_url: "",
    matches: ["qnepal"],
  },
  {
    id: 9504,
    title: "Active Member — Rotaract Club of Narayangarh",
    category: "COMMUNITY",
    year: "2026–Present",
    description: "Blood-donation drives, awareness campaigns and resource-distribution initiatives.",
    image_url: "",
    matches: ["rotaract"],
  },

  // ── RESEARCH ─────────────────────────────────────────────────────────────
  {
    id: 9601,
    title: "Understanding Quantum Computation: A Beginner's Guide — ResearchGate / SSRN",
    category: "RESEARCH",
    year: "2026",
    description: "Introductory paper on quantum gates, circuits and the idea and implications of quantum advantage.",
    image_url: "",
    matches: ["understanding quantum computation"],
  },
  {
    id: 9602,
    title: "Verifiable Privacy for AI-Assisted Journaling — 2nd BIC International Conference 2026",
    category: "RESEARCH",
    year: "2026",
    description:
      "Abstract on attested inference and blockchain receipts for UNSAID, for the AI & Digital Transformation track at Boston International College, Chitwan (27–28 Nov 2026).",
    image_url: "",
    matches: ["verifiable privacy"],
  },
  {
    id: 9603,
    title: "360 Days of NON-VIBE-CODE Challenge — Public GitHub Log",
    category: "RESEARCH",
    year: "2025–2026",
    description:
      "Year-long daily deep-work programme writing core logic from scratch: React/V8 internals, ML from first principles (perceptrons to Transformers, RAG) and quantum algorithms in Qiskit.",
    image_url: "",
    links: [{ label: "GitHub", url: "https://github.com/siddanta-ar1" }],
    matches: ["non-vibe-code", "360 days"],
  },
];

/** Append CV entries that aren't already represented by a DB row. */
export function mergeCvEntries(projects: Project[]): Project[] {
  const titles = projects.map((p) => p.title.toLowerCase());
  const extra = CV_ENTRIES.filter(
    (e) => !e.matches.some((m) => titles.some((t) => t.includes(m.toLowerCase()))),
  ).map((entry) => {
    const project: Project & { matches?: string[] } = { ...entry };
    delete project.matches;
    return project;
  });
  return [...projects, ...extra];
}

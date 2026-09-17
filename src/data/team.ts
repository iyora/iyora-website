export interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: string;
  level: "founder" | "management" | "team";
  image: string;
  linkedin?: string;
  instagram?: string;
  email?: string;
}

export const OUR_TEAM: TeamMember[] = [
  {
    id: "deni-irawan",
    name: "Deni Irawan, M. Pd",
    role: "Founder",
    department: "Executive",
    level: "founder",
    image: "/images/tim/padeni.png",
    email: "deni@iyora.or.id",
  },
  {
    id: "anggraini",
    name: "Anggraini, A. Md",
    role: "General Manager",
    department: "Management",
    level: "management",
    image: "/images/tim/bueniii.png",
    email: "anggraini@iyora.or.id",
  },
  {
    id: "eki-iman",
    name: "Eki Iman Jordiansyah",
    role: "Project Manager",
    department: "Management",
    level: "management",
    image: "/images/tim/maseki.png",
    email: "eki@iyora.or.id",
  },
  {
    id: "pazri",
    name: "Pazri",
    role: "IT Tim",
    department: "IT & Systems",
    level: "team",
    image: "/images/tim/pazri.png",
    email: "it@iyora.or.id",
  },
  {
    id: "shofwah-naziroh",
    name: "Shofwah Naziroh",
    role: "Administration Tim",
    department: "Administration",
    level: "team",
    image: "/images/tim/sowah.png",
    email: "admin@iyora.or.id",
  },
  {
    id: "nurleni",
    name: "Nurleni",
    role: "Promotion and Publication Team",
    department: "Promotion & Publication",
    level: "team",
    image: "/images/tim/leni.png",
    email: "media@iyora.or.id",
  },
  {
    id: "mochamad-khalil-gibran",
    name: "Mochamad khalil gibran",
    role: "Promotion and Publication Team",
    department: "Promotion & Publication",
    level: "team",
    image: "/images/tim/alil.png",
    email: "publication@iyora.or.id",
  },
];

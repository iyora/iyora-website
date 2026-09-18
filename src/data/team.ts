export interface TeamMember {
  id: string;
  name: string;
  role: string;
  role_en?: string;
  department: string;
  department_en?: string;
  level: "founder" | "GM" | "PM" | "operational" | "publication" | "CEO" | "management" | "team";
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
    role_en: "Founder",
    department: "Eksekutif",
    department_en: "Executive",
    level: "founder",
    image: "/images/tim/padeni.png",
    email: "deni@iyora.or.id",
  },
  {
    id: "anggraini",
    name: "Anggraini, A. Md",
    role: "General Manager",
    role_en: "General Manager",
    department: "Manajemen",
    department_en: "Management",
    level: "GM",
    image: "/images/tim/bueniii.png",
    email: "anggraini@iyora.or.id",
  },
  {
    id: "kamal",
    name: "Kamal Putra",
    role: "Ketua Dewan Pengawas",
    role_en: "Chief Executive Officer",
    department: "Dewan Pengawas",
    department_en: "Supervisor",
    level: "CEO",
    image: "/images/tim/kamal.png",
    email: "kamal@iyora.or.id",
  },
  {
    id: "eki-iman",
    name: "Eki Iman Jordiansyah",
    role: "Project Manager",
    role_en: "Project Manager",
    department: "Manajemen",
    department_en: "Management",
    level: "PM",
    image: "/images/tim/maseki.png",
    email: "eki@iyora.or.id",
  },
  {
    id: "pazri",
    name: "Pazri",
    role: "Tim IT",
    role_en: "IT Team",
    department: "IT & Sistem",
    department_en: "IT & Systems",
    level: "operational",
    image: "/images/tim/pazri.png",
    email: "it@iyora.or.id",
  },
  {
    id: "shofwah-naziroh",
    name: "Shofwah Naziroh",
    role: "Tim Administrasi",
    role_en: "Administration Team",
    department: "Administrasi",
    department_en: "Administration",
    level: "operational",
    image: "/images/tim/sowah.png",
    email: "admin@iyora.or.id",
  },
  {
    id: "nurleni",
    name: "Nurleni",
    role: "Tim Promosi & Publikasi",
    role_en: "Promotion & Publication Team",
    department: "Promosi & Publikasi",
    department_en: "Promotion & Publication",
    level: "publication",
    image: "/images/tim/leni.png",
    email: "media@iyora.or.id",
  },
  {
    id: "mochamad-khalil-gibran",
    name: "Mochamad Khalil Gibran",
    role: "Tim Promosi & Publikasi",
    role_en: "Promotion & Publication Team",
    department: "Promosi & Publikasi",
    department_en: "Promotion & Publication",
    level: "publication",
    image: "/images/tim/alil.png",
    email: "publication@iyora.or.id",
  },
];

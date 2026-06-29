export interface DoctorInfo {
  name: string;
  specialty: string;
  clinicName: string;
  tagline: string;
  qualifications: string[];
  experience: number;
  achievements: string[];
  bio: string;
  approach: string;
  address: string;
  phone: string;
  email: string;
  workingHours: string[];
  themeColor: "emerald" | "blue" | "teal" | "indigo" | "sky";
  emergencyPhone: string;
  onlineConsultation: boolean;
  avatarUrl?: string;
}

export interface MedicalService {
  id: string;
  title: string;
  description: string;
  iconName: string;
  details: string[];
  price?: string;
}

export interface Appointment {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  reason: string;
  status: "Pending" | "Confirmed" | "Cancelled";
  createdAt: string;
}

export interface Testimonial {
  id: string;
  author: string;
  relationship: string;
  rating: number;
  comment: string;
  date: string;
  avatarUrl?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: "Heart Health" | "Lifestyle" | "Pediatrics" | "Nutrition" | "Preventative" | "Dental Care";
  readTime: string;
  date: string;
  imageUrl?: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: "General" | "Appointments" | "Services" | "Insurance" | "AI Assistant";
}

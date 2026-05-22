export interface Experience {
  role: string;
  company: string;
  period: string;
  description: string;
}

export interface Education {
  degree: string;
  institution: string;
  year: string;
}

export type CVTheme = "tron" | "solarized" | "monochrome" | "nordic";
export type CVTemplate = 
  | "apero" 
  | "executive" 
  | "tech" 
  | "creative" 
  | "minimal" 
  | "compact" 
  | "elegant" 
  | "brutalist" 
  | "modern" 
  | "futuristic";

export interface CVData {
  initials: string;
  summary: string;
  experience: Experience[];
  skills: string[];
  education: Education[];
  theme?: CVTheme;
  template?: CVTemplate;
}

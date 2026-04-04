export interface Skill {
  name: string;
  level?: "Beginner" | "Intermediate" | "Advanced";
}

export interface Resource {
  title: string;
  url: string;
  type: "Video" | "Article" | "Course";
  duration?: string;
  tags?: string[];
  id?: string;
  views?: number;
  savedAt?: string;
}

export interface CareerPath {
  id: string;
  title: string;
  matchPercentage?: number;
  description: string;
  roleOverview?: string[];
  salaryRange?: string;
  requiredSkills: string[];
  missingSkills?: string[];
  roadmap: RoadmapStep[];
  resources: Resource[];
}

export interface RoadmapStep {
  title: string;
  description: string;
  duration: string;
}

export interface UserProfile {
  _id?: string;
  name: string;
  email?: string;
  role?: "admin" | "user";
  isApproved?: boolean;
  designation?: string;
  location?: string;
  avatar_no?: string;
  lastActive?: string;
  skills: string[]; // Matches backend "skills"
  mySkills?: string[]; // Legacy compatibility if needed
  savedCareers: CareerPath[];
  savedResources: Resource[];
  completedResources: string[];
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  joinDate: string;
  skills?: string[];
  skillsCount: number;
  savedPathsCount: number;
  isApproved: boolean;
  lastActive?: string;
  avatar_no?: string;
  designation?: string;
}

export enum AppStatus {
  IDLE = "IDLE",
  LOADING = "LOADING",
  SUCCESS = "SUCCESS",
  ERROR = "ERROR",
}

export interface ChatMessage {
  role: "user" | "model";
  text: string;
  timestamp: number;
}

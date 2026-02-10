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
  name: string;
  email?: string;
  savedCareers: CareerPath[];
  mySkills: string[];
  completedResources: string[];
  savedResources?: Resource[];
  isApproved?: boolean;
  role?: "admin" | "user";
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "User";
  joinDate: string;
  skillsCount: number;
  savedPathsCount: number;
  isApproved: boolean;
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

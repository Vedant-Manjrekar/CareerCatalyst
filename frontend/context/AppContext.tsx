import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { UserProfile, CareerPath, AdminUser, Resource } from "../types";

interface AppContextType {
  userProfile: UserProfile;
  updateSkills: (skills: string[]) => void;
  saveCareer: (career: CareerPath) => void;
  removeCareer: (careerId: string) => void;
  toggleResourceCompletion: (url: string) => void;
  searchResults: CareerPath[];
  setSearchResults: (results: CareerPath[]) => void;
  clearSearchResults: () => void;
  theme: "light" | "dark";
  toggleTheme: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string) => void;
  signup: (name: string, email: string) => void;
  logout: () => void;
  // Admin methods
  allUsers: AdminUser[];
  deleteUser: (id: string) => void;
  toggleAdminRole: (id: string) => void;
  globalResources: Resource[];
  deleteGlobalResource: (id: string) => void;
}

const defaultProfile: UserProfile = {
  name: "Guest User",
  email: "guest@example.com",
  savedCareers: [],
  mySkills: [],
  completedResources: [],
};

const mockUsers: AdminUser[] = [
  {
    id: "1",
    name: "Sarah Chen",
    email: "sarah@example.com",
    role: "Admin",
    joinDate: "2024-01-15",
    skillsCount: 12,
    savedPathsCount: 3,
  },
  {
    id: "2",
    name: "James Wilson",
    email: "james@example.com",
    role: "User",
    joinDate: "2024-02-20",
    skillsCount: 5,
    savedPathsCount: 1,
  },
  {
    id: "3",
    name: "Elena Rodriguez",
    email: "elena@example.com",
    role: "User",
    joinDate: "2024-03-05",
    skillsCount: 8,
    savedPathsCount: 2,
  },
  {
    id: "4",
    name: "Alex Thompson",
    email: "alex@example.com",
    role: "User",
    joinDate: "2024-03-12",
    skillsCount: 15,
    savedPathsCount: 5,
  },
];

const mockResources: Resource[] = [
  {
    id: "r1",
    title: "Mastering React Server Components",
    url: "https://react.dev",
    type: "Article",
    duration: "15 min",
  },
  {
    id: "r2",
    title: "Advanced Python for Data Science",
    url: "https://python.org",
    type: "Course",
    duration: "12 hours",
  },
  {
    id: "r3",
    title: "UX Design Fundamentals",
    url: "https://figma.com",
    type: "Video",
    duration: "45 min",
  },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children?: ReactNode }) => {
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem("career_catalyst_profile");
    return saved ? JSON.parse(saved) : defaultProfile;
  });

  const [searchResults, setSearchResultsState] = useState<CareerPath[]>(() => {
    const saved = sessionStorage.getItem("career_catalyst_search_results");
    return saved ? JSON.parse(saved) : [];
  });

  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const saved = localStorage.getItem("career_catalyst_theme");
    if (saved) return saved as "light" | "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem("career_catalyst_auth") === "true";
  });

  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return localStorage.getItem("career_catalyst_is_admin") === "true";
  });

  const [allUsers, setAllUsers] = useState<AdminUser[]>(() => {
    const saved = localStorage.getItem("career_catalyst_admin_users");
    return saved ? JSON.parse(saved) : mockUsers;
  });

  const [globalResources, setGlobalResources] = useState<Resource[]>(() => {
    const saved = localStorage.getItem("career_catalyst_global_resources");
    return saved ? JSON.parse(saved) : mockResources;
  });

  useEffect(() => {
    localStorage.setItem("career_catalyst_theme", theme);
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(
      "career_catalyst_admin_users",
      JSON.stringify(allUsers)
    );
  }, [allUsers]);

  useEffect(() => {
    localStorage.setItem(
      "career_catalyst_global_resources",
      JSON.stringify(globalResources)
    );
  }, [globalResources]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const saveToLocal = (profile: UserProfile) => {
    localStorage.setItem("career_catalyst_profile", JSON.stringify(profile));
    setUserProfile(profile);
  };

  const setSearchResults = (results: CareerPath[]) => {
    sessionStorage.setItem(
      "career_catalyst_search_results",
      JSON.stringify(results)
    );
    setSearchResultsState(results);
  };

  const clearSearchResults = () => {
    sessionStorage.removeItem("career_catalyst_search_results");
    setSearchResultsState([]);
  };

  const updateSkills = (skills: string[]) => {
    saveToLocal({ ...userProfile, mySkills: skills });
  };

  const saveCareer = (career: CareerPath) => {
    if (userProfile.savedCareers.some((c) => c.id === career.id)) return;
    saveToLocal({
      ...userProfile,
      savedCareers: [...userProfile.savedCareers, career],
    });
  };

  const removeCareer = (careerId: string) => {
    saveToLocal({
      ...userProfile,
      savedCareers: userProfile.savedCareers.filter((c) => c.id !== careerId),
    });
  };

  const toggleResourceCompletion = (url: string) => {
    const isCompleted = userProfile.completedResources.includes(url);
    const newCompleted = isCompleted
      ? userProfile.completedResources.filter((u) => u !== url)
      : [...userProfile.completedResources, url];

    saveToLocal({ ...userProfile, completedResources: newCompleted });
  };

  const login = (email: string) => {
    setIsAuthenticated(true);
    localStorage.setItem("career_catalyst_auth", "true");
    // Simple mock: any email with 'admin' is an admin
    const adminMode = email.toLowerCase().includes("admin");
    setIsAdmin(adminMode);
    localStorage.setItem(
      "career_catalyst_is_admin",
      adminMode ? "true" : "false"
    );
    saveToLocal({ ...userProfile, email });
  };

  const signup = (name: string, email: string) => {
    const newProfile = { ...userProfile, name: name, email: email };
    saveToLocal(newProfile);
    setIsAuthenticated(true);
    localStorage.setItem("career_catalyst_auth", "true");
    const adminMode = email.toLowerCase().includes("admin");
    setIsAdmin(adminMode);
    localStorage.setItem(
      "career_catalyst_is_admin",
      adminMode ? "true" : "false"
    );
  };

  const logout = () => {
    setIsAuthenticated(false);
    setIsAdmin(false);
    localStorage.removeItem("career_catalyst_auth");
    localStorage.removeItem("career_catalyst_is_admin");
    clearSearchResults();
  };

  // Admin Actions
  const deleteUser = (id: string) => {
    setAllUsers((prev) => prev.filter((u) => u.id !== id));
  };

  const toggleAdminRole = (id: string) => {
    setAllUsers((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, role: u.role === "Admin" ? "User" : "Admin" } : u
      )
    );
  };

  const deleteGlobalResource = (id: string) => {
    setGlobalResources((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <AppContext.Provider
      value={{
        userProfile,
        updateSkills,
        saveCareer,
        removeCareer,
        toggleResourceCompletion,
        searchResults,
        setSearchResults,
        clearSearchResults,
        theme,
        toggleTheme,
        isAuthenticated,
        isAdmin,
        login,
        signup,
        logout,
        allUsers,
        deleteUser,
        toggleAdminRole,
        globalResources,
        deleteGlobalResource,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};

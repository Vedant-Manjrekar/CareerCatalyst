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
  saveResource: (resource: Resource) => Promise<void>;
  removeResource: (url: string) => Promise<void>;
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
  approveUser: (id: string) => Promise<void>;
  // Admin methods
  allUsers: AdminUser[];
  deleteUser: (id: string) => void;
  toggleAdminRole: (id: string) => void;
  globalResources: Resource[];
  addGlobalResource: (resource: Omit<Resource, "id">) => void;
  deleteGlobalResource: (id: string) => void;
}

const defaultProfile: UserProfile = {
  name: "Guest User",
  email: "guest@example.com",
  savedCareers: [],
  mySkills: [],
  completedResources: [],
  savedResources: [],
};

const mockUsers: AdminUser[] = [];

const mockResources: Resource[] = [];

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
    const profile = localStorage.getItem("career_catalyst_profile");
    if (profile) {
      const parsed = JSON.parse(profile);
      return parsed.role === "admin" && parsed.isApproved;
    }
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

  // Initial Data Fetch
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        // Fetch User Profile
        const userRes = await fetch("http://localhost:8000/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userData = await userRes.json();
        if (userData.success) {
          const profile: UserProfile = {
            name: userData.data.name,
            email: userData.data.email,
            mySkills: userData.data.skills || [],
            savedCareers: [],
            completedResources: userProfile.completedResources,
            savedResources: userData.data.savedResources || [],
            isApproved: userData.data.isApproved,
            role: userData.data.role,
          };

          const isReallyAdmin = profile.role === "admin" && profile.isApproved;
          setIsAdmin(isReallyAdmin);
          localStorage.setItem("career_catalyst_is_admin", isReallyAdmin ? "true" : "false");
          const careerRes = await fetch("http://localhost:8000/api/career/my-saved", {
            headers: { Authorization: `Bearer ${token}` },
          });
          const careerData = await careerRes.json();
          if (careerData.success) {
            profile.savedCareers = careerData.data.map((c: any) => ({
              ...c,
              id: c.id || c._id // Ensure we have the frontend 'id'
            }));
          }
          
          setUserProfile(profile);
          localStorage.setItem("career_catalyst_profile", JSON.stringify(profile));

          // Fetch All Users if Admin
          if (isAdmin || userData.data.role === "admin") {
            const allUsersRes = await fetch("http://localhost:8000/users");
            const allUsersData = await allUsersRes.json();
            if (Array.isArray(allUsersData.data)) {
               setAllUsers(allUsersData.data.map((u: any) => ({
                 id: u._id,
                 name: u.name,
                 email: u.email,
                 role: u.role || "user",
                 joinDate: u.joining_date,
                 skillsCount: u.skills?.length || 0,
                 savedPathsCount: u.savedPathCount || 0,
                 isApproved: u.isApproved,
               })));
            }
          }
        }

        // Fetch Global Resources
        const resourceRes = await fetch("http://localhost:8000/api/resources");
        const resourceData = await resourceRes.json();
        if (resourceData.success) {
          setGlobalResources(resourceData.data);
        }
      } catch (err) {
        console.error("Initial fetch failed:", err);
      }
    };

    if (isAuthenticated) {
      fetchData();
    } else {
       // Fetch Resources even if not logged in
       fetch("http://localhost:8000/api/resources")
         .then(res => res.json())
         .then(data => {
           if (data.success) setGlobalResources(data.data);
         }).catch(console.error);
    }
  }, [isAuthenticated, isAdmin]);

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

  const updateSkills = async (skills: string[]) => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        await fetch("http://localhost:8000/api/user/skills", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ skills }),
        });
      } catch (err) {
        console.error("Failed to sync skills to DB:", err);
      }
    }
    saveToLocal({ ...userProfile, mySkills: skills });
  };

  const saveCareer = async (career: CareerPath) => {
    if (userProfile.savedCareers.some((c) => c.id === career.id)) return;
    
    const token = localStorage.getItem("token");
    if (token) {
      try {
        await fetch("http://localhost:8000/api/career/save", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(career),
        });
      } catch (err) {
        console.error("Failed to save career to DB:", err);
      }
    }
    
    saveToLocal({
      ...userProfile,
      savedCareers: [...userProfile.savedCareers, career],
    });
  };

  const removeCareer = async (careerId: string) => {
    const token = localStorage.getItem("token");
    const careerToRemove = userProfile.savedCareers.find(c => c.id === careerId);
    
    if (token && careerToRemove) {
      try {
        // Note: backend uses _id for deletion in some routes, 
        // but careerRoutes uses findOneAndDelete with { _id: id, userId: req.user }
        // We need to ensure we have the MongoDB _id.
        const dbId = (careerToRemove as any)._id || careerToRemove.id;
        await fetch(`http://localhost:8000/api/career/remove/${dbId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (err) {
        console.error("Failed to remove career from DB:", err);
      }
    }

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

  const saveResource = async (resource: Resource) => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const res = await fetch("http://localhost:8000/api/user/resources/save", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(resource),
        });
        const data = await res.json();
        if (data.success) {
          saveToLocal({ ...userProfile, savedResources: data.data });
        }
      } catch (err) {
        console.error("Failed to save resource:", err);
      }
    }
  };

  const removeResource = async (url: string) => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const res = await fetch("http://localhost:8000/api/user/resources/remove", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ url }),
        });
        const data = await res.json();
        if (data.success) {
          saveToLocal({ ...userProfile, savedResources: data.data });
        }
      } catch (err) {
        console.error("Failed to remove resource:", err);
      }
    }
  };

  const login = (email: string) => {
    // Note: Actual login logic is in Login.tsx, this is a mock sync
    setIsAuthenticated(true);
    localStorage.setItem("career_catalyst_auth", "true");
    const adminMode = email.toLowerCase().includes("admin");
    setIsAdmin(adminMode);
    localStorage.setItem(
      "career_catalyst_is_admin",
      adminMode ? "true" : "false"
    );
  };

  const signup = (name: string, email: string) => {
    // Actual signup is in Signup.tsx
    setIsAuthenticated(true);
    localStorage.setItem("career_catalyst_auth", "true");
  };

  const approveUser = async (id: string) => {
    const token = localStorage.getItem("token");
    console.log("Attempting to approve user with ID:", id);
    try {
      const res = await fetch(`http://localhost:8000/api/user/approve/${id}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      console.log("Approve response:", data);
      
      if (data.success) {
        setAllUsers((prev) =>
          prev.map((u) => (u.id === id ? { ...u, isApproved: true } : u))
        );
      } else {
        alert("Failed to approve user: " + (data.message || "Unknown error"));
      }
    } catch (err) {
      console.error("Failed to approve user:", err);
      alert("Error approving user. Check console for details.");
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setIsAdmin(false);
    localStorage.removeItem("career_catalyst_auth");
    localStorage.removeItem("career_catalyst_is_admin");
    localStorage.removeItem("token");
    localStorage.removeItem("career_catalyst_profile");
    clearSearchResults();
    setUserProfile(defaultProfile);
  };

  // Admin Actions
  const deleteUser = async (id: string) => {
    try {
      await fetch(`http://localhost:8000/user/${id}`, {
        method: "DELETE",
      });
      setAllUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      console.error("Failed to delete user:", err);
    }
  };

  const toggleAdminRole = (id: string) => {
    setAllUsers((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, role: u.role === "Admin" ? "User" : "Admin" } : u
      )
    );
  };

  const addGlobalResource = async (resource: Omit<Resource, "id">) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:8000/api/resources", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(resource),
      });
      const data = await res.json();
      if (data.success) {
        setGlobalResources((prev) => [...prev, data.data]);
      }
    } catch (err) {
      console.error("Failed to add resource to DB:", err);
      // Fallback to local if needed, but DB is preferred
    }
  };

  const deleteGlobalResource = async (id: string) => {
    const token = localStorage.getItem("token");
    try {
      await fetch(`http://localhost:8000/api/resources/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setGlobalResources((prev) => prev.filter((r) => ((r as any)._id || r.id) !== id));
    } catch (err) {
      console.error("Failed to delete resource from DB:", err);
    }
  };

  return (
    <AppContext.Provider
      value={{
        userProfile,
        updateSkills,
        saveCareer,
        removeCareer,
        toggleResourceCompletion,
        saveResource,
        removeResource,
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
        approveUser,
        allUsers,
        deleteUser,
        toggleAdminRole,
        globalResources,
        addGlobalResource,
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

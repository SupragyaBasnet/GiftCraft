import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: {
    name: string;
    email: string;
    phone: string;
    password: string;
  }) => Promise<void>;
  logout: () => void;
  resetPassword: (email: string) => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    // Initialize state from localStorage
    const savedUser = localStorage.getItem("giftcraftUser");
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (e) {
        console.error("Failed to parse user data from localStorage", e);
        return null;
      }
    }
    return null;
  });

  // Save user to localStorage whenever user state changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("giftcraftUser", JSON.stringify(user));
    } else {
      localStorage.removeItem("giftcraftUser");
    }
  }, [user]);

  const login = async (email: string, password: string) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || data.error || "Login failed");
    setUser({ id: data.user.id, name: data.user.name, email: data.user.email, phone: data.user.phone });
    localStorage.setItem("giftcraftToken", data.token);
    localStorage.removeItem("profileImage");
  };

  const register = async (userData: {
    name: string;
    email: string;
    phone: string;
    password: string;
  }) => {
    const res = await fetch(
      '/api/auth/register',
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          password: userData.password,
        }),
      }
    );

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Registration failed");
    localStorage.removeItem("profileImage");
    await login(userData.email, userData.password);
  };

  const logout = () => {
    setUser(null);
    // The useEffect will handle removing from localStorage
  };

  const resetPassword = async (email: string) => {
    // Simulate API call - Replace with actual API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        resetPassword,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

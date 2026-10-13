import { createContext, useContext, useEffect, useState } from "react";

import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
} from "../services/auth.service";

import Loader from "../components/common/Loader";
import IntroLoader from "../components/common/IntroLoader";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showIntro, setShowIntro] = useState(
    () => !sessionStorage.getItem("quickcart:intro-seen")
  );

  const handleIntroComplete = () => {
    sessionStorage.setItem("quickcart:intro-seen", "true");
    setShowIntro(false);
  };

  const fetchCurrentUser = async () => {
    const startTime = Date.now();

    try {
      const data = await getCurrentUser();
      setUser(data.user);
    } catch {
      setUser(null);
    } finally {
      const elapsed = Date.now() - startTime;
      const remainingTime = Math.max(0, 1200 - elapsed);

      if (remainingTime > 0) {
        await new Promise((resolve) =>
          setTimeout(resolve, remainingTime)
        );
      }

      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const login = async (email, password) => {
    const data = await loginUser(email, password);
    setUser(data.user);
    return data;
  };

  const register = async (name, email, password) => {
    return registerUser(name, email, password);
  };

  const logout = async () => {
    try {
      await logoutUser();
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        fetchCurrentUser,
      }}
    >
      {showIntro ? (
        <IntroLoader
          ready={!loading}
          onFinish={handleIntroComplete}
        />
      ) : loading ? (
        <Loader
          fullScreen
          text="Getting everything ready..."
        />
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
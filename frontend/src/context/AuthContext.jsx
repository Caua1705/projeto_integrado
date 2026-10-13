import {
  createContext,
  useContext,
  useEffect,
  useState,
  useSyncExternalStore,
} from "react";
import { createAuthSession } from "../utils/authSession.js";
import { tokenStore } from "../utils/session.js";
import { loginWithPassword, currentUser } from "../services/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session] = useState(() =>
    createAuthSession({
      store: tokenStore,
      loginRequest: loginWithPassword,
      userRequest: currentUser,
    }),
  );
  const state = useSyncExternalStore(
    session.subscribe,
    session.getSnapshot,
    session.getSnapshot,
  );
  useEffect(() => {
    session.start();
    return () => session.stop();
  }, [session]);
  return (
    <AuthContext.Provider
      value={{
        ...state,
        login: session.login,
        logout: session.logout,
        retry: session.retry,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const auth = useContext(AuthContext);
  if (!auth) throw new Error("useAuth must be used inside AuthProvider");
  return auth;
}

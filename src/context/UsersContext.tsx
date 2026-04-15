import { createContext, useCallback, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { User } from "../types/user";
import { usersService } from "../services/usersService";

interface UsersContextType {
  currentUser: User | null;
  users: User[];
  isLoading: boolean;
  hasLoaded: boolean;
  error: string | null;
  loadUsers: () => Promise<void>;
}

const UsersContext = createContext<UsersContextType | undefined>(undefined);

export const UsersProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [data, current] = await Promise.all([
        usersService.getUsers(),
        usersService.getCurrentUser("u1"),
      ]);
      setUsers(data);
      setCurrentUser(current);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
      setHasLoaded(true);
    }
  }, []);

  return (
    <UsersContext.Provider value={{ currentUser, users, isLoading, hasLoaded, error, loadUsers }}>
      {children}
    </UsersContext.Provider>
  );
};

export const useUsers = () => {
  const context = useContext(UsersContext);
  if (context === undefined) {
    throw new Error("useUsers must be used within a UsersProvider");
  }
  return context;
};

import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import type { User } from '../types/user';

interface UserContextType {
  user: User
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {

    const user : User = {
        id: "u1",
        firstName: "Jan",
        lastName: "Kowalski"
    }

  return (
    <UserContext.Provider value={{ user }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => { 
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
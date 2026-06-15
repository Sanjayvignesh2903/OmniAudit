import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type HistoryItem = {
  id: string;
  title: string;
  date: string;
  category: string;
  iconName?: string;
  tint?: string;
  verdict: string;
  amount: string;
};

export type UserProfile = {
  name: string;
  username: string;
  email: string;
  phone: string;
  photoUri?: string;
};

type AppContextType = {
  usersDatabase: Record<string, UserProfile & { password?: string; history?: HistoryItem[] }>;
  currentUser: UserProfile | null;
  history: HistoryItem[];
  registerUser: (user: UserProfile & { password?: string }) => boolean;
  loginUser: (identifier: string, password?: string) => boolean;
  loginWithGoogle: (email: string) => boolean;
  logoutUser: () => void;
  addHistoryItem: (item: HistoryItem) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  resetPassword: (emailOrUsername: string, newPassword?: string) => boolean;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const mockHistory: HistoryItem[] = [
    {
      id: 'mock-1',
      title: 'BESCOM Electricity Bill',
      date: 'Jun 12, 2026',
      category: 'utilities',
      iconName: 'Zap',
      tint: '#eab308',
      verdict: 'Overcharged',
      amount: '₹4,850'
    },
    {
      id: 'mock-2',
      title: 'HSR Layout Apartment 4B',
      date: 'May 01, 2026',
      category: 'rental',
      iconName: 'Home',
      tint: '#38bdf8',
      verdict: 'Fair',
      amount: '₹18,000'
    },
    {
      id: 'mock-3',
      title: 'A2B Restaurant Receipt',
      date: 'Jun 10, 2026',
      category: 'food',
      iconName: 'UtensilsCrossed',
      tint: '#f43f5e',
      verdict: 'Fair',
      amount: '₹1,240'
    }
  ];

  const defaultUser = {
    name: 'Sanjay Vignesh',
    username: 'Sanjay29',
    email: 'sanjayvignesh11a2@gmail.com',
    phone: '1234567890',
    password: 'pass123',
    history: mockHistory
  };

  // Mock Database for registered users, keyed by username or email
  const [usersDatabase, setUsersDatabase] = useState<Record<string, UserProfile & { password?: string; history?: HistoryItem[] }>>({
    [defaultUser.username]: defaultUser,
    [defaultUser.email]: defaultUser
  });
  
  // Currently logged in user
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  
  // Active user's history array
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedDb = window.localStorage.getItem('omni_usersDatabase');
      const storedUser = window.localStorage.getItem('omni_currentUser');
      console.log('AppContext: Loading from localStorage', { storedUser, storedDb: storedDb ? 'present' : 'empty' });
      
      let loadedDb = {
        [defaultUser.username]: defaultUser,
        [defaultUser.email]: defaultUser
      };

      if (storedDb) {
        try {
          loadedDb = JSON.parse(storedDb);
          setUsersDatabase(loadedDb);
          console.log('AppContext: Loaded users database keys:', Object.keys(loadedDb));
        } catch (e) {
          console.error('Failed to parse users database', e);
        }
      }

      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          console.log('AppContext: Loaded current user:', parsedUser);
          setCurrentUser(parsedUser);
          // Look up user in database to retrieve their specific history
          const fullUser = Object.values(loadedDb).find(u => u.username === parsedUser.username);
          if (fullUser && fullUser.history) {
            setHistory(fullUser.history);
          } else {
            setHistory([]);
          }
        } catch (e) {
          console.error('Failed to parse current user', e);
        }
      }
    }
  }, []);

  const registerUser = (user: UserProfile & { password?: string }) => {
    if (usersDatabase[user.username] || usersDatabase[user.email]) {
      return false; // User already exists
    }
    const newUser = {
      ...user,
      history: []
    };
    const updatedDb = {
      ...usersDatabase,
      [user.username]: newUser,
      [user.email]: newUser
    };
    
    setUsersDatabase(updatedDb);
    
    const profile = {
      name: user.name,
      username: user.username,
      email: user.email,
      phone: user.phone,
      photoUri: user.photoUri,
    };
    setCurrentUser(profile);
    setHistory([]);

    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem('omni_usersDatabase', JSON.stringify(updatedDb));
      window.localStorage.setItem('omni_currentUser', JSON.stringify(profile));
    }
    return true;
  };

  const loginUser = (identifier: string, password?: string) => {
    const user = usersDatabase[identifier];
    if (user && user.password === password) {
      const profile = {
        name: user.name,
        username: user.username,
        email: user.email,
        phone: user.phone,
        photoUri: user.photoUri,
      };
      setCurrentUser(profile);
      setHistory(user.history || []);

      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem('omni_currentUser', JSON.stringify(profile));
      }
      return true;
    }
    return false;
  };

  const loginWithGoogle = (email: string) => {
    // Look up by email
    const existingUser = Object.values(usersDatabase).find(u => u.email.toLowerCase() === email.toLowerCase());

    if (existingUser) {
      const profile = {
        name: existingUser.name,
        username: existingUser.username,
        email: existingUser.email,
        phone: existingUser.phone,
        photoUri: existingUser.photoUri,
      };
      setCurrentUser(profile);
      setHistory(existingUser.history || []);

      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem('omni_currentUser', JSON.stringify(profile));
      }
      return true;
    } else {
      // Dynamic registration
      const prefix = email.split('@')[0];
      let username = prefix;
      let counter = 1;
      while (usersDatabase[username]) {
        username = `${prefix}${counter}`;
        counter++;
      }

      const newUser = {
        name: prefix.charAt(0).toUpperCase() + prefix.slice(1),
        username: username,
        email: email,
        phone: '',
        password: '', // Password-less Google user
        photoUri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150', // Default google avatar
        history: []
      };

      const updatedDb = {
        ...usersDatabase,
        [username]: newUser,
        [email]: newUser
      };

      setUsersDatabase(updatedDb);

      const profile = {
        name: newUser.name,
        username: newUser.username,
        email: newUser.email,
        phone: newUser.phone,
        photoUri: newUser.photoUri,
      };
      setCurrentUser(profile);
      setHistory([]);

      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem('omni_usersDatabase', JSON.stringify(updatedDb));
        window.localStorage.setItem('omni_currentUser', JSON.stringify(profile));
      }
      return true;
    }
  };

  const logoutUser = () => {
    setCurrentUser(null);
    setHistory([]);
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem('omni_currentUser');
    }
  };

  const addHistoryItem = (item: HistoryItem) => {
    setHistory(prev => {
      const updatedHistory = [item, ...prev];
      if (currentUser) {
        setUsersDatabase(prevDb => {
          const userRecord = prevDb[currentUser.username];
          if (userRecord) {
            const updatedRecord = {
              ...userRecord,
              history: updatedHistory
            };
            const updatedDb = {
              ...prevDb,
              [currentUser.username]: updatedRecord,
              [currentUser.email]: updatedRecord
            };
            if (typeof window !== 'undefined' && window.localStorage) {
              window.localStorage.setItem('omni_usersDatabase', JSON.stringify(updatedDb));
            }
            return updatedDb;
          }
          return prevDb;
        });
      }
      return updatedHistory;
    });
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (currentUser) {
      const updatedProfile = { ...currentUser, ...updates };
      setCurrentUser(updatedProfile);
      
      setUsersDatabase(prevDb => {
        const userRecord = prevDb[currentUser.username];
        if (userRecord) {
          const updatedRecord = {
            ...userRecord,
            ...updates
          };
          const updatedDb = {
            ...prevDb,
            [currentUser.username]: updatedRecord,
            [currentUser.email]: updatedRecord
          };
          if (typeof window !== 'undefined' && window.localStorage) {
            window.localStorage.setItem('omni_usersDatabase', JSON.stringify(updatedDb));
            window.localStorage.setItem('omni_currentUser', JSON.stringify(updatedProfile));
          }
          return updatedDb;
        }
        return prevDb;
      });
    }
  };

  const resetPassword = (emailOrUsername: string, newPassword?: string) => {
    const user = usersDatabase[emailOrUsername];
    if (user) {
      const updatedRecord = {
        ...user,
        password: newPassword
      };
      const updatedDb = {
        ...usersDatabase,
        [user.username]: updatedRecord,
        [user.email]: updatedRecord
      };
      setUsersDatabase(updatedDb);
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem('omni_usersDatabase', JSON.stringify(updatedDb));
      }
      return true;
    }
    return false;
  };

  return (
    <AppContext.Provider value={{
      usersDatabase,
      currentUser,
      history,
      registerUser,
      loginUser,
      loginWithGoogle,
      logoutUser,
      addHistoryItem,
      updateProfile,
      resetPassword,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};


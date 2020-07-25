import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-community/async-storage';

import * as auth from '../services/Auth';
import api from '../services/api';

interface User {
  name: string;
  email: string;
}

interface AuthContextData {
  signed: boolean;
  user: User | null;
  loading: boolean;
  signIn(): Promise<void>;
  signOut(): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC = ({ children }) => {

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStorageData() {
      const storagedUser = await AsyncStorage.getItem('@RNAuth:user');
      const storagedToken = await AsyncStorage.getItem('@RNAuth:token');

      await new Promise(resolve => setTimeout(resolve, 1000));

      if (storagedToken && storagedToken) {
        api.defaults.headers.Authorization = `Bearer ${storagedToken}`;

        setUser(JSON.parse(storagedUser));
      }
      setLoading(false);
      
    }

    loadStorageData();
  }, [])

  function signIn() {
    auth.signIn().then(async res => {
      setUser(res.user);

      api.defaults.headers.Authorization = `Bearer ${res.token}`;

      await AsyncStorage.setItem('@RNAuth:user', JSON.stringify(res.user));
      await AsyncStorage.setItem('@RNAuth:token', res.token);
    });
  }

  async function signOut() {
    await AsyncStorage.removeItem('@RNAuth:user');
    await AsyncStorage.removeItem('@RNAuth:token');

    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        signed: !!user,
        user,
        loading,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  return context;
}
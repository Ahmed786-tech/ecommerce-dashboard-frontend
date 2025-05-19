import { defineStore } from 'pinia';
import { jwtDecode } from 'jwt-decode';
import api from '../services/api'
import type { IUser } from '../types';

interface AuthState {
  user: IUser | null;
  token: string | null;
  isInitialized: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: null,
    isInitialized: false
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
    currentUser: (state) => state.user,
  },
  actions: {
    
    setToken(token: string) {
      this.token = token;
      localStorage.setItem('authToken', token);
    },
    async initialize() {
        const token = localStorage.getItem('authToken');
        
        if (token && this.isTokenValid(token)) {
          this.token = token;
          await this.fetchUser();
        }
        
        this.isInitialized = true;
      },

      async fetchUser() {
        try {
          const response = await api.get('/users/profile');
          this.user = response.data.user;
        } catch (error) {
          this.logout();
        }
      },
      
      isTokenValid(token: string): boolean {
        try {
          const decoded = jwtDecode<any>(token);
          return decoded.exp * 1000 > Date.now();
        } catch {
          return false;
        }
      },
    logout() {
      this.user = null;
      this.token = null;
      this.isInitialized = true;
      localStorage.removeItem('authToken');
    }
  },
});
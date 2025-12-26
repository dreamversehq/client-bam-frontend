import axios from 'axios';
import { AuthResponse, LoginRequest, RegisterRequest, Transaction, TransactionResponse, User } from '../types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://client-bam-backend.onrender.com/v1';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url} - Token: ${token ? 'Present' : 'Missing'}`);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`[API Response] ${response.config.method?.toUpperCase()} ${response.config.url} - Status: ${response.status}`);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    console.error(`[API Error] ${originalRequest?.method?.toUpperCase()} ${originalRequest?.url} - Status: ${error.response?.status}`, error.response?.data);
    
    // Handle 401 Unauthorized (Token expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Here you could implement token refresh logic if the backend supports it
      // For now, we might just redirect to login or clear storage
      if (typeof window !== 'undefined') {
        // localStorage.removeItem('accessToken');
        // localStorage.removeItem('user');
        // window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    console.log('[authApi.login] Attempting login for:', data.email);
    const response = await api.post<any>('/auth/login', data);
    
    console.log('[authApi.login] Raw response data:', response.data);
    
    const responseData = response.data;
    // Handle potential wrapping (e.g. { data: { ... } })
    const authData = responseData.data || responseData;
    
    // Handle different token structures
    // 1. { tokens: { access: { token: ... } } }
    // 2. { access: "jwt...", refresh: "jwt..." }
    const accessToken = authData.tokens?.access?.token || authData.access;
    const refreshToken = authData.tokens?.refresh?.token || authData.refresh;

    console.log('[authApi.login] Access Token found:', !!accessToken);

    if (accessToken) {
      localStorage.setItem('accessToken', accessToken);
      if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
      
      // If user object is provided, store it
      if (authData.user) {
        localStorage.setItem('user', JSON.stringify(authData.user));
      } else {
        // If user is missing, decode token to get ID and fetch user
        try {
          // Decode JWT payload
          const base64Url = accessToken.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
              return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          }).join(''));
          
          const payload = JSON.parse(jsonPayload);
          const userId = payload.sub; // 'sub' claim usually contains the user ID
          
          if (userId) {
            console.log('[authApi.login] Extracted User ID from token:', userId);
            // Fetch full user profile
            const userResponse = await api.get(`/users/me`);
            const userData = (userResponse.data as any).data || userResponse.data;
            localStorage.setItem('user', JSON.stringify(userData));
          }
        } catch (e) {
          console.error('[authApi.login] Failed to decode token or fetch user profile:', e);
        }
      }
    }
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post<any>('/auth/register', data);

    console.log('[authApi.register] Raw response data:', response.data);
    const responseData = response.data;
    const authData = responseData.data || responseData;

    // Some backends only set lastLoginAt when the user explicitly logs in.
    // To ensure the client sees the same state as a fresh login (and to populate lastLoginAt),
    // call the login endpoint using the provided credentials after registration.
    try {
      // It's safe to call login here since authApi.login will save tokens and user into localStorage.
      // We cast to any because RegisterRequest and LoginRequest have compatible shapes for email/password.
      await authApi.login((data as any) as LoginRequest);
    } catch (e) {
      console.error('[authApi.register] Login after register failed:', e);
      // Fallback: if login fails but tokens were returned in register response, persist them as before
      const accessToken = authData.tokens?.access?.token || authData.access;
      const refreshToken = authData.tokens?.refresh?.token || authData.refresh;
      if (accessToken) {
        localStorage.setItem('accessToken', accessToken);
        if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
        if (authData.user) {
          localStorage.setItem('user', JSON.stringify(authData.user));
        }
      }
    }

    return response.data;
  },

  logout: async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      await api.post('/auth/logout', { refreshToken });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  },
  
  getCurrentUser: async (): Promise<User | null> => {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem('user');
    console.log('[getCurrentUser] Stored user string:', userStr ? 'Found' : 'Missing');
    
    if (!userStr) return null;
    
    let user: User;
    try {
      user = JSON.parse(userStr);
    } catch (e) {
      console.error('[getCurrentUser] Failed to parse user JSON', e);
      return null;
    }

    try {
      // If we have an ID, fetch the latest data
      if (user.id) {
        console.log(`[getCurrentUser] Fetching fresh data for user ID: ${user.id}`);
        const response = await api.get<User>(`/users/me`);
        console.log('[getCurrentUser] Fresh data received:', response.data);
        
        const userData = (response.data as any).data || response.data;

        // Update local storage with fresh data
        localStorage.setItem('user', JSON.stringify(userData));
        return userData;
      }
      console.warn('[getCurrentUser] User object has no ID, returning stored object');
      return user;
    } catch (error: any) {
      console.error('[getCurrentUser] Error fetching fresh data:', error);
      // If unauthorized, return null to trigger logout
      if (error.response?.status === 401) {
        console.warn('[getCurrentUser] 401 received, returning null (triggering logout)');
        return null;
      }
      // Otherwise return stored user data as fallback
      console.log('[getCurrentUser] Returning stored user data as fallback');
      return user;
    }
  }
};

export const transactionApi = {
  getTransactions: async (page = 1, limit = 10): Promise<TransactionResponse> => {
    const response = await api.get<TransactionResponse>(`/transactions/me?page=${page}&limit=${limit}`);
    // The response.data is already the PaginatedResponse object { data: [...], pagination: {...} }
    // But sometimes it might be wrapped in another data object depending on axios interceptors or backend
    // Based on previous logs, it seems backend returns { status: "success", data: { ... } }
    // So response.data might be { status: "success", data: { data: [], pagination: {} } }
    
    const responseData = response.data as any;
    // If responseData has a 'data' property that is an object with 'data' array, use that
    if (responseData.data && Array.isArray(responseData.data.data)) {
        return responseData.data;
    }
    // If responseData itself has 'data' array
    if (Array.isArray(responseData.data)) {
        return responseData;
    }
    
    // Fallback or if structure is different
    return responseData.data || responseData;
  },

  verifyDeposit: async (reference: string): Promise<Transaction> => {
    const response = await api.post<Transaction>('/transactions/me/deposit/verify', { reference });
    const data = (response.data as any).data || response.data;
    return data;
  },

  initiateDeposit: async (amount: number, callbackUrl?: string): Promise<{ authorizationUrl: string; reference: string }> => {
    const payload: any = { amount, currency: 'NGN' };
    if (callbackUrl) payload.callbackUrl = callbackUrl;
    const response = await api.post('/transactions/me/deposit/initiate', payload);
    const data = (response.data as any).data || response.data;
    return data;
  },

  getBalance: async (): Promise<number> => {
    const response = await api.get('/transactions/me/balance');
    const data = (response.data as any).data || response.data;
    // Find NGN balance or default to 0
    const ngnBalance = data.balances?.find((b: any) => b.currency === 'NGN');
    return ngnBalance ? ngnBalance.balance : 0;
  },
  
  getTransaction: async (id: string): Promise<Transaction> => {
    const response = await api.get<Transaction>(`/transactions/me/${id}`);
    const data = (response.data as any).data || response.data;
    return data;
  }
};

export const userApi = {
  getUser: async (id: string): Promise<User> => {
    const response = await api.get<User>(`/users/${id}`);
    return response.data;
  },
  
  updateUser: async (id: string, data: Partial<User>): Promise<User> => {
    const response = await api.patch<User>(`/users/${id}`, data);
    return response.data;
  },

  uploadAvatar: async (file: File): Promise<User> => {
    const formData = new FormData();
    formData.append('avatar', file);
    const response = await api.post('/users/me/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    const data = (response.data as any).data || response.data;
    return data;
  },

  deleteAvatar: async (): Promise<User> => {
    const response = await api.delete('/users/me/avatar');
    const data = (response.data as any).data || response.data;
    return data;
  }
};

export default api;

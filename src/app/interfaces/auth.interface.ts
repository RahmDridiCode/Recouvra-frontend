export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'manager' | 'agent';
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}


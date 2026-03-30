export interface User {
  _id: string;
  id?: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'agent';
  createdAt?: string;
  updatedAt?: string;
}

export interface UserCreate {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'manager' | 'agent';
}

export interface UserUpdate {
  name?: string;
  email?: string;
  password?: string;
  role?: 'admin' | 'manager' | 'agent';
}


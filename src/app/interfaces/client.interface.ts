export interface Client {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  assignedTo?: { _id: string; name: string; email: string } | string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ClientCreate {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  assignedTo?: string;
}

export interface ClientUpdate {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  assignedTo?: string;
}



export interface User {
  id: string;
  fullName: string;
  phone?: string;
  userType: 'promoter' | 'company' | 'supervisor';
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

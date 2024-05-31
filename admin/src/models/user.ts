export interface User {
  _id: string;
  phone: string;
  role: string;
  avatarUrl: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  attributes: any;
}

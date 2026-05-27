export interface UserListItem {
  id: string;
  name: string;
  email: string;
  phoneNumber: string | null;
  registrationNumber: string;
  role: string;
  userStatus: string;
  createdAt: Date;
  updatedAt: Date;
}

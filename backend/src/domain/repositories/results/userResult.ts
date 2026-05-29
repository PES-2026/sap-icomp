import { BaseItem } from "@domain/shared/item";

export interface UserItem extends BaseItem {
  name: string;
  email: string;
  phoneNumber: string;
  registrationNumber: string;
  role: string;
  userStatus: string;
}

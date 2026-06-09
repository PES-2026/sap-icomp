import { BaseItem } from "@domain/shared/item";

export interface UserResult extends BaseItem {
  name: string;
  email: string;
  phoneNumber: string | null;
  registrationNumber: string;
  role: string;
  userStatus: string;
}

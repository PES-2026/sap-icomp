import { BaseItem } from "@domain/shared/item";

export interface UserAuthResult extends BaseItem {
  name: string;
  email: string;
  phoneNumber: string;
  registrationNumber: string;
  password: string;
  userStatus: string;
}

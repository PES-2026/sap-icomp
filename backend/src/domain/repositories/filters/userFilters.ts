import { UserStatusEnum } from "@domain/enum/userStatus";

export interface UserFilters {
  name?: string;
  userStatus?: UserStatusEnum;
}

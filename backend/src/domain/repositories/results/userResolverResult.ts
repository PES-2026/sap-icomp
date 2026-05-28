import { RoleEnum } from "@domain/enum/role";
import { UserAuthResult } from "./userAuthResult";

export interface UserResolverResult {
  userData: UserAuthResult;
  role: RoleEnum;
}

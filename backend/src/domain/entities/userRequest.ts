import { ExternalIdVO } from "@domain/valueObjects/shared/externalId";
import { NameVO } from "@domain/valueObjects/shared/name";
import { EmailVO } from "@domain/valueObjects/shared/email";
import { PhoneNumberVO } from "@domain/valueObjects/student/phoneNumber";
import { RegistrationNumberVO } from "@domain/valueObjects/shared/registration";
import { UserStatusVO } from "@domain/valueObjects/shared/userStatus";
import { PasswordVO } from "@domain/valueObjects/shared/password";
import { UserTypeVO } from "@domain/valueObjects/shared/userType";
import { Result } from "@domain/shared/result";

export type UserRequestProps = {
  id?: string;
  name: string;
  email: string;
  phoneNumber: string;
  registrationNumber: string;
  userStatus: string;
  userType: string;
  password?: string;
};

export class UserRequest {
  constructor(
    public readonly id: ExternalIdVO,
    public name: NameVO,
    public email: EmailVO,
    public phoneNumber: PhoneNumberVO,
    public registrationNumber: RegistrationNumberVO,
    public userStatus: UserStatusVO,
    public userType: UserTypeVO,
    public readonly password?: PasswordVO,
  ) {}

  static create(props: UserRequestProps): Result<UserRequest> {
    const id = ExternalIdVO.create();
    const name = NameVO.create(props.name);
    const email = EmailVO.create(props.email);
    const phoneNumber = PhoneNumberVO.create(props.phoneNumber);
    const registrationNumber = RegistrationNumberVO.create(props.registrationNumber);
    const userStatus = UserStatusVO.create(props.userStatus);
    const userType = UserTypeVO.create(props.userType);
    const password = props.password ? PasswordVO.create(props.password) : undefined;

    const results = [id, name, email, phoneNumber, registrationNumber, userStatus, userType, password];

    for (const result of results) {
      if (result?.isFailure) {
        throw Result.fail<UserRequest>(result.error!);
      }
    }
    return Result.ok(
      new UserRequest(
        id.getValue(),
        name.getValue(),
        email.getValue(),
        phoneNumber.getValue(),
        registrationNumber.getValue(),
        userStatus.getValue(),
        userType.getValue(),
        password?.getValue(),
      ),
    );
  }
}

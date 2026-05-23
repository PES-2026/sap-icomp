import { ExternalIdVO } from "@domain/valueObjects/shared/externalId";
import { NameVO } from "@domain/valueObjects/shared/name";
import { EmailVO } from "@domain/valueObjects/shared/email";
import { PhoneNumberVO } from "@domain/valueObjects/student/phoneNumber";
import { RegistrationNumberVO } from "@domain/valueObjects/shared/registration";
import { UserStatusVO } from "@domain/valueObjects/shared/userStatus";
import { PasswordVO } from "@domain/valueObjects/shared/password";
import { UserTypeVO } from "@domain/valueObjects/shared/userType";
import { Result } from "@domain/shared/result";

export type AccountRequestProps = {
  id?: string;
  name: string;
  email: string;
  phoneNumber: string;
  registrationNumber: string;
  userStatus: string;
  userType: string;
  password: string;
};

export class AccountRequest {
  constructor(
    public readonly id: ExternalIdVO,
    public name: NameVO,
    public email: EmailVO,
    public phoneNumber: PhoneNumberVO,
    public registrationNumber: RegistrationNumberVO,
    public userStatus: UserStatusVO,
    public userType: UserTypeVO,
    public readonly password: PasswordVO,
  ) {}

  static create(props: AccountRequestProps): Result<AccountRequest> {
    const id = ExternalIdVO.create();
    const name = NameVO.create(props.name);
    const email = EmailVO.create(props.email);
    const phoneNumber = PhoneNumberVO.create(props.phoneNumber);
    const registrationNumber = RegistrationNumberVO.create(props.registrationNumber);
    const userStatus = UserStatusVO.create(props.userStatus);
    const userType = UserTypeVO.create(props.userType);
    const password = PasswordVO.create(props.password);

    const results = [id, name, email, phoneNumber, registrationNumber, userStatus, userType, password];

    for (const result of results) {
      if (result?.isFailure) {
        throw Result.fail<AccountRequest>(result.error!);
      }
    }
    return Result.ok(
      new AccountRequest(
        id.getValue(),
        name.getValue(),
        email.getValue(),
        phoneNumber.getValue(),
        registrationNumber.getValue(),
        userStatus.getValue(),
        userType.getValue(),
        password.getValue(),
      ),
    );
  }
}

import { Result } from "@domain/shared/result";
import { EmailVO } from "@domain/valueObjects/shared/email";
import { ExternalIdVO } from "@domain/valueObjects/shared/externalId";
import { NameVO } from "@domain/valueObjects/shared/name";
import { PasswordVO } from "@domain/valueObjects/shared/password";
import { RegistrationNumberVO } from "@domain/valueObjects/shared/registration";
import { RoleVO } from "@domain/valueObjects/shared/role";
import { UserStatusVO } from "@domain/valueObjects/shared/userStatus";
import { PhoneNumberVO } from "@domain/valueObjects/student/phoneNumber";

export type AccountRequestProps = {
  id?: string;
  name: string;
  email: string;
  phoneNumber: string;
  registrationNumber: string;
  userStatus: string;
  role?: string | undefined;
  password?: string;
  plainPassword?: string;
  hashedPassword?: string;
  createdAt?: Date;
};

export class AccountRequest {
  constructor(
    public readonly id: ExternalIdVO,
    public name: NameVO,
    public email: EmailVO,
    public phoneNumber: PhoneNumberVO,
    public registrationNumber: RegistrationNumberVO,
    public userStatus: UserStatusVO,
    public readonly password: PasswordVO,
    public readonly createdAt?: Date,
    public role?: RoleVO,
  ) {}

  static create(props: AccountRequestProps): Result<AccountRequest> {
    const id = ExternalIdVO.create();
    const name = NameVO.create(props.name);
    const email = EmailVO.create(props.email);
    const phoneNumber = PhoneNumberVO.create(props.phoneNumber);
    const registrationNumber = RegistrationNumberVO.create(props.registrationNumber);
    const userStatus = UserStatusVO.create(props.userStatus);
    const password = PasswordVO.create(props.plainPassword!, props.hashedPassword!);
    const role = props.role ? RoleVO.create(props.role) : undefined;
    const createdAt = new Date();

    const results = [id, name, email, phoneNumber, registrationNumber, userStatus, password, role];

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
        password.getValue(),
        createdAt,
        role?.getValue(),
      ),
    );
  }

  static rehydrate(props: AccountRequestProps): AccountRequest {
    return new AccountRequest(
      ExternalIdVO.fromTrusted(props.id!),
      NameVO.fromTrusted(props.name),
      EmailVO.fromTrusted(props.email),
      PhoneNumberVO.fromTrusted(props.phoneNumber),
      RegistrationNumberVO.fromTrusted(props.registrationNumber),
      UserStatusVO.fromTrusted(props.userStatus),
      PasswordVO.fromTrusted(props.password || props.hashedPassword!),
      props.createdAt,
      props.role ? RoleVO.fromTrusted(props.role) : undefined,
    );
  }

  approve(): void {
    this.userStatus = UserStatusVO.fromTrusted("APPROVED");
  }

  reject(): void {
    this.userStatus = UserStatusVO.fromTrusted("REJECTED");
  }
}

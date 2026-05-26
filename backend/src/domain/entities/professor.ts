import { Result } from "@domain/shared/result";
import { EmailVO } from "@domain/valueObjects/shared/email";
import { ExternalIdVO } from "@domain/valueObjects/shared/externalId";
import { NameVO } from "@domain/valueObjects/shared/name";
import { PasswordVO } from "@domain/valueObjects/shared/password";
import { RegistrationNumberVO } from "@domain/valueObjects/shared/registration";
import { UserStatusVO } from "@domain/valueObjects/shared/userStatus";
import { PhoneNumberVO } from "@domain/valueObjects/student/phoneNumber";

export type ProfessorProps = {
  id?: string;
  name: string;
  email: string;
  phoneNumber: string;
  registrationNumber: string;
  userStatus: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
};
export class Professor {
  constructor(
    public readonly id: ExternalIdVO,
    public name: NameVO,
    public email: EmailVO,
    public phoneNumber: PhoneNumberVO,
    public registrationNumber: RegistrationNumberVO,
    public userStatus: UserStatusVO,
    public readonly password: PasswordVO,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}

  static create(props: ProfessorProps): Result<Professor> {
    const id = ExternalIdVO.create();
    const name = NameVO.create(props.name);
    const email = EmailVO.create(props.email);
    const phoneNumber = PhoneNumberVO.create(props.phoneNumber);
    const registrationNumber = RegistrationNumberVO.create(props.registrationNumber);
    const userStatus = UserStatusVO.create(props.userStatus);
    const password = PasswordVO.create(props.password, props.password);

    const createdAt = props.createdAt || new Date();
    const updatedAt = props.updatedAt || new Date();

    const results = [id, name, email, phoneNumber, registrationNumber, userStatus, password];

    for (const result of results) {
      if (result?.isFailure) {
        throw Result.fail<Professor>(result.error!);
      }
    }
    return Result.ok(
      new Professor(
        id.getValue(),
        name.getValue(),
        email.getValue(),
        phoneNumber.getValue(),
        registrationNumber.getValue(),
        userStatus.getValue(),
        password.getValue(),
        createdAt,
        updatedAt,
      ),
    );
  }
  static rehydrate(props: ProfessorProps): Professor {
    return new Professor(
      ExternalIdVO.fromTrusted(props.id!),
      NameVO.fromTrusted(props.name),
      EmailVO.fromTrusted(props.email),
      PhoneNumberVO.fromTrusted(props.phoneNumber),
      RegistrationNumberVO.fromTrusted(props.registrationNumber),
      UserStatusVO.fromTrusted(props.userStatus),
      PasswordVO.fromTrusted(props.password),
      props.createdAt,
      props.updatedAt,
    );
  }
}

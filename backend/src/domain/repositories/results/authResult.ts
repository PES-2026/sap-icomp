export class AuthResult {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string,
    public readonly phoneNumber: string,
    public readonly registrationNumber: string,
    public readonly role: string,
    public readonly userStatus: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly token: string,
  ) {}
}

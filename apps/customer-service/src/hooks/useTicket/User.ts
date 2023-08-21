export type UserId = string;

export class User {
  readonly id: UserId;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl?: string;

  constructor(
    id: UserId,
    firstName: string,
    lastName: string,
    email: string,
    avatarUrl?: string
  ) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.avatarUrl = avatarUrl;
  }

  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }
}

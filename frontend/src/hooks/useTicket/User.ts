export type UserId = string;

export class User {
  readonly id: UserId;
  firstName: string;
  lastName: string;
  email: string;
  imageUrl?: string;

  constructor(
    id: UserId,
    firstName: string,
    lastName: string,
    email: string,
    imageUrl?: string
  ) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.imageUrl = imageUrl;
  }

  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }
}

export type UserId = string;

export class User {
  readonly id: UserId;
  firstName: string;
  lastName: string;
  email: string;

  constructor(id: UserId, firstName: string, lastName: string, email: string) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
  }
}

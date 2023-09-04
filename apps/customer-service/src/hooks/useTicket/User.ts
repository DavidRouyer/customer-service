export type UserId = string;

export class User {
  readonly id: UserId;
  name: string;
  email: string;
  image?: string;

  constructor(id: UserId, name: string, email: string, image?: string) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.image = image;
  }

  get fullName() {
    return this.name;
  }
}

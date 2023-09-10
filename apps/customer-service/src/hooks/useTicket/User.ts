export type UserId = string;

export class User {
  readonly id: UserId;
  name: string;
  email: string;
  image?: string;
  contactId?: number;

  constructor(
    id: UserId,
    name: string,
    email: string,
    image?: string,
    contactId?: number
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.image = image;
    this.contactId = contactId;
  }

  get fullName() {
    return this.name;
  }
}

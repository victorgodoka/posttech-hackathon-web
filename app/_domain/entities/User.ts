import { Email } from '../value-objects/Email';

export interface UserProps {
  id: string;
  email: Email;
  name: string;
  hashedPassword: string;
  createdAt: Date;
}

export interface UserJSON {
  id: string;
  email: string;
  name: string;
  hashedPassword: string;
  createdAt: string;
}

export class User {
  private constructor(private props: UserProps) {}

  static create(data: {
    email: Email;
    name: string;
    hashedPassword: string;
  }): User {
    return new User({
      id: crypto.randomUUID(),
      email: data.email,
      name: data.name,
      hashedPassword: data.hashedPassword,
      createdAt: new Date(),
    });
  }

  static fromPersistence(props: UserProps): User {
    return new User(props);
  }

  get id(): string {
    return this.props.id;
  }

  get email(): Email {
    return this.props.email;
  }

  get name(): string {
    return this.props.name;
  }

  get hashedPassword(): string {
    return this.props.hashedPassword;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  toJSON() {
    return {
      id: this.props.id,
      email: this.props.email.getValue(),
      name: this.props.name,
      hashedPassword: this.props.hashedPassword,
      createdAt: this.props.createdAt.toISOString(),
    };
  }

  static fromJSON(data: UserJSON): User {
    return User.fromPersistence({
      id: data.id,
      email: Email.create(data.email),
      name: data.name,
      hashedPassword: data.hashedPassword,
      createdAt: new Date(data.createdAt),
    });
  }
}

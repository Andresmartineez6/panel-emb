
export class Email {

  constructor(private readonly _value: string) {
    this.validate(_value);
  }

  get value(): string {
    return this._value;
  }

  private validate(value: string): void {
    if (!value || value.trim().length === 0) {
      throw new Error('Email cannot be empty');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value.trim())) {
      throw new Error('Invalid email format');
    }

    if (value.trim().length > 254) {
      throw new Error('Email cannot exceed 254 characters');
    }
  }

  public static fromString(value: string): Email {
    return new Email(value.trim().toLowerCase());
  }
  
  public static create(value: string): Email {
    return new Email(value.trim().toLowerCase());
  }

  public equals(other: Email): boolean {
    return this._value === other._value;
  }

  public getDomain(): string {
    return this._value.split('@')[1];
  }

  public getLocalPart(): string {
    return this._value.split('@')[0];
  }

  public toString(): string {
    return this._value;
  }
  
}

import { randomUUID } from 'crypto';

export class ClientId {
  constructor(private readonly _value: string) {
    this.validate(_value);
  }

  get value(): string {
    return this._value;
  }

  private validate(value: string): void {
    if (!value || value.trim().length === 0) {
      throw new Error('ClientId cannot be empty');
    }
    
    //validacion del foirmato de uuid
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(value)) {
      throw new Error('ClientId must be a valid UUID');
    }
  }

  public static generate(): ClientId {
    return new ClientId(randomUUID());
  }

  public static fromString(value: string): ClientId {
    return new ClientId(value);
  }

  public equals(other: ClientId): boolean {
    return this._value === other._value;
  }

  public toString(): string {
    return this._value;
  }
}


export class Phone {

  
  constructor(private readonly _value: string) {
    this.validate(_value);
  }


  get value(): string {
    return this._value;
  }


  private validate(value: string): void {
    if (!value || value.trim().length === 0) {
      throw new Error('Phone cannot be empty');
    }

    //limpiar el telefono de espacios y caracteres especiales
    const cleanPhone = value.replace(/[\s\-\(\)\.]/g, '');
    
    //validar que solo contenga numeros y el simbolo +
    const phoneRegex = /^(\+34|0034|34)?[6-9][0-9]{8}$/;
    if (!phoneRegex.test(cleanPhone)) {
      throw new Error('Invalid Spanish phone number format');
    }

  }


  private static formatPhoneNumber(value: string): string {
    //normalizar el telefono
    let cleanPhone = value.replace(/[\s\-\(\)\.]/g, '');
    
    //si empieza con +34, 0034 o 34, lo normalizamos
    if (cleanPhone.startsWith('+34')) {
      cleanPhone = cleanPhone.substring(3);
    } else if (cleanPhone.startsWith('0034')) {
      cleanPhone = cleanPhone.substring(4);
    } else if (cleanPhone.startsWith('34') && cleanPhone.length === 11) {
      cleanPhone = cleanPhone.substring(2);
    }
    
    return '+34' + cleanPhone;
  }


  public equals(other: Phone): boolean {
    return this._value === other._value;
  }


  public getInternationalFormat(): string {
    return this._value;
  }


  public getNationalFormat(): string {
    return this._value.replace('+34', '');
  }


  public getFormattedDisplay(): string {
    const national = this.getNationalFormat();
    return `${national.substring(0, 3)} ${national.substring(3, 6)} ${national.substring(6)}`;
  }


  public static fromString(value: string): Phone {
    return new Phone(Phone.formatPhoneNumber(value));
  }

  public static create(value: string): Phone {
    return new Phone(Phone.formatPhoneNumber(value));
  }

  public toString(): string {
    return this._value;
  }

}

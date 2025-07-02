
import { Email, Phone, ClientId } from '../value-objects';
import { ClientStatus } from '../enums';

export interface CreateClientProps {
  name: string;
  email: string;
  phone: string;
  address: string;
  taxId: string;
}

export interface ClientProps {
  id: ClientId;
  name: string;
  email: Email;
  phone: Phone;
  address: string;
  taxId: string;
  status: ClientStatus;
  createdAt: Date;
  updatedAt: Date;
}

export class Client {
  private readonly _id: ClientId;
  private _name: string;
  private _email: Email;
  private _phone: Phone;
  private _address: string;
  private _taxId: string; // NIF/CIF
  private _status: ClientStatus;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: ClientProps) {
    this._id = props.id;
    this._name = props.name;
    this._email = props.email;
    this._phone = props.phone;
    this._address = props.address;
    this._taxId = props.taxId;
    this._status = props.status;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  //Getters
  get id(): ClientId {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get email(): Email {
    return this._email;
  }

  get phone(): Phone {
    return this._phone;
  }

  get address(): string {
    return this._address;
  }

  get taxId(): string {
    return this._taxId;
  }

  get status(): ClientStatus {
    return this._status;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }


  //Metodos Bussines
  public updatePersonalInfo(
    name: string,
    email: Email,
    phone: Phone,
    address: string,
  ): void {
    this.validateName(name);
    
    this._name = name.trim();
    this._email = email;
    this._phone = phone;
    this._address = address.trim();
    this._updatedAt = new Date();
  }

  public updateTaxId(taxId: string): void {
    this.validateTaxId(taxId);
    this._taxId = taxId.trim().toUpperCase();
    this._updatedAt = new Date();
  }

  public activate(): void {
    if (this._status === ClientStatus.DELETED) {
      throw new Error('Cannot activate a deleted client');
    }
    this._status = ClientStatus.ACTIVE;
    this._updatedAt = new Date();
  }

  public deactivate(): void {
    this._status = ClientStatus.INACTIVE;
    this._updatedAt = new Date();
  }

  public delete(): void {
    this._status = ClientStatus.DELETED;
    this._updatedAt = new Date();
  }

  public isActive(): boolean {
    return this._status === ClientStatus.ACTIVE;
  }

  public canCreateInvoice(): boolean {
    return this.isActive() && this._taxId !== '';
  }

  // Factory method para crear nueva instancia
  static create(props: CreateClientProps): Client {
    const id = ClientId.generate();
    const email = Email.create(props.email.trim());
    const phone = Phone.create(props.phone.trim());
    const now = new Date();

    const client = new Client({
      id,
      name: props.name.trim(),
      email,
      phone,
      address: props.address.trim(),
      taxId: props.taxId.trim().toUpperCase(),
      status: ClientStatus.ACTIVE,
      createdAt: now,
      updatedAt: now,
    });

    return client;
  }

  // Factory method para reconstruir desde persistencia
  static fromPersistence(props: ClientProps): Client {
    return new Client(props);
  }

  //Metodos privados de validacion
  private validateName(name: string): void {

    if (!name || name.trim().length < 2) {
      throw new Error('Client name must have at least 2 characters');
    }
    if (name.trim().length > 100) {
      throw new Error('Client name cannot exceed 100 characters');
    }
  }

  private validateTaxId(taxId: string): void {

    if (!taxId || taxId.trim().length === 0) {
      throw new Error('Tax ID cannot be empty');
    }
    //validacion basica para NIF/CIF español
    const taxIdRegex = /^[0-9]{8}[TRWAGMYFPDXBNJZSQVHLCKE]$|^[ABCDEFGHJNPQRSUVW][0-9]{7}[0-9A-J]$/;
    if (!taxIdRegex.test(taxId.trim().toUpperCase())) {
      throw new Error('Invalid Tax ID format');
    }

  }

  //Métodos de serialización
  public toJSON() {
    return {
      id: this._id.value,
      name: this._name,
      email: this._email.value,
      phone: this._phone.value,
      address: this._address,
      taxId: this._taxId,
      status: this._status,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
}

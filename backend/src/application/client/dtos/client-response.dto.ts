import { ClientStatus } from '@/domain/client';

export class ClientResponseDto {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  taxId: string;
  status: ClientStatus;
  createdAt: Date;
  updatedAt: Date;
  canCreateInvoice: boolean;

  constructor(data: {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    taxId: string;
    status: ClientStatus;
    createdAt: Date;
    updatedAt: Date;
    canCreateInvoice: boolean;
  }) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.phone = data.phone;
    this.address = data.address;
    this.taxId = data.taxId;
    this.status = data.status;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.canCreateInvoice = data.canCreateInvoice;
  }
}


/// <reference types="jest" />
import { Client, ClientProps, CreateClientProps } from './client.entity';
import { Email, Phone, ClientId } from '../value-objects';
import { ClientStatus } from '../enums';


describe('Client Entity', () => {

  describe('Factory Method', () => {
    it('should create a new client with valid data', () => {
      const name = 'Test Client';
      const emailStr = 'test@example.com';
      const phoneStr = '612345678';
      const address = '123 Test Street';
      const taxId = '12345678Z';

      // Act
      const client = Client.create({
        name,
        email: emailStr,
        phone: phoneStr,
        address,
        taxId,
      });

      // Assert
      expect(client.name).toBe(name);
      expect(client.email.value).toBe('test@example.com');
      expect(client.phone.value).toBe('+34612345678');
      expect(client.address).toBe(address);
      expect(client.taxId).toBe(taxId.toUpperCase());
      expect(client.status).toBe(ClientStatus.ACTIVE);
      expect(client.isActive()).toBe(true);
      expect(client.canCreateInvoice()).toBe(true);
    });
  });



  describe('Business Methods', () => {

    let client: Client;


    beforeEach(() => {
      client = Client.create({
        name: 'Test Client',
        email: 'test@example.com',
        phone: '612345678',
        address: '123 Test Street',
        taxId: '12345678Z',
      });
    });


    it('should activate client', () => {
      client.deactivate();
      expect(client.isActive()).toBe(false);

      client.activate();

      expect(client.isActive()).toBe(true);
      expect(client.status).toBe(ClientStatus.ACTIVE);
    });


    it('should deactivate client', () => {
        
      client.deactivate();

      expect(client.isActive()).toBe(false);
      expect(client.status).toBe(ClientStatus.INACTIVE);
    });


    it('should delete client', () => {
      client.delete();

      expect(client.status).toBe(ClientStatus.DELETED);
      expect(client.isActive()).toBe(false);
    });


    it('should not allow activation of deleted client', () => {
      client.delete();

      expect(() => client.activate()).toThrow('Cannot activate a deleted client');
    });


    it('should update personal info', () => {
      const newName = 'Updated Client';
      const newEmail = Email.fromString('updated@example.com');
      const newPhone = Phone.fromString('987654321');
      const newAddress = '456 Updated Street';

      client.updatePersonalInfo(newName, newEmail, newPhone, newAddress);

      expect(client.name).toBe(newName);
      expect(client.email.value).toBe('updated@example.com');
      expect(client.phone.value).toBe('+34987654321');
      expect(client.address).toBe(newAddress);
    });

  });



  describe('Validation', () => {

    it('should throw error for invalid name', () => {

      const props: CreateClientProps = {
        name: 'A',
        email: 'test@example.com',
        phone: '612345678',
        address: '123 Test Street',
        taxId: '12345678Z',
      };

      expect(() => 
        Client.create(props)
      ).toThrow('Client name must have at least 2 characters');
    });


    it('should throw error for invalid tax ID', () => {

      const props: CreateClientProps = {
        name: 'Test Client',
        email: 'test@example.com',
        phone: '612345678',
        address: '123 Test Street',
        taxId: 'INVALID',
      };

      expect(() => 
        Client.create(props)
      ).toThrow('Invalid Tax ID format');
    });

  });



  describe('Domain Rules', () => {
    it('should determine if client can create an invoice', () => {
      // Arrange - active client with taxId
      const props: CreateClientProps = {
        name: 'Test Client',
        email: 'test@example.com',
        phone: '612345678',
        address: 'Address',
        taxId: 'B12345678',
      };
      const client = Client.create(props);

      // Assert
      expect(client.canCreateInvoice()).toBe(true);
    });


    it('should not allow invoice creation for inactive client', () => {
      // Arrange - inactive client
      const props: CreateClientProps = {
        name: 'Test Client',
        email: 'test@example.com',
        phone: '612345678',
        address: 'Address',
        taxId: 'B12345678',
      };
      const client = Client.create(props);
      client.deactivate();

      // Assert
      expect(client.canCreateInvoice()).toBe(false);
    });

  });
  
});

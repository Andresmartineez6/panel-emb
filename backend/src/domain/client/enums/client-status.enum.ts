export enum ClientStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DELETED = 'deleted',
}

export const ClientStatusLabels = {
  [ClientStatus.ACTIVE]: 'Activo',
  [ClientStatus.INACTIVE]: 'Inactivo',
  [ClientStatus.DELETED]: 'Eliminado',
} as const;

export const ClientStatusColors = {
  [ClientStatus.ACTIVE]: 'green',
  [ClientStatus.INACTIVE]: 'yellow',
  [ClientStatus.DELETED]: 'red',
} as const;

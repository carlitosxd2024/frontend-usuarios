export interface Usuario {
  id?: number;
  usuario: string;
  cedula?: string | null;
  primerNombre: string;
  segundoNombre?: string | null;
  primerApellido: string;
  segundoApellido?: string | null;
  email: string;
  idDepartamento: number;
  idCargo: number;
  departamento?: { id: number; nombre: string };
  cargo?: { id: number; nombre: string };
}
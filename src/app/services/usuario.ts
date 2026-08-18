import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { Usuario } from '../models/usuario';
import { Departamento } from '../models/departamento';
import { Cargo } from '../models/cargo';

// La API puede devolver el array directo o envuelto en { data: [...] }.
// Este tipo cubre ambos casos sin que el componente tenga que saberlo.
type ApiResponse<T> = T[] | { data: T[] };

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private extraerArray<T>(res: ApiResponse<T>): T[] {
    if (Array.isArray(res)) {
      return res;
    }
    return res?.data ?? [];
  }

  getUsuarios(): Observable<Usuario[]> {
    return this.http
      .get<ApiResponse<Usuario>>(`${this.apiUrl}/usuarios`)
      .pipe(map(res => this.extraerArray(res)));
  }

  crearUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}/usuarios`, usuario);
  }

  actualizarUsuario(id: number, usuario: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/usuarios/${id}`, usuario);
  }

  eliminarUsuario(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/usuarios/${id}`);
  }

  getDepartamentos(): Observable<Departamento[]> {
    return this.http
      .get<ApiResponse<Departamento>>(`${this.apiUrl}/departamentos`)
      .pipe(map(res => this.extraerArray(res)));
  }

  getCargos(): Observable<Cargo[]> {
    return this.http
      .get<ApiResponse<Cargo>>(`${this.apiUrl}/cargos`)
      .pipe(map(res => this.extraerArray(res)));
  }
}
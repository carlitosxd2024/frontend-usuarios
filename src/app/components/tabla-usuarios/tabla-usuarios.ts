import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';
import { UsuarioService } from '../../services/usuario';
import { Usuario } from '../../models/usuario';
import { Departamento } from '../../models/departamento';
import { Cargo } from '../../models/cargo';
import { ModalUsuario } from '../modal-usuario/modal-usuario';
import { ModalExito } from '../modal-exito/modal-exito';
import { ModalConfirmarEliminar } from '../modal-confirmar-eliminar/modal-confirmar-eliminar';

@Component({
  selector: 'app-tabla-usuarios',
  imports: [CommonModule, FormsModule, MatTableModule, MatButtonModule, MatIconModule, MatSelectModule],
  templateUrl: './tabla-usuarios.html',
  styleUrl: './tabla-usuarios.scss',
})
export class TablaUsuarios implements OnInit {
  usuarios: Usuario[] = [];
  usuariosFiltrados: Usuario[] = [];
  departamentos: Departamento[] = [];
  cargos: Cargo[] = [];

  filtroDepartamento: number | null = null;
  filtroCargo: number | null = null;

  columnas: string[] = ['usuario', 'cedula', 'nombres', 'apellidos', 'departamento', 'cargo', 'email', 'acciones'];

  constructor(private usuarioService: UsuarioService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.usuarioService.getUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data ?? [];
        this.aplicarFiltros();
      },
      error: (err) => {
        console.error('Error al cargar usuarios:', err);
        this.usuarios = [];
        this.aplicarFiltros();
      }
    });

    this.usuarioService.getDepartamentos().subscribe({
      next: (data) => this.departamentos = data ?? [],
      error: (err) => console.error('Error al cargar departamentos:', err)
    });

    this.usuarioService.getCargos().subscribe({
      next: (data) => this.cargos = data ?? [],
      error: (err) => console.error('Error al cargar cargos:', err)
    });
  }

  aplicarFiltros(): void {
    this.usuariosFiltrados = this.usuarios.filter(u => {
      // Se compara contra el id del objeto anidado (departamento/cargo) en vez del
      // campo plano idDepartamento/idCargo, que puede no venir o venir en otro tipo.
      // El == (no ===) tolera diferencias string/number entre lo que manda la API
      // para el usuario vs lo que manda para el combo de departamentos/cargos.
      const depId = u.departamento?.id ?? u.idDepartamento;
      const carId = u.cargo?.id ?? u.idCargo;

      const pasaDepartamento = !this.filtroDepartamento || depId == this.filtroDepartamento;
      const pasaCargo = !this.filtroCargo || carId == this.filtroCargo;
      return pasaDepartamento && pasaCargo;
    });
  }

  abrirModalCrear(): void {
    const dialogRef = this.dialog.open(ModalUsuario, {
     width: '563px',
     maxWidth: 'calc(100vw - 32px)',
      data: { modo: 'crear', departamentos: this.departamentos, cargos: this.cargos }
    });
    dialogRef.afterClosed().subscribe(resultado => {
      if (resultado) this.cargarDatos();
    });
  }

  abrirModalEditar(usuario: Usuario): void {
    const dialogRef = this.dialog.open(ModalUsuario, {
      width: '600px',
      data: { modo: 'editar', usuario, departamentos: this.departamentos, cargos: this.cargos }
    });
    dialogRef.afterClosed().subscribe(resultado => {
      if (resultado) this.cargarDatos();
    });
  }

  abrirModalEliminar(usuario: Usuario): void {
    const dialogRef = this.dialog.open(ModalConfirmarEliminar, {
    width: '356px',
    maxWidth: 'calc(100vw - 32px)'
    });

    dialogRef.afterClosed().subscribe(confirmado => {
    if (!confirmado || !usuario.id) {
      return;
    }

    this.usuarioService.eliminarUsuario(usuario.id).subscribe({
      next: () => {
        this.cargarDatos();

        this.dialog.open(ModalExito, {
          width: '360px',
          maxWidth: 'calc(100vw - 32px)',
          data: {
            mensaje: 'Usuario eliminado correctamente'
          }
        });
      }
    });
  });
}
}
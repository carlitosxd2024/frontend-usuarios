import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { UsuarioService } from '../../services/usuario';
import { Usuario } from '../../models/usuario';
import { Departamento } from '../../models/departamento';
import { Cargo } from '../../models/cargo';
import { ModalExito } from '../modal-exito/modal-exito';
import { ModalInformativo } from '../modal-informativo/modal-informativo';

interface ModalUsuarioData {
  modo: 'crear' | 'editar';
  usuario?: Usuario;
  departamentos: Departamento[];
  cargos: Cargo[];
}

@Component({
  selector: 'app-modal-usuario',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './modal-usuario.html',
  styleUrl: './modal-usuario.scss'
})
export class ModalUsuario implements OnInit {
  static validarCamposObligatorios(usuario: Partial<Usuario>): string | null {
    const campos: Array<{ valor: string | number | null | undefined; mensaje: string }> = [
      { valor: usuario.cedula?.trim(), mensaje: 'La cédula es obligatoria.' },
      { valor: usuario.usuario?.trim(), mensaje: 'El campo Usuario es obligatorio.' },
      { valor: usuario.primerNombre?.trim(), mensaje: 'El campo Primer Nombre es obligatorio.' },
      { valor: usuario.primerApellido?.trim(), mensaje: 'El campo Primer Apellido es obligatorio.' },
      { valor: usuario.email?.trim(), mensaje: 'El campo Email es obligatorio.' },
      { valor: usuario.idDepartamento || 0, mensaje: 'Debe seleccionar un Departamento.' },
      { valor: usuario.idCargo || 0, mensaje: 'Debe seleccionar un Cargo.' }
    ];

    const campoFaltante = campos.find((campo) => !campo.valor || campo.valor === 0);
    return campoFaltante?.mensaje ?? null;
  }

  static esCedulaDuplicada(usuarios: Usuario[], usuarioActual?: Usuario): boolean {
    const cedulaActual = usuarioActual?.cedula?.trim().toLowerCase();

    if (!cedulaActual) {
      return false;
    }

    return usuarios.some((usuario) => {
      const cedulaRegistrada = usuario.cedula?.trim().toLowerCase();
      return cedulaRegistrada === cedulaActual && usuario.id !== usuarioActual?.id;
    });
  }

  modo: 'crear' | 'editar';
  departamentos: Departamento[];
  cargos: Cargo[];
  usuarioForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ModalUsuario>,
    private usuarioService: UsuarioService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) private data: ModalUsuarioData
  ) {
    this.modo = data.modo;
    this.departamentos = data.departamentos;
    this.cargos = data.cargos;

    this.usuarioForm = this.fb.group({
      usuario: ['', Validators.required],
      cedula: ['', Validators.required],
      primerNombre: ['', Validators.required],
      segundoNombre: [''],
      primerApellido: ['', Validators.required],
      segundoApellido: [''],
      email: ['', [Validators.required, Validators.email]],
      idDepartamento: [0, Validators.min(1)],
      idCargo: [0, Validators.min(1)]
    });
  }

  ngOnInit(): void {
    const usuarioInicial = this.modo === 'editar' && this.data.usuario
      ? {
          ...this.data.usuario,
          idDepartamento: Number(
            this.data.usuario.idDepartamento ??
            this.data.usuario.departamento?.id ??
            0
          ),
          idCargo: Number(
            this.data.usuario.idCargo ??
            this.data.usuario.cargo?.id ??
            0
          )
        }
      : {
          usuario: '',
          cedula: '',
          primerNombre: '',
          segundoNombre: '',
          primerApellido: '',
          segundoApellido: '',
          email: '',
          idDepartamento: 0,
          idCargo: 0
        };

    this.usuarioForm.patchValue(usuarioInicial);
  }

  private mostrarModalInformativo(mensaje: string): void {
    this.dialog.open(ModalInformativo, {
      width: '420px',
      maxWidth: 'calc(100vw - 28px)',
      disableClose: true,
      data: {
        titulo: 'Atención',
        mensaje
      }
    });
  }

  private obtenerUsuarioFormulario(): Usuario {
    return {
      ...this.usuarioForm.value,
      id: this.data.usuario?.id,
      usuario: this.usuarioForm.value.usuario?.trim(),
      cedula: this.usuarioForm.value.cedula?.trim(),
      primerNombre: this.usuarioForm.value.primerNombre?.trim(),
      segundoNombre: this.usuarioForm.value.segundoNombre?.trim() || null,
      primerApellido: this.usuarioForm.value.primerApellido?.trim(),
      segundoApellido: this.usuarioForm.value.segundoApellido?.trim() || null,
      email: this.usuarioForm.value.email?.trim(),
      idDepartamento: Number(this.usuarioForm.value.idDepartamento),
      idCargo: Number(this.usuarioForm.value.idCargo)
    };
  }

  guardar(): void {
    if (this.usuarioForm.invalid) {
      const mensaje = this.usuarioForm.get('usuario')?.hasError('required')
        ? 'El campo Usuario es obligatorio.'
        : this.usuarioForm.get('cedula')?.hasError('required')
          ? 'La cédula es obligatoria.'
          : this.usuarioForm.get('primerNombre')?.hasError('required')
            ? 'El campo Primer Nombre es obligatorio.'
            : this.usuarioForm.get('primerApellido')?.hasError('required')
              ? 'El campo Primer Apellido es obligatorio.'
              : this.usuarioForm.get('email')?.hasError('required')
                ? 'El campo Email es obligatorio.'
                : this.usuarioForm.get('email')?.hasError('email')
                  ? 'Debe ingresar un email válido.'
                  : this.usuarioForm.get('idDepartamento')?.hasError('min')
                    ? 'Debe seleccionar un Departamento.'
                    : 'Debe seleccionar un Cargo.';

      this.mostrarModalInformativo(mensaje);
      return;
    }

    const usuario = this.obtenerUsuarioFormulario();

    this.usuarioService.getUsuarios().subscribe({
      next: (usuarios) => {
        const existeDuplicado = ModalUsuario.esCedulaDuplicada(usuarios, usuario);

        if (existeDuplicado) {
          this.mostrarModalInformativo('La cédula ingresada ya existe en el sistema. Verifique los datos antes de continuar.');
          return;
        }

        if (this.modo === 'crear') {
          this.usuarioService.crearUsuario(usuario).subscribe({
            next: () => {
              this.dialogRef.close(true);

              this.dialog.open(ModalExito, {
                width: '360px',
                maxWidth: 'calc(100vw - 32px)',
                data: {
                  mensaje: 'Usuario creado exitosamente'
                }
              });
            },
            error: (error) => {
              console.error('ERROR AL CREAR USUARIO:', error);
              this.mostrarModalInformativo('No se pudo crear el usuario. Revise los datos e intente nuevamente.');
            }
          });

          return;
        }

        if (usuario.id) {
          this.usuarioService.actualizarUsuario(usuario.id, usuario).subscribe({
            next: () => {
              this.dialogRef.close(true);

              this.dialog.open(ModalExito, {
                width: '360px',
                maxWidth: 'calc(100vw - 32px)',
                data: {
                  mensaje: 'Usuario actualizado exitosamente'
                }
              });
            },
            error: (error) => {
              console.error('ERROR AL ACTUALIZAR USUARIO:', error);
              this.mostrarModalInformativo('No se pudo actualizar el usuario. Revise los datos e intente nuevamente.');
            }
          });
        }
      },
      error: () => {
        this.mostrarModalInformativo('No se pudo validar la cédula en este momento. Intente nuevamente.');
      }
    });
  }

  cancelar(): void {
    this.dialogRef.close(false);
  }
}
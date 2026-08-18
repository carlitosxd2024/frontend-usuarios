import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

interface ModalInformativoData {
  titulo: string;
  mensaje: string;
}

const MODAL_INFORMATIVO_TEMPLATE = `
<div class="modal-informativo">
  <div class="icono-advertencia">
    <mat-icon>warning</mat-icon>
  </div>

  <h2>{{ data.titulo }}</h2>

  <p>{{ data.mensaje }}</p>

  <button
    class="btn-aceptar"
    type="button"
    (click)="cerrar()">
    Aceptar
  </button>
</div>
`;

const MODAL_INFORMATIVO_STYLES = `
:host {
  display: block;
}

.modal-informativo {
  width: 100%;
  box-sizing: border-box;

  padding: 28px 30px 24px;

  text-align: center;

  font-family: Roboto, Arial, sans-serif;
  background: linear-gradient(180deg, #fffaf0 0%, #fffdf7 100%);
}

.icono-advertencia {
  width: 52px;
  height: 52px;

  margin: 0 auto 14px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;

  background: #fef3c7;
  color: #b45309;
  box-shadow: inset 0 0 0 1px rgba(180, 83, 9, 0.12);
}

.icono-advertencia mat-icon {
  width: 26px;
  height: 26px;

  font-size: 26px;
}

h2 {
  margin: 0 0 10px;

  font-size: 17px;
  font-weight: 700;

  color: #78350f;
}

p {
  margin: 0 0 22px;

  font-size: 13px;
  line-height: 20px;

  color: #7c2d12;
}

.btn-aceptar {
  height: 38px;
  min-width: 96px;

  padding: 0 18px;

  border: none;
  border-radius: 6px;

  background: #f59e0b;
  color: #fff;

  font-family: Roboto, Arial, sans-serif;
  font-size: 13px;
  font-weight: 600;

  cursor: pointer;
  transition: background 0.2s ease;
}

.btn-aceptar:hover {
  background: #d97706;
}
`;

@Component({
  selector: 'app-modal-informativo',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
  template: MODAL_INFORMATIVO_TEMPLATE,
  styles: [MODAL_INFORMATIVO_STYLES]
})
export class ModalInformativo {
  constructor(
    private dialogRef: MatDialogRef<ModalInformativo>,
    @Inject(MAT_DIALOG_DATA) public data: ModalInformativoData
  ) {}

  cerrar(): void {
    this.dialogRef.close();
  }
}

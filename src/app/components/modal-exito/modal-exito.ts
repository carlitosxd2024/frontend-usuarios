import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

interface ModalExitoData {
  mensaje: string;
}

@Component({
  selector: 'app-modal-exito',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './modal-exito.html',
  styleUrl: './modal-exito.scss'
})
export class ModalExito {
  constructor(
    private dialogRef: MatDialogRef<ModalExito>,
    @Inject(MAT_DIALOG_DATA) public data: ModalExitoData
  ) {}

  cerrar(): void {
    this.dialogRef.close();
  }
}
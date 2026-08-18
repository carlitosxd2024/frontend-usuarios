import { Component } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-modal-confirmar-eliminar',
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './modal-confirmar-eliminar.html',
  styleUrl: './modal-confirmar-eliminar.scss',
})
export class ModalConfirmarEliminar {
  constructor(private dialogRef: MatDialogRef<ModalConfirmarEliminar>) {}

  confirmar(): void {
    this.dialogRef.close(true);
  }

  cancelar(): void {
    this.dialogRef.close(false);
  }
}
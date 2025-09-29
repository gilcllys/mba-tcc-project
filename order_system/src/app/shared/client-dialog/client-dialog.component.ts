import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ClientModel } from '../../models/client.model';
import { ToastrService } from 'ngx-toastr';
import { ClientService } from '../../service/client.service';

export interface DialogData {
  data: ClientModel;
}

@Component({
  selector: 'app-client-dialog',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
  ],
  templateUrl: './client-dialog.component.html',
  styleUrl: './client-dialog.component.scss'
})
export class ClientDialogComponent {
  readonly dialogRef = inject(MatDialogRef<ClientDialogComponent>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  client: ClientModel = this.data.data;
  clientForm!: FormGroup;

  constructor(
    private clientService: ClientService,
    private toastr: ToastrService
  ) {

  }

  ngOnInit(): void {
    this.clientForm = new FormGroup({
      "name": new FormControl('', Validators.required),
      "email": new FormControl('', [Validators.required, Validators.email])
    });
    this.feedForm();
  }


  onNoClick(): void {
    this.dialogRef.close();
  }

  feedForm(): void {
    this.clientForm.patchValue({
      name: this.client.name,
      email: this.client.email
    });
  }

  save(): void {
    if (this.clientForm.valid) {
      const updatedClient: ClientModel = {
        id: this.client.id,
        name: this.clientForm.value.name,
        email: this.clientForm.value.email
      };

      this.clientService.update(updatedClient.id!, updatedClient).subscribe({
        next: () => {
          this.toastr.success('Cliente atualizado com sucesso!', 'Sucesso', {
            closeButton: true,
            progressBar: true,
            timeOut: 3000,
          });
          this.dialogRef.close();
        },
        error: (error) => {
          console.error('Erro ao atualizar cliente:', error);
          this.toastr.error(error, 'Error', {
            closeButton: true,
            progressBar: true,
            timeOut: 3000,
          });
        }
      });
    }
  }

}

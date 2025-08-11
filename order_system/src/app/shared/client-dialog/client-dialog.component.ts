import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ClientModel } from '../../models/client.model';

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
      this.dialogRef.close(updatedClient);
    }
  }

}

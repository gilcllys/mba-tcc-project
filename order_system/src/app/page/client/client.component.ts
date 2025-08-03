import { Component, inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClientService } from '../../service/client.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-client',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  templateUrl: './client.component.html',
  styleUrl: './client.component.scss'
})
export class ClientComponent implements OnInit {
  clientForm!: FormGroup;
  private _snackBar = inject(MatSnackBar);

  constructor(private clientService: ClientService) { }

  ngOnInit(): void {
    this.clientForm = new FormGroup({
      "name": new FormControl('', Validators.required),
      "email": new FormControl('', [Validators.required, Validators.email])
    });
  }

  salvar() {
    if (this.clientForm.valid) {
      const clientData = this.clientForm.value;
      console.log('Dados do cliente:', this.clientForm.value);
      this._snackBar.open(
        "Criado com  sucesso",
        "Fechar",
        {
          duration: 3000,
          horizontalPosition: 'center',
          panelClass: ['snack-bar-success'],

        }

      );
      // this.clientService.create(clientData).subscribe({
      //   next: (response) => {
      //     console.log('Cliente criado com sucesso:', response);
      //     this.clientForm.reset();
      //   },
      //   error: (error) => {
      //     console.error('Erro ao criar cliente:', error);
      //   }
      // });
    } else {
      console.warn('Formulário inválido');
    }
  }

}

import { Component, inject, OnInit, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClientService } from '../../service/client.service';
import { ToastrService } from 'ngx-toastr';
import { ClientModel } from '../../models/client.model';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import {
  MatDialog,
} from '@angular/material/dialog';
import { ClientDialogComponent } from '../../shared/client-dialog/client-dialog.component';
import { get } from 'http';

@Component({
  selector: 'app-client',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatMenuModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
    MatTableModule,
  ],
  templateUrl: './client.component.html',
  styleUrl: './client.component.scss'
})
export class ClientComponent implements OnInit, AfterViewInit {
  clientForm!: FormGroup;
  displayedColumns: string[] = ['id', 'nome', 'email', 'action'];
  dataSource: ClientModel[] = [];
  readonly dialog = inject(MatDialog);

  constructor(
    private clientService: ClientService,
    private toastr: ToastrService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit(): void {
    // Só carrega dados inicialmente se não estiver no SSR
    if (isPlatformBrowser(this.platformId)) {
      this.getAllClients();
    }
    
    this.clientForm = new FormGroup({
      "name": new FormControl('', Validators.required),
      "email": new FormControl('', [Validators.required, Validators.email])
    });
  }

  ngAfterViewInit(): void {
    // Garante que os dados sejam carregados no browser após a view estar pronta
    if (isPlatformBrowser(this.platformId)) {
      // Pequeno delay para garantir que o DOM esteja estável
      setTimeout(() => {
        if (this.dataSource.length === 0) {
          this.getAllClients();
        }
      }, 100);
    }
  }

  getAllClients() {
    this.clientService.getAll().subscribe({
      next: (clients) => {
        this.dataSource = clients;
      },
      error: (error) => {
        console.error('Erro ao obter clientes:', error);
        this.toastr.error('Erro ao obter clientes', 'Error', {
          closeButton: true,
          progressBar: true,
          timeOut: 3000,
        });
      }
    });
  }

  cancelar(): void {
    this.clientForm.reset();
  }

  salvar() {
    if (this.clientForm.valid) {
      const clientData = this.clientForm.value;
      console.log('Dados do cliente:', this.clientForm.value);
      this.clientService.create(clientData).subscribe({
        next: (response) => {
          console.log('Cliente criado com sucesso:', response);
          this.clientForm.reset();
          this.toastr.success('Cliente criado com sucesso !', 'Salvo sucesso', {
            closeButton: true,
            progressBar: true,
            timeOut: 3000,
          });
          this.getAllClients();
        },
        error: (error) => {
          this.toastr.error(error, 'Error ao criar cliente', {
            closeButton: true,
            progressBar: true,
            timeOut: 3000,
          });
        }
      });
    } else {
      console.warn('Formulário inválido');
      this.toastr.error('Todos os campos precisam ser preenchidos!', 'Error ao criar cliente', {
        closeButton: true,
        progressBar: true,
        timeOut: 3000,
      });

    }
  }

  excluir(id: number) {
    this.clientService.delete(id).subscribe({
      next: () => {
        this.toastr.success('Cliente excluído com sucesso!', 'Sucesso', {
          closeButton: true,
          progressBar: true,
          timeOut: 3000,
        });
        this.getAllClients();
      },
      error: (error) => {
        console.error('Erro ao excluir cliente:', error);
        this.toastr.error(error, 'Error', {
          closeButton: true,
          progressBar: true,
          timeOut: 3000,
        });
      }
    });
  }

  editar(client: ClientModel): void {
    const dialogRef = this.dialog.open(ClientDialogComponent, {
      data: { data: client },
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getAllClients();
    });
  }
}

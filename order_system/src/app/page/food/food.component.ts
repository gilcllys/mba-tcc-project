import { Component, inject, OnInit, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { OrderItemService } from '../../service/order-item.service';
import { ToastrService } from 'ngx-toastr';
import { OrderItemModel } from '../../models/order_item.model';
import { OrderItemDialogComponent } from '../../shared/order-item-dialog/order-item-dialog.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-food',
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
  templateUrl: './food.component.html',
  styleUrl: './food.component.scss'
})
export class FoodComponent implements OnInit, AfterViewInit {
  orderItemForm!: FormGroup;
  displayedColumns: string[] = ['id', 'nome', 'preco', 'action'];
  dataSource: OrderItemModel[] = [];
  readonly dialog = inject(MatDialog);

  constructor(
    private orderItemService: OrderItemService,
    private toastr: ToastrService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit(): void {
    // Só carrega dados inicialmente se não estiver no SSR
    if (isPlatformBrowser(this.platformId)) {
      this.getAllOrderItens();
    }
    
    this.orderItemForm = new FormGroup({
      "item_name": new FormControl('', Validators.required),
      "price": new FormControl('', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)])
    });
  }

  ngAfterViewInit(): void {
    // Garante que os dados sejam carregados no browser após a view estar pronta
    if (isPlatformBrowser(this.platformId)) {
      // Pequeno delay para garantir que o DOM esteja estável
      setTimeout(() => {
        if (this.dataSource.length === 0) {
          this.getAllOrderItens();
        }
      }, 100);
    }
  }

  cancelar() {
    this.orderItemForm.reset();
  }


  getAllOrderItens() {
    this.orderItemService.getAll().subscribe({
      next: (order_item) => {
        this.dataSource = order_item;
      },
      error: (error) => {
        this.toastr.error('Erro ao obter itens do menu', 'Error', {
          closeButton: true,
          progressBar: true,
          timeOut: 3000,
        });
      }
    });
  }

  salvar() {
    if (this.orderItemForm.valid) {
      const orderItemData = this.orderItemForm.value;
      this.orderItemService.create(orderItemData).subscribe({
        next: (response) => {
          this.orderItemForm.reset();
          this.toastr.success('Item do menu salvo!', 'Salvo sucesso', {
            closeButton: true,
            progressBar: true,
            timeOut: 3000,
          });
          this.getAllOrderItens();
        },
        error: (error) => {
          this.toastr.error(error, 'Error ao salva item do menu', {
            closeButton: true,
            progressBar: true,
            timeOut: 3000,
          });
        }
      });
    } else {
      console.warn('Formulário inválido');
      this.toastr.error('Todos os campos precisam ser preenchidos!', 'Error ao criar item do menu', {
        closeButton: true,
        progressBar: true,
        timeOut: 3000,
      });

    }
  }

  excluir(id: number) {
    this.orderItemService.delete(id).subscribe({
      next: () => {
        this.toastr.success('Cliente excluído com sucesso!', 'Sucesso', {
          closeButton: true,
          progressBar: true,
          timeOut: 3000,
        });
        this.getAllOrderItens();
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

  editar(order_item: OrderItemModel): void {
    const dialogRef = this.dialog.open(OrderItemDialogComponent, {
      data: { data: order_item },
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getAllOrderItens();
    });
  }

}

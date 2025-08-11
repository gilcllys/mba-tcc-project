import { Component } from '@angular/core';
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
export class FoodComponent {
  orderItemForm!: FormGroup;
  displayedColumns: string[] = ['id', 'nome', 'preco', 'action'];
  dataSource: OrderItemModel[] = [];

  constructor(
    private orderItemService: OrderItemService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.getAllOrderItens();
    this.orderItemForm = new FormGroup({
      "item_name": new FormControl('', Validators.required),
      "price": new FormControl('', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)])
    });
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
      console.log('Dados do cliente:', this.orderItemForm.value);
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

}

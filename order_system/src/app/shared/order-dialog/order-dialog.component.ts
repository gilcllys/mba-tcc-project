import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatOptionModule } from '@angular/material/core';
import { AsyncPipe, NgFor } from '@angular/common';
import { Observable, map, startWith } from 'rxjs';
import { OrderModel } from '../../models/order.model';
import { ClientModel } from '../../models/client.model';
import { OrderItemModel } from '../../models/order_item.model';
import { ToastrService } from 'ngx-toastr';
import { OrderClientService } from '../../service/order-client.service';

export interface OrderDialogData {
  data: OrderModel;
  clientes: ClientModel[];
  menuItems: OrderItemModel[];
}

@Component({
  selector: 'app-order-dialog',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatOptionModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    AsyncPipe,
    NgFor,
  ],
  templateUrl: './order-dialog.component.html',
  styleUrl: './order-dialog.component.scss'
})
export class OrderDialogComponent {
  readonly dialogRef = inject(MatDialogRef<OrderDialogComponent>);
  readonly data = inject<OrderDialogData>(MAT_DIALOG_DATA);

  orderForm!: FormGroup;
  filteredClientes!: Observable<ClientModel[]>;
  filteredItems!: Observable<OrderItemModel[]>;

  constructor(
    private orderClientService: OrderClientService,
    private toastr: ToastrService
  ) {
    this.initForm();
    this.setupAutocompletes();
  }

  private initForm(): void {
    // Encontrar os objetos completos baseados nos IDs
    const selectedClient = this.data.clientes.find(c => c.id === this.data.data.client_id);
    const selectedItem = this.data.menuItems.find(i => i.id === this.data.data.order_item_id);

    // Debug logs para verificar os dados
    console.log('OrderModel data:', this.data.data);
    console.log('Client ID buscado:', this.data.data.client_id);
    console.log('Order ID buscado:', this.data.data.order_item_id);
    console.log('Cliente encontrado:', selectedClient);
    console.log('Item encontrado:', selectedItem);
    console.log('Lista de clientes:', this.data.clientes);
    console.log('Lista de itens do menu:', this.data.menuItems);

    this.orderForm = new FormGroup({
      "client": new FormControl(selectedClient || '', Validators.required),
      "order_item": new FormControl(selectedItem || '', [Validators.required]),
      "quantity": new FormControl(this.data.data.quantity || '', [Validators.required, Validators.min(1)]),
    });
  }

  private setupAutocompletes(): void {
    this.filteredClientes = this.orderForm.get('client')!.valueChanges.pipe(
      startWith(this.orderForm.get('client')?.value || ''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.name;
        return name ? this._filterClientes(name as string) : this.data.clientes.slice();
      }),
    );

    this.filteredItems = this.orderForm.get('order_item')!.valueChanges.pipe(
      startWith(this.orderForm.get('order_item')?.value || ''),
      map(value => {
        const itemName = typeof value === 'string' ? value : value?.item_name;
        return itemName ? this._filterItems(itemName as string) : this.data.menuItems.slice();
      }),
    );
  }

  private _filterClientes(name: string): ClientModel[] {
    const filterValue = name.toLowerCase();
    return this.data.clientes.filter(cliente =>
      cliente.name.toLowerCase().includes(filterValue)
    );
  }

  private _filterItems(name: string): OrderItemModel[] {
    const filterValue = name.toLowerCase();
    return this.data.menuItems.filter(item =>
      item.item_name.toLowerCase().includes(filterValue)
    );
  }

  displayClientFn = (client: ClientModel): string => {
    return client && client.name ? client.name : '';
  }

  displayItemFn = (item: OrderItemModel): string => {
    return item && item.item_name ? item.item_name : '';
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  salvar(): void {
    if (this.orderForm.valid) {
      const updatedOrder: OrderModel = {
        id: this.data.data.id,
        client_id: this.orderForm.get('client')?.value.id,
        order_item_id: this.orderForm.get('order_item')?.value.id,
        quantity: this.orderForm.get('quantity')?.value,
      };

      this.orderClientService.update(updatedOrder.id!, updatedOrder).subscribe({
        next: (response) => {
          this.toastr.success('Pedido atualizado com sucesso!', 'Sucesso', {
            closeButton: true,
            progressBar: true,
            timeOut: 3000,
          });
          this.dialogRef.close(true);
        },
        error: (error) => {
          this.toastr.error('Erro ao atualizar pedido', 'Erro', {
            closeButton: true,
            progressBar: true,
            timeOut: 3000,
          });
        }
      });
    }
  }
}
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogTitle, MatDialogContent, MatDialogActions, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { OrderItemModel } from '../../models/order_item.model';
import { ClientModel } from '../../models/client.model';
import { ToastrService } from 'ngx-toastr';
import { OrderItemService } from '../../service/order-item.service';
export interface DialogData {

  data: OrderItemModel;
}

@Component({
  selector: 'app-order-item-dialog',
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
  templateUrl: './order-item-dialog.component.html',
  styleUrl: './order-item-dialog.component.scss'
})
export class OrderItemDialogComponent {
  readonly dialogRef = inject(MatDialogRef<OrderItemDialogComponent>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  order_item: OrderItemModel = this.data.data;
  orderItemForm!: FormGroup;

  constructor(
    private orderItemService: OrderItemService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.orderItemForm = new FormGroup({
      "item_name": new FormControl('', Validators.required),
      "price": new FormControl('', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)])
    });
    this.feedForm();
  }


  onNoClick(): void {
    this.orderItemForm.reset();
    this.dialogRef.close();
  }

  feedForm(): void {
    this.orderItemForm.patchValue({
      item_name: this.order_item.item_name,
      price: this.order_item.price
    });
  }

  save(): void {
    console.log('Dados do item:', this.orderItemForm.valid);
    if (this.orderItemForm.valid) {
      const updatedorder_item: OrderItemModel = {
        id: this.order_item.id,
        item_name: this.orderItemForm.value.item_name,
        price: this.orderItemForm.value.price
      };
      this.orderItemService.update(updatedorder_item.id!, updatedorder_item).subscribe({
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
          this.dialogRef.close();
        }
      });
    }
  }

}

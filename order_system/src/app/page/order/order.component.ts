import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCard, MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from "@angular/material/input";
import { MatMenuModule } from '@angular/material/menu';
import { OrderItemService } from '../../service/order-item.service';
import { ClientService } from '../../service/client.service';

@Component({
  selector: 'app-order',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatMenuModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss'
})
export class OrderComponent {
  constructor(
    private orderItemService: OrderItemService,
    private clientService: ClientService,
  ) { }
  orderForm!: FormGroup;

  ngOnInit(): void {
    this.orderForm = new FormGroup({
      "client": new FormControl('', Validators.required),
      "order_item": new FormControl('', [Validators.required]),
      "quantity": new FormControl('', [Validators.required]),
    });
  }
}

import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { BaseService } from '../core/user-base.service';
import { HttpClient } from '@angular/common/http';
import { ClientModel } from '../models/client.model';
import { catchError } from 'rxjs';
import { OrderModel } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class ClientService extends BaseService<ClientModel> {

  constructor(http: HttpClient, @Inject(PLATFORM_ID) platformId: Object) {
    // Corrige a URL base para incluir a porta corretamente e um endpoint mais comum
    super(http, 'users/client', '8000', '', platformId);
  }

  autoCOmpleteUsers(name: string) {
    return this.http.post<any>(`${this.entityUrl}/auto_complete_users/?name=${name}`, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );;
  }

  makeOrder(order: OrderModel) {
    // Converte order_id para order_item_id conforme esperado pela API
    const orderData = {
      client_id: order.client_id,
      order_item_id: order.order_item_id, // API espera order_item_id
      quantity: order.quantity
    };

    return this.http.post<any>(
      `${this.entityUrl}/fazer_pedido/`,
      orderData,
      this.httpOptions
    )
      .pipe(
        catchError(this.handleError)
      );
  }
}

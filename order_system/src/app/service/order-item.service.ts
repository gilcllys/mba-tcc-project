import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { BaseService } from '../core/user-base.service';
import { OrderItemModel } from '../models/order_item.model';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderItemService extends BaseService<OrderItemModel> {

  constructor(http: HttpClient, @Inject(PLATFORM_ID) platformId: Object) {
    // Corrige a URL base para incluir a porta corretamente e um endpoint mais comum
    super(http, 'order/order_item', '8081', '', platformId);
  }

  autoCompleteOrderItems(name: string) {
    return this.http.post<any>(`${this.entityUrl}/auto_complete_order_items/?name=${name}`, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );;
  }
}

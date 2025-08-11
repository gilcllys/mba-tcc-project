import { Injectable } from '@angular/core';
import { BaseService } from '../core/user-base.service';
import { OrderItemModel } from '../models/order_item.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OrderItemService extends BaseService<OrderItemModel> {

  constructor(http: HttpClient) {
    // Corrige a URL base para incluir a porta corretamente e um endpoint mais comum
    super(http, 'order/order_item', '8081');
  }
}

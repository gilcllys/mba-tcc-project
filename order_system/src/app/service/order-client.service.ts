import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { OrderModel } from '../models/order.model';
import { BaseService } from '../core/user-base.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OrderClientService extends BaseService<OrderModel> {

  constructor(http: HttpClient, @Inject(PLATFORM_ID) platformId: Object) {
    // Corrige a URL base para incluir a porta corretamente e um endpoint mais comum
    super(http, 'order/order_client', '8081', '', platformId);
  }
}

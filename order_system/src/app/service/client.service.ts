import { Injectable } from '@angular/core';
import { BaseService } from '../core/user-base.service';
import { HttpClient } from '@angular/common/http';
import { ClientModel } from '../models/client.model';

@Injectable({
  providedIn: 'root'
})
export class ClientService extends BaseService<ClientModel> {

  constructor(http: HttpClient) {
    // Corrige a URL base para incluir a porta corretamente e um endpoint mais comum
    super(http, 'users/client', '8000');
  }
}

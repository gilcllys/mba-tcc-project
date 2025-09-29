import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCard, MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from "@angular/material/input";
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatTableDataSource } from '@angular/material/table';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatOptionModule } from '@angular/material/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AsyncPipe, NgFor } from '@angular/common';
import { Observable, map, startWith } from 'rxjs';
import { OrderItemService } from '../../service/order-item.service';
import { ClientService } from '../../service/client.service';
import { OrderItemModel } from '../../models/order_item.model';
import { ClientModel } from '../../models/client.model';
import { ToastrService } from 'ngx-toastr';
import { OrderModel } from '../../models/order.model';
import { OrderClientService } from '../../service/order-client.service';
import { OrderDialogComponent } from '../../shared/order-dialog/order-dialog.component';

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
    MatTableModule,
    MatAutocompleteModule,
    MatOptionModule,
    MatDialogModule,
    AsyncPipe,
    NgFor,
  ],
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss'
})
export class OrderComponent implements OnInit, OnDestroy {
  orderForm!: FormGroup;
  dataSource = new MatTableDataSource<OrderModel>([]);
  displayedColumns: string[] = ['id', 'cliente', 'item', 'quantidade', 'action'];
  orders: OrderModel[] = [];
  clientes: ClientModel[] = [];
  nextId = 1;

  // Autocomplete data

  menuItems: OrderItemModel[] = [];

  filteredClientes!: Observable<ClientModel[]>;
  filteredItems!: Observable<OrderItemModel[]>;
  readonly dialog = inject(MatDialog);

  private routerSubscription!: Subscription;
  private focusListener?: () => void;

  constructor(
    private orderItemService: OrderItemService,
    private clientService: ClientService,
    private orderClientService: OrderClientService,
    private toastr: ToastrService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.orderForm = new FormGroup({
      "client": new FormControl('', Validators.required),
      "order_item": new FormControl('', [Validators.required]),
      "quantity": new FormControl('', [Validators.required, Validators.min(1)]),
    });

    // Carrega dados iniciais
    this.loadData();

    // Subscreve às mudanças de navegação para recarregar dados
    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      filter(() => this.activatedRoute.snapshot.routeConfig?.path === 'order')
    ).subscribe(() => {
      // Recarrega os dados dos dropdowns sempre que navegar para esta rota
      this.loadData();
    });

    // Adiciona listener para recarregar quando o usuário voltar para a aba
    this.focusListener = () => {
      // Pequeno delay para garantir que a navegação foi completada
      setTimeout(() => {
        this.loadData();
      }, 100);
    };
    
    if (typeof window !== 'undefined') {
      window.addEventListener('focus', this.focusListener);
    }
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
    
    if (this.focusListener && typeof window !== 'undefined') {
      window.removeEventListener('focus', this.focusListener);
    }
  }

  private loadData(): void {
    console.log('🔄 Recarregando dados dos dropdowns...');
    this.getAllClients();
    this.getAllMenuItems();
    this.getAllClientsOrder();
  }

  // Método público para recarregar dados manualmente
  refreshData(): void {
    this.loadData();
  }

  private setupAutocompletes(): void {
    console.log('🔧 Configurando autocompletes com dados:', {
      clientes: this.clientes.length,
      menuItems: this.menuItems.length
    });

    this.filteredClientes = this.orderForm.get('client')!.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.name;
        return name ? this._filterClientes(name as string) : this.clientes.slice();
      }),
    );

    this.filteredItems = this.orderForm.get('order_item')!.valueChanges.pipe(
      startWith(''),
      map(value => {
        const itemName = typeof value === 'string' ? value : value?.item_name;
        return itemName ? this._filterItems(itemName as string) : this.menuItems.slice();
      }),
    );
  }

  getAllClients(): void {
    this.clientService.getAll().subscribe({
      next: (clients) => {
        if(clients.length > 0){
          console.log('✅ Clientes carregados:', clients);
          this.clientes = clients;
          this.setupAutocompletes(); // Reconfigura após carregar dados
        }else{
          this.toastr.warning('Sem clientes', 'Alerta', {
            closeButton: true,
            progressBar: true,
            timeOut: 3000,
          });
        }
      },
      error: (error) => {
        console.error('Erro ao obter clientes:', error);
        this.toastr.error('Erro ao obter clientes', 'Error', {
          closeButton: true,
          progressBar: true,
          timeOut: 3000,
          tapToDismiss: true,
          disableTimeOut: false
        });
      }
    });
  }

  getAllMenuItems(): void {
    this.orderItemService.getAll().subscribe({
      next: (items) => {
        if(items.length > 0){
          console.log('✅ Itens do menu carregados:', items);
          this.menuItems = items;
          this.setupAutocompletes(); // Reconfigura após carregar dados
        }else{
          this.toastr.warning('Sem itens do menu', 'Alerta', {
            closeButton: true,
            progressBar: true,
            timeOut: 3000,
          });
        }
      },
      error: (error) => {
        console.error('Erro ao obter itens do menu:', error);
        this.toastr.error('Erro ao obter itens do menu', 'Error', {
          closeButton: true,
          progressBar: true,
          timeOut: 3000,
          tapToDismiss: true,
          disableTimeOut: false
        });
      }
    });
  }

  getAllClientsOrder():void {
    this.orderClientService.getAll().subscribe({
      next: (orders) =>
      {
        if(orders.length > 0){
          this.dataSource.data = orders
        }
        else{
          this.toastr.warning('Sem pedidos', 'Alerta', {
            closeButton: true,
            progressBar: true,
            timeOut: 3000,
          });
        }
      },
      error: (error) => {
        console.error('Erro ao obter pedidos dos clientes:', error);
        this.toastr.error('Erro ao obter pedidos dos clientes', 'Error', {
          closeButton: true,
          progressBar: true,
          timeOut: 3000,
          tapToDismiss: true,
          disableTimeOut: false
        });
      }
    })
  }

  salvar(): void {
    if (this.orderForm.valid) {
      const newOrder: OrderModel = {
        client_id : this.orderForm.get('client')?.value.id,
        order_item_id: this.orderForm.get('order_item')?.value.id,
        quantity: this.orderForm.get('quantity')?.value,
      };
      this.clientService.makeOrder(newOrder).subscribe({
        next: (value) => {
          if(value){
            this.orderForm.reset();
            this.toastr.success('Pedido criado com sucesso !', 'Salvo sucesso', {
              closeButton: true,
              progressBar: true,
              timeOut: 3000,
            });
            this.getAllClientsOrder();
          }
        },
        error: (err) => {
          this.toastr.error(err, 'Error ao criar pedido', {
            closeButton: true,
            progressBar: true,
            timeOut: 3000,
          });
        },
      })
      console.log('Pedido salvo:', newOrder);
    }
  }

  cancelar(): void {
    this.orderForm.reset();
  }

  editar(order: OrderModel): void {
    const dialogRef = this.dialog.open(OrderDialogComponent, {
      data: {
        data: order,
        clientes: this.clientes,
        menuItems: this.menuItems
      },
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getAllClientsOrder();
      }
    });
  }

  excluir(id: number): void {
    this.orderClientService.delete(id).subscribe({
      next:(value) => {
        this.toastr.success('Pedido excluído com sucesso !', 'Exclusão sucesso', {
          closeButton: true,
          progressBar: true,
          timeOut: 3000,
        });
        this.getAllClientsOrder();
      },
      error:(err) => {
        this.toastr.error(err, 'Error ao excluir pedido', {
          closeButton: true,
          progressBar: true,
          timeOut: 3000,
        });
      }
    });
  }


  // Autocomplete filter methods
  private _filterClientes(name: string): ClientModel[] {
    const filterValue = name.toLowerCase();
    return this.clientes.filter(cliente =>
      cliente.name.toLowerCase().includes(filterValue)
    );
  }

  private _filterItems(name: string): OrderItemModel[] {
    const filterValue = name.toLowerCase();
    return this.menuItems.filter(item =>
      item.item_name.toLowerCase().includes(filterValue)
    );
  }

  // Display functions for autocomplete
  displayClientFn = (client: ClientModel): string => {
    return client && client.name ? client.name : '';
  }

  displayItemFn = (item: OrderItemModel): string => {
    return item && item.item_name ? item.item_name : '';
  }

  // Função específica para converter client_id em nome do cliente
  getClientName(clientId: number): string {
    const cliente = this.clientes.find(c => c.id === clientId);
    return cliente ? cliente.name : `Cliente ID: ${clientId}`;
  }

  // Função específica para converter order_id em nome do item
  getItemName(orderId: number): string {
    const item = this.menuItems.find(i => i.id === orderId);
    return item ? item.item_name : `Item ID: ${orderId}`;
  }
}

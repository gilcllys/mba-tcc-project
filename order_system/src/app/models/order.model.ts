export class OrderModel {
  id?: number;
  client_id: number;
  order_item_id: number;
  quantity:number

  constructor(client_id: number, order_item_id: number, quantity:number, id: number) {
    this.id = id;
    this.client_id = client_id;
    this.order_item_id = order_item_id;
    this.quantity = quantity;
  }
}
export class OrderItemModel {
  id?: number;
  item_name: string;
  price: number;

  constructor(item_name: string, price: number, id: number,) {
    this.id = id;
    this.item_name = item_name;
    this.price = price;
  }
}

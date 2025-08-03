export class ClientModel {
  id?: number;
  name: string;
  email: string;

  constructor(name: string, email: string, id: number,) {
    this.id = id;
    this.name = name;
    this.email = email;
  }
}

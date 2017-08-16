export class Account {
  public invoices: any;

  constructor(
    public id: number,
    public email: string,
    public role: string,
    public isAgent: boolean
  ) {}
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UnsubscriberComponent } from '../core';
import { Account } from '../account/account';
import { AccountService } from '../account/account.service';
import { InventoryService } from '../inventory';

@Component({
    selector: 'tradera-welcome',
    providers: [
        InventoryService
    ],
    template: require('./welcome.component.html')
})
export class TraderaWelcomeComponent extends UnsubscriberComponent implements OnInit {
    public account: Account;

    public constructor(
        private _accountService: AccountService,
        private _inventoryService: InventoryService,
        private _router: Router
    ) {
      super();
    }

    ngOnInit() {
      this.subscriptions.push(
        this._accountService.account$.subscribe(account => this.account = account));
      this._accountService.getAccount();
    }

    createFirstProduct() {
        this._inventoryService
            .addProduct({ folder: this._inventoryService.currentFolder })
            .subscribe((product) => {
                this._router.navigateByUrl(`/inventory/edit/${product.id}`);
            });
    }
}

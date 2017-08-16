import { Component, OnInit }                   from '@angular/core';

import { Angulartics2GoogleAnalytics }         from 'angulartics2/src/providers/angulartics2-google-analytics';

import { UnsubscriberComponent }               from '../core';
import { AccountService }                      from '../account/account.service';
import { Account }                             from '../account/account';

@Component({
    selector: '[user-menu]',
    providers: [],
    template: require('./user-menu.component.html')
})
export class UserMenuComponent extends UnsubscriberComponent implements OnInit {
    public account: Account = null;
    private errorMessage;

    constructor(
        private _accountService: AccountService,
        private _analytics: Angulartics2GoogleAnalytics
    ) {
        super();
    }

    allowed(route) {
        if (this.account === null) {
            return false;
        } else {
            if (route === 'account.invoices' && (this.account.role === 'leader' || this.account.role === 'admin')) {
                return true;
            } else {
                return false;
            }
        }
    }

    logout() {
        this._accountService.logout();
    }

    ngOnInit() {
        // Subscribe to data, then run get() to make sure it's fetched
        this.subscriptions.push(this._accountService.account$.subscribe(account => this.account = account));
        this._accountService.getAccount();
    }
}

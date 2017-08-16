import {Component, OnInit}                   from '@angular/core';
import {UnsubscriberComponent}               from '../core';
import {AccountService}                      from '../account/account.service';
import {Account}                             from '../account/account';
import {Angulartics2GoogleAnalytics}         from 'angulartics2/src/providers/angulartics2-google-analytics';

@Component({
  selector: '[account-switcher]',
  providers: [],
  template: require('./account-switcher.component.html')
})
export class AccountSwitcher extends UnsubscriberComponent implements OnInit {
    public account: Account;
    private errorMessage;

    constructor(private _accountService: AccountService, private _analytics: Angulartics2GoogleAnalytics) {
      super();
    }

    ngOnInit() {
      // Subscribe to data, then run get() to make sure it's fetched
      this.subscriptions.push(
        this._accountService.account$.subscribe(account => this.account = account));
      this._accountService.getAccount();
    }
}

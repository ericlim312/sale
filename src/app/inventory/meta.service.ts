import {Inject, Injectable, Component}       from '@angular/core';
import {Response}                            from '@angular/http';
import {Observable}                          from 'rxjs/Observable';
import {DataService}                         from '../core/data.service';
import {ColumnsService}                      from './columns.service';
import {AccountService}                      from '../account/account.service';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/map';

@Injectable()
export class InventoryMetaService {
    public meta$;
    private _metaObserver;
    private _dataStore;
    private _getInProgress = false;

    constructor(
        private _data: DataService, 
        private _columnsService: ColumnsService,
        private _accountService: AccountService
    ) {
        this.meta$ = new Observable(observer => this._metaObserver = observer).share();
        this._dataStore = {};
    }

    get () {
        // If get() is already running by someone else, don't run it again
        if (!this._getInProgress) {
            this._getInProgress = true;

            let metadata = this._data.get('v4/inventory/meta').map(res => res.json().data);

            let account = this._accountService.account$;

            let result = Observable
                .combineLatest(metadata, account).take(1)
                .subscribe(([data, acc]) => {
                    // Set the new data and broadcast it to all listeners
                    this._dataStore = data;
                    this._metaObserver.next(this._dataStore);
                    this._columnsService.setColumns(acc, data.columns);
                    this._getInProgress = false;
                }, error => console.error('Unable to fetch inventory meta', error))
            ;
            this._accountService.getAccount();

            return result;
        }
    }
}

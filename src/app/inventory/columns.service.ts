import { Injectable, OnInit} from '@angular/core';
import { Observable }        from 'rxjs/Observable';

import { DataService }       from '../core/data.service';
import { Localstorage }      from '../core';
import { AccountService }    from '../account/account.service';

interface ColumnServiceState {
    dataStore: Array<any>,
    selectedColumns: Array<any>
}

@Injectable()
export class ColumnsService implements OnInit {
    public columns$;
    public selectedColumns$;

    private _state$;
    private _stateObserver;

    private _state: ColumnServiceState = {
        dataStore: [],
        selectedColumns: []
    };

    constructor(
        private _data: DataService,
        private _account: AccountService,
        private _localstorage: Localstorage
    ) {
        this._state$ = new Observable(observer => this._stateObserver = observer).share();
        this.columns$ = this._state$.map(state => state.dataStore);
        this.selectedColumns$ = this._state$.map(state => state.selectedColumns);
    }

    public setSelected(column, value) {
        if (value) {
            this._state.selectedColumns = this.include(this._state.selectedColumns, column).sort((a, b) => a.order - b.order);
        } else {
            this._state.selectedColumns = this.exclude(this._state.selectedColumns, column);
        }
        this._stateObserver.next(this._state);
    }

    // This is triggered by meta service
    public setColumns(account, columns) {
        let data, change;

        // Set what columns should be shown
        try {
            data = this._localstorage.get(this.getKey(account));
        } catch (e) {
            data = [];
        };

        for (let n in columns) {
            columns[n].order = n;

            change = null;

            // If we have saved columns
            if (data && data.length > 0) {
                for (let i in data) {
                    if (data[i].id === columns[n].id) {
                        change = data[i].show;
                        break;
                    }
                }
            } else {
                // If this is a column we want to be open by default
                if (['id', 'image', 'private_name', 'quantity'].indexOf(columns[n].id) !== -1) {
                    columns[n].show = true;
                }

                // Show "active" columns by default
                if (columns[n].id.match(/[0-9]+_[0-9]+_active/)) {
                    columns[n].show = true;
                }

                // Show auctions column for whitelabel users
                if (columns[n].id.match(/[0-9]+_[0-9]+_auctions/) && account.account_type == 'whitelabel') {
                    columns[n].show = true;
                }
            }

            if (change !== null) {
                columns[n].show = change;
            }
        }

        // Update with current data
        try {
            this._localstorage.set(this.getKey(account), columns);
        } catch (e) {}

        this._state.dataStore = columns;
        this._state.selectedColumns = columns.filter(c => c.show);
        this._stateObserver.next(this._state);
    }

    public saveColumns() {
        this.waitForAccount(account => {
            // Save column data
            try {
                this._localstorage.set(this.getKey(account), this._state.dataStore);
            } catch (e) {}
        });
    }

    get () {
        // Just return the data that we've already got
        this._stateObserver.next(this._state);
    }

    ngOnInit() {
        // Use cached columns
        this.waitForAccount(account => {
            try {
                this._state.dataStore = this._localstorage.get(this.getKey(account));
            } catch (e) {}
        });
    }

    private include(array, element) {
        return this.exclude(array, element).concat(element);
    }

    private exclude(array, element) {
        return array.filter(e => e !== element);
    }

    private waitForAccount(action: (any) => void) {
        this._account.account$.take(1).subscribe(account => {
            action(account);
        });
        this._account.getAccount();
    }

    private getKey(account) {
        if (account && account.account_id) {
            return `${account.account_id}_columns`;
        }
        return 'columns';
    }
}

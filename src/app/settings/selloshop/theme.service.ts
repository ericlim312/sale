import 'rxjs/add/operator/share';

import { Injectable }   from '@angular/core';
import { Observable }   from 'rxjs/Observable';

import { DataService }  from '../../core/data.service';

@Injectable()
export class SelloshopThemeService {
    public theme$: Observable<any>;
    private _dataObserver;
    private _dataStore;
    private _getInProgress: boolean = false;

    constructor(
        private _data: DataService
    ) {
        this.theme$ = new Observable(observer => this._dataObserver = observer).share();
        this._dataStore = [];
    }

    get (integrationId) {
        if (!this._getInProgress && this._dataStore.length === 0) {
            this._getInProgress = true;

            return this._data.get(`v3/market/selloshop/${integrationId}/theme`)
                .map(res => res.json().data)
                .subscribe(data => {
                    this._dataStore = data;
                    this._dataObserver.next(this._dataStore);
                    this._getInProgress = false;
                }, error => console.error('Unable to fetch coupons', error));
        } else {
            this._dataObserver.next(this._dataStore);
        }
    }
}

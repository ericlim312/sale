import 'rxjs/add/operator/share';
import 'rxjs/add/operator/map';
import {Injectable}       from '@angular/core';
import {Observable}       from 'rxjs/Observable';
import {DataService}      from '../core/data.service';

@Injectable()
export class MarketV3Service {
    public setting$: Observable<any>;
    private _settingObserver;
    private _dataStore;
    private _getInProgress: boolean = false;

    constructor(
        private _data: DataService
    ) {
        this.setting$ = new Observable(observer => this._settingObserver = observer).share();
    }

    get (url) {
        if (!this._getInProgress && !this._dataStore) {
            this._getInProgress = true;

            return this._data.get(`v3/market/${url}`)
                .map(res => res.json().data)
                .subscribe(data => {
                    this._dataStore = data;
                    this._settingObserver.next(this._dataStore);
                }, error => {
                    console.error('Error when fetching settings:', error);
                });

        } else {
            this._settingObserver.next(this._dataStore);
        }
    }

    reset() {
        this._dataStore = null;
        this._getInProgress = false;
    }

    post (url, settings) {
        return this._data.post(`v3/market/${url}`, settings).map(response => response.json().data);
    }

    put (url, settings) {
        return this._data.put(`v3/market/${url}`, settings);
    }

    delete (url) {
        return this._data.delete(`v3/market/${url}`);
    }
}

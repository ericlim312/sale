import 'rxjs/add/operator/map';
import { Injectable }  from '@angular/core';
import { Observable }  from 'rxjs/Observable';
import { DataService } from '../../core/data.service';

@Injectable()
export class StatsService {
    public stats$;
    private _statsObserver;
    private _dataStore;
    private _getInProgress = {};

    constructor(
        private _data: DataService
    ) {
        this.stats$ = new Observable(observer => this._statsObserver = observer).share();
        this._dataStore = {};
    }

    getStats (productId) {
        this._dataStore[productId] = [];

        // If get() is already running by someone else, don't run it again
        if (!this._getInProgress.hasOwnProperty(productId) || !this._getInProgress[productId]) {
            this._getInProgress[productId] = true;

            return this._data.get('v4/products/' + productId + '/stats')
                .map(res => res.json().data)
                .subscribe(data => {
                    // Set the new data and broadcast it to all listeners
                    this._dataStore[productId] = data;
                    this._statsObserver.next(this._dataStore);
                    this._getInProgress[productId] = false;
                }, error => console.error('Unable to fetch stats', error))
            ;
        } else {
            this._statsObserver.next(this._dataStore);
        }
    }
}

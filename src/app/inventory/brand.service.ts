import 'rxjs/add/operator/share';

import { Injectable }   from '@angular/core';
import { Observable }   from 'rxjs/Observable';

import { DataService }  from '../core/data.service';

@Injectable()
export class BrandService {
    public brand$;
    private _brandObserver;
    private _dataStore;
    private _getInProgress: boolean = false;

    constructor(
        private _data: DataService
    ) {
        this.brand$ = new Observable(observer => this._brandObserver = observer).share();
        this._dataStore = [];
    }

    get () {
        // If get() is already running by someone else, don't run it again
        if (!this._getInProgress && this._dataStore.length === 0) {
            this._getInProgress = true;

            return this._data.get('v4/inventory/brands')
                .map(res => res.json().data)
                .subscribe(data => {
                    // Set the new data and broadcast it to all listeners
                    this._dataStore = data;
                    this._brandObserver.next(this._dataStore);
                    this._getInProgress = false;
                }, error => console.error('Unable to fetch brands', error))
            ;
        } else {
            // Just send the data we have
            this._brandObserver.next(this._dataStore);
        }
    }
}

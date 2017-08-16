import 'rxjs/add/operator/share';

import { Injectable }   from '@angular/core';
import { Observable }   from 'rxjs/Observable';

import { DataService }  from '../core/data.service';

@Injectable()
export class LanguageService {
    public language$;
    private _dataObserver;
    private _dataStore;
    private _getInProgress: boolean = false;

    constructor(
        private _data: DataService
    ) {
        this.language$ = new Observable(observer => this._dataObserver = observer).share();
        this._dataStore = [];
    }

    get () {
        if (!this._getInProgress && this._dataStore.length === 0) {
            this._getInProgress = true;

            return this._data.get('v3/language')
                .map(res => res.json().data)
                .subscribe(data => {
                    this._dataStore = this._sort(data);
                    this._dataObserver.next(this._dataStore);
                    this._getInProgress = false;
                }, error => console.error('Unable to fetch languages', error))
            ;
        } else {
            this._dataObserver.next(this._dataStore);
        }
    }

    private _sort(items) {
        return items.sort((a, b) => a && b && a.code.localeCompare(b.code));
    }
}

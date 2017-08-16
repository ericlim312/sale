import 'rxjs/add/operator/share';

import { Injectable }   from '@angular/core';
import { Observable }   from 'rxjs/Observable';

import { DataService }  from '../core/data.service';

@Injectable()
export class ApiService {
    public key$;
    private _apiObserver;
    private _dataStore;
    private _getInProgress: boolean = false;

    constructor(
        private _data: DataService
    ) {
        this.key$ = new Observable(observer => this._apiObserver = observer).share();
        this._dataStore = [];
    }

    get () {
        if (!this._getInProgress && this._dataStore.length === 0) {
            this._getInProgress = true;

            return this._data.get('v3/account/api')
                .map(res => res.json().data)
                .subscribe(data => {
                    this._dataStore = data;
                    this._apiObserver.next(this._dataStore);
                    this._getInProgress = false;
                }, error => console.error('Unable to fetch api keys', error))
            ;
        } else {
            this._apiObserver.next(this._dataStore);
        }
    }

    delete (id) {
        return new Promise<void>((resolve, reject) => {
            this._data.delete(`v3/account/api/${id}`)
                .subscribe(
                    () => {
                        this._exclude(id);
                        resolve();
                    },
                    error => {
                        reject(error.json());
                    });
        });
    }

    create () {
        this._data.post('v3/account/api', {})
            .map(res => res.json().data)
            .subscribe((result) => {
                this._dataStore.push(result);
                this._apiObserver.next(this._dataStore);
            });
    }

    private _exclude(id) {
        this._dataStore = this._dataStore.filter(b => b.id !== id);
        this._apiObserver.next(this._dataStore);
    }
}

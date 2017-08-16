import 'rxjs/add/operator/share';

import { Injectable }   from '@angular/core';
import { Observable }   from 'rxjs/Observable';

import { DataService }  from '../core/data.service';

@Injectable()
export class RemindersService {
    public reminder$;
    private _dataObserver;
    private _dataStore;
    private _getInProgress: boolean = false;

    constructor(
        private _data: DataService
    ) {
        this.reminder$ = new Observable(observer => this._dataObserver = observer).share();
        this._dataStore = [];
    }

    create (data) {
        return this._data.post('v3/order/reminders', data).toPromise()
            .then(
                response => {
                    data.id = response.json().data.id;
                    this._include(data);
                    this._dataObserver.next(this._dataStore);
                    return data;
                },
                error => {
                    throw error.json();
                });
    }

    set (id, data) {
        return this._data.put(`v3/order/reminders/${id}`, data).toPromise()
            .then(
                () => {
                    let item = this._dataStore.find(x => x.id === id);
                    Object.assign(item, data);
                    this._dataObserver.next(this._dataStore);
                },
                error => {
                    throw error.json();
                });
    }

    get () {
        if (!this._getInProgress && this._dataStore.length === 0) {
            this._getInProgress = true;

            return this._data.get('v3/order/reminders')
                .map(res => res.json().data)
                .subscribe(data => {
                    this._dataStore = this._sort(data);
                    this._dataObserver.next(this._dataStore);
                    this._getInProgress = false;
                }, error => console.error('Unable to fetch reminders', error))
            ;
        } else {
            this._dataObserver.next(this._dataStore);
        }
    }

    delete (id) {
        return new Promise<void>((resolve, reject) => {
            this._data.delete(`v3/order/reminders/${id}`)
                .subscribe(
                    () => {
                        this._exclude(id);
                        this._dataObserver.next(this._dataStore);
                        resolve();
                    },
                    error => {
                        reject(error.json());
                    });
        });
    }

    private _include(item) {
        this._dataStore =
            this._dataStore
                .filter(b => b.id !== item.id)
                .concat(item);

        this._sort(this._dataStore);
    }

    private _exclude(id) {
        this._dataStore = this._dataStore.filter(b => b.id !== id);
    }

    private _sort(items) {
        return items.sort((a, b) => a && b && a.name.localeCompare(b.name));
    }
}

import 'rxjs/add/operator/share';

import { Injectable }   from '@angular/core';
import { Observable }   from 'rxjs/Observable';

import { DataService }  from '../core/data.service';

@Injectable()
export class ProductTemplateService {
    public template$;
    private _dataObserver;
    private _dataStore;
    private _getInProgress: boolean = false;

    constructor(
        private _data: DataService
    ) {
        this.template$ = new Observable(observer => this._dataObserver = observer).share();
        this._dataStore = [];
    }

    create (data) {
        return this._data.post('v3/products/templates', data).toPromise()
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

    get () {
        if (!this._getInProgress && this._dataStore.length === 0) {
            this._getInProgress = true;

            this._data.get('v3/products/templates')
                .map(res => res.json().data)
                .subscribe(data => {
                    this._dataStore = this._sort(data);
                    this._dataObserver.next(this._dataStore);
                    this._getInProgress = false;
                }, error => console.error('Unable to fetch product templates', error));
        } else {
            this._dataObserver.next(this._dataStore);
        }
    }

    set (id, data) {
        return this._data.put(`v3/products/templates/${id}`, data).toPromise()
            .then(
                () => {
                    let item = this._dataStore.find(x => x.id === id);
                    Object.assign(item, data);
                    this._sort(this._dataStore);
                    this._dataObserver.next(this._dataStore);
                },
                error => {
                    throw error.json();
                });
    }

    delete (id) {
        return new Promise<void>((resolve, reject) => {
            this._data.delete(`v3/products/templates/${id}`)
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

    private _include(item) {
        this._dataStore =
            this._dataStore
                .filter(b => b.id !== item.id)
                .concat(item);

        this._sort(this._dataStore);
    }

    private _exclude(id) {
        this._dataStore = this._dataStore.filter(b => b.id !== id);
        this._dataObserver.next(this._dataStore);
    }

    private _sort(items) {
        return items.sort((a, b) => a && b && a.title.localeCompare(b.title));
    }
}

import 'rxjs/add/operator/share';
import 'rxjs/add/operator/map';
import {Injectable}       from '@angular/core';
import {Observable}       from 'rxjs/Observable';
import {DataService}      from '../core/data.service';

@Injectable()
export class StatusesService {
    public statuses$: Observable<any>;
    private _statusesObserver;
    private _dataStore;

    constructor(
        private _data: DataService
    ) {
        this.statuses$ = new Observable(observer => this._statusesObserver = observer).share();
        this._dataStore = { data: [] };
    }

    create (data) {
        return this._data.post(`v3/settings/status/status/`, data)
                .toPromise().catch(error => { throw error.json(); });
    }

    update (id, data) {
        return this._data.put(`v3/settings/status/status/${id}`, data)
                .toPromise().catch(error => { throw error.json(); });
    }

    get (id = '') {
        return this._data.get(`v3/statuses/${id}`)
            .map(res => res.json().data)
            .subscribe(data => {
                this._dataStore.data = data;
                this._statusesObserver.next(this._dataStore.data);
            }, error => {
                console.error('Error when fetching settings:', error);
            })
        ;
    }

    getAll () {
        return this._data.get(`v3/settings/status/status`)
            .map(res => res.json().data)
            .subscribe(data => {
                let statuses = [];
                Object.keys(data).map(key => statuses.push(data[key]));
                this._dataStore.data = statuses;

                this._statusesObserver.next(this._dataStore);
            }, error => {
                console.error('Error when fetching statuses:', error);
            });
    }

    delete (id) {
        return new Promise<void>((resolve, reject) => {
            this._data.delete(`v3/settings/status/remove/${id}`)
                .subscribe(
                    () => resolve(),
                    error => reject(error.json()));
        });
    }
}

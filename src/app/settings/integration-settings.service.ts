import 'rxjs/add/operator/share';
import 'rxjs/add/operator/map';
import {Injectable}       from '@angular/core';
import {Observable}       from 'rxjs/Observable';
import {DataService}      from '../core/data.service';

@Injectable()
export class IntegrationSettingsService {
    public setting$: Observable<any>;
    private _settingObserver;
    private _dataStore;

    constructor(
        private _data: DataService
    ) {
        this.setting$ = new Observable(observer => this._settingObserver = observer).share();
        this._dataStore = {};
    }

    post (id, settings) {
        return this._data.post(`v3/integration/${id}`, settings);
    }

    get (id) {
        return this._data.get(`v3/integration/${id}`)
            .map(res => res.json().data).toPromise()
            .then(data => {
                this._dataStore = data;
                this._settingObserver.next(this._dataStore);
            }, error => {
                console.error('Error when fetching settings:', error);
            });
    }

    put (id, settings) {
        return this._data.put(`v3/integration/${id}`, settings);
    }

    delete (id) {
        return this._data.delete(`v3/integration/${id}`);
    }
}

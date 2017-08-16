import 'rxjs/add/operator/share';
import 'rxjs/add/operator/map';
import {Injectable}       from '@angular/core';
import {Observable}       from 'rxjs/Observable';
import {DataService}      from '../core/data.service';

@Injectable()
export class SettingsV3Service {
    public setting$;
    private _settingObserver;
    private _dataStore;

    constructor(
        private _data: DataService
    ) {
        this.setting$ = new Observable(observer => this._settingObserver = observer).share();
        this._dataStore = {};
    }

    get (url) {
        return this._data.get(`v3/settings/${url}`)
            .map(res => res.json().data)
            .subscribe(data => {
                Object.assign(this._dataStore, data);
                this._settingObserver.next(this._dataStore);
            }, error => {
                console.error('Error when fetching settings:', error);
            });
    }

    put (url, settings) {
        return this._data.put(`v3/settings/${url}`, settings);
    }
}

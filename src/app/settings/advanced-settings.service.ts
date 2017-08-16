import 'rxjs/add/operator/share';
import 'rxjs/add/operator/map';
import {Injectable}       from '@angular/core';
import {Observable}       from 'rxjs/Observable';
import {DataService}      from '../core/data.service';

@Injectable()
export class AdvancedSettingsService {
    public setting$;
    private _settingObserver;
    private _dataStore;

    constructor(
        private _data: DataService
    ) {
        this.setting$ = new Observable(observer => this._settingObserver = observer).share();
        this._dataStore = {};
    }

    get () {
        return this._data.get('v3/settings/advanced')
            .map(res => res.json().data)
            .subscribe(data => {
                for (let key in data) {
                    this._dataStore[key] = data[key];
                }

                this._settingObserver.next(this._dataStore);
            }, error => {
                console.error('Error when fetching settings:', error);
            });
    }

    put (settings) {
        return this._data.put('v3/settings/advanced', settings);
    }
}

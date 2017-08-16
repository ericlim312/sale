import 'rxjs/add/operator/share';
import 'rxjs/add/operator/map';
import {Injectable}       from '@angular/core';
import {Observable}       from 'rxjs/Observable';
import {DataService}      from '../core/data.service';

@Injectable()
export class SettingsService {
    public setting$;
    private _settingObserver;
    private _dataStore;

    constructor(
        private _data: DataService
    ) {
        this.setting$ = new Observable(observer => this._settingObserver = observer).share();
        this._dataStore = {};
    }

    get (settings) {
        // Check if we already have some of the settings
        let settingsToFetch = [];
        for (let setting of settings) {
            if (!this._dataStore.hasOwnProperty(setting)) {
                settingsToFetch.push(setting);
            }
        }

        if (settingsToFetch.length === 0) {
            this._settingObserver.next(this._dataStore);
            return;
        }

        return this._data.post('v4/settings', settingsToFetch)
            .map(res => res.json().data)
            .subscribe(data => {
                console.log(data);

                for (let key in data) {
                    this._dataStore[key] = data[key];
                }

                this._settingObserver.next(this._dataStore);
            }, error => {
                console.error('Error when fetching settings:', error);
            })
        ;
    }

    put (settings) {
        return this._data.put('v4/settings', settings);
    }
}

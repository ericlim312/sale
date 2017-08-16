import 'rxjs/add/operator/share';
import 'rxjs/add/operator/map';
import {Injectable}       from '@angular/core';
import {Observable}       from 'rxjs/Observable';
import {DataService}      from '../../core/data.service';

@Injectable()
export class SelloshopFilesService {
    public file$: Observable<any>;
    private _dataObserver;
    private _dataStore;
    private _getInProgress: boolean = false;

    constructor(
        private _data: DataService
    ) {
        this.file$ = new Observable(observer => this._dataObserver = observer).share();
    }

    get (integrationId) {
        if (!this._getInProgress && !this._dataStore) {
            this._getInProgress = true;

            return this._data.get(`v3/market/selloshop/${integrationId}/files`)
                .map(res => res.json().data)
                .subscribe(data => {
                    this._dataStore = data;
                    this._dataObserver.next(this._dataStore);
                }, error => {
                    console.error('Error when fetching files:', error);
                });

        } else {
            this._dataObserver.next(this._dataStore);
        }
    }

    post (integrationId, settings) {
        return this._data.post(`v3/market/selloshop/${integrationId}/files`, settings).map(response => response.json().data);
    }

    put (integrationId, settings) {
        return this._data.put(`v3/market/selloshop/${integrationId}/files`, settings);
    }

    delete (integrationId, id) {
        return this._data.delete(`v3/market/selloshop/${integrationId}/files/${id}`);
    }
}

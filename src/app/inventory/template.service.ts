import 'rxjs/add/operator/share';
import 'rxjs/add/operator/map';
import { Injectable }  from '@angular/core';
import { Observable }  from 'rxjs/Observable';
import { DataService } from '../core/data.service';

@Injectable()
export class TemplateService {
    public template$;
    private _templateObserver;
    private _dataStore;
    private _getInProgress: boolean = false;

    constructor(
        private _data: DataService
    ) {
        this.template$ = new Observable(observer => this._templateObserver = observer).share();
        this._dataStore = [];
    }

    get () {
        // If get() is already running by someone else, don't run it again
        if (!this._getInProgress && this._dataStore.length === 0) {
            this._getInProgress = true;

            return this._data.get('v4/inventory/templates')
                .map(res => res.json().data)
                .subscribe(data => {
                    // Set the new data and broadcast it to all listeners
                    this._dataStore = data;
                    this._templateObserver.next(this._dataStore);
                    this._getInProgress = false;
                }, error => console.error('Unable to fetch templates', error))
            ;
        }
    }
}

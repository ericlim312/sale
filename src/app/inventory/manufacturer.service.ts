import 'rxjs/add/operator/map';
import { Injectable }       from '@angular/core';
import { Observable }       from 'rxjs/Observable';
import { DataService }      from '../core/data.service';
import { Localstorage }     from '../core';
import { TranslatePipe }    from '../core';

@Injectable()
export class ManufacturerService {
    public manufacturer$;
    private _manufacturerObserver;
    private _dataStore;

    constructor(
        private _data: DataService,
        private _localstorage: Localstorage,
        private _translate: TranslatePipe
    ) {
        this.manufacturer$ = new Observable(observer => this._manufacturerObserver = observer).share();
        this._dataStore = {
        };
    }

    getAll() {
        return this._data.get('v3/manufacturers')
            .map(res => res.json().data.manufacturers)
            .subscribe(data => {
                // Set the new data and broadcast it to all listeners
                this._dataStore = data;
                this._manufacturerObserver.next(this._dataStore);
            }, error => console.error('Unable to fetch all manufacturers', error))
        ;
    }
}

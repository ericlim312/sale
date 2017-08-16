import {Injectable}       from '@angular/core';
import {Observable}                          from 'rxjs/Observable';
import {DataService}                         from '../core/data.service';
import 'rxjs/add/operator/share';

@Injectable()
export class QuickeditService {
    public quickedit$;
    public quickeditSave$;
    private _quickeditObserver;
    private _quickeditSaveObserver;
    private _data = {};
    private _saveTimer = null;

    constructor(
        private _dataService: DataService
    ) {
        this.quickedit$ = new Observable(observer => this._quickeditObserver = observer).share();
        this.quickeditSave$ = new Observable(observer => this._quickeditSaveObserver = observer).share();
    }

    setQuickedit(value) {
        this._quickeditObserver.next(value);
    }

    saveQuickedit() {
        this._quickeditSaveObserver.next();
    }

    // All product components will send their data here
    setQuickeditData(id, product) {
        // Add the data to our array
        this._data[id] = product;

        // If we have a timer, reset it
        if (this._saveTimer !== null) {
            clearTimeout(this._saveTimer);
        }

        // Wait 1 sec until we save
        this._saveTimer = setTimeout(() => this.save(), 1000);
    }

    save() {
        // Send it to API
        this._dataService.post('v4/products/quickedit', this._data)
            .subscribe(result => console.info("Quickedit saved"));
    }
}

import 'rxjs/add/operator/share';
import 'rxjs/add/operator/map';
import {Injectable}  from '@angular/core';
import {Observable}  from 'rxjs/Observable';
import {DataService} from '../../core/data.service';

@Injectable()
export class LogService {
    public log$;
    private _logObserver;
    private _dataStore;

    constructor(
        private _data: DataService
    ) {
        this.log$ = new Observable(observer => this._logObserver = observer).share();
        this._dataStore = {
            events: []
        };
    }

    get (start, token) {
        if (token === undefined) {
            token = '';
        }
        if (start === undefined) {
            start = '';
        }

        return this._data.get('v4/feed/log?next=' + token + '&start=' + start)
            .map(res => res.json().data)
            .subscribe(data => {
                if (data !== null) {
                    // If there are no events, provide no forward token
                    if (data.events.length == 0) {
                        data.forward = '';
                    }

                    this._dataStore = data;
                    this._logObserver.next(this._dataStore);
                } else {
                    this._logObserver.next(this._dataStore);
                }
            }, error => {
                console.error('Error when fetching log:', error);
            })
        ;
    }

    next (start, token) {
        if (token === undefined) {
            token = '';
        }
        if (start === undefined) {
            start = '';
        }

        return this._data.get('v4/feed/log?next=' + token + '&start=' + start)
            .map(res => res.json().data)
            .subscribe(data => {
                if (data !== null) {
                    // If there are no events, provide no forward token
                    if (data.events.length == 0) {
                        data.forward = '';
                    }

                    this._dataStore.events = this._dataStore.events.concat(data.events);
                    this._dataStore.backward = data.backward;
                    this._dataStore.forward = data.forward;
                    this._logObserver.next(this._dataStore);
                } else {
                    this._logObserver.next(this._dataStore);
                }
            }, error => {
                console.error('Error when fetching log:', error);
            })
        ;
    }
}

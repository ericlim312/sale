import { Injectable }  from '@angular/core';
import { Observable }  from 'rxjs/Observable';

import { DataService } from '../core/data.service';

@Injectable()
export class NotificationService {
    public notification$;
    private _notificationObserver;
    private _dataStore;
    private _getInProgress = false;

    constructor(private _data: DataService) {
        this.notification$ = new Observable(observer => this._notificationObserver = observer).share();
        this._dataStore = {};
    }

    get () {
        // If get() is already running by someone else, don't run it again
        if (!this._getInProgress) {
            this._getInProgress = true;

            return this._data.get('v3/notifications')
                .map(res => res.json().data)
                .subscribe(data => {
                    // Set the new data and broadcast it to all listeners
                    this._dataStore = data;
                    this._notificationObserver.next(this._dataStore);
                    this._getInProgress = false;
                }, error => console.error('Unable to fetch notifications', error))
            ;
        }
    }

    setOutbox(howMany: number) {
        this._dataStore.outbox = howMany;
        this._notificationObserver.next(this._dataStore);
    }
}

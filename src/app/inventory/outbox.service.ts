import { Injectable }          from '@angular/core';
import { Response }            from '@angular/http';

import { Observable }          from 'rxjs/Observable';
import { DataService }         from '../core/data.service';
import { NotificationService } from '../core';

@Injectable()
export class OutboxService {
    public outbox$;
    private _outboxObserver;
    private _dataStore;
    private _getInProgress = false;

    constructor(private _data: DataService, private _notificationService: NotificationService) {
        this.outbox$ = new Observable(observer => this._outboxObserver = observer).share();
        this._dataStore = {
        };
    }

    addOutbox (integrationId, products) {
        let obj = {
            products: [],
            integrationId: integrationId
        };

        // Convert to outbox format
        for (var n in products) {
            obj.products.push({ id: products[n] });
        }

        return this._data.post('v3/outbox', obj)
            .map(res => {
                let data = res.json().data;
                this._notificationService.setOutbox(data.count);
                return data;
            })
        ;
    }

    private handleError (error: Response) {
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }
}

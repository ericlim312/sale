import {OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs';

export class UnsubscriberComponent implements OnDestroy {
    private _subscriptions = new Array<Subscription>();

    protected get subscriptions() {
        return this._subscriptions;
    }

    public ngOnDestroy() {
        this._subscriptions.forEach(s => s.unsubscribe());
    }
}
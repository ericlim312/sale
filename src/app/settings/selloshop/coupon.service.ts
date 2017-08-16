import 'rxjs/add/operator/share';

import { Injectable }   from '@angular/core';
import { Observable }   from 'rxjs/Observable';

import { DataService }  from '../../core/data.service';

@Injectable()
export class SelloshopCouponService {
    public coupon$;
    private _brandObserver;
    private _dataStore;
    private _getInProgress: boolean = false;

    constructor(
        private _data: DataService
    ) {
        this.coupon$ = new Observable(observer => this._brandObserver = observer).share();
        this._dataStore = [];
    }

    create (integrationId, cupon) {
        return this._data.post(`v3/market/selloshop/${integrationId}/coupon`, cupon).toPromise()
            .then(() => {
                this._include(cupon);
            })
            .catch(error => {
                throw error.json();
            });
    }

    get (integrationId) {
        if (!this._getInProgress && this._dataStore.length === 0) {
            this._getInProgress = true;

            return this._data.get(`v3/market/selloshop/${integrationId}/coupon`)
                .map(res => res.json().data)
                .subscribe(data => {
                    this._dataStore = data;
                    this._brandObserver.next(this._dataStore);
                    this._getInProgress = false;
                }, error => console.error('Unable to fetch coupons', error));
        } else {
            this._brandObserver.next(this._dataStore);
        }
    }

    delete (integrationId, id) {
        return new Promise<void>((resolve, reject) => {
            this._data.delete(`v3/market/selloshop/${integrationId}/coupon?code=${id}`)
                .subscribe(
                    () => {
                        this._exclude(id);
                        resolve();
                    },
                    error => {
                        reject(error.json());
                    });
        });
    }

    private _include(cupon) {
        this._dataStore =
            this._dataStore
                .filter(b => b.code !== cupon.code)
                .concat(cupon);

        this._brandObserver.next(this._dataStore);
    }

    private _exclude(id) {
        this._dataStore = this._dataStore.filter(b => b.code !== id);
        this._brandObserver.next(this._dataStore);
    }
}

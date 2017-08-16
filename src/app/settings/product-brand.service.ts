import 'rxjs/add/operator/share';

import { Injectable }   from '@angular/core';
import { Observable }   from 'rxjs/Observable';

import { DataService }  from '../core/data.service';

@Injectable()
export class ProductBrandService {
    public brand$;
    private _brandObserver;
    private _dataStore;
    private _getInProgress: boolean = false;

    constructor(
        private _data: DataService
    ) {
        this.brand$ = new Observable(observer => this._brandObserver = observer).share();
        this._dataStore = [];
    }

    create (name) {
        let newBrand = {
            name: name,
            brand_id: null
        };

        return this._data.post(`v3/products/brands`, newBrand).toPromise()
            .then(
                (response) => {
                    newBrand.brand_id = response.json().data;
                    this._include(newBrand);
                    this._brandObserver.next(this._dataStore);
                },
                error => {
                    throw error.json();
                });
    }

    get () {
        // If get() is already running by someone else, don't run it again
        if (!this._getInProgress && this._dataStore.length === 0) {
            this._getInProgress = true;

            return this._data.get('v3/products/brands')
                .map(res => res.json().data)
                .subscribe(data => {
                    // Set the new data and broadcast it to all listeners
                    this._dataStore = this._sort(data);
                    this._brandObserver.next(this._dataStore);
                    this._getInProgress = false;
                }, error => console.error('Unable to fetch brands', error))
            ;
        } else {
            // Just send the data we have
            this._brandObserver.next(this._dataStore);
        }
    }

    delete (id) {
        return new Promise<void>((resolve, reject) => {
            this._data.delete(`v3/products/brands/${id}`)
                .subscribe(
                    () => {
                        this._exclude(id);
                        this._brandObserver.next(this._dataStore);
                        resolve();
                    },
                    error => {
                        reject(error.json());
                    });
        });
    }

    private _include(brand) {
        this._dataStore =
            this._dataStore
                .filter(b => b.brand_id !== brand.brand_id)
                .concat(brand);

        this._sort(this._dataStore);
    }

    private _exclude(id) {
        this._dataStore = this._dataStore.filter(b => b.brand_id !== id);
    }

    private _sort(brands) {
        return brands.sort((a, b) => a && b && a.name.localeCompare(b.name));
    }
}

import 'rxjs/add/operator/share';
import 'rxjs/add/operator/map';

import { Injectable }      from '@angular/core';
import { Observable }      from 'rxjs/Observable';

import { DataService }     from '../core/data.service';

@Injectable()
export class CategoryService {
    public category$;
    public final$;
    private _categoryObserver;
    private _finalObserver;
    private _dataStore;
    private _finalDataStore;
    private _cache = {};

    constructor(
        private _data: DataService
    ) {
        this.category$ = new Observable(observer => this._categoryObserver = observer).share();
        this.final$ = new Observable(observer => this._finalObserver = observer).share();
        this._dataStore = {};
        this._finalDataStore = {};
    }

    get (marketId, parentId) {
        if (parentId === null) {
            parentId = 0;
        }

        // Define variable if not exist
        if (!this._dataStore.hasOwnProperty(marketId)) {
            this._dataStore[marketId] = {};
        }
        if (!this._dataStore[marketId].hasOwnProperty(parentId)) {
            this._dataStore[marketId][parentId] = [];
        }

        // If we have data, use it
        if (this._dataStore[marketId][parentId].length > 0) {
            this._categoryObserver.next(this._dataStore);
            return;
        }

        return this._data.get('v4/inventory/categories/' + marketId + '/' + parentId)
            .map(res => res.json())
            .subscribe(data => {
                if (data.response === 404) {
                    // No subcategory found. Broadcast to final observer
                    this._finalDataStore[parentId] = true;
                    this._finalObserver.next(this._finalDataStore);
                } else {
                    // Add each to cache
                    for (let n in data.data) {
                        this._cache[data.data[n].id] = data.data[n];
                    }

                    this._dataStore[marketId][parentId] = data.data;
                    this._categoryObserver.next(this._dataStore);
                }
            }, error => {
                if (error.status === 404) {
                    // No subcategory found. Broadcast to final observer
                    this._finalDataStore[parentId] = true;
                    this._finalObserver.next(this._finalDataStore);
                } else {
                    console.error('Error when fetching category:', error);
                }
            })
        ;
    }

    getFromCache(id) {
        return this._cache[id];
    }

    getCategory(integration, categoryId) {
        return this._data.get('v4/inventory/categories/' + integration + '/info/' + categoryId)
            .map(res => res.json().data);
    }
}

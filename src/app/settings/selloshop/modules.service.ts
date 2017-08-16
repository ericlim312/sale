import 'rxjs/add/operator/share';

import { Injectable }   from '@angular/core';
import { Observable }   from 'rxjs/Observable';

import { DataService }  from '../../core/data.service';

@Injectable()
export class SelloshopModulesService {
    public available$: Observable<any>;
    public enabled$: Observable<any>;
    private _data$: Observable<any>;
    private _dataObserver;
    private _dataStore;
    private _getInProgress: boolean = false;

    constructor(
        private _data: DataService
    ) {
        this._data$ = new Observable(observer => this._dataObserver = observer).share();
        this.available$ = this._data$.map(data => data.available);
        this.enabled$ = this._data$.map(data => data.enabled);
        this._dataStore = [];
    }

    get (integrationId) {
        if (!this._getInProgress && this._dataStore.length === 0) {
            this._getInProgress = true;

            return this._data.get(`v3/market/selloshop/${integrationId}/modules`)
                .map(res => res.json().data)
                .subscribe(data => {
                    this._dataStore = this._ensureData(data);
                    this._dataObserver.next(this._dataStore);
                    this._getInProgress = false;
                }, error => console.error('Unable to fetch modules', error));
        } else {
            this._dataObserver.next(this._dataStore);
        }
    }

    create (integrationId, block, module) {
        this._addToBlock(block, module);
        this._updateOrderProperty(block);

        return this.save(integrationId)
            .catch(error => {
                this._createRollback(block, module);                
                throw error;
            });
    }

    update (integrationId, block, newValues) {
        this._update(block, newValues.id, newValues);
        this._updateOrderProperty(block);

        return this.save(integrationId);
    }

    delete (integrationId, block, module) {
        this._removeFromBlock(block, module);
        this._updateOrderProperty(block);

        return this.save(integrationId);
    }

    save(integrationId) {
        // console.log('!!! save', `v3/market/selloshop/${integrationId}/modules`, this._dataStore.enabled)
        // return Promise.resolve();

        return this._data.put(`v3/market/selloshop/${integrationId}/modules`, this._dataStore.enabled).toPromise()
            .then(() => {
                this._dataObserver.next(this._dataStore);
            })
            .catch(error => {
                throw error.json();
            });
    }

    private _createRollback(block, module) {
        this._dataStore.enabled[block] = this._dataStore.enabled[block].filter(m => m !== module);
        this._dataObserver.next(this._dataStore);
    }

    private _ensureData(data) {
        Object.keys(data.enabled).map(key => data.enabled[key]).forEach(block => {
            block.forEach(module => {
                if (!module.width) {
                    module.width = {};
                }
            });
        });

        return data;
    }

    private _addToBlock(block, module) {
        if (!this._dataStore.enabled[block]) {
            this._dataStore.enabled[block] = [];
        }
        this._dataStore.enabled[block] = this._dataStore.enabled[block].concat(module);
    }

    private _removeFromBlock(block, module) {
        this._dataStore.enabled[block] = this._dataStore.enabled[block].filter(m => m.id !== module.id);
    }

    private _update(block, id, newValues) {
        let module = this._dataStore.enabled[block].find(m => m.id === id);
        if (module) {
            Object.assign(module, newValues);
        }
    }

    private _updateOrderProperty(block) {
         this._dataStore.enabled[block].forEach((module, i) => module.order = i + 1);
    }
}

import 'rxjs/add/operator/share';
import 'rxjs/add/operator/map';

import { Injectable }  from '@angular/core';
import { Observable }  from 'rxjs/Observable';

import { DataService } from '../core/data.service';

@Injectable()
export class IntegrationService {
    public integration$;
    private _integrationObserver;
    private _dataStore;
    private _getInProgress = false;
    private _numPerMarket = {};

    constructor(private _data: DataService) {
        this.integration$ = new Observable(observer => {
            this._integrationObserver = observer;
        }).share();
        this._dataStore = [];
    }

    get () {
        // If get() is already running by someone else, don't run it again
        if (!this._getInProgress && this._dataStore.length === 0) {
            this._getInProgress = true;

            return this._data.get('v3/integration')
                .map(res => res.json().data)
                .subscribe(data => {
                    // Set the new data and broadcast it to all listeners
                    this._dataStore = data;

                    // Remove ones that aren't marketplaces
                    for (var n in this._dataStore) {
                        if (this._dataStore[n].type !== 'marketplace') {
                            delete this._dataStore[n];
                        }
                    }

                    this._integrationObserver.next(this._dataStore);
                    this._getInProgress = false;

                    this._numPerMarket = {};
                    for (let integration of this._dataStore) {
                        if (!this._numPerMarket.hasOwnProperty(integration.market_id)) {
                            this._numPerMarket[integration.market_id] = 1;
                        } else {
                            this._numPerMarket[integration.market_id]++;
                        }
                    }

                }, error => console.error('Unable to fetch integrations', error))
            ;
        } else {
            // Trigger next() to push data to client
            this._integrationObserver.next(this._dataStore);
        }
    }

    getIntegration(integrationId) {
        for (let n in this._dataStore) {
            if (parseInt(this._dataStore[n].id) === integrationId) {
                return this._dataStore[n];
            }
        }

        return {};
    }

    numIntegrations(marketId) {
        return this._numPerMarket[marketId];
    }

    markets() {
        let markets = [];

        for (let i of this._dataStore) {
            if (markets.indexOf(i.market_id) === -1) {
                markets.push(i.market_id);
            }
        }

        return markets;
    }

    integrationsOfType(market) {
        let integrations = [];

        for (let i of this._dataStore) {
            if (i.market_id == market) {
                integrations.push(i);
            }
        }

        return integrations;
    }

    public marketName (marketId) {
        let markets = {
            1: 'Tradera',
            5: 'SelloShop',
            6: 'Fyndiq',
            7: 'Fyndiq.de',
            8: 'AdNic',
            9: 'Magento',
            10: 'CDON',
            11: 'PrestaShop',
            12: 'Woocommerce',
            13: 'Amazon',
            14: 'Posten Åland',
        };

        if (!markets.hasOwnProperty(marketId)) {
            console.warn('Unknown market id: ', marketId);
            return 'UNKNOWN';
        } else {
            return markets[marketId];
        }
    }
}

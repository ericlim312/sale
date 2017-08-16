import {Component,  OnInit} from '@angular/core';

import {UnsubscriberComponent} from '../core';
import {IntegrationService} from '../integration/integration.service';
import {InventoryService} from './inventory.service';
import {AccountService} from '../account/account.service';

@Component({
    selector: 'filter',
    template: require('./filter.component.html'),
})
export class FilterComponent extends UnsubscriberComponent implements OnInit {
    public showAllFilters = false;
    public activeFilters = [];
    public integrations = [];
    public filters = [
        {
            id: 'active',
            show: true,
            type: 'integration',
            name: 'ACTIVE',
            input: 'select',
            value: 1,
            active: false,
            options: [
                { value: 1, name: 'YES' },
                { value: 0, name: 'NO' }
            ]
        },
        {
            id: 'private_reference',
            show: true,
            active: false,
            type: 'simple',
            name: 'PRIVATE_REFERENCE',
            input: 'text'
        },
        {
            id: 'quantity',
            show: true,
            active: false,
            type: 'simple',
            name: 'QUANTITY',
            input: 'range',
            mode: 'gt'
        },
        {
            id: 'private_name',
            show: true,
            active: false,
            type: 'simple',
            name: 'PRIVATE_NAME',
            input: 'text'
        },
        {
            id: 'last_sold',
            show: true,
            active: false,
            type: 'simple',
            name: 'LAST_SOLD',
            input: 'daterange',
            mode: 'after'
        },
    ];

    constructor(
        private _integrationService: IntegrationService,
        private _inventoryService: InventoryService,
        private _accountService: AccountService
    ) {
        super();
    }

    showAll() {
        this.showAllFilters = true;
        for (let f of this.filters) {
            f.show = true;
        }
    }

    clear() {
        this.activeFilters = [];
        for (let f of this.filters) {
            f.active = false;
        }

        // Fetch new data without filters
        this.submit();
    }

    submit() {
        // Fetch inventory with our filters
        // Force switch to page 1
        let filterData = [];

        for (let filter of this.activeFilters) {
            if (filter.id === 'active') {
                let ig = this._integrationService.getIntegration(filter.integration);
                filterData.push('filter[' + ig.market_id + '_' + ig.id + '_active][data]=' + (filter.value == '1' ? 'true' : 'false'));
            } else if(filter.id == 'private_reference' || filter.id == 'private_name' || filter.id == 'automatic_price_adjust') {
                filterData.push('filter[' + filter.id + '][data]=' + filter.value);
            } else if(filter.id == 'quantity') {
                filterData.push('filter[quantity][data]=' + filter.value);
                filterData.push('filter[quantity][type]=' + filter.mode);
            } else if(filter.id == 'last_sold') {
                filterData.push('filter[quantity][data][first]=' + Math.round(new Date(filter.value).getTime() / 1000));
                filterData.push('filter[quantity][type]=' + filter.mode);
            }
        }

        this._inventoryService.getInventory(null, 1, null, null, null, filterData);
    }

    marketName(marketId) {
        return this._integrationService.marketName(marketId);
    }

    numIntegrations(marketId) {
        return this._integrationService.numIntegrations(marketId);
    }

    toggle(filter) {
        console.log("toggle", filter);
        let index = this.activeFilters.indexOf(filter);
        if (index === -1) {
            filter.active = true;
            this.activeFilters.push(filter);
        } else {
            filter.active = false;
            this.activeFilters.splice(index, 1);
        }
    }

    ngOnInit() {
        this.subscriptions.push(
            this._integrationService.integration$.subscribe(integrations => {
                this.integrations = integrations;

                // Select the first integration on all filters that is of type integration
                if (this.integrations.length > 0) {
                    for (let f of this.filters) {
                        if (f.type == "integration") {
                            f['integration'] = this.integrations[0].id;
                        }
                    }
                }
            }));

        // Add extra filters for premium users
        this.subscriptions.push(
            this._accountService.account$.subscribe(account => {
                if (account.account_type !== 'whitelabel') {
                    this.filters.push({
                        id: 'automatic_price_adjust',
                        show: false,
                        active: false,
                        type: 'simple',
                        name: 'FILTER_AUTOPRICE_ADJUST',
                        input: 'select',
                        value: 1,
                        options: [
                            { value: 1, name: 'YES' },
                            { value: 0, name: 'NO' }
                        ]
                    });

                    this.filters.push({
                        id: 'automatic_pricing',
                        show: false,
                        active: false,
                        type: 'simple',
                        name: 'FILTER_AUTOPRICE',
                        input: 'select',
                        value: 1,
                        options: [
                            { value: 1, name: 'YES' },
                            { value: 0, name: 'NO' }
                        ]
                    });
                }
            }));

        this._integrationService.get();
        this._accountService.getAccount();
    }
}

import {Component, Input, Output, EventEmitter} from '@angular/core';
import {UnsubscriberComponent} from '../../core';
import {IntegrationService} from '../../integration/integration.service';
import {Angulartics2GoogleAnalytics} from 'angulartics2/src/providers/angulartics2-google-analytics';
import {PropertyService} from '../property.service';
import {AccountService} from '../../account/account.service';

@Component({
    selector: 'section-category',
    template: require('./section-category.component.html')
})
export class SectionCategoryComponent extends UnsubscriberComponent {
    @Input('product') product;
    @Input('integrations') integrations;
    @Output('change') change = new EventEmitter();
    public selectedCategory;
    public account;

    constructor(
        private _accountService: AccountService,
        private _analytics: Angulartics2GoogleAnalytics,
        private _integrationService: IntegrationService,
        private _propService: PropertyService
    ) {
        super();
    }

    marketWithCategories(integration) {
        if ([1, 5, 10, 11, 12, 13].indexOf(integration.market_id) !== -1) {
            return true;
        }

        if (integration.market_id == 6 && integration.version != '1') {
            return true;
        }

        return false;
    }

    onChangeCategory(val) {
        if (val) {
            // Update categories on each integration/market
            for (let n in this.integrations) {
                const ig = this.integrations[n];

                // If we have that market id id
                if (val.map.hasOwnProperty(ig.market_id)) {
                    this._setCategory(ig.id, val.map[ig.market_id].id, val.map[ig.market_id].crumb);
                } else if (val.map.hasOwnProperty(ig.id)) {
                    this._setCategory(ig.id, val.map[ig.id].id, val.map[ig.id].crumb);
                }
            }

            this.selectedCategory = val;
            this.change.emit(val.id);

            // Update properties to use this category
            this._propService.get(this.product.id, this.product.categories);
        }
    }

    onIntegrationSelect(integration, selected) {
        if (selected !== null && integration !== undefined) {
            this._setCategory(integration.id, selected.id, selected.crumb);

            // Update properties to use this category
            this._propService.get(this.product.id, this.product.categories);
        }
    }

    onIntegrationSelectMultiple(integration, selected) {
        if (selected !== null) {
            this.product.categories[integration] = selected;

            // Update properties to use this category
            this._propService.get(this.product.id, this.product.categories);
        }
    }

    marketName(id) {
        return this._integrationService.marketName(id);
    }

    private _setCategory(integrationId, categoryId, crumb) {
        this.product.categories[integrationId][0].category_id = categoryId;
        this.product.categories[integrationId][0].crumb = crumb;
    }

    ngOnInit() {
        this.subscriptions.push(
            this._accountService.account$.subscribe(account => this.account = account));
        this._accountService.getAccount();
    }
}

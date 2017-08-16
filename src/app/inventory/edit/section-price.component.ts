import {Component, Input} from '@angular/core';
import {TranslatePipe} from '../../core';
import {UnsubscriberComponent} from '../../core';
import {IntegrationService} from '../../integration/integration.service';
import {Angulartics2GoogleAnalytics} from 'angulartics2/src/providers/angulartics2-google-analytics';
import {AccountService} from '../../account/account.service';

@Component({
    selector: 'section-price',
    template: require('./section-price.component.html')
})
export class SectionPriceComponent extends UnsubscriberComponent {
    @Input('product') product;
    @Input('mode') mode;
    @Input('integrations') integrations;
    public cdonCountries;
    public amazonCountries;
    public account;

    constructor(
        private _accountService: AccountService,
        private _analytics: Angulartics2GoogleAnalytics,
        private _integrationService: IntegrationService,
        private _translate: TranslatePipe
    ) {
        super();
    }

    marketName(marketId) {
        return this._integrationService.marketName(marketId);
    }

    updateAutomaticPricingFlag() {
        setTimeout(() => {
            if (this.product.target_price != '' || this.product.automatic_price_adjust || this.product.automatic_price_adjust == '1') {
                this.product.automatic_pricing = '1';
            } else {
                this.product.automatic_pricing = '0';
            }
        }, 100);
    }

    hasStore(integration) {
        return integration.extra == '1';
    }

    ngOnInit() {
        this.cdonCountries = [
            { code: 'SE', name: this._translate.translate('COUNTRY_SE'), 'currency': 'SEK' },
            { code: 'NO', name: this._translate.translate('COUNTRY_NO'), 'currency': 'NOK' },
            { code: 'DK', name: this._translate.translate('COUNTRY_DK'), 'currency': 'DKK' },
            { code: 'FI', name: this._translate.translate('COUNTRY_FI'), 'currency': 'EUR' }
        ];

        this.amazonCountries = [
            { code: 'de', name: this._translate.translate('COUNTRY_DE'), 'currency': 'EUR' },
            { code: 'es', name: this._translate.translate('COUNTRY_ES'), 'currency': 'EUR' },
            { code: 'fr', name: this._translate.translate('COUNTRY_FR'), 'currency': 'EUR' },
            { code: 'it', name: this._translate.translate('COUNTRY_IT'), 'currency': 'EUR' },
            { code: 'uk', name: this._translate.translate('COUNTRY_UK'), 'currency': 'GBP' },
        ];

        this.subscriptions.push(this._accountService.account$.subscribe(account => this.account = account));
        this.subscriptions.push(this._integrationService.integration$.subscribe(integrations => {
            this.integrations = integrations;

            // Add default values to price change mode
            if (this.mode == 'bulkedit') {
                this.product.target_price_bulk_mode = 'change';
                this.product.recommended_price_bulk_mode = 'change';
                this.product.minimum_price_bulk_mode = 'change';
                this.product.prices = {};

                for (let integration of integrations) {
                    if (integration.market_id == 1) {
                        this.product.prices[integration.id] = {
                            'auction': {
                                'start': '',
                                'start_bulk_mode': 'change',
                                'buynow': '',
                                'buynow_bulk_mode': 'change',
                                'reserve': '',
                                'reserve_bulk_mode': 'change'
                            },
                            'store': '',
                            'store_bulk_mode': 'change'
                        };
                    } else if (integration.market_id == 5) {
                        this.product.prices[integration.id] = {
                            'store': '',
                            'store_bulk_mode': 'change',
                            'campaign': '',
                            'campaign_bulk_mode': 'change'
                        };
                    } else if (integration.market_id == 6) {
                        this.product.prices[integration.id] = {
                            'sv': {
                                'store': '',
                                'store_bulk_mode': 'change',
                                'regular': '',
                                'regular_bulk_mode': 'change'
                            }
                        };
                    } else if (integration.market_id == 10) {
                        this.product.prices[integration.id] = {};

                        for (let c of this.cdonCountries) {
                            this.product.prices[integration.id][c.code] = {
                                'store': '',
                                'store_bulk_mode': 'change',
                                'regular': '',
                                'regular_bulk_mode': 'change'
                            };
                        }
                    } else if (integration.market_id == 11) {
                        this.product.prices[integration.id] = {
                            'sv': {
                                'store': '',
                                'store_bulk_mode': 'change',
                                'campaign': '',
                                'campaign_bulk_mode': 'change'
                            }
                        };
                    } else if (integration.market_id == 12) {
                        this.product.prices[integration.id] = {
                            'sv': {
                                'store': '',
                                'store_bulk_mode': 'change',
                                'campaign': '',
                                'campaign_bulk_mode': 'change'
                            }
                        };
                    } else if (integration.market_id == 13) {
                        this.product.prices[integration.id] = {};

                        for (let c of this.amazonCountries) {
                            this.product.prices[integration.id][c.code] = {
                                'store': '',
                                'store_bulk_mode': 'change'
                            };
                        }
                    }
                }
            }
        }));
        this._accountService.getAccount();
        this._integrationService.get();
    }
}

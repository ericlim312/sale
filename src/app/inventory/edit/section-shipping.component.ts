import {Component, Input} from '@angular/core';
import {TranslatePipe} from '../../core';
import {IntegrationService} from '../../integration/integration.service';
import {Angulartics2GoogleAnalytics} from 'angulartics2/src/providers/angulartics2-google-analytics';

@Component({
    selector: 'section-shipping',
    template: require('./section-shipping.component.html')
})
export class SectionShippingComponent {
    @Input('product') product;
    @Input('integrations') integrations;
    public cdonCountries;
    public cdonShippingClasses;

    constructor(
        private _analytics: Angulartics2GoogleAnalytics,
        private _integrationService: IntegrationService,
        private _translate: TranslatePipe
    ) {}

    marketName(marketId) {
        return this._integrationService.marketName(marketId);
    }

    numIntegrations(marketId) {
        let num = 0;
        for (let ig of this.integrations) {
            if (ig.market_id === marketId) {
                num++;
            }
        }

        return num;
    }

    ngOnInit() {
        // Cdon countries
        this.cdonCountries = [
            { id: 'SE', name: this._translate.translate('COUNTRY_SE') },
            { id: 'NO', name: this._translate.translate('COUNTRY_NO') },
            { id: 'DK', name: this._translate.translate('COUNTRY_DK') },
            { id: 'FI', name: this._translate.translate('COUNTRY_FI') },
        ];

        this.cdonShippingClasses = [
            { id: '', name: this._translate.translate('CDON_STANDARD_SHIPPING') },
            { id: '0', name: this._translate.translate('FREE_SHIPPING') },
            { id: 'I', name: 'I - 19 SEK' },
            { id: 'A', name: 'A - 29 SEK' },
            { id: 'H', name: 'H - 39 SEK' },
            { id: 'B', name: 'B - 49 SEK' },
            { id: 'C', name: 'C - 79 SEK' },
            { id: 'D', name: 'D - 99 SEK' },
            { id: 'E', name: 'E - 199 SEK' }
        ];
    }
}

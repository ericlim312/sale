import {Component, Input} from '@angular/core';
import {Angulartics2GoogleAnalytics} from 'angulartics2/src/providers/angulartics2-google-analytics';

@Component({
    selector: 'where-to-sell',
    template: require('./where-to-sell.component.html')
})
export class InventoryEditWhereToSellComponent {
    @Input('productIntegrations') productIntegrations;
    @Input('integrations') integrations;

    constructor(private _analytics: Angulartics2GoogleAnalytics) {}

    hasStore(integration) {
        return integration.extra == '1';
    }

    shouldShow() {
        // Only show this component if there are at least one Tradera integration with store or any other integration
        let show = false;

        for (let integration of this.integrations) {
            if (integration.market_id != '1') {
                return true;
            }
            if (integration.market_id == '1' && this.hasStore(integration)) {
                return true;
            }
        }

        return false;
    }
}

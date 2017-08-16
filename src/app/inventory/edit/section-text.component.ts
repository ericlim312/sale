import {Component, Input} from '@angular/core';
import {TranslatePipe} from '../../core';
import {IntegrationService} from '../../integration/integration.service';
import {Angulartics2GoogleAnalytics} from 'angulartics2/src/providers/angulartics2-google-analytics';
import {AccountService} from '../../account/account.service';
import {UnsubscriberComponent} from '../../core/unsubscriber.component';

@Component({
    selector: 'section-text',
    template: require('./section-text.component.html')
})
export class SectionTextComponent extends UnsubscriberComponent {
    @Input('languages') languages;
    @Input('mode') mode;
    @Input('product') product;
    @Input('integrations') integrations;
    private _account;

    constructor(
        private _analytics: Angulartics2GoogleAnalytics,
        private _translate: TranslatePipe,
        private _integrationService: IntegrationService,
        private _accountService: AccountService
    ) {
        super();
    }

    numIntegrations(marketId) {
        let num = 0;

        for (let n in this.integrations) {
            if (this.integrations[n].market_id == marketId) {
                num++;
            }
        }

        return num;
    }

    marketName(marketId) {
        return this._integrationService.marketName(marketId);
    }

    shouldBeForcedOpen(lang) {
        // If creating product, show text in user's lang code
        if (this.mode == 'create' && this._account.lang_code == lang.code) {
            return true;
        }

        return false;
    }

    getTextInLang(integration, lang) {
        // If not loaded yet
        if (integration === undefined || !integration.hasOwnProperty('id')) {
            return false;
        }

        // If this integration doesn't have a text
        if (!this.product.texts.hasOwnProperty(integration.id)) {
            return false;
        }

        // Return the text if it's available, else false
        if (this.product.texts[integration.id].hasOwnProperty(lang.code)) {
            return this.product.texts[integration.id][lang.code];
        } else {
            return false;
        }
    }

    setTextType(integration, lang, type) {
        this.product.texts[integration.id][lang.code].type = type;
    }

    addButtonText(integration) {
        let marketName = this._integrationService.marketName(integration.market_id);

        let str = this._translate.translate('ADD_TEXT_FOR') + " " + marketName;

        // If there are multiple integrations, append display name
        if (this.numIntegrations(integration.market_id) > 1) {
            str += " (" + integration.display_name + ")";
        }

        return str;
    }

    ngOnInit() {
        this.subscriptions.push(
            this._accountService.account$.subscribe(account => this._account = account));
        this._accountService.getAccount();
    }
}

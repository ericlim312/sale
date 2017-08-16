import {Component, Input} from '@angular/core';
import {TranslatePipe} from '../../core';
import {IntegrationService} from '../../integration/integration.service';
import {Angulartics2GoogleAnalytics} from 'angulartics2/src/providers/angulartics2-google-analytics';

@Component({
    selector: 'section-inventory',
    template: require('./section-inventory.component.html')
})
export class SectionInventoryComponent {
    @Input('product') product;
    @Input('integrations') integrations;

    constructor(
        private _analytics: Angulartics2GoogleAnalytics,
        private _integrationService: IntegrationService,
        private _translate: TranslatePipe
    ) {}

    ngOnInit() {

    }
}

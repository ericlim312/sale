import {Component, Input} from '@angular/core';
import {TranslatePipe} from '../../core';
import {IntegrationService} from '../../integration/integration.service';
import {Angulartics2GoogleAnalytics} from 'angulartics2/src/providers/angulartics2-google-analytics';

@Component({
    selector: 'section-details',
    template: require('./section-details.component.html')
})
export class SectionDetailsComponent {
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

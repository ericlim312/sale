import { Component, Input } from '@angular/core';

import { Angulartics2GoogleAnalytics } from 'angulartics2/src/providers/angulartics2-google-analytics';


@Component({
    selector: 'section-myitem',
    template: require('./section-myitem.component.html')
})
export class SectionMyitemComponent {
    @Input('product') product;

    constructor(
        private _analytics: Angulartics2GoogleAnalytics
    ) {}
}

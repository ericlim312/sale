import {Component, Input, Output, EventEmitter} from '@angular/core';
import {Angulartics2GoogleAnalytics} from 'angulartics2/src/providers/angulartics2-google-analytics';

@Component({
    selector: 'edit-buttons',
    template: require('./buttons.component.html')
})
export class InventoryEditButtonsComponent {
    @Input('product') product;
    @Output('cancel') cancelEvent = new EventEmitter();
    @Output('save') saveEvent = new EventEmitter();

    constructor(private _analytics: Angulartics2GoogleAnalytics) {}

    onCancel() {
        this.cancelEvent.next({});
    }
    onSave() {
        this.saveEvent.next({});
    }
}

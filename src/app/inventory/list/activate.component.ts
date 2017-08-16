import {Component, Input, OnInit, ViewContainerRef} from '@angular/core';
import {TranslatePipe} from '../../core';
import {InventoryService} from '../inventory.service';
import {AlertService} from '../../core';
import {Angulartics2GoogleAnalytics} from 'angulartics2/src/providers/angulartics2-google-analytics';
import {Modal} from 'angular2-modal/plugins/bootstrap';

@Component({
    selector: 'product-activate-button',
    template: require('./activate.component.html')
})

export class ProductActivateButton implements OnInit {
    @Input('product') product: any;
    @Input('key') key: any;
    public isActive: boolean;
    public hoverActive: boolean = false;

    constructor(
        private _inventoryService: InventoryService,
        private _alertService: AlertService,
        private _translate: TranslatePipe,
        private _analytics: Angulartics2GoogleAnalytics,
        private _modal: Modal,
        private _viewContainer: ViewContainerRef
    ) {}

    onSetState(state) {
        let parts = this.key.split('_');
        this.isActive = state;
        this._inventoryService.setState(this.product.id, parts[1], state).then(res => {
            console.info('Set state success on ' + this.product.id);
        }).catch(error => {
            // Show error dialog
            let buf = ['<ul>'];
            for (var n in error.errors) {
                this._analytics.eventTrack(error.errors[n], {
                    category: 'inventoryListSetStateError'
                });

                buf.push('<li>' + this._translate.translate(error.errors[n]) + '</li>');
            }
            buf.push('</ul>');

            this._alertService.alert(
                this._translate.translate('ERROR_COULD_NOT_ACTIVATE'),
                '#' + error.productId + ': ' + error.productName +
                buf.join(''),
                this._translate.translate('BTN_CLOSE'),
                this._modal,
                this._viewContainer
            );

            this.isActive = false;
        });
    }

    ngOnInit() {
        this.isActive = this.product[this.key] && this.product[this.key].active === 1;
    }
}

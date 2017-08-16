import {Component, Input, ViewContainerRef} from '@angular/core';
import {TranslatePipe} from '../../core';
import {InventoryService} from '../inventory.service';
import {AlertService} from '../../core';
import {Angulartics2GoogleAnalytics} from 'angulartics2/src/providers/angulartics2-google-analytics';
import {Modal} from 'angular2-modal/plugins/bootstrap';

@Component({
    selector: 'product-quantity',
    template: require('./quantity.component.html')
})

export class ProductQuantityComponent {
    @Input('product') product: any;

    constructor(
        private _inventoryService: InventoryService,
        private _alertService: AlertService,
        private _translate: TranslatePipe,
        private _modal: Modal,
        private _viewContainer: ViewContainerRef,
        private _analytics: Angulartics2GoogleAnalytics
    ) {}

    onChangeQuantity(mode) {
        this._alertService.prompt(
            this._translate.translate('INVENTORY_QUANTITY_PROMPT_HEADER'),
            mode == 'increase' ? this._translate.translate('INVENTORY_QUANTITY_PROMPT_INCREASE') : this._translate.translate('INVENTORY_QUANTITY_PROMPT_DECREASE'),
            this._translate.translate('BTN_EDIT'),
            this._translate.translate('BTN_CANCEL'),
            '',
            this._modal,
            this._viewContainer
        ).then((resultPromise) => {
            return resultPromise.result.then((num) => {
                if (num) {
                    this._inventoryService.getProduct(this.product.id).subscribe(product => {
                        let doChange = false;
                        if (parseInt(product.quantity) !== parseInt(this.product.quantity)) {
                            this._alertService.confirm(
                                this._translate.translate('OOPS'),
                                this._translate.translate('INVENTORY_QUANTITY_CHANGED').replace('{{ from }}', this.product.quantity).replace('{{ to }}', product.quantity),
                                this._translate.translate('BTN_EDIT'),
                                this._translate.translate('BTN_CANCEL'),
                                this._modal,
                                this._viewContainer
                            ).then((resultPromise) => {
                                return resultPromise.result
                                    .then((result) => {
                                        if (!result) {
                                            return;
                                        }

                                        this.changeQuantity(mode, product, num);
                                    })
                                    .catch(() => {});
                            });
                        } else {
                            this.changeQuantity(mode, product, num);
                        }
                    });
                }
            });
        });
    }

    changeQuantity(mode, product, num) {
        if (mode === 'increase') product.quantity += parseInt(num);
        if (mode === 'decrease') product.quantity -= parseInt(num);

        if (product.quantity < 0) {
            this._alertService.alert(
                this._translate.translate('OOPS'),
                this._translate.translate('INVENTORY_QUANTITY_CHANGE_0'),
                this._translate.translate('BTN_CLOSE'),
                this._modal,
                this._viewContainer
            );

            return;
        }

        // Dispatch the request
        this._inventoryService.editProduct(this.product.id, { 'folder_id': product.folder_id, 'quantity': product.quantity })
            .subscribe(res => console.info('Quantity updated on product ' + this.product.id));
    }
}

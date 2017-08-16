import { Component, Input, ViewContainerRef } from '@angular/core';
import { Modal } from 'angular2-modal/plugins/bootstrap';

import { EditModalService } from '../edit/modal.service';
import { StatsModalService } from '../stats/modal.service';
import { TranslatePipe } from '../../core';
import { InventoryService } from '../inventory.service';
import { AlertService } from '../../core';

@Component({
    selector: 'product-edit-button',
    providers: [EditModalService],
    template: require('./edit-button.component.html'),
    styles: [
        `
        a {
            cursor: pointer;
        }
        `
    ]
})

export class ProductEditButton {
    @Input('product') product: any;

    constructor(
        private _editModalService: EditModalService,
        private _statsModalService: StatsModalService,
        private _viewContainer: ViewContainerRef,
        private _inventoryService: InventoryService,
        private _alertService: AlertService,
        private _translate: TranslatePipe,
        private _modal: Modal
    ) {}

    openDialog() {
        this._editModalService.openDialog(this.product.id, this._viewContainer, 'edit');
    }

    statistics() {
        this._statsModalService.openDialog(this.product.id, this._viewContainer);
    }

    delete() {
        this._alertService.confirm(
            this._translate.translate('DELETE_PRODUCT_TITLE'),
            this._translate.translate('DELETE_PRODUCT_TEXT'),
            this._translate.translate('BTN_CONFIRM_DELETE'),
            this._translate.translate('BTN_CANCEL'),
            this._modal,
            this._viewContainer
        ).then((resultPromise) => {
            return resultPromise.result.then((result) => {
                // If we should delete
                if (result) {
                    this._inventoryService.deleteProducts([this.product.id]).subscribe(res => {});
                }
            });
        });
    }

    copy() {
        this._inventoryService.copyProducts([ this.product.id ]).subscribe(res => {
            this._editModalService.openDialog(res[0].copy, this._viewContainer, 'edit');
        });
    }
}

import { Component } from '@angular/core';
import { DialogRef, ModalComponent } from 'angular2-modal';
import { ProductStatsWindowData } from './product-stats-window-data';

@Component({
    selector: 'modal-content',
    template: `
    <inventory-stats-wrapper [productId]="productId" (cancel)="onCancel()" mode="dialog"></inventory-stats-wrapper>
    `
})
export class ProductStatsWindow implements ModalComponent<ProductStatsWindowData> {
    context: ProductStatsWindowData;
    public productId;

    constructor(public dialog: DialogRef<ProductStatsWindowData>) {
        this.context = dialog.context;
        this.context.size = 'lg';
        this.productId = this.context.productId;
    }

    beforeDismiss() {
        return false;
    }

    beforeClose() {
        return false;
    }

    onCancel() {
        this.dialog.close();
    }
}

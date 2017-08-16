import { Component } from '@angular/core';
import { DialogRef, ModalComponent } from 'angular2-modal';

import { ProductEditWindowData } from './product-edit-window-data';

@Component({
    selector: 'modal-content',
    template: `
    <inventory-edit-wrapper [productId]="productId" (cancel)="onCancel()" (saved)="onSave(product)" [dialogType]="dialogType" restrictHeight="true"></inventory-edit-wrapper>
    `
})
export class ProductEditWindow implements ModalComponent<ProductEditWindowData> {
    context: ProductEditWindowData;
    public productId;
    public dialogType;

    constructor(public dialog: DialogRef<ProductEditWindowData>) {
        this.context = dialog.context;
        this.context.size = 'lg';
        this.productId = this.context.productId;
        this.dialogType = this.context.modalType === '' ? 'edit' : this.context.modalType;
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

    onSave(product) {
        this.dialog.close();
    }
}

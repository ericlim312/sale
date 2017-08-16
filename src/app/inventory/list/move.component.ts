import { Component } from '@angular/core';
import { DialogRef, ModalComponent } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { InventoryService } from '../inventory.service';

export class ProductMoveWindowData extends BSModalContext {
    constructor(public productIds: any) {
        super();
    }
}

@Component({
    selector: 'modal-content',
    template: `
<div class="modal-header">
    <h3 class="modal-title">{{ 'MOVE_PRODUCT_TITLE'|translate }}</h3>
</div>
<div class="modal-body">
    <div class="form-group">
        <label for="folder">{{ 'SELECT_NEW_FOLDER'|translate }}</label>
        <select id="folder" [(ngModel)]="folder" class="form-control" folder-select></select>
    </div>
</div>
<div class="modal-footer">
    <button class="cancel-button" type="button" (click)="onCancel()">{{ 'BTN_CANCEL'|translate }}</button>
    <button class="action-button" type="button" (click)="onSave()" *ngIf="!isMoving">{{ 'BTN_SAVE'|translate }}</button>
    <button class="action-button" type="button" *ngIf="isMoving"><i class="fa fa-spinner fa-pulse"></i> {{ 'BTN_SAVE'|translate }}</button>
</div>
    `
})
export class ProductMoveWindow implements ModalComponent<ProductMoveWindowData> {
    context: ProductMoveWindowData;
    public productIds;
    public isMoving = false;
    public folder = 0;

    constructor(
        public dialog: DialogRef<ProductMoveWindowData>,
        private _inventoryService: InventoryService
    ) {
        this.context = dialog.context;
        this.context.size = 'sm';
        this.productIds = this.context.productIds;
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

    onSave() {
        this.isMoving = true;

        this._inventoryService.bulkeditProduct(this.productIds, {
            folder_id: this.folder
        }).subscribe((result) => {
            this.isMoving = false;
            this.dialog.close();
        });
    }
}

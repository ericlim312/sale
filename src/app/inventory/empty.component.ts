import { Component, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { InventoryService } from './inventory.service';
import { EditModalService } from './edit/modal.service';

@Component({
    selector: 'inventory-empty',
    template: require('./empty.component.html'),
})
export class InventoryEmptyComponent {
    public constructor(
        private _inventoryService: InventoryService,
        private _router: Router,
        private _modalService: EditModalService,
        private _viewContainer: ViewContainerRef
    ) {}

    createFirstProduct() {
        this._inventoryService
            .addProduct({ folder: this._inventoryService.currentFolder })
            .subscribe((product) => {
                this._modalService.openDialog(product.id, this._viewContainer, 'create');
            });
    }
}

import {Component, Input, ViewContainerRef} from '@angular/core';
import {Angulartics2GoogleAnalytics} from 'angulartics2/src/providers/angulartics2-google-analytics';
import {GroupModalService} from '../group-modal.service';
import {InventoryService} from '../inventory.service';
import {EditModalService} from '../edit/modal.service';

@Component({
    selector: '[inventory-list-group]',
    template: require('./group.component.html')
})
export class InventoryListGroupComponent {
    @Input('group') group;
    @Input('columns') columns;

    public inventory;
    public isCopyingProduct = false;

    constructor(
        private _analytics: Angulartics2GoogleAnalytics,
        private _viewContainer: ViewContainerRef,
        private _inventoryService: InventoryService,
        private _groupModal: GroupModalService,
        private _modalService: EditModalService
    ) {}

    onEditGroup(group) {
        // Fetch
        let ids = [];
        for (let prod of group.products) {
            ids.push(prod.id);
        }

        this._groupModal.openDialog(ids, this._viewContainer, 'edit', group.group_id);
    }

    addVariation(group) {
        this.isCopyingProduct = true;

        this._inventoryService.copyProducts([group.main_id], true).subscribe(res => {
            this.isCopyingProduct = false;
            this._modalService.openDialog(res[0].copy, this._viewContainer, 'create');
        });
    }
}

import {Component, OnInit} from '@angular/core';
import {Angulartics2GoogleAnalytics} from 'angulartics2/src/providers/angulartics2-google-analytics';
import {DialogRef, ModalComponent} from 'angular2-modal';
import {InventoryService} from './inventory.service';
import {GroupService} from './group.service';
import { GroupProductWindowData } from './group-window.component';

@Component({
    selector: 'modal-content',
    providers: [GroupService],
    template: require('./group.component.html')
})
export class GroupProductWindow implements OnInit, ModalComponent<GroupProductWindowData> {
    context: GroupProductWindowData;
    public products = [];
    public groupType = '';
    public isSaving = false;
    public groupId;
    public dialogType;
    public mainProduct;
    private productIds;

    constructor(
        public dialog: DialogRef<GroupProductWindowData>,
        private _analytics: Angulartics2GoogleAnalytics,
        private _inventoryService: InventoryService,
        private _groupService: GroupService
    ) {
        this.productIds = dialog.context.products;
        this.dialogType = dialog.context.type;
        this.groupId = dialog.context.id;
        this.context = dialog.context;
        this.context.size = 'lg';
    }

    onCancel() {
        this.dialog.close();
    }

    onSave(product) {
        this.isSaving = true;
        let data = {
            main: this.mainProduct,
            type: this.groupType,
            products: this.products
        };

        // If we should create a new group
        if (this.dialogType === 'create') {
            this._groupService.addGroup(data).subscribe(grp => {
                // Update group on those products in inventory
                for (let product of this.products) {
                    this._inventoryService.setGroup(product.id, grp.id);
                }
                this.dialog.close(grp);
            });
        } else {
            this._groupService.editGroup(this.groupId, data).subscribe(grp => {
                this.dialog.close(grp);
            });
        }
    }

    beforeDismiss() {
        return false;
    }

    beforeClose() {
        return false;
    }

    ngOnInit() {
        this._inventoryService.getMultipleProducts(this.productIds).subscribe(products => {
            for (let productId in products) {
                if (this.groupType === '') {
                    this.groupType = products[productId].group.type;
                }

                // Loop variation names
                let variationNames = [];
                for (let lang in products[productId].group.products[productId].variation_names) {
                    if (products[productId].group.products[productId].variation_names[lang] !== null) {
                        variationNames.push({
                            lang: lang,
                            name: products[productId].group.products[productId].variation_names[lang]
                        });
                    }
                }

                // If no variation name exist, add an empty swedish name
                if (variationNames.length === 0) {
                    variationNames.push({
                        lang: 'sv',
                        name: ''
                    });
                }

                // If this is the main product
                if (products[productId].group.products[productId].main) {
                    this.mainProduct = parseInt(productId);
                }

                this.groupType = products[productId].group.type;
                this.products.push({
                    'id': products[productId].id,
                    'name': products[productId].texts[99].sv.name,
                    'variation_names': variationNames,
                    'is_main': products[productId].group.products[productId].main
                });
            }
        });
    }
}


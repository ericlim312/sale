import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {InventoryService} from '../inventory.service';
import {FolderService} from '../folder.service';
import {TemplateService} from '../template.service';
import {BrandService} from '../brand.service';
import {PropertyService} from '../property.service';
import {ManufacturerService} from '../manufacturer.service';
import {CategoryService} from '../../category';
import {CountryService} from '../../core';
import {UnsubscriberComponent} from '../../core';

@Component({
    selector: 'inventory-edit',
    providers: [InventoryService, FolderService, TemplateService, BrandService, ManufacturerService, CategoryService, PropertyService, CountryService],
    template: `
    <inventory-edit-wrapper [productId]="productId" restrictHeight="true" (saved)="onSave(product)" dialogType="edit"></inventory-edit-wrapper>
    `
})
export class InventoryEditComponent extends UnsubscriberComponent implements OnInit {
    public productId;
    public integrations;
    public traderaIntegration = false; // This is used for whitelabel users only

    constructor(
        private _inventoryService: InventoryService,
        private _route: ActivatedRoute,
        private _router: Router
    ) {
        super();
    }

    onSave(product) {
        console.info('Got submit event in edit');
        this._router.navigateByUrl('/inventory');
    }

    ngOnInit() {
        this.subscriptions.push(
            this._route.params.subscribe(params => {
                this.productId = params['productId'];
            }));
    }
}

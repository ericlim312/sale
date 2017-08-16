import { Injectable, ViewContainerRef } from '@angular/core';

import { Modal } from 'angular2-modal/plugins/bootstrap';
import { Angulartics2 } from 'angulartics2/src/core/angulartics2';
import { Angulartics2GoogleAnalytics } from 'angulartics2/src/providers/angulartics2-google-analytics';

import { ProductEditWindow } from '../edit/modal.component';
import { InventoryService } from '../inventory.service';
import { FolderService } from '../folder.service';
import { TemplateService } from '../template.service';
import { CategoryService } from '../../category';
import { BrandService } from '../brand.service';
import { ProductEditWindowData } from './product-edit-window-data';

@Injectable()
export class EditModalService {
    constructor(
      public modal: Modal,
      private _inventoryService: InventoryService,
      private _folderService: FolderService,
      private _templateService: TemplateService,
      private _categoryService: CategoryService,
      private _brandService: BrandService,
      private _analytics: Angulartics2GoogleAnalytics,
      private _analytics2: Angulartics2
    ) {}

    openDialog(productId:any, viewContainer:ViewContainerRef, modalType?) {
        this.modal.defaultViewContainer = viewContainer;
        return this.modal.open(ProductEditWindow, new ProductEditWindowData(productId, modalType))
            .then(dialog => dialog.result.catch(() => { /* user dismissed the modal, do nothing */ }));
    };
}

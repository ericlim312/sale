import { Injectable, Injector, ViewContainerRef} from '@angular/core';

import { Modal } from 'angular2-modal/plugins/bootstrap';
import { Angulartics2 } from 'angulartics2';
import { Angulartics2GoogleAnalytics } from 'angulartics2/src/providers/angulartics2-google-analytics';

import { GroupProductWindow } from './group.component';
import { GroupProductWindowData } from './group-window.component';
import { InventoryService } from './inventory.service';

@Injectable()
export class GroupModalService {
    constructor(
      private modal: Modal,
      private injector: Injector,
      private _inventoryService: InventoryService,
      private _analytics: Angulartics2GoogleAnalytics,
      private _analytics2: Angulartics2
    ) {}

    openDialog(products, viewContainer:ViewContainerRef, modalType?, groupId?) {
        this.modal.defaultViewContainer = viewContainer;
        this.modal.open(GroupProductWindow, new GroupProductWindowData(products, modalType, groupId))
    };
}

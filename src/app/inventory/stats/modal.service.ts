import { Injectable, provide, Injector, IterableDiffers, KeyValueDiffers, Input, ViewContainerRef} from '@angular/core';
import { Modal } from 'angular2-modal/plugins/bootstrap';
import { ProductStatsWindow } from './modal.component';
import { Angulartics2 } from 'angulartics2/src/core/angulartics2';
import { Angulartics2GoogleAnalytics } from 'angulartics2/src/providers/angulartics2-google-analytics';
import { ProductStatsWindowData } from './product-stats-window-data';

@Injectable()
export class StatsModalService {
    constructor(
      public modal: Modal,
      private _analytics: Angulartics2GoogleAnalytics,
      private _analytics2: Angulartics2
    ) {}

    openDialog(productId:any, viewContainer:ViewContainerRef) {
        this.modal.defaultViewContainer = viewContainer;
        this.modal.open(ProductStatsWindow, new ProductStatsWindowData(productId))
    };
}

import {Component, OnInit, OnDestroy, NgZone, Renderer, ElementRef, ViewContainerRef } from '@angular/core';
import {Angulartics2GoogleAnalytics} from 'angulartics2/src/providers/angulartics2-google-analytics';
import {Modal} from 'angular2-modal/plugins/bootstrap';
import {TranslatePipe} from '../../core';
import {UnsubscriberComponent} from '../../core';
import {EditModalService} from '../edit/modal.service';
import {InventoryService} from '../inventory.service';
import {AccountService} from '../../account/account.service';
import {IntegrationService} from '../../integration/integration.service';
import {GroupModalService} from '../group-modal.service';
import {OutboxService} from '../outbox.service';
import {AlertService} from '../../core';
import {ProductMoveWindow, ProductMoveWindowData} from './move.component';

@Component({
    selector: '[inventory-toolbar]',
    template: require('./toolbar.component.html'),
    host: {
        class: 'inventory-toolbar',
        '[class.active]': 'affixActive'
    }
})
export class InventoryToolbarComponent extends UnsubscriberComponent implements OnInit, OnDestroy {
    isCreatingProduct: boolean = false;
    isCreatingAuction: boolean = false;
    isCopyingProduct: boolean = false;
    isDeletingProduct: boolean = false;
    affixActive: boolean = false;
    public traderaIntegrations;
    public account;
    private inventory;
    private searchResult;
    private scrollListener;

    constructor (
        private _groupModal: GroupModalService,
        private _inventoryService: InventoryService,
        private _integrationService: IntegrationService,
        private _outboxService: OutboxService,
        private _alertService: AlertService,
        private _accountService: AccountService,
        private _translate: TranslatePipe,
        private _analytics: Angulartics2GoogleAnalytics,
        private _ngZone: NgZone,
        private _modal: Modal,
        private renderer: Renderer,
        private element: ElementRef,
        private _modalService: EditModalService,
        private _viewContainer: ViewContainerRef
    ) {
        super();

        let topOffset = 100;

        // Listen to scroll events
        this.scrollListener = this.renderer.listenGlobal('window', 'scroll', (evt) => {
            if (window.pageYOffset > topOffset ) {
                this.affixActive = true;
            } else {
                this.affixActive = false;
            }
        });
    }

    addAdnicProduct(data) {
        this._inventoryService.addProductFromAdnic(data).subscribe(res => console.log(res));
    }

    ngOnDestroy() {
        super.ngOnDestroy();

        // Kill the scroll listener
        this.scrollListener();
    }

    getCheckedProducts() {
        let checked = [];

        // If inventory or search result hasn't loaded yet
        if ( (this.searchResult === undefined || !this.searchResult.hasOwnProperty('data')) && (this.inventory === undefined || !this.inventory.hasOwnProperty('data'))) {
            return checked;
        }

        if (this.inventory !== undefined && this.inventory.hasOwnProperty('data')) {
            for (let n in this.inventory.data) {
                for (let i in this.inventory.data[n].products) {
                    if (this.inventory.data[n].products[i].checked) {
                        checked.push(this.inventory.data[n].products[i].id);
                    }
                }
            }
        }

        if (this.searchResult !== undefined && this.searchResult.hasOwnProperty('data')) {
            for (let n in this.searchResult.data) {
                for (let i in this.searchResult.data[n].products) {
                    if (this.searchResult.data[n].products[i].checked) {
                        checked.push(this.searchResult.data[n].products[i].id);
                    }
                }
            }
        }

        return checked;
    }

    onNewProduct() {
        this.isCreatingProduct = true;
        this._inventoryService.addProduct({ folder: this._inventoryService.currentFolder }).subscribe((product) => {
            // Open the dialog for editing
            this._modalService.openDialog(product.id, this._viewContainer, 'create');
            this.isCreatingProduct = false;
        });
    }

    onGroupProducts() {
        this._groupModal.openDialog(this.getCheckedProducts(), this._viewContainer, 'create');
    }

    onCreateAuction(integrationId) {
        this.isCreatingAuction = true;
        this._outboxService.addOutbox(integrationId, this.getCheckedProducts()).subscribe(outbox => {
            this.isCreatingAuction = false;

            if (Object.keys(outbox.errors).length > 0) {
                let tbl = ['<tr><th>' + this._translate.translate('PRODUCT_ID_SHORT') + '</th><th>' + this._translate.translate('ERRORS') + '</th>'];
                for (var pid in outbox.errors) {
                    tbl.push('<tr><td>' + pid + '</td><td>' + outbox.errors[pid].join('<br>') + '</td></tr>');

                    // Send to Analytics
                    for (let e in outbox.errors[pid]) {
                        this._analytics.eventTrack(outbox.errors[pid][e].split('- ')[1], {
                            category: 'inventoryListAuctionValidationError'
                        });
                    }
                }

                this._alertService.alert(
                    this._translate.translate('CREATE_AUCTION_VALIDATION_ERROR_HEADER'),
                    '<table class="table table-sm">' + tbl.join('') + '</table>',
                    this._translate.translate('BTN_CLOSE'),
                    this._modal,
                    this._viewContainer
                );
            }
        });
    }

    onCopyProduct() {
        this._alertService.confirm(
            this._translate.translate('COPY_PRODUCTS_TITLE'),
            this._translate.translate('COPY_PRODUCTS_TEXT'),
            this._translate.translate('COPY'),
            this._translate.translate('BTN_CANCEL'),
            this._modal,
            this._viewContainer
        ).then((resultPromise) => {
            return resultPromise.result
                .then((result) => {
                    if (!result) {
                        return;
                    }

                    // If we should copy
                    this.isCopyingProduct = true;
                    this._inventoryService.copyProducts(this.getCheckedProducts()).subscribe(res => {
                        this.isCopyingProduct = false;

                        // If only one product was copied, open modal
                        if (res.length === 1) {
                            this._modalService.openDialog(res[0].copy, this._viewContainer, 'create');
                        }
                    });
                })
                .catch(() => {});
        });
    }

    onMoveProduct() {
        this._modal.defaultViewContainer = this._viewContainer;
        this._modal.open(ProductMoveWindow, new ProductMoveWindowData(this.getCheckedProducts()));
    }

    onBulkedit() {
        let checked = this.getCheckedProducts();

        // If only one product is checked, do a normal edit
        if (checked.length === 1) {
            this._modalService.openDialog(checked[0], this._viewContainer, 'edit');
        } else {
            this._modalService.openDialog(checked, this._viewContainer, 'bulkedit');
        }
    }

    onDeleteProduct() {
        this._alertService.confirm(
            this._translate.translate('DELETE_PRODUCTS_TITLE'),
            this._translate.translate('DELETE_PRODUCTS_TEXT'),
            this._translate.translate('BTN_CONFIRM_DELETE'),
            this._translate.translate('BTN_CANCEL'),
            this._modal,
            this._viewContainer
        ).then((resultPromise) => {
            return resultPromise.result.then((result) => {
                // If we should delete
                if (result) {
                    this._inventoryService.deleteProducts(this.getCheckedProducts()).subscribe(res => {});
                }
            });
        });
    }

    ngOnInit() {
        this.subscriptions.push(
            this._integrationService.integration$.subscribe(integrations => {
                this.traderaIntegrations = [];

                // Build an array of Tradera integrations
                for (var n in integrations) {
                    if (integrations[n].market_id === 1) {
                        this.traderaIntegrations.push(integrations[n]);
                    }
                }
            }));
        this._integrationService.get();
        this.subscriptions.push(
            this._inventoryService.inventory$.subscribe(inventory => {
                this.inventory = inventory.inventory[inventory.currentFolder];

                if (inventory.hasOwnProperty('search') && inventory !== undefined) {
                    this.searchResult = inventory.search;
                }
            }));
        this.subscriptions.push(
            this._accountService.account$.subscribe(account => this.account = account));
        this._accountService.getAccount();
    }
}

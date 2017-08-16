import {Component, Input, Output, OnInit, EventEmitter, ViewContainerRef} from '@angular/core';
import {Modal} from 'angular2-modal/plugins/bootstrap';
import {TranslatePipe} from '../../core';
import {AlertService} from '../../core';
import {UnsubscriberComponent} from '../../core';
import {IntegrationService} from '../../integration/integration.service';
import {StatsService} from './stats.service';
import {AuctionService} from '../../auction/auction.service';

@Component({
    selector: 'inventory-stats-wrapper',
    providers: [StatsService, AuctionService],
    template: require('./stats-wrapper.component.html')
})
export class InventoryStatsWrapperComponent extends UnsubscriberComponent implements OnInit {
    @Input('productId') productId;
    @Input('mode') mode;
    @Output('cancel') cancel = new EventEmitter();
    public stats;
    public integrations;
    public active = 'overview';
    public activeIntegration = {};

    constructor(
        private _stats: StatsService,
        private _integrationService: IntegrationService,
        private _translate: TranslatePipe,
        private _alert: AlertService,
        private _modal: Modal,
        private _viewContainer: ViewContainerRef,
        private _auctionService: AuctionService
    ) {
        super();
    }

    getName(integration) {
        // Market name
        let name = this._integrationService.marketName(integration.market_id);

        // How many of this type are there?
        let num = this._integrationService.numIntegrations(integration.market_id);

        // Tradera (Gadgetbay)
        return name + (num > 1 ? ' (' + integration.display_name + ')' : '');
    }

    close() {
        this.cancel.emit(true);
    }

    getDisplayNameIfMoreThan1(integration) {
        let num = this._integrationService.numIntegrations(integration.market_id);
        return num > 1 ? integration.display_name : '';
    }

    cancelAuction(integration, row) {
        this._alert.confirm(
            this._translate.translate('CANCEL_AUCTION_TITLE'),
            this._translate.translate('CANCEL_AUCTION_TEXT'),
            this._translate.translate('BTN_CONFIRM_CANCEL_AUCTION'),
            this._translate.translate('BTN_CANCEL'),
            this._modal,
            this._viewContainer
        ).then((resultPromise) => {
            return resultPromise.result.then((result) => {
                // If we should delete
                if (result) {
                    this._auctionService.cancel(row.product_id, row.auction_id).subscribe(() => {
                        this.stats.active[integration.id].splice(this.stats.active[integration.id].indexOf(row), 1);
                    });
                }
            });
        });
    }

    pageHeading() {
        if (this.active == 'overview') {
            return this._translate.translate('PRODUCT_STATS_OVERVIEW');
        } else if (this.active == 'history') {
            return this._translate.translate('PRODUCT_STATS_HISTORY');
        } else if (this.active == 'integration') {
            return this.getName(this.activeIntegration);
        } else {
            return 'Unknown page';
        }
    }

    ngOnInit() {
        this.subscriptions.push(
            this._stats.stats$.subscribe(stats => this.stats = stats[this.productId]));
        this._stats.getStats(this.productId);

        this.subscriptions.push(
            this._integrationService.integration$.subscribe(integrations => this.integrations = integrations));
        this._integrationService.get();
    }
}

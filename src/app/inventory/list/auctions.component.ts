import {Component, Input, OnInit} from '@angular/core';
import {Angulartics2GoogleAnalytics} from 'angulartics2/src/providers/angulartics2-google-analytics';
import {Modal} from 'angular2-modal/plugins/bootstrap';
import {TranslatePipe} from '../../core';
import {InventoryService} from '../inventory.service';
import {AlertService} from '../../core';

@Component({
    selector: 'auctions',
    template: `
        <span *ngIf="links.length == 0">{{ 'NO_AUCTIONS'|translate }}</span>

        <a *ngIf="links.length > 0" [href]="links[0][1]" target="_blank">{{ links.length }} {{ 'AUCTIONS'|translate }}</a>

        <div class="item-links" *ngIf="links.length > 0">
            <a *ngFor="let link of links" [href]="link[1]" target="_blank">{{ link[0] }}</a>
        </div>
    `
})

export class AuctionsComponent implements OnInit {
    @Input('product') product: any;
    @Input('key') key: any;
    public links = [];

    constructor(
        private _inventoryService: InventoryService,
        private _alertService: AlertService,
        private _translate: TranslatePipe,
        private _analytics: Angulartics2GoogleAnalytics,
        private _modal: Modal
    ) {}

    ngOnInit() {
        if (this.product.hasOwnProperty(this.key)) {
            let auctions = this.product[this.key];

            // Loop auctions and create links
            if (auctions.hasOwnProperty('num') && auctions.num > 0) {
                this.links = [];
                for (let n in auctions.list) {
                    this.links.push([auctions.list[n], 'http://www.tradera.com/auction/auction.aspx?aid='+auctions.list[n]])
                }
            }
        }
    }
}

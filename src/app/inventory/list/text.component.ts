import { Component, Input, OnInit } from '@angular/core';

import { Angulartics2GoogleAnalytics } from 'angulartics2/src/providers/angulartics2-google-analytics';
import { Modal } from 'angular2-modal/plugins/bootstrap';

import { TranslatePipe } from '../../core';
import { InventoryService } from '../inventory.service';
import { AlertService } from '../../core';

@Component({
    selector: 'text',
    template: `
        <span *ngIf="mode != 'link'">{{ text }}</span>
        <a *ngIf="mode == 'link'" [href]="links[0][1]" target="_blank">{{ text }}</a>

        <div class="item-links" *ngIf="mode == 'popover'">
            <a *ngFor="let link of links" [href]="link[1]" target="_blank">{{ link[0] }}</a>
        </div>
    `
})

export class TextComponent implements OnInit {
    @Input('product') product: any;
    @Input('key') key: any;
    public text: string = '';
    public links = [];
    public mode: string = '';

    constructor(
        private _inventoryService: InventoryService,
        private _alertService: AlertService,
        private _translate: TranslatePipe,
        private _analytics: Angulartics2GoogleAnalytics,
        private _modal: Modal
    ) {}

    ngOnInit() {
        this.text = this.product[this.key];

        // Find all active items for this product
        let keys = Object.keys(this.product);

        for (let n in keys) {
            // Find active keys
            let matches = keys[n].match(/^([0-9]+)_([0-9]+)_active$/);
            if (matches) {
                // If it is active
                if (this.product[keys[n]] && this.product[keys[n]].active == '1' && this.product[keys[n]].item_id > 0) {
                    // It's active and we have an id. Make link depending on market
                    let market = matches[1];
                    let itemId = this.product[keys[n]].item_id;

                    if (market === '1') {
                        this.links.push(['Tradera', 'http://www.tradera.com/auction/auction.aspx?aid='+itemId]);
                    } else if (market === '6') {
                        this.links.push(['Fyndiq', 'https://fyndiq.se/product/'+ itemId + '-sello/']);
                    } else if (market === '11') {
                        this.links.push(['Prestashop', itemId]);
                    } else if (market === '10') {
                        this.links.push(['CDON', 'https://admin.marketplace.cdon.com/Product/Details/' + this.product.id]);
                    }
                }
            }
        }

        if (this.links.length > 1) {
            this.mode = 'popover';
        } else if (this.links.length == 1) {
            this.mode = 'link';
        }
    }
}

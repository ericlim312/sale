import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {UnsubscriberComponent} from '../../core';

@Component({
    selector: 'inventory-stats',
    template: `
    <inventory-stats-wrapper [productId]="productId"></inventory-stats-wrapper>
    `
})
export class InventoryStatsComponent extends UnsubscriberComponent implements OnInit {
    public productId;

    constructor(
        private _route: ActivatedRoute
    ) {
        super();
    }

    ngOnInit() {
        this.subscriptions.push(
            this._route.params.subscribe(params => {
                this.productId = params['productId'];
            }));
    }
}

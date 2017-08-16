import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { InventoryMetaService } from './meta.service';
import { UnsubscriberComponent } from '../core';
import { SelloPanel } from '../core/sello-panel.component';

@Component({
    selector: 'inventory-meta',
    providers: [InventoryMetaService],
    directives: [
        NgFor,
        SelloPanel
    ],
    template: require('./meta.component.html'),
})
export class InventoryMetaComponent extends UnsubscriberComponent {
    public meta;
    public openIntegrations = {};

    // New instance of InventoryService
    constructor(private _inventoryMetaService: InventoryMetaService) {
        super();
    }

    toggle(id) {
        this.openIntegrations[id] = !this.openIntegrations[id];
    }

    ngOnInit() {
        this.subscriptions.push(
            this._inventoryMetaService.meta$.subscribe(meta => this.meta = meta));
        this._inventoryMetaService.get();
    }
}

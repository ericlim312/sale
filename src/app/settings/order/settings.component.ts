import { Component, OnInit } from '@angular/core';

import { UnsubscriberComponent } from '../../core';
import { SettingsV3Service } from './../settings-v3.service';

@Component({
    selector: 'settings-order',
    template: require('./settings.component.html')
})
export class OrderSettingsComponent extends UnsubscriberComponent implements OnInit {
    public settings;
    public errors = {};

    public sortOptions = [
        { value: 'o.customer_order_id asc', name: 'Ordernummer stigande' },
        { value: 'o.customer_order_id desc', name: 'Ordernummer fallande' },
        { value: 'c.alias asc', name: 'Kund stigande' },
        { value: 'c.alias desc', name: 'Kund fallande' },
        { value: 'o.order_total asc', name: 'Ordersumma stigande' },
        { value: 'o.order_total desc', name: 'Ordersumma fallande' },
        { value: 'o.weight asc', name: 'Ordervikt stigande' },
        { value: 'o.weight desc', name: 'Ordervikt fallande' },
        { value: 'o.created_at asc', name: 'Skapad stigande' },
        { value: 'o.created_at desc', name: 'Skapad fallande' },
        { value: 'o.updated_at asc', name: 'Uppdaterad stigande' },
        { value: 'o.updated_at desc', name: 'Uppdaterad fallande' }
    ];

    public labelOptions = [
        { value: 'orderId', name: 'Ordernummer' },
        { value: 'name', name: 'Namn' }
    ];

    public plocklistaOptions = [
        { value: 'name_asc', name: 'Benämning' },
        { value: 'artnr_asc', name: 'Art.nr' },
        { value: 'ref_asc', name: 'Egen referens' },
        { value: 'shelf_asc', name: 'Lagerplats' },
    ];
    
    constructor(
        private _settingsService: SettingsV3Service
    ) {
        super();
    }

    ngOnInit() {
        this.subscriptions.push(this._settingsService.setting$.subscribe(settings => {
            this.settings = settings;
        }));

        this._settingsService.get('order');
    }

    save(key) {
        this._settingsService.put('order', this.settings).subscribe(result => {
            if (result.status === 400) {
                this.errors[key] = result.text();
            } else {
                this.errors[key] = null;
            }
        });
    }
}

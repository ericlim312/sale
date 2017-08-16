import { Component } from '@angular/core';
import { UnsubscriberComponent } from '../core';

import { SettingsV3Service } from './settings-v3.service';

@Component({
    selector: 'product-settings',
    template: require('./products.component.html')
})
export class ProductSettingsComponent extends UnsubscriberComponent {
    public settings;
    public errors = {};

    constructor(
        private _settingsService: SettingsV3Service
    ) {
        super();
    }

    ngOnInit() {
        this.subscriptions.push(
            this._settingsService.setting$.subscribe(settings => {
                this.settings = settings;
            }));
        this._settingsService.get('product');
    }

    save(key) {
        this._settingsService.put('product', this.settings)
            .subscribe(result => {
                if (result.status === 400) {
                    this.errors[key] = result.text();
                } else {
                    this.errors[key] = null;
                }
            });
    }
}

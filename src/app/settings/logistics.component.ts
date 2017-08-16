import { Component, OnInit } from '@angular/core';
import { UnsubscriberComponent } from '../core';
import { AdvancedSettingsService } from './advanced-settings.service';

@Component({
    selector: 'settings-logistics',
    template: require('./logistics.component.html')
})
export class SettingsLogisticsComponent extends UnsubscriberComponent implements OnInit {
    public settings;

    public errors = {};

    public constructor(
        private _advancedSettingsService: AdvancedSettingsService
    ) {
        super();
    }

    ngOnInit() {
        this.subscriptions.push(
            this._advancedSettingsService.setting$.subscribe(settings => {
                this.settings = settings;
            }));
        this._advancedSettingsService.get();
    }

    save(key) {
        this._advancedSettingsService.put(this.settings)
            .subscribe(result => {
                if (result.status === 400) {
                    this.errors[key] = result.text();
                } else {
                    this.errors[key] = null;
                }
            });
    }
}

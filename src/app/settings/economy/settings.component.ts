import { Component } from '@angular/core';
import { DataService } from '../../core/data.service';
import { SettingsV3Service } from './../settings-v3.service';

@Component({
    selector: 'economy-settings',

    template: require('./settings.component.html')
})
export class EconomySettingsComponent {
    public settings;

    public periods = [
        { name: 'Veckovis', value: 'weekly' },
        { name: 'Månadsvis', value: 'monthly' }
    ];

    public types = [
        { name: 'Levererad', value: 'delivered' },
        { name: 'Såld', value: 'sold' }
    ];

    public taxes = [
        { name: '0%', value: 0 },
        { name: '6%', value: 6 },
        { name: '12%', value: 12 },
        { name: '25%', value: 25 },
    ];

    public errors = {};

    constructor(
        private _dataService: DataService,
        private _settingsService: SettingsV3Service
    ) {}

    public get uploadUrl() {
        var host = this._dataService.getHost();
        return `${host}v3/settings/economy/logo`;
    }

    ngOnInit() {
        this._settingsService.setting$.subscribe(settings => {
            this.settings = settings;
        });
        this._settingsService.get('economy');
    }

    save(key) {
        this._settingsService.put('economy', this.settings)
            .subscribe(result => {
                if (result.status === 400) {
                    this.errors[key] = result.text();
                } else {
                    this.errors[key] = null;
                }
            });
    }
}

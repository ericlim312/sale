import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../core/data.service';
import { IntegrationSettingsService } from './../integration-settings.service';

@Component({
    selector: 'tradera-store',
    template: require('./store.component.html')
})
export class TraderaStoreComponent implements OnInit {
    public settings;
    public errors = {};

    public constructor(
        private _route: ActivatedRoute,
        private _dataService: DataService,
        private _settingService: IntegrationSettingsService
    ) {}
    
    public get uploadUrl() {
        var host = this._dataService.getHost();
        var traderaId = this._route.snapshot.params['id'];
        return `${host}v3/integration/tradera/${traderaId}/logo`;
    }
    
    ngOnInit() {
        var traderaId = this._route.snapshot.params['id'];

        this._settingService.setting$.subscribe(settings => {
            this.settings = settings;
        });

        this._settingService.get(`tradera/${traderaId}`);
    }

    save(key) {
        var traderaId = this._route.snapshot.params['id'];

        this._settingService.put(`tradera/${traderaId}`, this.settings)
            .subscribe(result => {
                if (result.status === 400) {
                    this.errors[key] = result.text();
                } else {
                    this.errors[key] = null;
                }
            });
    }
}

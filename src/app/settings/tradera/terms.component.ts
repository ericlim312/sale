import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UnsubscriberComponent } from '../../core';
import { IntegrationSettingsService } from './../integration-settings.service';

@Component({
    selector: 'tradera-terms',
    template: require('./terms.component.html')
})
export class TraderaTermsComponent extends UnsubscriberComponent implements OnInit {
    public settings;
    public errors = {};

    public constructor(
        private _route: ActivatedRoute,
        private _settingService: IntegrationSettingsService
    ) {
        super();
    }

    ngOnInit() {
        var traderaId = this._route.snapshot.params['id'];
        this.subscriptions.push(
            this._settingService.setting$.subscribe(settings => {
                this.settings = settings;
            }));

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

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UnsubscriberComponent } from '../../core';
import { IntegrationSettingsService } from './../integration-settings.service';

@Component({
    selector: 'tradera-shipping',
    template: require('./shipping.component.html')
})
export class TraderaShippingComponent extends UnsubscriberComponent implements OnInit {
    public settings;
    public saved;
    public error;

    public constructor(
        private _route: ActivatedRoute,
        private _settingService: IntegrationSettingsService
    ) {
        super();
    }

    get integrationId() {
        return this._route.snapshot.params['id'];
    }

    ngOnInit() {
         this.subscriptions.push(
            this._settingService.setting$.subscribe(settings => {
                this.settings = settings;
            }));

        this._settingService.get(`tradera/${this.integrationId}`);
    }

    save() {
        this.saved = null;
        this.error = null;
        
        this._settingService.put(`tradera/${this.integrationId}`, this.settings)
            .subscribe(() => {
                this.saved = true;
            }, error => {
                this.error = true;
            });
    }
}

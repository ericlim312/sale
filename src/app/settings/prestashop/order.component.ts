import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IntegrationSettingsService } from './../integration-settings.service';
import { StatusesService } from './../statuses.service';

@Component({
    selector: 'prestashop-order',
    template: require('./order.component.html')
})
export class PrestashopOrderComponent implements OnInit {
    public settings;
    public errors = {};
    public statuses;

    private _integrationId;

    public constructor(
        private _route: ActivatedRoute,
        private _integrationSettingService: IntegrationSettingsService,
        private _statusesService: StatusesService
    ) {}

    ngOnInit() {
        this._route.params.subscribe(params => {
            this.settings = null;
            this.errors = {};
            this.statuses = null;

            this._integrationId = params['id'];
            this.init();
        });
    }

    init() {
        this._integrationSettingService.setting$.subscribe(settings => {
            this.settings = settings;
        });
        this._integrationSettingService.get(this._integrationId);

        this._statusesService.statuses$.subscribe(statuses => {
            this.statuses = statuses.map(s => { return { name: s.title, value: s.id } });
        });
        this._statusesService.get();
    }

    save(key) {
        this._integrationSettingService.put(this._integrationId, this.settings)
            .subscribe(result => {
                if (result.status === 400) {
                    this.errors[key] = result.text();
                } else {
                    this.errors[key] = null;
                }
            });
    }
}

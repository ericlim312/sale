import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UnsubscriberComponent } from '../core';
import { IntegrationSettingsService } from './integration-settings.service';
import { StatusesService } from './statuses.service';

@Component({
    selector: 'fyndiq-settings',
    template: require('./fyndiq.component.html')
})
export class FyndiqSettingsComponent extends UnsubscriberComponent implements OnInit {
    public settings;
    public errors = {};
    public statuses;

    private fyndiqId;

    public constructor(
        private _route: ActivatedRoute,
        private _integrationSettingService: IntegrationSettingsService,
        private _statusesService: StatusesService
    ) {
        super();
    }

    ngOnInit() {
        this.subscriptions.push(
            this._route.params.subscribe(params => {
                this.settings = null;
                this.errors = {};
                this.statuses = null;

                this.fyndiqId = params['id'];
                this.init();
            }));
    }

    init() {
        this.subscriptions.push(
            this._integrationSettingService.setting$.subscribe(settings => {
                this.settings = settings;
            }));
        this._integrationSettingService.get(this.fyndiqId);

        this.subscriptions.push(
            this._statusesService.statuses$.subscribe(statuses => {
                this.statuses = statuses.map(s => { return { name: s.title, value: s.id } });
            }));
        this._statusesService.get();
    }

    save(key) {
        this._integrationSettingService.put(this.fyndiqId, this.settings)
            .subscribe(result => {
                if (result.status === 400) {
                    this.errors[key] = result.text();
                } else {
                    this.errors[key] = null;
                }
            });
    }
}

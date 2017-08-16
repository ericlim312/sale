import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UnsubscriberComponent } from '../core';
import { IntegrationSettingsService } from './integration-settings.service';
import { StatusesService } from './statuses.service';

@Component({
    selector: 'cdon-settings',
    template: require('./cdon.component.html')
})
export class CdonSettingsComponent extends UnsubscriberComponent implements OnInit {
    public settings;
    public errors = {};
    public statuses;
    public returnAddresses;

    public sellToChoices = [
        { value: 'enable_dk', name: 'Aktivera försäljning i Danmark', enable: false },
        { value: 'enable_fi', name: 'Aktivera försäljning i Finland', enable: false },
        { value: 'enable_no', name: 'Aktivera försäljning i Norge', enable: false },
        { value: 'enable_se', name: 'Aktivera försäljning i Sverige', enable: false }
    ];

    private _integrationId;

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

                this._integrationId = params['id'];
                this.init();
            }));
    }

    init() {
        this.subscriptions.push(
            this._integrationSettingService.setting$.subscribe(settings => {
                this.settings = settings;
                this.returnAddresses = this._getReturnAddresses(this.settings.return_addresses);
                this.loadSellTo(this.settings);
            }));
        this._integrationSettingService.get(this._integrationId);

        this.subscriptions.push(
            this._statusesService.statuses$.subscribe(statuses => {
                this.statuses = statuses.map(s => { return { name: s.title, value: s.id } });
            }));
        this._statusesService.get();
    }

    validateSellTo() {
        var enabled = this.sellToChoices.filter(c => c.enable);
        return !!enabled.length;
    }

    loadSellTo(settings) {
        this._setChoiceEnabled('enable_se', settings.enable_se);
        this._setChoiceEnabled('enable_no', settings.enable_no);
        this._setChoiceEnabled('enable_dk', settings.enable_dk);
        this._setChoiceEnabled('enable_fi', settings.enable_fi);
    }

    saveSellTo(settings, key) {
        settings.enable_se = this._isChoiceEnabled('enable_se');
        settings.enable_no = this._isChoiceEnabled('enable_no');
        settings.enable_dk = this._isChoiceEnabled('enable_dk');
        settings.enable_fi = this._isChoiceEnabled('enable_fi');
        settings.type = 'cdon';

        this.save(key);
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

    private _setChoiceEnabled(value, enable) {
        var choice = this.sellToChoices.find(c => c.value == value);

        if (!choice) {
            return;
        }

        choice.enable = !!enable;
    }


    private _isChoiceEnabled(value) {
        var choice = this.sellToChoices.find(c => c.value == value);

        if (!choice) {
            return false;
        }

        return !!choice.enable;
    }

    private _getReturnAddresses(obj) {
        if (!obj) {
            return [];
        }

        return obj.map(address => {
            return {
                value: address.AddressId,
                name: `${address.DisplayName}: ${address.StreetAddress}, ${address.PostalCode} ${address.City}, ${address.Country}`
            };
        })
    }
}

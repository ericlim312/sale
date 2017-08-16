import { Component } from '@angular/core';
import { UnsubscriberComponent } from '../core';

import { SettingsV3Service } from './settings-v3.service';

import { AccountService } from './../account/account.service';
import { CountryService } from './../core';

@Component({
    selector: 'personal',
    providers: [
        CountryService
    ],
    template: require('./personal.component.html')
})
export class PersonalComponent extends UnsubscriberComponent {
    public countries;
    public languages;
    public userPlan;

    public settings;

    public passwordChange = {
        visible: false,
        settings: {
            accountId: null,
            userId: null,
            password: {}
        },
        success: false,
        error: null
    };

    public errors = {};

    constructor(
        private _settingsService: SettingsV3Service,
        private _countryService: CountryService,
        private _accountService: AccountService
    ) {
        super();
    }

    get invoiceMailVisible() { return this.userPlan > 5; }

    getLanguage () {
        return this._accountService.getLanguage();
    }

    setLanguage (code) {
        this._accountService.setLanguage(code);
    }

    getCountry(code) {
        return { code };
    }

    ngOnInit() {
        this.subscriptions.push(
            this._accountService.account$.subscribe(account => {
                this.userPlan = account.plan_id;
                this.passwordChange.settings.accountId = account.account_id;
                this.passwordChange.settings.userId = account.user_id;
            }));
        this._accountService.getAccount();

        this.subscriptions.push(
            this._settingsService.setting$.subscribe(settings => {
                this.settings = settings;
            }));
        this._settingsService.get('personal');

        this.countries =
            this._countryService.getAll()
                .map(c => { return { name: c.name, value: c.code } });

        this._accountService.getAvailableLanguages().then(languages => {
            this.languages = languages.map(l => { return { name: l.string, value: l.code } });
        });
    }

    save(key) {
        this._settingsService.put('personal', this.settings)
            .subscribe(result => {
                if (result.status === 400) {
                    this.errors[key] = result.text();
                } else {
                    this.errors[key] = null;
                }
            });
    }

    savePassword(formData, valid) {
        if (!valid) {
            return;
        }

        Object.assign(this.passwordChange.settings.password, formData);

        this._settingsService.put('personal', this.passwordChange.settings)
            .subscribe(result => {
                if (result.status === 400) {
                    this.passwordChange.success = false;
                    this.passwordChange.error = result.text();
                } else {
                    this.passwordChange.success = true;
                    this.passwordChange.error = null;
                }
            });
    }
}

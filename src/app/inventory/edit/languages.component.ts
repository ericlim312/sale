import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';
import {TranslatePipe} from '../../core';
import {Localstorage} from '../../core';
import {Angulartics2GoogleAnalytics} from 'angulartics2/src/providers/angulartics2-google-analytics';
import {UnsubscriberComponent} from '../../core/unsubscriber.component';
import {AccountService} from '../../account/account.service';

@Component({
    selector: 'languages',
    template: require('./languages.component.html')
})
export class LanguagesComponent extends UnsubscriberComponent implements OnInit {
    @Output('change') change = new EventEmitter();
    @Input('integrations') integrations;
    private languages = [];
    private account;

    constructor(
        private _analytics: Angulartics2GoogleAnalytics,
        private _translate: TranslatePipe,
        private _localstorage: Localstorage,
        private _accountService: AccountService
    ) {
        super();
    }

    onChange() {
        // We need to wait for the change event to happen
        setTimeout(() => {
            // Make an array of enabled languages
            let langs = [];

            for (let n in this.languages) {
                if (this.languages[n].available && this.languages[n].enabled) {
                    langs.push(this.languages[n].code)
                }
            }

            // Save to localstorage
            this._localstorage.set('inventory.selectedLanguages', langs);

            // Emit value
            this.change.emit(this.languages);
        }, 100);
    }

    getLanguages() {
        let marketLang = [];
        let available = [];

        // Loop integrations to decide languages
        for (let n in this.integrations) {
            let mid = this.integrations[n].market_id;

            switch (mid) {
                case 1: // Tradera
                case 5: // SelloShop
                case 6: // Fyndiq
                case 11: // Presta
                case 12: // Woo
                    available.push('sv');
                    break;

                case 10: // Cdon
                    available.push('sv');
                    available.push('no');
                    available.push('dk');
                    available.push('fi');
                    break;

                case 13: // Amazon
                    available.push('en');
                    available.push('it');
                    available.push('es');
                    available.push('fr');
                    available.push('de');
                    break;
            }
        }

        // Set the languages as available
        for (let i in available) {
            for (let l in this.languages) {
                if (this.languages[l].code === available[i]) {
                    this.languages[l].available = true;
                }
            }
        }

        return this.languages;
    }

    ngOnInit() {
        // All languages with translated names
        this.languages.push({ code: 'sv', name: this._translate.translate('SWEDISH'), available: false, enabled: false });
        this.languages.push({ code: 'no', name: this._translate.translate('NORWEGIAN'), available: false, enabled: false });
        this.languages.push({ code: 'dk', name: this._translate.translate('FINNISH'), available: false, enabled: false });
        this.languages.push({ code: 'fi', name: this._translate.translate('DANISH'), available: false, enabled: false });
        this.languages.push({ code: 'en', name: this._translate.translate('ENGLISH'), available: false, enabled: false });
        this.languages.push({ code: 'es', name: this._translate.translate('SPANISH'), available: false, enabled: false });
        this.languages.push({ code: 'it', name: this._translate.translate('ITALIAN'), available: false, enabled: false });
        this.languages.push({ code: 'fr', name: this._translate.translate('FRENCH'), available: false, enabled: false });
        this.languages.push({ code: 'de', name: this._translate.translate('GERMAN'), available: false, enabled: false });

        this.subscriptions.push(
            this._accountService.account$.subscribe(account => {
                this.account = account;

                // Load selected languages
                let current = this._localstorage.get('inventory.selectedLanguages');
                if (!current || Object.keys(current).length === 0) {
                    // Enable account's language by default
                    current = [this.account.lang_code];
                }

                for (let i in current) {
                    for (let l in this.languages) {
                        if (this.languages[l].code === current[i]) {
                            this.languages[l].enabled = true;
                        }
                    }
                }

                this.change.emit(this.languages);
            })
        );

        this._accountService.getAccount();
    }
}

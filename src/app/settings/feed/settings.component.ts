import { Component } from '@angular/core';
import { TranslatePipe } from '../../core';
import { UnsubscriberComponent } from '../../core';
import { SettingsService } from '../settings.service';

@Component({
    selector: 'feed-settings',
    template: require('./settings.component.html')
})
export class FeedSettingsComponent extends UnsubscriberComponent {
    public settings;
    public errors = {};

    constructor(
        private _settings: SettingsService,
        private _translate: TranslatePipe
    ) {
        super();
    }

    save(key, value) {
        const obj = {};
        obj[key] = value;

        this._settings.put(obj)
            .map(res => res.json())
            .subscribe(result => {
                // Show error message if there was an error
                if (result.result.feed.code === 400) {
                    this.errors['feed.url'] = JSON.parse(result.result.feed.response).message;
                } else {
                    // Reset any previous errors
                    this.errors = {};
                }
            });
    }

    ngOnInit() {
        this.subscriptions.push(
            this._settings.setting$.subscribe(settings => {
                console.log(settings);
                this.settings = settings;
            }));
        this._settings.get(['feed.url', 'feed.last_working', 'feed.status']);
    }
}

import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {UnsubscriberComponent} from '../../core';
import {SelloshopThemeService} from './theme.service';
import {MarketV3Service} from './../market-v3.service';

@Component({
    selector: 'selloshop-theme',
    template: require('./theme.component.html')
})
export class SelloshopThemeComponent extends UnsubscriberComponent implements OnInit, OnDestroy {
    public settings;
    public themes;

    constructor(
        private _route: ActivatedRoute,
        private _themeService: SelloshopThemeService,
        private _settingService: MarketV3Service
    ) {
        super();
    }

    get integrationId() {
        return this._route.snapshot.params['id'];
    }

    ngOnInit() {
        this.subscriptions.push(this._settingService.setting$.subscribe(settings => {
            this.settings = settings;
        }));

        this._settingService.get(`selloshop/${this.integrationId}/settings`);

        this.subscriptions.push(this._themeService.theme$.subscribe(themes => {
            this.themes = themes;
        }));

        this._themeService.get(this.integrationId);
    }

    isActive(theme) {
        return this.settings.template === theme.theme
            && this.settings.template_color === theme.variation;
    }
    
    setActive(theme) {
        this.settings.template = theme.theme;
        this.settings.template_color = theme.variation;

        this._settingService.put(`selloshop/${this.integrationId}/settings`, this.settings)
            .subscribe(result => {
                
            });
    }

    ngOnDestroy() {
        super.ngOnDestroy();
        
        this._settingService.reset();
    }
}

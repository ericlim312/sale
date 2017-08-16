import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../core/data.service';
import { UnsubscriberComponent } from '../../core';
import { MarketV3Service } from './../market-v3.service';

@Component({
    selector: 'selloshop-general',
    providers: [
        DataService
    ],
    template: require('./general.component.html')
})
export class SelloshopGeneralComponent extends UnsubscriberComponent implements OnInit, OnDestroy {
    public settings;
    public errors = {};

    public shopStates = [
        { value: 'open', name: 'öppen' },
        { value: 'temporary_closed', name: 'tillfälligt stängd' },
    ];

    public itemIdChoices = [
        { value: 'none', name: 'visa inte' },
        { value: 'reference', name: 'referens' },
        { value: 'product_id', name: 'artikelnummer' },
    ];

    public indexProductsChoices = [
        { value: 'news', name: 'nya produkter' },
        { value: 'highlight', name: 'de produkter jag valt' },
    ];

    public constructor(
        private _route: ActivatedRoute,
        private _dataService: DataService,
        private _settingService: MarketV3Service
    ) {
        super();
    }
    
    public get uploadUrl() {
        var host = this._dataService.getHost();
        var selloshopId = this._route.snapshot.params['id'];
        return `${host}v3/market/selloshop/${selloshopId}/settings/logo`;
    }
    
    ngOnInit() {
        var selloshopId = this._route.snapshot.params['id'];

        this.subscriptions.push(this._settingService.setting$.subscribe(settings => {
            this.settings = settings;
        }));

        this._settingService.get(`selloshop/${selloshopId}/settings`);
    }

    save(key) {
        var selloshopId = this._route.snapshot.params['id'];

        this._settingService.put(`selloshop/${selloshopId}/settings`, this.settings)
            .subscribe(result => {
                if (result.status === 400) {
                    this.errors[key] = result.text();
                } else {
                    this.errors[key] = null;
                }
            });
    }

    ngOnDestroy() {
        super.ngOnDestroy();
        
        this._settingService.reset();
    }
}

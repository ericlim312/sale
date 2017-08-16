import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { UnsubscriberComponent } from '../../core';
import { MarketV3Service } from './../market-v3.service';

@Component({
    selector: 'payment',
    template: require('./payment.component.html')
})
export class SelloshopPaymentComponent extends UnsubscriberComponent implements OnInit, OnDestroy {
    public settings;
    public errors = {};

    public klarnaCheckout;
    public klarna;
    public payson;
    public paysoninvoice;
    public prepay;
    public paypal;

    constructor(
        private _route: ActivatedRoute,
        private _settingsService: MarketV3Service
    ) {
        super();
    }

    get integrationId() {
        return this._route.snapshot.params['id'];
    }

    getPayment(type) {
        return this.settings.find(payment => payment.type === type);
    }

    setPaymentEnabled(payment, enabled) {
        payment.enabled = enabled;
        this.save(`${payment.type}.enabled`);
    }

    ngOnInit() {
        this.subscriptions.push(this._settingsService.setting$.subscribe(settings => {
            this.settings = settings;
            this.klarnaCheckout = this.getPayment('kco');
            this.klarna = this.getPayment('klarna');
            this.payson = this.getPayment('payson');
            this.paysoninvoice = this.getPayment('paysoninvoice');
            this.paypal = this.getPayment('paypal');
            this.prepay = this.getPayment('prepay');
        }));

        this._settingsService.get(`selloshop/${this.integrationId}/payment`);
    }

    save(key) {
        this._settingsService.put(`selloshop/${this.integrationId}/payment`, this.settings)
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
        
        this._settingsService.reset();
    }
}

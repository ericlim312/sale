import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UnsubscriberComponent } from '../../core';
import { IntegrationSettingsService } from './../services';
import { StatusesService } from '../statuses.service';
import { MailTemplateService } from '../mail-template.service';

@Component({
    selector: 'tradera-checkout',
    template: require('./checkout.component.html')
})
export class TraderaCheckoutComponent extends UnsubscriberComponent implements OnInit {
    public settings;
    public paymentOptions;
    public errors = {};

    public statuses;
    public statusesPaid;
    public mailtemplates;

    public sellToChoices = [
        { value: 1, name: 'Inom Sverige' },
        { value: 2, name: 'Inom Norden' },
        { value: 3, name: 'Internationellt' }
    ];

    public newOrderActions = [
        { value: 'set_status', name: 'Byt orderstatus till' },
        { value: 'send_mail', name: 'Skicka mail' }
    ];

    public constructor(
        private _route: ActivatedRoute,
        private _statusesService: StatusesService,
        private _settingService: IntegrationSettingsService,
        private _mailTemplateService: MailTemplateService
    ) {
        super();
    }

    get loaded() {
        return this.settings && this.statuses && this.mailtemplates;
    }

    ngOnInit() {
        var traderaId = this._route.snapshot.params['id'];

        this.subscriptions.push(this._statusesService.statuses$.combineLatest(this._settingService.setting$).subscribe(([statuses, settings]) => {
            this.settings = settings;
            this.paymentOptions = settings.payment.options.map(o => { return { name: o.title, value: o.id, enable: o.enable } })

            let enabledChoices = settings.tradera_order_preferences.merge.status_id;
            this.statuses = statuses.map(s => {
                return {
                    name: s.title,
                    value: s.id,
                    enable: !!enabledChoices.find(c => c === s.id)
                }
            });

            this.statusesPaid = statuses.filter(s => s.is_paid).map(s => { return { name: s.title, value: s.id } });
        }));
        this._settingService.get(`tradera/${traderaId}`);
        this._statusesService.get();

        this.subscriptions.push(this._mailTemplateService.template$.subscribe(templates => {
            this.mailtemplates = templates.map(t => { return { name: t.title, value: t.id } });
        }));
        this._mailTemplateService.getAll();
    }

    setPaymentOptions(choices) {
        this.settings.payment.options.forEach(o => {
            var choice = choices.find(c => c.value === o.id);
            o.enable = !!choice && choice.enable;
        });
    }

    setOrderPreferencesMergeStatus(choices) {
        let enabledChoices = choices.filter(choice => choice && choice.enable);
        this.settings.tradera_order_preferences.merge.status_id = enabledChoices.map(choice => choice.value);
    }

    setNewOrderStatus(statusId) {
        this.settings.tradera_order_preferences.new_order = {
            action: 'set_status',
            status_id: statusId
        };
    }

    setNewOrderMailTemplate(templateId) {
        this.settings.tradera_order_preferences.new_order = {
            action: 'send_mail',
            mail_id: templateId
        };
    }

    save(key) {
        var traderaId = this._route.snapshot.params['id'];

        this._settingService.put(`tradera/${traderaId}`, this.settings)
            .subscribe(result => {
                if (result.status === 400) {
                    this.errors[key] = result.text();
                } else {
                    this.errors[key] = null;
                }
            });
    }
}

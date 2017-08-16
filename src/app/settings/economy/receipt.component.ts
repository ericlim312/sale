import { Component } from '@angular/core';
import { UnsubscriberComponent } from '../../core';
import { SettingsV3Service } from './../settings-v3.service';

@Component({
    selector: 'receipt-settings',
    template: require('./receipt.component.html')
})
export class ReceiptSettingsComponent extends UnsubscriberComponent {
    public settings;
    public saved = false;

    private _receiptFieldNames = {
        'document_footer_1x2': 'Telefon',
        'document_footer_1x4': 'Plusgiro',
        'document_footer_2x2': 'E-mail',
        'document_footer_2x4': 'Bankgiro',
        'document_footer_3x2': 'Webshop',
    };

    constructor(
        private _settingsService: SettingsV3Service
    ) {
        super();
    }

    ngOnInit() {
        this._settingsService.setting$.subscribe(settings => {
            this.settings = settings;
            this.settings.reciept = Object.assign(this.settings.reciept, this._receiptFieldNames);
        });
        this._settingsService.get('economy');
    }

    save(data, valid) {
        if (!valid) {
            return;
        }

        this._settingsService.put('economy', this.settings).subscribe((result) => {
            this.saved = true;
        });
    }
}

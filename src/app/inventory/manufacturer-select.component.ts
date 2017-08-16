import { Component, Input } from '@angular/core';
import { UnsubscriberComponent } from '../core';
import { ManufacturerService } from './manufacturer.service.ts';

@Component({
    selector: '[manufacturer-select]',
    template: `
        <option value="">{{ 'SELECT_MANUFACTURER'|translate }}</option>
        <option *ngFor="let manufacturer of manufacturers" [value]="manufacturer.id" [selected]="selected == manufacturer.id">{{ manufacturer.name }}</option>
    `
})
export class ManufacturerSelectComponent extends UnsubscriberComponent {
    @Input('selected') selected;
    public manufacturers = [];

    constructor(
        private _manufacturerService: ManufacturerService
    ) {
        super();
    }

    ngOnInit() {
        this.subscriptions.push(
            this._manufacturerService.manufacturer$.subscribe(manufacturers => this.manufacturers = manufacturers));
        this._manufacturerService.getAll();
    }
}

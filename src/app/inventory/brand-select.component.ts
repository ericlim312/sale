import { Component, Input } from '@angular/core';

import { UnsubscriberComponent } from '../core';
import { BrandService } from './brand.service.ts';

@Component({
    selector: '[brand-select]',
    template: `
        <option value="">{{ 'NO_BRAND'|translate }}</option>
        <option *ngFor="let brand of brands" [value]="brand.brand_id" [selected]="selected == brand.brand_id">{{ brand.name }}</option>
    `
})
export class BrandSelectComponent extends UnsubscriberComponent {
    @Input('selected') selected;
    public brands = [];

    constructor(
        private _brandService: BrandService
    ) {
        super();
    }

    ngOnInit() {
        this.subscriptions.push(
            this._brandService.brand$.subscribe(brands => {
                this.brands = brands;
            }));
        this._brandService.get();
    }
}

import { Component, Input } from '@angular/core';
import { TemplateService } from './template.service.ts';
import { UnsubscriberComponent } from '../core';

@Component({
    selector: '[template-select]',
    template: `
        <option *ngFor="let template of templates" [value]="template.id" [selected]="selected == template.id">{{ template.title }} {{ template.id }}</option>
    `
})
export class TemplateSelectComponent extends UnsubscriberComponent {
    @Input('selected') selected;
    public templates = [];

    constructor(
        private _templateService: TemplateService
    ) {
        super();
    }

    ngOnInit() {
        this.subscriptions.push(
            this._templateService.template$.subscribe(templates => this.templates = templates));
        this._templateService.get();
    }
}

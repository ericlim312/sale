import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'category-setting-row',
    template: require('./category-setting-row.component.html'),
    styles: [`.mapping-icon { margin-left: 10px; margin-right: 10px; }`]
})
export class CategorySettingRowComponent {

    @Input('category') category;
    @Input('integrations') integrations;
    @Input('preselected') preselected;
    @Output('onSave') onSave = new EventEmitter();

    public edit = false;

    private _selected;

    toggleEdit() {
        this.edit = !this.edit;
    }

    save() {
        this.onSave.next(this.category);
        this.toggleEdit();
    }

    cancel() {
        this.toggleEdit();
    }

    ngOnInit() {
        this._selected = this.preselected;
    }

    marketWithCategories(integration) {
        if ([1, 5, 10, 11, 12, 13].indexOf(integration.market_id) !== -1) {
            return true;
        }

        if (integration.market_id == 6 && integration.version != '1') {
            return true;
        }

        return false;
    }

    setCategoryMapping(category, integration, mappedCategory) {
        if (!mappedCategory) {
            return;
        }
        
        if (!category.map) {
            category.map = {};
        }

        category.map['' + integration] = {
            id: mappedCategory.id,
            name: mappedCategory.crumb
        };
    }
}

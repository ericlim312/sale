import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';

@Component({
    selector: 'integration-category-select-multi',
    template: `
    <p *ngFor="let category of categories">
        <integration-category-select [integration]="integration" [preselected]="category.category_id" (select)="onSelect(category, $event)"></integration-category-select> <button (click)="remove(category)" type="button" class="btn btn-default btn-xs"><i class="fa fa-remove"></i></button>
    </p>
    <button class="btn btn-default" (click)="add()"><i class="fa fa-plus"></i> {{ 'ADD_EXTRA_CATEGORY'|translate }}</button>
    `
})
export class CategoryMultiSelect implements OnInit {
    @Input('integration') integration;
    @Input('categories') categories;
    @Output('select') select = new EventEmitter();

    onSelect(category, event) {
        // Not null
        if (event) {
            const index = this.categories.indexOf(category);

            this.categories[index].category_id = event.id;
            this.categories[index].crumb = event.crumb;
            this.categories[index].name = event.name;
            this.select.emit(this.categories);
        }
    }

    remove(category) {
        this.categories.splice(this.categories.indexOf(category), 1);
        this.select.emit(this.categories);
    }

    add() {
        this.categories.push({ "category_id": null });
    }

    ngOnInit() {
    }
}

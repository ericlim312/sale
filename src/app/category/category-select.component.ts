import {Component, Input, Output, OnInit, EventEmitter} from '@angular/core';
import {CategoryService} from './category.service';
import {UnsubscriberComponent} from '../core';
import {Angulartics2GoogleAnalytics} from 'angulartics2/src/providers/angulartics2-google-analytics';

@Component({
    selector: 'integration-category-select',
    template: `
        {{ 'SELECT_A_CATEGORY'|translate }} <span *ngFor="let column of columns; let colindex = index">
            <select *ngIf="categories[integration]" [(ngModel)]="column.selected" (change)="categoryChanged(colindex, column)">
                <option *ngFor="let cat of categories[integration][column.parent]" [value]="cat.id">{{ cat.name }}</option>
            </select>
        </span>
    `,
})
export class CategorySelect extends UnsubscriberComponent implements OnInit {
    @Input('integration') integration;
    @Input('preselected') preselected;
    @Output('select') select = new EventEmitter();
    public categories = {};
    public columns = [];
    public lastSelectedCategory;

    constructor(
        private _categoryService: CategoryService,
        private _analytics: Angulartics2GoogleAnalytics
    ) {
        super();
    }

    categoryChanged(colindex, column) {
        setTimeout(() => {
            this.browseCategory(colindex+1, this.columns[colindex].selected, column);
        }, 100);
    }

    browseCategory(colindex, parent, column?) {
        // Reset the final category since we're changing category
        this.select.next(null);

        // Load subcategories
        this._categoryService.get(this.integration, parent);

        // Prepare a variable to put subcategories
        if (!this.categories.hasOwnProperty(parent)) {
            this.categories[parent] = [];
        }

        // If that column exists
        if ((this.columns.length - 1) >= colindex) {
            // Remove that column and any child columns
            this.columns.splice(colindex, 5);
        }

        // Add a new column
        this.columns.push({
            parent: parent
        });

        // Save this as the selected category
        this.lastSelectedCategory = parent;

        // Set the 'selected' property on column
        if (column !== undefined) {
            column.selected = parent;
        }
    }

    ngOnInit() {
        this.subscriptions.push(
            this._categoryService.category$.subscribe(categories => {
                this.categories = categories
            }));
        this.subscriptions.push(
            this._categoryService.final$.subscribe(finals => {
                // We got a message that we have reached the final category
                if (finals.hasOwnProperty(this.lastSelectedCategory)) {
                    this.select.next(this._categoryService.getFromCache(this.lastSelectedCategory));

                    // Remove the last added column since it won't contain any data
                    this.columns.splice(this.columns.length - 1, 1);
                }
            }));

        // If we have a preselected category
        if (this.preselected > 0) {
            // Got a preselected category. Fetch path from api
            this.subscriptions.push(
                this._categoryService.getCategory(this.integration, this.preselected).subscribe(category => {
                    // Walk the path
                    for (let n in category.path) {
                        if (this.columns[n] === undefined) {
                            this.columns[n] = {};
                        }

                        this.columns[n].selected = category.path[n];
                        this.browseCategory(n, category.path[n], this.columns[parseInt(n) - 1]);
                    }
                }));
        } else {
            // Add initial parent column
            this.browseCategory(0, 0);
        }
    }
}

import {Component, Input, Output, OnInit, EventEmitter} from '@angular/core';
import {CategoryService} from '../category';
import {UnsubscriberComponent} from '../core';
import {Angulartics2GoogleAnalytics} from 'angulartics2/src/providers/angulartics2-google-analytics';

@Component({
    selector: 'category-selector',
    template: require('./category.component.html'),
})
export class CategoryComponent extends UnsubscriberComponent implements OnInit {
    @Input('integration') integration;
    @Input('preselected') preselected;
    @Output('select') select = new EventEmitter();
    public categories = {};
    public columns = [];
    public selectedCategory;
    public selectedCategoryObj = {
        id: 0
    };

    constructor(
        private _categoryService: CategoryService,
        private _analytics: Angulartics2GoogleAnalytics
    ) {
        super();
    }

    browseCategory(colindex, parent, column?, category?) {
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
        this.selectedCategory = parent;
        this.selectedCategoryObj = category;

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
                if (finals.hasOwnProperty(this.selectedCategory)) {
                    this.select.next(this.selectedCategoryObj);

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
                        this.browseCategory(n, category.path[n], this.columns[parseInt(n) - 1]);
                    }
                }));
        } else {
            // Add initial parent column
            this.browseCategory(0, 0);
        }
    }
}

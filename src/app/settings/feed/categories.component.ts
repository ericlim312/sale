import { Component } from '@angular/core';
import { UnsubscriberComponent } from '../../core';
import { CategoryService } from './categories.service';
import { IntegrationService } from '../../integration/integration.service';

@Component({
    selector: 'feed-categories',
    template: require('./categories.component.html')
})
export class FeedCategoriesComponent extends UnsubscriberComponent {
    public categories;
    public integrations;

    constructor(
        private _categoryService: CategoryService,
        private _integrationService: IntegrationService
    ) {
        super();
    }

    ngOnInit() {
        this.subscriptions.push(
            this._categoryService.category$.subscribe(categories => this.categories = categories));
        this._categoryService.get();

        // Load integrations
        this.subscriptions.push(
            this._integrationService.integration$.subscribe(integration => {
                this.integrations = integration;
            }));
        this._integrationService.get();
    }

    saveCategory(category) {
        this._categoryService.save(category);
    }
}

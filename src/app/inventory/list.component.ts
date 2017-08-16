import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { Angulartics2GoogleAnalytics } from 'angulartics2/src/providers/angulartics2-google-analytics';
import { InventoryService } from './inventory.service';
import { FolderService } from './folder.service';
import { ColumnsService } from './columns.service';
import { UnsubscriberComponent } from '../core';
import { AccountService } from '../account/account.service';

@Component({
    selector: 'inventory-list',
    template: require('./list.component.html'),
    styles: [require('./list.component.scss')],
})
export class InventoryListComponent extends UnsubscriberComponent {
    public columns;
    public inventory;
    public folderId;
    public page;
    public sort;
    public sortDir;
    public search;
    public language;
    public loading;
    private errorMessage;

    constructor(
        private _inventoryService: InventoryService,
        private _folderService: FolderService,
        private _account: AccountService,
        private _columnsService: ColumnsService,
        private _analytics: Angulartics2GoogleAnalytics,
        private _router: Router,
        private _aroute: ActivatedRoute
    ) {
        super();
        this.language = this._account.getLanguage();
    }

    getLink(obj) {
        // If column is the same as current, toggle direction. If not, use asc
        if (obj.sort === this.sort) {
            obj.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
        } else {
            obj.sortDir = 'asc';
        }

        return this._inventoryService.getLink(obj);
    }

    goToRoute(obj) {
        this._router.navigateByUrl(this.getLink(obj));
    }

    onCheckAll(checked) {
        for (let i in this.inventory.data) {
            for (let n in this.inventory.data[i].products) {
                this.inventory.data[i].products[n].checked = checked;
            }
        }
    }

    ngOnInit() {
        this._analytics.eventTrack('action', {'category': 'cat', 'label': 'lab', 'value': 'val'});

        this.subscriptions.push(
            this._router
                .routerState
                .queryParams
                .subscribe(params => {
                    this.folderId = params['folder'] !== undefined ? params['folder'] : 0;
                    this._folderService.setCurrent(this.folderId);
                    this.page = params['page'] !== undefined ? params['page'] : 1;
                    this.search = params['search'] !== undefined ? params['search'] : '';
                    this.sort = params['sort'] !== undefined ? params['sort'] : '';
                    this.sortDir = params['sortDir'] !== undefined ? params['sortDir'] : '';

                    this.subscriptions.push(
                        this._inventoryService.inventory$.subscribe(inventory => {
                            this.sort = inventory.currentSort;
                            this.sortDir = inventory.currentSortDir;

                            if (this.search.length === 0) {
                                this.inventory = inventory.inventory[this.folderId];
                            } else {
                                this.inventory = inventory.search;
                            }
                        }));

                    this.loading = this._inventoryService.loading$;

                    this._inventoryService.getInventory(
                        this.folderId,
                        this.page,
                        this.sort,
                        this.sortDir,
                        this.search,
                        this._getFilters(params));
                }
            ));

        this.subscriptions.push(
            this._columnsService.selectedColumns$.subscribe(selectedColumns => {
                this.columns = selectedColumns;
            }));

        this._columnsService.get();
    }

    private _getFilters(params) {
        return params
            && Object.keys(params)
            .filter(k => k.indexOf('filter') !== -1)
            .map(k => `${k}=${params[k]}`);
    }
}

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { Angulartics2GoogleAnalytics } from 'angulartics2/src/providers/angulartics2-google-analytics';

import { TranslatePipe } from '../core';
import { UnsubscriberComponent } from '../core';
import { Localstorage } from '../core';
import { CountryService } from '../core';

import { CategoryService } from '../category';

import { InventoryService } from './inventory.service';
import { FolderService } from './folder.service';
import { ColumnsService } from './columns.service';
import { QuickeditService } from './quickedit.service';

@Component({
  selector: 'inventory',
  providers: [
      CategoryService,
      CountryService
  ],
  template: require('./inventory.component.html'),
  styles: [require('./inventory.component.scss')]
})
export class InventoryComponent extends UnsubscriberComponent {
    public columns;
    public folder = 0;
    public inventoryListMeta;
    public page;
    public sort;
    public sortDir;
    public search = '';
    public foldersCounterHeader = '';
    public hideSidebar:boolean = false;
    public showFilter = false;
    public quickedit = false;
    public loading = true;
    public empty = false;
    private _numFolders;

    constructor(
        private _columnsService: ColumnsService,
        private _inventoryService: InventoryService,
        private _folderService: FolderService,
        private _quickeditService: QuickeditService,
        private _analytics: Angulartics2GoogleAnalytics,
        private _translate: TranslatePipe,
        private _localstorage: Localstorage,
        private _router: Router
    ) {
        super();

        let mode = this._localstorage.get('inventory.sidebar');
        if (mode) {
            this.hideSidebar = mode.hidden;
        }
    }

    onSubmitSearch() {
        let hash = this._inventoryService.getLink({ search: this.search, page: 1 });
        console.log(hash.replace('#/', ''));
        this._router.navigateByUrl(hash.replace('#/', ''));
    }

    toggleQuickedit() {
        this.quickedit = !this.quickedit;
        this._quickeditService.setQuickedit(this.quickedit);
    }

    saveQuickedit() {
        this.quickedit = false;
        this._quickeditService.setQuickedit(false);
        this._quickeditService.saveQuickedit();
    }

    toggleSidebar() {
        this.hideSidebar = !this.hideSidebar;

        this._localstorage.set('inventory.sidebar', {
            'hidden': this.hideSidebar
        })
    };

    resetSearch() {
        this.search = '';
        this.onSubmitSearch();
    }

    onUpdateNumFolders(e) {
        this._numFolders = e;
    }

    updateFoldersHeader() {
        this.foldersCounterHeader =
            this.inventoryListMeta.total + ' ' +
            this._translate.translate('FOLDERS_SUBHEADER_1') + ' ' +
            this._numFolders + ' ' +
            this._translate.translate('FOLDERS_SUBHEADER_2')
    }

    ngOnInit() {
        // Watch for changes in columns
        this.subscriptions.push(
            this._columnsService.columns$.subscribe(columns => this.columns = columns));
        this._columnsService.get();

        // Watch for inventory changes
        this.subscriptions.push(
            this._inventoryService.inventory$.subscribe(inventory => {
                this.folder = this._inventoryService.currentFolder;
                this.page = inventory.currentPage;
                this.sort = inventory.currentSort;
                this.sortDir = inventory.currentSortDir;
                this.search = inventory.currentSearch;

                this.inventoryListMeta = {
                    total: inventory.currentTotal
                };

                this.updateFoldersHeader();
            }));

        // This will cause us to get the folder id returned
        // We need to wait some time before the list component is loaded. Doing 500ms for now
        setTimeout(() => this._inventoryService.refresh(), 500);

        this.subscriptions.push(this._inventoryService.loading$.skip(2).filter(x => !x).subscribe(loading => {
            this.loading = loading;
        }));

        this.subscriptions.push(
            this._inventoryService.empty$.skip(2).take(1)
                .combineLatest(this._folderService.folder$.skip(2).take(1))
                .subscribe(([empty, folders]) => {
                    let subfolders = folders && folders.folders[0];
                    let subfoldersEmpty = !subfolders || !subfolders.length;
                    this.empty = subfoldersEmpty && empty;
                }));
    }
}

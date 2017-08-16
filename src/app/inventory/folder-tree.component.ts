import {Component, Input, Output, EventEmitter, ViewContainerRef} from '@angular/core';
import {Router} from '@angular/router';
import {TranslatePipe} from '../core';
import {UnsubscriberComponent} from '../core';
import {FolderService} from './folder.service.ts';
import {AlertService} from '../core';
import {Angulartics2GoogleAnalytics} from 'angulartics2/src/providers/angulartics2-google-analytics';
import {Modal} from 'angular2-modal/plugins/bootstrap';

@Component({
    selector: 'inventory-folder-tree',
    template: require('./folder-tree.component.html'),
    host: {
        class: 'folder-tree'
    }
})
export class InventoryFolderTreeComponent extends UnsubscriberComponent {
    @Input('folderId') folderId;
    @Output('numFolders') numFolders = new EventEmitter();

    public folders = [];
    public currentFolder = {};
    public currentParent = { 'id': 0, 'title': ''};
    public parentToParent = false;
    public numProductsPerFolder = {};

    constructor(
        private _folderService: FolderService,
        private _alertService: AlertService,
        private _translate: TranslatePipe,
        private _analytics: Angulartics2GoogleAnalytics,
        private _modal: Modal,
        private _viewContainer: ViewContainerRef,
        private _router: Router
    ) {
        super();
    }

    getNumProducts(folder) {
        if (this.numProductsPerFolder.hasOwnProperty(folder.id)) {
            return this.numProductsPerFolder[folder.id];
        } else {
            return 0;
        }
    }

    init(folderId) {
        if (folderId === null) return;

        if (folderId != this.currentFolder['id']) {
            this._folderService.setCurrent(folderId);
        }

        // If current hasn't changed, but we have no subfolders - attempt to fetch
        if (folderId != this.currentFolder['id'] || this.folders === undefined || this.folders.length == 0) {
            this._folderService.get(folderId);
        }
    }

    goToRoute(url) {
        this._router.navigateByUrl(url);
    }

    // Fetch information about the parent folder
    fetchParent(parentId) {
        if (this.folderId == 0) {
            // The main folder has itself as the parent
            this.currentParent = {
                id: 0,
                title: this._translate.translate('MAIN_FOLDER')
            };
        } else {
            this._folderService.getSingle(parentId).subscribe(data => {
                this.currentParent = data;

                // If this isn't the main folder, fetch it's parent too
                if(this.currentParent.id != 0) {
                    this._folderService.getSingle(this.currentParent.id).subscribe(data => {
                        this.parentToParent = data;
                    });
                } else {
                    this.parentToParent = false;
                }
            })
        }
    };

    onFolderDelete(folder) {
        this._alertService.confirm(
            this._translate.translate('DELETE_FOLDER_TITLE'),
            this._translate.translate('DELETE_FOLDER_TEXT'),
            this._translate.translate('BTN_CONFIRM_DELETE'),
            this._translate.translate('BTN_CANCEL'),
            this._modal,
            this._viewContainer
        ).then((resultPromise) => {
            return resultPromise.result.then((result) => {
                this._folderService.delete(folder);
                // Change to the parent folder
                this.init(folder.parent_id);
            }, () => {
                // The dialog was cancelled
            });
        });
    }

    onFolderEdit(folder) {
        this._alertService.prompt(
            this._translate.translate('EDIT_FOLDER'),
            this._translate.translate('EDIT_FOLDER_NAME'),
            this._translate.translate('BTN_EDIT'),
            this._translate.translate('BTN_CANCEL'),
            folder.title,
            this._modal,
            this._viewContainer
        ).then((resultPromise) => {
            return resultPromise.result.then((result) => {
                if (result) {
                    folder.title = result;
                    this._folderService.put(folder);
                }
            });
        });
    }

    onFolderCreate(folder) {
        this._alertService.prompt(
            this._translate.translate('CREATE_FOLDER'),
            this._translate.translate('CREATE_FOLDER_NAME'),
            this._translate.translate('BTN_CREATE'),
            this._translate.translate('BTN_CANCEL'),
            '',
            this._modal,
            this._viewContainer
        ).then((resultPromise) => {
            return resultPromise.result.then((result) => {
                if (result) {
                    this._folderService.post(folder.id, result).subscribe(result => {
                        folder.open = true;
                    });
                }
            });
        });
    }

    ngOnInit() {
        this.subscriptions.push(
            this._folderService.folder$.subscribe(folders => {
                // If current folder has changed, fetch its parent
                if (this.currentFolder !== folders.current && folders.current !== undefined && folders.current.id !== undefined) {
                    this.currentFolder = folders.current;
                    this.folderId = this.currentFolder['id'];
                    this.fetchParent(this.currentFolder['parent_id']);
                    this.init(this.folderId);
                }

                this.folders = folders.folders[this.folderId];
                this.currentFolder = folders.current;
                this.numProductsPerFolder = folders.num;

                if (this.folders !== undefined) {
                    this.numFolders.emit(this.folders.length);
                }
            })
        );

        // Get product count folders
        this._folderService.getNum();
    }
}

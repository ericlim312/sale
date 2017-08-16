import { Component } from '@angular/core';
import { FolderService } from './folder.service.ts';
import { UnsubscriberComponent } from '../core';

@Component({
    selector: '[folder-select]',
    template: `
        <option *ngFor="let folder of folders" [value]="folder.id">{{ folder.title }}</option>
    `
})
export class FolderSelectComponent extends UnsubscriberComponent {
    public folders = [];

    constructor(
        private _folderService: FolderService
    ) {
        super();
    }

    ngOnInit() {
        this.subscriptions.push(
            this._folderService.folder$.subscribe(folders => {
                // Make an indented list
                this.folders = folders.all;
            }));

        // Get all folders
        this._folderService.getAll();
    }
}

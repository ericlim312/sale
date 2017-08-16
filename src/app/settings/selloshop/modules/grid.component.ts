import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { UnsubscriberComponent } from '../../../core';
import { SelloshopFilesService } from '../files.service';

@Component({
    selector: 'selloshop-grid-module',
    template: require('./grid.component.html')
})

export class SelloshopGridModuleComponent extends UnsubscriberComponent implements OnInit {
    @Input() public editing;

    public files;

    public get rows() {
        let rows = this.editing.settings.rows;
        return Array.from(Array(rows).keys());
    }

    public get cols() {
        let cols = this.editing.settings.cols;
        return Array.from(Array(cols).keys());
    }

    constructor(
        private _route: ActivatedRoute,
        private _filesService: SelloshopFilesService
    ) {
        super();
    }

    get integrationId() {
        return this._route.snapshot.params['id'];
    }

    ngOnInit() {
        if (typeof this.editing.settings !== 'object') {
            this.editing.settings = { rows: 3, cols: 3 };
        }

        this.subscriptions.push(this._filesService.file$.subscribe(files => {
            this.files = files;
        }));
        this._filesService.get(this.integrationId);
    }
}
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { UnsubscriberComponent } from '../../../core';
import { SelloshopFilesService } from '../files.service';

@Component({
    selector: 'selloshop-image-module',
    template: require('./image.component.html')
})

export class SelloshopImageModuleComponent extends UnsubscriberComponent implements OnInit {
    @Input() public editing;

    public files;

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
            this.editing.settings = {};
        }

        this.subscriptions.push(this._filesService.file$.subscribe(files => {
            this.files = files;
        }));
        this._filesService.get(this.integrationId);
    }
}
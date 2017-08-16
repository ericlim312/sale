import {Component, Input, Output, OnInit, EventEmitter} from '@angular/core';
import {DataService} from '../core/data.service';
import {UnsubscriberComponent} from '../core';
import {Angulartics2GoogleAnalytics} from 'angulartics2/src/providers/angulartics2-google-analytics';
import {FileUploader} from '../core/file/all';
import {StatusesService} from './../settings/services';

@Component({
    providers: [StatusesService],
    template: require('./letsdeal.component.html')
})
export class ImportLetsdealComponent extends UnsubscriberComponent implements OnInit {
    public uploader;
    public uploading = false;
    public errors = [];
    public logs = [];
    public success = false;
    public statuses;
    public payload;

    constructor(
        private _dataService: DataService,
        private _statusesService: StatusesService
    ) {
        super();
    }

    upload() {
        this.uploading = true;
        this.uploader.uploadAll();
    }

    ngOnInit() {
        let that = this;

        // Initialize upload
        this.uploader = new FileUploader({
            url: this._dataService.getHost() + 'v4/orders/import',
            headers: this._dataService.getAuthHeaders()
        });

        this.uploader.autoUpload = false;

        this.uploader.onSuccessItem = function(item: any, response: any, status: any, headers: any) {
            that.success = true;
            that.logs = JSON.parse(response).data;
            that.uploading = false;
        };
        this.uploader.onErrorItem = function(item: any, response: any, status: any, headers: any) {
            that.errors = JSON.parse(response).data;
            that.uploading = false;
        };

        this.subscriptions.push(
            this._statusesService.statuses$.subscribe(statuses => {
                this.statuses = statuses;

                if (statuses && statuses.length) {
                    this.selectStatus(statuses[0].id);
                }
            }));
        this._statusesService.get();
    }

    public selectStatus(status) {
        this.payload = JSON.stringify({
            status: Number(status),
            type: 'letsdeal'
        });
    }
}

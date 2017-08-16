import {Component, Input, Output, OnInit, EventEmitter} from '@angular/core';
import {DataService} from '../core/data.service';
import {UnsubscriberComponent} from '../core';
import {Angulartics2GoogleAnalytics} from 'angulartics2/src/providers/angulartics2-google-analytics';
import {FileUploader} from '../core/file/all';

@Component({
    providers: [],
    template: require('./order-xlsx.component.html')
})
export class ImportOrderXlsxComponent extends UnsubscriberComponent implements OnInit {
    public uploader: FileUploader;
    public uploading = false;
    public errors = [];
    public logs = [];
    public success = false;

    constructor(
        private _dataService: DataService
    ) {
        super();
    }

    upload() {
        this.errors = [];
        this.uploading = true;
        this.uploader.uploadAll();
    }

    ngOnInit() {
        let that = this;

        // Initialize upload
        this.uploader = new FileUploader({
            url: this._dataService.getHost() + 'v4/orders/import/xlsx',
            headers: this._dataService.getAuthHeaders()
        });

        this.uploader.autoUpload = false;

        this.uploader.onSuccessItem = function(item: any, response: any, status: any, headers: any) {
            that.success = true;
            that.logs = JSON.parse(response).data;
            that.uploading = false;
            that.errors = [];
        };
        this.uploader.onErrorItem = function(item: any, response: any, status: any, headers: any) {
            that.errors = [ JSON.parse(response).data.message ];
            that.uploading = false;
        };
    }
}

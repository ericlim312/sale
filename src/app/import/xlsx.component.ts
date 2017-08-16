import {Component, Input, Output, OnInit, EventEmitter} from '@angular/core';
import {DataService} from '../core/data.service';
import {UnsubscriberComponent} from '../core';
import {Angulartics2GoogleAnalytics} from 'angulartics2/src/providers/angulartics2-google-analytics';
import {FileUploader} from '../core/file/all';
import {IntegrationService} from './../integration/integration.service';

@Component({
    providers: [IntegrationService],
    template: require('./xlsx.component.html')
})
export class ImportXlsxComponent extends UnsubscriberComponent implements OnInit {
    public uploader: FileUploader;
    public uploading = false;
    public errors = [];
    public logs = [];
    public success = false;

    public options = {
        integrations: {},
        mode: 'create'
    };

    public markets;
    public link = {};

    constructor(
        private _dataService: DataService,
        private _integrationService: IntegrationService
    ) {
        super();
    }

    upload() {
        this.uploading = true;
        this.errors = [];

        this.uploader.options.payload = this.getPayload();
        this.uploader.uploadAll();
    }

    getPayload() {
        return this.options
            ? JSON.stringify(this.options)
            : '{}';
    }

    marketName(market) {
        return this._integrationService.marketName(market);
    }

    integrationsOfType(market) {
        return this._integrationService.integrationsOfType(market);
    }

    ngOnInit() {
        let that = this;

        // Initialize upload
        this.uploader = new FileUploader({
            url: this._dataService.getHost() + 'v4/products/import/xlsx',
            headers: this._dataService.getAuthHeaders()
        });

        this.uploader.autoUpload = false;

        this.uploader.onSuccessItem = function(item: any, response: any, status: any, headers: any) {
            that.success = true;
            that.logs = JSON.parse(response).data;
            that.errors = [];
            that.uploading = false;
        };
        this.uploader.onErrorItem = function(item: any, response: any, status: any, headers: any) {
            that.errors = [ JSON.parse(response).data.message ];
            that.uploading = false;
        };

        this.subscriptions.push(
            this._integrationService.integration$.subscribe(integrations => {
                // Only add the markets we support
                this.markets = this._integrationService.markets().filter(function(value) {
                    return [1, 6, 10, 11, 13].indexOf(value) > -1;
                });

                // Pre-populate links, use the first of every market
                for (let market of this.markets) {
                    this.options.integrations[this.marketName(market).toLowerCase()] = this._integrationService.integrationsOfType(market)[0].id;
                }
            }));
        this._integrationService.get();
    }
}

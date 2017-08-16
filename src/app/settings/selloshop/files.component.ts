import {Component, ViewContainerRef, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {TranslatePipe} from '../../core';
import {AlertService} from '../../core';
import {UnsubscriberComponent} from '../../core';
import {FileUploader} from '../../core/file/all';
import {DataService} from '../../core/data.service';
import {Modal} from 'angular2-modal/plugins/bootstrap';
import {SelloshopFilesService} from './files.service';

@Component({
    selector: 'selloshop-files',
    template: require('./files.component.html')
})
export class SelloshopFilesComponent extends UnsubscriberComponent implements OnInit {
    public uploader: FileUploader;
    public dropActive;
    public files;

    constructor(
        private _route: ActivatedRoute,
        private _alertService: AlertService,
        private _translate: TranslatePipe,
        private _modal: Modal,
        private _viewContainer: ViewContainerRef,
        private _filesService: SelloshopFilesService,
        private _dataService: DataService
    ) {
        super();
    }

    get integrationId() {
        return this._route.snapshot.params['id'];
    }

    hasExtension(filename: string, extensions: string[]) {
        let extension = filename && filename.toLowerCase().split('.').reverse()[0];
        return extensions.indexOf(extension) !== -1;
    }

    ngOnInit() {
        this.subscriptions.push(this._filesService.file$.subscribe(files => {
            this.files = files;
        }));

        this._filesService.get(this.integrationId);

        this._initializeUploader();
    }

    onDropActive(event) {
        this.dropActive = !!event;
    }

    onDelete(id) {
        this._alertService.confirm(
            this._translate.translate('DELETE_FILE_TITLE'),
            this._translate.translate('DELETE_FILE_TEXT'),
            this._translate.translate('BTN_CONFIRM_DELETE'),
            this._translate.translate('BTN_CANCEL'),
            this._modal,
            this._viewContainer
        ).then((resultPromise) => {
            resultPromise.result.then((result) => {
                if (!result) {
                    return;
                }

                this.files = this.files.filter(c => c.id !== id);

                this._filesService.delete(this.integrationId, id).toPromise()
                    .catch(error => this._showUnexpectedError());
            }).catch(() => {});
        });
    }

    private _initializeUploader() {
        // Initialize upload
        let url = `${this._dataService.getHost()}v3/market/selloshop/${this.integrationId}/files`;
        let headers = this._dataService.getAuthHeaders();

        this.uploader = new FileUploader({ url, headers });
        this.uploader.autoUpload = true;
        this.uploader.onSuccessItem = (item: any, response: any, status: any, headers: any) => {
            let newFile = JSON.parse(response).data;
            this.files.push(newFile);
        };
    }

    private _showUnexpectedError() {
        this._alertService.alert(
            this._translate.translate('OOPS'),
            'An unexpected error occurred',
            this._translate.translate('BTN_CLOSE'),
            this._modal,
            this._viewContainer
        );
    }
}

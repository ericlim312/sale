import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FileUploader } from '../core/file/all';
import { DataService } from '../core/data.service';

@Component({
    selector: 'setting-row',
    providers: [
        DataService
    ],
    template: require('./setting-row.component.html'),
    styles: [require('./setting-row.component.scss')]
})
export class SettingRowComponent {
    @Input('name') name;
    @Input('value') value;
    @Input('default') default;
    @Input('type') type;
    @Input('editable') editable;
    @Input('deletable') deletable;
    @Input('error') error;
    @Input('description') description;
    @Input('trueText') trueText;
    @Input('falseText') falseText;
    @Input('uploadUrl') uploadUrl;
    @Output('onSave') onSave = new EventEmitter();

    public uploader: FileUploader;
    public lastupload;

    public processing = false;
    public edit = false;
    public valueText;

    public constructor(
        private _dataService: DataService
    ) {}

    onEdit() {
        this.edit = true;
    }

    save() {
        this.edit = false;
        this.valueText = this.value;
        this.onSave.emit(this.value);
    }

    delete() {
        this.edit = false;
        this.valueText = this.value = '';
        this.onSave.emit(this.value);
    }

    cancel() {
        this.edit = false;
        this.value = this.valueText;
    }

    ngOnInit() {
        if (this.editable === undefined) {
            this.editable = true;
        }

        if (this.value === undefined) {
            this.valueText = this.default;
        } else {
            this.valueText = this.value;
        }

        if (this.uploadUrl) {
            this.uploader = new FileUploader({ url: this.uploadUrl, headers: this._dataService.getAuthHeaders() });
            this.uploader.autoUpload = true;
            this.uploader.onBeforeUploadItem = () => this.processing = true;
            this.uploader.onSuccessItem = (item, response, status, headers) => this.onUploadSuccess(item, response);
            this.lastupload = Date.now();
        }
    }

    onUploadSuccess(item, response) {
        let data = JSON.parse(response).data;
        if (data) { 
            this.value = data.url;
        }

        this.processing = false; 
    }
}

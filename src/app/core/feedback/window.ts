import { Component } from '@angular/core';
import { DialogRef, ModalComponent } from 'angular2-modal';

import { WindowData } from './window-data';
import { DataService } from '../data.service';

@Component({
    selector: 'modal-content',
    template: require('./window.html'),
    styles: [
        `
        .cancel-icon {
            font-size:20pt;
            line-height: 10px;
            color: #999;
            cursor: pointer
        }

        .active {
            color: black;
        }

        .icon-thumb-container {
            margin-right: 5px;
            border-radius: 25px;
            border: 1px solid #999;
            width: 50px;
            height:50px;
            line-height: 50px;
            display: inline-block;
            text-align: center;
            font-size: 16pt;
            cursor: pointer;
        }

        .thumb-column {
            color: #999;
        }

        .thumb-column.active {
            color: black;
        }
        `
    ]
})
export class Window implements ModalComponent<WindowData> {
    context: WindowData;
    public featureName;
    public featureCode;
    public version;
    public validationError:boolean = false;
    public rating:string = '';
    public message:string = '';
    public allowContact:boolean = true;

    constructor(
        public dialog: DialogRef<WindowData>,
        private _dataService:DataService
    ) {
        this.context = dialog.context;
        this.context.size = 'sm';
        this.featureName = this.context.featureName;
        this.featureCode = this.context.featureCode;
        this.version = this.context.version;
    }

    setRating(value:string) {
        this.rating = value;
    }

    beforeDismiss() {
        return false;
    }

    beforeClose() {
        return false;
    }

    onCancel() {
        this.dialog.close();
    }

    onSend() {
        if (this.rating == '') {
            this.validationError = true;
            return;
        } else {
            this._dataService.post('v3/sellofeedback', {
                feature: this.featureCode,
                version: this.version,
                rating: this.rating == 'good' ? 1 : 0,
                message: this.message,
                allowContact: this.allowContact
            }).subscribe(res => {
                console.info("Feedback submitted");
            })
        }

        this.dialog.close();
    }
}
